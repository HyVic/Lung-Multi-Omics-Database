import { useState } from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined, InboxOutlined, FileExcelOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface UploadWizardProps {
  onClose: () => void;
  onSubmit: (data: UploadData) => void;
}

export interface UploadData {
  // Step 0: Omics Type
  omicsType: string;
  // Step 1: Basic Info (Left Column)
  name: string;
  description: string;
  species: string;
  disease: string;
  subDisease?: string;
  treatment?: string;
  comparison?: string;
  // Step 1: Technical Info (Right Column)
  tissue: string;
  cells?: string;
  technologyType?: string;
  libraryPlatform?: string;
  sequencingPlatform?: string;
  sourceDatabase?: string;
  accession?: string;
  accessLevel: "Open" | "Controlled";
  citation?: string;
  // Step 2: Files
  metaFile?: { name: string; data: File };
  expressionFile?: { name: string; data: File };
  expressionUnit?: "FPKM" | "TPM" | "CPM" | "Raw count" | string;
  degFiles: { name: string; data: File; comparisonId: string; comparisonDesc: string }[];
  // Step 3: Mapping
  columnMapping: Record<string, string>;
}

const STEPS = [
  { id: 0, label: "Select Type", icon: "🔬" },
  { id: 1, label: "Metadata", icon: "📝" },
  { id: 2, label: "Upload Files", icon: "📁" },
  { id: 3, label: "Mapping", icon: "🔗" },
  { id: 4, label: "Review", icon: "✅" },
];

const OMICS_TYPES = [
  { value: "bulk RNA-seq", label: "Bulk RNA-seq", icon: "🔵", color: "#3B82F6", obi: "OBI:0001271", desc: "Bulk transcriptome sequencing data" },
  { value: "scRNA-seq", label: "scRNA-seq", icon: "🟣", color: "#8B5CF6", obi: "OBI:0002631", desc: "Single-cell transcriptome sequencing" },
  { value: "ATAC-seq", label: "ATAC-seq", icon: "🟢", color: "#10B981", obi: "OBI:0002039", desc: "Assay for Transposase-Accessible Chromatin" },
  { value: "proteomics", label: "Proteomics", icon: "🟡", color: "#F59E0B", obi: "OBI:0000615", desc: "LC-MS/MS proteomics data" },
  { value: "lipidomics", label: "Lipidomics", icon: "🟠", color: "#F97316", obi: "OBI:0000366", desc: "Lipidomics profiling data" },
  { value: "methylation", label: "DNA Methylation", icon: "🔵", color: "#06B6D4", obi: "OBI:0001003", desc: "Bisulfite sequencing methylation" },
  { value: "chip-seq", label: "ChIP-seq", icon: "🟢", color: "#22C55E", obi: "OBI:0001864", desc: "Chromatin immunoprecipitation sequencing" },
  { value: "metabolomics", label: "Metabolomics", icon: "🩷", color: "#EC4899", obi: "OBI:0000070", desc: "Metabolomics profiling data" },
];

// Species - NCBITaxon ontology
const SPECIES = [
  { value: "Homo sapiens", label: "Human", ncbi: "NCBITaxon:9606" },
  { value: "Mus musculus", label: "Mouse", ncbi: "NCBITaxon:10090" },
  { value: "Rattus norvegicus", label: "Rat", ncbi: "NCBITaxon:10116" },
  { value: "Pan troglodytes", label: "Chimpanzee", ncbi: "NCBITaxon:9598" },
  { value: "Macaca mulatta", label: "Rhesus Macaque", ncbi: "NCBITaxon:9544" },
  { value: "Felis catus", label: "Cat", ncbi: "NCBITaxon:9685" },
  { value: "Canis lupus familiaris", label: "Dog", ncbi: "NCBITaxon:9615" },
  { value: "Sus scrofa domesticus", label: "Pig", ncbi: "NCBITaxon:9823" },
];

