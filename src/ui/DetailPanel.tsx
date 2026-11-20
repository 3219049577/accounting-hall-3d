import { useStore } from '../state/store'
import { exhibitById } from '../data/exhibits'
import { ZONES } from '../data/layout'

export function DetailPanel() {
  const panelId = useStore((s) => s.panelId)
  const closePanel = useStore((s) => s.closePanel)
  if (!panelId) return null
  const ex = exhibitById(panelId)
  if (!ex) return null
  const zone = ZONES.find((z) => z.id === ex.zone)

  const close = () => {
    closePanel()
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const p = canvas.requestPointerLock() as unknown as Promise<void> | undefined
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
  }

  return (
    <div className="detail-mask">
      <div className="detail-panel">
        <div className="detail-head">
          <span className="detail-zone">{zone?.name}</span>
          <button className="detail-close" onClick={close} aria-label="关闭详情">
            ×
          </button>
        </div>
        <h2>{ex.name}</h2>
        <p className="detail-brief">{ex.brief}</p>
        <div className="detail-img">
          <span className="detail-img-name">{ex.name}</span>
          <span className="detail-img-badge">示意图 · 程序化 3D 模型占位，非真实照片</span>
        </div>
        {ex.intro.map((p, i) => (
          <p key={i} className="detail-p">
            {p}
          </p>
        ))}
        <h3>要点</h3>
        <ul className="detail-points">
          {ex.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        {ex.link ? (
          <a className="detail-link" href={ex.link.url} target="_blank" rel="noreferrer">
            外部资源：{ex.link.label}
          </a>
        ) : (
          <span className="detail-link disabled">外部资源链接：未配置（演示占位）</span>
        )}
        <p className="detail-source">来源说明：{ex.source}</p>
        <button className="primary" onClick={close}>
          关闭并继续漫游
        </button>
      </div>
    </div>
  )
}