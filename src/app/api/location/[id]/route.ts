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
        const headquarter = await prisma.headquarters.findMany({
            where: {
                id: parseInt(id)
            }
        });
        if (!headquarter) return NextResponse.json({ message: "Headquarter not found" }, { status: 404 });
        return NextResponse.json(headquarter[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const { name, city } = await request.json();
    try {
        const headquarter = await prisma.headquarters.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!headquarter) return NextResponse.json({ message: "Headquarter not found" }, { status: 404 });
        const updatedHeadquarter = await prisma.headquarters.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name ? name as string : headquarter.name,
                city: city ? city as string : headquarter.city
            }
        });
        return NextResponse.json(updatedHeadquarter);
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
        const headquarter = await prisma.headquarters.delete({
            where: {
                id: parseInt(id)
            }
        });
        return NextResponse.json({ message: "Headquarter deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}