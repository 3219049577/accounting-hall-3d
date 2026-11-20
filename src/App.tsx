import { Scene } from './three/Scene'
import { HUD } from './ui/HUD'
import { DetailPanel } from './ui/DetailPanel'

export default function App() {
  return (
    <div className="app">
      <Scene />
      <HUD />
      <DetailPanel />
    </div>
  )
}