import { useParams } from "react-router-dom";
import "./ConversationWorkspacePage.css";

type ConversationParams = {
  conversationIdOrSlug?: string;
};

export function ConversationWorkspacePage() {
  const { conversationIdOrSlug } = useParams<ConversationParams>();
  const conversationLabel = conversationIdOrSlug ?? "unknown conversation";

  return (
    <section className="conversation-page">
      <h1 className="conversation-page__title">Conversation Workspace</h1>
      <p className="conversation-page__description">
        TODO: Build the workspace for reviewing transcripts, highlights, and AI
        insights tied to this conversation.
      </p>
      <div className="conversation-page__meta">
        <span className="conversation-page__meta-label">Conversation ID</span>
        <span className="conversation-page__meta-value">{conversationLabel}</span>
      </div>
    </section>
  );
}
