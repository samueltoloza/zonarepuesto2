import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============ GET ONE HEADQUARTERS ============
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const headquarters = await prisma.headquarters.findUnique({
            where: { id },
            include: {
                commodities: true,
                inventory: true,
                sales: true,
            },
        });

        if (!headquarters) {
            return NextResponse.json({ error: "Headquarters not found" }, { status: 404 });
        }

        return NextResponse.json(headquarters, { status: 200 });
    } catch (error) {
        console.error("Error fetching headquarters:", error);
        return NextResponse.json({ error: "Error fetching headquarters" }, { status: 500 });
    }
}

// ============ UPDATE HEADQUARTERS ============
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name, city } = await req.json();

        const updated = await prisma.headquarters.update({
            where: { id },
            data: { name, city },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating headquarters:", error);
        return NextResponse.json({ error: "Error updating headquarters" }, { status: 500 });
    }
}

// ============ DELETE HEADQUARTERS ============
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.headquarters.delete({ where: { id } });
        return NextResponse.json({ message: "Headquarters deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting headquarters:", error);
        return NextResponse.json({ error: "Error deleting headquarters" }, { status: 500 });
    }
}
