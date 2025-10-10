import { NextRequest, NextResponse } from 'next/server';
import { InventarioBridge } from '@/lib/inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '@/lib/inventory/ImplementacionInventarioPrisma';

interface Params {
    params: {
        commodityId: string;
        headquartersId: string;
    };
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { commodityId, headquartersId } = params;

        // Configurar Bridge
        const implementacion = new ImplementacionInventarioPrisma();
        const inventario = new InventarioBridge(implementacion);

        // Obtener stock
        const stock = await inventario.obtenerStock(commodityId, headquartersId);

        return NextResponse.json({
            commodityId,
            headquartersId,
            stock
        });
    } catch (error: any) {
        console.error('Error en API stock:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}