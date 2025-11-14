import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ============ GET ALL COMMODITIES ============
export async function GET() {
    try {
        const commodities = await prisma.commodity.findMany({
            include: {
                supplier: true,
                headquarters: true,
                inventory: true,
                saleItems: true,
                inventoryMoves: true,
            },
        });
        return NextResponse.json(commodities, { status: 200 });
    } catch (error) {
        console.error("Error fetching commodities:", error);
        return NextResponse.json({ error: "Error fetching commodities" }, { status: 500 });
    }
}

// ============ CREATE NEW COMMODITY ============
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, price, supplierId, headquartersId } = body;

        if (!name || !description || !price) {
            return NextResponse.json(
                { error: "Name, description and price are required" },
                { status: 400 }
            );
        }

        const newCommodity = await prisma.commodity.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                supplierId: supplierId || null,
                headquartersId: headquartersId || null,
            },
            include: {
                supplier: true,
                headquarters: true,
            },
        });

        return NextResponse.json(newCommodity, { status: 201 });
    } catch (error) {
        console.error("Error creating commodity:", error);
        return NextResponse.json(
            { error: "Error creating commodity" },
            { status: 500 }
        );
    }
}