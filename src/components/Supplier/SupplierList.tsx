"use client"

import React, { useEffect, useState } from 'react'
import { getAllSuppliers } from '@/app/protected/supplier/services/supplier.services'
import { Supplier } from '@/app/protected/supplier/models/supplier.models'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

export default function SupplierList() {
    const [items, setItems] = useState<Supplier[]>([])

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllSuppliers()
                setItems(data)
            } catch {
                toast.error('Error al cargar proveedores')
            }
        })()
    }, [])

    return (
        <div className="pt-6 px-4">
            <div className="overflow-x-auto">
                <div className="max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nombre</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No hay proveedores</TableCell>
                                </TableRow>
                            )}
                            {items.map((p, idx) => (
                                <TableRow key={p.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{p.document}</TableCell>
                                    <TableCell>{p.email}</TableCell>
                                    <TableCell>{p.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
