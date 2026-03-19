// Initial dataset data for the application
import { mkSamples } from "./users";

export interface DatasetFile {
  name: string;
  size: string;
  type: string;
  format: string;
}

export interface DEG {
  gene: string;
  logFC: number;
  logCPM: number;
  pval: number;
  fdr: number;
  direction: "up" | "down";
}

export interface Sample {
  id: string;
  age: number;
  sex: string;
  group: string;
  tissue: string;
  disease: string;
  source: string;
  rin: string;
  reads: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  species: string;
  tissue: string;
  cells: string;
  omicsType: string;
  disease: string;
  source: string;
  accession: string;
  status: "published" | "review" | "draft";
  accessLevel: "Open" | "Controlled";
  uploader: string;
  uploadDate: string;
  files: DatasetFile[];
  degs: DEG[];
  samples_meta: Sample[];
  fpkm_genes: string[];
  citation: string;
}

export const INIT_DS: Dataset[] = [
  {
    id: "DS001",
    name: "Lung Airway Aging Study - Bronchus",
    description:
      "Bulk RNA-seq profiling of bronchial airway epithelium across different age groups. Samples collected from healthy female donors aged 21-57 years to characterize transcriptomic changes associated with aging.",
    species: "Human",
    tissue: "Bronchus",
    cells: "Airway epithelium",
    omicsType: "bulk RNA-seq",
    disease: "Health",
    source: "GEO",
    accession: "GSE198980",
    status: "published",
    accessLevel: "Open",
    uploader: "Dr. Li Wei",
    uploadDate: "2025-08-14",
    files: [
      {
        name: "BRO_meta_sheet.xlsx",
        size: "42 KB",
        type: "Metadata",
        format: "xlsx",
      },
      {
        name: "BRO_TRA_gene_fpkm.xlsx",
        size: "3.8 MB",
        type: "Expression Matrix",
        format: "xlsx",
      },
      {
        name: "BRO_old_vs_young_DEG.xlsx",
        size: "28 KB",
        type: "DEG Results",
        format: "xlsx",
      },
      {
        name: "BRO_raw_counts.h5",
        size: "218 MB",
        type: "Raw Counts",
        format: "h5",
      },
    ],
    degs: [
      {
        gene: "LGR6",
        logFC: -1.55,
        logCPM: 2.69,
        pval: 3.8e-8,
        fdr: 0.000643,
        direction: "down",
      },
      {
        gene: "TCIM",
        logFC: 2.98,
        logCPM: 2.15,
        pval: 3.6e-7,
        fdr: 0.002909,
        direction: "up",
      },
      {
        gene: "UGT2B7",
        logFC: 3.13,
        logCPM: -0.48,
        pval: 5.2e-7,
        fdr: 0.002909,
        direction: "up",
      },
      {
        gene: "CLDN10",
        logFC: -2.1,
        logCPM: 1.88,
        pval: 1.1e-6,
        fdr: 0.003,
        direction: "down",
      },
      {
        gene: "MMP1",
        logFC: 2.8,
        logCPM: 3.12,
        pval: 2.3e-6,
        fdr: 0.004,
        direction: "up",
      },
      {
        gene: "SCGB1A1",
        logFC: -1.2,
        logCPM: 4.55,
        pval: 5.0e-5,
        fdr: 0.02,
        direction: "down",
      },
    ],
    samples_meta: [
      ...mkSamples("BRO_y", 7, 21, "Young", "Bronchus"),
      ...mkSamples("BRO_o", 7, 41, "Old", "Bronchus"),
    ],
    fpkm_genes: [
      "SCGB3A1",
      "SLPI",
      "SCGB1A1",
      "MUC5B",
      "FOXJ1",
      "DNAI1",
      "CFTR",
      "BPIFB1",
      "LYPD2",
      "C3",
    ],
    citation: "Li W et al. (2025) Transcriptomic landscape of airway aging. Nature Aging.",
  },
  {
    id: "DS002",
    name: "Lung Airway Aging Study - Trachea",
    description:
      "Bulk RNA-seq from tracheal airway epithelium comparing young vs aged healthy donors. Companion dataset to DS001, enabling cross-airway region aging comparison.",
    species: "Human",
    tissue: "Trachea",
    cells: "Airway epithelium",
    omicsType: "bulk RNA-seq",
    disease: "Health",
    source: "GEO",
    accession: "GSE198981",
    status: "published",
    accessLevel: "Open",
    uploader: "Dr. Li Wei",
    uploadDate: "2025-08-14",
    files: [
      {
        name: "TRA_meta_sheet.xlsx",
        size: "41 KB",
        type: "Metadata",
        format: "xlsx",
      },
      {
        name: "BRO_TRA_gene_fpkm.xlsx",
        size: "3.8 MB",
        type: "Expression Matrix",
        format: "xlsx",
      },
      {
        name: "TRA_old_vs_young_DEG.xlsx",
        size: "19 KB",
        type: "DEG Results",
        format: "xlsx",
      },
      {
        name: "TRA_raw_counts.h5",
        size: "204 MB",
        type: "Raw Counts",
        format: "h5",
      },
    ],
    degs: [
      {
        gene: "CXCL2",
        logFC: 2.5,
        logCPM: 3.4,
        pval: 1.5e-7,
        fdr: 0.00145,
        direction: "up",
      },
      {
        gene: "FDCSP",
        logFC: 5.59,
        logCPM: -0.08,
        pval: 1.7e-7,
        fdr: 0.00145,
        direction: "up",
      },
      {
        gene: "CXCL1",
        logFC: 2.1,
        logCPM: 2.88,
        pval: 4.2e-6,
        fdr: 0.008,
        direction: "up",
      },
      {
        gene: "IL8",
        logFC: 1.9,
        logCPM: 4.21,
        pval: 8.3e-6,
        fdr: 0.01,
        direction: "up",
      },
    ],
    samples_meta: [
      ...mkSamples("TRA_y", 7, 21, "Young", "Trachea"),
      ...mkSamples("TRA_o", 7, 41, "Old", "Trachea"),
    ],
    fpkm_genes: [
      "SCGB3A1",
      "SLPI",
      "SCGB1A1",
      "MUC5B",
      "FOXJ1",
      "DNAI1",
      "CFTR",
      "BPIFB1",
      "LYPD2",
      "C3",
    ],
    citation: "Li W et al. (2025) Transcriptomic landscape of airway aging. Nature Aging.",
  },
];
