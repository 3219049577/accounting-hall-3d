import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HALL, zoneOf } from '../data/layout'
import { useStore } from '../state/store'
import { moveWithCollision } from './collision'
import { hitboxMeshes } from './Exhibit'

const CENTER = new THREE.Vector2(0, 0)

export function PlayerController() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const yaw = useRef(HALL.spawnYaw)
  const pitch = useRef(0)
  const keys = useRef<Set<string>>(new Set())
  const mouseNdc = useRef(new THREE.Vector2(0, 0))
  const drag = useRef({ active: false, x: 0, y: 0, moved: 0 })
  const raycaster = useRef(new THREE.Raycaster())
  const lastJumpToken = useRef<number | null>(null)

  useEffect(() => {
    camera.rotation.order = 'YXZ'
    camera.position.set(...HALL.spawn)
    const canvas = gl.domElement
    // 自动化测试钩子：供浏览器实测脚本读取相机与状态
    ;(window as unknown as Record<string, unknown>).__player = { camera, store: useStore }

    const lock = () => {
      const p = canvas.requestPointerLock() as unknown as Promise<void> | undefined
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code)
      const st = useStore.getState()
      if (e.code === 'KeyR') st.reset()
      if (e.code === 'Escape') {
        if (st.panelId) st.closePanel()
        if (st.helpOpen) st.setHelp(false)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code)
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        yaw.current -= e.movementX * 0.0022
        pitch.current = THREE.MathUtils.clamp(pitch.current - e.movementY * 0.0022, -1.45, 1.45)
      } else {
        mouseNdc.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
        if (drag.current.active) {
          const dx = e.clientX - drag.current.x
          const dy = e.clientY - drag.current.y
          drag.current.x = e.clientX
          drag.current.y = e.clientY
          drag.current.moved += Math.abs(dx) + Math.abs(dy)
          yaw.current -= dx * 0.0022
          pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.0022, -1.45, 1.45)
        }
      }
    }
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && document.pointerLockElement !== canvas) {
        drag.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 }
      }
    }
    const onMouseUp = () => {
      drag.current.active = false
    }
    const onClick = () => {
      const st = useStore.getState()
      if (!st.started || st.panelId || st.helpOpen) return
      if (drag.current.moved > 4) return
      const src = document.pointerLockElement === canvas ? CENTER : mouseNdc.current
      raycaster.current.setFromCamera(src, camera)
      const hits = raycaster.current.intersectObjects(hitboxMeshes, false)
      if (hits.length && hits[0].distance < HALL.interactDistance) {
        st.openPanel(hits[0].object.userData.exhibitId as string)
        if (document.pointerLockElement === canvas) document.exitPointerLock()
      } else if (!st.locked) {
        lock()
      }
    }
    const onLockChange = () => {
      useStore.getState().setLocked(document.pointerLockElement === canvas)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLockChange)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLockChange)
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    const st = useStore.getState()
    const dt = Math.min(delta, 0.05)

    if (st.jump && st.jump.token !== lastJumpToken.current) {
      lastJumpToken.current = st.jump.token
      camera.position.set(...st.jump.pos)
      yaw.current = st.jump.yaw
      pitch.current = 0
    }

    const blocked = !st.started || !!st.panelId || st.helpOpen
    if (!blocked) {
      const k = keys.current
      const iz = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0)
      const ix = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0)
      if (iz || ix) {
        const len = Math.hypot(ix, iz)
        const speed = (k.has('ShiftLeft') || k.has('ShiftRight') ? HALL.runSpeed : HALL.walkSpeed) * dt
        const fx = -Math.sin(yaw.current)
        const fz = -Math.cos(yaw.current)
        const rx = Math.cos(yaw.current)
        const rz = -Math.sin(yaw.current)
        const dx = ((fx * iz + rx * ix) / len) * speed
        const dz = ((fz * iz + rz * ix) / len) * speed
        const [nx, nz] = moveWithCollision(camera.position.x, camera.position.z, dx, dz, HALL.playerRadius)
        camera.position.x = nx
        camera.position.z = nz
      }
      camera.position.y = HALL.eye
      const zone = zoneOf(camera.position.z)
      if (zone !== st.zone) st.setZone(zone)
    }

    camera.rotation.set(pitch.current, yaw.current, 0)

    if (st.started && !st.panelId) {
      raycaster.current.setFromCamera(st.locked ? CENTER : mouseNdc.current, camera)
      const hits = raycaster.current.intersectObjects(hitboxMeshes, false)
      const id = hits.length && hits[0].distance < HALL.interactDistance ? (hits[0].object.userData.exhibitId as string) : null
      if (id !== st.hoverId) st.setHover(id)
    }
  })

  return null
}