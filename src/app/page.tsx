import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, BarChart, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
      <div className="container mx-auto py-10">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Sistema de Gestión de Inventario
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Administra tu catálogo de productos
            </p>
            <div className="space-x-4">
              <Link href="/products">
                <Button size="lg">
                  Ver Productos
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Gestión de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Crea, actualiza y elimina productos de tu catálogo fácilmente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Control de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Mantén un registro actualizado de las cantidades disponibles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Interfaz Intuitiva</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Diseño moderno y fácil de usar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Código Limpio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Desarrollado siguiendo las mejores prácticas y principios SOLID
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Tecnologías Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Backend</h4>
                  <ul className="space-y-1 text-sm text-gray-500">
                    <li>• FastAPI - API</li>
                    <li>• Prisma ORM - Manejo de base de datos</li>
                    <li>• PostgreSQL - Base de datos relacional</li>
                    <li>• Pydantic - Validación de datos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Frontend</h4>
                  <ul className="space-y-1 text-sm text-gray-500">
                    <li>• Next.js 15 - Framework React con App Router</li>
                    <li>• TypeScript - Tipado estático</li>
                    <li>• Tailwind CSS - Estilos</li>
                    <li>• shadcn/ui - Componentes de UI</li>
                    <li>• React Query - Manejo de estado del servidor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}