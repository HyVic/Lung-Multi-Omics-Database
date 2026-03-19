// Homepage data for the application

export interface StatItem {
  value: string;
  label: string;
  color: string;
}

export const HOMEPAGE_STATS: StatItem[] = [
  { value: "2", label: "Datasets", color: "#60A5FA" },
  { value: "28", label: "Samples", color: "#34D399" },
  { value: "14", label: "Genes", color: "#F472B6" },
  { value: "3", label: "Omics Types", color: "#FBBF24" },
  { value: "4", label: "Ontologies", color: "#A78BFA" },
];

export interface OntologyCoverage {
  name: string;
  id: string;
  terms: string[];
  color: string;
}

export const ONTOLOGY_COVERAGE: OntologyCoverage[] = [
  {
    name: "Anatomy",
    id: "UBERON",
    terms: ["Lung", "Airway", "Bronchus", "Trachea"],
    color: "#3B82F6",
  },
  {
    name: "Cell Type",
    id: "CL",
    terms: ["Ciliated cell", "Goblet cell", "Club cell", "AT2"],
    color: "#8B5CF6",
  },
  {
    name: "Disease",
    id: "MONDO",
    terms: ["COPD", "IPF", "COVID-19", "ARDS"],
    color: "#EF4444",
  },
  {
    name: "Assay",
    id: "OBI",
    terms: ["Bulk RNA-seq", "scRNA-seq", "ATAC-seq", "ChIP-seq"],
    color: "#10B981",
  },
];

export interface PopularTag {
  tag: string;
}

export const POPULAR_TAGS: PopularTag[] = [
  { tag: "SCGB1A1" },
  { tag: "MUC5B" },
  { tag: "FOXJ1" },
  { tag: "CFTR" },
  { tag: "bulk RNA-seq" },
  { tag: "Bronchus" },
  { tag: "Aging" },
];
