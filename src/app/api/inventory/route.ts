export const dynamic = 'force-dynamic' // defaults to auto
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    // hacer query options
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);

        const quantity = params.get("quantity");
        const commodityId = params.get("commodityId");
        const userId = params.get("userId");
        const movementType = params.get("movementType");

        console.log(quantity);


        const inventory = await prisma.inventory.findMany({
            where: {
                quantity: {
                    not: quantity ? parseInt(quantity) : undefined
                },
                commodityId: commodityId ? parseInt(commodityId) : undefined,
                userId: userId ? userId : undefined,
                movementType: movementType ? movementType : undefined
            },
            include: {
                commodity: true,
                user: true
            }
        });
        return NextResponse.json(inventory);
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const { movementType, quantity, commodityId, userId } = await request.json();
        const inventory = await prisma.inventory.create({
            data: {
                movementType: movementType,
                quantity: quantity,
                commodityId: commodityId,
                userId: userId,
            }
        });
        return NextResponse.json(inventory, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}