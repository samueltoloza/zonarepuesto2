import { SalesService } from './SalesService';
import { InventarioBridge } from '@/lib/inventory/InventarioBridge';
import { ImplementacionInventarioPrisma } from '@/lib/inventory/ImplementacionInventarioPrisma';
import prisma from '@/lib/prisma';

export class SalesMediator {
  private salesService: SalesService;
  private inventario: InventarioBridge;

  constructor() {
    this.salesService = SalesService.getInstance();
    const impl = new ImplementacionInventarioPrisma();
    this.inventario = new InventarioBridge(impl);
  }

  /**
   * Orquesta el flujo completo de una venta:
   * 1) Verifica stock y crea la venta (SalesService)
   * 2) Devuelve información adicional (stock actualizado por item)
   */
  async procesarVentaAndFetchStock(payload: {
    items: { commodityId: string; quantity: number }[];
    userId: string;
    headquartersId: string;
  }) {
    // Delega en SalesService (que internamente actualiza stock y registra movimientos)
    const ventaId = await this.salesService.procesarVenta({
      items: payload.items,
      userId: payload.userId,
      headquartersId: payload.headquartersId,
    });

    // Obtener stock actualizado para cada producto
    const stockPromises = payload.items.map(async (it) => {
      const stock = await this.inventario.obtenerStock(it.commodityId, payload.headquartersId);
      const commodity = await prisma.commodity.findUnique({ where: { id: it.commodityId } });
      return {
        commodityId: it.commodityId,
        commodityName: commodity?.name ?? '',
        stock,
      };
    });

    const stockResult = await Promise.all(stockPromises);

    return { ventaId, stockResult };
  }
}
