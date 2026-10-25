import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '../components/AppLayout'
import { CustomerOrders } from '../pages/CustomerOrders'
import { CustomerReturns } from '../pages/CustomerReturns'
import { Login } from '../pages/Login'
import { MerchantClaims } from '../pages/MerchantClaims'
import { NewReturn } from '../pages/NewReturn'
import { NotFound } from '../pages/NotFound'

export const router = createBrowserRouter(
  [
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '/login', Component: Login },
    {
      element: <AppLayout />,
      children: [
        { path: '/customer/orders', Component: CustomerOrders },
        { path: '/customer/returns', Component: CustomerReturns },
        { path: '/customer/returns/new', Component: NewReturn },
        { path: '/merchant/claims', Component: MerchantClaims },
      ],
    },
    { path: '*', Component: NotFound },
  ],
  {
    basename: '/ReturnFlow-Demo',
  }
)