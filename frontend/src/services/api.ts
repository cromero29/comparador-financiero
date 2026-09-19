import axios from 'axios';
import { API_URL } from '@config/constants';
import { ApiResponse, ComparacionFormData, ResultadoComparacion } from '../types';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies de sessionId
});

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error del servidor
      console.error('Error del servidor:', error.response.data);
    } else if (error.request) {
      // Sin respuesta del servidor
      console.error('Sin respuesta del servidor');
    } else {
      // Error al configurar request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// COMPARACIÓN
// ============================================

export const compararOfertas = async (
  data: ComparacionFormData
): Promise<ResultadoComparacion> => {
  const response = await api.post<ApiResponse<{ resultado: ResultadoComparacion }>>(
    '/comparacion',
    data
  );
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Error al comparar ofertas');
  }
  
  return response.data.data!.resultado;
};

// ============================================
// TRACKING (deprecado - usar trackingService de @services/tracking)
// ============================================
// Los endpoints /tracking/evento y /tracking/clic fueron reemplazados por
// el sistema de tracking detallado en @services/tracking.ts

// ============================================
// PRODUCTOS
// ============================================

export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};

export const getEstadisticas = async () => {
  const response = await api.get('/productos/estadisticas');
  return response.data;
};

// ============================================
// HEALTH CHECK
// ============================================

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
