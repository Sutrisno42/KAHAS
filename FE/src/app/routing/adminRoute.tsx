import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import Dashboard from '../pages/admintbk/Dashboard'
import { Logout } from '../modules/auth'
import KategoriProduk from '../pages/admintbk/KategorProduk'
import Transaksi from '../pages/admintbk/Transaksi'
import DataKasir from '../pages/admintbk/DataKasir'
import LaporanHarian from '../pages/admintbk/LaporanHarian'
import LaporanKeuanga from '../pages/admintbk/LaporanKeuanga'
import LaporanStok from '../pages/admintbk/LaporanStok'
import LaporanProduk from '../pages/admintbk/LaporanProduk'
import AllProduk from '../pages/admintbk/AllProduk'
import StokProduk from '../pages/admintbk/StokProduk'
import LaporanPenjualan from '../pages/admintbk/LaporanPenjualan'
import ManagementAAccount from '../pages/admintbk/ManagementAcccount'
import Suppliear from '../pages/admintbk/Supplier'
import HistoryPage from '../modules/admintbk/component/HistoryPage'
import ReturnPage from '../modules/admintbk/ReturnPage'
import DetailReturnPage from '../modules/admintbk/component/DetailReturnPage'
import DetailTransaksiPage from '../modules/admintbk/component/DetailTransaksiPage'
import DetailLaporan from '../modules/admintbk/component/DetailLaporan'
import Pelanggan from '../pages/admintbk/Pelanggan'
import RepackPage from '../modules/admintbk/component/RepackPage'
import DetailLapPenjualan from '../modules/admintbk/component/DetailLapPenjualan'
import Label from '../modules/admintbk/component/Label'
import HRekapshift from '../modules/admintbk/HRekapShift'
import Prediksi from '../modules/admintbk/Prediksi'
import KelPenjualan from '../modules/admintbk/KelPenjualan'

const Adminroute = () => {
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
        <Route path='auth/*' element={<Navigate to='/allproduk' />} />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* cassier */}
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='dataatransaksi' element={<Transaksi />} />
        <Route path='laporanpenjualan' element={<LaporanPenjualan />} />
        <Route path='StokProduk' element={<StokProduk />} />
        <Route path='kategoriproduk' element={<KategoriProduk />} />
        <Route path='allproduk' element={<AllProduk />} />
        <Route path='lapornProduk' element={<LaporanProduk />} />
        <Route path='laporanstok' element={<LaporanStok />} />
        <Route path='laporankeuangaan' element={<LaporanKeuanga />} />
        <Route path='laporanharian' element={<LaporanHarian />} />
        <Route path='datakasir' element={<DataKasir />} />
        <Route path='supplier' element={<Suppliear />} />
        <Route path='daftarPelanggan' element={<Pelanggan />} />
        <Route path='permintaanreturn' element={<ReturnPage />} />
        <Route path='management' element={<ManagementAAccount />} />
        <Route path='historirekap' element={<HRekapshift />} />
        <Route path='allProduk/label/:product_id' element={<Label />} />
        <Route path='StokProduk/history/:product_id' element={<HistoryPage />} />
        <Route path='StokProduk/repack/:product_id' element={<RepackPage />} />
        <Route path='permintaanreturn/detailReturn/:product_return_id' element={<DetailReturnPage />} />
        <Route path='dataatransaksi/detailTransaksi/:transaction_id' element={<DetailTransaksiPage idmember={'number'} defaultdis={'any'} />} />
        <Route path='laporankeuangaan/detailLaporan/:product_id' element={<DetailLaporan />} />
        <Route path='laporanpenjualan/detailLapPenjualan/:transaction_id' element={<DetailLapPenjualan />} />
        <Route path='prediksi' element={<Prediksi />} />
        <Route path='kelpenjualan' element={<KelPenjualan />} />

        <Route path='logout' element={<Logout />} /> {/* Added this line */}

        {/* Lazy Modules */}

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

export { Adminroute }
