import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCreateConversation } from "../hooks/useCreateConversation";
import "./LandingPage.css";

export function LandingPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const { createConversation, loading } = useCreateConversation();

  const handlePrimaryClick = async () => {
    if (!user) {
      await signIn();
      return;
    }
    const url = await createConversation();
    navigate(`${url}?created=1`);
  };

  return (
    <section className="landing-page">
      <div className="landing-page__content">
        <h1 className="landing-page__title">Welcome to The Conversation</h1>
        <p className="landing-page__description">
          Start meaningful discussions with your team. Sign in to create a new conversation and jump right in.
        </p>
        <button className="landing-page__cta" onClick={handlePrimaryClick} disabled={loading}>
          {user ? (loading ? "Creating..." : "Start a conversation") : "Sign in to start"}
        </button>
      </div>
    </section>
  );
}
