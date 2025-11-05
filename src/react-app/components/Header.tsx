import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Header.css";

export function Header() {
  const { user, signIn, signOut } = useAuth();

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    } else {
      await signIn();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          The Conversation
        </Link>
        <nav className="header-nav">
          {user ? (
            <>
              <span className="header-user">{user.displayName || user.email}</span>
              <button className="header-auth-btn" onClick={handleAuthClick}>Sign out</button>
            </>
          ) : (
            <button className="header-auth-btn" onClick={handleAuthClick}>Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
}
