import { NextRequest, NextResponse } from 'next/server';
import { SalesMediator } from '@/lib/sales/SalesMediator';
import prisma from '@/lib/prisma';

const mediator = new SalesMediator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, userId, headquartersId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No hay items en la venta' }, { status: 400 });
    }
    if (!userId || !headquartersId) {
      return NextResponse.json({ error: 'Faltan datos: userId o headquartersId' }, { status: 400 });
    }

    const result = await mediator.procesarVentaAndFetchStock({ items, userId, headquartersId });

    return NextResponse.json({ success: true, ventaId: result.ventaId, stock: result.stockResult }, { status: 201 });
  } catch (error: any) {
    console.error('Error creando venta:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ventas = await prisma.sale.findMany({
      include: { items: { include: { commodity: true } }, },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(ventas, { status: 200 });
  } catch (error) {
    console.error('Error listando ventas:', error);
    return NextResponse.json({ error: 'Error listando ventas' }, { status: 500 });
  }
}