// Tissues - UBERON ontology (most specific anatomical level)
const TISSUES = [
  { value: "lung", label: "Lung", uberon: "UBERON:0002048" },
  { value: "bronchus", label: "Bronchus", uberon: "UBERON:0002185" },
  { value: "trachea", label: "Trachea", uberon: "UBERON:0003126" },
  { value: "alveolar sac", label: "Alveolar Sac", uberon: "UBERON:0002299" },
  { value: "alveolar duct", label: "Alveolar Duct", uberon: "UBERON:0002300" },
  { value: "alveolar lumen", label: "Alveolar Lumen", uberon: "UBERON:0002314" },
  { value: "respiratory epithelium", label: "Respiratory Epithelium", uberon: "0001004" },
  { value: "bronchial epithelium", label: "Bronchial Epithelium", uberon: "0001006" },
  { value: "pulmonary artery", label: "Pulmonary Artery", uberon: "0002049" },
  { value: "pulmonary vein", label: "Pulmonary Vein", uberon: "0002050" },
  { value: "bronchial tree", label: "Bronchial Tree", uberon: "0002085" },
  { value: "pleura", label: "Pleura", uberon: "UBERON:0000977" },
  { value: "bronchoalveolar lavage fluid", label: "Bronchoalveolar Lavage Fluid", uberon: "0002575" },
  { value: "nasal cavity", label: "Nasal Cavity", uberon: "UBERON:0001707" },
  { value: "nasopharynx", label: "Nasopharynx", uberon: "UBERON:0001728" },
  { value: "larynx", label: "Larynx", uberon: "UBERON:0001737" },
];

// Cells - Cell Ontology (CL)
const CELLS = [
  { value: "pneumocyte", label: "Pneumocyte (General)" },
  { value: "type I pneumocyte", label: "Type I Pneumocyte", cl: "CL:0002062" },
  { value: "type II pneumocyte", label: "Type II Pneumocyte", cl: "CL:0002063" },
  { value: "alveolar macrophage", label: "Alveolar Macrophage", cl: "CL:0000583" },
  { value: "bronchial epithelial cell", label: "Bronchial Epithelial Cell", cl: "CL:0000630" },
  { value: "club cell", label: "Club Cell", cl: "CL:0002078" },
  { value: "ciliated cell", label: "Ciliated Cell", cl: "CL:0002144" },
  { value: "Goblet cell", label: "Goblet Cell", cl: "CL:0000090" },
  { value: "basal cell", label: "Basal Cell", cl: "CL:0002076" },
  { value: "lung fibroblast", label: "Lung Fibroblast", cl: "CL:0002558" },
  { value: "pulmonary endothelial cell", label: "Pulmonary Endothelial Cell", cl: "CL:0002187" },
  { value: "smooth muscle cell", label: "Smooth Muscle Cell", cl: "CL:0000192" },
  { value: "pericyte", label: "Pericyte", cl: "CL:0000669" },
  { value: "mesothelial cell", label: "Mesothelial Cell", cl: "CL:0000077" },
  { value: "multipotent stem cell", label: "Multipotent Stem Cell", cl: "CL:0000048" },
  { value: "cell population", label: "Cell Population (Bulk)", cl: "" },
  { value: "cell type collection", label: "Cell Type Collection (scRNA)", cl: "" },
];

