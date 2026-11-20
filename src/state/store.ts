import { create } from 'zustand'
import { HALL, type ZoneId } from '../data/layout'

interface JumpTarget {
  pos: [number, number, number]
  yaw: number
  token: number
}

interface AppState {
  started: boolean
  locked: boolean
  helpOpen: boolean
  panelId: string | null
  hoverId: string | null
  zone: ZoneId
  resetToken: number
  jump: JumpTarget | null
  enter: () => void
  setLocked: (v: boolean) => void
  setHelp: (v: boolean) => void
  openPanel: (id: string) => void
  closePanel: () => void
  setHover: (id: string | null) => void
  setZone: (z: ZoneId) => void
  reset: () => void
  jumpTo: (pos: [number, number, number], yaw: number) => void
}

export const useStore = create<AppState>((set) => ({
  started: false,
  locked: false,
  helpOpen: false,
  panelId: null,
  hoverId: null,
  zone: 'A',
  resetToken: 0,
  jump: null,
  enter: () => set({ started: true }),
  setLocked: (v) => set({ locked: v }),
  setHelp: (v) => set({ helpOpen: v }),
  openPanel: (id) => set({ panelId: id, helpOpen: false }),
  closePanel: () => set({ panelId: null }),
  setHover: (id) => set({ hoverId: id }),
  setZone: (z) => set({ zone: z }),
  reset: () =>
    set((s) => ({
      resetToken: s.resetToken + 1,
      jump: { pos: HALL.spawn, yaw: HALL.spawnYaw, token: s.resetToken + 1 },
      panelId: null,
    })),
  jumpTo: (pos, yaw) => set((s) => ({ jump: { pos, yaw, token: s.resetToken + 1000 + Math.random() }, panelId: null })),
}))