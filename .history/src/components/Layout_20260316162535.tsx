import { ReactNode, useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "./Login";
import { navigationApi } from "../api";
import { NavItem } from "../data";

// Create user context
interface UserContextType {
  user: { name?: string; username?: string; role: string } | null;
  setUser: (user: { name?: string; username?: string; role: string } | null) => void;
}
const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });

export const useUser = () => useContext(UserContext);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ name?: string; username?: string; role: string } | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    navigationApi.getItems().then(setNavItems);
  }, []);

  const handleLogin = (userInfo: { username: string; role: string }) => {
    setUser({ name: userInfo.username, role: userInfo.role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "overview";
    if (path.startsWith("/datasets")) return "datasets";
    if (path.startsWith("/ontology/tools")) return "tools";
    if (path.startsWith("/ontology")) return "ontology";
    if (path.startsWith("/architecture")) return "architecture";
    // if (path.startsWith("/admin")) return "admin";
    return "overview";
  };

  const activeTab = getActiveTab();

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',system-ui,sans-serif",
        background: "#F0F4F8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Navigation */}
      <div
        style={{
          background: "#1E293B",
          color: "#fff",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: 52,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 200,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginRight: 28,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🫁
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>
            LungOmics
          </span>
          <span
            style={{
              background: "#3B82F6",
              color: "#fff",
              fontSize: 9,
              padding: "1px 5px",
              borderRadius: 3,
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            BETA
          </span>
        </div>

        {navItems.map((tab) => {
          // Hide admin-only tabs from non-admin users
          if (tab.adminOnly && user?.name !== "super") return null;
          return (
            <Link
              key={tab.key}
              to={tab.path}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab.key ? "#60A5FA" : tab.adminOnly ? "#F87171" : "#94A3B8",
                fontWeight: activeTab === tab.key ? 700 : 400,
                fontSize: 13,
                padding: "0 12px",
                height: 52,
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                borderBottom: activeTab === tab.key ? "2px solid #60A5FA" : "2px solid transparent",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
              }}
            >
              {tab.label}
            </Link>
          );
        })}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              {user.name === "super" ? (
                <Link
                  to="/admin"
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none" }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {(user.name || user.username || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: "#E2E8F0" }}>{user.name}</span>
                </Link>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {(user.name || user.username || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: "#E2E8F0" }}>{user.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                border: "none",
                color: "#fff",
                padding: "7px 18px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />}

      {/* Main Content */}
      <div style={{ flex: 1, paddingBottom: 40 }}>
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#1E293B",
          color: "#94A3B8",
          padding: "32px 24px 24px",
          fontSize: 13,
        }}
      >
        <div style={{ maxWidth: "60vw", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              marginBottom: 24,
            }}
          >
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>
                🫁 LungOmics
              </div>
              <div style={{ lineHeight: 1.6 }}>
                Ontology-driven multi-omics platform for lung disease research.
              </div>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>
                Resources
              </div>
              <div style={{ lineHeight: 1.8 }}>
                <div><a href="/datasets" style={{ color: "#94A3B8", textDecoration: "none" }}>Datasets</a></div>
                <div><a href="/ontology" style={{ color: "#94A3B8", textDecoration: "none" }}>Ontology</a></div>
                <div><a href="/ontology/tools" style={{ color: "#94A3B8", textDecoration: "none" }}>Tools</a></div>
              </div>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>
                Community
              </div>
              <div style={{ lineHeight: 1.8 }}>
                <div><a href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>GitHub</a></div>
                <div><a href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>Documentation</a></div>
                <div><a href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>Contact</a></div>
              </div>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>
                Legal
              </div>
              <div style={{ lineHeight: 1.8 }}>
                <div><a href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>Privacy Policy</a></div>
                <div><a href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>Terms of Use</a></div>
                <div><a href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>License</a></div>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid #334155",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>© 2026 LungOmics. All rights reserved.</div>
            <div style={{ display: "flex", gap: 16 }}>
              <span>Built with React</span>
              <span>•</span>
              <span>v1.0.0 Beta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
