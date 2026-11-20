import { HALL } from '../data/layout'
import { EXHIBITS } from '../data/exhibits'

export interface Box2 {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

const T = 0.4
const PEDESTAL_HALF = 0.95

function buildColliders(): Box2[] {
  const boxes: Box2[] = [
    { minX: HALL.minX - T, maxX: HALL.minX, minZ: HALL.minZ - T, maxZ: HALL.maxZ + T },
    { minX: HALL.maxX, maxX: HALL.maxX + T, minZ: HALL.minZ - T, maxZ: HALL.maxZ + T },
    { minX: HALL.minX - T, maxX: HALL.maxX + T, minZ: HALL.minZ - T, maxZ: HALL.minZ },
    { minX: HALL.minX - T, maxX: HALL.maxX + T, minZ: HALL.maxZ, maxZ: HALL.maxZ + T },
  ]
  for (const z of HALL.dividers) {
    boxes.push({ minX: HALL.minX, maxX: -HALL.openingHalf, minZ: z - T / 2, maxZ: z + T / 2 })
    boxes.push({ minX: HALL.openingHalf, maxX: HALL.maxX, minZ: z - T / 2, maxZ: z + T / 2 })
  }
  for (const e of EXHIBITS) {
    boxes.push({
      minX: e.position[0] - PEDESTAL_HALF,
      maxX: e.position[0] + PEDESTAL_HALF,
      minZ: e.position[2] - PEDESTAL_HALF,
      maxZ: e.position[2] + PEDESTAL_HALF,
    })
  }
  return boxes
}

export const COLLIDERS: Box2[] = buildColliders()

function hits(x: number, z: number, r: number): boolean {
  for (const b of COLLIDERS) {
    const cx = Math.min(Math.max(x, b.minX), b.maxX)
    const cz = Math.min(Math.max(z, b.minZ), b.maxZ)
    const dx = x - cx
    const dz = z - cz
    if (dx * dx + dz * dz < r * r) return true
  }
  return false
}

export function moveWithCollision(x: number, z: number, dx: number, dz: number, r: number): [number, number] {
  let nx = x + dx
  if (hits(nx, z, r)) nx = x
  let nz = z + dz
  if (hits(nx, nz, r)) nz = z
  return [nx, nz]
}