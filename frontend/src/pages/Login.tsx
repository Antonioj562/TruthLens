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
      <h1 className="title">TruthLens Account</h1>
      <div className="panel">
        <p className="subtitle">Sign in to link article history and accuracy to your account.</p>
        <input
          className="text-input"
          placeholder="Email"
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
