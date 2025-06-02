import axios, { AxiosError } from 'axios';
import { ApiError } from '@/lib/types/product';

/**
 * Cliente API configurado para comunicarse con FastAPI.
 */
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        // Extraer mensaje de error del backend
        const message = error.response?.data?.detail || 'Error en la solicitud';

        // Crear error personalizado con mensaje del backend
        const customError = new Error(message) as Error & {
            status?: number;
            originalError: AxiosError;
        };

        customError.status = error.response?.status;
        customError.originalError = error;

        return Promise.reject(customError);
    }
);

export default apiClient;