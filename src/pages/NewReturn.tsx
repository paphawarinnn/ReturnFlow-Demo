import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useStore, type Claim } from '../app/store'
import { Icon } from '../components/Icon'

export function NewReturn() {
  const { orders, addClaim } = useStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const initialOrder = orders.find((item) => item.id === params.get('order')) || orders[0]
  const [orderId, setOrderId] = useState(initialOrder.id)
  const [type, setType] = useState<Claim['type']>('คืนสินค้า')
  const [reason, setReason] = useState('สินค้าเสียหาย')
  const [detail, setDetail] = useState('')
  const order = orders.find((item) => item.id === orderId)!

  function submit(event: FormEvent) {
    event.preventDefault()
    addClaim({ orderId, type, quantity: 1, reason, detail })
    navigate('/customer/returns?created=1')
  }

  return (
    <>
      <div className="breadcrumbs"><Link to="/customer/orders">คำสั่งซื้อ</Link><span>/</span><span>ยื่นคำขอใหม่</span></div>
      <div className="page-heading compact"><div><p className="eyebrow">แบบฟอร์มคำขอ</p><h1>คืน เคลม หรือเปลี่ยนสินค้า</h1><p>กรอกข้อมูลสั้น ๆ เพื่อให้ร้านค้าตรวจสอบ</p></div></div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-section">
          <div className="step-num">1</div>
          <div className="form-content">
            <h2>เลือกคำสั่งซื้อ</h2>
            <label>สินค้า
              <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                {orders.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.item}</option>)}
              </select>
            </label>
            <div className="selected-product"><div className="mini-thumb">{order.image}</div><div><strong>{order.item}</strong><span>จำนวนที่ขอได้ 1 ชิ้น • ฿{order.price.toLocaleString()}</span></div><Icon name="check" /></div>
          </div>
        </div>
        <div className="form-section">
          <div className="step-num">2</div>
          <div className="form-content">
            <h2>รายละเอียดคำขอ</h2>
            <label>ประเภทคำขอ
              <div className="choice-row">
                {(['คืนสินค้า', 'เคลมสินค้า', 'เปลี่ยนสินค้า'] as Claim['type'][]).map((item) => (
                  <button type="button" className={type === item ? 'selected' : ''} onClick={() => setType(item)} key={item}>{item}</button>
                ))}
              </div>
            </label>
            <label>เหตุผล
              <select value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>สินค้าเสียหาย</option><option>สินค้าไม่ตรงกับที่สั่ง</option><option>ขนาดไม่พอดี</option><option>เปลี่ยนใจ</option><option>อื่น ๆ</option>
              </select>
            </label>
            <label>รายละเอียดเพิ่มเติม <span className="optional">(ไม่บังคับ)</span>
              <textarea rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="บอกข้อมูลเพิ่มเติมเพื่อช่วยให้ร้านค้าตรวจสอบได้เร็วขึ้น" />
            </label>
          </div>
        </div>
        <div className="form-actions"><Link to="/customer/orders" className="text-btn">ยกเลิก</Link><button className="primary-btn large" type="submit">ส่งคำขอ <Icon name="arrow" size={17} /></button></div>
      </form>
    </>
  )
}
