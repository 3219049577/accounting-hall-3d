import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ExhibitConfig } from '../data/exhibits'
import { HALL } from '../data/layout'
import { useStore } from '../state/store'
import { nameplateTexture } from './textures'
import { ExhibitModel } from './models'

export const hitboxMeshes: THREE.Mesh[] = []

const ZONE_LABEL: Record<string, string> = { A: '第一展区 · 算盘时代', B: '第二展区 · 电算化时代', C: '第三展区 · 云端时代' }

export function Exhibit({ config }: { config: ExhibitConfig }) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const pedestalMat = useRef<THREE.MeshStandardMaterial>(null)
  const [near, setNear] = useState(false)
  const hoverId = useStore((s) => s.hoverId)
  const camera = useThree((s) => s.camera)
  const plate = useMemo(
    () => nameplateTexture(config.name, config.brief, ZONE_LABEL[config.zone]),
    [config],
  )
  const active = hoverId === config.id || near

  useEffect(() => {
    const mesh = group.current?.getObjectByName('hitbox') as THREE.Mesh | undefined
    if (mesh) {
      mesh.userData.exhibitId = config.id
      hitboxMeshes.push(mesh)
      return () => {
        const i = hitboxMeshes.indexOf(mesh)
        if (i >= 0) hitboxMeshes.splice(i, 1)
      }
    }
  }, [config.id])

  useFrame(({ clock }) => {
    if (!group.current) return
    const d = camera.position.distanceTo(group.current.position)
    const isNear = d < HALL.nearDistance
    if (isNear !== near) setNear(isNear)
    if (ring.current) {
      const m = ring.current.material as THREE.MeshStandardMaterial
      const pulse = 0.55 + Math.sin(clock.elapsedTime * 4) * 0.25
      m.emissiveIntensity = active ? pulse + 0.6 : 0.12
      m.opacity = active ? 0.95 : 0.35
    }
    if (pedestalMat.current) {
      pedestalMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        pedestalMat.current.emissiveIntensity,
        active ? 0.5 : 0.08,
        0.15,
      )
    }
  })

  return (
    <group ref={group} position={config.position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.7, 1, 1.7]} />
        <meshStandardMaterial ref={pedestalMat} color="#16233a" metalness={0.45} roughness={0.5} emissive="#2f7bff" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 1.01, 0]}>
        <boxGeometry args={[1.76, 0.04, 1.76]} />
        <meshStandardMaterial color="#d4a017" metalness={0.7} roughness={0.3} emissive="#d4a017" emissiveIntensity={0.25} />
      </mesh>
      <mesh ref={ring} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.035, 8, 48]} />
        <meshStandardMaterial color="#ffd76a" emissive="#ffd76a" emissiveIntensity={0.12} transparent opacity={0.35} />
      </mesh>
      <group position={[0, 1.03, 0]}>
        <ExhibitModel kind={config.model} />
      </group>
      <mesh position={[0, 0.62, 0.86]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshStandardMaterial map={plate} transparent emissive="#ffffff" emissiveIntensity={0.12} emissiveMap={plate} />
      </mesh>
      <mesh name="hitbox" position={[0, 1.4, 0]}>
        <boxGeometry args={[2, 2.8, 2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  )
}