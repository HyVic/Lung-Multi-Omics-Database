// import { Routes, Route } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import HomePage from './pages/HomePage'
// import StatsPage from './pages/StatsPage'

// export default function App() {
//   return (
//     <div className="max-w-2xl mx-auto px-4 py-6">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/stats" element={<StatsPage />} />
//       </Routes>
//     </div>
//   )
// }
import { useState, useMemo } from "react";

// -------------------------------------------------------------
// ONTOLOGY
// -------------------------------------------------------------
const ONT = {
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

// -------------------------------------------------------------
// DATA
// -------------------------------------------------------------
// -------------------------------------------------------------
// FILE ZONE COMPONENT
// -------------------------------------------------------------
const FileZone = ({ label, field, hint, files, onAddFile }) => {
  const file = field === "degs" ? files.degs[0] : files[field];
  const pick = () => {
    const i = document.createElement("input");
    i.type = "file";
    i.onchange = (e) => {
      if (e.target.files[0]) onAddFile(field, e.target.files[0]);
    };
    i.click();
  };
  return (
    <div style={{ marginBottom: 13 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        onClick={pick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const fi = e.dataTransfer.files[0];
          if (fi) onAddFile(field, fi);
        }}
        style={{
          border: `2px dashed ${file ? "#10B981" : "#D1D5DB"}`,
          borderRadius: 8,
          padding: 14,
          textAlign: "center",
          cursor: "pointer",
          background: file ? "#F0FDF4" : "#FAFAFA",
        }}
      >
        {file ? (
          <div style={{ color: "#16A34A", fontSize: 13 }}>
            [ok] <b>{file.name}</b> ({(file.size / 1024).toFixed(1)} KB)
          </div>
        ) : (
          <>
            <div style={{ fontSize: 22, marginBottom: 4 }}>📂</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              Drag & drop or{" "}
              <span style={{ color: "#3B82F6", fontWeight: 600 }}>
                click to browse
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>
              {hint}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const INIT_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@lungomics.org",
    password: "admin123",
    role: "admin",
    status: "active",
    joined: "2024-01-10",
    datasets: 5,
  },
  {
    id: 2,
    name: "Dr. Li Wei",
    email: "liwei@hospital.cn",
    password: "pass1234",
    role: "curator",
    status: "active",
    joined: "2024-03-22",
    datasets: 3,
  },
  {
    id: 3,
    name: "Zhang San",
    email: "zhangsan@uni.edu.cn",
    password: "pass1234",
    role: "user",
    status: "pending",
    joined: "2026-03-08",
    datasets: 0,
  },
  {
    id: 4,
    name: "Alice Chen",
    email: "alice@research.org",
    password: "pass1234",
    role: "user",
    status: "active",
    joined: "2025-11-01",
    datasets: 1,
  },
];

function mkSamples(prefix, n, startAge, grp, tis) {
  return Array.from({ length: n }, function (_, i) {
    return {
      id: prefix + "_" + (i + 1),
      age: startAge + i * 2,
      sex: "F",
      group: grp,
      tissue: tis,
      disease: "Health",
      source: "GEO: SAMC" + (2509412 + i * 4),
      rin: (7.2 + Math.random()).toFixed(1),
      reads:
        42 +
        Math.round(Math.random() * 18) +
        "." +
        Math.round(Math.random() * 9) +
        "M",
    };
  });
}

const INIT_DS = [
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
    citation:
      "Li W et al. (2025) Transcriptomic landscape of airway aging. Nature Aging.",
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
    citation:
      "Li W et al. (2025) Transcriptomic landscape of airway aging. Nature Aging.",
  },
];

// -------------------------------------------------------------
// ATOMS
// -------------------------------------------------------------
const Badge = ({ color, children, sm }) => (
  <span
    style={{
      background: color + "22",
      color,
      border: `1px solid ${color}44`,
      padding: sm ? "1px 6px" : "2px 9px",
      borderRadius: 4,
      fontSize: sm ? 10 : 11,
      fontWeight: 600,
      display: "inline-block",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);
const OTag = ({ term, id }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      background: "#F0F4FF",
      border: "1px solid #C7D2FE",
      borderRadius: 4,
      padding: "2px 7px",
      fontSize: 11,
      color: "#4338CA",
    }}
  >
    <b>{term}</b>
    {id && <span style={{ color: "#818CF8", fontSize: 10 }}>{id}</span>}
  </span>
);
const SDot = ({ s }) => {
  const c = {
    active: "#10B981",
    pending: "#F59E0B",
    suspended: "#EF4444",
    published: "#10B981",
    review: "#F59E0B",
    draft: "#9CA3AF",
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c[s] || "#9CA3AF",
          display: "inline-block",
        }}
      />
      <span
        style={{ fontSize: 11, color: "#6B7280", textTransform: "capitalize" }}
      >
        {s}
      </span>
    </span>
  );
};
const Btn = ({ onClick, children, v = "primary", sm, disabled, full }) => {
  const S = {
    primary: {
      background: "linear-gradient(135deg,#3B82F6,#6366F1)",
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: "#fff",
      color: "#374151",
      border: "1px solid #D1D5DB",
    },
    danger: {
      background: "#FEF2F2",
      color: "#EF4444",
      border: "1px solid #FECACA",
    },
    success: {
      background: "#F0FDF4",
      color: "#16A34A",
      border: "1px solid #BBF7D0",
    },
    ghost: { background: "transparent", color: "#6B7280", border: "none" },
    outline: {
      background: "transparent",
      color: "#3B82F6",
      border: "1px solid #3B82F6",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...S[v],
        padding: sm ? "5px 11px" : "9px 18px",
        borderRadius: 7,
        fontSize: sm ? 11 : 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: full ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
};
const inp = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #D1D5DB",
  borderRadius: 7,
  fontSize: 13,
  color: "#1E293B",
  outline: "none",
  background: "#FAFAFA",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
const Card = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: 16,
      ...style,
    }}
  >
    {children}
  </div>
);
const SecTitle = ({ children }) => (
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: "#6B7280",
      letterSpacing: "0.07em",
      marginBottom: 12,
    }}
  >
    {children}
  </div>
);

