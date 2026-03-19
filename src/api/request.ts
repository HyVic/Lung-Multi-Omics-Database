import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// Get owner from environment variable
const OWNER = import.meta.env.VITE_OWNER || import.meta.env.REACT_APP_OWNER || "";

// Create axios instance - use proxy in dev, direct URL in production
export const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL
    : "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token to headers if available
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add owner to headers from environment variable
    if (OWNER && config.headers) {
      config.headers["X-Owner"] = OWNER;
    }

    // Also add owner as query parameter for GET requests
    if (OWNER && config.method === "get" && config.params) {
      config.params.owner = OWNER;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors globally
request.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as Record<string, unknown>)?.message || "An error occurred";
      console.error("API Error:", message);

      // Handle 401 unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error: No response from server");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
