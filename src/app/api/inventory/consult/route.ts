export const dynamic = 'force-dynamic' // defaults to auto
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    const { commodityId } = await request.json();
    try {
        const sumQuantity = await prisma.inventory.groupBy({
            where: {
                AND: [
                    { movementType: { equals: "Salida" } },
                    { quantity: { not: { equals: 0 } } },
                    { commodityId: { equals: commodityId } }
                ]
            },
            by: ["commodityId"],
            _sum: {
                quantity: true
            }
        });
        if (sumQuantity.length === 0) return NextResponse.json([{ _sum: { quantity: 0 } }]);
        return NextResponse.json(sumQuantity);
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}