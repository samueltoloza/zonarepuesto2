import React from 'react'
import SaleList from '@/components/Sales/SaleList'
import { auth } from '@/lib'

export default async function page() {
  const user = await auth();
  if (!user?.user?.id) return <div>No autorizado</div>

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-2xl font-bold pb-6 flex flex-col items-center justify-center">Ventas</h1>
      <div className="flex-1 min-h-0">
        <SaleList />
      </div>
    </div>
  )
}
