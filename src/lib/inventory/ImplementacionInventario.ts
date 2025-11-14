import { InventoryAll } from "@/app/protected/inventory/stock/models";

export interface ImplementacionInventario {
    actualizarStock(commodityId: string, headquartersId: string, cantidad: number): Promise<void>;
    obtenerStockActual(commodityId: string, headquartersId: string): Promise<number>;
    obtenerTodoElStock(): Promise<InventoryAll[]>; // Cambiar el tipo de retorno
    registrarMovimiento(movimiento: InventoryMovementData): Promise<void>;
    obtenerStockPorSede(headquartersId: string): Promise<InventoryAll[]>;
}

export type InventoryMovementData = {
    movementType: 'entrada' | 'salida' | 'ajuste';
    quantity: number;
    commodityId: string;
    userId: string;
    headquartersId: string;
    saleId?: string;
};