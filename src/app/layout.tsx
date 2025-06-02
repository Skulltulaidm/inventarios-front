import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Catálogo de Productos',
    description: 'Sistema de gestión de inventario y productos',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body className={inter.className}>
        <Providers>
            <nav className="border-b">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center">
                        <Link href="/" className="font-bold text-xl">
                            📦 Catálogo de Productos
                        </Link>
                        <div className="ml-auto flex items-center space-x-4">
                            <Link
                                href="/products"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Productos
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
            <Toaster />
        </Providers>
        </body>
        </html>
    );
}
