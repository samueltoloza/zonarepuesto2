/* eslint-disable react-hooks/rules-of-hooks */
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
import { getAllInventorySinBridge } from './services'
import { InventoryAll } from './models'

export default function page() {
    const [inventory, setInventory] = useState<InventoryAll[]>([])


    useEffect(() => {
        (async () => {
            const data = await getAllInventorySinBridge()
            setInventory(data)
        })()
    }, [])

    return (
        <div className="pt-6 px-4">
            <div className="overflow-x-auto">
                <div className="max-h-[70vh] w-auto">
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
                            {inventory.map((inv, idx) => (
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
