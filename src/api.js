import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 HANDLE TOKEN EXPIRY HERE
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.clear();
      window.location.reload(); // force back to login
    }
    return Promise.reject(err);
  }
);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const assignTasks = (availability, shift, team) =>
  api.post(`/api/tasks/assign?shift=${shift}&team=${team}`, availability);

export default api;
