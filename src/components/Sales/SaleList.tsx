"use client"

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

type SaleItem = { id: string; commodity?: { name?: string }; commodityId?: string; quantity: number }

type Sale = {
  id: string;
  date: string;
  total: number;
  headquarters?: { name?: string } | null;
  items: SaleItem[];
}

export default function SaleList() {
  const [items, setItems] = useState<Sale[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/sales')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error')
        setItems(data)
      } catch {
        toast.error('Error al cargar ventas')
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
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No hay ventas</TableCell>
                </TableRow>
              )}
              {items.map((s, idx) => (
                <TableRow key={s.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{new Date(s.date).toLocaleString()}</TableCell>
                  <TableCell>{s.total}</TableCell>
                  <TableCell>{s.headquarters?.name ?? '-'}</TableCell>
                  <TableCell>
                    <ul>
                      {s.items.map((it: SaleItem) => (
                        <li key={it.id}>{it.commodity?.name ?? it.commodityId} x {it.quantity}</li>
                      ))}
                    </ul>
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
