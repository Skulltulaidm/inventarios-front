'use client';

import { useState } from 'react';
import { useProducts, useCreateProduct } from '@/lib/hooks/useProducts';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert';
import { ProductFilters } from '@/lib/types/product';
import { Plus, Search, Package, AlertCircle, Loader2 } from 'lucide-react';
import { ProductCreateInput } from '@/lib/validations/product';

export default function ProductsPage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<ProductFilters>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading, error } = useProducts(page, 10, filters);
    const createProduct = useCreateProduct();

    const handleSearch = () => {
        setFilters({ ...filters, search: searchInput });
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Transformar ProductCreateInput en ProductCreate para la API
    const handleCreateProduct = (data: ProductCreateInput) => {
        // Convertir la entrada validada al formato de la API
        const productData = {
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            sku: data.sku,
            category: data.category,
            image_url: data.image_url,
        };

        createProduct.mutate(productData, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
            },
        });
    };

    const clearFilters = () => {
        setFilters({});
        setSearchInput('');
        setPage(1);
    };

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Error al cargar los productos. Por favor, verifica que el servidor
                        esté funcionando.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="space-y-6">
                {/* Encabezado */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Catálogo de Productos
                        </h1>
                        <p className="text-muted-foreground">
                            Gestiona tu inventario de productos
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                </div>

                {/* Estadísticas */}
                {data && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total de Productos
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Productos en Stock
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {data.products.filter((p) => p.quantity > 0).length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Sin Stock
                                </CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {data.products.filter((p) => p.quantity === 0).length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Buscar por nombre o descripción..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Button onClick={handleSearch} size="icon">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Input
                                type="number"
                                placeholder="Precio mínimo"
                                className="w-32"
                                value={filters.min_price || ''}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        min_price: e.target.value ? parseFloat(e.target.value) : undefined,
                                    })
                                }
                            />
                            <Input
                                type="number"
                                placeholder="Precio máximo"
                                className="w-32"
                                value={filters.max_price || ''}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        max_price: e.target.value ? parseFloat(e.target.value) : undefined,
                                    })
                                }
                            />
                            <Button variant="outline" onClick={clearFilters}>
                                Limpiar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de productos */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    data && (
                        <>
                            <ProductTable products={data.products} />

                            {/* Paginación */}
                            {data.pages > 1 && (
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            Página {page} de {data.pages}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === data.pages}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </>
                    )
                )}
            </div>

            {/* Diálogo de creación */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Producto</DialogTitle>
                        <DialogDescription>
                            Completa los campos para agregar un nuevo producto al catálogo
                        </DialogDescription>
                    </DialogHeader>
                    <ProductForm
                        onSubmitAction={handleCreateProduct}
                        isPending={createProduct.isPending}
                        mode="create"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}