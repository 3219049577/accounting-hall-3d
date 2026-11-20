import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 360

export function DataFlow() {
  const points = useRef<THREE.Points>(null)
  const seeds = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({ off: (i / COUNT) * 38, sway: Math.sin(i * 1.7) * 1.4, ph: i * 0.37 })),
    [],
  )
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i]
      const z = 18 - ((s.off + t * 2.2) % 38)
      positions[i * 3] = s.sway + Math.sin(t * 0.8 + s.ph) * 0.35
      positions[i * 3 + 1] = 3.25 + Math.sin(t * 1.6 + s.ph) * 0.18
      positions[i * 3 + 2] = z
    }
    const attr = points.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined
    if (attr) {
      attr.needsUpdate = true
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#ffd76a" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}