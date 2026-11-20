import { useMemo } from 'react'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { HALL, ZONES } from '../data/layout'
import { zoneTitleTexture, hallTitleTexture } from './textures'

const WALL = '#1a2740'
const GLOW_BLUE = '#2f7bff'
const GLOW_GOLD = '#d4a017'

function GlowStrip({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  )
}

export function Hall() {
  const { minX, maxX, minZ, maxZ, wallH } = HALL
  const w = maxX - minX
  const d = maxZ - minZ
  const cz = (minZ + maxZ) / 2
  const titles = useMemo(
    () => ZONES.map((z) => zoneTitleTexture(z.name, z.sub)),
    [],
  )
  const hallTitle = useMemo(() => hallTitleTexture(), [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, cz]}>
        <planeGeometry args={[w + 0.8, d + 0.8]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[220, 60]}
          mixBlur={0.9}
          mixStrength={2.2}
          mirror={0.45}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#101c30"
          metalness={0.55}
          roughness={0.4}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallH, cz]}>
        <planeGeometry args={[w + 0.8, d + 0.8]} />
        <meshStandardMaterial color="#0a1220" roughness={0.9} />
      </mesh>

      <mesh position={[minX - 0.2, wallH / 2, cz]}>
        <boxGeometry args={[0.4, wallH, d + 0.8]} />
        <meshStandardMaterial color={WALL} roughness={0.8} />
      </mesh>
      <mesh position={[maxX + 0.2, wallH / 2, cz]}>
        <boxGeometry args={[0.4, wallH, d + 0.8]} />
        <meshStandardMaterial color={WALL} roughness={0.8} />
      </mesh>
      <mesh position={[0, wallH / 2, minZ - 0.2]}>
        <boxGeometry args={[w + 0.8, wallH, 0.4]} />
        <meshStandardMaterial color={WALL} roughness={0.8} />
      </mesh>
      <mesh position={[0, wallH / 2, maxZ + 0.2]}>
        <boxGeometry args={[w + 0.8, wallH, 0.4]} />
        <meshStandardMaterial color={WALL} roughness={0.8} />
      </mesh>

      {[minX + 0.02, maxX - 0.02].map((x, i) => (
        <group key={i}>
          <GlowStrip position={[x, 1.1, cz]} size={[0.05, 0.06, d]} color={GLOW_BLUE} />
          <GlowStrip position={[x, 3.5, cz]} size={[0.05, 0.06, d]} color={GLOW_BLUE} />
        </group>
      ))}
      {[minZ + 0.02, maxZ - 0.02].map((z, i) => (
        <group key={i}>
          <GlowStrip position={[0, 1.1, z]} size={[w, 0.06, 0.05]} color={i === 0 ? GLOW_GOLD : GLOW_BLUE} />
          <GlowStrip position={[0, 3.5, z]} size={[w, 0.06, 0.05]} color={GLOW_BLUE} />
        </group>
      ))}

      {HALL.dividers.map((z, i) => (
        <group key={z}>
          {[-1, 1].map((side) => {
            const segW = maxX - HALL.openingHalf
            const cx = side * (HALL.openingHalf + segW / 2)
            return (
              <group key={side}>
                <mesh position={[cx, wallH / 2, z]}>
                  <boxGeometry args={[segW, wallH, 0.4]} />
                  <meshStandardMaterial color="#20304e" roughness={0.75} />
                </mesh>
                <GlowStrip position={[cx, wallH - 0.15, z + 0.21]} size={[segW, 0.08, 0.05]} color={GLOW_GOLD} />
                <GlowStrip position={[cx, 1.1, z + 0.21]} size={[segW, 0.05, 0.05]} color={GLOW_BLUE} />
              </group>
            )
          })}
          <mesh position={[0, 3.7, z + 0.25]}>
            <planeGeometry args={[7, 1.75]} />
            <meshBasicMaterial map={titles[i + 1]} transparent toneMapped={false} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 3.3, 12.8]}>
        <planeGeometry args={[7, 1.75]} />
        <meshBasicMaterial map={titles[0]} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.1, minZ + 0.05]}>
        <planeGeometry args={[9, 2.8]} />
        <meshBasicMaterial map={hallTitle} transparent toneMapped={false} />
      </mesh>

      {[-5, 0, 5].map((x) => (
        <GlowStrip key={x} position={[x, wallH - 0.06, cz]} size={[0.25, 0.06, d - 2]} color="#9fd0ff" />
      ))}

      <group position={[0, 0, maxZ - 0.05]}>
        <GlowStrip position={[-1.6, 2.2, 0]} size={[0.12, 4.4, 0.12]} color={GLOW_GOLD} />
        <GlowStrip position={[1.6, 2.2, 0]} size={[0.12, 4.4, 0.12]} color={GLOW_GOLD} />
        <GlowStrip position={[0, 4.4, 0]} size={[3.3, 0.12, 0.12]} color={GLOW_GOLD} />
      </group>

      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 9, 4]} intensity={1.1} color="#cfe0ff" />
      <pointLight position={[0, 4.2, 12]} intensity={60} distance={26} decay={2} color="#bcd6ff" />
      <pointLight position={[0, 4.2, 0]} intensity={60} distance={26} decay={2} color="#bcd6ff" />
      <pointLight position={[0, 4.2, -12]} intensity={60} distance={26} decay={2} color="#bcd6ff" />
      <pointLight position={[0, 3.4, -18]} intensity={36} distance={18} decay={2} color="#ffcf6a" />
    </group>
  )
}