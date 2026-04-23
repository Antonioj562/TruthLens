import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { useState } from "react";
import "./App.css";
import { User } from "./types/auth";

export default function App() {
  const [page, setPage] = useState<"home" | "analytics" | "admin">("home");
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    return { ...parsed, is_admin: parsed.is_admin ?? false };
  });

  const onAuthSuccess = (nextToken: string, nextUser: User) => {
    localStorage.setItem("auth_token", nextToken);
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ ...nextUser, is_admin: nextUser.is_admin ?? false })
    );
    setToken(nextToken);
    setUser({ ...nextUser, is_admin: nextUser.is_admin ?? false });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <Login onAuthSuccess={onAuthSuccess} />;
  }

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="brand-lockup">
          <img
            src="/truthlensIcon.png"
            alt="TruthLens icon showing the site's real-vs-fake news detection branding"
            className="brand-icon"
          />
          <div className="brand-copy">
            <span className="brand-title">TruthLens</span>
            <span className="brand-tagline">AI text analysis for real vs fake news</span>
          </div>
        </div>
        <button
          onClick={() => setPage("home")}
          className={page === "home" ? "nav-btn active" : "nav-btn"}
        >
          Home
        </button>
        <button
          onClick={() => setPage("analytics")}
          className={page === "analytics" ? "nav-btn active" : "nav-btn"}
        >
          Analytics
        </button>
        {user.is_admin && (
          <button
            onClick={() => setPage("admin")}
            className={page === "admin" ? "nav-btn active" : "nav-btn"}
          >
            Admin
          </button>
        )}
        <div className="spacer" />
        <span className="user-pill">{user.email}</span>
        <button onClick={logout} className="nav-btn">
          Logout
        </button>
      </nav>
      <main className="page-wrap">
        {page === "home" && <Home token={token} />}
        {page === "analytics" && <Analytics token={token} />}
        {page === "admin" && user.is_admin && <Admin token={token} />}
      </main>
    </div>
  );
}
