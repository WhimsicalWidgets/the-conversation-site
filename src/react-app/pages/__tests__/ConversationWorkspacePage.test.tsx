import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ConversationWorkspacePage } from "../ConversationWorkspacePage";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { User } from "firebase/auth";

// Create mock return values
const mockUseConversationReturn = {
  conversation: null,
  loading: true,
  error: null,
  notFound: false,
  permissionDenied: false,
};

const mockUseContributionsReturn = {
  contributions: [],
  loading: false,
};

// Mock the hooks module
vi.mock("../../hooks", () => ({
  useAuth: vi.fn(),
  useConversation: vi.fn(() => mockUseConversationReturn),
  useContributions: vi.fn(() => mockUseContributionsReturn),
  createContribution: vi.fn(),
  updateConversationTitle: vi.fn(),
}));

// Import after mocking
const hooks = await import("../../hooks");

function renderWithAuth(conversationId: string = "test-hash-123", authUser: Partial<AuthContextType> = {}) {
  const defaultValue: AuthContextType = {
    user: { uid: "owner-123", displayName: "Owner User", email: "owner@example.com" } as unknown as User,
    loading: false,
    signIn: async () => {},
    signOut: async () => {},
    ...authUser,
  };

  // Mock useAuth to return the auth value
  vi.mocked(hooks.useAuth).mockReturnValue(defaultValue);

  return render(
    <AuthContext.Provider value={defaultValue}>
      <MemoryRouter initialEntries={[`/c/${conversationId}`]}>
        <Routes>
          <Route path="/c/:conversationIdOrSlug" element={<ConversationWorkspacePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("ConversationWorkspacePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset to default values
    mockUseContributionsReturn.contributions = [];
    mockUseContributionsReturn.loading = false;
    
    mockUseConversationReturn.conversation = null;
    mockUseConversationReturn.loading = true;
    mockUseConversationReturn.error = null;
    mockUseConversationReturn.notFound = false;
    mockUseConversationReturn.permissionDenied = false;
  });

  it("shows loading state while fetching conversation", () => {
    mockUseConversationReturn.loading = true;
    mockUseConversationReturn.conversation = null;

    renderWithAuth();
    expect(screen.getByText(/loading conversation/i)).toBeInTheDocument();
  });

  it("shows permission denied message when user lacks access", () => {
    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = null;
    mockUseConversationReturn.permissionDenied = true;
    mockUseConversationReturn.error = new Error("Permission denied");

    renderWithAuth();
    expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
  });

  it("shows not found message when conversation doesn't exist", () => {
    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = null;
    mockUseConversationReturn.notFound = true;
    mockUseConversationReturn.error = new Error("Not found");

    renderWithAuth();
    expect(screen.getByText(/conversation not found/i)).toBeInTheDocument();
  });

  it("displays conversation metadata when loaded by hash ID", async () => {
    const mockConversation = {
      id: "test-hash-123",
      title: "Test Conversation",
      slug: "test-slug",
      ownerUid: "owner-123",
      ownerDisplayName: "Owner User",
      createdAt: { toDate: () => new Date("2024-01-01") },
      updatedAt: { toDate: () => new Date("2024-01-02") },
      participantRoles: {},
    };

    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = mockConversation;

    renderWithAuth("test-hash-123");

    await waitFor(() => {
      expect(screen.getByText("Test Conversation")).toBeInTheDocument();
      expect(screen.getByText("/test-slug")).toBeInTheDocument();
      expect(screen.getByText("test-hash-123")).toBeInTheDocument();
      expect(screen.getByText("Owner User")).toBeInTheDocument();
    });
  });

  it("displays conversation when loaded by slug", async () => {
    const mockConversation = {
      id: "test-hash-123",
      title: "Test Conversation",
      slug: "test-slug",
      ownerUid: "owner-123",
      ownerDisplayName: "Owner User",
      createdAt: { toDate: () => new Date("2024-01-01") },
      updatedAt: { toDate: () => new Date("2024-01-02") },
      participantRoles: {},
    };

    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = mockConversation;

    renderWithAuth("test-slug");

    await waitFor(() => {
      expect(screen.getByText("Test Conversation")).toBeInTheDocument();
      expect(screen.getByText("test-hash-123")).toBeInTheDocument();
    });
  });

  it("shows editable title hint for owners", async () => {
    const mockConversation = {
      id: "test-hash-123",
      title: "Test Conversation",
      slug: null,
      ownerUid: "owner-123",
      ownerDisplayName: "Owner User",
      createdAt: { toDate: () => new Date("2024-01-01") },
      updatedAt: { toDate: () => new Date("2024-01-02") },
      participantRoles: {},
    };

    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = mockConversation;

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText(/click to edit/i)).toBeInTheDocument();
    });
  });

  it("does not show editable title hint for non-owners", async () => {
    const mockConversation = {
      id: "test-hash-123",
      title: "Test Conversation",
      slug: null,
      ownerUid: "different-owner-123",
      ownerDisplayName: "Different Owner",
      createdAt: { toDate: () => new Date("2024-01-01") },
      updatedAt: { toDate: () => new Date("2024-01-02") },
      participantRoles: {},
    };

    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = mockConversation;

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText("Test Conversation")).toBeInTheDocument();
      expect(screen.queryByText(/click to edit/i)).not.toBeInTheDocument();
    });
  });

  it("displays 'No slug yet' when conversation has no slug", async () => {
    const mockConversation = {
      id: "test-hash-123",
      title: "Test Conversation",
      slug: null,
      ownerUid: "owner-123",
      ownerDisplayName: "Owner User",
      createdAt: { toDate: () => new Date("2024-01-01") },
      updatedAt: { toDate: () => new Date("2024-01-02") },
      participantRoles: {},
    };

    mockUseConversationReturn.loading = false;
    mockUseConversationReturn.conversation = mockConversation;

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText("No slug yet")).toBeInTheDocument();
    });
  });
});
