import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INIT_DS } from "../../data/datasets";
import { ONT } from "../../constants/ontology";
import { Badge, SDot, OTag } from "../../components/ui";
import { useUser } from "../../components/Layout";
import UploadWizard from "../../components/UploadWizard";
import { Input, InputNumber, Select, Checkbox, Radio, Slider, Button, Tag, Tree, Space, Empty, Drawer, Popconfirm } from "antd";
import type { TreeDataNode } from "antd";

// Mock data for gene search results
const mockGeneResults = [
  { id: "DS001", name: "Lung Cancer RNA-seq Study A", hitGenes: 5, totalGenes: 8, matchedGenes: ["TP53", "EGFR", "KRAS", "ALK", "BRAF"] },
  { id: "DS002", name: "COPD Transcriptome Data", hitGenes: 3, totalGenes: 8, matchedGenes: ["TP53", "EGFR", "KRAS"] },
  { id: "DS003", name: "IPF Gene Expression", hitGenes: 2, totalGenes: 8, matchedGenes: ["TP53", "EGFR"] },
  { id: "DS005", name: "Normal Lung Bulk RNA", hitGenes: 1, totalGenes: 8, matchedGenes: ["TP53"] },
];

// Mock ontology tree data
const tissueTreeData: TreeDataNode[] = [
  {
    title: "Airway (呼吸道)",
    key: "airway",
    children: [
      { title: "Bronchus (支气管)", key: "bronchus", selectable: false, children: [
        { title: "Bronchiole (细支气管)", key: "bronchiole" },
      ]},
      { title: "Trachea (气管)", key: "trachea" },
    ],
  },
  {
    title: "Lung (肺)",
    key: "lung",
    children: [
      { title: "Alveolus (肺泡)", key: "alveolus", children: [
        { title: "AT1 cell (AT1细胞)", key: "at1" },
        { title: "AT2 cell (AT2细胞)", key: "at2" },
      ]},
    ],
  },
];

const cellTreeData: TreeDataNode[] = [
  {
    title: "气道上皮细胞 (Airway epithelial cell) CL:0000082",
    key: "airway-epithelial",
    children: [
      { title: "纤毛细胞 (Ciliated cell) CL:0000064", key: "ciliated", disableCheckbox: true },
      { title: "杯状细胞 (Goblet cell) CL:0000160", key: "goblet", disableCheckbox: true },
      { title: "棒状细胞 (Club cell) CL:0000158", key: "club", disableCheckbox: true },
      { title: "基底细胞 (Basal cell) CL:0000646", key: "basal", disableCheckbox: true },
    ],
  },
  { title: "AT2细胞 (AT2 cell) CL:0002063", key: "at2-cell" },
  { title: "内皮细胞 (Endothelial cell) CL:0000115", key: "endothelial" },
  { title: "成纤维细胞 (Fibroblast) CL:0000057", key: "fibroblast" },
];

