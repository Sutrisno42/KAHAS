/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
// import { useIntl } from 'react-intl'
import { KTSVG } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '../../../../../app/modules/auth'

const SDBgudang = () => {
    // const intl = useIntl()
    const { logout } = useAuth();


    return (
        <>
            <SidebarMenuItem
                to='/dashboard'
                icon='/media/icons/duotune/general/gen008.svg'
                title='Semua Produk'
                fontIcon='bi-app-indicator'
            />
            <SidebarMenuItem
                to='/gudang/stokProduk'
                icon='/media/icons/duotune/general/gen008.svg'
                title='Stok Produk'
                fontIcon='bi-app-indicator'
            />
            <SidebarMenuItem
                to='/gudang/kategori'
                icon='/media/icons/duotune/communication/com005.svg'
                title='Data Kategori'
                fontIcon='bi-app-indicator'
            />
            <SidebarMenuItem
                to='/gudang/laporanStok'
                icon='/media/icons/duotune/art/art002.svg'
                title='Laporan Stok'
                fontIcon='bi-app-indicator'
            />

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

export { SDBgudang }
