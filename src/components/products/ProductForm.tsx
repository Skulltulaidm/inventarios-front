'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    productCreateSchema,
    productUpdateSchema,
    ProductCreateInput,
    ProductUpdateInput,
} from '@/lib/validations/product';
import { Product } from '@/lib/types/product';
import { Loader2 } from 'lucide-react';
import { Resolver } from 'react-hook-form';

// Create overloaded interface for better type safety
interface ProductFormCreateProps {
    mode: 'create';
    onSubmitAction: (data: ProductCreateInput) => void;
    product?: never;
    isPending?: boolean;
}

interface ProductFormUpdateProps {
    mode: 'update';
    onSubmitAction: (data: ProductUpdateInput) => void;
    product: Product;
    isPending?: boolean;
}

type ProductFormProps = ProductFormCreateProps | ProductFormUpdateProps;

export function ProductForm({
                                product,
                                onSubmitAction,
                                isPending = false,
                                mode,
                            }: ProductFormProps) {
    // Función auxiliar para obtener valores por defecto basados en el modo
    const getDefaultValues = (): ProductCreateInput | ProductUpdateInput => {
        if (mode === 'create') {
            return {
                name: '',
                description: '',
                price: 0,
                quantity: 0,
                sku: '',
                category: '',
                image_url: '',
            } satisfies ProductCreateInput;
        } else {
            // En modo actualización, se garantiza la existencia del producto
            return {
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                quantity: product.quantity || 0,
                category: product.category || '',
                image_url: product.image_url || '',
            } satisfies ProductUpdateInput;
        }
    };

    // Obtener el resolver adecuado en función del modo
    const getResolver = (): Resolver<ProductCreateInput | ProductUpdateInput> => {
        if (mode === 'create') {
            return zodResolver(productCreateSchema) as Resolver<ProductCreateInput | ProductUpdateInput>;
        } else {
            return zodResolver(productUpdateSchema) as Resolver<ProductCreateInput | ProductUpdateInput>;
        }
    };

    const form = useForm<ProductCreateInput | ProductUpdateInput>({
        resolver: getResolver(),
        defaultValues: getDefaultValues(),
    });

    const handleSubmit = (data: ProductCreateInput | ProductUpdateInput) => {
        if (mode === 'create') {
            onSubmitAction(data as ProductCreateInput);
        } else {
            onSubmitAction(data as ProductUpdateInput);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Producto</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Laptop Gaming Pro" {...field} />
                            </FormControl>
                            <FormDescription>
                                Nombre descriptivo del producto (máximo 200 caracteres)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {mode === 'create' && (
                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: LPT-GAM-001"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Código único del producto (no se puede cambiar)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descripción detallada del producto..."
                                    className="resize-none"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormDescription>
                                Descripción opcional del producto (máximo 1000 caracteres)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === '' ? 0 : parseFloat(value));
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Precio del producto</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cantidad en Inventario</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === '' ? 0 : parseInt(value));
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Cantidad disponible</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categoría</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: Electrónicos"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormDescription>
                                Categoría del producto (opcional)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de Imagen</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormDescription>
                                URL de la imagen del producto (opcional)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === 'create' ? 'Crear Producto' : 'Actualizar Producto'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}