// lib/products/CommodityBuilder.ts
import prisma from '../prisma';

export class CommodityBuilder {
    private name: string = '';
    private description: string = '';
    private price: number = 0;
    private supplierId?: string;
    private headquartersId?: string;

    conNombre(nombre: string): CommodityBuilder {
        this.name = nombre;
        return this;
    }

    conDescripcion(descripcion: string): CommodityBuilder {
        this.description = descripcion;
        return this;
    }

    conPrecio(precio: number): CommodityBuilder {
        if (precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        this.price = precio;
        return this;
    }

    conProveedor(proveedorId: string): CommodityBuilder {
        this.supplierId = proveedorId;
        return this;
    }

    conSede(sedeId: string): CommodityBuilder {
        this.headquartersId = sedeId;
        return this;
    }

    async construir(): Promise<any> {
        if (!this.name.trim()) {
            throw new Error('El nombre del producto es requerido');
        }

        return await prisma.commodity.create({
            data: {
                name: this.name,
                description: this.description,
                price: this.price,
                supplierId: this.supplierId,
                headquartersId: this.headquartersId,
            },
            include: {
                supplier: true,
                headquarters: true,
                inventory: true
            }
        });
    }
}