import { z } from 'zod';

const numberTransform = z.union([
    z.number(),
    z.string().transform(val => parseFloat(val))
]).refine(val => !isNaN(val), {
    message: 'Debe ser un número válido'
});

const intTransform = z.union([
    z.number().int(),
    z.string().transform(val => parseInt(val))
]).refine(val => !isNaN(val), {
    message: 'Debe ser un número entero válido'
});

/**
 * Esquema de validación para crear un producto
 */
export const productCreateSchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .max(200, 'El nombre no puede exceder 200 caracteres'),
    description: z
        .string()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .optional()
        .nullable(),
    price: numberTransform.refine(val => val > 0, {
        message: 'El precio debe ser mayor a 0'
    }),
    quantity: intTransform.refine(val => val >= 0, {
        message: 'La cantidad no puede ser negativa'
    }),
    sku: z
        .string()
        .min(1, 'El SKU es requerido')
        .max(50, 'El SKU no puede exceder 50 caracteres')
        .regex(
            /^[A-Za-z0-9-_]+$/,
            'El SKU solo puede contener letras, números, guiones y guiones bajos'
        ),
    category: z
        .string()
        .max(100, 'La categoría no puede exceder 100 caracteres')
        .optional()
        .nullable(),
    image_url: z
        .string()
        .url('Debe ser una URL válida')
        .optional()
        .nullable()
        .or(z.literal('')),
});

/**
 * Esquema de validación para actualizar un producto
 */
export const productUpdateSchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .max(200, 'El nombre no puede exceder 200 caracteres')
        .optional(),
    description: z
        .string()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .optional()
        .nullable(),
    price: numberTransform.refine(val => val > 0, {
        message: 'El precio debe ser mayor a 0'
    }).optional(),
    quantity: intTransform.refine(val => val >= 0, {
        message: 'La cantidad no puede ser negativa'
    }).optional(),
    category: z
        .string()
        .max(100, 'La categoría no puede exceder 100 caracteres')
        .optional()
        .nullable(),
    image_url: z
        .string()
        .url('Debe ser una URL válida')
        .optional()
        .nullable()
        .or(z.literal('')),
});

/**
 * Esquema de validación para actualizar inventario
 */
export const inventoryUpdateSchema = z.object({
    quantityChange: intTransform,
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type InventoryUpdateInput = z.infer<typeof inventoryUpdateSchema>;