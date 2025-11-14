// InventoryMovementBuilder.ts
import { InventoryMovementData } from './ImplementacionInventario';

export class InventoryMovementBuilder {
    private movementData: Partial<InventoryMovementData> = {};

    setMovementType(movementType: 'entrada' | 'salida' | 'ajuste'): this {
        this.movementData.movementType = movementType;
        return this;
    }

    setQuantity(quantity: number): this {
        this.movementData.quantity = quantity;
        return this;
    }

    setCommodityId(commodityId: string): this {
        this.movementData.commodityId = commodityId;
        return this;
    }

    setUserId(userId: string): this {
        this.movementData.userId = userId;
        return this;
    }

    setHeadquartersId(headquartersId: string): this {
        this.movementData.headquartersId = headquartersId;
        return this;
    }

    setSaleId(saleId: string | undefined): this {
        this.movementData.saleId = saleId;
        return this;
    }

    build(): InventoryMovementData {
        if (!this.movementData.movementType) {
            throw new Error('movementType es requerido');
        }
        if (!this.movementData.quantity) {
            throw new Error('quantity es requerido');
        }
        if (!this.movementData.commodityId) {
            throw new Error('commodityId es requerido');
        }
        if (!this.movementData.userId) {
            throw new Error('userId es requerido');
        }
        if (!this.movementData.headquartersId) {
            throw new Error('headquartersId es requerido');
        }

        return this.movementData as InventoryMovementData;
    }
}