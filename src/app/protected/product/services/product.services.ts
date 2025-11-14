"use server"

import { Product } from "../models/product.models";

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/products`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-cache',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Error al obtener productos');
  }
  return data;
}

export const createProduct = async (payload: { name: string; description: string; price: number; headquartersId?: string; supplierId?: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Error al crear producto');
  }

  return data;
}
