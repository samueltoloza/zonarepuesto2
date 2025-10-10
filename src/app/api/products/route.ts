export const dynamic = 'force-dynamic' // defaults to auto
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const commodities = await prisma.commodity.findMany({ include: { headquarter: true, supplier: true } });
        return NextResponse.json(commodities);
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, suppliersId, headquartersId, quantity, price } = await request.json();
        const commodity = await prisma.commodity.create({
            data: {
                name: name,
                description: description,
                suppliersId: suppliersId,
                headquartersId: headquartersId,
                quantity: quantity,
                price: price
            }
        });
        return NextResponse.json(commodity, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}