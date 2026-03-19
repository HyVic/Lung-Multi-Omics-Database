import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const TABS = [
  { key: "overview", label: "Overview", path: "/" },
  { key: "datasets", label: "Datasets", path: "/datasets" },
  { key: "ontology", label: "Ontology", path: "/ontology" },
  { key: "tools", label: "Tools", path: "/ontology/tools" },
  { key: "architecture", label: "Architecture", path: "/architecture" },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "overview";
    if (path.startsWith("/datasets")) return "datasets";
    if (path.startsWith("/ontology/tools")) return "tools";
    if (path.startsWith("/ontology")) return "ontology";
    if (path.startsWith("/architecture")) return "architecture";
    return "overview";
  };

  const activeTab = getActiveTab();

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',system-ui,sans-serif",
        background: "#F0F4F8",
        minHeight: "100vh",
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

        {TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.path}
            style={{
              background: "none",
              border: "none",
              color: activeTab === tab.key ? "#60A5FA" : "#94A3B8",
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
        ))}

        <div style={{ marginLeft: "auto" }}>
          <button
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
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingBottom: 40 }}>
        {children}
      </div>
    </div>
  );
}
