// lib/sales/SalesService.ts
import { InventarioBridge } from '../inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '../inventory/ImplementacionInventarioPrisma';
import prisma from '../prisma';

export class SalesService {
    private static instance: SalesService;
    private inventario: InventarioBridge;

    private constructor() {
        const implementacion = new ImplementacionInventarioPrisma();
        this.inventario = new InventarioBridge(implementacion);
    }

    public static getInstance(): SalesService {
        if (!SalesService.instance) {
            SalesService.instance = new SalesService();
        }
        return SalesService.instance;
    }

    async procesarVenta(ventaData: {
        items: Array<{
            commodityId: string;
            quantity: number;
        }>;
        userId: string;
        headquartersId: string;
    }): Promise<string> {
        // 1. Verificar stock
        for (const item of ventaData.items) {
            const stock = await this.inventario.obtenerStock(item.commodityId, ventaData.headquartersId);
            if (stock < item.quantity) {
                throw new Error(`Stock insuficiente. Disponible: ${stock}, Solicitado: ${item.quantity}`);
            }
        }

        // 2. Calcular total
        let total = 0;
        const itemsConPrecio = await Promise.all(
            ventaData.items.map(async (item) => {
                const commodity = await prisma.commodity.findUnique({
                    where: { id: item.commodityId },
                    select: { price: true }
                });

                if (!commodity) throw new Error(`Producto no encontrado: ${item.commodityId}`);

                const subtotal = commodity.price * item.quantity;
                total += subtotal;

                return {
                    ...item,
                    price: commodity.price
                };
            })
        );

        // 3. Crear venta
        const venta = await prisma.sale.create({
            data: {
                total,
                userId: ventaData.userId,
                headquartersId: ventaData.headquartersId,
                items: {
                    create: itemsConPrecio.map(item => ({
                        commodityId: item.commodityId,
                        quantity: item.quantity,
                    }))
                }
            }
        });

        // 4. Registrar salidas
        for (const item of ventaData.items) {
            await this.inventario.registrarSalida(
                item.commodityId,
                ventaData.headquartersId,
                item.quantity,
                ventaData.userId,
                venta.id
            );
        }

        return venta.id;
    }
}