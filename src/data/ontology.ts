// Ontology data for the application

export interface OntologyNode {
  label: string;
  id: string;
  lv: number;
}

export const ONTOLOGY_TREE: OntologyNode[] = [
  { label: "Lung", id: "UBERON:0002048", lv: 0 },
  { label: "Airway", id: "UBERON:0001005", lv: 1 },
  { label: "Bronchus", id: "UBERON:0002185", lv: 2 },
  { label: "Trachea", id: "UBERON:0003126", lv: 2 },
  { label: "Alveolus", id: "UBERON:0002299", lv: 2 },
  { label: "Vasculature", id: "UBERON:0002049", lv: 1 },
  { label: "Pleura", id: "UBERON:0000977", lv: 1 },
];
