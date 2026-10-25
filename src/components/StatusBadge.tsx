import type { ClaimStatus } from '../app/store'

export function StatusBadge({ status }: { status: ClaimStatus }) {
  const tone = status === 'อนุมัติแล้ว' ? 'success' : status === 'ปฏิเสธ' ? 'danger' : status === 'ขอข้อมูลเพิ่ม' ? 'info' : 'warning'
  return <span className={`status ${tone}`}><span />{status}</span>
}
