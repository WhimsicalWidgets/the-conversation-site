import { Link } from "react-router-dom";
import "./LandingPage.css";

export function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-page__content">
        <h1 className="landing-page__title">Welcome to The Conversation</h1>
        <p className="landing-page__description">
          TODO: This landing experience will introduce the product, surface
          marketing content, and guide users into the workspace.
        </p>
        <Link className="landing-page__cta" to="/c/sample-conversation">
          Explore a conversation workspace
        </Link>
      </div>
    </section>
  );
}