// Diseases - MONDO/PATO ontology
const DISEASES = [
  { value: "PATO:0000461", pato: "PATO:0000461", label: "Normal/Healthy", isHealth: true },
  { value: "MONDO:0005002", mondo: "MONDO:0005002", label: "COPD (Chronic Obstructive Pulmonary Disease)" },
  { value: "MONDO:0005167", mondo: "MONDO:0005167", label: "IPF (Idiopathic Pulmonary Fibrosis)" },
  { value: "MONDO:0008903", mondo: "MONDO:0008903", label: "Lung Cancer" },
  { value: "MONDO:0004979", mondo: "MONDO:0004979", label: "Asthma" },
  { value: "MONDO:0002009", mondo: "MONDO:0002009", label: "Acute Respiratory Distress Syndrome (ARDS)" },
  { value: "MONDO:0010278", mondo: "MONDO:0010278", label: "Pulmonary Emphysema" },
  { value: "MONDO:0010255", mondo: "MONDO:0010255", label: "Chronic Bronchitis" },
  { value: "MONDO:0006576", mondo: "MONDO:0006576", label: "Bronchiectasis" },
  { value: "MONDO:0011000", mondo: "MONDO:0011000", label: "Pulmonary Hypertension" },
  { value: "MONDO:0005343", mondo: "MONDO:0005343", label: "Lung Adenocarcinoma" },
  { value: "MONDO:0017642", mondo: "MONDO:0017642", label: "Squamous Cell Carcinoma" },
  { value: "MONDO:0006654", mondo: "MONDO:0006654", label: "Small Cell Lung Cancer" },
  { value: "MONDO:0019391", mondo: "MONDO:0019391", label: "Mesothelioma" },
  { value: "MONDO:0018436", mondo: "MONDO:0018436", label: "Sarcoidosis" },
  { value: "MONDO:0005401", mondo: "MONDO:0005401", label: "Lymphangioleiomyomatosis" },
  { value: "MONDO:0100199", mondo: "MONDO:0100199", label: "COVID-19 (Pneumonia)" },
  { value: "other", label: "Other Disease", isOther: true },
];

const TECH_TYPES = [
  "polyA RNA-seq",
  "Total RNA-seq",
  "10X Genomics",
  "Smart-seq2",
  "Other (manual input)",
];

const SOURCE_DBS = ["GEO", "SRA", "ArrayExpress", "In-house", "Other"];

// File Upload Zone Component using Ant Design
interface FileUploadZoneProps {
  file?: { name: string; data: File };
  multiple?: boolean;
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  onClear?: () => void;
  acceptedTypes?: string;
  label?: string;
  required?: boolean;
}

function FileUploadZone({ file, multiple, onFileSelect, onFilesSelect, onClear, acceptedTypes, label, required }: FileUploadZoneProps) {
  const uploadProps = {
    accept: acceptedTypes,
    multiple: multiple,
    showUploadList: false,
    beforeUpload: (f: File) => {
      if (multiple && onFilesSelect) {
        onFilesSelect([f]);
      } else if (!multiple && onFileSelect) {
        onFileSelect(f);
      }
      return false;
    },
  };

  return (
    <div>
      {file ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 6, padding: "8px 12px" }}>
          <span style={{ fontSize: 12, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
            <FileExcelOutlined /> {file.name}
          </span>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClear}
            danger
          />
        </div>
      ) : (
        <Upload.Dragger {...uploadProps} style={{ padding: "8px 0" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: "#3B82F6", fontSize: 32 }} />
          </p>
          <p style={{ fontSize: 13, color: "#374151" }}>
            {label || "Click or drag file to upload"}
          </p>
          {required && (
            <p style={{ fontSize: 11, color: "#EF4444", margin: 0 }}>
              Required
            </p>
          )}
        </Upload.Dragger>
      )}
    </div>
  );
}

