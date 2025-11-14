import { create } from 'zustand'

interface HeadquarterState {
    headquarterId: string | null
    setHeadquarterId: (id: string | null) => void
    clearHeadquarter: () => void
}

export const useHeadquarterStore = create<HeadquarterState>((set) => ({
    headquarterId: null,
    setHeadquarterId: (id) => set({ headquarterId: id }),
    clearHeadquarter: () => set({ headquarterId: null }),
}))
