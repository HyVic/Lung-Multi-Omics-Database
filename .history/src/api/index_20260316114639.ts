// API service layer - uses axios to call backend API

import { request } from "./request";
import type { User } from "../data/users";
import { INIT_DS, Dataset } from "../data/datasets";
import { NAV_ITEMS, NavItem } from "../data/navigation";
import { SITE_INFO } from "../data/navigation";
import { TOOLS, Tool } from "../data/tools";
import { TOOL_CATEGORIES } from "../data/tools";
import { ONTOLOGY_TREE, OntologyNode } from "../data/ontology";
import { ARCHITECTURE_SECTIONS, ArchitectureSection } from "../data/architecture";
import { HOMEPAGE_STATS, StatItem } from "../data/homepage";
import { ONTOLOGY_COVERAGE, OntologyCoverage } from "../data/homepage";
import { POPULAR_TAGS, PopularTag } from "../data/homepage";

// Simulate network delay (for mock APIs only)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API - calls real backend
export const authApi = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await request.post("/api/v1/user/login", { username, password });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    org: string;
    role: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await request.post("/api/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await request.post("/api/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  },
};

// Navigation API
export const navigationApi = {
  getItems: async (): Promise<NavItem[]> => {
    await delay(100);
    return NAV_ITEMS;
  },

  getSiteInfo: async () => {
    await delay(50);
    return SITE_INFO;
  },
};

// Datasets API
export const datasetsApi = {
  getAll: async (): Promise<Dataset[]> => {
    await delay(200);
    return INIT_DS;
  },

  getById: async (id: string): Promise<Dataset | undefined> => {
    await delay(150);
    return INIT_DS.find(d => d.id === id);
  },

  search: async (query: string): Promise<Dataset[]> => {
    await delay(250);
    const q = query.toLowerCase();
    return INIT_DS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tissue.toLowerCase().includes(q) ||
      d.disease.toLowerCase().includes(q)
    );
  },
};

// Tools API
export const toolsApi = {
  getAll: async (): Promise<Tool[]> => {
    await delay(150);
    return TOOLS;
  },

  getCategories: async (): Promise<string[]> => {
    await delay(100);
    return TOOL_CATEGORIES;
  },
};

// Ontology API
export const ontologyApi = {
  getTree: async (): Promise<OntologyNode[]> => {
    await delay(150);
    return ONTOLOGY_TREE;
  },
};

// Architecture API
export const architectureApi = {
  getSections: async (): Promise<ArchitectureSection[]> => {
    await delay(150);
    return ARCHITECTURE_SECTIONS;
  },
};

// Homepage API
export const homepageApi = {
  getStats: async (): Promise<StatItem[]> => {
    await delay(100);
    return HOMEPAGE_STATS;
  },

  getOntologyCoverage: async (): Promise<OntologyCoverage[]> => {
    await delay(150);
    return ONTOLOGY_COVERAGE;
  },

  getPopularTags: async (): Promise<PopularTag[]> => {
    await delay(100);
    return POPULAR_TAGS;
  },
};
