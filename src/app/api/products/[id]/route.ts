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
        const commodity = await prisma.commodity.findMany({
            where: {
                id: parseInt(id)
            }
        });
        if (!commodity) return NextResponse.json({ message: "commodity not found" }, { status: 404 });
        return NextResponse.json(commodity[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const { name, description, quantity, price, suppliersId, headquartersId } = await request.json();
    try {
        const commodity = await prisma.commodity.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!commodity) return NextResponse.json({ message: "commodity not found" }, { status: 404 });
        const updatedCommodity = await prisma.commodity.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name ? name as string : commodity.name,
                description: description ? description as string : commodity.description,
                quantity: quantity ? quantity as number : commodity.quantity,
                price: price ? price as number : commodity.price,
                suppliersId: suppliersId ? suppliersId as string : commodity.suppliersId,
                headquartersId: headquartersId ? headquartersId as number : commodity.headquartersId
            }
        });
        return NextResponse.json(updatedCommodity);
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
        const commodity = await prisma.commodity.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!commodity) return NextResponse.json({ message: "commodity not found" }, { status: 404 });
        await prisma.commodity.delete({
            where: {
                id: parseInt(id)
            }
        });
        return NextResponse.json({ message: "commodity deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}