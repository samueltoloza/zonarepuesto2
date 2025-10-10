// app/api/sales/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SalesService } from '@/lib/sales/SalesService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, userId, headquartersId } = body;

        if (!items || !userId || !headquartersId) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        const salesService = SalesService.getInstance();
        const ventaId = await salesService.procesarVenta({
            items,
            userId,
            headquartersId
        });

        return NextResponse.json({ success: true, ventaId }, { status: 201 });
    } catch (error: any) {
        if (error.message.includes('Stock insuficiente')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}