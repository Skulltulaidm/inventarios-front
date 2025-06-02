import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/api/products';
import {
    ProductCreate,
    ProductUpdate,
    ProductFilters,
} from '@/lib/types/product';
import { toast } from "sonner";

/**
 * Hook para obtener lista de productos
 */
export function useProducts(
    page: number = 1,
    size: number = 10,
    filters?: ProductFilters
) {
    return useQuery({
        queryKey: ['products', page, size, filters],
        queryFn: () => productService.getProducts(page, size, filters),
        staleTime: 30000,
    });
}

/**
 * Hook para obtener un producto por ID
 */
export function useProduct(id: string | null) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id!),
        enabled: !!id,
    });
}

/**
 * Hook para crear un producto
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductCreate) => productService.createProduct(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(`${data.name} ha sido creado exitosamente.`);
        },
        onError: (error: Error) => {
            toast.error(`Error al crear producto: ${error.message}`);
        },
    });
}

/**
 * Hook para actualizar un producto
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProductUpdate }) =>
            productService.updateProduct(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', data.id] });
            toast.success(`${data.name} ha sido actualizado exitosamente.`);
        },
        onError: (error: Error) => {
            toast.error(`Error al actualizar producto: ${error.message}`);
        },
    });
}

/**
 * Hook para eliminar un producto
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(`${data.name} ha sido eliminado exitosamente.`);
        },
        onError: (error: Error) => {
            toast.error(`Error al eliminar producto: ${error.message}`);
        },
    });
}

/**
 * Hook para actualizar inventario
 */
export function useUpdateInventory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         quantityChange,
                     }: {
            id: string;
            quantityChange: number;
        }) => productService.updateInventory(id, quantityChange),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', data.id] });
            toast.success(`El inventario de ${data.name} ha sido actualizado.`);
        },
        onError: (error: Error) => {
            toast.error(`Error al actualizar inventario: ${error.message}`);
        },
    });
}