import axios from "axios";

const api = axios.create({
  // URL DO BACKEND: 127.0.0.1:8000
  baseURL: "http://127.0.0.1:8000/api",
  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;