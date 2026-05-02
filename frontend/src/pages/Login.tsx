import { useState } from "react";
import { login, register } from "../services/api";
import { User } from "../types/auth";

type Props = {
  onAuthSuccess: (token: string, user: User) => void;
};

export default function Login({ onAuthSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        mode === "login" ? await login(email, password) : await register(email, password);
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : mode === "login" ? "Login failed." : "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <img
          src="/truthlensIcon.png"
          alt="TruthLens icon showing the site's real-vs-fake news detection branding"
          className="auth-logo"
        />
        <div>
          <h1 className="title">TruthLens</h1>
          <p className="subtitle">Sign in to keep article history and feedback accuracy tied to your account.</p>
        </div>
      </div>

      <div className="panel auth-panel">
        <div className="auth-mode" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === "login" ? "mode-btn active" : "mode-btn"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "mode-btn active" : "mode-btn"}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <input
          className="text-input"
          placeholder="UserId"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="text-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="primary-btn" onClick={submit} disabled={loading || !email || !password}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
        {error && <p className="danger">{error}</p>}
        <button className="link-btn" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account? Register" : "Already registered? Login"}
        </button>
      </div>
    </div>
  );
}
