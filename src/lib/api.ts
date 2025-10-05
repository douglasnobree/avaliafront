import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333", 
  withCredentials: true,
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Erro ao processar requisição';
      console.error('API Error:', message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: Sem resposta do servidor');
      toast.error('Erro de conexão com o servidor');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api