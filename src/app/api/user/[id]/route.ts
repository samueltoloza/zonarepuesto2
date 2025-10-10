export const dynamic = 'force-dynamic' // defaults to auto
// import { hashPassword } from "@/lib";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// interface Params {
//     params: {
//         id: string;
//     };
// }

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                document: parseInt(id)
            }
        });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}

// export async function PUT(request: Request, { params }: Params) {
//     const { id } = params;
//     const { name, email, password, document } = await request.json();
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 document: parseInt(id)
//             }
//         });
//         if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
//         const hashedPassword = await hashPassword(password as string);
//         const updatedUser = await prisma.user.update({
//             where: {
//                 document: parseInt(id)
//             },
//             data: {
//                 name: name ? name as string : user.name,
//                 email: email ? email as string : user.email,
//                 password: password ? hashedPassword : user.password,
//                 document: document ? parseInt(document as string) : user.document
//             }
//         });
//         return NextResponse.json(updatedUser);
//     } catch (error) {
//         if (error instanceof Error) {
//             return NextResponse.json({ message: error.message }, { status: 500 });
//         }
//     }
// }

// export async function DELETE(request: Request, { params }: Params) {
//     const { id } = params;
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 document: parseInt(id)
//             }
//         });
//         if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
//         await prisma.user.delete({
//             where: {
//                 document: parseInt(id)
//             }
//         });
//         return NextResponse.json({ message: "User deleted" });
//     } catch (error) {
//         if (error instanceof Error) {
//             return NextResponse.json({ message: error.message }, { status: 500 });
//         }
//     }
// }