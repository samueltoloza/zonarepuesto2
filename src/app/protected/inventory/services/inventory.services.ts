/* Servicio compartido para registrar entradas y salidas de inventario */
type InventoryPayload = {
    commodityId: string;
    headquartersId: string;
    cantidad: number;
    userId: string;
}

async function postJson(path: string, body: unknown) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data && (data.error || data.message)) || `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return data;
}

export async function registerEntrada(payload: InventoryPayload) {
    return postJson('/api/inventory/entrada', payload);
}

export async function registerSalida(payload: InventoryPayload) {
    return postJson('/api/inventory/salida', payload);
}
