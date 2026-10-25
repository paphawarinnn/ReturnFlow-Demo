import { Link } from 'react-router'

export function NotFound() {
  return <main className="not-found"><span>404</span><h1>ไม่พบหน้าที่ต้องการ</h1><Link className="primary-btn" to="/login">กลับหน้าเข้าสู่ระบบ</Link></main>
}
