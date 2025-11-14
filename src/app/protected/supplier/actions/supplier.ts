'use server'

export const getSupplierOptions = async (): Promise<{ label: string; value: string }[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/supplier`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-cache',
  })
  const data = await res.json()
  return data.map((s: { id: string; name: string }) => ({ label: s.name, value: s.id }))
}
