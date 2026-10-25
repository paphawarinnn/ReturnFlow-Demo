import { Link } from 'react-router'
import { useStore } from '../app/store'
import { Icon } from '../components/Icon'

export function CustomerOrders() {
  const { orders, claims } = useStore()
  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">บัญชีของฉัน</p><h1>คำสั่งซื้อ</h1><p>เลือกสินค้าที่ต้องการคืน เคลม หรือเปลี่ยน</p></div>
        <Link to="/customer/returns" className="secondary-btn">ดูคำขอทั้งหมด <Icon name="arrow" size={17} /></Link>
      </div>

      <div className="summary-strip">
        <div><span>คำสั่งซื้อทั้งหมด</span><strong>{orders.length}</strong></div>
        <div><span>คำขอที่กำลังดำเนินการ</span><strong>{claims.filter((c) => !['อนุมัติแล้ว', 'ปฏิเสธ'].includes(c.status)).length}</strong></div>
        <div className="summary-note"><Icon name="clock" /><span>ส่งคำขอได้ภายใน <strong>30 วัน</strong> หลังได้รับสินค้า</span></div>
      </div>

      <div className="section-title"><h2>รายการล่าสุด</h2><span>{orders.length} รายการ</span></div>
      <div className="order-list">
        {orders.map((order, index) => (
          <article className="order-card" key={order.id}>
            <div className={`product-thumb tone-${index + 1}`}>{order.image}</div>
            <div className="order-main">
              <div className="order-meta"><span>เลขที่ {order.id}</span><span>{order.date}</span></div>
              <h3>{order.item}</h3>
              <p>{order.category} • จำนวน {order.quantity} ชิ้น</p>
            </div>
            <div className="order-price"><strong>฿{(order.price * order.quantity).toLocaleString()}</strong><span>ชำระแล้ว</span></div>
            <Link className="primary-btn" to={`/customer/returns/new?order=${order.id}`}>ยื่นคำขอ <Icon name="arrow" size={17} /></Link>
          </article>
        ))}
      </div>
    </>
  )
}
