import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import { useState } from "react";
import "./App.css";
import { User } from "./types/auth";

export default function App() {
  const [page, setPage] = useState<"home" | "analytics">("home");
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const onAuthSuccess = (nextToken: string, nextUser: User) => {
    localStorage.setItem("auth_token", nextToken);
    localStorage.setItem("auth_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
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
        <div className="spacer" />
        <span className="user-pill">{user.email}</span>
        <button onClick={logout} className="nav-btn">
          Logout
        </button>
      </nav>
      <main className="page-wrap">
        {page === "home" ? <Home token={token} /> : <Analytics token={token} />}
      </main>
    </div>
  );
}