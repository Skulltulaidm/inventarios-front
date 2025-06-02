'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/lib/types/product';
import { ProductForm } from './ProductForm';
import {
    useUpdateProduct,
    useDeleteProduct,
    useUpdateInventory,
} from '@/lib/hooks/useProducts';
import {
    MoreHorizontal,
    Edit,
    Trash,
    Package,
    Plus,
    Minus,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ProductUpdateInput } from '@/lib/validations/product';

interface ProductTableProps {
    products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [inventoryProduct, setInventoryProduct] = useState<Product | null>(null);
    const [inventoryChange, setInventoryChange] = useState('');

    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();
    const updateInventory = useUpdateInventory();

    const handleUpdate = (data: ProductUpdateInput) => {
        if (editingProduct) {
            updateProduct.mutate(
                { id: editingProduct.id, data },
                {
                    onSuccess: () => setEditingProduct(null),
                }
            );
        }
    };

    const handleDelete = () => {
        if (deletingProduct) {
            deleteProduct.mutate(deletingProduct.id, {
                onSuccess: () => setDeletingProduct(null),
            });
        }
    };

    const handleInventoryUpdate = () => {
        if (inventoryProduct && inventoryChange) {
            const change = parseInt(inventoryChange);
            if (!isNaN(change)) {
                updateInventory.mutate(
                    {
                        id: inventoryProduct.id,
                        quantityChange: change,
                    },
                    {
                        onSuccess: () => {
                            setInventoryProduct(null);
                            setInventoryChange('');
                        },
                    }
                );
            }
        }
    };

    const getStockBadge = (quantity: number) => {
        if (quantity === 0) {
            return <Badge variant="destructive">Sin Stock</Badge>;
        } else if (quantity < 10) {
            return <Badge variant="secondary">Stock Bajo</Badge>;
        }
        return <Badge variant="default">En Stock</Badge>;
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-center">Inventario</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    No se encontraron productos
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.sku}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {product.quantity}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getStockBadge(product.quantity)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menú</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setEditingProduct(product)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setInventoryProduct(product)}
                                                >
                                                    <Package className="mr-2 h-4 w-4" />
                                                    Actualizar Inventario
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingProduct(product)}
                                                    className="text-red-600"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Diálogo de edición */}
            <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                        <DialogDescription>
                            Modifica los campos que deseas actualizar
                        </DialogDescription>
                    </DialogHeader>
                    {editingProduct && (
                        <ProductForm
                            product={editingProduct}
                            onSubmitAction={handleUpdate}
                            isPending={updateProduct.isPending}
                            mode="update"
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                open={!!deletingProduct}
                onOpenChange={() => setDeletingProduct(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el
                            producto &quot;{deletingProduct?.name}&quot; del catálogo.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingProduct(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteProduct.isPending}
                        >
                            {deleteProduct.isPending ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de actualización de inventario */}
            <Dialog
                open={!!inventoryProduct}
                onOpenChange={() => {
                    setInventoryProduct(null);
                    setInventoryChange('');
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Inventario</DialogTitle>
                        <DialogDescription>
                            Producto: {inventoryProduct?.name}
                            <br />
                            Cantidad actual: {inventoryProduct?.quantity}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                Cambio
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setInventoryChange('-1')}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={inventoryChange}
                                    onChange={(e) => setInventoryChange(e.target.value)}
                                    placeholder="Ej: 10 o -5"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setInventoryChange('1')}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Usa números positivos para agregar y negativos para reducir
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setInventoryProduct(null);
                                setInventoryChange('');
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleInventoryUpdate}
                            disabled={updateInventory.isPending || !inventoryChange}
                        >
                            {updateInventory.isPending ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}