import * as THREE from 'three'

const FONT = '"Microsoft YaHei", "SimHei", "PingFang SC", sans-serif'

export function makeTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  draw(ctx)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number, maxLines: number) {
  let line = ''
  let lines = 0
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW && line) {
      ctx.fillText(line, x, y)
      y += lineH
      lines++
      line = ch
      if (lines >= maxLines - 1) break
    } else line += ch
  }
  if (line && lines < maxLines) ctx.fillText(line, x, y)
}

export function nameplateTexture(name: string, brief: string, zoneLabel: string): THREE.CanvasTexture {
  return makeTexture(512, 256, (ctx) => {
    ctx.fillStyle = 'rgba(7,14,28,0.95)'
    ctx.fillRect(0, 0, 512, 256)
    ctx.strokeStyle = '#d4a017'
    ctx.lineWidth = 4
    ctx.strokeRect(6, 6, 500, 244)
    ctx.fillStyle = '#d4a017'
    ctx.font = `24px ${FONT}`
    ctx.fillText(zoneLabel, 28, 48)
    ctx.fillStyle = '#ffffff'
    let size = 44
    ctx.font = `bold ${size}px ${FONT}`
    while (ctx.measureText(name).width > 456 && size > 24) {
      size -= 2
      ctx.font = `bold ${size}px ${FONT}`
    }
    ctx.fillText(name, 28, 110)
    ctx.fillStyle = '#9fc3ff'
    ctx.font = `26px ${FONT}`
    wrapText(ctx, brief, 28, 165, 456, 36, 2)
    ctx.fillStyle = '#5f7ba6'
    ctx.font = `20px ${FONT}`
    ctx.fillText('靠近或点击查看详情', 28, 232)
  })
}

export function zoneTitleTexture(title: string, sub: string): THREE.CanvasTexture {
  return makeTexture(1024, 256, (ctx) => {
    ctx.clearRect(0, 0, 1024, 256)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffd76a'
    ctx.font = `bold 84px ${FONT}`
    ctx.fillText(title, 512, 110)
    ctx.fillStyle = '#bcd6ff'
    ctx.font = `40px ${FONT}`
    ctx.fillText(sub, 512, 190)
    ctx.strokeStyle = 'rgba(212,160,23,0.8)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(180, 140)
    ctx.lineTo(844, 140)
    ctx.stroke()
  })
}

export function hallTitleTexture(): THREE.CanvasTexture {
  return makeTexture(1024, 320, (ctx) => {
    ctx.clearRect(0, 0, 1024, 320)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold 96px ${FONT}`
    ctx.fillText('从算盘到云账本', 512, 130)
    ctx.fillStyle = '#ffd76a'
    ctx.font = `44px ${FONT}`
    ctx.fillText('会计工具演进主题虚拟展厅 · 演进厅', 512, 210)
    ctx.fillStyle = '#8fb4e8'
    ctx.font = `32px ${FONT}`
    ctx.fillText('千年账脉 · 数智未来', 512, 275)
  })
}

export function spreadsheetTexture(): THREE.CanvasTexture {
  return makeTexture(512, 384, (ctx) => {
    ctx.fillStyle = '#04140a'
    ctx.fillRect(0, 0, 512, 384)
    ctx.strokeStyle = '#1d5c33'
    ctx.lineWidth = 1
    for (let x = 0; x <= 512; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 384); ctx.stroke()
    }
    for (let y = 0; y <= 384; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke()
    }
    ctx.fillStyle = '#57ff9a'
    ctx.font = `22px ${FONT}`
    const rows = ['科目        借方      贷方', '库存现金    1,200.00', '银行存款   86,400.00', '应收账款   23,150.00', '主营业务收入        96,000.00', '管理费用    7,800.00', '合计       118,550.00  96,000.00']
    rows.forEach((r, i) => ctx.fillText(r, 16, 40 + i * 44))
    ctx.fillStyle = '#2f9c5c'
    ctx.font = `18px ${FONT}`
    ctx.fillText('示意界面 · 非真实软件', 16, 368)
  })
}

export function erpTexture(): THREE.CanvasTexture {
  return makeTexture(640, 400, (ctx) => {
    ctx.fillStyle = '#0a1526'
    ctx.fillRect(0, 0, 640, 400)
    ctx.fillStyle = '#12325e'
    ctx.fillRect(0, 0, 640, 56)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold 28px ${FONT}`
    ctx.fillText('ERP 财务管理系统（示意）', 20, 38)
    const mods = ['总账', '应收', '应付', '固定资产', '成本', '报表']
    mods.forEach((m, i) => {
      const x = 20 + (i % 3) * 205
      const y = 80 + Math.floor(i / 3) * 120
      ctx.fillStyle = '#16345f'
      ctx.fillRect(x, y, 185, 100)
      ctx.strokeStyle = '#2f7bff'
      ctx.strokeRect(x, y, 185, 100)
      ctx.fillStyle = '#9fc3ff'
      ctx.font = `bold 26px ${FONT}`
      ctx.fillText(m, x + 16, y + 40)
      ctx.fillStyle = '#ffd76a'
      ctx.font = `20px ${FONT}`
      ctx.fillText('凭证 ' + (120 + i * 37) + ' 笔', x + 16, y + 76)
    })
    ctx.fillStyle = '#5f7ba6'
    ctx.font = `18px ${FONT}`
    ctx.fillText('数据为演示占位', 20, 380)
  })
}

