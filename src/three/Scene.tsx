import { Canvas } from '@react-three/fiber'
import { HALL } from '../data/layout'
import { EXHIBITS } from '../data/exhibits'
import { Hall } from './Hall'
import { Exhibit } from './Exhibit'
import { DataFlow } from './DataFlow'
import { PlayerController } from './PlayerController'

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 70, near: 0.1, far: 120, position: HALL.spawn }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute('role', 'application')
        gl.domElement.setAttribute('aria-label', '3D 展厅视口')
      }}
    >
      <color attach="background" args={['#050a14']} />
      <fog attach="fog" args={['#050a14', 26, 62]} />
      <Hall />
      {EXHIBITS.map((e) => (
        <Exhibit key={e.id} config={e} />
      ))}
      <DataFlow />
      <PlayerController />
    </Canvas>
  )
}