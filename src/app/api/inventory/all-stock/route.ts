/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { InventarioBridge } from '@/lib/inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '@/lib/inventory/ImplementacionInventarioPrisma';

export async function GET() {
    try {
        // Configurar Bridge
        const implementacion = new ImplementacionInventarioPrisma();
        const inventario = new InventarioBridge(implementacion);

        // Obtener todo el stock con información completa
        const stockCompleto = await inventario.obtenerTodoElStock();

        return NextResponse.json({
            success: true,
            data: stockCompleto,
            totalItems: stockCompleto.length
        });
    } catch (error: any) {
        console.error('Error en API todo el stock:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}