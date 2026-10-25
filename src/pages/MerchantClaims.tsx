import { useMemo, useState } from 'react'
import { useStore, type ClaimStatus } from '../app/store'
import { Icon } from '../components/Icon'
import { StatusBadge } from '../components/StatusBadge'

export function MerchantClaims() {
  const { claims, updateClaim, resetDemo } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ทั้งหมด' | ClaimStatus>('ทั้งหมด')
  const filtered = useMemo(() => claims.filter((claim) =>
    (filter === 'ทั้งหมด' || claim.status === filter) &&
    `${claim.id} ${claim.orderId} ${claim.item}`.toLowerCase().includes(search.toLowerCase()),
  ), [claims, filter, search])
  const waiting = claims.filter((claim) => claim.status === 'รอตรวจสอบ').length

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">พื้นที่ร้านค้า</p><h1>จัดการคำขอ</h1><p>ตรวจสอบคำขอคืน เคลม และเปลี่ยนสินค้าจากลูกค้า</p></div>
        <button className="text-btn" onClick={resetDemo}>คืนค่าข้อมูลตัวอย่าง</button>
      </div>
      <div className="merchant-stats">
        <div className="stat-card featured"><span>รอตรวจสอบ</span><strong>{waiting}</strong><small>ควรดำเนินการวันนี้</small></div>
        <div className="stat-card"><span>คำขอทั้งหมด</span><strong>{claims.length}</strong><small>ในระบบทดลอง</small></div>
        <div className="stat-card"><span>ดำเนินการแล้ว</span><strong>{claims.filter((c) => ['อนุมัติแล้ว', 'ปฏิเสธ'].includes(c.status)).length}</strong><small>อนุมัติหรือปฏิเสธ</small></div>
      </div>
      <section className="table-card">
        <div className="table-tools">
          <div className="search-box"><Icon name="search" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาเลขคำขอ ออเดอร์ หรือสินค้า" /></div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option>ทั้งหมด</option><option>รอตรวจสอบ</option><option>ขอข้อมูลเพิ่ม</option><option>อนุมัติแล้ว</option><option>ปฏิเสธ</option>
          </select>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>คำขอ</th><th>สินค้า</th><th>ประเภท</th><th>เหตุผล</th><th>สถานะ</th><th>ดำเนินการ</th></tr></thead>
            <tbody>
              {filtered.map((claim) => (
                <tr key={claim.id}>
                  <td><strong>{claim.id}</strong><small>{claim.createdAt}</small></td>
                  <td><strong>{claim.item}</strong><small>{claim.orderId}</small></td>
                  <td>{claim.type}<small>{claim.quantity} ชิ้น</small></td>
                  <td>{claim.reason}<small>{claim.detail || 'ไม่มีรายละเอียด'}</small></td>
                  <td><StatusBadge status={claim.status} /></td>
                  <td>
                    <div className="action-row">
                      <button title="อนุมัติ" className="approve" onClick={() => updateClaim(claim.id, 'อนุมัติแล้ว')}><Icon name="check" size={17} /></button>
                      <button onClick={() => updateClaim(claim.id, 'ขอข้อมูลเพิ่ม')}>ขอข้อมูล</button>
                      <button className="reject" onClick={() => updateClaim(claim.id, 'ปฏิเสธ')}>ปฏิเสธ</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="empty-cell">ไม่พบคำขอที่ค้นหา</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
