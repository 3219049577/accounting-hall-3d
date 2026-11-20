export interface HallEntry {
  id: string
  name: string
  theme: string
  available: boolean
}

export const PROJECT_NAME = '从算盘到云账本'
export const PROJECT_SUB = '会计工具演进主题 3D 虚拟展厅'
export const CORE_QUESTION = '一千年来，记账与算账的工具如何演进，让每一笔账更清楚、更可信？'

export const HALLS: HallEntry[] = [
  { id: 'evolution', name: '演进厅', theme: '从算盘到云账本：会计工具演进', available: true },
  { id: 'governance', name: '数智治理厅', theme: '数字中国下的财务顶层设计', available: false },
  { id: 'audit', name: '智能审计厅', theme: '数字工匠的硬核实践', available: false },
  { id: 'vision', name: '未来愿景厅', theme: '智慧财务绘就新图景', available: false },
]