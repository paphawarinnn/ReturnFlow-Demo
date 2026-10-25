import { Link } from 'react-router'
import { Icon } from '../components/Icon'

export function Login() {
  return (
    <main className="login-page">
      <section className="login-intro">
        <div>
          <div className="login-brand"><span className="brand-mark">R</span>ReturnFlow</div>
          <p className="eyebrow light">จัดการง่าย ติดตามได้ทุกขั้นตอน</p>
          <h1>คืนสินค้า<br />ไม่ควรเป็นเรื่องยุ่งยาก</h1>
          <p className="login-lead">ระบบจัดการคืน เคลม และเปลี่ยนสินค้า สำหรับลูกค้าและร้านค้าในที่เดียว</p>
        </div>
        <p className="sample-note">เวอร์ชันทดลอง • ใช้ข้อมูลตัวอย่าง</p>
      </section>

      <section className="login-panel">
        <div className="login-box">
          <p className="eyebrow">ยินดีต้อนรับ</p>
          <h2>เลือกมุมมองเพื่อเริ่มใช้งาน</h2>
          <p className="muted">ไม่ต้องใช้รหัสผ่านสำหรับเวอร์ชันทดลอง</p>
          <div className="login-options">
            <a href={`${import.meta.env.BASE_URL}demo/index.html`} className="login-option full-demo-option">
              <span className="option-icon full"><Icon name="return" size={25} /></span>
              <span><strong>เปิดเดโมนำเสนอแบบเต็ม</strong><small>ครบทุกฟังก์ชันและแดชบอร์ดจาก CSV 15,052 รายการ</small></span>
              <Icon name="arrow" />
            </a>
            <Link to="/customer/orders" className="login-option">
              <span className="option-icon customer"><Icon name="box" size={25} /></span>
              <span><strong>เข้าสู่ระบบสำหรับลูกค้า</strong><small>ดูออเดอร์และส่งคำขอคืนสินค้า</small></span>
              <Icon name="arrow" />
            </Link>
            <Link to="/merchant/claims" className="login-option">
              <span className="option-icon merchant"><Icon name="store" size={25} /></span>
              <span><strong>เข้าสู่ระบบสำหรับร้านค้า</strong><small>ตรวจสอบและจัดการคำขอของลูกค้า</small></span>
              <Icon name="arrow" />
            </Link>
          </div>
          <p className="privacy">ข้อมูลทั้งหมดถูกจัดเก็บในเบราว์เซอร์เครื่องนี้เท่านั้น</p>
        </div>
      </section>
    </main>
  )
}
