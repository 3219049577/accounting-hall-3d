import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ModelKind } from '../data/exhibits'
import {
  spreadsheetTexture,
  erpTexture,
  sharedTexture,
  chartTexture,
  robotFaceTexture,
  serverTexture,
  openBookTexture,
} from './textures'

const WOOD = '#8b5a2b'
const WOOD_DARK = '#5e3a1a'
const BEIGE = '#d8d0c0'
const METAL = '#2a3648'

function Abacus() {
  const rods = 7
  const beads = useMemo(() => {
    const list: { x: number; y: number }[] = []
    for (let r = 0; r < rods; r++) {
      const x = -0.45 + r * 0.15
      list.push({ x, y: 0.28 }, { x, y: 0.19 })
      for (let b = 0; b < 5; b++) list.push({ x, y: -0.02 - b * 0.09 })
    }
    return list
  }, [])
  return (
    <group position={[0, 0.55, 0]} rotation={[-0.25, 0, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.15, 0.07, 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[1.15, 0.07, 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[-0.56, 0, 0]}>
        <boxGeometry args={[0.07, 0.9, 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[0.56, 0, 0]}>
        <boxGeometry args={[0.07, 0.9, 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.1, 0.05, 0.05]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </mesh>
      {Array.from({ length: rods }).map((_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.82, 6]} />
          <meshStandardMaterial color={WOOD_DARK} />
        </mesh>
      ))}
      {beads.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, 0]} scale={[1, 0.72, 0.72]}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <meshStandardMaterial color={i % 7 < 2 ? '#c98a3d' : '#7a4a21'} roughness={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Ledger() {
  const book = useMemo(() => openBookTexture(), [])
  return (
    <group position={[0, 0.06, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.28, 0.05 + i * 0.07, 0.1]} rotation={[0, 0.12 * i, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.36]} />
          <meshStandardMaterial color={['#7a4a21', '#8a5a2b', '#6a3a1a'][i]} roughness={0.7} />
        </mesh>
      ))}
      <group position={[0.22, 0.1, -0.05]} rotation={[-0.5, 0, 0]}>
        <mesh position={[-0.19, 0, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.38, 0.015, 0.3]} />
          <meshStandardMaterial color="#f3e9d2" roughness={0.9} />
        </mesh>
        <mesh position={[0.19, 0, 0]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.38, 0.015, 0.3]} />
          <meshStandardMaterial color="#f3e9d2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.74, 0.28]} />
          <meshStandardMaterial map={book} roughness={0.9} />
        </mesh>
      </group>
      <mesh position={[0.45, 0.16, 0.22]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[0.38, 0.03, 0.22]}>
        <coneGeometry args={[0.02, 0.06, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

function OldPc() {
  const screen = useMemo(() => spreadsheetTexture(), [])
  return (
    <group position={[0, 0.02, 0]}>
      <mesh position={[0, 0.32, -0.05]}>
        <boxGeometry args={[0.52, 0.42, 0.4]} />
        <meshStandardMaterial color={BEIGE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.34, 0.16]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshStandardMaterial map={screen} emissive="#57ff9a" emissiveIntensity={0.25} emissiveMap={screen} />
      </mesh>
      <mesh position={[0, 0.06, 0.05]}>
        <boxGeometry args={[0.5, 0.1, 0.3]} />
        <meshStandardMaterial color={BEIGE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.035, 0.32]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.46, 0.03, 0.18]} />
        <meshStandardMaterial color="#c9c0ae" roughness={0.6} />
      </mesh>
      <mesh position={[0.42, 0.2, -0.05]}>
        <boxGeometry args={[0.18, 0.4, 0.36]} />
        <meshStandardMaterial color={BEIGE} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Erp() {
  const tex = useMemo(() => erpTexture(), [])
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.12, 20]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.5, 0.95, 0.06]} />
        <meshStandardMaterial color="#0a1526" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, 0.035]}>
        <planeGeometry args={[1.42, 0.87]} />
        <meshStandardMaterial map={tex} emissive="#2f7bff" emissiveIntensity={0.35} emissiveMap={tex} />
      </mesh>
    </group>
  )
}

