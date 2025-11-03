import { useParams } from "react-router-dom";
import { useAuth, useConversation, useContributions, createContribution } from "../hooks";
import { ContributionList, ContributionComposer } from "../components";
import { ToneType } from "../types";
import "./ConversationWorkspacePage.css";

type ConversationParams = {
  conversationIdOrSlug?: string;
};

export function ConversationWorkspacePage() {
  const { conversationIdOrSlug } = useParams<ConversationParams>();
  const { user } = useAuth();
  const { conversation, loading: conversationLoading } = useConversation(conversationIdOrSlug);
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

  if (conversationLoading) {
    return (
      <section className="conversation-page">
        <p>Loading conversation...</p>
      </section>
    );
  }

  const conversationLabel = conversationIdOrSlug ?? "unknown conversation";
  const displaySlug = conversation?.slug || "No slug yet";

  return (
    <section className="conversation-page">
      <div className="conversation-page__header">
        <h1 className="conversation-page__title">
          {conversation?.title || "Conversation Workspace"}
        </h1>
        {conversation?.slug && (
          <p className="conversation-page__slug">/{conversation.slug}</p>
        )}
      </div>

      <div className="conversation-page__meta">
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Conversation ID</span>
          <span className="conversation-page__meta-value">{conversationLabel}</span>
        </div>
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Slug</span>
          <span className="conversation-page__meta-value">{displaySlug}</span>
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
