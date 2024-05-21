import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import Dashboard from '../pages/cassier/Dashboard'
import Product from '../pages/cassier/Product'
import HistoryReturn from '../pages/cassier/HistoryReturn'
import Member from '../pages/cassier/Member'
import ShiftRecap from '../pages/cassier/ShiftRecap'
import Transaction from '../pages/cassier/Transaction'
import AllProduk from '../pages/gudang/AllProduk'
import KategoriProduk from '../pages/admintbk/KategorProduk'
import LaporanStok from '../pages/admintbk/LaporanStok'
// import StokProduk from '../pages/gudang/StokProduk'
// import HistoryPage from '../modules/gudang/component/HistoryPage
import Label from '../modules/admintbk/component/Label'
import StokProduk from '../pages/admintbk/StokProduk'
import HistoryPage from '../modules/admintbk/component/HistoryPage'

const GudangRoute = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* cassier */}
        <Route path='dashboard' element={<AllProduk />} />
        {/* <Route path='cassier/product' element={<Product />} />
        <Route path='cassier/history-return' element={<HistoryReturn />} />
        <Route path='cassier/member' element={<Member />} />
        <Route path='cassier/shift' element={<ShiftRecap />} />
        <Route path='cassier/transaction' element={<Transaction />} /> */}

        {/* <Route path='gudang/allProduk' element={<AllProduk />} /> */}
        <Route path='gudang/stokProduk' element={<StokProduk />} />
        <Route path='gudang/kategori' element={<KategoriProduk />} />
        <Route path='gudang/laporanStok' element={<LaporanStok />} />
        <Route path='allProduk/label/:product_id' element={<Label />} />
        <Route path='StokProduk/history/:product_id' element={<HistoryPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { GudangRoute }
