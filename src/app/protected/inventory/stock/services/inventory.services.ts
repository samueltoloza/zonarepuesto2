'use server'

import { InventoryAll } from "../models";

export const getAllInventory = async (): Promise<InventoryAll[]> => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/inventory/all-stock`, {
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

    return data.data;
};

export const getInventoryByHeadquarter = async (headquartersId: string): Promise<InventoryAll[]> => {
    console.log(`${process.env.NEXT_PUBLIC_URL_API}api/inventory/stockbyheadquarter/${headquartersId}`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/inventory/stockbyheadquarter/${headquartersId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        cache: 'no-cache',
    });
    const data = await res.json();
    if (data.error) {
        throw new Error(`Error al obtener el stock por sede: ${data.error.message}`);
    }
    return data.stock;
};