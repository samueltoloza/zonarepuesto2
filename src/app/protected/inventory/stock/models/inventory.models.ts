export interface InventoryAll {
    commodityId: string;
    headquartersId: string;
    stock: number;
    commodity: Commodity;
    headquarters: Headquarters;
}

interface Headquarters {
    id: string;
    name: string;
    city: string;
}

interface Commodity {
    id: string;
    name: string;
    description: string;
    price: number;
    supplierId: string;
    headquartersId: string;
}