// Tools data for the application

export interface Tool {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: string;
  component: string | null;
}

export const TOOLS: Tool[] = [
  {
    id: "enrichment",
    name: "Gene Set Enrichment",
    desc: "Perform GO and KEGG pathway enrichment analysis",
    icon: "📊",
    category: "Analysis",
    component: null,
  },
  {
    id: "conversion",
    name: "ID Conversion",
    desc: "Convert between gene identifiers",
    icon: "🔄",
    category: "Utility",
    component: null,
  },
  {
    id: "comparison",
    name: "Dataset Comparison",
    desc: "Compare gene expression across datasets",
    icon: "📈",
    category: "Analysis",
    component: null,
  },
  {
    id: "visualization",
    name: "Volcano Plot",
    desc: "Interactive volcano plot visualization",
    icon: "🗻",
    category: "Visualization",
    component: null,
  },
];

export const TOOL_CATEGORIES = ["Analysis", "Utility", "Visualization"];
