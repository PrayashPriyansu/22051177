import axios from "axios";

const API_BASE_URL = "http://20.244.56.144/evaluation-service";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default api;
