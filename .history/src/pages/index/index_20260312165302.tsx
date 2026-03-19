import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INIT_DS } from "../../data/datasets";
import { ONT } from "../../constants/ontology";
import { Card } from "../../components/ui";

export default function Index() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const datasets = INIT_DS;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',system-ui,sans-serif",
        background: "#F0F4F8",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg,#1E293B 0%,#1E40AF 60%,#312E81 100%)",
          padding: "52px 32px 44px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              color: "#93C5FD",
              letterSpacing: "0.12em",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            ONTOLOGY-DRIVEN MULTI-OMICS PLATFORM
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            Integrated Lung
            <br />
            Multi-Omics Atlas
          </h1>
          <p
            style={{
              color: "#BAE6FD",
              fontSize: 15,
              marginTop: 14,
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            Standardized, ontology-annotated lung multi-omics datasets -
            enabling cross-dataset discovery, aging and disease comparisons.
          </p>

          {/* Search Box */}
          <div style={{ marginTop: 32, maxWidth: 640 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.97)",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
              }}
            >
              <span
                style={{
                  padding: "0 16px",
                  fontSize: 18,
                  color: "#6B7280",
                  flexShrink: 0,
                }}
              >
                🔍
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q) navigate("/datasets");
                }}
                placeholder="Search genes, datasets, tissues, diseases..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 15,
                  color: "#1E293B",
                  background: "transparent",
                  padding: "17px 0",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => {
                  if (q) navigate("/datasets");
                }}
                style={{
                  margin: 6,
                  padding: "11px 24px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Search
              </button>
            </div>

            {/* Popular Tags */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#93C5FD",
                  fontWeight: 600,
                }}
              >
                Popular:
              </span>
              {["SCGB1A1", "MUC5B", "FOXJ1", "CFTR", "bulk RNA-seq", "Bronchus", "Aging"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setQ(t);
                    navigate("/datasets");
                  }}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#E0F2FE",
                    borderRadius: 20,
                    padding: "3px 11px",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              [String(datasets.length), "Datasets", "#60A5FA"],
              ["28", "Samples", "#34D399"],
              ["14", "Genes", "#F472B6"],
              ["3", "Omics Types", "#FBBF24"],
              ["4", "Ontologies", "#A78BFA"],
            ].map(([v, l, c]) => (
              <div
                key={l}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "10px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 800, color: c }}>
                  {v}
                </span>
                <span style={{ fontSize: 11, color: "#CBD5E1", marginTop: 1 }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ontology Coverage Section */}
      <div style={{ maxWidth: 900, margin: "28px auto 0", padding: "0 24px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 16 }}>
          Ontology Coverage
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {/* Species */}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 8, letterSpacing: "0.05em" }}>
              SPECIES
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.keys(ONT.species).map((s) => (
                <span key={s} style={{ background: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </Card>

          {/* Tissues */}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 8, letterSpacing: "0.05em" }}>
              TISSUES
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.keys(ONT.tissues).map((t) => (
                <span key={t} style={{ background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
          </Card>

          {/* Omics Types */}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 8, letterSpacing: "0.05em" }}>
              OMICS TYPES
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(ONT.omics).map(([name, info]) => (
                <span key={name} style={{ background: info.color + "22", color: info.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                  {name}
                </span>
              ))}
            </div>
          </Card>

          {/* Diseases */}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 8, letterSpacing: "0.05em" }}>
              DISEASES
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(ONT.diseases).map(([name, info]) => (
                <span key={name} style={{ background: info.color + "22", color: info.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                  {name}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
