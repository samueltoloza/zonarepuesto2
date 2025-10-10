'use server'

import { InventoryAll } from "../models";

export const getAllInventorySinBridge = async (): Promise<InventoryAll[]> => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/inventory/all-stock-sin-bridge`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        cache: 'no-cache',
    });
    const data = await res.json();
    if (data.error) {
        throw new Error(`Error al crear el cronograma: ${data.error.message}`);
    }

    return data;
};