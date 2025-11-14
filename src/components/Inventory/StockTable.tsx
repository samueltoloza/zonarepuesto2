'use client'

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from 'react'
import { getInventoryByHeadquarter } from '@/app/protected/inventory/stock/services'
import { InventoryAll } from '@/app/protected/inventory/stock/models'
import { useHeadquarterStore } from '@/store/useHeadquarterStore'
import { toast } from 'sonner'

export default function StockTable() {
    const { headquarterId } = useHeadquarterStore()
    const [inventory, setInventory] = useState<InventoryAll[]>([])

    useEffect(() => {
        (async () => {
            if (!headquarterId) return
            try {
                const data = await getInventoryByHeadquarter(headquarterId)
                setInventory(data)
                console.log("Estoy cargando el inventario por sede." + JSON.stringify(data));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error('Error al cargar el inventario por sede.')
            }
        })()
    }, [headquarterId])

    console.log(inventory);


    return (
        <div className="pt-6 px-4">
            <div className="overflow-x-auto">
                <div className="max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripcion</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Sede</TableHead>
                                <TableHead>Ciudad de la sede</TableHead>
                                <TableHead>Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        No hay datos disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                            {inventory.length > 0 && inventory.map((inv, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{inv.commodity.name}</TableCell>
                                    <TableCell>{inv.commodity.description}</TableCell>
                                    <TableCell>{inv.commodity.price}</TableCell>
                                    <TableCell>{inv.stock}</TableCell>
                                    <TableCell>{inv.headquarters.name}</TableCell>
                                    <TableCell>{inv.headquarters.city}</TableCell>
                                    <TableCell>
                                        <button className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
                                            Ver
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