export default function DataSetsHome() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showUpload, setShowUpload] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Gene search state
  const [geneSearchText, setGeneSearchText] = useState("");
  const [geneSearchMode, setGeneSearchMode] = useState<"AND" | "OR" | "threshold">("AND");
  const [geneThreshold, setGeneThreshold] = useState(50);
  const [showGeneResults, setShowGeneResults] = useState(false);

  // Gene filter state
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState<string[]>([]);
  const [regulationDirection, setRegulationDirection] = useState<"all" | "up" | "down">("all");
  const [fdrThreshold, setFdrThreshold] = useState(0.05);
  const [logfcThreshold, setLogfcThreshold] = useState<[number, number]>([0, 5]);

  // Advanced query builder state
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const [queryConditions, setQueryConditions] = useState<{field: string; operator: string; value: string}[]>([
    { field: "tissue", operator: "CONTAINS", value: "" }
  ]);

  // Filter state
  const [speciesFilter, setSpeciesFilter] = useState<string[]>([]);
  const [omicsFilter, setOmicsFilter] = useState<string[]>([]);
  const [diseaseFilter, setDiseaseFilter] = useState<string[]>([]);
  const [tissueFilter, setTissueFilter] = useState<string[]>([]);
  const [cellTypeFilter, setCellTypeFilter] = useState<string[]>([]);
  const [lifeStageFilter, setLifeStageFilter] = useState<string[]>([]);
  const [sexFilter, setSexFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [accessFilter, setAccessFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([21, 57]);

  const datasets = INIT_DS;

  // Filter logic
  const filtered = datasets.filter((d) => {
    if (speciesFilter.length && !speciesFilter.includes(d.species)) return false;
    if (omicsFilter.length && !omicsFilter.includes(d.omicsType)) return false;
    if (diseaseFilter.length && !diseaseFilter.includes(d.disease)) return false;
    if (sourceFilter.length && !sourceFilter.includes(d.source || "GEO")) return false;
    if (accessFilter.length && !accessFilter.includes(d.accessLevel)) return false;
    return true;
  });

  // Active filters for display
  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];
  if (speciesFilter.length) activeFilters.push({ key: "species", label: `Species: ${speciesFilter.join(", ")}`, onRemove: () => setSpeciesFilter([]) });
  if (omicsFilter.length) activeFilters.push({ key: "omics", label: `Omics: ${omicsFilter.join(", ")}`, onRemove: () => setOmicsFilter([]) });
  if (diseaseFilter.length) activeFilters.push({ key: "disease", label: `Disease: ${diseaseFilter.join(", ")}`, onRemove: () => setDiseaseFilter([]) });
  if (tissueFilter.length) activeFilters.push({ key: "tissue", label: `Tissue: ${tissueFilter.join(", ")}`, onRemove: () => setTissueFilter([]) });
  if (cellTypeFilter.length) activeFilters.push({ key: "cellType", label: `Cell: ${cellTypeFilter.join(", ")}`, onRemove: () => setCellTypeFilter([]) });
  if (lifeStageFilter.length) activeFilters.push({ key: "lifeStage", label: `Life Stage: ${lifeStageFilter.join(", ")}`, onRemove: () => setLifeStageFilter([]) });
  if (sexFilter.length) activeFilters.push({ key: "sex", label: `Sex: ${sexFilter.join(", ")}`, onRemove: () => setSexFilter([]) });
  if (sourceFilter.length) activeFilters.push({ key: "source", label: `Source: ${sourceFilter.join(", ")}`, onRemove: () => setSourceFilter([]) });
  if (accessFilter.length) activeFilters.push({ key: "access", label: `Access: ${accessFilter.join(", ")}`, onRemove: () => setAccessFilter([]) });

  const clearAllFilters = () => {
    setSpeciesFilter([]);
    setOmicsFilter([]);
    setDiseaseFilter([]);
    setTissueFilter([]);
    setCellTypeFilter([]);
    setLifeStageFilter([]);
    setSexFilter([]);
    setSourceFilter([]);
    setAccessFilter([]);
    setStatusFilter([]);
    setAgeRange([21, 57]);
  };

  const handleGeneSearch = () => {
    if (geneSearchText.trim()) {
      setShowGeneResults(true);
    }
  };

  // Filter panel content
  const filterPanel = (
    <div style={{ padding: "0 8px" }}>
      {/* 基因搜索结果过滤器 */}
      {showGeneResults && (
        <>
          <div style={{ marginBottom: 20, padding: 12, background: "#F0F9FF", borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>🧬 基因搜索过滤器</div>

            {/* 证据类型 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 12 }}>证据类型 (Evidence Type)</div>
              <Select
                mode="multiple"
                placeholder="选择证据类型"
                value={evidenceTypeFilter}
                onChange={(v) => setEvidenceTypeFilter(v)}
                style={{ width: "100%" }}
                options={[
                  { value: "DEG", label: "DEG (差异表达)" },
                  { value: "Expression", label: "Expression (表达量)" },
                  { value: "Marker", label: "Marker (标记基因)" },
                  { value: "Peak-gene", label: "Peak-gene link" },
                ]}
              />
            </div>

            {/* 调控方向 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 12 }}>调控方向 (Regulation)</div>
              <Select
                placeholder="选择调控方向"
                value={regulationDirection}
                onChange={(v) => setRegulationDirection(v)}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "全部" },
                  { value: "up", label: "仅上调" },
                  { value: "down", label: "仅下调" },
                ]}
              />
            </div>

            {/* FDR阈值 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 12 }}>FDR阈值: {fdrThreshold}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Slider
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={fdrThreshold}
                  onChange={(v) => setFdrThreshold(v)}
                  style={{ flex: 1 }}
                />
                <InputNumber
                  value={fdrThreshold}
                  onChange={(v) => setFdrThreshold(v || 0.05)}
                  min={0.001}
                  max={1}
                  step={0.01}
                  style={{ width: 60 }}
                  size="small"
                />
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>常用: 0.01, 0.05</div>
            </div>

            {/* logFC阈值 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 12 }}>logFC阈值: |logFC| &gt; {logfcThreshold[0]} 且 &lt; {logfcThreshold[1]}</div>
              <Slider
                range
                min={0}
                max={10}
                step={0.1}
                value={logfcThreshold}
                onChange={(v) => setLogfcThreshold(v as [number, number])}
              />
            </div>
          </div>
        </>
      )}

      {/* 物种 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>物种 (Species)</div>
        <Select
          mode="multiple"
          placeholder="选择物种"
          value={speciesFilter}
          onChange={(v) => setSpeciesFilter(v)}
          style={{ width: "100%" }}
          allowClear
          options={[
            { value: "Human", label: "Human" },
            { value: "Mouse", label: "Mouse" },
            { value: "Macaque", label: "Macaque" },
          ]}
        />
      </div>

      {/* 解剖组织 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>解剖组织 (UBERON)</div>
        <Select
          mode="multiple"
          placeholder="选择组织"
          value={tissueFilter}
          onChange={(v) => setTissueFilter(v)}
          style={{ width: "100%" }}
          allowClear
          showSearch
          options={[
            { value: "lung", label: "Lung (肺)" },
            { value: "bronchus", label: "Bronchus (支气管)" },
            { value: "trachea", label: "Trachea (气管)" },
            { value: "alveolus", label: "Alveolus (肺泡)" },
          ]}
        />
      </div>

      {/* 细胞类型 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>细胞类型 (CL)</div>
        <Select
          mode="multiple"
          placeholder="选择细胞类型"
          value={cellTypeFilter}
          onChange={(v) => setCellTypeFilter(v)}
          style={{ width: "100%" }}
          allowClear
          showSearch
          options={[
            { value: "airway-epithelial", label: "Airway epithelial cell" },
            { value: "at2-cell", label: "AT2 cell" },
            { value: "endothelial", label: "Endothelial cell" },
            { value: "fibroblast", label: "Fibroblast" },
          ]}
        />
      </div>

      {/* 组学类型 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>组学类型 (OBI)</div>
        <Select
          mode="multiple"
          placeholder="选择组学类型"
          value={omicsFilter}
          onChange={(v) => setOmicsFilter(v)}
          style={{ width: "100%" }}
          allowClear
          options={Object.entries(ONT.omics).map(([key, val]) => ({
            value: key,
            label: val.label,
          }))}
        />
      </div>

      {/* 疾病状态 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>疾病状态 (MONDO/PATO)</div>
        <Select
          mode="multiple"
          placeholder="选择疾病"
          value={diseaseFilter}
          onChange={(v) => setDiseaseFilter(v)}
          style={{ width: "100%" }}
          allowClear
          options={[
            { value: "Lung Cancer", label: "Lung Cancer" },
            { value: "COPD", label: "COPD" },
            { value: "IPF", label: "IPF" },
            { value: "Asthma", label: "Asthma" },
            { value: "Health", label: "Normal/Healthy" },
          ]}
        />
      </div>

      {/* 生命阶段 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>生命阶段 (HSAPDV)</div>
        <Select
          mode="multiple"
          placeholder="选择生命阶段"
          value={lifeStageFilter}
          onChange={(v) => setLifeStageFilter(v)}
          style={{ width: "100%" }}
          allowClear
          options={[
            { value: "Fetal", label: "Fetal" },
            { value: "Pediatric", label: "Pediatric" },
            { value: "Young", label: "Young (21-35)" },
            { value: "Adult", label: "Adult (36-55)" },
            { value: "Old", label: "Old (>50)" },
          ]}
        />
      </div>

      {/* 年龄范围 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>年龄范围: {ageRange[0]} - {ageRange[1]}</div>
        <Slider range min={0} max={100} value={ageRange} onChange={(v) => setAgeRange(v as [number, number])} />
      </div>

      {/* 性别 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>性别 (Sex)</div>
        <Select
          mode="multiple"
          placeholder="选择性别"
          value={sexFilter}
          onChange={(v) => setSexFilter(v)}
          style={{ width: "100%" }}
          allowClear
          options={[
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" },
          ]}
        />
      </div>

      {/* 数据来源 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>数据来源</div>
        <Select
          mode="multiple"
          placeholder="选择数据来源"
          value={sourceFilter}
          onChange={(v) => setSourceFilter(v)}
          style={{ width: "100%" }}
          allowClear
          options={[
            { value: "GEO", label: "GEO" },
            { value: "SRA", label: "SRA" },
            { value: "In-house", label: "In-house" },
          ]}
        />
      </div>

      {/* 访问级别 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>访问级别</div>
        <Checkbox.Group value={accessFilter} onChange={(v) => setAccessFilter(v as string[])}>
          <Space>
            <Checkbox value="Open">Open</Checkbox>
            <Checkbox value="Controlled">Controlled</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* 发布状态 - 仅admin/curator可见 */}
      {(user?.name === "super" || user?.role === "curator") && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>发布状态</div>
          <Checkbox.Group value={statusFilter} onChange={(v) => setStatusFilter(v as string[])}>
            <Space direction="vertical">
              <Checkbox value="Published">Published</Checkbox>
              <Checkbox value="In Review">In Review</Checkbox>
              <Checkbox value="Draft">Draft</Checkbox>
            </Space>
          </Checkbox.Group>
        </div>
      )}

      <Button onClick={clearAllFilters} block style={{ marginTop: 16 }}>清除全部过滤条件</Button>
    </div>
  );

  return (
    <div style={{ display: "flex", maxWidth: "80vw", margin: "24px auto", padding: "0 24px", gap: 24 }}>
      {/* Left Sidebar - Filters */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            🔍 筛选面板
          </div>
          {filterPanel}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Statistics Overview */}

        {/* Page Header with Upload Button and Advanced Query Builder */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>数据集 (Datasets)</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Popconfirm
              title="高级查询构建器"
              description={
                <div style={{ padding: 8, minWidth: 380 }}>
                  {queryConditions.map((condition, idx) => (
                    <div key={idx} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                      {idx > 0 && (
                        <Select
                          value="AND"
                          style={{ width: 60 }}
                          size="small"
                          options={[{ value: "AND", label: "AND" }, { value: "OR", label: "OR" }]}
                        />
                      )}
                      <Select
                        value={condition.field}
                        onChange={(v) => { const nc = [...queryConditions]; nc[idx].field = v; setQueryConditions(nc); }}
                        style={{ width: 100 }}
                        size="small"
                        options={[
                          { value: "tissue", label: "组织" },
                          { value: "cells", label: "细胞" },
                          { value: "omics_type", label: "组学" },
                          { value: "age", label: "年龄" },
                          { value: "disease", label: "疾病" },
                          { value: "species", label: "物种" },
                        ]}
                      />
                      <Select
                        value={condition.operator}
                        onChange={(v) => { const nc = [...queryConditions]; nc[idx].operator = v; setQueryConditions(nc); }}
                        style={{ width: 80 }}
                        size="small"
                        options={[
                          { value: "CONTAINS", label: "包含" },
                          { value: "EQUALS", label: "等于" },
                          { value: "IN", label: "在...中" },
                          { value: "BETWEEN", label: "介于" },
                        ]}
                      />
                      <Input placeholder="值" size="small" style={{ width: 100 }} />
                      <Button size="small" danger icon="-" onClick={() => setQueryConditions(queryConditions.filter((_, i) => i !== idx))} />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                    <Button size="small" onClick={() => setQueryConditions([...queryConditions, { field: "tissue", operator: "CONTAINS", value: "" }])}>+</Button>
                    <Button size="small" onClick={() => setQueryConditions([{ field: "tissue", operator: "CONTAINS", value: "" }])}>清空</Button>
                    <Button type="primary" size="small" onClick={() => {}}>查询</Button>
                  </div>
                </div>
              }
              open={showAdvancedBuilder}
              onOpenChange={(open) => setShowAdvancedBuilder(open)}
              okText="关闭"
              cancelText=""
              okButtonProps={{ style: { display: queryConditions.length > 0 ? "none" : "inline-flex" } }}
            >
              <Button>🔧 高级查询</Button>
            </Popconfirm>
            {user && (
              <Button type="primary" onClick={() => setShowUpload(true)}>
                + Upload Dataset
              </Button>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 16 }}>
          <div
            onClick={() => clearAllFilters()}
            style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: speciesFilter.length || omicsFilter.length || diseaseFilter.length || tissueFilter.length ? "2px solid #3B82F6" : "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "#3B82F6" }}>{INIT_DS.length}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Datasets</div>
          </div>
          <div
            onClick={() => {}}
            style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "#10B981" }}>1,284</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Samples</div>
          </div>
          <div
            onClick={() => speciesFilter.length ? setSpeciesFilter([]) : setSpeciesFilter([...new Set(INIT_DS.map(d => d.species))])}
            style={{ background: speciesFilter.length ? "#F0F9FF" : "#fff", borderRadius: 12, padding: "16px 20px", border: speciesFilter.length ? "2px solid #8B5CF6" : "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "#8B5CF6" }}>{new Set(INIT_DS.map(d => d.species)).size}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Species</div>
          </div>
          <div
            onClick={() => tissueFilter.length ? setTissueFilter([]) : setTissueFilter([...new Set(INIT_DS.map(d => d.tissue))])}
            style={{ background: tissueFilter.length ? "#FFFBEB" : "#fff", borderRadius: 12, padding: "16px 20px", border: tissueFilter.length ? "2px solid #F59E0B" : "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "#F59E0B" }}>{new Set(INIT_DS.map(d => d.tissue)).size}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Tissues</div>
          </div>
          <div
            onClick={() => omicsFilter.length ? setOmicsFilter([]) : setOmicsFilter([...new Set(INIT_DS.map(d => d.omicsType))])}
            style={{ background: omicsFilter.length ? "#FEF2F2" : "#fff", borderRadius: 12, padding: "16px 20px", border: omicsFilter.length ? "2px solid #EF4444" : "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "#EF4444" }}>{new Set(INIT_DS.map(d => d.omicsType)).size}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Omics</div>
          </div>
        </div>

        {/* Gene Signature Search */}
        {/* <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            🧬 基因签名搜索 (Gene Signature Search)
          </div>
          <Input.TextArea
            value={geneSearchText}
            onChange={(e) => setGeneSearchText(e.target.value)}
            placeholder="输入基因名（每行一个，或逗号分隔）例如: TP53, EGFR, KRAS"
            rows={2}
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <Radio.Group value={geneSearchMode} onChange={(e) => setGeneSearchMode(e.target.value)}>
              <Radio value="AND">AND (全部命中)</Radio>
              <Radio value="OR">OR (任意命中)</Radio>
              <Radio value="threshold">
                自定义比例 ≥
                <InputNumber
                  value={geneThreshold}
                  onChange={(v) => setGeneThreshold(v || 50)}
                  min={0}
                  max={100}
                  style={{ width: 60, marginLeft: 4 }}
                  size="small"
                />
                %
              </Radio>
            </Radio.Group>
            <Button type="primary" onClick={handleGeneSearch}>搜索</Button>
          </div>

          {/* Gene Search Results */}
          {showGeneResults && (
            <div style={{ marginTop: 16, padding: 12, background: "#F8FAFC", borderRadius: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                基因搜索结果 ({mockGeneResults.length} 个数据集)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mockGeneResults.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/datasets/${r.id}`)}
                    style={{
                      background: "#fff",
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      命中: {r.hitGenes}/{r.totalGenes} ({Math.round(r.hitGenes/r.totalGenes*100)}%)
                      <Tag color="blue" style={{ marginLeft: 8 }}>{r.matchedGenes.join(", ")}</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}

        {/* Filter Toggle & Quick Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Button onClick={() => setShowFilterDrawer(true)}>高级筛选</Button>

          {/* Quick tissue filters */}
          {["Bronchus", "Trachea", "Alveolus"].map((t) => (
            <Button
              key={t}
              size="small"
              type={tissueFilter.includes(t.toLowerCase()) ? "primary" : "default"}
              onClick={() => setTissueFilter(tissueFilter.includes(t.toLowerCase()) ? [] : [t.toLowerCase()])}
            >
              🫁 {t}
            </Button>
          ))}

          {/* Quick omics filters */}
          {Object.entries(ONT.omics).slice(0, 3).map(([key, val]) => (
            <Button
              key={key}
              size="small"
              style={{ background: omicsFilter.includes(key) ? val.color : undefined, color: omicsFilter.includes(key) ? "#fff" : undefined }}
              onClick={() => setOmicsFilter(omicsFilter.includes(key) ? omicsFilter.filter(o => o !== key) : [...omicsFilter, key])}
            >
              {val.label}
            </Button>
          ))}
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div style={{ background: "#F0F9FF", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>已筛选：</span>
            {activeFilters.map((f) => (
              <Tag
                key={f.key}
                closable
                onClose={f.onRemove}
                color="blue"
                style={{ padding: "4px 8px" }}
              >
                {f.label} ×
              </Tag>
            ))}
            <Button size="small" type="link" onClick={clearAllFilters} style={{ color: "#EF4444", fontSize: 12 }}>
              清除全部
            </Button>
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#6B7280" }}>
              共找到 {filtered.length} 个数据集
            </span>
          </div>
        )}
        {/* Dataset List */}
        {filtered.map((ds) => (
          <div
            key={ds.id}
            onClick={() => navigate(`/datasets/${ds.id}`)}
            style={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderLeft: `4px solid ${ONT.omics[ds.omicsType]?.color || "#3B82F6"}`,
              borderRadius: 10,
              padding: 18,
              marginBottom: 12,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>{ds.name}</span>
                  <SDot s={ds.status} />
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{ds.id}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, lineHeight: 1.5 }}>
                  {ds.description}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <OTag term={ds.tissue} id={ONT.tissues[ds.tissue]?.id} />
                  <OTag term={ds.species} id={ONT.species[ds.species]?.id} />
                  <Badge color={ONT.omics[ds.omicsType]?.color || "#3B82F6"}>{ds.omicsType}</Badge>
                  <Badge color={ONT.diseases[ds.disease]?.color || "#10B981"}>{ds.disease}</Badge>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                {[[ds.samples_meta.length, "Samples", "#3B82F6"], [ds.degs.length, "DEGs", "#EF4444"], [ds.files?.length || 0, "Files", "#8B5CF6"]].map(([v, l, c]) => (
                  <div key={l} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 52 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <Empty description="没有匹配的数据集" style={{ padding: 60 }} />
        )}
      </div>

      {/* Upload Wizard */}
      {showUpload && <UploadWizard onClose={() => setShowUpload(false)} onSubmit={(data) => console.log("Upload:", data)} />}

      {/* Filter Drawer for mobile/responsive */}
      <Drawer
        title="筛选面板"
        placement="right"
        onClose={() => setShowFilterDrawer(false)}
        open={showFilterDrawer}
        width={320}
      >
        {filterPanel}
      </Drawer>
    </div>
  );
}
