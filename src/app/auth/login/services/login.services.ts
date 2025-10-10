import { User } from "../models";
import bcrypt from "bcryptjs";

export const getUserByDocument = async (document: number, password: string): Promise<User | null> => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${document}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const user = await res.json();

    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return null;
    }

    return user;
}