// InventarioBridge.ts
import { InventoryAll } from '@/app/protected/inventory/stock/models';
import { ImplementacionInventario } from './ImplementacionInventario';
import { InventoryMovementBuilder } from './InventoryMovementBuilder';

export class InventarioBridge {
    constructor(private implementacion: ImplementacionInventario) { }

    async registrarEntrada(
        commodityId: string,
        headquartersId: string,
        cantidad: number,
        userId: string,
        saleId?: string
    ): Promise<void> {
        try {
            await this.implementacion.actualizarStock(commodityId, headquartersId, cantidad);

            const movimiento = new InventoryMovementBuilder()
                .setMovementType('entrada')
                .setQuantity(cantidad)
                .setCommodityId(commodityId)
                .setUserId(userId)
                .setHeadquartersId(headquartersId)
                .setSaleId(saleId)
                .build();

            await this.implementacion.registrarMovimiento(movimiento);
        } catch (error) {
            console.error('Error en registrarEntrada:', error);
            throw error;
        }
    }

    async registrarSalida(
        commodityId: string,
        headquartersId: string,
        cantidad: number,
        userId: string,
        saleId?: string
    ): Promise<void> {
        try {
            const stockActual = await this.implementacion.obtenerStockActual(commodityId, headquartersId);
            if (stockActual < cantidad) {
                throw new Error(`Stock insuficiente. Disponible: ${stockActual}, Solicitado: ${cantidad}`);
            }

            await this.implementacion.actualizarStock(commodityId, headquartersId, -cantidad);

            const movimiento = new InventoryMovementBuilder()
                .setMovementType('salida')
                .setQuantity(cantidad)
                .setCommodityId(commodityId)
                .setUserId(userId)
                .setHeadquartersId(headquartersId)
                .setSaleId(saleId)
                .build();

            await this.implementacion.registrarMovimiento(movimiento);
        } catch (error) {
            console.error('Error en registrarSalida:', error);
            throw error;
        }
    }

    async obtenerStock(commodityId: string, headquartersId: string): Promise<number> {
        try {
            return await this.implementacion.obtenerStockActual(commodityId, headquartersId);
        } catch (error) {
            console.error('Error obteniendo stock:', error);
            throw error;
        }
    }

    async obtenerTodoElStock(): Promise<InventoryAll[]> {
        try {
            return await this.implementacion.obtenerTodoElStock();
        } catch (error) {
            console.error('Error obteniendo todo el stock:', error);
            throw error;
        }
    }

    async obtenerStockPorSede(headquartersId: string): Promise<InventoryAll[]> {
        try {
            return await this.implementacion.obtenerStockPorSede(headquartersId);
        } catch (error) {
            console.error('Error obteniendo stock por sede:', error);
            throw error;
        }
    }
}