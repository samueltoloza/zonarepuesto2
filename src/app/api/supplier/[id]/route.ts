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
        const supplier = await prisma.suppliers.findMany({
            where: {
                id: id
            }
        });
        if (!supplier) return NextResponse.json({ message: "Supplier not found" }, { status: 404 });
        return NextResponse.json(supplier[0]);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const { name, email, document } = await request.json();
    try {
        const supplier = await prisma.suppliers.findUnique({
            where: {
                id: id
            }
        });
        if (!supplier) return NextResponse.json({ message: "Supplier not found" }, { status: 404 });
        const updatedSupplier = await prisma.suppliers.update({
            where: {
                id: id
            },
            data: {
                name: name ? name as string : supplier.name,
                email: email ? email as string : supplier.email,
                document: document ? parseInt(document as string) : supplier.document
            }
        });
        return NextResponse.json(updatedSupplier);
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
        const supplier = await prisma.suppliers.findUnique({
            where: {
                id: id
            }
        });
        if (!supplier) return NextResponse.json({ message: "Supplier not found" }, { status: 404 });
        await prisma.suppliers.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({ message: "Supplier deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
} 