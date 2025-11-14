/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Headquarter {
    id: string;
    name: string;
    city: string;
    commodities: Commodity[];
    inventory: Inventory[];
    sales: any[];
}

interface Inventory {
    id: string;
    commodityId: string;
    headquartersId: string;
    stock: number;
}

interface Commodity {
    id: string;
    name: string;
    description: string;
    price: number;
    supplierId: string;
    headquartersId: string;
}