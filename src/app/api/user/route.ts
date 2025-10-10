export const dynamic = 'force-dynamic' // defaults to auto
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const { name, email, password, document } = await request.json();
    const hashedPassword = await hashPassword(password as string);
    const newUser = await prisma.user.create({
        data: {
            name: name as string,
            email: email as string,
            password: hashedPassword,
            document: parseInt(document as string)
        }
    });
    return NextResponse.json(newUser);
}