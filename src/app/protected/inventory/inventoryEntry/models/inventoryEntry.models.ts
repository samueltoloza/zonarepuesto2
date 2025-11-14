/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    supplierId: string;
    headquartersId: string;
    supplier: Supplier;
    headquarters: Headquarters;
    inventory: Inventory[];
    saleItems: any[];
    inventoryMoves: InventoryMove[];
}

interface InventoryMove {
    id: string;
    movementType: string;
    quantity: number;
    commodityId: string;
    userId: string;
    headquartersId: string;
    createdAt: string;
    saleId: null;
}

interface Inventory {
    id: string;
    commodityId: string;
    headquartersId: string;
    stock: number;
}

interface Headquarters {
    id: string;
    name: string;
    city: string;
}

interface Supplier {
    id: string;
    document: number;
    email: string;
    name: string;
}