export const API_BACKEND = "http://localhost:8000"; // FastAPI (ML backend)
export const API_WEBHOOK = "http://localhost:3001"; // Node.js (webhook microservice)
export const API_AUTH = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080"; // Auth service

/** Headers for authenticated requests to the ML backend (JWT from auth service). */
export function getBackendAuthHeaders() {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
