import { Card } from "../../components/ui";

export default function Tools() {
  const tools = [
    {
      id: "enrichment",
      name: "Gene Set Enrichment",
      description: "Perform GO and KEGG pathway enrichment analysis",
      icon: "📊",
    },
    {
      id: "conversion",
      name: "ID Conversion",
      description: "Convert between gene identifiers (Ensembl, Entrez, Symbol)",
      icon: "🔄",
    },
    {
      id: "comparison",
      name: "Dataset Comparison",
      description: "Compare gene expression across multiple datasets",
      icon: "📈",
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#1E293B" }}>
        Analysis Tools
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {tools.map((tool) => (
          <Card key={tool.id} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{tool.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
              {tool.name}
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              {tool.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