export function sharedTexture(): THREE.CanvasTexture {
  return makeTexture(256, 192, (ctx) => {
    ctx.fillStyle = '#0a1526'
    ctx.fillRect(0, 0, 256, 192)
    ctx.fillStyle = '#12325e'
    ctx.fillRect(0, 0, 256, 30)
    ctx.fillStyle = '#9fc3ff'
    ctx.font = `16px ${FONT}`
    ctx.fillText('任务池（示意）', 8, 21)
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? '#16345f' : '#122a4d'
      ctx.fillRect(8, 38 + i * 28, 240, 22)
      ctx.fillStyle = '#ffd76a'
      ctx.font = `14px ${FONT}`
      ctx.fillText('报销单 #'+ (2041 + i) + '  待审核', 14, 54 + i * 28)
    }
  })
}

export function chartTexture(): THREE.CanvasTexture {
  return makeTexture(640, 360, (ctx) => {
    ctx.fillStyle = '#061020'
    ctx.fillRect(0, 0, 640, 360)
    ctx.fillStyle = '#ffd76a'
    ctx.font = `bold 26px ${FONT}`
    ctx.fillText('经营分析驾驶舱（示意数据）', 20, 40)
    ctx.strokeStyle = '#1d3a66'
    for (let y = 80; y <= 300; y += 55) {
      ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(610, y); ctx.stroke()
    }
    ctx.strokeStyle = '#2f7bff'
    ctx.lineWidth = 3
    ctx.beginPath()
    const pts = [260, 220, 240, 180, 150, 170, 120, 100]
    pts.forEach((y, i) => {
      const x = 40 + i * 80
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.fillStyle = '#ffd76a'
    pts.forEach((y, i) => ctx.fillRect(36 + i * 80, y - 4, 8, 8))
    ctx.fillStyle = '#57ff9a'
    ctx.font = `20px ${FONT}`
    ctx.fillText('收入趋势 ↑  现金流预警 0  异常凭证 3（随机示意）', 30, 340)
  })
}

export function robotFaceTexture(): THREE.CanvasTexture {
  return makeTexture(128, 96, (ctx) => {
    ctx.fillStyle = '#061020'
    ctx.fillRect(0, 0, 128, 96)
    ctx.fillStyle = '#57d0ff'
    ctx.beginPath(); ctx.arc(40, 40, 10, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(88, 40, 10, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#57d0ff'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.arc(64, 58, 20, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke()
  })
}

export function serverTexture(): THREE.CanvasTexture {
  return makeTexture(256, 512, (ctx) => {
    ctx.fillStyle = '#0b1220'
    ctx.fillRect(0, 0, 256, 512)
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = '#152238'
      ctx.fillRect(12, 12 + i * 50, 232, 40)
      ctx.fillStyle = i % 3 === 0 ? '#ffd76a' : '#57ff9a'
      ctx.fillRect(20, 26 + i * 50, 8, 12)
      ctx.fillStyle = '#2f7bff'
      ctx.fillRect(36, 26 + i * 50, 8, 12)
      ctx.fillStyle = '#22344f'
      for (let k = 0; k < 8; k++) ctx.fillRect(60 + k * 22, 22 + i * 50, 14, 20)
    }
  })
}

export function openBookTexture(): THREE.CanvasTexture {
  return makeTexture(512, 320, (ctx) => {
    ctx.fillStyle = '#f3e9d2'
    ctx.fillRect(0, 0, 512, 320)
    ctx.strokeStyle = '#b03a2e'
    ctx.lineWidth = 2
    for (let x = 40; x < 512; x += 56) {
      ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x, 304); ctx.stroke()
    }
    ctx.strokeRect(16, 16, 480, 288)
    ctx.fillStyle = '#3b2a1a'
    ctx.font = `26px ${FONT}`
    const cols = ['借方', '贷方', '摘要', '金额', '日期']
    cols.forEach((c, i) => {
      for (let k = 0; k < 2; k++) ctx.fillText(c[k] ?? '', 52 + i * 56, 60 + k * 34)
    })
    ctx.font = `22px ${FONT}`
    ctx.fillText('示意账页', 200, 290)
  })
}