"use client"

import React, { useEffect, useState } from 'react'
import { getAllHeadquarters } from '@/app/protected/headquarter/services/headquarter.services'
import { Headquarter } from '@/app/protected/headquarter/models/headquarter.models'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

export default function HeadquarterList() {
  const [items, setItems] = useState<Headquarter[]>([])

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllHeadquarters()
        setItems(data)
      } catch {
        toast.error('Error al cargar las sedes')
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
                <TableHead>Ciudad</TableHead>
                <TableHead>Commodities</TableHead>
                <TableHead>Stock items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No hay sedes</TableCell>
                </TableRow>
              )}
              {items.map((hq, idx) => (
                <TableRow key={hq.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{hq.name}</TableCell>
                  <TableCell>{hq.city}</TableCell>
                  <TableCell>{hq.commodities?.length ?? 0}</TableCell>
                  <TableCell>{hq.inventory?.length ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
