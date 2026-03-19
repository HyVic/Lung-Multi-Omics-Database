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
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Filters */}
      <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search datasets..."
          style={{
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: 7,
            fontSize: 13,
            width: 250,
          }}
        />
        <select
          value={tFilter || ""}
          onChange={(e) => setTFilter(e.target.value || null)}
          style={{
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: 7,
            fontSize: 13,
          }}
        >
          <option value="">All Tissues</option>
          {tissues.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={oFilter || ""}
          onChange={(e) => setOFilter(e.target.value || null)}
          style={{
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: 7,
            fontSize: 13,
          }}
        >
          <option value="">All Omics</option>
          {omicsTypes.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Dataset List */}
      <div style={{ display: "grid", gap: 16 }}>
        {filtered.map((ds) => (
          <Card
            key={ds.id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/datasets/${ds.id}`)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>{ds.name}</span>
                  <SDot s={ds.status} />
                </div>
                <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 8px", maxWidth: 600 }}>
                  {ds.description}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge color="#3B82F6">{ds.species}</Badge>
                  <Badge color="#10B981">{ds.tissue}</Badge>
                  <Badge color="#8B5CF6">{ds.omicsType}</Badge>
                  <Badge color="#F59E0B">{ds.disease}</Badge>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#6B7280" }}>
                <div>{ds.samples_meta.length} samples</div>
                <div>{ds.uploadDate}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#6B7280", padding: 40 }}>
          No datasets found
        </div>
      )}
    </div>
  );
}
