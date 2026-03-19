// Ontology constants for the Lung LMOD-ILD application

export const ONT: {
  species: Record<string, { id: string }>;
  tissues: Record<string, { id: string }>;
  omics: Record<string, { id: string; cat: string; color: string }>;
  diseases: Record<string, { id: string; color: string }>;
} = {
  species: {
    Human: { id: "NCBITaxon:9606" },
    Mouse: { id: "NCBITaxon:10090" },
  },
  tissues: {
    Lung: { id: "UBERON:0002048" },
    Airway: { id: "UBERON:0001005" },
    Bronchus: { id: "UBERON:0002185" },
    Trachea: { id: "UBERON:0003126" },
    Alveolus: { id: "UBERON:0002299" },
  },
  omics: {
    "bulk RNA-seq": {
      id: "OBI:0001271",
      cat: "Transcriptomics",
      color: "#3B82F6",
    },
    "scRNA-seq": {
      id: "OBI:0002631",
      cat: "Transcriptomics",
      color: "#8B5CF6",
    },
    "ATAC-seq": { id: "OBI:0002039", cat: "Epigenomics", color: "#10B981" },
    Proteomics: { id: "OBI:0000615", cat: "Proteomics", color: "#F59E0B" },
  },
  diseases: {
    Health: { id: "PATO:0000461", color: "#10B981" },
    COPD: { id: "MONDO:0005002", color: "#EF4444" },
    IPF: { id: "MONDO:0008345", color: "#F97316" },
    "COVID-19": { id: "MONDO:0100096", color: "#8B5CF6" },
  },
};
