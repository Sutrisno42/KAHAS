/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { useIntl } from 'react-intl'
import { KTSVG } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '../../../../../app/modules/auth'

const SDBadmin = () => {
  const intl = useIntl()
  const { logout } = useAuth(); // Ambil fungsi logout dari useAuth


  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen008.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/dataatransaksi'
        icon='/media/icons/duotune/general/gen008.svg'
        title='Data Transaksi'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItemWithSub
        to='/*'
        icon='/media/icons/duotune/general/gen008.svg'
        title='Data Produk'
        fontIcon='bi-app-indicator'
      >
        <SidebarMenuItem
          to='/allproduk'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Semua Produk'
          fontIcon='bi-app-indicator'
        />
        <SidebarMenuItem
          to='/StokProduk'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Stok Produk'
          fontIcon='bi-app-indicator'
        />
        <SidebarMenuItem
          to='/kategoriproduk'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Kategori Produk'
          fontIcon='bi-app-indicator'
        />

      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/dashboard#'
        icon='/media/icons/duotune/general/gen008.svg'
        title='Laporan'
        fontIcon='bi-app-indicator'
      >
        <SidebarMenuItem
          to='/laporanstok'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Laporan Stok'
          fontIcon='bi-app-indicator'
        />
        <SidebarMenuItem
          to='/laporankeuangaan'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Laporan Keuangan'
          fontIcon='bi-app-indicator'
        />
        <SidebarMenuItem
          to='/laporanpenjualan'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Laporan Penjualan'
          fontIcon='bi-app-indicator'
        />
        {/* <SidebarMenuItem
          to='/laporanharian'
          icon='/media/icons/duotune/abstract/abs009.svg'
          title='Laporan Harian'
          fontIcon='bi-app-indicator'
        /> */}
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to='/prediksi'
        icon='/media/icons/duotune/graphs/gra012.svg'
        title='Prediksi'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/datakasir'
        icon='/media/icons/duotune/general/gen049.svg'
        title='Data Kasir'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/supplier'
        icon='/media/icons/duotune/communication/com005.svg'
        title='Data Supplier'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/daftarPelanggan'
        icon='/media/icons/duotune/communication/com005.svg'
        title='Daftar Pelanggan'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/permintaanreturn'
        icon='/media/icons/duotune/art/art002.svg'
        title='Permintaan Return'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/management'
        icon='/media/icons/duotune/general/gen049.svg'
        title='Manajemen Akun'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/historirekap'
        icon='/media/icons/duotune/general/gen008.svg'
        title='Histori Rekap Shift'
        fontIcon='bi-app-indicator'
      />
      {/* <SidebarMenuItem
        to='/StokProduk/history'
        icon='/media/icons/duotune/general/gen049.svg'
        title='History'
        fontIcon='bi-app-indicator'
      /> */}
      {/* <SidebarMenuItem
        to='/cassier/penjualan#'
        icon='/media/icons/duotune/art/art002.svg'
        title='Penjualan'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/cassier/product#'
        icon='/media/icons/duotune/art/art002.svg'
        title='Data Produk'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/cassier/transaction#'
        icon='/media/icons/duotune/art/art002.svg'
        title='Data Transaksi'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/cassier/history-return#'
        icon='/media/icons/duotune/art/art002.svg'
        title='History Return'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/cassier/member#'
        icon='/media/icons/duotune/art/art002.svg'
        title='Pelanggan'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/cassier/shift#'
        icon='/media/icons/duotune/art/art002.svg'
        title='Shift Recap'
        fontIcon='bi-app-indicator'
      /> */}
      {/* <SidebarMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Layout Builder'
        fontIcon='bi-layers'
      /> */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div> */}
      {/* <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'
      >
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div> */}
      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItem
        to='/apps/user-management/users'
        icon='/media/icons/duotune/general/gen051.svg'
        title='User management'
        fontIcon='bi-layers'
      /> */}
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          onClick={logout}// Tambahkan event handler untuk logout
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen050.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Logout</span>
        </a>
      </div>
    </>
  )
}

export { SDBadmin }
