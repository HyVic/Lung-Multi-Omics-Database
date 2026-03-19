// Navigation data for the application

export interface NavItem {
  key: string;
  label: string;
  path: string;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Overview", path: "/" },
  { key: "datasets", label: "Datasets", path: "/datasets" },
  { key: "ontology", label: "Ontology", path: "/ontology" },
  { key: "tools", label: "Tools", path: "/ontology/tools" },
  { key: "architecture", label: "Architecture", path: "/architecture" },
  { key: "admin", label: "Admin", path: "/admin", adminOnly: true },
];

// Site branding info
export const SITE_INFO = {
  name: "LungOmics",
  version: "BETA",
  logo: "🫁",
};
