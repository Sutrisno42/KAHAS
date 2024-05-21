import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { showDetailReturn } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { convertDate, convertIDR } from '../../../functions/global';



const DetailReturnPage = () => {
    usePageTitle('Detail Return');

    const { product_return_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});


    useEffect(() => {
        const fetchData = async () => {
            if (!product_return_id) {
                return;
            }
            try {
                const historyData = await showDetailReturn(parseInt(product_return_id, 10));
                console.log('Product History Data:', historyData);
                setProductHistory(historyData);
            } catch (error) {
            }
        };

        fetchData();

    }, [product_return_id]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
    };

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className=''>
                                <h1>{productHistory.data?.product_name}</h1>
                                <span>Periode Tanggal</span>
                                <br />
                                <span> {productHistory.data?.date_return} </span>
                                <h1 className='mt-10'>Data Produk</h1>
                            </div>
                        </div>
                    </div>
                    {/* tabel */}
                    <div className='card-body'>
                        {/* begin::Table container */}
                        <div className='table-responsive' style={{ overflowX: 'auto' }}>
                            {/* begin::Table */}
                            <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                {/* begin::Table head */}
                                <thead>
                                    <tr className='fw-bold text-muted'>
                                        <th align='center' className='min-w-30px'>
                                            Nama Produk
                                        </th>
                                        <th className='min-w-30px'>Harga</th>
                                        <th className='min-w-30px'>Jml Return</th>
                                        <th className='min-w-30px'>Alasan</th>
                                        <th className='min-w-30px'>Status</th>
                                        <th className='min-w-30px'>Stok</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    <tr >
                                        <td className='text-dark fw-bold'>
                                            {productHistory.data?.product_name}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {convertIDR(productHistory.data?.price)}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {productHistory.data?.quantity}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {productHistory.data?.reason}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {productHistory.data?.status}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {productHistory.data?.product?.stock}
                                        </td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>


                {/* Tabel History Refund */}
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className=''>
                                <h1 className='mt-10'>Data Transaksi</h1>
                            </div>
                        </div>
                    </div>
                    {/* tabel */}
                    <div className='card-body'>
                        {/* begin::Table container */}
                        <div className='table-responsive'>
                            {/* begin::Table */}
                            <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                {/* begin::Table head */}
                                <thead>
                                    <tr className='fw-bold text-muted'>
                                        <th align='center' className='min-w-30px'>Nota</th>
                                        <th className='min-w-30px'>Tgl Transaksi</th>
                                        <th className='min-w-30px'>Diskon</th>
                                        <th className='min-w-30px'>Diskon Global</th>
                                        <th className='min-w-120px'>Grand Total</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    <tr >
                                        <td className='text-dark fw-bold'>
                                            {productHistory.data?.transaction?.nota_number}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {formatDate(productHistory.data?.transaction?.date)}
                                            <span className='fw-bold d-block fs-7' style={{ color: 'green' }}>
                                                Status: {productHistory.data?.transaction?.status}</span>
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {convertIDR(productHistory.data?.transaction?.discount)}
                                        </td>
                                        <td className='text-dark fw-bold text-justify'>
                                            {convertIDR(productHistory.data?.transaction?.discount_global)}
                                        </td>
                                        <td className='text-dark fw-bold'>
                                            {convertIDR(productHistory.data?.transaction?.grand_total)}
                                            <span className='fw-bold d-block fs-7' style={{ color: 'green' }}>
                                                Pembayaran: {productHistory.data?.transaction?.payment_method}</span>
                                        </td>

                                    </tr>
                                </tbody>

                            </table>
                        </div>
                    </div>
                    {/* end:: Table History Refund*/}


                </div>
            </KTCard>
        </>
    )
}

export default DetailReturnPage