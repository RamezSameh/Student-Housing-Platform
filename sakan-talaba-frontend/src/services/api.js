import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7087/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Do not immediately clear the token: this can hide useful login/session errors.
      // Pages can redirect based on auth state.
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export const getApiError = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.Message) return data.Message;
  if (Array.isArray(data?.errors)) return data.errors.join(", ");
  if (data?.title) return data.title;
  return error?.message || fallback;
};

export default api;
