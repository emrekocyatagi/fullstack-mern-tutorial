import axios from "axios";

// In development, we want to use the local backend server, and in production, we want to use the same origin (which will be the deployed backend server).
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;