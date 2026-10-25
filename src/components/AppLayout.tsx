import { NavLink, Outlet, useLocation } from 'react-router'
import { Icon } from './Icon'

export function AppLayout() {
  const location = useLocation()
  const isMerchant = location.pathname.startsWith('/merchant')

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/customer/orders" className="brand" aria-label="ReturnFlow">
          <span className="brand-mark">R</span>
          <span>ReturnFlow</span>
        </NavLink>

        <div className="role-label">{isMerchant ? 'พื้นที่ร้านค้า' : 'พื้นที่ลูกค้า'}</div>
        <nav className="main-nav">
          {isMerchant ? (
            <NavLink to="/merchant/claims"><Icon name="store" />จัดการคำขอ</NavLink>
          ) : (
            <>
              <NavLink to="/customer/orders"><Icon name="box" />คำสั่งซื้อ</NavLink>
              <NavLink to="/customer/returns"><Icon name="return" />คำขอของฉัน</NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <a href="/demo/index.html" className="switch-role">
            <Icon name="return" />
            เปิดเดโมแบบเต็ม
          </a>
          <NavLink to={isMerchant ? '/customer/orders' : '/merchant/claims'} className="switch-role">
            <Icon name={isMerchant ? 'box' : 'store'} />
            สลับไปฝั่ง{isMerchant ? 'ลูกค้า' : 'ร้านค้า'}
          </NavLink>
          <NavLink to="/login" className="logout-link"><Icon name="logout" />ออกจากระบบ</NavLink>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">R</span>ReturnFlow</div>
          <div className="profile">
            <div className="profile-copy"><strong>{isMerchant ? 'ร้าน Flow Market' : 'ณิชา วัฒนา'}</strong><span>{isMerchant ? 'Merchant' : 'Customer'}</span></div>
            <div className="avatar">{isMerchant ? 'FM' : 'ณ'}</div>
          </div>
        </header>
        <div className="page-wrap"><Outlet /></div>
      </main>
    </div>
  )
}
