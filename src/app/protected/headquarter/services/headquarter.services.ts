"use server"

import { Headquarter } from "../models/headquarter.models";

export const getAllHeadquarters = async (): Promise<Headquarter[]> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/headquarter`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		cache: 'no-cache',
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error(data?.error || 'Error al obtener sedes');
	}
	return data;
}

export const createHeadquarter = async (payload: { name: string; city: string }) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/headquarter`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error(data?.error || 'Error al crear la sede');
	}

	return data;
}
