import { useState, useEffect } from "react";
import { Card } from "../../components/ui";
import { architectureApi } from "../../api";
import { ArchitectureSection } from "../../data";

export default function Architecture() {
  const [sections, setSections] = useState<ArchitectureSection[]>([]);

  useEffect(() => {
    architectureApi.getSections().then(setSections);
  }, []);

  return (
    <div style={{ maxWidth: "60vw", margin: "24px auto", padding: "0 24px" }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "#1E293B",
          margin: "0 0 6px",
        }}
      >
        System Architecture
      </h2>
      <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 20 }}>
        Full-stack ontology-driven platform with auth, dataset detail pages,
        download control, and online tools.
      </p>
      {sections.map((s, i) => (
        <Card
          key={i}
          style={{
            borderLeft: `4px solid ${s.color}`,
            border: `1px solid ${s.color}33`,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#1E293B",
              marginBottom: 8,
            }}
          >
            {s.title}
          </div>
          {s.items.map((item, j) => (
            <div
              key={j}
              style={{
                fontSize: 13,
                color: "#374151",
                padding: "4px 0",
                borderBottom:
                  j < s.items.length - 1 ? "1px solid #F1F5F9" : "none",
                display: "flex",
                gap: 8,
              }}
            >
              <span style={{ color: s.color, fontWeight: 700 }}> - </span>
              {item}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
