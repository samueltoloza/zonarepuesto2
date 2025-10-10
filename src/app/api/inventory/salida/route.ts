import { NextRequest, NextResponse } from 'next/server';
import { InventarioBridge } from '@/lib/inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '@/lib/inventory/ImplementacionInventarioPrisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { commodityId, headquartersId, cantidad, userId } = body;

        // Validaciones
        if (!commodityId || !headquartersId || !cantidad || !userId) {
            return NextResponse.json(
                {
                    error: 'Faltan campos requeridos',
                    required: ['commodityId', 'headquartersId', 'cantidad', 'userId']
                },
                { status: 400 }
            );
        }

        if (cantidad <= 0) {
            return NextResponse.json(
                { error: 'La cantidad debe ser mayor a 0' },
                { status: 400 }
            );
        }

        // Configurar Bridge
        const implementacion = new ImplementacionInventarioPrisma();
        const inventario = new InventarioBridge(implementacion);

        // Registrar salida
        await inventario.registrarSalida(commodityId, headquartersId, cantidad, userId);

        // Obtener stock actualizado
        const stockActual = await inventario.obtenerStock(commodityId, headquartersId);

        return NextResponse.json({
            success: true,
            message: 'Salida registrada correctamente',
            stockActual
        });
    } catch (error: any) {
        console.error('Error en API salida:', error);

        if (error.message.includes('Stock insuficiente')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}