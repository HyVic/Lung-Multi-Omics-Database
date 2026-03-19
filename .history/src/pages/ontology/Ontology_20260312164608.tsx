import { ONT } from "../../constants/ontology";
import { Card } from "../../components/ui";

export default function Ontology() {
  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#1E293B" }}>
        Ontology Browser
      </h1>

      <div style={{ display: "grid", gap: 24 }}>
        {/* Species */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
            Species
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(ONT.species).map(([name, info]) => (
              <span
                key={name}
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  color: "#16A34A",
                }}
              >
                {name} <span style={{ color: "#6B7280" }}>({info.id})</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Tissues */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
            Tissues
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(ONT.tissues).map(([name, info]) => (
              <span
                key={name}
                style={{
                  background: "#FEF3C7",
                  border: "1px solid #FDE68A",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  color: "#D97706",
                }}
              >
                {name} <span style={{ color: "#6B7280" }}>({info.id})</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Omics Types */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
            Omics Types
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(ONT.omics).map(([name, info]) => (
              <span
                key={name}
                style={{
                  background: info.color + "22",
                  border: `1px solid ${info.color}44`,
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  color: info.color,
                }}
              >
                {name} <span style={{ color: "#6B7280" }}>({info.cat})</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Diseases */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
            Diseases
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(ONT.diseases).map(([name, info]) => (
              <span
                key={name}
                style={{
                  background: info.color + "22",
                  border: `1px solid ${info.color}44`,
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  color: info.color,
                }}
              >
                {name} <span style={{ color: "#6B7280" }}>({info.id})</span>
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
