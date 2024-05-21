import React from 'react'
import { KTSVG } from '../../../helpers'



const TablesWidget15 = () => {
    return (
        <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
                {/* begin::Table */}
                <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                    {/* begin::Table head */}
                    <thead>
                        <tr className='fw-bold text-muted'>
                            <th align='center' className='min-w-30px'>
                                NO
                            </th>
                            <th className='min-w-150px'>Nama Produk</th>
                            <th className='min-w-140px'>Kategori</th>
                            <th className='min-w-120px'>Kode</th>
                            <th className='min-w-120px'>Jumlah</th>
                            <th className='min-w-120px'>Harga</th>
                            <th className='min-w-120px'>Status</th>
                        </tr>
                    </thead>
                    {/* end::Table head */}
                    {/* begin::Table body */}
                    <tbody>
                        {Array.from(Array(10).keys()).map((val: number) => (
                            <tr key={val}>
                                <td align='center'>
                                    {val + 1}
                                </td>
                                <td>
                                    <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                                        FRISIAN FLAG SKM POUCH CHOCOLATE 280GR
                                    </a>
                                </td>
                                <td>
                                    <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                        Susu
                                    </a>
                                    <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: PH</span>
                                </td>
                                <td>
                                    <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                        8992753722747
                                    </a>
                                    <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span>
                                </td>
                                <td>
                                    <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                        20
                                    </a>
                                    {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                        Web, UI/UX Design
                                    </span> */}
                                </td>
                                <td className='text-dark fw-bold text-hover-primary fs-6'>Rp 57.800
                                </td>
                                <td>
                                    <span className='badge badge-light-success'>Approved</span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                    {/* end::Table body */}
                </table>
                {/* end::Table */}
            </div>
            {/* end::Table container */}
        </div>
    )
}

export default TablesWidget15