import { useParams, useSearchParams } from "react-router-dom";
import { useAuth, useConversation, useContributions, createContribution, updateConversationTitle } from "../hooks";
import { ContributionList, ContributionComposer, EditableTitle } from "../components";
import { ToneType } from "../types";
import "./ConversationWorkspacePage.css";

type ConversationParams = {
  conversationIdOrSlug?: string;
};

export function ConversationWorkspacePage() {
  const { conversationIdOrSlug } = useParams<ConversationParams>();
  const [searchParams] = useSearchParams();
  const justCreated = searchParams.get("created") === "1";
  const { user } = useAuth();
  const { conversation, loading: conversationLoading, error, notFound, permissionDenied } = useConversation(conversationIdOrSlug);
  const { contributions, loading: contributionsLoading } = useContributions(conversationIdOrSlug);

  const handleSubmitContribution = async (content: string, tone: ToneType | null) => {
    if (!conversationIdOrSlug || !user) {
      throw new Error("User must be authenticated");
    }

    await createContribution({
      conversationId: conversationIdOrSlug,
      content,
      tone,
      authorUid: user.uid,
      authorDisplayName: user.displayName || user.email || "Anonymous",
      conversationTitle: conversation?.title,
      currentSlug: conversation?.slug,
    });
  };

  const handleUpdateTitle = async (conversationId: string, newTitle: string) => {
    await updateConversationTitle(conversationId, newTitle);
    // Trigger a re-fetch by reloading the page
    window.location.reload();
  };

  if (conversationLoading) {
    return (
      <section className="conversation-page">
        <div className="conversation-page__banner conversation-page__banner--info">
          Loading conversation...
        </div>
      </section>
    );
  }

  if (permissionDenied) {
    return (
      <section className="conversation-page">
        <div className="conversation-page__banner conversation-page__banner--error">
          Permission Denied: You don't have permission to view this conversation.
        </div>
      </section>
    );
  }

  if (notFound || !conversation) {
    return (
      <section className="conversation-page">
        <div className="conversation-page__banner conversation-page__banner--warning">
          Conversation Not Found: The requested conversation does not exist.
        </div>
      </section>
    );
  }

  if (error && !conversation) {
    return (
      <section className="conversation-page">
        <div className="conversation-page__banner conversation-page__banner--error">
          Error: {error.message}
        </div>
      </section>
    );
  }

  const isOwner = user?.uid === conversation.ownerUid;
  const displaySlug = conversation.slug || "No slug yet";
  const formattedCreatedAt = conversation.createdAt?.toDate().toLocaleString() || "Unknown";
  const formattedUpdatedAt = conversation.updatedAt?.toDate().toLocaleString() || "Unknown";

  return (
    <section className="conversation-page">
      {justCreated && (
        <div className="conversation-page__banner conversation-page__banner--success">
          Conversation created successfully!
        </div>
      )}
      <div className="conversation-page__header">
        <EditableTitle
          title={conversation.title}
          conversationId={conversation.id}
          isOwner={isOwner}
          onUpdate={handleUpdateTitle}
        />
        {conversation.slug && (
          <p className="conversation-page__slug">/{conversation.slug}</p>
        )}
      </div>

      <div className="conversation-page__meta">
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Hash ID</span>
          <span className="conversation-page__meta-value">{conversation.id}</span>
        </div>
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Slug</span>
          <span className="conversation-page__meta-value">{displaySlug}</span>
        </div>
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Owner</span>
          <span className="conversation-page__meta-value">
            {conversation.ownerDisplayName || conversation.ownerUid}
          </span>
        </div>
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Created</span>
          <span className="conversation-page__meta-value">{formattedCreatedAt}</span>
        </div>
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Updated</span>
          <span className="conversation-page__meta-value">{formattedUpdatedAt}</span>
        </div>
      </div>

      <div className="conversation-page__contributions">
        <h2 className="conversation-page__section-title">Contributions</h2>
        <ContributionList 
          contributions={contributions} 
          loading={contributionsLoading}
        />
        <ContributionComposer 
          onSubmit={handleSubmitContribution}
          disabled={!user}
        />
      </div>
    </section>
  );
}
