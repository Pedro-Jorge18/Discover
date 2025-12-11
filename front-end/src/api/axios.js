import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Route Base Laravel
  withCredentials: true, // Send cookie automatly (if use Sanctum)
  timeout: 10000,        // Avoid timeout
});

// ----- Send -----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Answers -----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Não autorizado → redirecionar para login");
      // Aqui depois podes remover token ou redirecionar:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
