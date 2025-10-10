import { NextRequest, NextResponse } from 'next/server';
import { InventarioBridge } from '../../../../lib/inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '../../../../lib/inventory/ImplementacionInventarioPrisma';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Obtener datos de prueba
        const user = await prisma.user.findFirst();
        const commodity = await prisma.commodity.findFirst();
        const headquarters = await prisma.headquarters.findFirst();

        if (!user || !commodity || !headquarters) {
            return NextResponse.json(
                {
                    error: 'Primero ejecuta POST /api/test/populate-data para crear datos de prueba'
                },
                { status: 400 }
            );
        }

        const implementacion = new ImplementacionInventarioPrisma();
        const inventario = new InventarioBridge(implementacion);

        const testResults = [];

        // 1. Registrar entrada
        await inventario.registrarEntrada(
            commodity.id,
            headquarters.id,
            50,
            user.id
        );
        testResults.push('✅ Entrada de 50 unidades registrada');

        // 2. Verificar stock
        const stock1 = await inventario.obtenerStock(commodity.id, headquarters.id);
        testResults.push(`✅ Stock después de entrada: ${stock1}`);

        // 3. Registrar salida
        await inventario.registrarSalida(
            commodity.id,
            headquarters.id,
            20,
            user.id
        );
        testResults.push('✅ Salida de 20 unidades registrada');

        // 4. Verificar stock final
        const stockFinal = await inventario.obtenerStock(commodity.id, headquarters.id);
        testResults.push(`✅ Stock final: ${stockFinal}`);

        // 5. Verificar movimientos
        const movimientos = await prisma.inventory.findMany({
            where: {
                commodityId: commodity.id,
                headquartersId: headquarters.id
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            message: 'Prueba del Bridge completada exitosamente',
            testResults,
            movimientos: movimientos.map((m: { movementType: any; quantity: any; createdAt: any; }) => ({
                tipo: m.movementType,
                cantidad: m.quantity,
                fecha: m.createdAt
            })),
            datosUtilizados: {
                usuario: user.name,
                producto: commodity.name,
                sede: headquarters.name
            }
        });
    } catch (error: any) {
        console.error('Error en prueba del Bridge:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}