function Shared() {
  const tex = useMemo(() => sharedTexture(), [])
  return (
    <group position={[0, 0, 0]}>
      {[-0.55, 0, 0.55].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.36, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.34]} />
            <meshStandardMaterial color="#3a4a63" roughness={0.5} />
          </mesh>
          {[-0.2, 0.2].map((lx) =>
            [-0.13, 0.13].map((lz) => (
              <mesh key={`${lx}${lz}`} position={[lx, 0.17, lz]}>
                <boxGeometry args={[0.03, 0.34, 0.03]} />
                <meshStandardMaterial color={METAL} />
              </mesh>
            )),
          )}
          <mesh position={[0, 0.55, -0.08]}>
            <boxGeometry args={[0.3, 0.22, 0.03]} />
            <meshStandardMaterial color="#0a1526" />
          </mesh>
          <mesh position={[0, 0.55, -0.06]}>
            <planeGeometry args={[0.27, 0.19]} />
            <meshStandardMaterial map={tex} emissive="#2f7bff" emissiveIntensity={0.4} emissiveMap={tex} />
          </mesh>
          <mesh position={[0, 0.22, 0.24]}>
            <boxGeometry args={[0.22, 0.05, 0.22]} />
            <meshStandardMaterial color="#22344f" />
          </mesh>
          <mesh position={[0, 0.36, 0.33]}>
            <boxGeometry args={[0.22, 0.26, 0.04]} />
            <meshStandardMaterial color="#22344f" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Rpa() {
  const face = useMemo(() => robotFaceTexture(), [])
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (armL.current) armL.current.rotation.x = Math.sin(t * 2) * 0.5 - 0.4
    if (armR.current) armR.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.5 - 0.4
  })
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 0.12, 20]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.22, 0.4, 6, 14]} />
        <meshStandardMaterial color="#e8ecf2" metalness={0.3} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.52, 0.2]}>
        <planeGeometry args={[0.2, 0.14]} />
        <meshStandardMaterial color="#061020" emissive="#ffd76a" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.19, 18, 14]} />
        <meshStandardMaterial color="#e8ecf2" metalness={0.3} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.98, 0.16]}>
        <planeGeometry args={[0.24, 0.16]} />
        <meshStandardMaterial map={face} emissive="#57d0ff" emissiveIntensity={0.5} emissiveMap={face} />
      </mesh>
      <group ref={armL} position={[-0.26, 0.68, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.34, 10]} />
          <meshStandardMaterial color="#cfd6e4" />
        </mesh>
      </group>
      <group ref={armR} position={[0.26, 0.68, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.34, 10]} />
          <meshStandardMaterial color="#cfd6e4" />
        </mesh>
      </group>
    </group>
  )
}

function Cockpit() {
  const tex = useMemo(() => chartTexture(), [])
  const bars = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    bars.current?.children.forEach((c, i) => {
      const h = 0.25 + Math.abs(Math.sin(t * 1.2 + i * 0.9)) * 0.45
      c.scale.y = h
      c.position.y = 0.35 + h / 2
    })
  })
  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.16, 24]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.95, -0.15]} rotation={[0, Math.PI, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.62, 24, 1, true, -0.6, 1.2]} />
        <meshStandardMaterial map={tex} emissive="#2f7bff" emissiveIntensity={0.45} emissiveMap={tex} side={THREE.DoubleSide} />
      </mesh>
      <group ref={bars} position={[0, 0, 0.25]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.36 + i * 0.18, 0.5, 0]}>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color="#ffd76a" emissive="#d4a017" emissiveIntensity={0.6} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function CloudChain() {
  const tex = useMemo(() => serverTexture(), [])
  const chain = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (chain.current) chain.current.rotation.y = clock.elapsedTime * 0.5
  })
  const cubes = useMemo(() => [0, 1, 2, 3].map((i) => (i * Math.PI) / 2), [])
  return (
    <group>
      <mesh position={[-0.35, 0.62, 0]}>
        <boxGeometry args={[0.5, 1.24, 0.45]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.35, 0.62, 0.23]}>
        <planeGeometry args={[0.44, 1.16]} />
        <meshStandardMaterial map={tex} emissive="#57ff9a" emissiveIntensity={0.35} emissiveMap={tex} />
      </mesh>
      <mesh position={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.0, 0.4]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.3, 0.5, 0.21]}>
        <planeGeometry args={[0.34, 0.92]} />
        <meshStandardMaterial map={tex} emissive="#2f7bff" emissiveIntensity={0.35} emissiveMap={tex} />
      </mesh>
      <group ref={chain} position={[0, 1.65, 0]}>
        {cubes.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.42, Math.sin(a * 2) * 0.06, Math.sin(a) * 0.42]} rotation={[0.4, a, 0.2]}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <meshStandardMaterial color="#ffd76a" emissive="#d4a017" emissiveIntensity={0.8} metalness={0.4} roughness={0.3} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.012, 6, 40]} />
          <meshStandardMaterial color="#2f7bff" emissive="#2f7bff" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  )
}

export function ExhibitModel({ kind }: { kind: ModelKind }) {
  switch (kind) {
    case 'abacus': return <Abacus />
    case 'ledger': return <Ledger />
    case 'oldpc': return <OldPc />
    case 'erp': return <Erp />
    case 'shared': return <Shared />
    case 'rpa': return <Rpa />
    case 'cockpit': return <Cockpit />
    case 'cloudchain': return <CloudChain />
  }
}