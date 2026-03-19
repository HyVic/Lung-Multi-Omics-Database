import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INIT_DS } from "../../data/datasets";
import { ONT } from "../../constants/ontology";
import { Badge, SDot, OTag } from "../../components/ui";
import { useUser } from "../../components/Layout";
import UploadWizard from "../../components/UploadWizard";
import { Input, InputNumber, Checkbox, Radio, Slider, Button, Tag, Tree, Space, Empty, Drawer } from "antd";
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
              <Checkbox.Group value={evidenceTypeFilter} onChange={(v) => setEvidenceTypeFilter(v as string[])}>
                <Space direction="vertical">
                  <Checkbox value="DEG">DEG (差异表达)</Checkbox>
                  <Checkbox value="Expression">Expression (表达量)</Checkbox>
                  <Checkbox value="Marker">Marker (标记基因)</Checkbox>
                  <Checkbox value="Peak-gene">Peak-gene link</Checkbox>
                </Space>
              </Checkbox.Group>
            </div>

            {/* 调控方向 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 12 }}>调控方向 (Regulation)</div>
              <Radio.Group value={regulationDirection} onChange={(e) => setRegulationDirection(e.target.value)}>
                <Radio value="all">全部</Radio>
                <Radio value="up">仅上调</Radio>
                <Radio value="down">仅下调</Radio>
              </Radio.Group>
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
        <Checkbox.Group value={speciesFilter} onChange={(v) => setSpeciesFilter(v as string[])}>
          <Space direction="vertical">
            <Checkbox value="Human">Human</Checkbox>
            <Checkbox value="Mouse">Mouse</Checkbox>
            <Checkbox value="Macaque">Macaque</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* 解剖组织 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>解剖组织 (UBERON)</div>
        <Tree
          checkable
          defaultExpandAll
          treeData={tissueTreeData}
          checkedKeys={tissueFilter}
          onCheck={(checked) => setTissueFilter(checked as string[])}
        />
      </div>

      {/* 细胞类型 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>细胞类型 (CL)</div>
        <Input.Search placeholder="Search cell type..." style={{ marginBottom: 8 }} />
        <Tree
          checkable
          defaultExpandAll
          treeData={cellTreeData}
          checkedKeys={cellTypeFilter}
          onCheck={(checked) => setCellTypeFilter(checked as string[])}
        />
      </div>

      {/* 组学类型 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>组学类型 (OBI)</div>
        <Checkbox.Group value={omicsFilter} onChange={(v) => setOmicsFilter(v as string[])}>
          <Space direction="vertical">
            {Object.entries(ONT.omics).map(([key, val]) => (
              <Checkbox key={key} value={key}>
                <Tag color={val.color}>{val.label}</Tag>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>

      {/* 疾病状态 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>疾病状态 (MONDO/PATO)</div>
        <Checkbox.Group value={diseaseFilter} onChange={(v) => setDiseaseFilter(v as string[])}>
          <Space direction="vertical">
            <Checkbox value="Lung Cancer">Lung Cancer</Checkbox>
            <Checkbox value="COPD">COPD</Checkbox>
            <Checkbox value="IPF">IPF</Checkbox>
            <Checkbox value="Asthma">Asthma</Checkbox>
            <Checkbox value="Health">Normal/Healthy</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* 生命阶段 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>生命阶段 (HSAPDV)</div>
        <Checkbox.Group value={lifeStageFilter} onChange={(v) => setLifeStageFilter(v as string[])}>
          <Space direction="vertical">
            <Checkbox value="Fetal">Fetal</Checkbox>
            <Checkbox value="Pediatric">Pediatric</Checkbox>
            <Checkbox value="Young">Young (21-35)</Checkbox>
            <Checkbox value="Adult">Adult (36-55)</Checkbox>
            <Checkbox value="Old">Old ({'>'}50)</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* 年龄范围 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>年龄范围: {ageRange[0]} - {ageRange[1]}</div>
        <Slider range min={0} max={100} value={ageRange} onChange={(v) => setAgeRange(v as [number, number])} />
      </div>

      {/* 性别 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>性别 (Sex)</div>
        <Checkbox.Group value={sexFilter} onChange={(v) => setSexFilter(v as string[])}>
          <Space>
            <Checkbox value="Female">Female</Checkbox>
            <Checkbox value="Male">Male</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* 数据来源 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>数据来源</div>
        <Checkbox.Group value={sourceFilter} onChange={(v) => setSourceFilter(v as string[])}>
          <Space direction="vertical">
            <Checkbox value="GEO">GEO</Checkbox>
            <Checkbox value="SRA">SRA</Checkbox>
            <Checkbox value="In-house">In-house</Checkbox>
          </Space>
        </Checkbox.Group>
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
        {/* Gene Signature Search */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #E2E8F0" }}>
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
        </div>

        {/* Advanced Query Builder */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setShowAdvancedBuilder(!showAdvancedBuilder)}>
            <span>{showAdvancedBuilder ? "▼" : "▶"}</span>
            <span>🔧 高级查询构建器 (Advanced Query Builder)</span>
          </div>

          {showAdvancedBuilder && (
            <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
                为熟悉本体体系的高级用户提供可视化多条件组合查询界面
              </div>

              {queryConditions.map((condition, idx) => (
                <div key={idx} style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {idx > 0 && (
                    <Select
                      value={idx === 1 ? "AND" : "AND"}
                      style={{ width: 80 }}
                      size="small"
                      options={[
                        { value: "AND", label: "AND" },
                        { value: "OR", label: "OR" },
                      ]}
                    />
                  )}
                  <Select
                    value={condition.field}
                    onChange={(v) => {
                      const newConditions = [...queryConditions];
                      newConditions[idx].field = v;
                      setQueryConditions(newConditions);
                    }}
                    style={{ width: 140 }}
                    size="small"
                    options={[
                      { value: "tissue", label: "组织 (tissue)" },
                      { value: "cells", label: "细胞类型 (cells)" },
                      { value: "omics_type", label: "组学类型 (omics)" },
                      { value: "age", label: "年龄 (age)" },
                      { value: "disease", label: "疾病 (disease)" },
                      { value: "species", label: "物种 (species)" },
                      { value: "sex", label: "性别 (sex)" },
                      { value: "source", label: "数据来源 (source)" },
                    ]}
                  />
                  <Select
                    value={condition.operator}
                    onChange={(v) => {
                      const newConditions = [...queryConditions];
                      newConditions[idx].operator = v;
                      setQueryConditions(newConditions);
                    }}
                    style={{ width: 100 }}
                    size="small"
                    options={[
                      { value: "CONTAINS", label: "CONTAINS" },
                      { value: "EQUALS", label: "EQUALS" },
                      { value: "IN", label: "IN" },
                      { value: "BETWEEN", label: "BETWEEN" },
                      { value: ">", label: ">" },
                      { value: "<", label: "<" },
                    ]}
                  />
                  {condition.operator === "BETWEEN" ? (
                    <InputNumber placeholder="最小值" size="small" style={{ width: 80 }} />
                  ) : condition.operator === "IN" ? (
                    <Input.TextArea placeholder="多个值用逗号分隔" size="small" style={{ width: 200, minHeight: 24 }} />
                  ) : (
                    <Input placeholder="输入值" size="small" style={{ width: 200 }} />
                  )}
                  <Button size="small" danger icon="-" onClick={() => setQueryConditions(queryConditions.filter((_, i) => i !== idx))} />
                </div>
              ))}

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Button size="small" onClick={() => setQueryConditions([...queryConditions, { field: "tissue", operator: "CONTAINS", value: "" }])}>
                  + 添加条件
                </Button>
                <Button size="small" onClick={() => setQueryConditions([{ field: "tissue", operator: "CONTAINS", value: "" }])}>
                  清空
                </Button>
                <Button type="primary" size="small" onClick={() => {}}>
                  🔍 执行查询
                </Button>
              </div>
            </div>
          )}
        </div>


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
