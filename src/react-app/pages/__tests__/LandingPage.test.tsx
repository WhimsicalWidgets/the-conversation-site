import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LandingPage } from "../LandingPage";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { vi } from "vitest";
import type { User } from "firebase/auth";

// Mock the useCreateConversation hook to avoid initializing Firebase in tests
vi.mock("../../hooks/useCreateConversation", () => ({
  useCreateConversation: () => ({
    createConversation: vi.fn().mockResolvedValue("/c/test-hash"),
    loading: false,
    error: null,
  }),
}));

function renderWithAuth(value: Partial<AuthContextType>) {
  const defaultValue: AuthContextType = {
    user: null,
    loading: false,
    signIn: async () => {},
    signOut: async () => {},
  };

  return render(
    <AuthContext.Provider value={{ ...defaultValue, ...value }}>
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("LandingPage", () => {
  it("shows sign in CTA when unauthenticated", () => {
    renderWithAuth({ user: null });
    expect(screen.getByText(/sign in to start/i)).toBeInTheDocument();
  });

  it("shows start conversation CTA when authenticated", () => {
    const mockUser = { uid: "123", displayName: "Test User", email: "test@example.com" } as unknown as User;
    renderWithAuth({ user: mockUser });
    expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();
  });
});
