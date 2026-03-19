import { Card } from "../../components/ui";

export default function Architecture() {
  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#1E293B" }}>
        System Architecture
      </h1>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
          Platform Overview
        </h3>
        <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
          LungOmics is an ontology-driven multi-omics platform designed for standardized
          lung-related dataset management, analysis, and discovery.
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        <Card>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#3B82F6", marginBottom: 8 }}>
            Data Layer
          </h4>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            MongoDB-backed storage for datasets, samples, and analysis results
          </p>
        </Card>
        <Card>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#10B981", marginBottom: 8 }}>
            API Layer
          </h4>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            RESTful APIs with GraphQL support for flexible data queries
          </p>
        </Card>
        <Card>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#8B5CF6", marginBottom: 8 }}>
            Frontend
          </h4>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            React + TypeScript SPA with responsive design
          </p>
        </Card>
      </div>
    </div>
  );
}
