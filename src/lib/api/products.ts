import apiClient from './client';
import {
    Product,
    ProductCreate,
    ProductUpdate,
    ProductListResponse,
    ProductFilters,
} from '@/lib/types/product';

/**
 * Servicio para manejar las operaciones de productos
 */
export const productService = {
    /**
     * Obtener lista de productos con filtros y paginación
     */
    async getProducts(
        page: number = 1,
        size: number = 10,
        filters?: ProductFilters
    ): Promise<ProductListResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        // Agregar filtros si existen
        if (filters?.search) params.append('search', filters.search);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.min_price !== undefined) {
            params.append('min_price', filters.min_price.toString());
        }
        if (filters?.max_price !== undefined) {
            params.append('max_price', filters.max_price.toString());
        }

        const response = await apiClient.get<ProductListResponse>(
            `/products?${params}`
        );
        return response.data;
    },

    /**
     * Obtener un producto por ID
     */
    async getProduct(id: string): Promise<Product> {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    /**
     * Obtener un producto por SKU
     */
    async getProductBySku(sku: string): Promise<Product> {
        const response = await apiClient.get<Product>(`/products/sku/${sku}`);
        return response.data;
    },

    /**
     * Crear un nuevo producto
     */
    async createProduct(data: ProductCreate): Promise<Product> {
        const response = await apiClient.post<Product>('/products', data);
        return response.data;
    },

    /**
     * Actualizar un producto
     */
    async updateProduct(id: string, data: ProductUpdate): Promise<Product> {
        const response = await apiClient.patch<Product>(`/products/${id}`, data);
        return response.data;
    },

    /**
     * Eliminar un producto
     */
    async deleteProduct(id: string): Promise<Product> {
        const response = await apiClient.delete<Product>(`/products/${id}`);
        return response.data;
    },

    /**
     * Actualizar inventario de un producto
     */
    async updateInventory(
        id: string,
        quantityChange: number
    ): Promise<Product> {
        const response = await apiClient.patch<Product>(
            `/products/${id}/inventory?quantity_change=${quantityChange}`
        );
        return response.data;
    },
};