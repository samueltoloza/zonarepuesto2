export const dynamic = 'force-dynamic' // defaults to auto
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const suppliers = await prisma.supplier.findMany();
        return NextResponse.json(suppliers);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    const { document, email, name } = await request.json();
    try {
        const supplier = await prisma.supplier.create({
            data: {
                document,
                email,
                name
            }
        });
        return NextResponse.json(supplier);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}