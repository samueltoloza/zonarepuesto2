"use client"

import React, { useEffect, useState } from 'react'
import { getAllProducts } from '@/app/protected/product/services/product.services'
import { Product } from '@/app/protected/product/models/product.models'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

export default function ProductList() {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllProducts()
        setItems(data)
      } catch {
        toast.error('Error al cargar productos')
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
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Proveedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No hay productos</TableCell>
                </TableRow>
              )}
              {items.map((p, idx) => (
                <TableRow key={p.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.headquarters?.name ?? p.headquartersId ?? '-'}</TableCell>
                  <TableCell>{p.supplier?.name ?? p.supplierId ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
