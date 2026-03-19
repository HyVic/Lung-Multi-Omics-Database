import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ONT } from "../../constants/ontology";
import { Card, Badge, SecTitle, SDot, OTag } from "../../components/ui";
import { AgeHistogram, Volcano, Heatmap } from "../../components/charts";
import { INIT_DS, type DatasetFile } from "../../data/datasets";

// Placeholder DownloadModal component - declared outside
function DownloadModal({ file, onClose, onSubmit }: {
  file: DatasetFile;
  onClose: () => void;
  onSubmit: (req: unknown) => void;
}) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        maxWidth: 400,
        width: "90%",
      }}>
        <h3>Download Request</h3>
        <p>Request download for: {file.name}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #D1D5DB", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSubmit({ file })} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#3B82F6", color: "#fff", cursor: "pointer" }}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default function DataSetsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dtab, setDtab] = useState("overview");
  const [sSearch, setSSearch] = useState("");
  const [sGroup, setSGroup] = useState("All");
  const [dlFile, setDlFile] = useState<DatasetFile | null>(null);
  const [geneSearch, setGeneSearch] = useState("");

  const ds = INIT_DS.find((d) => d.id === id);
  if (!ds) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Dataset not found</h2>
        <button onClick={() => navigate("/datasets")}>Back to Datasets</button>
      </div>
    );
  }

  const user = null;
  const onBack = () => navigate("/datasets");
  const onDownloadRequest = (req: unknown) => {
    console.log("Download request:", req);
  };

  const color = ONT.omics[ds.omicsType]?.color || "#3B82F6";

  const filteredSamples = ds.samples_meta.filter((s) => {
    if (sGroup !== "All" && s.group !== sGroup) return false;
    if (sSearch && !s.id.toLowerCase().includes(sSearch.toLowerCase()))
      return false;
    return true;
  });

  const filteredDegs = ds.degs.filter(
    (d) =>
      !geneSearch || d.gene.toLowerCase().includes(geneSearch.toLowerCase()),
  );

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #D1D5DB",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
  };

  const DTABS = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "samples", label: "Samples", icon: "👥" },
    { id: "analysis", label: "Analysis", icon: "📊" },
    { id: "download", label: "Download", icon: "[dl]" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      {dlFile && (
        <DownloadModal
          file={dlFile}
          onClose={() => setDlFile(null)}
          onSubmit={(req) => {
            onDownloadRequest(req);
            setDlFile(null);
          }}
        />
      )}

      {/* Dataset header */}
      <div
        style={{
          background: "linear-gradient(135deg,#1E293B 0%,#1E40AF 70%)",
          padding: "28px 32px 0",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "60vw", margin: "0 auto" }}>
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#BAE6FD",
              padding: "5px 14px",
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {"<- Back to Datasets"}
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                <Badge color={color}>{ds.omicsType}</Badge>
                <SDot s={ds.status} />
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{ds.id}</span>
              </div>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: 22,
                  fontWeight: 800,
                  lineHeight: 1.3,
                }}
              >
                {ds.name}
              </h1>
              <p
                style={{
                  margin: "0 0 12px",
                  color: "#BAE6FD",
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxWidth: "50vw",
                }}
              >
                {ds.description}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <OTag
                  term={`Species: ${ds.species}`}
                  id={ONT.species[ds.species]?.id}
                />
                <OTag
                  term={`Tissue: ${ds.tissue}`}
                  id={ONT.tissues[ds.tissue]?.id}
                />
                <OTag
                  term={`Assay: ${ds.omicsType}`}
                  id={ONT.omics[ds.omicsType]?.id}
                />
                <OTag
                  term={`Disease: ${ds.disease}`}
                  id={ONT.diseases[ds.disease]?.id}
                />
              </div>
              {ds.citation && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    fontStyle: "italic",
                  }}
                >
                  📖 {ds.citation}
                </div>
              )}
            </div>
            {/* Quick stats */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                [ds.samples_meta.length, "Samples", "#60A5FA"],
                [ds.degs.length, "DEGs", "#F472B6"],
                [ds.files?.length || 0, "Files", "#34D399"],
              ].map(([v, l, c]) => (
                <div
                  key={l}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 10,
                    padding: "12px 18px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 26, fontWeight: 800, color: c as string }}>
                    {v}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 8 }}>
            {DTABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setDtab(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: dtab === t.id ? "#fff" : "#64748B",
                  fontWeight: dtab === t.id ? 700 : 400,
                  fontSize: 13,
                  padding: "12px 18px",
                  cursor: "pointer",
                  borderBottom:
                    dtab === t.id
                      ? "2px solid #60A5FA"
                      : "2px solid transparent",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: "60vw", margin: "24px auto", padding: "0 24px" }}>
        {/* -- OVERVIEW -- */}
        {dtab === "overview" && (
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}
          >
            <div>
              <Card style={{ marginBottom: 16 }}>
                <SecTitle>DATASET INFORMATION</SecTitle>
                {[
                  ["Accession", ds.accession || "-"],
                  ["Source", ds.source],
                  ["Cell Type", ds.cells || "-"],
                  ["Uploaded by", ds.uploader],
                  ["Upload Date", ds.uploadDate],
                  ["Comparison", "Old (age>=50) vs Young (age<=40)"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      padding: "7px 0",
                      borderBottom: "1px solid #F1F5F9",
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        width: 120,
                        color: "#6B7280",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {k}
                    </span>
                    <span style={{ color: "#1E293B" }}>{v}</span>
                  </div>
                ))}
              </Card>

              <Card>
                <SecTitle>TOP DIFFERENTIALLY EXPRESSED GENES</SecTitle>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  <Volcano degs={ds.degs} width={280} height={190} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    {ds.degs.slice(0, 5).map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "5px 0",
                          borderBottom: "1px solid #F8FAFC",
                        }}
                      >
                        <span
                          style={{
                            width: 70,
                            fontSize: 12,
                            fontWeight: 700,
                            fontStyle: "italic",
                            color: "#1E293B",
                          }}
                        >
                          {d.gene}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            background: "#F1F5F9",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width:
                                Math.min((Math.abs(d.logFC) / 6) * 100, 100) +
                                "%",
                              background:
                                d.direction === "up" ? "#EF4444" : "#3B82F6",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: d.direction === "up" ? "#EF4444" : "#3B82F6",
                            fontWeight: 600,
                            width: 36,
                            textAlign: "right",
                          }}
                        >
                          {d.logFC > 0 ? "+" : ""}
                          {d.logFC.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card style={{ marginBottom: 16 }}>
                <SecTitle>SAMPLE DISTRIBUTION</SecTitle>
                <AgeHistogram samples={ds.samples_meta} />
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  {["Young", "Old"].map((g) => {
                    const n = ds.samples_meta.filter(
                      (s) => s.group === g,
                    ).length;
                    const c = g === "Young" ? "#3B82F6" : "#F97316";
                    return (
                      <div
                        key={g}
                        style={{
                          flex: 1,
                          background: c + "11",
                          border: `1px solid ${c}33`,
                          borderRadius: 8,
                          padding: "10px 12px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{ fontSize: 22, fontWeight: 800, color: c }}
                        >
                          {n}
                        </div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>
                          {g} samples
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card style={{ marginBottom: 16 }}>
                <SecTitle>FILES AVAILABLE</SecTitle>
                {(ds.files || []).map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 0",
                      borderBottom: "1px solid #F1F5F9",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1E293B",
                        }}
                      >
                        {f.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {f.type} - {f.size}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (user) {
                          setDlFile(f);
                        } else alert("Please sign in to request data access.");
                      }}
                      style={{
                        background: "none",
                        border: "1px solid #D1D5DB",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 11,
                        cursor: "pointer",
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      [dl]
                    </button>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* -- SAMPLES -- */}
        {dtab === "samples" && (
          <div>
            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                value={sSearch}
                onChange={(e) => setSSearch(e.target.value)}
                placeholder="🔍  Search sample ID..."
                style={{ ...inp, width: 200, padding: "7px 12px" }}
              />
              {["All", "Young", "Old"].map((g) => (
                <button
                  key={g}
                  onClick={() => setSGroup(g)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    background:
                      sGroup === g
                        ? g === "Young"
                          ? "#3B82F6"
                          : g === "Old"
                            ? "#F97316"
                            : "#374151"
                        : "#fff",
                    color: sGroup === g ? "#fff" : "#374151",
                    border: `1px solid ${sGroup === g ? (g === "Young" ? "#3B82F6" : g === "Old" ? "#F97316" : "#374151") : "#D1D5DB"}`,
                  }}
                >
                  {g}
                </button>
              ))}
              <span
                style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280" }}
              >
                {filteredSamples.length} samples shown
              </span>
            </div>

            {/* Summary cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[
                ["Total Samples", ds.samples_meta.length, "#3B82F6"],
                [
                  "Young (21-40yr)",
                  ds.samples_meta.filter((s) => s.group === "Young").length,
                  "#60A5FA",
                ],
                [
                  "Old (41-57yr)",
                  ds.samples_meta.filter((s) => s.group === "Old").length,
                  "#F97316",
                ],
                [
                  "Avg Age",
                  Math.round(
                    ds.samples_meta.reduce((a, s) => a + s.age, 0) /
                      ds.samples_meta.length,
                  ) + "yr",
                  "#8B5CF6",
                ],
              ].map(([l, v, c]) => (
                <Card
                  key={l}
                  style={{ textAlign: "center", padding: "14px 10px" }}
                >
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#6B7280" }}>
                    {v}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>
                    {l}
                  </div>
                </Card>
              ))}
            </div>

            {/* Sample table */}
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[
                      "Sample ID",
                      "Group",
                      "Age",
                      "Sex",
                      "Tissue",
                      "Disease",
                      "RNA Integrity",
                      "Reads",
                      "Source",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#6B7280",
                          borderBottom: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.map((s, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        background: i % 2 === 0 ? "#fff" : "#FAFBFC",
                      }}
                    >
                      <td
                        style={{
                          padding: "9px 14px",
                          fontWeight: 700,
                          color: "#1E293B",
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                      >
                        {s.id}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        <Badge
                          color={s.group === "Young" ? "#3B82F6" : "#F97316"}
                          sm
                        >
                          {s.group}
                        </Badge>
                      </td>
                      <td style={{ padding: "9px 14px", color: "#374151" }}>
                        {s.age} yr
                      </td>
                      <td style={{ padding: "9px 14px", color: "#374151" }}>
                        {s.sex === "F" ? "F Female" : "M Male"}
                      </td>
                      <td style={{ padding: "9px 14px", color: "#374151" }}>
                        {s.tissue}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        <Badge
                          color={ONT.diseases[s.disease]?.color || "#10B981"}
                          sm
                        >
                          {s.disease}
                        </Badge>
                      </td>
                      <td style={{ padding: "9px 14px", color: "#374151" }}>
                        RIN {s.rin}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          color: "#374151",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        {s.reads}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          fontSize: 11,
                          color: "#6B7280",
                        }}
                      >
                        {s.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Age scatter strip */}
            <Card style={{ marginTop: 16 }}>
              <SecTitle>AGE DISTRIBUTION - ALL SAMPLES</SecTitle>
              <div
                style={{
                  position: "relative",
                  height: 60,
                  background: "#F8FAFC",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                }}
              >
                {ds.samples_meta.map((s, i) => {
                  const pct = ((s.age - 18) / (60 - 18)) * 100;
                  const c = s.group === "Young" ? "#3B82F6" : "#F97316";
                  return (
                    <div
                      key={i}
                      title={s.id + " (" + s.age + "yr, " + s.group + ")"}
                      style={{
                        position: "absolute",
                        left: pct + "%",
                        top: "50%",
                        transform: "translate(-50%,-50%)",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid #fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        cursor: "default",
                      }}
                    />
                  );
                })}
                {[20, 30, 40, 50, 60].map((a) => (
                  <div
                    key={a}
                    style={{
                      position: "absolute",
                      left: `${((a - 18) * 100) / (60 - 18)}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "#E2E8F0",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: 2,
                        fontSize: 9,
                        color: "#9CA3AF",
                      }}
                    >
                      {a}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "#3B82F6" }}>* Young</span>
                <span style={{ fontSize: 11, color: "#F97316" }}>* Old</span>
                <span
                  style={{ fontSize: 11, color: "#9CA3AF", marginLeft: "auto" }}
                >
                  Hover for sample info
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* -- ANALYSIS -- */}
        {dtab === "analysis" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <Card>
                <SecTitle>🌋 VOLCANO PLOT - OLD vs YOUNG</SecTitle>
                <Volcano degs={ds.degs} width={340} height={220} />
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
                  {ds.degs.filter((d) => d.fdr < 0.05).length} significant DEGs
                  (FDR &lt; 0.05) -{" "}
                  <span style={{ color: "#EF4444" }}>
                    ^{" "}
                    {
                      ds.degs.filter(
                        (d) => d.direction === "up" && d.fdr < 0.05,
                      ).length
                    }{" "}
                    up
                  </span>{" "}
                  -{" "}
                  <span style={{ color: "#3B82F6" }}>
                    v{" "}
                    {
                      ds.degs.filter(
                        (d) => d.direction === "down" && d.fdr < 0.05,
                      ).length
                    }{" "}
                    down
                  </span>
                </div>
              </Card>
              <Card>
                <SecTitle>🔥 EXPRESSION HEATMAP (FPKM, log2)</SecTitle>
                {ds.fpkm_genes.length > 0 ? (
                  <Heatmap genes={ds.fpkm_genes} nSamples={14} />
                ) : (
                  <div style={{ color: "#9CA3AF", fontSize: 13, padding: 20 }}>
                    No expression data
                  </div>
                )}
              </Card>
            </div>

            {/* DEG table with search */}
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <SecTitle style={{ margin: 0 }}>
                  📋 DIFFERENTIALLY EXPRESSED GENES
                </SecTitle>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={geneSearch}
                    onChange={(e) => setGeneSearch(e.target.value)}
                    placeholder="Search gene..."
                    style={{ ...inp, width: 160, padding: "6px 10px" }}
                  />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {filteredDegs.length} genes
                  </span>
                </div>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[
                      "Gene",
                      "log2FC",
                      "logCPM",
                      "P-value",
                      "FDR",
                      "Direction",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#6B7280",
                          borderBottom: "1px solid #E2E8F0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDegs.map((d, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        background:
                          d.fdr < 0.05
                            ? d.direction === "up"
                              ? "#FFF5F5"
                              : "#EFF6FF"
                            : "#fff",
                      }}
                    >
                      <td
                        style={{
                          padding: "7px 12px",
                          fontWeight: 700,
                          fontStyle: "italic",
                          color: "#1E293B",
                        }}
                      >
                        {d.gene}
                      </td>
                      <td
                        style={{
                          padding: "7px 12px",
                          color: d.logFC > 0 ? "#EF4444" : "#3B82F6",
                          fontWeight: 700,
                        }}
                      >
                        {d.logFC > 0 ? "+" : ""}
                        {d.logFC.toFixed(3)}
                      </td>
                      <td style={{ padding: "7px 12px", color: "#6B7280" }}>
                        {d.logCPM?.toFixed(2) || "-"}
                      </td>
                      <td
                        style={{
                          padding: "7px 12px",
                          fontFamily: "monospace",
                          color: "#6B7280",
                          fontSize: 11,
                        }}
                      >
                        {d.pval.toExponential(2)}
                      </td>
                      <td
                        style={{
                          padding: "7px 12px",
                          fontWeight: 700,
                          color:
                            d.fdr < 0.001
                              ? "#059669"
                              : d.fdr < 0.05
                                ? "#D97706"
                                : "#9CA3AF",
                        }}
                      >
                        {d.fdr.toFixed(5)}
                      </td>
                      <td style={{ padding: "7px 12px" }}>
                        <Badge
                          color={d.direction === "up" ? "#EF4444" : "#3B82F6"}
                          sm
                        >
                          {d.direction === "up"
                            ? "^ Up-regulated"
                            : "v Down-regulated"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* -- DOWNLOAD -- */}
        {dtab === "download" && (
          <div style={{ maxWidth: "50vw" }}>
            <Card style={{ marginBottom: 16 }}>
              <SecTitle>DATA ACCESS POLICY</SecTitle>
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 13,
                  color: "#92400E",
                  lineHeight: 1.7,
                }}
              >
                📋 <b>Controlled Access.</b> Raw sequencing files and certain
                processed datasets require a formal data access request.
                Requests are reviewed by the data custodian within 3-5 business
                days. By downloading, you agree to cite the original publication
                and use data only for non-commercial research purposes.
              </div>
            </Card>

            <Card>
              <SecTitle>AVAILABLE FILES</SecTitle>
              {!user && (
                <div
                  style={{
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 16,
                    fontSize: 13,
                    color: "#0369A1",
                  }}
                >
                  i Please{" "}
                  <button
                    onClick={() => {}}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3B82F6",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    sign in
                  </button>{" "}
                  to request data access.
                </div>
              )}
              {(ds.files || []).map((f, i) => {
                const needsRequest = [
                  "Raw Counts",
                  "Expression Matrix",
                ].includes(f.type);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 0",
                      borderBottom: "1px solid #F1F5F9",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background:
                            f.format === "xlsx"
                              ? "#EFF6FF"
                              : f.format === "h5"
                                ? "#FEF3C7"
                                : "#F0FDF4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        {f.format === "xlsx"
                          ? "📊"
                          : f.format === "h5"
                            ? "🗜"
                            : "📋"}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1E293B",
                          }}
                        >
                          {f.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6B7280",
                            marginTop: 1,
                          }}
                        >
                          {f.type} - {f.size} - .{f.format}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {needsRequest && (
                        <Badge color="#F59E0B" sm>
                          Controlled Access
                        </Badge>
                      )}
                      {!needsRequest && (
                        <Badge color="#10B981" sm>
                          Open Access
                        </Badge>
                      )}
                      <button
                        onClick={() => {
                          if (!user) {
                            alert("Please sign in first.");
                            return;
                          }
                          if (needsRequest) setDlFile(f);
                          else alert(`Downloading ${f.name}...`);
                        }}
                        style={{
                          background: needsRequest
                            ? "linear-gradient(135deg,#F59E0B,#D97706)"
                            : "linear-gradient(135deg,#10B981,#059669)",
                          color: "#fff",
                          border: "none",
                          padding: "7px 16px",
                          borderRadius: 7,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {needsRequest ? "📬 Request Access" : "[dl] Download"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </Card>

            <Card style={{ marginTop: 16 }}>
              <SecTitle>CITATION</SecTitle>
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 13,
                  color: "#374151",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {ds.citation || "Citation information not available."}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#6B7280" }}>
                Accession: <b>{ds.accession}</b> - Source: <b>{ds.source}</b>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};