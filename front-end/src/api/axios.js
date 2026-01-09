import axios from "axios";
 
const api = axios.create({

  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Interceptor para enviar automaticamente o token e idioma
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add language header
  const language = localStorage.getItem("language") || 'pt';
  config.headers['Accept-Language'] = language;
  
  return config;
});
 
export default api;