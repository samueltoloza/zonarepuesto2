"use server"

import { Supplier } from "../models/supplier.models";

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/supplier`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-cache',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Error al obtener proveedores');
  }
  return data;
}

export const createSupplier = async (payload: { document: number; email: string; name: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/supplier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Error al crear proveedor');
  }

  return data;
}
