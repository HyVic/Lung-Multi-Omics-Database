import { useState } from "react";
import { Layout as AntLayout, Menu, Card, Typography, Space, Badge, Button, Table, Tag, Avatar, Dropdown, Modal, Form, Input, Select, Radio, message, Tabs, Tree } from "antd";
import { UserOutlined, DatabaseOutlined, BranchesOutlined, TableOutlined, SettingOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined, SyncOutlined, HistoryOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Header, Sider, Content } = AntLayout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

// ==================== Types ====================
interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "researcher" | "user";
  status: "active" | "inactive" | "pending";
  registrationDate: string;
  datasetCount: number;
}

interface Dataset {
  id: string;
  name: string;
  owner: string;
  status: "draft" | "pending" | "published" | "rejected";
  accessLevel: "Open" | "Controlled";
  createdAt: string;
  disease: string;
}

interface Ontology {
  id: string;
  name: string;
  version: string;
  termCount: number;
  lastSync: string;
  status: "normal" | "pending";
}

interface OntologyTerm {
  key: string;
  label: string;
  definition?: string;
  synonyms?: string[];
  parent?: string;
  ontologyId: string;
  datasetCount: number;
  children?: OntologyTerm[];
}

interface GeneMapping {
  id: string;
  originalGene: string;
  datasetName: string;
  status: "unmapped" | "ambiguous" | "mapped";
  suggestions?: string[];
}

// ==================== Mock Data ====================
const mockUsers: User[] = [
  { id: "1", username: "dr_chen", email: "chen@hospital.org", role: "researcher", status: "active", registrationDate: "2025-01-15", datasetCount: 5 },
  { id: "2", username: "prof_zhang", email: "zhang@university.edu", role: "researcher", status: "active", registrationDate: "2025-02-20", datasetCount: 12 },
  { id: "3", username: "new_user123", email: "new@email.com", role: "user", status: "pending", registrationDate: "2025-11-10", datasetCount: 0 },
  { id: "4", username: "lab_wang", email: "wang@lab.org", role: "researcher", status: "inactive", registrationDate: "2024-08-05", datasetCount: 3 },
  { id: "5", username: "admin", email: "admin@lungomics.org", role: "admin", status: "active", registrationDate: "2024-01-01", datasetCount: 0 },
];

const mockDatasets: Dataset[] = [
  { id: "DS001", name: "Lung Cancer RNA-seq Study A", owner: "dr_chen", status: "published", accessLevel: "Open", createdAt: "2025-03-15", disease: "Lung Cancer" },
  { id: "DS002", name: "COPD Transcriptome Data", owner: "prof_zhang", status: "pending", accessLevel: "Controlled", createdAt: "2025-11-01", disease: "COPD" },
  { id: "DS003", name: "IPF Gene Expression", owner: "dr_chen", status: "draft", accessLevel: "Open", createdAt: "2025-10-20", disease: "IPF" },
  { id: "DS004", name: "Asthma scRNA-seq", owner: "lab_wang", status: "rejected", accessLevel: "Open", createdAt: "2025-09-10", disease: "Asthma" },
  { id: "DS005", name: "Normal Lung Bulk RNA", owner: "prof_zhang", status: "published", accessLevel: "Open", createdAt: "2025-02-28", disease: "Normal" },
];

const mockOntologies: Ontology[] = [
  { id: "UBERON", name: "UBERON", version: "2024-03", termCount: 87, lastSync: "2025-11-01 03:00", status: "normal" },
  { id: "CL", name: "CL", version: "2024-04", termCount: 42, lastSync: "2025-11-01 03:00", status: "normal" },
  { id: "OBI", name: "OBI", version: "2024-02", termCount: 8, lastSync: "2025-11-01 03:00", status: "normal" },
  { id: "MONDO", name: "MONDO", version: "2024-03", termCount: 12, lastSync: "2025-11-01 03:00", status: "normal" },
  { id: "PATO", name: "PATO", version: "2023-11", termCount: 3, lastSync: "2025-11-01 03:00", status: "normal" },
  { id: "NCBITaxon", name: "NCBITaxon", version: "2024-01", termCount: 3, lastSync: "2025-11-01 03:00", status: "normal" },
  { id: "HSAPDV", name: "HSAPDV", version: "2023-09", termCount: 6, lastSync: "2025-10-15 03:00", status: "pending" },
];

