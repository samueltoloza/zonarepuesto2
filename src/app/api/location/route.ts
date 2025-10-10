export const dynamic = 'force-dynamic' // defaults to auto
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const headquarters = await prisma.headquarters.findMany();
        return NextResponse.json(headquarters);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    const { name, city } = await request.json();
    try {
        const headquarter = await prisma.headquarters.create({
            data: {
                name,
                city
            }
        });
        return NextResponse.json(headquarter);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}