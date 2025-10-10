// app/api/test/populate-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
    try {
        // Crear usuario de prueba
        const user = await prisma.user.upsert({
            where: { email: 'test@example.com' },
            update: {},
            create: {
                document: 12345678,
                email: 'test@example.com',
                name: 'Usuario Test',
                password: 'password123'
            }
        });

        // Crear proveedor de prueba
        const supplier = await prisma.supplier.upsert({
            where: { email: 'proveedor@example.com' },
            update: {},
            create: {
                document: 87654321,
                email: 'proveedor@example.com',
                name: 'Proveedor Test'
            }
        });

        // MODIFICADO: Usar create en lugar de upsert para Headquarters
        let headquarters = await prisma.headquarters.findFirst({
            where: { name: 'Sede Central' }
        });

        if (!headquarters) {
            headquarters = await prisma.headquarters.create({
                data: {
                    name: 'Sede Central',
                    city: 'Bogotá'
                }
            });
        }

        // Crear producto de prueba
        const commodity = await prisma.commodity.upsert({
            where: { name: 'Producto Test' },
            update: {},
            create: {
                name: 'Producto Test',
                description: 'Producto de prueba para testing',
                price: 100.50,
                supplierId: supplier.id,
                headquartersId: headquarters.id
            }
        });

        return NextResponse.json({
            message: 'Datos de prueba creados exitosamente',
            data: {
                userId: user.id,
                supplierId: supplier.id,
                headquartersId: headquarters.id,
                commodityId: commodity.id
            }
        });
    } catch (error: any) {
        console.error('Error poblando datos:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}