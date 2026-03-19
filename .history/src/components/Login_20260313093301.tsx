import { useState } from "react";
import { Card, Btn } from "./ui";

interface LoginProps {
  onClose: () => void;
  onLogin: (user: { name: string; role: string }) => void;
}

export default function Login({ onClose, onLogin }: LoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      // Mock login - accept any email/password for demo
      if (email && password) {
        onLogin({ name: email.split("@")[0], role: "user" });
        onClose();
      } else {
        setError("Please enter email and password");
      }
    } else {
      // Mock register
      if (email && password && name) {
        onLogin({ name, role: "user" });
        onClose();
      } else {
        setError("Please fill all fields");
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <Card
        onClick={() => {}}
        style={{
          width: 360,
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 12px",
            }}
          >
            🫁
          </div>
          <h3 style={{ margin: 0, fontSize: 18, color: "#1E293B" }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>
            {mode === "login"
              ? "Sign in to access your account"
              : "Join LungOmics to contribute data"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <Btn type="submit" full>
            {mode === "login" ? "Sign In" : "Create Account"}
          </Btn>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#9CA3AF",
          }}
        >
          ×
        </button>
      </Card>
    </div>
  );
}
