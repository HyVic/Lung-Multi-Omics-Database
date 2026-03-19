import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { homepageApi, datasetsApi } from "../../api";
import { StatItem, OntologyCoverage, PopularTag, Dataset } from "../../data";
import { Card, Badge } from "../../components/ui";
import ZustandDemo from '../../store/demo'

export default function Index() {
  const [q, setQ] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<null | { name: string; role: string }>(null);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [ontologyCoverage, setOntologyCoverage] = useState<OntologyCoverage[]>([]);
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    homepageApi.getStats().then(setStats);
    homepageApi.getOntologyCoverage().then(setOntologyCoverage);
    homepageApi.getPopularTags().then(setPopularTags);
    datasetsApi.getAll().then(setDatasets);
  }, []);

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
          background:
            "linear-gradient(135deg,#1E293B 0%,#1E40AF 60%,#312E81 100%)",
          padding: "52px 32px 44px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "60vw", margin: "0 auto" }}>
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
              maxWidth: "50vw",
              lineHeight: 1.6,
            }}
          >
            Standardized, ontology-annotated lung multi-omics datasets -
            enabling cross-dataset discovery, aging and disease comparisons.
          </p>

          {/* Search Box */}
          <div style={{ marginTop: 32, maxWidth: "60vw" }}>
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
              {popularTags.map((t) => (
                <button
                  key={t.tag}
                  onClick={() => {
                    setQ(t.tag);
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
                  {t.tag}
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
            {stats.map((stat, i) => (
              <div
                key={i}
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
                <span style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>
                  {i === 0 ? String(datasets.length) : stat.value}
                </span>
                <span style={{ fontSize: 11, color: "#CBD5E1", marginTop: 1 }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ontology Coverage Section */}
      <div
        style={{
          maxWidth: "60vw",
          margin: "28px auto 0",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#374151",
            marginBottom: 14,
            letterSpacing: "0.02em",
          }}
        >
          ONTOLOGY COVERAGE
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {ontologyCoverage.map((o) => (
            <Card
              key={o.id}
              style={{
                borderTop: `3px solid ${o.color}`,
                border: `1px solid ${o.color}33`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13 }}>{o.name}</span>
                <Badge color={o.color}>{o.id}</Badge>
              </div>
              {o.terms.map((t) => (
                <div
                  key={t}
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    padding: "2px 0",
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ color: o.color }}> - </span>
                  {t}
                </div>
              ))}
            </Card>
          ))}
        </div>
        {!user && (
          <div
            style={{
              background: "linear-gradient(135deg,#1E40AF,#312E81)",
              borderRadius: 12,
              padding: "22px 28px",
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
                Ready to contribute data?
              </div>
              <div style={{ fontSize: 13, color: "#BAE6FD", marginTop: 4 }}>
                Register to upload datasets and join the community.
              </div>
            </div>
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: "#fff",
                color: "#1E40AF",
                border: "none",
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Get Started {"->"}
            </button>
          </div>
        )}
      </div>
      <ZustandDemo />
    </div>
  );
}
