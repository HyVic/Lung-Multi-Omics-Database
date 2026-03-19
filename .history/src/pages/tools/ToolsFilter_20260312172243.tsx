  const TOOLS = [
    {
      id: "gene-filter",
      icon: "🧬",
      name: "DEG Filter",
      desc: "Filter gene lists by fold-change and p-value thresholds",
      category: "Expression",
      component: <GeneCalcTool />,
    },
    {
      id: "go-enrich",
      icon: "🔬",
      name: "GO Enrichment",
      desc: "Quick GO biological process enrichment for a gene set",
      category: "Annotation",
      component: <GOTool />,
    },
    {
      id: "gc-calc",
      icon: "🧪",
      name: "GC Content Calculator",
      desc: "Calculate GC%, nucleotide composition, and sequence length",
      category: "Sequence",
      component: <GCTool />,
    },
    {
      id: "fpkm-tpm",
      icon: "📐",
      name: "FPKM / TPM Converter",
      desc: "Convert raw counts to FPKM and TPM normalization",
      category: "Normalization",
      component: <FPKMTool />,
    },
    {
      id: "pval-correct",
      icon: "📊",
      name: "P-value Correction",
      desc: "Apply Benjamini-Hochberg FDR correction to p-value lists",
      category: "Statistics",
      component: <PvalTool />,
    },
    {
      id: "coming1",
      icon: "🗺",
      name: "UMAP Viewer",
      desc: "Visualize single-cell UMAP embeddings (coming soon)",
      category: "Visualization",
      component: null,
    },
    {
      id: "coming2",
      icon: "📈",
      name: "Survival Analysis",
      desc: "Kaplan-Meier survival curves from metadata (coming soon)",
      category: "Clinical",
      component: null,
    },
    {
      id: "coming3",
      icon: "🌐",
      name: "Gene Network",
      desc: "Co-expression gene network visualization (coming soon)",
      category: "Network",
      component: null,
    },
  ];

  const categories = [...new Set(TOOLS.map((t) => t.category))];
  const ACTIVE = activeTool ? TOOLS.find((t) => t.id === activeTool) : null;

  return (
    <div>
          <button
            onClick={() => setActiveTool(null)}
            style={{
              background: "none",
              border: "none",
              color: "#3B82F6",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              marginBottom: 16,
              padding: 0,
            }}
          >
            {"<- Back to Tools"}
          </button>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {ACTIVE.icon}
              </div>
              <div>
                <div
                  style={{ fontSize: 17, fontWeight: 800, color: "#1E293B" }}
                >
                  {ACTIVE.name}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  {ACTIVE.desc}
                </div>
              </div>
              <Badge
                color={ONT.omics["bulk RNA-seq"]?.color || "#3B82F6"}
                style={{ marginLeft: "auto" }}
              >
                {ACTIVE.category}
              </Badge>
            </div>
            {ACTIVE.component}
          </Card>
        </div>
  );
};