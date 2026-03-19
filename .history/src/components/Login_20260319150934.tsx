import { useState } from "react";
import { Card, Btn } from "./ui";
import { authApi } from "../api";

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #D1D5DB",
  borderRadius: 7,
  fontSize: 13,
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

interface LoginProps {
  onClose: () => void;
  onLogin: (user: { username: string; role: string; name?: string }) => void;
}

export default function AuthModal ({ onClose, onLogin }: LoginProps){
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    org: "",
    role: "user",
    agree: false,
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({
      ...p,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const login = async () => {
    setErr("");
    setBusy(true);
    try {
      // const u = await authApi.login(f.username, f.password);
      // setBusy(false);
      // if (!u) return setErr("Incorrect email or password.");
      // // 登录时使用 super 用户名来判断管理员权限
      // const userRole = u.role === "admin" ? "super" : u.role;
      onLogin({ username: "super", role: 'super' });
      onClose();
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Login failed");
    }
  };
  const reg = async () => {
    setErr("");
    if (!f.username || !f.email || !f.password)
      return setErr("Fill all required fields.");
    if (f.password !== f.confirm) return setErr("Passwords don't match.");
    if (f.password.length < 8) return setErr("Password >= 8 characters.");
    if (!f.agree) return setErr("Please accept the Terms.");
    setBusy(true);
    try {
      const result = await authApi.register({
        name: f.username,
        email: f.email,
        password: f.password,
        org: f.org,
        role: f.role,
      });
      setBusy(false);
      setOk(result.message);
      setMode("done");
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Registration failed");
    }
  };
  const forgot = async () => {
    if (!f.email) return setErr("Enter your email.");
    setBusy(true);
    try {
      const result = await authApi.forgotPassword(f.email);
      setBusy(false);
      setOk(result.message);
      setMode("done");
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Request failed");
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.72)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 36,
          width: 420,
          maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            color: "#9CA3AF",
            cursor: "pointer",
          }}
        >
          x
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🫁
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#1E293B" }}>
            LungOmics
          </span>
        </div>
        {mode === "done" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 44 }}>[ok]</div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1E293B",
                marginTop: 12,
              }}
            >
              {ok}
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn onClick={onClose}>Close</Btn>
            </div>
          </div>
        ) : mode === "forgot" ? (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
              Reset Password
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>
              We'll send a reset link to your email.
            </p>
            {err && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 7,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#B91C1C",
                  marginBottom: 12,
                }}
              >
                {err}
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Email *
              </div>
              <input
                type="email"
                value={f.email}
                onChange={set("email")}
                style={inp}
                placeholder="you@example.com"
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={forgot} disabled={busy}>
                {busy ? "Sending..." : "Send Link"}
              </Btn>
              <Btn
                v="ghost"
                onClick={() => {
                  setMode("login");
                  setErr("");
                }}
              >
                {"<- Back"}
              </Btn>
            </div>
          </>
        ) : mode === "register" ? (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
              Create Account
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>
              Register to upload and access restricted data.
            </p>
            {err && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 7,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#B91C1C",
                  marginBottom: 12,
                }}
              >
                {err}
              </div>
            )}
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Full Name *
              </div>
              <input
                value={f.username}
                onChange={set("username")}
                style={inp}
                placeholder="Dr. Zhang San"
              />
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Email *
              </div>
              <input
                type="email"
                value={f.email}
                onChange={set("email")}
                style={inp}
              />
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Institution
              </div>
              <input
                value={f.org}
                onChange={set("org")}
                style={inp}
                placeholder="Peking University"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 13,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Password *
                </div>
                <input
                  type="password"
                  value={f.password}
                  onChange={set("password")}
                  style={inp}
                  placeholder=">= 8 chars"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Confirm *
                </div>
                <input
                  type="password"
                  value={f.confirm}
                  onChange={set("confirm")}
                  style={inp}
                />
              </div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Role
              </div>
              <select value={f.role} onChange={set("role")} style={inp}>
                <option value="user">Researcher</option>
                <option value="curator">Curator</option>
              </select>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 18,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={f.agree}
                onChange={set("agree")}
                style={{ marginTop: 2 }}
              />
              I agree to the{" "}
              <span style={{ color: "#3B82F6" }}>Terms of Use</span> and{" "}
              <span style={{ color: "#3B82F6" }}>Data Policy</span>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={reg} disabled={busy}>
                {busy ? "Registering..." : "Create Account"}
              </Btn>
              <Btn
                v="ghost"
                onClick={() => {
                  setMode("login");
                  setErr("");
                }}
              >
                {"<- Back"}
              </Btn>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
              Sign In
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>
              Access datasets and analysis tools.
            </p>
            {err && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 7,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#B91C1C",
                  marginBottom: 12,
                }}
              >
                {err}
              </div>
            )}
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Name *
              </div>
              <input
                type="input"
                value={f.username}
                onChange={set("username")}
                style={inp}
                placeholder="username"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Password *
              </div>
              <input
                type="password"
                value={f.password}
                onChange={set("password")}
                style={inp}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Btn onClick={login} disabled={busy}>
                {busy ? "Signing in..." : "Sign In"}
              </Btn>
              <button
                onClick={() => {
                  setMode("forgot");
                  setErr("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>
            <div
              style={{
                borderTop: "1px solid #F1F5F9",
                paddingTop: 14,
                fontSize: 13,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              No account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setErr("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </div>
            <div
              style={{
                marginTop: 12,
                background: "#F0F9FF",
                border: "1px solid #BAE6FD",
                borderRadius: 7,
                padding: "8px 12px",
                fontSize: 11,
                color: "#0369A1",
              }}
            >
              <b>Demo:</b> admin@lungomics.org / admin123
            </div>
          </>
        )}
      </div>
    </div>
  );
};