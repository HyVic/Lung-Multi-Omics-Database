import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INIT_DS } from "../../data/datasets";
import { Card, Badge, SDot } from "../../components/ui";

export default function DataSetsHome() {
  const [tFilter, setTFilter] = useState<string | null>(null);
  const [oFilter, setOFilter] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const datasets = INIT_DS;

  const filtered = datasets.filter((d) => {
    if (tFilter && d.tissue !== tFilter) return false;
    if (oFilter && d.omicsType !== oFilter) return false;
    if (
      q &&
      !d.name.toLowerCase().includes(q.toLowerCase()) &&
      !d.description.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const tissues = [...new Set(datasets.map((d) => d.tissue))];
  const omicsTypes = [...new Set(datasets.map((d) => d.omicsType))];

  return (
    <div
            style={{ maxWidth: 1000, margin: "24px auto", padding: "0 24px" }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                FILTER:
              </span>
              {["Bronchus", "Trachea", "Alveolus"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTFilter(tFilter === t ? null : t)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    background: tFilter === t ? "#3B82F6" : "#fff",
                    color: tFilter === t ? "#fff" : "#374151",
                    border: `1px solid ${tFilter === t ? "#3B82F6" : "#D1D5DB"}`,
                  }}
                >
                  {t}
                </button>
              ))}
              <span style={{ color: "#D1D5DB" }}>|</span>
              {["bulk RNA-seq", "scRNA-seq", "ATAC-seq"].map((o) => (
                <button
                  key={o}
                  onClick={() => setOFilter(oFilter === o ? null : o)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    background:
                      oFilter === o ? ONT.omics[o]?.color || "#3B82F6" : "#fff",
                    color: oFilter === o ? "#fff" : "#374151",
                    border: `1px solid ${oFilter === o ? ONT.omics[o]?.color || "#3B82F6" : "#D1D5DB"}`,
                  }}
                >
                  {o}
                </button>
              ))}
              {(tFilter || oFilter || q) && (
                <button
                  onClick={() => {
                    setTFilter(null);
                    setOFilter(null);
                    setQ("");
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    cursor: "pointer",
                    background: "#FEE2E2",
                    color: "#EF4444",
                    border: "1px solid #FECACA",
                    fontWeight: 600,
                  }}
                >
                  x Clear
                </button>
              )}
              <span
                style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280" }}
              >
                {filtered.length} datasets
              </span>
              {user && (
                <button
                  onClick={() => setShowUp(true)}
                  style={{
                    background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                    border: "none",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Upload
                </button>
              )}
            </div>
            {filtered.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setDetailDS(ds.id)}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderLeft: `4px solid ${ONT.omics[ds.omicsType]?.color || "#3B82F6"}`,
                  borderRadius: 10,
                  padding: 18,
                  marginBottom: 12,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {ds.name}
                      </span>
                      <SDot s={ds.status} />
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {ds.id}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        marginBottom: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {ds.description}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <OTag term={ds.tissue} id={ONT.tissues[ds.tissue]?.id} />
                      <OTag
                        term={ds.species}
                        id={ONT.species[ds.species]?.id}
                      />
                      <Badge
                        color={ONT.omics[ds.omicsType]?.color || "#3B82F6"}
                      >
                        {ds.omicsType}
                      </Badge>
                      <Badge
                        color={ONT.diseases[ds.disease]?.color || "#10B981"}
                      >
                        {ds.disease}
                      </Badge>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginLeft: 16,
                      flexShrink: 0,
                    }}
                  >
                    {[
                      [ds.samples_meta.length, "Samples", "#3B82F6"],
                      [ds.degs.length, "DEGs", "#EF4444"],
                      [ds.files?.length || 0, "Files", "#8B5CF6"],
                    ].map(([v, l, c]) => (
                      <div
                        key={l}
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: 8,
                          padding: "8px 12px",
                          textAlign: "center",
                          minWidth: 52,
                        }}
                      >
                        <div
                          style={{ fontSize: 16, fontWeight: 700, color: c }}
                        >
                          {v}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#9CA3AF",
                            marginTop: 1,
                          }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div
                style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}
              >
                <div style={{ fontSize: 40 }}>🔍</div>
                <div style={{ marginTop: 12, fontSize: 14 }}>
                  No datasets match.
                </div>
              </div>
            )}
          </div>
  );
}