const mockGeneMappings: GeneMapping[] = [
  { id: "1", originalGene: "GeneXXX", datasetName: "DS001", status: "unmapped" },
  { id: "2", originalGene: "LOC123456", datasetName: "DS001", status: "unmapped" },
  { id: "3", originalGene: "IGHV3-23", datasetName: "DS003", status: "ambiguous", suggestions: ["IGHV3-23", "IGHV3-30", "IGHV3-33"] },
  { id: "4", originalGene: "TP53", datasetName: "DS002", status: "mapped" },
];

// ==================== Sub-Components ====================

// 5.7.1 User Management
function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessRequest, setAccessRequest] = useState<{id: string; dataset: string; user: string; status: string} | null>(null);

  const columns: ColumnsType<User> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#3B82F6" }}>{record.username[0].toUpperCase()}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.username}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : role === "researcher" ? "blue" : "default"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge status={status === "active" ? "success" : status === "pending" ? "warning" : "default"} text={status} />
      ),
    },
    {
      title: "Registered",
      dataIndex: "registrationDate",
      key: "registrationDate",
    },
    {
      title: "Datasets",
      dataIndex: "datasetCount",
      key: "datasetCount",
      render: (count: number) => <Tag>{count}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedUser(record); setShowUserModal(true); }}>Edit</Button>
          <Button size="small" danger={record.status === "active"} icon={record.status === "active" ? <CloseOutlined /> : <CheckOutlined />} onClick={() => {
            setUsers(users.map(u => u.id === record.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
          }}>
            {record.status === "active" ? "Disable" : "Enable"}
          </Button>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(searchText.toLowerCase()) || u.email.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4} style={{ margin: 0 }}>User Management</Title>
        <Space>
          <Search placeholder="Search users..." onChange={(e) => setSearchText(e.target.value)} style={{ width: 200 }} />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
          <Select value={roleFilter} onChange={setRoleFilter} style={{ width: 120 }}>
            <Select.Option value="all">All Roles</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="researcher">Researcher</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={filteredUsers} rowKey="id" pagination={{ pageSize: 10 }} />

        {/* Pending Access Requests Section */}
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Data Access Requests (Pending)</Title>
          <Table
            dataSource={[
              { id: "1", user: "dr_chen", dataset: "DS002 - COPD Transcriptome Data", requestDate: "2025-11-08", status: "pending", contact: "prof_zhang@university.edu" },
              { id: "2", user: "lab_wang", dataset: "DS005 - Normal Lung Bulk RNA", requestDate: "2025-11-07", status: "pending", contact: "prof_zhang@university.edu" },
            ]}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "User", dataIndex: "user", key: "user" },
              { title: "Dataset", dataIndex: "dataset", key: "dataset" },
              { title: "Request Date", dataIndex: "requestDate", key: "requestDate" },
              { title: "Uploader Contact", dataIndex: "contact", key: "contact" },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Space>
                    <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => message.success("Access granted")}>Approve</Button>
                    <Button danger size="small" icon={<CloseOutlined />} onClick={() => message.info("Access denied")}>Reject</Button>
                  </Space>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {/* Edit User Modal */}
      <Modal title="Edit User" open={showUserModal} onCancel={() => setShowUserModal(false)} onOk={() => { setShowUserModal(false); message.success("User updated"); }}>
        {selectedUser && (
          <Form layout="vertical">
            <Form.Item label="Username">
              <Input value={selectedUser.username} disabled />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={selectedUser.email} />
            </Form.Item>
            <Form.Item label="Role">
              <Radio.Group value={selectedUser.role} onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                <Radio value="admin">Admin</Radio>
                <Radio value="researcher">Researcher</Radio>
                <Radio value="user">User</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}

// 5.7.2 Dataset Management
function DatasetManagement() {
  const [datasets, setDatasets] = useState<Dataset[]>(mockDatasets);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const columns: ColumnsType<Dataset> = [
    {
      title: "Dataset",
      key: "dataset",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{record.id}</div>
        </div>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "published" ? "green" : status === "pending" ? "orange" : status === "draft" ? "default" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Access",
      dataIndex: "accessLevel",
      key: "accessLevel",
      render: (level: string) => <Tag color={level === "Open" ? "blue" : "purple"}>{level}</Tag>,
    },
    {
      title: "Disease",
      dataIndex: "disease",
      key: "disease",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedDataset(record); setShowEditModal(true); }}>Edit</Button>
          {record.status === "pending" && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => {
                setDatasets(datasets.map(d => d.id === record.id ? { ...d, status: "published" } : d));
                message.success("Dataset published");
              }}>Publish</Button>
              <Button danger size="small" icon={<CloseOutlined />} onClick={() => {
                setDatasets(datasets.map(d => d.id === record.id ? { ...d, status: "rejected" } : d));
                message.info("Dataset rejected");
              }}>Reject</Button>
            </>
          )}
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => {
            Modal.confirm({ title: "Delete Dataset", content: "Are you sure you want to delete this dataset?", onOk: () => message.success("Dataset deleted") });
          }}>Delete</Button>
        </Space>
      ),
    },
  ];

  const filteredDatasets = datasets.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4} style={{ margin: 0 }}>Dataset Management</Title>
        <Space>
          <Search placeholder="Search datasets..." onChange={(e) => setSearchText(e.target.value)} style={{ width: 200 }} />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="published">Published</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
          <Button icon={<TableOutlined />}>Batch Operations</Button>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={filteredDatasets} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      {/* Edit Dataset Modal */}
      <Modal title="Edit Dataset Metadata" open={showEditModal} onCancel={() => setShowEditModal(false)} onOk={() => { setShowEditModal(false); message.success("Dataset updated"); }} width={600}>
        {selectedDataset && (
          <Form layout="vertical" initialValues={selectedDataset}>
            <Form.Item label="Dataset Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Disease" name="disease">
              <Input />
            </Form.Item>
            <Form.Item label="Access Level" name="accessLevel">
              <Radio.Group>
                <Radio value="Open">Open</Radio>
                <Radio value="Controlled">Controlled</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}

// 5.7.3 Ontology Management
function OntologyManagement() {
  const [activeOntology, setActiveOntology] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const ontologyColumns: ColumnsType<Ontology> = [
    { title: "Ontology", dataIndex: "name", key: "name", render: (name: string) => <strong>{name}</strong> },
    { title: "Version", dataIndex: "version", key: "version" },
    { title: "Term Count", dataIndex: "termCount", key: "termCount" },
    { title: "Last Sync", dataIndex: "lastSync", key: "lastSync" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        status === "normal" ? <Badge status="success" text="Normal" /> : <Badge status="warning" text="Pending Sync" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => setActiveOntology(record.id)}>View</Button>
          <Button size="small" icon={<SyncOutlined />}>Sync</Button>
          <Button size="small" icon={<HistoryOutlined />}>History</Button>
        </Space>
      ),
    },
  ];

  // Mock tree data for CL ontology
  const clTreeData = [
    {
      key: "1",
      title: "Airway epithelial cell (CL:0000082)",
      datasetCount: 12,
      children: [
        { key: "1-1", title: "Ciliated cell (CL:0000064)", datasetCount: 7 },
        { key: "1-2", title: "Goblet cell (CL:0000160)", datasetCount: 5 },
        { key: "1-3", title: "Club cell (CL:0000158)", datasetCount: 4 },
        { key: "1-4", title: "Basal cell (CL:0000646)", datasetCount: 3 },
      ],
    },
    {
      key: "2",
      title: "AT2 cell (CL:0002063)",
      datasetCount: 8,
      children: [],
    },
    {
      key: "3",
      title: "Endothelial cell (CL:0000115)",
      datasetCount: 4,
      children: [],
    },
    {
      key: "4",
      title: "Fibroblast (CL:0000057)",
      datasetCount: 3,
      children: [],
    },
  ];

  return (
    <div>
      <Title level={4}>Ontology Management</Title>

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          <Card>
            <Table columns={ontologyColumns} dataSource={mockOntologies} rowKey="id" pagination={false} />
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text>Platform average ontology coverage: <strong>96.4%</strong></Text>
              <Space>
                <Text type="secondary">Unmapped term requests: 3 pending</Text>
                <Button icon={<SyncOutlined />}>Sync All</Button>
                <Button icon={<DownloadOutlined />}>Download Report</Button>
              </Space>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="Term Browser" key="browser">
          {activeOntology ? (
            <Card
              title={
                <Space>
                  <span>{activeOntology} - Term Browser</span>
                  <Input
                    placeholder="Search terms..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Space>
              }
              extra={<Button onClick={() => setActiveOntology(null)}>Back to Overview</Button>}
            >
              <Tree
                showLine
                defaultExpandAll
                treeData={clTreeData.map((node: any) => ({
                  key: node.key,
                  title: (
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>{node.title}</span>
                      <Tag color="blue">[{node.datasetCount} datasets]</Tag>
                    </div>
                  ),
                  children: node.children?.map((child: any) => ({
                    key: child.key,
                    title: (
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{child.title}</span>
                        <Tag>[{child.datasetCount}]</Tag>
                      </div>
                    ),
                  })),
                }))}
              />
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>
                <ExclamationCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>Please select an ontology from the Overview tab to browse terms.</p>
              </div>
            </Card>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
}

// 5.7.4 Gene Mapping Management
function GeneMappingManagement() {
  const [mappings, setMappings] = useState<GeneMapping[]>(mockGeneMappings);
  const [datasetFilter, setDatasetFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const columns: ColumnsType<GeneMapping> = [
    { title: "Original Gene", dataIndex: "originalGene", key: "originalGene", render: (v: string) => <code>{v}</code> },
    { title: "Dataset", dataIndex: "datasetName", key: "datasetName" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "mapped" ? "green" : status === "ambiguous" ? "orange" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Suggestions",
      dataIndex: "suggestions",
      key: "suggestions",
      render: (suggestions: string[] | undefined) => (
        suggestions ? (
          <Space direction="vertical" size={0}>
            {suggestions.map((s, i) => <Tag key={i}>{s}</Tag>)}
          </Space>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === "unmapped" && (
            <Button size="small" type="primary" icon={<EditOutlined />}>Map</Button>
          )}
          {record.status === "ambiguous" && (
            <>
              <Button size="small" icon={<CheckOutlined />}>Select</Button>
              <Button size="small">Ignore</Button>
            </>
          )}
          {record.status === "mapped" && (
            <Button size="small" icon={<EditOutlined />}>Edit</Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredMappings = mappings.filter(m => {
    const matchDataset = datasetFilter === "all" || m.datasetName === datasetFilter;
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchDataset && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4} style={{ margin: 0 }}>Unmapped Gene Queue ({filteredMappings.length})</Title>
        <Space>
          <Select value={datasetFilter} onChange={setDatasetFilter} style={{ width: 150 }}>
            <Select.Option value="all">All Datasets</Select.Option>
            <Select.Option value="DS001">DS001</Select.Option>
            <Select.Option value="DS002">DS002</Select.Option>
            <Select.Option value="DS003">DS003</Select.Option>
          </Select>
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="unmapped">Unmapped</Select.Option>
            <Select.Option value="ambiguous">Ambiguous</Select.Option>
            <Select.Option value="mapped">Mapped</Select.Option>
          </Select>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={filteredMappings} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}

// ==================== Main Admin Console ====================
export default function AdminConsole() {
  const [selectedKey, setSelectedKey] = useState("users");

  const menuItems: MenuProps["items"] = [
    { key: "users", icon: <TeamOutlined />, label: "User Management" },
    { key: "datasets", icon: <DatabaseOutlined />, label: "Dataset Management" },
    { key: "ontology", icon: <BranchesOutlined />, label: "Ontology" },
    { key: "genemapping", icon: <TableOutlined />, label: "Gene Mapping" },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "users":
        return <UserManagement />;
      case "datasets":
        return <DatasetManagement />;
      case "ontology":
        return <OntologyManagement />;
      case "genemapping":
        return <GeneMappingManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#1E293B" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155" }}>
          <Space>
            <SettingOutlined style={{ color: "#60A5FA", fontSize: 18 }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Admin Console</span>
          </Space>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={menuItems}
          style={{ background: "#1E293B", color: "#94A3B8", borderRight: 0 }}
        />
      </Sider>
      <AntLayout>
        <Content style={{ padding: "24px", background: "#F0F4F8" }}>
          {renderContent()}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
