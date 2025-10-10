export const dynamic = 'force-dynamic' // defaults to auto
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
        const inventory = await prisma.inventory.findMany({
            where: {
                id: parseInt(id)
            }
        });
        if (!inventory) return NextResponse.json({ message: "inventory not found" }, { status: 404 });
        return NextResponse.json(inventory);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const { quantity } = await request.json();
    console.log(quantity);
    try {
        const inventory = await prisma.inventory.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        console.log(inventory);
        if (!inventory) return NextResponse.json({ message: "inventory not found" }, { status: 404 });
        const updatedInventory = await prisma.inventory.update({
            where: {
                id: parseInt(id)
            },
            data: {
                quantity: quantity
            }
        });
        console.log(updatedInventory);
        return NextResponse.json(updatedInventory);
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
        const inventory = await prisma.inventory.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!inventory) return NextResponse.json({ message: "inventory not found" }, { status: 404 });
        await prisma.inventory.delete({
            where: {
                id: parseInt(id)
            }
        });
        return NextResponse.json({ message: "inventory deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}