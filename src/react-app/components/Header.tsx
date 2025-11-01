import { Link } from "react-router-dom";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          The Conversation
        </Link>
        <nav className="header-nav">
          <span className="header-nav__placeholder">Future navigation</span>
        </nav>
      </div>
    </header>
  );
}