export default function UploadWizard({ onClose, onSubmit }: UploadWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<UploadData>({
    omicsType: "",
    name: "",
    description: "",
    species: "",
    tissue: "",
    disease: "",
    accessLevel: "Open",
    degFiles: [],
    columnMapping: {},
  });

  const updateData = (updates: Partial<UploadData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Validation function for Step 1
  const getValidationErrors = () => {
    const errors: string[] = [];
    const nameLen = (data.name || "").length;
    const descLen = (data.description || "").length;

    if (!data.name || nameLen < 5 || nameLen > 200) {
      errors.push("Dataset Name (5-200 characters)");
    }
    if (!data.description || descLen < 20 || descLen > 2000) {
      errors.push("Description (20-2000 characters)");
    }
    if (!data.species) {
      errors.push("Species (required)");
    }
    if (!data.disease) {
      errors.push("Disease Status (required)");
    }
    if (!data.tissue) {
      errors.push("Anatomical Tissue (required)");
    }
    if (!data.technologyType) {
      errors.push("Library Construction Method (required)");
    }
    if (!data.libraryPlatform) {
      errors.push("Library Platform (required)");
    }
    if (!data.sourceDatabase) {
      errors.push("Source Database (required)");
    }
    if (!data.accession) {
      errors.push("Accession ID (required)");
    }
    return errors;
  };

  const validationErrors = step === 1 ? getValidationErrors() : [];

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!data.omicsType;
      case 1:
        // Left column validation: name (5-200), description (20-2000), species, disease
        // Right column validation: tissue, technologyType, libraryPlatform, sourceDatabase, accession, accessLevel
        const nameLen = (data.name || "").length;
        const descLen = (data.description || "").length;
        return (
          data.name &&
          nameLen >= 5 &&
          nameLen <= 200 &&
          data.description &&
          descLen >= 20 &&
          descLen <= 2000 &&
          data.species &&
          data.disease &&
          data.tissue &&
          data.technologyType &&
          data.libraryPlatform &&
          data.sourceDatabase &&
          data.accession &&
          data.accessLevel
        );
      case 2:
        // Meta file is required, others are optional
        return !!data.metaFile;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    onSubmit(data);
    onClose();
  };

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
        borderRadius: 16,
        width: "95%",
        maxWidth: 900,
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 18, color: "#1E293B" }}>Upload Dataset</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B7280" }}>✕</button>
        </div>

        {/* Step Indicator */}
        <div style={{ padding: "16px 24px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: step >= s.id ? "#3B82F6" : "#E2E8F0",
                  color: step >= s.id ? "#fff" : "#6B7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {step > s.id ? "✓" : s.id + 1}
                </div>
                <span style={{ marginLeft: 6, fontSize: 12, color: step >= s.id ? "#1E293B" : "#9CA3AF", fontWeight: step === s.id ? 600 : 400 }}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: step > s.id ? "#3B82F6" : "#E2E8F0", marginLeft: 8 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {/* Step 0: Select Omics Type */}
          {step === 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#374151" }}>Select Omics Type</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {OMICS_TYPES.map((o) => (
                  <div
                    key={o.value}
                    onClick={() => updateData({ omicsType: o.value })}
                    style={{
                      border: `2px solid ${data.omicsType === o.value ? o.color : "#E2E8F0"}`,
                      borderRadius: 12,
                      padding: 16,
                      cursor: "pointer",
                      background: data.omicsType === o.value ? o.color + "08" : "#fff",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{o.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{o.label}</div>
                    <div style={{ fontSize: 11, color: o.color, marginTop: 4 }}>{o.obi}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>{o.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Metadata */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#374151" }}>Dataset Metadata</div>
              {validationErrors.length > 0 && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>
                    Please complete the following required fields:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {validationErrors.map((err, i) => (
                      <span key={i} style={{ background: "#FEE2E2", color: "#B91C1C", fontSize: 11, padding: "2px 8px", borderRadius: 4 }}>
                        {err}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                {/* Left Column - Basic Information */}
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Dataset Name <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      value={data.name}
                      onChange={(e) => updateData({ name: e.target.value })}
                      placeholder="e.g., Lung Airway Aging Study"
                      maxLength={200}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>5-200 characters</div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Description <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      value={data.description}
                      onChange={(e) => updateData({ description: e.target.value })}
                      placeholder="Describe your dataset including experimental design, samples, and key findings..."
                      rows={5}
                      maxLength={2000}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>20-2000 characters</div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Species <span style={{ color: "#EF4444" }}>*</span>
                      <span style={{ fontWeight: 400, color: "#6B7280", marginLeft: 8 }}>(NCBITaxon)</span>
                    </label>
                    <input
                      value={data.species}
                      onChange={(e) => updateData({ species: e.target.value })}
                      placeholder="Search e.g., human, mouse..."
                      list="species-list"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                    <datalist id="species-list">
                      {SPECIES.map((s) => <option key={s.value} value={s.label} />)}
                    </datalist>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Disease Status <span style={{ color: "#EF4444" }}>*</span>
                      <span style={{ fontWeight: 400, color: "#6B7280", marginLeft: 8 }}>(MONDO/PATO)</span>
                    </label>
                    <select
                      value={data.disease}
                      onChange={(e) => updateData({ disease: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    >
                      <option value="">Select disease...</option>
                      {DISEASES.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label} {d.pato ? `(PATO:0000461)` : d.mondo ? `(${d.mondo})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Disease Sub-type
                    </label>
                    <input
                      value={data.subDisease || ""}
                      onChange={(e) => updateData({ subDisease: e.target.value })}
                      placeholder="e.g., Lung squamous cell carcinoma (optional)"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Treatment / Intervention
                    </label>
                    <input
                      value={data.treatment || ""}
                      onChange={(e) => updateData({ treatment: e.target.value })}
                      placeholder="e.g., Corticosteroid treatment; None if untreated"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Differential Comparison Definition
                    </label>
                    <input
                      value={data.comparison || "old (age≥50) vs young (age≤40)"}
                      onChange={(e) => updateData({ comparison: e.target.value })}
                      placeholder="e.g., old (age≥50) vs young (age≤40)"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Right Column - Technical & Source Information */}
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Anatomical Tissue <span style={{ color: "#EF4444" }}>*</span>
                      <span style={{ fontWeight: 400, color: "#6B7280", marginLeft: 8 }}>(UBERON)</span>
                    </label>
                    <select
                      value={data.tissue}
                      onChange={(e) => updateData({ tissue: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    >
                      <option value="">Select most specific tissue...</option>
                      {TISSUES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label} ({t.uberon})
                        </option>
                      ))}
                    </select>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Select the most specific anatomical level</div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Cell Population/Type <span style={{ color: "#3B82F6" }}>*</span>
                      <span style={{ fontWeight: 400, color: "#6B7280", marginLeft: 8 }}>(CL, recommended)</span>
                    </label>
                    <select
                      value={data.cells || ""}
                      onChange={(e) => updateData({ cells: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    >
                      <option value="">Select cell type...</option>
                      {CELLS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label} {c.cl ? `(${c.cl})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Omics Technology <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <div style={{ padding: "10px 12px", background: "#F1F5F9", borderRadius: 8, fontSize: 14, color: "#475569" }}>
                      {data.omicsType || "Not selected"}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Auto-filled from Step 0, cannot be modified</div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Library Construction Method <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <select
                      value={data.technologyType || ""}
                      onChange={(e) => updateData({ technologyType: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    >
                      <option value="">Select library method...</option>
                      {TECH_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Library Platform <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      value={data.libraryPlatform || ""}
                      onChange={(e) => updateData({ libraryPlatform: e.target.value })}
                      placeholder="e.g., Illumina NovaSeq 6000"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Sequencing Instrument Model <span style={{ color: "#3B82F6" }}>*</span>
                    </label>
                    <input
                      value={data.sequencingPlatform || ""}
                      onChange={(e) => updateData({ sequencingPlatform: e.target.value })}
                      placeholder="e.g., Illumina NovaSeq 6000, NextSeq 2000"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Source Database <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <select
                      value={data.sourceDatabase || ""}
                      onChange={(e) => updateData({ sourceDatabase: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    >
                      <option value="">Select source database...</option>
                      {SOURCE_DBS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Accession ID <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      value={data.accession || ""}
                      onChange={(e) => updateData({ accession: e.target.value })}
                      placeholder={data.sourceDatabase === "In-house" ? "e.g., LM-001" : "e.g., GSE198980"}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Access Level <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: 24 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "10px 16px", border: `1px solid ${data.accessLevel === "Open" ? "#3B82F6" : "#D1D5DB"}`, borderRadius: 8, background: data.accessLevel === "Open" ? "#EFF6FF" : "#fff" }}>
                        <input type="radio" name="accessLevel" checked={data.accessLevel === "Open"} onChange={() => updateData({ accessLevel: "Open" })} style={{ display: "none" }} />
                        <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${data.accessLevel === "Open" ? "#3B82F6" : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {data.accessLevel === "Open" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
                        </span>
                        <span>Open (Public)</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "10px 16px", border: `1px solid ${data.accessLevel === "Controlled" ? "#3B82F6" : "#D1D5DB"}`, borderRadius: 8, background: data.accessLevel === "Controlled" ? "#EFF6FF" : "#fff" }}>
                        <input type="radio" name="accessLevel" checked={data.accessLevel === "Controlled"} onChange={() => updateData({ accessLevel: "Controlled" })} style={{ display: "none" }} />
                        <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${data.accessLevel === "Controlled" ? "#3B82F6" : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {data.accessLevel === "Controlled" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
                        </span>
                        <span>Controlled (Request Required)</span>
                      </label>
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Citation <span style={{ color: "#3B82F6" }}>*</span>
                    </label>
                    <input
                      value={data.citation || ""}
                      onChange={(e) => updateData({ citation: e.target.value })}
                      placeholder="DOI or full citation (recommended)"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload Files */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#374151" }}>
                📁 {data.omicsType} Data Upload
              </div>

              {/* Bulk RNA-seq Upload Section */}
              {(data.omicsType === "bulk RNA-seq" || data.omicsType === "Total RNA-seq" || data.omicsType === "polyA RNA-seq") && (
                <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  {/* Required: Sample Metadata */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#EF4444", fontSize: 12 }}>*</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Sample Metadata Table</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(required)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .xlsx / .csv | Must contain: sample_id, tissue, disease, age, sex, group</div>
                    <FileUploadZone
                      file={data.metaFile}
                      onFileSelect={(file) => updateData({ metaFile: { name: file.name, data: file } })}
                      onClear={() => updateData({ metaFile: undefined })}
                      acceptedTypes=".xlsx,.csv"
                    />
                  </div>

                  {/* Recommended: Expression Matrix */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#3B82F6", fontSize: 12 }}>●</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Gene Expression Matrix (FPKM / TPM / raw count)</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(recommended)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .xlsx / .tsv / .csv | Rows = genes, Columns = samples</div>
                    <FileUploadZone
                      file={data.expressionFile}
                      onFileSelect={(file) => updateData({ expressionFile: { name: file.name, data: file } })}
                      onClear={() => updateData({ expressionFile: undefined })}
                      acceptedTypes=".xlsx,.tsv,.csv"
                    />
                    {data.expressionFile && (
                      <div style={{ marginTop: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginRight: 16 }}>Expression Unit:</span>
                        {["FPKM", "TPM", "CPM", "Raw count"].map((unit) => (
                          <label key={unit} style={{ display: "inline-flex", alignItems: "center", gap: 4, marginRight: 16, fontSize: 12, cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="expressionUnit"
                              checked={data.expressionUnit === unit}
                              onChange={() => updateData({ expressionUnit: unit })}
                            />
                            {unit}
                          </label>
                        ))}
                        <input
                          type="text"
                          placeholder="Other"
                          value={data.expressionUnit && !["FPKM", "TPM", "CPM", "Raw count"].includes(data.expressionUnit) ? data.expressionUnit : ""}
                          onChange={(e) => updateData({ expressionUnit: e.target.value })}
                          style={{ padding: "4px 8px", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: 12, width: 100 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Recommended: DEG Files */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#3B82F6", fontSize: 12 }}>●</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Differentially Expressed Genes (DEG, can upload multiple)</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(recommended)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .xlsx / .tsv / .csv | Must contain: gene, logFC, p-value, FDR</div>
                    <FileUploadZone
                      multiple
                      onFilesSelect={(files) => {
                        const newDegFiles = files.map(f => ({
                          name: f.name,
                          data: f,
                          comparisonId: "",
                          comparisonDesc: data.comparison || ""
                        }));
                        updateData({ degFiles: [...data.degFiles, ...newDegFiles] });
                      }}
                      acceptedTypes=".xlsx,.tsv,.csv"
                    />
                    {data.degFiles.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Each DEG file comparison definition:</div>
                        {data.degFiles.map((deg, i) => (
                          <div key={i} style={{ background: "#F8FAFC", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                              <span style={{ fontSize: 12, color: "#10B981" }}>✓ {deg.name}</span>
                              <button
                                onClick={() => {
                                  const newDegFiles = data.degFiles.filter((_, idx) => idx !== i);
                                  updateData({ degFiles: newDegFiles });
                                }}
                                style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 12 }}
                              >
                                ✕ Remove
                              </button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                              <div>
                                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Comparison ID:</div>
                                <input
                                  type="text"
                                  value={deg.comparisonId}
                                  onChange={(e) => {
                                    const newDegFiles = [...data.degFiles];
                                    newDegFiles[i].comparisonId = e.target.value;
                                    updateData({ degFiles: newDegFiles });
                                  }}
                                  placeholder="e.g., old_vs_young_BRO"
                                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }}
                                />
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Comparison Description:</div>
                                <input
                                  type="text"
                                  value={deg.comparisonDesc}
                                  onChange={(e) => {
                                    const newDegFiles = [...data.degFiles];
                                    newDegFiles[i].comparisonDesc = e.target.value;
                                    updateData({ degFiles: newDegFiles });
                                  }}
                                  placeholder="e.g., old(age≥50) vs young(age≤40)"
                                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* scRNA-seq Upload Section */}
              {data.omicsType === "scRNA-seq" && (
                <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  {/* Required: Sample Metadata */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#EF4444", fontSize: 12 }}>*</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Sample Metadata Table</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(required)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .xlsx / .csv | Must contain: sample_id, cell_type, tissue, disease, age, sex</div>
                    <FileUploadZone
                      file={data.metaFile}
                      onFileSelect={(file) => updateData({ metaFile: { name: file.name, data: file } })}
                      onClear={() => updateData({ metaFile: undefined })}
                      acceptedTypes=".xlsx,.csv"
                    />
                  </div>

                  {/* Required: Raw Count Matrix */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#EF4444", fontSize: 12 }}>*</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Single-cell Expression Matrix (Raw counts)</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(required)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .mtx / .tsv / .csv | Rows = genes, Columns = cells; or 10X format (barcodes.tsv, features.tsv, matrix.mtx)</div>
                    <FileUploadZone
                      file={data.expressionFile}
                      onFileSelect={(file) => updateData({ expressionFile: { name: file.name, data: file }, expressionUnit: "Raw count" })}
                      onClear={() => updateData({ expressionFile: undefined })}
                      acceptedTypes=".mtx,.tsv,.csv,.gz"
                    />
                  </div>

                  {/* Recommended: Cluster Annotation */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#3B82F6", fontSize: 12 }}>●</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Cluster Annotation File</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(recommended)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .xlsx / .csv | Must contain: cell_id, cluster_id, cell_type</div>
                    <FileUploadZone
                      multiple
                      onFilesSelect={(files) => console.log("Cluster files:", files)}
                      acceptedTypes=".xlsx,.csv"
                    />
                  </div>

                  {/* Recommended: Marker Genes */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#3B82F6", fontSize: 12 }}>●</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Marker Genes (per cluster)</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>(recommended)</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Format: .xlsx / .tsv / .csv | Must contain: gene, cluster, p_val, avg_log2FC</div>
                    <FileUploadZone
                      multiple
                      onFilesSelect={(files) => console.log("Marker files:", files)}
                      acceptedTypes=".xlsx,.tsv,.csv"
                    />
                  </div>
                </div>
              )}

              {/* Generic Upload for other omics types (proteomics, ATAC-seq, etc.) */}
              {!["bulk RNA-seq", "Total RNA-seq", "polyA RNA-seq", "scRNA-seq"].includes(data.omicsType) && (
                <div>
                  <div style={{ border: "2px dashed #D1D5DB", borderRadius: 12, padding: 32, textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Drag & drop files here</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>or click to browse</div>
                    <input type="file" multiple id="file-upload" style={{ display: "none" }} />
                    <label htmlFor="file-upload" style={{ display: "inline-block", padding: "8px 16px", background: "#3B82F6", color: "#fff", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                      Select Files
                    </label>
                  </div>
                </div>
                <Upload
                name="pred_geno_file"
                // 不真正发请求，只交给你在 handleModalOk 里自己用 FormData 处理
                action={null}
                multiple={false}
                showUploadList={true}
                accept=".hmp.txt,.txt,.csv,.xlsx,.xls,.gz"
                beforeUpload={() => false} // 关键：阻止自动上传，使 file.originFileObj 一直存在
                onChange={handleFileUploadChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                  + 上传基因型数据
                </Button>
              </Upload>
              )}
            </div>
          )}

          {/* Step 3: Mapping */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#374151" }}>Column Mapping & Ontology Annotation</div>
              <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>Sample Metadata Column Mapping</div>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280" }}>Original Column</th>
                      <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280" }}>Auto-detect</th>
                      <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280" }}>Standard Field</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["SampleID", "Species", "Disease", "Age", "Sex", "Tissue", "RIN", "Group"].map((col) => (
                      <tr key={col} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "8px 0" }}>{col}</td>
                        <td style={{ padding: "8px 0", color: "#10B981" }}>✓ Auto</td>
                        <td style={{ padding: "8px 0" }}>
                          <select style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #D1D5DB", fontSize: 12 }}>
                            <option>{col.toLowerCase().replace("id", "_id")}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#374151" }}>Review & Submit</div>
              <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ color: "#10B981", fontSize: 16 }}>✓</span>
                  <span style={{ fontWeight: 600 }}>Dataset Metadata</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                  <div><strong>Name:</strong> {data.name}</div>
                  <div><strong>Species:</strong> {data.species}</div>
                  <div><strong>Tissue:</strong> {data.tissue}</div>
                  <div><strong>Disease:</strong> {data.disease}</div>
                  <div><strong>Omics:</strong> {data.omicsType}</div>
                  <div><strong>Source:</strong> {data.sourceDatabase} / {data.accession}</div>
                </div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ color: "#10B981", fontSize: 16 }}>✓</span>
                  <span style={{ fontWeight: 600 }}>Sample Metadata</span>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>Sample column mapping completed</div>
              </div>
              <div style={{ background: "#FEF3C7", borderRadius: 8, padding: 16, border: "1px solid #FCD34D" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Validation Summary</div>
                <div style={{ fontSize: 12, color: "#92400E" }}>⚠ 2 warnings (不影响提交)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between" }}>
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} style={{ padding: "10px 20px", border: "1px solid #D1D5DB", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" }}>
              ← Back
            </button>
          ) : <div />}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed()} style={{ padding: "10px 20px", border: "none", borderRadius: 8, background: canProceed() ? "#3B82F6" : "#94A3AF", color: "#fff", fontSize: 13, fontWeight: 600, cursor: canProceed() ? "pointer" : "not-allowed" }}>
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ padding: "10px 20px", border: "none", borderRadius: 8, background: "#10B981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
