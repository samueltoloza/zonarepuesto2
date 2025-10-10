/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../prisma';
import { ImplementacionInventario, InventoryMovementData } from './ImplementacionInventario';

export class ImplementacionInventarioPrisma implements ImplementacionInventario {
    async actualizarStock(commodityId: string, headquartersId: string, cantidad: number): Promise<void> {
        try {
            await prisma.inventoryItem.upsert({
                where: {
                    commodityId_headquartersId: {
                        commodityId,
                        headquartersId
                    }
                },
                update: {
                    stock: { increment: cantidad }
                },
                create: {
                    commodityId,
                    headquartersId,
                    stock: cantidad
                }
            });
        } catch (error) {
            console.error('Error actualizando stock:', error);
            throw new Error('No se pudo actualizar el stock');
        }
    }

    async obtenerStockActual(commodityId: string, headquartersId: string): Promise<number> {
        try {
            const item = await prisma.inventoryItem.findUnique({
                where: {
                    commodityId_headquartersId: {
                        commodityId,
                        headquartersId
                    }
                }
            });
            return item?.stock || 0;
        } catch (error) {
            console.error('Error obteniendo stock:', error);
            throw new Error('No se pudo obtener el stock');
        }
    }

    async registrarMovimiento(movimiento: InventoryMovementData): Promise<void> {
        try {
            await prisma.inventory.create({
                data: movimiento
            });
        } catch (error) {
            console.error('Error registrando movimiento:', error);
            throw new Error('No se pudo registrar el movimiento');
        }
    }

    async obtenerTodoElStock(): Promise<any[]> {
        try {
            const items = await prisma.inventoryItem.findMany({
                include: {
                    commodity: true,     // Incluir datos del commodity
                    headquarters: true   // Incluir datos de la sede
                },
                orderBy: [
                    { commodityId: 'asc' },
                    { headquartersId: 'asc' }
                ]
            });

            // Mapear para incluir todos los datos
            console.log(items.map(item => ({
                commodityId: item.commodityId,
                headquartersId: item.headquartersId,
                stock: item.stock,
                commodity: item.commodity,           // Datos completos del commodity
                headquarters: item.headquarters      // Datos completos de la sede
            })));

            return items.map(item => ({
                commodityId: item.commodityId,
                headquartersId: item.headquartersId,
                stock: item.stock,
                commodity: item.commodity,           // Datos completos del commodity
                headquarters: item.headquarters      // Datos completos de la sede
            }));
        } catch (error) {
            console.error('Error obteniendo todo el stock:', error);
            throw new Error('No se pudo obtener el stock completo');
        }
    }
}