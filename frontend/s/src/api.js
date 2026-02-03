export const API_BACKEND = "http://localhost:8000"; // FastAPI (ML backend)
export const API_WEBHOOK = "http://localhost:3001"; // Node.js (webhook microservice)
export const API_AUTH = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080"; // Auth service
