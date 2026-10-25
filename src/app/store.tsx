import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Order = {
  id: string
  date: string
  category: string
  item: string
  quantity: number
  price: number
  image: string
}

export type ClaimStatus = 'รอตรวจสอบ' | 'ขอข้อมูลเพิ่ม' | 'อนุมัติแล้ว' | 'ปฏิเสธ'
export type Claim = {
  id: string
  orderId: string
  item: string
  type: 'คืนสินค้า' | 'เคลมสินค้า' | 'เปลี่ยนสินค้า'
  quantity: number
  reason: string
  detail: string
  status: ClaimStatus
  createdAt: string
}

const orders: Order[] = [
  {
    id: 'RF-240801',
    date: '18 มี.ค. 2568',
    category: 'อิเล็กทรอนิกส์',
    item: 'หูฟังไร้สาย Wave Mini',
    quantity: 1,
    price: 1290,
    image: 'WM',
  },
  {
    id: 'RF-240764',
    date: '12 มี.ค. 2568',
    category: 'แฟชั่น',
    item: 'เสื้อเชิ้ต Everyday Oxford',
    quantity: 2,
    price: 790,
    image: 'OX',
  },
  {
    id: 'RF-240621',
    date: '28 ก.พ. 2568',
    category: 'ของใช้ในบ้าน',
    item: 'โคมไฟตั้งโต๊ะ Curve',
    quantity: 1,
    price: 990,
    image: 'CV',
  },
]

const initialClaims: Claim[] = [
  {
    id: 'CL-10021',
    orderId: 'RF-240621',
    item: 'โคมไฟตั้งโต๊ะ Curve',
    type: 'เคลมสินค้า',
    quantity: 1,
    reason: 'สินค้าเสียหาย',
    detail: 'เปิดกล่องแล้วพบว่าฐานโคมมีรอยแตก',
    status: 'รอตรวจสอบ',
    createdAt: '20 มี.ค. 2568',
  },
]

type StoreValue = {
  orders: Order[]
  claims: Claim[]
  addClaim: (claim: Omit<Claim, 'id' | 'status' | 'createdAt' | 'item'>) => Claim
  updateClaim: (id: string, status: ClaimStatus) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)
const storageKey = 'returnflow-claims'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : initialClaims
    } catch {
      return initialClaims
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(claims))
  }, [claims])

  const value = useMemo<StoreValue>(
    () => ({
      orders,
      claims,
      addClaim: (input) => {
        const order = orders.find((item) => item.id === input.orderId)!
        const claim: Claim = {
          ...input,
          item: order.item,
          id: `CL-${Math.floor(10000 + Math.random() * 89999)}`,
          status: 'รอตรวจสอบ',
          createdAt: new Intl.DateTimeFormat('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }).format(new Date()),
        }
        setClaims((current) => [claim, ...current])
        return claim
      },
      updateClaim: (id, status) =>
        setClaims((current) => current.map((claim) => (claim.id === id ? { ...claim, status } : claim))),
      resetDemo: () => setClaims(initialClaims),
    }),
    [claims],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside StoreProvider')
  return context
}
