import { Link, useSearchParams } from 'react-router'
import { useStore } from '../app/store'
import { Icon } from '../components/Icon'
import { StatusBadge } from '../components/StatusBadge'

export function CustomerReturns() {
  const { claims } = useStore()
  const [params] = useSearchParams()
  return (
    <>
      {params.get('created') && <div className="success-banner"><span><Icon name="check" /></span><div><strong>ส่งคำขอเรียบร้อยแล้ว</strong><p>ร้านค้าจะตรวจสอบและอัปเดตสถานะให้คุณ</p></div></div>}
      <div className="page-heading">
        <div><p className="eyebrow">ติดตามสถานะ</p><h1>คำขอของฉัน</h1><p>ดูความคืบหน้าของการคืน เคลม และเปลี่ยนสินค้า</p></div>
        <Link to="/customer/returns/new" className="primary-btn">ยื่นคำขอใหม่ <Icon name="arrow" size={17} /></Link>
      </div>
      <div className="claim-list">
        {claims.length === 0 ? <div className="empty-state"><Icon name="return" size={32} /><h2>ยังไม่มีคำขอ</h2><p>เมื่อยื่นคำขอแล้ว สถานะจะแสดงที่นี่</p></div> :
          claims.map((claim) => (
            <article className="claim-card" key={claim.id}>
              <div className="claim-top"><div><span className="claim-id">{claim.id}</span><span>{claim.createdAt}</span></div><StatusBadge status={claim.status} /></div>
              <div className="claim-body">
                <div><span className="field-label">สินค้า</span><strong>{claim.item}</strong><small>คำสั่งซื้อ {claim.orderId}</small></div>
                <div><span className="field-label">ประเภท</span><strong>{claim.type}</strong><small>จำนวน {claim.quantity} ชิ้น</small></div>
                <div><span className="field-label">เหตุผล</span><strong>{claim.reason}</strong><small>{claim.detail || 'ไม่ได้ระบุรายละเอียดเพิ่มเติม'}</small></div>
              </div>
            </article>
          ))}
      </div>
    </>
  )
}
