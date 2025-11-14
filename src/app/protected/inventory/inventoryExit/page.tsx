import FormInventoryExit from '@/components/Inventory/FormInventoryExit'
import React from 'react'
import { auth } from '@/lib'

export default async function page() {
    const user = await auth();

    if (!user?.user?.id) return <div>No autorizado</div>;

    return (
        <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold pb-6 flex flex-col items-center justify-center">Salida de Inventario</h1>
            <div className="flex-1 min-h-0 flex flex-col">
                <FormInventoryExit idUser={user.user?.id} />
            </div>
        </div>
    )
}
