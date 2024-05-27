import { FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { Adminroute } from './adminRoute'
import { GudangRoute } from './gudangRoute'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import Dashboard from '../pages/cassier/Dashboard'
import { App } from '../App'
import CekHarga from '../pages/cekhargaa/CekHarga'

const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth()
  let user;
  const token = localStorage.getItem('token');
  const userJSON = localStorage.getItem('user');
  if (userJSON) {
    try {
      user = JSON.parse(userJSON);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  console.log('datauserrole', user);


  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {user && user.role === 'cashier' ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
              <Route index element={<Navigate to='/cassier/dashboard' />} />
              <Route index element={<Navigate to='/cassier/product' />} />
              <Route index element={<Navigate to='/cassier/history-return' />} />
              <Route index element={<Navigate to='/cassier/member' />} />
              <Route index element={<Navigate to='/cassier/shift' />} />
              <Route index element={<Navigate to='/cassier/transaction' />} />
            </>
          ) : user && user.role === 'admin' ? (
            <>
              <Route path='/*' element={<Adminroute />} />
              <Route index element={<Navigate to='/dashboard' />} />
              <Route index element={<Navigate to='/cassier/dashboard' />} />            </>
          ) : user && user.role === 'price_check' ? (
            <>
              <Route path='/*' element={<CekHarga />} />
            </>
          ) : user && user.role === 'warehouse' ? (
            <>
              <Route path='/*' element={<GudangRoute />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
