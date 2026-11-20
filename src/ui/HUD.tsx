import { useStore } from '../state/store'
import { HALLS, PROJECT_NAME, PROJECT_SUB, CORE_QUESTION } from '../data/halls'
import { ZONES } from '../data/layout'
import { exhibitById } from '../data/exhibits'

function lockCanvas() {
  const canvas = document.querySelector('canvas')
  if (!canvas) return
  const p = canvas.requestPointerLock() as unknown as Promise<void> | undefined
  if (p && typeof p.catch === 'function') p.catch(() => {})
}

export function HUD() {
  const started = useStore((s) => s.started)
  const locked = useStore((s) => s.locked)
  const helpOpen = useStore((s) => s.helpOpen)
  const zone = useStore((s) => s.zone)
  const hoverId = useStore((s) => s.hoverId)
  const panelId = useStore((s) => s.panelId)
  const enter = useStore((s) => s.enter)
  const reset = useStore((s) => s.reset)
  const setHelp = useStore((s) => s.setHelp)
  const jumpTo = useStore((s) => s.jumpTo)
  const zoneName = ZONES.find((z) => z.id === zone)?.name ?? ''
  const hover = hoverId ? exhibitById(hoverId) : null

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else document.documentElement.requestFullscreen().catch(() => {})
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">{PROJECT_NAME}</span>
          <span className="brand-sub">{PROJECT_SUB}</span>
        </div>
        <div className="topbar-right">
          <span className="zone-tag">当前展厅：演进厅 · {zoneName}</span>
          <button onClick={reset}>重置位置</button>
          <button onClick={() => setHelp(true)}>操作说明</button>
          <button onClick={toggleFullscreen}>全屏</button>
        </div>
      </header>

      <aside className="navpanel">
        <h3>展厅导航</h3>
        <ul className="hall-list">
          {HALLS.map((h) => (
            <li key={h.id} className={h.available ? 'hall current' : 'hall disabled'}>
              <span className="hall-name">{h.name}</span>
              <span className="hall-state">{h.available ? '当前可用' : '建设中'}</span>
              <span className="hall-theme">{h.theme}</span>
            </li>
          ))}
        </ul>
        <h3>本厅展区直达</h3>
        <ul className="zone-list">
          {ZONES.map((z) => (
            <li key={z.id}>
              <button className={zone === z.id ? 'zone-btn active' : 'zone-btn'} onClick={() => jumpTo(z.view, z.yaw)}>
                {z.name}
              </button>
            </li>
          ))}
        </ul>
        <p className="nav-note">沿中央动线向北依次参观三个展区</p>
      </aside>

      <footer className="hintbar">
        <span>W A S D 移动</span>
        <span>鼠标 / 按住左键拖拽 转动视角</span>
        <span>点击展品 查看详情</span>
        <span>ESC 释放鼠标</span>
        <span>R 重置位置</span>
        <span>Shift 加速</span>
      </footer>

      {locked && !panelId && <div className="crosshair" />}
      {locked && hover && !panelId && <div className="hover-tip">点击查看《{hover.name}》</div>}

      {helpOpen && (
        <div className="modal-mask" onClick={() => setHelp(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>操作说明</h2>
            <ul>
              <li>点击画面进入鼠标锁定，移动鼠标转动视角</li>
              <li>若环境不支持鼠标锁定：按住左键拖拽同样可转动视角</li>
              <li>W / A / S / D 前后左右移动，Shift 加速</li>
              <li>靠近展品自动高亮；点击展品打开详情面板</li>
              <li>详情面板关闭后自动恢复漫游</li>
              <li>ESC 释放鼠标锁定；R 或右上角按钮重置位置</li>
              <li>右侧导航可直达三个展区；墙壁与展台不可穿越</li>
            </ul>
            <button className="primary" onClick={() => setHelp(false)}>
              知道了
            </button>
          </div>
        </div>
      )}

      {!started && (
        <div className="start-mask">
          <div className="start-card">
            <h1>{PROJECT_NAME}</h1>
            <p className="start-sub">{PROJECT_SUB} · 演进厅</p>
            <p className="start-question">{CORE_QUESTION}</p>
            <div className="start-zones">
              {ZONES.map((z) => (
                <div key={z.id} className="start-zone">
                  <strong>{z.name}</strong>
                  <span>{z.sub}</span>
                </div>
              ))}
            </div>
            <p className="start-controls">WASD 移动 · 鼠标锁定或按住左键拖拽转视角 · 点击展品看详情 · ESC 释放鼠标 · R 重置</p>
            <button
              className="primary big"
              onClick={() => {
                enter()
                lockCanvas()
              }}
            >
              进入展厅
            </button>
            <p className="start-note">全部展品模型与界面画面为程序化生成的教学示意，非真实文物 / 软件截图</p>
          </div>
        </div>
      )}
    </>
  )
}