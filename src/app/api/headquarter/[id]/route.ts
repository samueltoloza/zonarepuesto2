export const dynamic = 'force-dynamic' // defaults to auto
import { hashPassword } from "@/lib";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export async function GET(request: Request, { params }: Params) {
    const { id } = params;
    try {
        const headquarters = await prisma.headquarters.findMany({
            where: {
                id: parseInt(id)
            }
        });
        if (!headquarters) return NextResponse.json({ message: "headquarters not found" }, { status: 404 });
        return NextResponse.json(headquarters);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const { name, city } = await request.json();
    try {
        const headquarters = await prisma.headquarters.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!headquarters) return NextResponse.json({ message: "headquarters not found" }, { status: 404 });
        const updatedHeadquarters = await prisma.headquarters.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name ? name as string : headquarters.name,
                city: city ? city as string : headquarters.city
            }
        });
        return NextResponse.json(updatedHeadquarters);
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function DELETE(request: Request, { params }: Params) {
    const { id } = params;
    try {
        const headquarters = await prisma.headquarters.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!headquarters) return NextResponse.json({ message: "headquarters not found" }, { status: 404 });
        await prisma.headquarters.delete({
            where: {
                id: parseInt(id)
            }
        });
        return NextResponse.json({ message: "headquarters deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}