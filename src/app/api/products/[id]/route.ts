import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============ GET ONE COMMODITY ============
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const commodity = await prisma.commodity.findUnique({
            where: { id },
            include: {
                supplier: true,
                headquarters: true,
                inventory: {
                    include: {
                        headquarters: true,
                    },
                },
                saleItems: {
                    include: {
                        sale: true,
                    },
                },
                inventoryMoves: {
                    include: {
                        user: true,
                        headquarters: true,
                    },
                },
            },
        });

        if (!commodity) {
            return NextResponse.json(
                { error: "Commodity not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(commodity, { status: 200 });
    } catch (error) {
        console.error("Error fetching commodity:", error);
        return NextResponse.json(
            { error: "Error fetching commodity" },
            { status: 500 }
        );
    }
}

// ============ UPDATE COMMODITY ============
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name, description, price, supplierId, headquartersId } = await req.json();

        const updated = await prisma.commodity.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(price && { price: parseFloat(price) }),
                ...(supplierId && { supplierId }),
                ...(headquartersId && { headquartersId }),
            },
            include: {
                supplier: true,
                headquarters: true,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating commodity:", error);
        return NextResponse.json(
            { error: "Error updating commodity" },
            { status: 500 }
        );
    }
}

// ============ DELETE COMMODITY ============
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.commodity.delete({ where: { id } });
        return NextResponse.json(
            { message: "Commodity deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting commodity:", error);
        return NextResponse.json(
            { error: "Error deleting commodity" },
            { status: 500 }
        );
    }
}