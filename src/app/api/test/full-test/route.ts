// app/api/test/full-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { InventarioBridge } from '../../../../lib/inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '../../../../lib/inventory/ImplementacionInventarioPrisma';

export async function GET(request: NextRequest) {
    const testResults: string[] = [];

    try {
        testResults.push('🧹 Base de datos reiniciada - comenzando tests...');

        // =====================
        // 1. CREAR DATOS DE PRUEBA
        // =====================
        testResults.push('📝 Creando datos de prueba...');

        const user = await prisma.user.create({
            data: {
                document: 1052219872,
                email: 'elsamueltoloza@gmail.com',
                name: 'Samuel Toloza',
                password: 'Samuel112001*'
            }
        });
        testResults.push('✅ Usuario creado');

        const supplier = await prisma.supplier.create({
            data: {
                document: 87654321,
                email: 'dell@example.com',
                name: 'Dell'
            }
        });
        testResults.push('✅ Proveedor creado');

        const headquarters = await prisma.headquarters.create({
            data: {
                name: 'Sede Central',
                city: 'Bogotá'
            }
        });
        testResults.push('✅ Sede creada');

        const commodity = await prisma.commodity.create({
            data: {
                name: 'Laptop Dell',
                description: 'Laptop Dell Inspiron 15',
                price: 1500.00,
                supplierId: supplier.id,
                headquartersId: headquarters.id
            }
        });
        testResults.push('✅ Producto creado');

        // =====================
        // 2. PROBAR EL PATRÓN BRIDGE
        // =====================
        testResults.push('🌉 Probando patrón Bridge...');

        const implementacion = new ImplementacionInventarioPrisma();
        const inventario = new InventarioBridge(implementacion);

        // Test 1: Registrar entrada
        await inventario.registrarEntrada(
            commodity.id,
            headquarters.id,
            100,
            user.id
        );
        testResults.push('✅ Entrada de 100 unidades registrada');

        // Test 2: Verificar stock después de entrada
        const stockDespuesEntrada = await inventario.obtenerStock(commodity.id, headquarters.id);
        testResults.push(`✅ Stock después de entrada: ${stockDespuesEntrada}`);

        // Test 3: Registrar salida
        await inventario.registrarSalida(
            commodity.id,
            headquarters.id,
            30,
            user.id
        );
        testResults.push('✅ Salida de 30 unidades registrada');

        // Test 4: Verificar stock final
        const stockFinal = await inventario.obtenerStock(commodity.id, headquarters.id);
        testResults.push(`✅ Stock final: ${stockFinal}`);

        // Test 5: Intentar salida con stock insuficiente (debería fallar)
        try {
            await inventario.registrarSalida(
                commodity.id,
                headquarters.id,
                1000, // Más del stock disponible
                user.id
            );
            testResults.push('❌ NO debería permitir salida con stock insuficiente');
        } catch (error: any) {
            if (error.message.includes('Stock insuficiente')) {
                testResults.push('✅ Correctamente bloqueó salida con stock insuficiente');
            }
        }

        // =====================
        // 3. VERIFICAR DATOS EN BD
        // =====================
        testResults.push('🔍 Verificando datos en base de datos...');

        // Verificar InventoryItem (stock actual)
        const inventoryItem = await prisma.inventoryItem.findUnique({
            where: {
                commodityId_headquartersId: {
                    commodityId: commodity.id,
                    headquartersId: headquarters.id
                }
            }
        });

        if (inventoryItem && inventoryItem.stock === 70) {
            testResults.push('✅ Stock en BD correcto: 70 unidades');
        } else {
            testResults.push(`❌ Stock en BD incorrecto: ${inventoryItem?.stock}`);
        }

        // Verificar movimientos de Inventory
        const movimientos = await prisma.inventory.findMany({
            where: {
                commodityId: commodity.id,
                headquartersId: headquarters.id
            },
            orderBy: { createdAt: 'asc' }
        });

        if (movimientos.length === 2) {
            testResults.push(`✅ Se registraron ${movimientos.length} movimientos`);

            const entrada = movimientos.find(m => m.movementType === 'entrada');
            const salida = movimientos.find(m => m.movementType === 'salida');

            if (entrada && entrada.quantity === 100) {
                testResults.push('✅ Movimiento de entrada correcto: 100 unidades');
            }

            if (salida && salida.quantity === 30) {
                testResults.push('✅ Movimiento de salida correcto: 30 unidades');
            }
        }

        // =====================
        // 4. RESULTADO FINAL
        // =====================
        testResults.push('🎉 TODOS LOS TESTS COMPLETADOS EXITOSAMENTE!');

        return NextResponse.json({
            success: true,
            message: 'Tests completados exitosamente',
            testResults,
            datosCreados: {
                usuario: { id: user.id, name: user.name },
                proveedor: { id: supplier.id, name: supplier.name },
                sede: { id: headquarters.id, name: headquarters.name },
                producto: { id: commodity.id, name: commodity.name, price: commodity.price }
            },
            resumen: {
                movimientosRegistrados: movimientos.length,
                stockFinal: stockFinal,
                movimientos: movimientos.map(m => ({
                    tipo: m.movementType,
                    cantidad: m.quantity,
                    fecha: m.createdAt
                }))
            }
        });

    } catch (error: any) {
        testResults.push(`❌ ERROR: ${error.message}`);

        return NextResponse.json({
            success: false,
            message: 'Error en los tests',
            testResults,
            error: error.message
        }, { status: 500 });
    }
}