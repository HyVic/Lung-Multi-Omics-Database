import { Card } from "../../components/ui";

export default function Architecture() {
  return (
    <div style={{ maxWidth: 860, margin: "24px auto", padding: "0 24px" }}>
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
      {[
        {
          title: "1. Ontology Layer",
          color: "#8B5CF6",
          items: [
            "UBERON - Anatomy (Lung->Airway->Bronchus/Trachea)",
            "CL - Cell types (ciliated, goblet, club cells)",
            "OBI - Assay types (bulk RNA-seq, scRNA-seq, ATAC-seq)",
            "MONDO - Diseases (COPD, IPF, COVID-19)",
            "HSAPDV - Human developmental/life stages",
          ],
        },
        {
          title: "2. Authentication & Roles",
          color: "#3B82F6",
          items: [
            "JWT tokens + bcrypt password hashing",
            "3 roles: admin / curator / user",
            "Forgot password email reset flow",
            "Pending approval for new registrations",
            "ORCID / institutional SSO (planned)",
          ],
        },
        {
          title: "3. Dataset Detail & Explorer",
          color: "#10B981",
          items: [
            "Integrated tab layout: Overview / Samples / Analysis / Download",
            "Overview: metadata, top DEGs, sample distribution, file list",
            "Samples: searchable table with RIN/reads/source + age scatter strip",
            "Analysis: Volcano plot, FPKM heatmap, DEG table with gene search",
            "Download: controlled vs open access with formal request form",
          ],
        },
        {
          title: "4. Data Access Control",
          color: "#F59E0B",
          items: [
            "Two access tiers: Open Access (metadata, processed) vs Controlled Access (raw data)",
            "Download request form: purpose, institution, data use agreement",
            "Custodian review workflow with email notification",
            "Audit log of all data access requests",
          ],
        },
        {
          title: "5. Bioinformatics Tools",
          color: "#EF4444",
          items: [
            "DEG Filter: fold-change + p-value threshold filtering",
            "GO Enrichment: quick gene set GO-BP analysis",
            "GC Content Calculator: nucleotide composition from DNA/RNA sequence",
            "FPKM/TPM Converter: raw count normalization",
            "P-value Correction: Benjamini-Hochberg FDR adjustment",
            "Planned: UMAP Viewer, Survival Analysis, Co-expression Network",
          ],
        },
      ].map((s, i) => (
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
