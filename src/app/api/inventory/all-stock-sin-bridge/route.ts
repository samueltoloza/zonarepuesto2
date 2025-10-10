export const dynamic = 'force-dynamic' // defaults to auto
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const items = await prisma.inventoryItem.findMany({
        include: {
            commodity: true,     // Incluir datos del commodity
            headquarters: true   // Incluir datos de la sede
        },
        orderBy: [
            { commodityId: 'asc' },
            { headquartersId: 'asc' }
        ]
    });
    return NextResponse.json(items);
}