/**
 * Tipos para el manejo de productos
 */

export interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    quantity: number;
    sku: string;
    category?: string | null;
    image_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProductCreate {
    name: string;
    description?: string | null;
    price: number;
    quantity: number;
    sku: string;
    category?: string | null;
    image_url?: string | null;
}

export interface ProductUpdate {
    name?: string;
    description?: string | null;
    price?: number;
    quantity?: number;
    category?: string | null;
    image_url?: string | null;
}

export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
}

export interface ApiError {
    detail: string;
}