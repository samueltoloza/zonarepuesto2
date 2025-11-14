import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ============ GET ALL HEADQUARTERS ============
export async function GET() {
    try {
        const headquarters = await prisma.headquarters.findMany({
            include: {
                commodities: true,
                inventory: true,
                sales: true,
            },
        });
        return NextResponse.json(headquarters, { status: 200 });
    } catch (error) {
        console.error("Error fetching headquarters:", error);
        return NextResponse.json({ error: "Error fetching headquarters" }, { status: 500 });
    }
}

// ============ CREATE NEW HEADQUARTERS ============
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, city } = body;

        if (!name || !city) {
            return NextResponse.json({ error: "Name and city are required" }, { status: 400 });
        }

        const newHQ = await prisma.headquarters.create({
            data: { name, city },
        });

        return NextResponse.json(newHQ, { status: 201 });
    } catch (error) {
        console.error("Error creating headquarters:", error);
        return NextResponse.json({ error: "Error creating headquarters" }, { status: 500 });
    }
}
