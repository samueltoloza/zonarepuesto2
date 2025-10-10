// app/api/products/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CommodityBuilder } from '@/lib/products/CommodityBuilder';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, supplierId, headquartersId } = body;

        const product = await new CommodityBuilder()
            .conNombre(name)
            .conDescripcion(description)
            .conPrecio(price)
            .conProveedor(supplierId)
            .conSede(headquartersId)
            .construir();

        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}