// -------------------------------------------------------------
// MINI CHARTS
// -------------------------------------------------------------
const Volcano = ({ degs, width = 300, height = 200 }) => {
  if (!degs.length)
    return (
      <div style={{ color: "#9CA3AF", fontSize: 12, padding: 20 }}>
        No DEG data
      </div>
    );
  const px = 32,
    py = 20;
  const maxFC = Math.max(...degs.map((d) => Math.abs(d.logFC))) + 0.6;
  const maxP = Math.max(...degs.map((d) => -Math.log10(d.pval))) + 1.5;
  const tx = (fc) => px + ((fc + maxFC) / (2 * maxFC)) * (width - 2 * px);
  const ty = (p) => py + (1 - -Math.log10(p) / maxP) * (height - 2 * py);
  const fdrY = ty(0.05);
  return (
    <svg
      width={width}
      height={height}
      style={{
        background: "#F8FAFC",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={width} height={height} fill="#F8FAFC" rx={8} />
      <line
        x1={px}
        y1={fdrY}
        x2={width - px}
        y2={fdrY}
        stroke="#FCA5A5"
        strokeDasharray="4,3"
        strokeWidth={1.2}
      />
      <text
        x={width - px - 2}
        y={fdrY - 4}
        fontSize={9}
        fill="#EF4444"
        textAnchor="end"
      >
        FDR=0.05
      </text>
      <line
        x1={tx(0)}
        y1={py}
        x2={tx(0)}
        y2={height - py}
        stroke="#CBD5E1"
        strokeWidth={1}
      />
      {degs
        .filter((d) => d.fdr >= 0.05)
        .map((d, i) => (
          <circle
            key={i}
            cx={tx(d.logFC)}
            cy={ty(d.pval)}
            r={4}
            fill="#CBD5E1"
            opacity={0.5}
          />
        ))}
      {degs
        .filter((d) => d.fdr < 0.05)
        .map((d, i) => (
          <g key={i} filter="url(#glow)">
            <circle
              cx={tx(d.logFC)}
              cy={ty(d.pval)}
              r={6}
              fill={d.direction === "up" ? "#EF4444" : "#3B82F6"}
              opacity={0.88}
            />
            <text
              x={tx(d.logFC)}
              y={ty(d.pval) - 9}
              textAnchor="middle"
              fontSize={9.5}
              fill="#1E293B"
              fontWeight={700}
            >
              {d.gene}
            </text>
          </g>
        ))}
      <text x={px} y={height - 6} fontSize={9} fill="#9CA3AF">
        -logFC
      </text>
      <text
        x={width / 2}
        y={height - 6}
        textAnchor="middle"
        fontSize={9}
        fill="#9CA3AF"
      >
        log2 Fold Change
      </text>
      <text
        x={width - px}
        y={height - 6}
        fontSize={9}
        fill="#9CA3AF"
        textAnchor="end"
      >
        +logFC
      </text>
    </svg>
  );
};

const Heatmap = ({ genes, nSamples = 14 }) => {
  const vals = useMemo(
    () =>
      genes.map(() =>
        Array.from({ length: nSamples }, () => Math.random() * 4),
      ),
    [genes, nSamples],
  );
  const col = (v) => {
    const t = Math.min(v / 4, 1);
    return `rgb(${Math.round(255 * (1 - t))},${Math.round(100 * (1 - t) + 76 * t)},${Math.round(204 * (1 - t))})`;
  };
  const cW = 14,
    cH = 15,
    lW = 65,
    W = lW + nSamples * cW + 8,
    H = genes.length * cH + 28;
  return (
    <svg
      width={W}
      height={H}
      style={{ borderRadius: 8, border: "1px solid #E2E8F0", maxWidth: "100%" }}
    >
      <rect width={W} height={H} fill="#F8FAFC" />
      {genes.map((g, gi) => (
        <g key={gi}>
          <text
            x={lW - 5}
            y={14 + gi * cH + cH / 2 + 3}
            textAnchor="end"
            fontSize={9.5}
            fill="#374151"
            fontStyle="italic"
          >
            {g}
          </text>
          {vals[gi].map((v, si) => (
            <rect
              key={si}
              x={lW + si * cW}
              y={14 + gi * cH}
              width={cW - 1}
              height={cH - 1}
              fill={col(v)}
              rx={1}
            />
          ))}
        </g>
      ))}
      <line
        x1={lW + (nSamples * cW) / 2}
        y1={14}
        x2={lW + (nSamples * cW) / 2}
        y2={H - 12}
        stroke="#475569"
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <text
        x={lW + (nSamples * cW) / 4}
        y={H - 4}
        textAnchor="middle"
        fontSize={8.5}
        fill="#6B7280"
        fontWeight={600}
      >
        Young (n=7)
      </text>
      <text
        x={lW + (nSamples * cW * 3) / 4}
        y={H - 4}
        textAnchor="middle"
        fontSize={8.5}
        fill="#6B7280"
        fontWeight={600}
      >
        Old (n=7)
      </text>
    </svg>
  );
};

const AgeHistogram = ({ samples }) => {
  const bins = [
    { label: "20-29", min: 20, max: 29 },
    { label: "30-39", min: 30, max: 39 },
    { label: "40-49", min: 40, max: 49 },
    { label: "50-59", min: 50, max: 59 },
  ];
  const W = 300,
    H = 120,
    bw = 50,
    gap = 10,
    px = 30,
    py = 10;
  const counts = bins.map((b) => ({
    ...b,
    young: samples.filter(
      (s) => s.group === "Young" && s.age >= b.min && s.age <= b.max,
    ).length,
    old: samples.filter(
      (s) => s.group === "Old" && s.age >= b.min && s.age <= b.max,
    ).length,
  }));
  const maxC = Math.max(...counts.map((c) => c.young + c.old), 1);
  const barH = H - py - 22;
  return (
    <svg
      width={W}
      height={H}
      style={{
        borderRadius: 8,
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
      }}
    >
      {counts.map((c, i) => {
        const x = px + i * (bw + gap);
        const yH = (c.young / maxC) * barH,
          oH = (c.old / maxC) * barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={H - 22 - yH}
              width={bw / 2 - 1}
              height={yH}
              fill="#60A5FA"
              rx={2}
            />
            <rect
              x={x + bw / 2}
              y={H - 22 - oH}
              width={bw / 2 - 1}
              height={oH}
              fill="#F97316"
              rx={2}
            />
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize={9}
              fill="#6B7280"
            >
              {c.label}
            </text>
          </g>
        );
      })}
      <text x={2} y={py + 6} fontSize={8} fill="#60A5FA" fontWeight={700}>
        {" "}
        Young
      </text>
      <text x={60} y={py + 6} fontSize={8} fill="#F97316" fontWeight={700}>
        {" "}
        Old
      </text>
    </svg>
  );
};

// -------------------------------------------------------------
// AUTH MODAL
// -------------------------------------------------------------
const AuthModal = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    org: "",
    role: "user",
    agree: false,
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) =>
    setF((p) => ({
      ...p,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const login = () => {
    setErr("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      const u = INIT_USERS.find(
        (u) => u.email === f.email && u.password === f.password,
      );
      if (!u) return setErr("Incorrect email or password.");
      if (u.status === "pending")
        return setErr("Account pending admin approval.");
      if (u.status === "suspended") return setErr("Account suspended.");
      onLogin(u);
      onClose();
    }, 500);
  };
  const reg = () => {
    setErr("");
    if (!f.name || !f.email || !f.password)
      return setErr("Fill all required fields.");
    if (f.password !== f.confirm) return setErr("Passwords don't match.");
    if (f.password.length < 8) return setErr("Password >= 8 characters.");
    if (!f.agree) return setErr("Please accept the Terms.");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setOk("Submitted! Pending admin approval.");
      setMode("done");
    }, 600);
  };
  const forgot = () => {
    if (!f.email) return setErr("Enter your email.");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setOk(`Reset link sent to ${f.email}`);
      setMode("done");
    }, 500);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.72)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 36,
          width: 420,
          maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            color: "#9CA3AF",
            cursor: "pointer",
          }}
        >
          x
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🫁
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#1E293B" }}>
            LungOmics
          </span>
        </div>
        {mode === "done" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 44 }}>[ok]</div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1E293B",
                marginTop: 12,
              }}
            >
              {ok}
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn onClick={onClose}>Close</Btn>
            </div>
          </div>
        ) : mode === "forgot" ? (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
              Reset Password
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>
              We'll send a reset link to your email.
            </p>
            {err && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 7,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#B91C1C",
                  marginBottom: 12,
                }}
              >
                {err}
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Email *
              </div>
              <input
                type="email"
                value={f.email}
                onChange={set("email")}
                style={inp}
                placeholder="you@example.com"
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={forgot} disabled={busy}>
                {busy ? "Sending..." : "Send Link"}
              </Btn>
              <Btn
                v="ghost"
                onClick={() => {
                  setMode("login");
                  setErr("");
                }}
              >
                {"<- Back"}
              </Btn>
            </div>
          </>
        ) : mode === "register" ? (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
              Create Account
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>
              Register to upload and access restricted data.
            </p>
            {err && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 7,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#B91C1C",
                  marginBottom: 12,
                }}
              >
                {err}
              </div>
            )}
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Full Name *
              </div>
              <input
                value={f.name}
                onChange={set("name")}
                style={inp}
                placeholder="Dr. Zhang San"
              />
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Email *
              </div>
              <input
                type="email"
                value={f.email}
                onChange={set("email")}
                style={inp}
              />
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Institution
              </div>
              <input
                value={f.org}
                onChange={set("org")}
                style={inp}
                placeholder="Peking University"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 13,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Password *
                </div>
                <input
                  type="password"
                  value={f.password}
                  onChange={set("password")}
                  style={inp}
                  placeholder=">= 8 chars"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Confirm *
                </div>
                <input
                  type="password"
                  value={f.confirm}
                  onChange={set("confirm")}
                  style={inp}
                />
              </div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Role
              </div>
              <select value={f.role} onChange={set("role")} style={inp}>
                <option value="user">Researcher</option>
                <option value="curator">Curator</option>
              </select>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 18,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={f.agree}
                onChange={set("agree")}
                style={{ marginTop: 2 }}
              />
              I agree to the{" "}
              <span style={{ color: "#3B82F6" }}>Terms of Use</span> and{" "}
              <span style={{ color: "#3B82F6" }}>Data Policy</span>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={reg} disabled={busy}>
                {busy ? "Registering..." : "Create Account"}
              </Btn>
              <Btn
                v="ghost"
                onClick={() => {
                  setMode("login");
                  setErr("");
                }}
              >
                {"<- Back"}
              </Btn>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
              Sign In
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>
              Access datasets and analysis tools.
            </p>
            {err && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 7,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#B91C1C",
                  marginBottom: 12,
                }}
              >
                {err}
              </div>
            )}
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Email *
              </div>
              <input
                type="email"
                value={f.email}
                onChange={set("email")}
                style={inp}
                placeholder="you@example.com"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Password *
              </div>
              <input
                type="password"
                value={f.password}
                onChange={set("password")}
                style={inp}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Btn onClick={login} disabled={busy}>
                {busy ? "Signing in..." : "Sign In"}
              </Btn>
              <button
                onClick={() => {
                  setMode("forgot");
                  setErr("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>
            <div
              style={{
                borderTop: "1px solid #F1F5F9",
                paddingTop: 14,
                fontSize: 13,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              No account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setErr("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </div>
            <div
              style={{
                marginTop: 12,
                background: "#F0F9FF",
                border: "1px solid #BAE6FD",
                borderRadius: 7,
                padding: "8px 12px",
                fontSize: 11,
                color: "#0369A1",
              }}
            >
              <b>Demo:</b> admin@lungomics.org / admin123
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// DOWNLOAD REQUEST MODAL
// -------------------------------------------------------------
const DownloadModal = ({ file, dataset, user, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [institution, setInstitution] = useState(user?.org || "");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);
  const submit = () => {
    if (!reason || !agree) return;
    onSubmit({ file: file.name, dataset: dataset.id, reason, institution });
    setDone(true);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.72)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          width: 480,
          maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52 }}>📬</div>
            <h3 style={{ margin: "16px 0 8px", color: "#1E293B" }}>
              Request Submitted
            </h3>
            <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>
              Your request for <b>{file.name}</b> has been sent to the data
              custodian. You will be notified by email within 3-5 business days.
            </p>
            <div style={{ marginTop: 20 }}>
              <Btn onClick={onClose}>Close</Btn>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 18,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 4px",
                    color: "#1E293B",
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  Data Access Request
                </h3>
                <p style={{ margin: 0, color: "#6B7280", fontSize: 13 }}>
                  Complete this form to request download access.
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  color: "#9CA3AF",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                REQUESTED FILE
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>
                📄 {file.name}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                {file.type} - {file.size} - {dataset.name}
              </div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Applicant
              </div>
              <input
                value={user?.name || ""}
                disabled
                style={{ ...inp, background: "#F1F5F9", color: "#6B7280" }}
              />
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Institution
              </div>
              <input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                style={inp}
                placeholder="Your institution or organization"
              />
            </div>
            <div style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                Research Purpose <span style={{ color: "#EF4444" }}>*</span>
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                style={{ ...inp, resize: "vertical" }}
                placeholder="Please describe how you intend to use this data (project title, research questions, expected outputs)..."
              />
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 18,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ marginTop: 2 }}
              />
              I agree to use this data only for the stated research purpose,
              cite the original publication, and comply with the Data Use
              Agreement.
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={submit} disabled={!reason || !agree}>
                Submit Request
              </Btn>
              <Btn v="secondary" onClick={onClose}>
                Cancel
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// UPLOAD WIZARD
// -------------------------------------------------------------
const UploadWizard = ({ onClose, onSubmit, currentUser }) => {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    name: "",
    description: "",
    species: "Human",
    tissue: "",
    cells: "",
    omicsType: "",
    disease: "Health",
    source: "",
    accession: "",
    comparison: "",
    files: { meta: null, expr: null, degs: [] },
    confirmed: false,
  });
  const [errs, setErrs] = useState({});
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const STEPS = ["Basic Info", "Ontology", "File Upload", "Review"];
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!f.name) e.name = "Required";
      if (!f.tissue) e.tissue = "Required";
      if (!f.omicsType) e.omicsType = "Required";
    }
    if (step === 2 && !f.files.meta && !f.files.expr)
      e.files = "Upload at least one file";
    setErrs(e);
    return !Object.keys(e).length;
  };
  const addFile = (field, file) => {
    if (field === "degs")
      setF((p) => ({
        ...p,
        files: { ...p.files, degs: [...p.files.degs, file] },
      }));
    else setF((p) => ({ ...p, files: { ...p.files, [field]: file } }));
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.72)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 580,
          maxWidth: "96vw",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#1E293B,#1E40AF)",
            padding: "20px 28px",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#93C5FD",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                DATASET SUBMISSION
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#fff",
                  marginTop: 2,
                }}
              >
                Upload New Dataset
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "#fff",
                width: 32,
                height: 32,
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              x
            </button>
          </div>
          <div style={{ display: "flex" }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", flex: 1 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        i < step
                          ? "#10B981"
                          : i === step
                            ? "#fff"
                            : "rgba(255,255,255,0.15)",
                      color:
                        i < step ? "#fff" : i === step ? "#1E40AF" : "#94A3B8",
                    }}
                  >
                    {i < step ? "v" : i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: i === step ? "#E0F2FE" : "#64748B",
                      marginTop: 4,
                      textAlign: "center",
                      fontWeight: i === step ? 700 : 400,
                    }}
                  >
                    {s}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      flex: 0.4,
                      background:
                        i < step ? "#10B981" : "rgba(255,255,255,0.15)",
                      marginBottom: 14,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "22px 28px" }}>
          {errs.files && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 7,
                padding: "8px 12px",
                fontSize: 12,
                color: "#B91C1C",
                marginBottom: 12,
              }}
            >
              {errs.files}
            </div>
          )}
          {step === 0 && (
            <>
              <div style={{ marginBottom: 13 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Dataset Name *
                </div>
                <input
                  value={f.name}
                  onChange={set("name")}
                  style={inp}
                  placeholder="e.g. Lung Airway Aging Study"
                />
                {errs.name && (
                  <div style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>
                    {errs.name}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 13 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Description
                </div>
                <textarea
                  value={f.description}
                  onChange={set("description")}
                  rows={3}
                  style={{ ...inp, resize: "vertical" }}
                  placeholder="Experimental design and key findings..."
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 4,
                    }}
                  >
                    Species
                  </div>
                  <select
                    value={f.species}
                    onChange={set("species")}
                    style={inp}
                  >
                    {Object.keys(ONT.species).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 4,
                    }}
                  >
                    Tissue *
                  </div>
                  <select value={f.tissue} onChange={set("tissue")} style={inp}>
                    <option value="">- Select -</option>
                    {Object.keys(ONT.tissues).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {errs.tissue && (
                    <div
                      style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}
                    >
                      {errs.tissue}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 4,
                    }}
                  >
                    Omics Type *
                  </div>
                  <select
                    value={f.omicsType}
                    onChange={set("omicsType")}
                    style={inp}
                  >
                    <option value="">- Select -</option>
                    {Object.keys(ONT.omics).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  {errs.omicsType && (
                    <div
                      style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}
                    >
                      {errs.omicsType}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 4,
                    }}
                  >
                    Disease
                  </div>
                  <select
                    value={f.disease}
                    onChange={set("disease")}
                    style={inp}
                  >
                    {Object.keys(ONT.diseases).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 4,
                    }}
                  >
                    Data Source
                  </div>
                  <input
                    value={f.source}
                    onChange={set("source")}
                    style={inp}
                    placeholder="GEO / SRA / In-house"
                  />
                </div>
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 4,
                    }}
                  >
                    Accession
                  </div>
                  <input
                    value={f.accession}
                    onChange={set("accession")}
                    style={inp}
                    placeholder="GSE12345"
                  />
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div
                style={{
                  background: "#EEF2FF",
                  border: "1px solid #C7D2FE",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#4338CA",
                    marginBottom: 10,
                  }}
                >
                  📌 Auto-mapped Ontology Terms
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {f.species && (
                    <OTag
                      term={`Species: ${f.species}`}
                      id={ONT.species[f.species]?.id}
                    />
                  )}
                  {f.tissue && (
                    <OTag
                      term={`Tissue: ${f.tissue}`}
                      id={ONT.tissues[f.tissue]?.id}
                    />
                  )}
                  {f.omicsType && (
                    <OTag
                      term={`Assay: ${f.omicsType}`}
                      id={ONT.omics[f.omicsType]?.id}
                    />
                  )}
                  {f.disease && (
                    <OTag
                      term={`Disease: ${f.disease}`}
                      id={ONT.diseases[f.disease]?.id}
                    />
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 13 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Comparison Definition
                </div>
                <input
                  value={f.comparison}
                  onChange={set("comparison")}
                  style={inp}
                  placeholder='e.g. "old (age>=50) vs young (age<=40)"'
                />
              </div>
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12,
                  color: "#92400E",
                  marginBottom: 14,
                }}
              >
                ! Verify ontology mappings - incorrect terms affect
                cross-dataset query accuracy.
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                <input
                  type="checkbox"
                  checked={f.confirmed}
                  onChange={(e) =>
                    setF((p) => ({ ...p, confirmed: e.target.checked }))
                  }
                />
                I confirm ontology annotations are correct
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>
                Supported: <b>.xlsx, .csv, .tsv, .h5, .h5ad</b>
              </div>
              <FileZone
                label="📋 Sample Metadata Sheet *"
                field="meta"
                hint="meta_sheet.xlsx - sample_id, age, sex, group..."
                files={f.files}
                onAddFile={addFile}
              />
              <FileZone
                label="📊 Expression Matrix (FPKM / CPM / count)"
                field="expr"
                hint="gene_fpkm.xlsx - rows: genes, columns: samples"
                files={f.files}
                onAddFile={addFile}
              />
              <FileZone
                label="📈 DEG Results (optional)"
                field="degs"
                hint="deg_list.xlsx - gene, logFC, pvalue, FDR"
                files={f.files}
                onAddFile={addFile}
              />
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 12,
                  color: "#166534",
                  marginTop: 6,
                }}
              >
                🔒 Files encrypted at rest. Raw data access-controlled per Data
                Use Agreement.
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 10,
                    letterSpacing: "0.06em",
                  }}
                >
                  SUBMISSION SUMMARY
                </div>
                {[
                  ["Dataset Name", f.name || "-"],
                  ["Species", f.species],
                  [
                    "Tissue",
                    `${f.tissue} (${ONT.tissues[f.tissue]?.id || "-"})`,
                  ],
                  ["Omics Type", f.omicsType || "-"],
                  ["Disease", f.disease],
                  ["Source", f.source || "-"],
                  ["Uploader", currentUser?.name || "-"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: "1px solid #F1F5F9",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>
                      {k}
                    </span>
                    <span style={{ color: "#1E293B" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12,
                  color: "#92400E",
                }}
              >
                i Dataset enters curator review before publishing. You'll be
                notified by email.
              </div>
            </>
          )}
        </div>
        <div
          style={{
            padding: "14px 28px 22px",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Btn
            v="secondary"
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
          >
            {step === 0 ? "Cancel" : "<- Back"}
          </Btn>
          {step < STEPS.length - 1 ? (
            <Btn
              onClick={() => {
                if (validate()) setStep((s) => s + 1);
              }}
              disabled={step === 1 && !f.confirmed}
            >
              Next {"->"}
            </Btn>
          ) : (
            <Btn
              onClick={() => {
                onSubmit(f);
                onClose();
              }}
            >
              🚀 Submit Dataset
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// ADMIN PANEL
// -------------------------------------------------------------
const AdminPanel = ({ initUsers, initDatasets, onClose, currentUser }) => {
  const [sec, setSec] = useState("overview");
  const [users, setUsers] = useState(initUsers);
  const [dsets, setDsets] = useState(initDatasets);
  const [toast, setToast] = useState("");
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };
  const pU = (id, p) => {
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, ...p } : u)));
    notify("Updated.");
  };
  const dU = (id) => {
    setUsers((us) => us.filter((u) => u.id !== id));
    notify("Removed.");
  };
  const pD = (id, p) => {
    setDsets((ds) => ds.map((d) => (d.id === id ? { ...d, ...p } : d)));
    notify("Updated.");
  };
  const dD = (id) => {
    setDsets((ds) => ds.filter((d) => d.id !== id));
    notify("Removed.");
  };
  const stats = {
    u: users.length,
    a: users.filter((u) => u.status === "active").length,
    p: users.filter((u) => u.status === "pending").length,
    d: dsets.length,
    pub: dsets.filter((d) => d.status === "published").length,
    rev: dsets.filter((d) => d.status === "review").length,
  };
  const NAV = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users", badge: stats.p || null },
    { id: "datasets", icon: "🗂", label: "Datasets", badge: stats.rev || null },
    { id: "settings", icon: "[gear]", label: "Settings" },
  ];
  const RC = { admin: "#8B5CF6", curator: "#3B82F6", user: "#6B7280" };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.78)",
        zIndex: 1000,
        display: "flex",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 80px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "#1E293B",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: 52,
            gap: 16,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16 }}>[gear]</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>
            Admin Panel
          </span>
          <Badge color="#8B5CF6">Admin</Badge>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              Logged in as{" "}
              <b style={{ color: "#E2E8F0" }}>{currentUser?.name}</b>
            </span>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                padding: "5px 14px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              x Close
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div
            style={{
              width: 180,
              background: "#F8FAFC",
              borderRight: "1px solid #E2E8F0",
              padding: "14px 0",
              flexShrink: 0,
            }}
          >
            {NAV.map((n) => (
              <div
                key={n.id}
                onClick={() => setSec(n.id)}
                style={{
                  padding: "10px 18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: sec === n.id ? "#EEF2FF" : "transparent",
                  borderLeft:
                    sec === n.id
                      ? "3px solid #4338CA"
                      : "3px solid transparent",
                  color: sec === n.id ? "#4338CA" : "#374151",
                  fontWeight: sec === n.id ? 700 : 400,
                  fontSize: 13,
                }}
              >
                <span>{n.icon}</span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge && (
                  <span
                    style={{
                      background: "#EF4444",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "1px 6px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {n.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {toast && (
              <div
                style={{
                  position: "fixed",
                  top: 62,
                  right: 24,
                  background: "#1E293B",
                  color: "#fff",
                  padding: "9px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  zIndex: 2000,
                }}
              >
                v {toast}
              </div>
            )}
            {sec === "overview" && (
              <>
                <h2
                  style={{
                    margin: "0 0 18px",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1E293B",
                  }}
                >
                  Platform Overview
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 12,
                    marginBottom: 22,
                  }}
                >
                  {[
                    ["Total Users", stats.u, "#3B82F6", "👤"],
                    ["Active Users", stats.a, "#10B981", "[ok]"],
                    ["Pending", stats.p, "#F59E0B", "[wait]"],
                    ["Total Datasets", stats.d, "#8B5CF6", "🗂"],
                    ["Published", stats.pub, "#10B981", "🌐"],
                    ["Under Review", stats.rev, "#F59E0B", "🔍"],
                  ].map(([l, v, c, icon]) => (
                    <div
                      key={l}
                      style={{
                        background: "#fff",
                        border: `1px solid ${c}33`,
                        borderTop: `3px solid ${c}`,
                        borderRadius: 8,
                        padding: "13px 16px",
                      }}
                    >
                      <div style={{ fontSize: 28, fontWeight: 800, color: c }}>
                        {v}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                      >
                        {icon} {l}
                      </div>
                    </div>
                  ))}
                </div>
                <Card>
                  <SecTitle>RECENT ACTIVITY</SecTitle>
                  {[
                    {
                      time: "2h ago",
                      msg: "New user registration",
                      who: "Zhang San",
                      icon: "👤",
                    },
                    {
                      time: "5h ago",
                      msg: "Dataset submitted for review",
                      who: "Alice Chen",
                      icon: "📦",
                    },
                    {
                      time: "1d ago",
                      msg: "DS001 published",
                      who: "Dr. Li Wei",
                      icon: "🌐",
                    },
                    {
                      time: "2d ago",
                      msg: "User promoted to curator",
                      who: "Dr. Li Wei",
                      icon: "🔑",
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: i < 3 ? "1px solid #F1F5F9" : "none",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#1E293B",
                            fontWeight: 600,
                          }}
                        >
                          {a.msg}
                        </span>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                          {" "}
                          - {a.who}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {a.time}
                      </span>
                    </div>
                  ))}
                </Card>
              </>
            )}
            {sec === "users" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#1E293B",
                    }}
                  >
                    User Management
                  </h2>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {users.length} total
                  </span>
                </div>
                <Card style={{ padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        {[
                          "User",
                          "Email",
                          "Role",
                          "Status",
                          "Joined",
                          "Actions",
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
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          style={{ borderBottom: "1px solid #F1F5F9" }}
                        >
                          <td style={{ padding: "10px 14px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  background: `hsl(${u.id * 60},55%,62%)`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#fff",
                                }}
                              >
                                {u.name[0]}
                              </div>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#1E293B",
                                }}
                              >
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              fontSize: 12,
                              color: "#6B7280",
                            }}
                          >
                            {u.email}
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <Badge color={RC[u.role] || "#6B7280"} sm>
                              {u.role}
                            </Badge>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <SDot s={u.status} />
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              fontSize: 12,
                              color: "#6B7280",
                            }}
                          >
                            {u.joined}
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <div
                              style={{
                                display: "flex",
                                gap: 5,
                                flexWrap: "wrap",
                              }}
                            >
                              {u.status === "pending" && (
                                <Btn
                                  sm
                                  v="success"
                                  onClick={() => pU(u.id, { status: "active" })}
                                >
                                  Approve
                                </Btn>
                              )}
                              {u.status === "active" && u.role !== "admin" && (
                                <Btn
                                  sm
                                  v="danger"
                                  onClick={() =>
                                    pU(u.id, { status: "suspended" })
                                  }
                                >
                                  Suspend
                                </Btn>
                              )}
                              {u.status === "suspended" && (
                                <Btn
                                  sm
                                  v="success"
                                  onClick={() => pU(u.id, { status: "active" })}
                                >
                                  Restore
                                </Btn>
                              )}
                              {u.role !== "admin" && (
                                <Btn
                                  sm
                                  v="secondary"
                                  onClick={() =>
                                    pU(u.id, {
                                      role:
                                        u.role === "curator"
                                          ? "user"
                                          : "curator",
                                    })
                                  }
                                >
                                  {u.role === "curator"
                                    ? "-> User"
                                    : "-> Curator"}
                                </Btn>
                              )}
                              {u.id !== currentUser?.id && (
                                <Btn sm v="danger" onClick={() => dU(u.id)}>
                                  x
                                </Btn>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </>
            )}
            {sec === "datasets" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#1E293B",
                    }}
                  >
                    Dataset Management
                  </h2>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {dsets.length} total
                  </span>
                </div>
                {dsets.map((ds) => (
                  <div
                    key={ds.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderLeft: `4px solid ${ONT.omics[ds.omicsType]?.color || "#3B82F6"}`,
                      borderRadius: 10,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#1E293B",
                            }}
                          >
                            {ds.name}
                          </span>
                          <Badge
                            color={ONT.omics[ds.omicsType]?.color || "#3B82F6"}
                            sm
                          >
                            {ds.omicsType}
                          </Badge>
                          <SDot s={ds.status} />
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <OTag
                            term={ds.tissue}
                            id={ONT.tissues[ds.tissue]?.id}
                          />
                          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                            By {ds.uploader} - {ds.uploadDate}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
                        {ds.status !== "published" && (
                          <Btn
                            sm
                            v="success"
                            onClick={() => pD(ds.id, { status: "published" })}
                          >
                            v Publish
                          </Btn>
                        )}
                        {ds.status === "published" && (
                          <Btn
                            sm
                            v="secondary"
                            onClick={() => pD(ds.id, { status: "draft" })}
                          >
                            Unpublish
                          </Btn>
                        )}
                        <Btn sm v="danger" onClick={() => dD(ds.id)}>
                          x Delete
                        </Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {sec === "settings" && (
              <>
                <h2
                  style={{
                    margin: "0 0 18px",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1E293B",
                  }}
                >
                  Platform Settings
                </h2>
                {[
                  [
                    "Registration Policy",
                    "Control who can register",
                    ["Open Registration", "Invitation Only", "Closed"],
                    "Open Registration",
                  ],
                  [
                    "Default Visibility",
                    "Visibility for new datasets",
                    ["Public", "Restricted", "Private"],
                    "Restricted",
                  ],
                  [
                    "Review Required",
                    "Require curator review before publishing",
                    ["Required", "Optional", "Disabled"],
                    "Required",
                  ],
                  [
                    "Ontology Validation",
                    "Validate ontology terms on upload",
                    ["Strict", "Warning Only", "Disabled"],
                    "Warning Only",
                  ],
                  [
                    "Max File Size",
                    "Per dataset upload limit",
                    ["1 GB", "5 GB", "10 GB", "Unlimited"],
                    "5 GB",
                  ],
                ].map(([t, d, o, def]) => (
                  <Card
                    key={t}
                    style={{
                      marginBottom: 12,
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {t}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                      >
                        {d}
                      </div>
                    </div>
                    <select
                      defaultValue={def}
                      style={{
                        padding: "6px 10px",
                        border: "1px solid #D1D5DB",
                        borderRadius: 6,
                        fontSize: 12,
                        color: "#374151",
                        background: "#FAFAFA",
                      }}
                    >
                      {o.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// DATASET DETAIL PAGE  (Explorer integrated)
// -------------------------------------------------------------
const DatasetDetail = ({ ds, user, onBack, onDownloadRequest }) => {
  const [dtab, setDtab] = useState("overview");
  const [sSearch, setSSearch] = useState("");
  const [sGroup, setSGroup] = useState("All");
  const [dlFile, setDlFile] = useState(null);
  const [geneSearch, setGeneSearch] = useState("");
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

  const DTABS = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "samples", label: "Samples", icon: "👥" },
    { id: "analysis", label: "Analysis", icon: "📊" },
    { id: "download", label: "Download", icon: "[dl]" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      {dlFile && user && (
        <DownloadModal
          file={dlFile}
          dataset={ds}
          user={user}
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
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
                  maxWidth: 620,
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
                  <div style={{ fontSize: 26, fontWeight: 800, color: c }}>
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
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 24px" }}>
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
                  <div style={{ fontSize: 24, fontWeight: 800, color: c }}>
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
          <div style={{ maxWidth: 760 }}>
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

// -------------------------------------------------------------
// TOOLS TAB
// -------------------------------------------------------------
const ToolsTab = () => {
  const [activeTool, setActiveTool] = useState(null);

  // -- Gene Expression Calculator --
  const GeneCalcTool = () => {
    const [genes, setGenes] = useState("SCGB1A1\nMUC5B\nFOXJ1\nCFTR");
    const [fc, setFC] = useState("");
    const [pval, setPval] = useState("");
    const [result, setResult] = useState(null);
    const calc = () => {
      const g = genes
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const fcV = parseFloat(fc),
        pvV = parseFloat(pval);
      if (isNaN(fcV) || isNaN(pvV)) return;
      const sig = g
        .map((gene) => ({
          gene,
          fc: fcV + (Math.random() - 0.5) * 0.5,
          pval: pvV * Math.random(),
          fdr: pvV * Math.random() * 2,
        }))
        .filter((x) => x.fdr < 0.05);
      setResult({ total: g.length, sig: sig.length, list: sig });
    };
    return (
      <div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 5,
              }}
            >
              Gene List (one per line)
            </div>
            <textarea
              value={genes}
              onChange={(e) => setGenes(e.target.value)}
              rows={8}
              style={{
                ...inp,
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: 12,
              }}
            />
          </div>
          <div>
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                logFC Threshold
              </div>
              <input
                type="number"
                value={fc}
                onChange={(e) => setFC(e.target.value)}
                style={inp}
                placeholder="e.g. 1.5"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                }}
              >
                P-value Threshold
              </div>
              <input
                type="number"
                value={pval}
                onChange={(e) => setPval(e.target.value)}
                style={inp}
                placeholder="e.g. 0.05"
              />
            </div>
            <Btn onClick={calc} full>
              Run Filter
            </Btn>
            {result && (
              <div
                style={{
                  marginTop: 12,
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#166534",
                    marginBottom: 6,
                  }}
                >
                  [ok] {result.sig}/{result.total} genes significant
                </div>
                {result.list.map((r, i) => (
                  <div
                    key={i}
                    style={{ fontSize: 12, color: "#374151", padding: "2px 0" }}
                  >
                    <b style={{ fontStyle: "italic" }}>{r.gene}</b> - FC=
                    {r.fc.toFixed(2)} - FDR={r.fdr.toFixed(3)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // -- GO Enrichment (mock) --
  const GOTool = () => {
    const [genes, setGenes] = useState("LGR6\nTCIM\nMMP1\nCXCL2\nFDCSP");
    const [ran, setRan] = useState(false);
    const MOCK_GO = [
      {
        term: "GO:0006955",
        name: "Immune response",
        p: 0.0002,
        genes: 3,
        ratio: "3/5",
      },
      {
        term: "GO:0009615",
        name: "Response to virus",
        p: 0.0008,
        genes: 2,
        ratio: "2/5",
      },
      {
        term: "GO:0045087",
        name: "Innate immune response",
        p: 0.0021,
        genes: 2,
        ratio: "2/5",
      },
      {
        term: "GO:0006954",
        name: "Inflammatory response",
        p: 0.0089,
        genes: 2,
        ratio: "2/5",
      },
      {
        term: "GO:0032496",
        name: "Response to LPS",
        p: 0.0134,
        genes: 1,
        ratio: "1/5",
      },
    ];
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Gene Symbols (one per line)
          </div>
          <textarea
            value={genes}
            onChange={(e) => setGenes(e.target.value)}
            rows={6}
            style={{
              ...inp,
              resize: "vertical",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          />
        </div>
        <Btn onClick={() => setRan(true)}>Run GO Enrichment (BP)</Btn>
        {ran && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Enriched GO Terms (Biological Process)
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
                  {["GO Term", "Name", "P-value", "Genes", "Ratio"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "7px 10px",
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
                {MOCK_GO.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td
                      style={{
                        padding: "6px 10px",
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "#6B7280",
                      }}
                    >
                      {r.term}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        fontWeight: 600,
                        color: "#1E293B",
                      }}
                    >
                      {r.name}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        color: r.p < 0.001 ? "#059669" : "#374151",
                        fontWeight: r.p < 0.001 ? 700 : 400,
                      }}
                    >
                      {r.p.toFixed(4)}
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "center" }}>
                      {r.genes}
                    </td>
                    <td style={{ padding: "6px 10px" }}>{r.ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // -- Sequence GC Calculator --
  const GCTool = () => {
    const [seq, setSeq] = useState("");
    const clean = seq.replace(/[^ATGCatgc]/g, "").toUpperCase();
    const gc = clean.length
      ? Math.round(
          (clean.split("").filter((c) => c === "G" || c === "C").length /
            clean.length) *
            100,
        )
      : 0;
    const counts = {
      A: clean.split("").filter((c) => c === "A").length,
      T: clean.split("").filter((c) => c === "T").length,
      G: clean.split("").filter((c) => c === "G").length,
      C: clean.split("").filter((c) => c === "C").length,
    };
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 5,
            }}
          >
            DNA/RNA Sequence
          </div>
          <textarea
            value={seq}
            onChange={(e) => setSeq(e.target.value)}
            rows={5}
            style={{
              ...inp,
              resize: "vertical",
              fontFamily: "monospace",
              fontSize: 12,
            }}
            placeholder="Paste sequence (ATGC)..."
          />
        </div>
        {clean.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {Object.entries(counts).map(([b, n]) => (
              <div
                key={b}
                style={{
                  background: b === "G" || b === "C" ? "#EFF6FF" : "#FFF7ED",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: b === "G" || b === "C" ? "#3B82F6" : "#F97316",
                  }}
                >
                  {n}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{b}</div>
              </div>
            ))}
          </div>
        )}
        {clean.length > 0 && (
          <div
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: 8,
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>GC Content</div>
                <div
                  style={{ fontSize: 32, fontWeight: 800, color: "#16A34A" }}
                >
                  {gc}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>Length</div>
                <div
                  style={{ fontSize: 32, fontWeight: 800, color: "#0284C7" }}
                >
                  {clean.length} bp
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 12,
                height: 12,
                borderRadius: 6,
                background: "#E2E8F0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${gc}%`,
                  background: "linear-gradient(90deg,#10B981,#3B82F6)",
                  borderRadius: 6,
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // -- FPKM / TPM Converter --
  const FPKMTool = () => {
    const [rows, setRows] = useState(
      "SCGB3A1\t15995\t1200\nSLPI\t19657\t980\nSCGB1A1\t11937\t1450",
    );
    const [done, setDone] = useState(false);
    const parsed = rows
      .split("\n")
      .map((r) => {
        const [gene, count, len] = r.split("\t");
        return {
          gene: gene?.trim(),
          count: parseFloat(count),
          len: parseFloat(len),
        };
      })
      .filter((r) => r.gene && !isNaN(r.count) && !isNaN(r.len));
    const totalRPK = parsed.reduce((a, r) => a + r.count / (r.len / 1000), 0);
    const results = parsed.map((r) => ({
      ...r,
      rpk: r.count / (r.len / 1000),
      fpkm: r.count / (r.len / 1000) / (totalRPK / 1e6),
      tpm: (r.count / (r.len / 1000) / totalRPK) * 1e6,
    }));
    return (
      <div>
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
          Input format:{" "}
          <code
            style={{
              background: "#F1F5F9",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            GeneName [TAB] RawCount [TAB] GeneLength(bp)
          </code>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Input Data
          </div>
          <textarea
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            rows={6}
            style={{
              ...inp,
              resize: "vertical",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          />
        </div>
        <Btn onClick={() => setDone(true)}>Convert to FPKM & TPM</Btn>
        {done && results.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Gene", "Raw Count", "Length", "FPKM", "TPM"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "7px 10px",
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
                {results.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td
                      style={{
                        padding: "6px 10px",
                        fontWeight: 700,
                        fontStyle: "italic",
                      }}
                    >
                      {r.gene}
                    </td>
                    <td
                      style={{ padding: "6px 10px", fontFamily: "monospace" }}
                    >
                      {r.count.toLocaleString()}
                    </td>
                    <td
                      style={{ padding: "6px 10px", fontFamily: "monospace" }}
                    >
                      {r.len.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        fontWeight: 600,
                        color: "#3B82F6",
                      }}
                    >
                      {r.fpkm.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        fontWeight: 600,
                        color: "#8B5CF6",
                      }}
                    >
                      {r.tpm.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // -- P-value Correction --
  const PvalTool = () => {
    const [pvals, setPvals] = useState(
      "0.001\n0.005\n0.02\n0.04\n0.06\n0.10\n0.25",
    );
    const [done, setDone] = useState(false);
    const pvArr = pvals
      .split("\n")
      .map((p) => parseFloat(p.trim()))
      .filter((p) => !isNaN(p));
    const sorted = [...pvArr]
      .map((p, i) => ({ p, orig: i }))
      .sort((a, b) => a.p - b.p);
    const n = pvArr.length;
    const bhAdj = sorted.map((s, rank) => ({
      ...s,
      bh: Math.min((s.p * n) / (rank + 1), 1),
    }));
    const results = pvArr.map((p, i) => {
      const entry = bhAdj.find((b) => b.orig === i);
      return { p, bh: entry?.bh.toFixed(5) || "-" };
    });
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 5,
            }}
          >
            P-values (one per line)
          </div>
          <textarea
            value={pvals}
            onChange={(e) => setPvals(e.target.value)}
            rows={8}
            style={{
              ...inp,
              resize: "vertical",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          />
        </div>
        <Btn onClick={() => setDone(true)}>Apply BH Correction (FDR)</Btn>
        {done && pvArr.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["#", "Raw P-value", "BH-adjusted FDR", "Significant?"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "7px 10px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#6B7280",
                          borderBottom: "1px solid #E2E8F0",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      background: parseFloat(r.bh) < 0.05 ? "#F0FDF4" : "#fff",
                    }}
                  >
                    <td style={{ padding: "6px 10px", color: "#9CA3AF" }}>
                      {i + 1}
                    </td>
                    <td
                      style={{ padding: "6px 10px", fontFamily: "monospace" }}
                    >
                      {r.p}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        fontFamily: "monospace",
                        fontWeight: 600,
                        color: parseFloat(r.bh) < 0.05 ? "#059669" : "#374151",
                      }}
                    >
                      {r.bh}
                    </td>
                    <td style={{ padding: "6px 10px" }}>
                      {parseFloat(r.bh) < 0.05 ? (
                        <Badge color="#10B981" sm>
                          v Yes
                        </Badge>
                      ) : (
                        <Badge color="#9CA3AF" sm>
                          No
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

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
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 24px" }}>
      {ACTIVE?.component ? (
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
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1E293B",
                margin: "0 0 6px",
              }}
            >
              Bioinformatics Tools
            </h2>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
              Lightweight online tools for quick analysis - no installation
              required.
            </p>
          </div>
          {categories.map((cat) => (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                {cat.toUpperCase()}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                  gap: 14,
                }}
              >
                {TOOLS.filter((t) => t.category === cat).map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => tool.component && setActiveTool(tool.id)}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: 12,
                      padding: 18,
                      cursor: tool.component ? "pointer" : "default",
                      opacity: tool.component ? 1 : 0.55,
                      transition: "all 0.15s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "linear-gradient(135deg,#EFF6FF,#E0E7FF)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1E293B",
                          }}
                        >
                          {tool.name}
                        </div>
                        {!tool.component && (
                          <Badge color="#9CA3AF" sm>
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        lineHeight: 1.5,
                      }}
                    >
                      {tool.desc}
                    </div>
                    {tool.component && (
                      <div
                        style={{
                          marginTop: 10,
                          fontSize: 11,
                          color: "#3B82F6",
                          fontWeight: 600,
                        }}
                      >
                        Launch {"->"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// MAIN APP
// -------------------------------------------------------------
export default function App() {
  const [tab, setTab] = useState("overview");
  const [detailDS, setDetailDS] = useState(null); // dataset detail page
  const [tFilter, setTFilter] = useState(null);
  const [oFilter, setOFilter] = useState(null);
  const [q, setQ] = useState("");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showUp, setShowUp] = useState(false);
  const [showAdm, setShowAdm] = useState(false);
  const [datasets, setDatasets] = useState(INIT_DS);
  const [toast, setToast] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };
  const login = (u) => {
    setUser(u);
    notify(`Welcome back, ${u.name}!`);
  };
  const logout = () => {
    setUser(null);
    notify("Signed out.");
  };
  const addDS = (f) => {
    setDatasets((ds) => [
      ...ds,
      {
        id: `DS${String(ds.length + 1).padStart(3, "0")}`,
        name: f.name || "Untitled Dataset",
        description: f.description,
        species: f.species,
        tissue: f.tissue,
        cells: f.cells,
        omicsType: f.omicsType,
        disease: f.disease,
        samples: 0,
        source: f.source,
        accession: f.accession || "-",
        status: "review",
        uploader: user?.name || "-",
        uploadDate: new Date().toISOString().slice(0, 10),
        files: [],
        degs: [],
        samples_meta: [],
        fpkm_genes: [],
        citation: "",
      },
    ]);
    notify("Dataset submitted for curator review!");
  };
  const handleDownloadReq = (req) =>
    notify(`Access request for ${req.file} submitted!`);

  const filtered = datasets.filter((d) => {
    if (tFilter && d.tissue !== tFilter) return false;
    if (oFilter && d.omicsType !== oFilter) return false;
    if (
      q &&
      !d.name.toLowerCase().includes(q.toLowerCase()) &&
      !d.description.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const TABS = ["overview", "datasets", "ontology", "tools", "architecture"];

  // If a dataset detail is open, render it full-page
  if (detailDS) {
    const ds = datasets.find((d) => d.id === detailDS);
    if (!ds) {
      setDetailDS(null);
      return null;
    }
    return (
      <div
        style={{
          fontFamily: "'Segoe UI',system-ui,sans-serif",
          background: "#F0F4F8",
          minHeight: "100vh",
        }}
      >
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} onLogin={login} />
        )}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: 16,
              right: 20,
              background: "#1E293B",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              zIndex: 9999,
            }}
          >
            v {toast}
          </div>
        )}
        {/* Slim top bar */}
        <div
          style={{
            background: "#0F172A",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            height: 48,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            position: "sticky",
            top: 0,
            zIndex: 200,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginRight: "auto",
              cursor: "pointer",
            }}
            onClick={() => setDetailDS(null)}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🫁
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              LungOmics
            </span>
          </div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {user.role === "admin" && (
                <button
                  onClick={() => setShowAdm(true)}
                  style={{
                    background: "rgba(139,92,246,0.18)",
                    border: "1px solid rgba(139,92,246,0.35)",
                    color: "#C4B5FD",
                    padding: "5px 11px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  [gear] Admin
                </button>
              )}
              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                border: "none",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          )}
        </div>
        {showAdm && user?.role === "admin" && (
          <AdminPanel
            initUsers={INIT_USERS}
            initDatasets={datasets}
            onClose={() => setShowAdm(false)}
            currentUser={user}
          />
        )}
        <DatasetDetail
          ds={ds}
          user={user}
          onBack={() => setDetailDS(null)}
          onDownloadRequest={handleDownloadReq}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',system-ui,sans-serif",
        background: "#F0F4F8",
        minHeight: "100vh",
      }}
    >
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 60,
            right: 20,
            background: "#1E293B",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            zIndex: 9999,
          }}
        >
          v {toast}
        </div>
      )}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onLogin={login} />
      )}
      {showUp && user && (
        <UploadWizard
          onClose={() => setShowUp(false)}
          onSubmit={addDS}
          currentUser={user}
        />
      )}
      {showAdm && user?.role === "admin" && (
        <AdminPanel
          initUsers={INIT_USERS}
          initDatasets={datasets}
          onClose={() => setShowAdm(false)}
          currentUser={user}
        />
      )}

      {/* -- TOP NAV -- */}
      <div
        style={{
          background: "#1E293B",
          color: "#fff",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: 52,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 200,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginRight: 28,
            cursor: "pointer",
          }}
          onClick={() => setTab("overview")}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🫁
          </div>
          <span
            style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}
          >
            LungOmics
          </span>
          <span
            style={{
              background: "#3B82F6",
              color: "#fff",
              fontSize: 9,
              padding: "1px 5px",
              borderRadius: 3,
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            BETA
          </span>
        </div>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              color: tab === t ? "#60A5FA" : "#94A3B8",
              fontWeight: tab === t ? 700 : 400,
              fontSize: 13,
              padding: "0 12px",
              height: 52,
              cursor: "pointer",
              borderBottom:
                tab === t ? "2px solid #60A5FA" : "2px solid transparent",
              textTransform: "capitalize",
              letterSpacing: "0.02em",
            }}
          >
            {t}
          </button>
        ))}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {user ? (
            <>
              <button
                onClick={() => setShowUp(true)}
                style={{
                  background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                  border: "none",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Upload
              </button>
              {user.role === "admin" && (
                <button
                  onClick={() => setShowAdm(true)}
                  style={{
                    background: "rgba(139,92,246,0.18)",
                    border: "1px solid rgba(139,92,246,0.35)",
                    color: "#C4B5FD",
                    padding: "6px 12px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  [gear] Admin
                </button>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {user.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#E2E8F0",
                      lineHeight: 1.2,
                    }}
                  >
                    {user.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748B",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: "4px 6px",
                  }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                border: "none",
                color: "#fff",
                padding: "7px 18px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>

      <div style={{ paddingBottom: 40 }}>
        {/* == OVERVIEW == */}
        {tab === "overview" && (
          <>
            <div
              style={{
                background:
                  "linear-gradient(135deg,#1E293B 0%,#1E40AF 60%,#312E81 100%)",
                padding: "52px 32px 44px",
                color: "#fff",
              }}
            >
              <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#93C5FD",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  ONTOLOGY-DRIVEN MULTI-OMICS PLATFORM
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 38,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.2,
                  }}
                >
                  Integrated Lung
                  <br />
                  Multi-Omics Atlas
                </h1>
                <p
                  style={{
                    color: "#BAE6FD",
                    fontSize: 15,
                    marginTop: 14,
                    maxWidth: 520,
                    lineHeight: 1.6,
                  }}
                >
                  Standardized, ontology-annotated lung multi-omics datasets -
                  enabling cross-dataset discovery, aging and disease
                  comparisons.
                </p>
                <div style={{ marginTop: 32, maxWidth: 640 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "rgba(255,255,255,0.97)",
                      borderRadius: 14,
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
                    }}
                  >
                    <span
                      style={{
                        padding: "0 16px",
                        fontSize: 18,
                        color: "#6B7280",
                        flexShrink: 0,
                      }}
                    >
                      🔍
                    </span>
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && q) setTab("datasets");
                      }}
                      placeholder="Search genes, datasets, tissues, diseases..."
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: 15,
                        color: "#1E293B",
                        background: "transparent",
                        padding: "17px 0",
                        fontFamily: "inherit",
                      }}
                    />
                    <button
                      onClick={() => {
                        if (q) setTab("datasets");
                      }}
                      style={{
                        margin: 6,
                        padding: "11px 24px",
                        borderRadius: 10,
                        cursor: "pointer",
                        background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                        color: "#fff",
                        border: "none",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Search
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "#93C5FD",
                        fontWeight: 600,
                      }}
                    >
                      Popular:
                    </span>
                    {[
                      "SCGB1A1",
                      "MUC5B",
                      "FOXJ1",
                      "CFTR",
                      "bulk RNA-seq",
                      "Bronchus",
                      "Aging",
                    ].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setQ(t);
                          setTab("datasets");
                        }}
                        style={{
                          background: "rgba(255,255,255,0.12)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#E0F2FE",
                          borderRadius: 20,
                          padding: "3px 11px",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 28,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    [String(datasets.length), "Datasets", "#60A5FA"],
                    ["28", "Samples", "#34D399"],
                    ["14", "Genes", "#F472B6"],
                    ["3", "Omics Types", "#FBBF24"],
                    ["4", "Ontologies", "#A78BFA"],
                  ].map(([v, l, c]) => (
                    <div
                      key={l}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 10,
                        padding: "10px 18px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 24, fontWeight: 800, color: c }}>
                        {v}
                      </span>
                      <span
                        style={{ fontSize: 11, color: "#CBD5E1", marginTop: 1 }}
                      >
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                maxWidth: 900,
                margin: "28px auto 0",
                padding: "0 24px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: 14,
                  letterSpacing: "0.02em",
                }}
              >
                ONTOLOGY COVERAGE
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 12,
                }}
              >
                {[
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
                    terms: [
                      "Bulk RNA-seq",
                      "scRNA-seq",
                      "ATAC-seq",
                      "ChIP-seq",
                    ],
                    color: "#10B981",
                  },
                ].map((o) => (
                  <Card
                    key={o.id}
                    style={{
                      borderTop: `3px solid ${o.color}`,
                      border: `1px solid ${o.color}33`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 13 }}>
                        {o.name}
                      </span>
                      <Badge color={o.color}>{o.id}</Badge>
                    </div>
                    {o.terms.map((t) => (
                      <div
                        key={t}
                        style={{
                          fontSize: 11,
                          color: "#6B7280",
                          padding: "2px 0",
                          borderBottom: "1px solid #F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span style={{ color: o.color }}> - </span>
                        {t}
                      </div>
                    ))}
                  </Card>
                ))}
              </div>
              {!user && (
                <div
                  style={{
                    background: "linear-gradient(135deg,#1E40AF,#312E81)",
                    borderRadius: 12,
                    padding: "22px 28px",
                    marginTop: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}
                    >
                      Ready to contribute data?
                    </div>
                    <div
                      style={{ fontSize: 13, color: "#BAE6FD", marginTop: 4 }}
                    >
                      Register to upload datasets and join the community.
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuth(true)}
                    style={{
                      background: "#fff",
                      color: "#1E40AF",
                      border: "none",
                      padding: "10px 22px",
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Get Started {"->"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* == DATASETS == */}
        {tab === "datasets" && (
          <div
            style={{ maxWidth: 1000, margin: "24px auto", padding: "0 24px" }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                FILTER:
              </span>
              {["Bronchus", "Trachea", "Alveolus"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTFilter(tFilter === t ? null : t)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    background: tFilter === t ? "#3B82F6" : "#fff",
                    color: tFilter === t ? "#fff" : "#374151",
                    border: `1px solid ${tFilter === t ? "#3B82F6" : "#D1D5DB"}`,
                  }}
                >
                  {t}
                </button>
              ))}
              <span style={{ color: "#D1D5DB" }}>|</span>
              {["bulk RNA-seq", "scRNA-seq", "ATAC-seq"].map((o) => (
                <button
                  key={o}
                  onClick={() => setOFilter(oFilter === o ? null : o)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    background:
                      oFilter === o ? ONT.omics[o]?.color || "#3B82F6" : "#fff",
                    color: oFilter === o ? "#fff" : "#374151",
                    border: `1px solid ${oFilter === o ? ONT.omics[o]?.color || "#3B82F6" : "#D1D5DB"}`,
                  }}
                >
                  {o}
                </button>
              ))}
              {(tFilter || oFilter || q) && (
                <button
                  onClick={() => {
                    setTFilter(null);
                    setOFilter(null);
                    setQ("");
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    cursor: "pointer",
                    background: "#FEE2E2",
                    color: "#EF4444",
                    border: "1px solid #FECACA",
                    fontWeight: 600,
                  }}
                >
                  x Clear
                </button>
              )}
              <span
                style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280" }}
              >
                {filtered.length} datasets
              </span>
              {user && (
                <button
                  onClick={() => setShowUp(true)}
                  style={{
                    background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                    border: "none",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Upload
                </button>
              )}
            </div>
            {filtered.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setDetailDS(ds.id)}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderLeft: `4px solid ${ONT.omics[ds.omicsType]?.color || "#3B82F6"}`,
                  borderRadius: 10,
                  padding: 18,
                  marginBottom: 12,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {ds.name}
                      </span>
                      <SDot s={ds.status} />
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {ds.id}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        marginBottom: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {ds.description}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <OTag term={ds.tissue} id={ONT.tissues[ds.tissue]?.id} />
                      <OTag
                        term={ds.species}
                        id={ONT.species[ds.species]?.id}
                      />
                      <Badge
                        color={ONT.omics[ds.omicsType]?.color || "#3B82F6"}
                      >
                        {ds.omicsType}
                      </Badge>
                      <Badge
                        color={ONT.diseases[ds.disease]?.color || "#10B981"}
                      >
                        {ds.disease}
                      </Badge>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginLeft: 16,
                      flexShrink: 0,
                    }}
                  >
                    {[
                      [ds.samples_meta.length, "Samples", "#3B82F6"],
                      [ds.degs.length, "DEGs", "#EF4444"],
                      [ds.files?.length || 0, "Files", "#8B5CF6"],
                    ].map(([v, l, c]) => (
                      <div
                        key={l}
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: 8,
                          padding: "8px 12px",
                          textAlign: "center",
                          minWidth: 52,
                        }}
                      >
                        <div
                          style={{ fontSize: 16, fontWeight: 700, color: c }}
                        >
                          {v}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#9CA3AF",
                            marginTop: 1,
                          }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div
                style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}
              >
                <div style={{ fontSize: 40 }}>🔍</div>
                <div style={{ marginTop: 12, fontSize: 14 }}>
                  No datasets match.
                </div>
              </div>
            )}
          </div>
        )}

        {/* == ONTOLOGY == */}
        {tab === "ontology" && (
          <div
            style={{ maxWidth: 900, margin: "24px auto", padding: "0 24px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "250px 1fr",
                gap: 20,
              }}
            >
              <Card>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  UBERON ANATOMY TREE
                </div>
                {[
                  { label: "Lung", id: "UBERON:0002048", lv: 0 },
                  { label: "Airway", id: "UBERON:0001005", lv: 1 },
                  { label: "Bronchus", id: "UBERON:0002185", lv: 2 },
                  { label: "Trachea", id: "UBERON:0003126", lv: 2 },
                  { label: "Alveolus", id: "UBERON:0002299", lv: 2 },
                  { label: "Vasculature", id: "UBERON:0002049", lv: 1 },
                  { label: "Pleura", id: "UBERON:0000977", lv: 1 },
                ].map((n, i) => (
                  <div
                    key={i}
                    onClick={() => setTFilter(n.label)}
                    style={{
                      paddingLeft: 8 + n.lv * 16,
                      paddingTop: 5,
                      paddingBottom: 5,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      borderRadius: 4,
                      background:
                        tFilter === n.label ? "#EEF2FF" : "transparent",
                      color: tFilter === n.label ? "#4338CA" : "#374151",
                      fontSize: 12,
                      fontWeight: tFilter === n.label ? 700 : 400,
                    }}
                  >
                    <span style={{ color: "#9CA3AF", fontSize: 10 }}>
                      {n.lv > 0 ? "L" : "*"}
                    </span>
                    <span>{n.label}</span>
                    <span
                      style={{
                        color: "#C7D2FE",
                        fontSize: 10,
                        marginLeft: "auto",
                      }}
                    >
                      {n.id}
                    </span>
                  </div>
                ))}
              </Card>
              <Card>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  OMICS ASSAY ONTOLOGY (OBI)
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {Object.entries(ONT.omics).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        background: v.color + "0F",
                        border: `1px solid ${v.color}33`,
                        borderRadius: 8,
                        padding: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: 13 }}>
                          {k}
                        </span>
                        <OTag term={v.id} id="" />
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>
                        {v.cat}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* == TOOLS == */}
        {tab === "tools" && <ToolsTab />}

        {/* == ARCHITECTURE == */}
        {tab === "architecture" && (
          <div
            style={{ maxWidth: 860, margin: "24px auto", padding: "0 24px" }}
          >
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
              Full-stack ontology-driven platform with auth, dataset detail
              pages, download control, and online tools.
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
        )}
      </div>
    </div>
  );
}
