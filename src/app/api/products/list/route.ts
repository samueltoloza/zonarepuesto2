// app/api/products/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.commodity.findMany({
            include: {
                supplier: true,
                headquarters: true,
                inventory: true
            }
        });

        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}