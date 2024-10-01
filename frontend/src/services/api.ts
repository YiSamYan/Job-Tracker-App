import axios from "axios";

// Base URL for the API
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : process.env.REACT_APP_BACKEND_URL;

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to include the JWT token in every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken"); // Get token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (token expired or invalid)
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Get all jobs for the authenticated user
export const fetchJobs = async () => {
  const response = await api.get("/jobs/");
  return response.data;
};

// Get a specific job by ID
export const fetchJobById = async (id: number) => {
  const response = await api.get(`/jobs/${id}/`);
  return response.data;
};

// Add a new job for the authenticated user
export const addJob = async (job: {
  title: string;
  company: string;
  status: string;
  description: string;
  requirements: string;
}) => {
  const response = await api.post("/jobs/", job);
  return response.data;
};

// Update an existing job
export const updateJob = async (
  id: number,
  job: {
    title: string;
    company: string;
    status: string;
    description: string;
    requirements: string;
  }
) => {
  const response = await api.put(`/jobs/${id}/`, job);
  return response.data;
};

// Delete a job
export const deleteJob = async (id: number) => {
  await api.delete(`/jobs/${id}/`);
};

// Scrape job details from the given URL
export const scrapeJob = async (jobUrl: string) => {
  try {
    const response = await api.post("/jobs/scrape/", { url: jobUrl });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error scraping job details:", error.response.data);
      throw new Error(
        error.response.data.error || "Error scraping job details."
      );
    } else {
      console.error("Network or other error:", error);
      throw new Error("Network error. Please try again.");
    }
  }
};

export default api;
