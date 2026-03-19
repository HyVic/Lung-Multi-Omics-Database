// Architecture data for the application

export interface ArchitectureSection {
  title: string;
  color: string;
  items: string[];
}

export const ARCHITECTURE_SECTIONS: ArchitectureSection[] = [
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
];
