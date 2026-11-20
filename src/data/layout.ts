export const HALL = {
  minX: -11,
  maxX: 11,
  minZ: -21,
  maxZ: 19,
  wallH: 5,
  eye: 1.6,
  spawn: [0, 1.6, 17] as [number, number, number],
  spawnYaw: 0,
  dividers: [6, -6],
  openingHalf: 3,
  playerRadius: 0.35,
  walkSpeed: 4,
  runSpeed: 6.5,
  interactDistance: 7,
  nearDistance: 3.4,
}

export type ZoneId = 'A' | 'B' | 'C'

export const ZONES: { id: ZoneId; name: string; sub: string; view: [number, number, number]; yaw: number }[] = [
  { id: 'A', name: '第一展区 · 算盘时代', sub: '手工记账：一把算盘一支笔', view: [0, 1.6, 14], yaw: 0 },
  { id: 'B', name: '第二展区 · 电算化时代', sub: '数字转型：软件接管账簿', view: [0, 1.6, 4], yaw: 0 },
  { id: 'C', name: '第三展区 · 云端时代', sub: '智能财务：机器人与云账本', view: [0, 1.6, -8], yaw: 0 },
]

export function zoneOf(z: number): ZoneId {
  if (z > 6) return 'A'
  if (z > -6) return 'B'
  return 'C'
}