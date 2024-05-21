import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { showDetailLaporan } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { convertDate, convertIDR } from '../../../functions/global';



const DetailLaporan = () => {
    usePageTitle('Detail Laporan');

    const { product_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});


    useEffect(() => {
        const fetchData = async () => {
            if (!product_id) {
                return;
            }
            try {
                const historyData = await showDetailLaporan(parseInt(product_id, 10));
                console.log('Product History Data:', historyData);
                setProductHistory(historyData);
            } catch (error) {
            }
        };

        fetchData();

    }, [product_id]);

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold' style={{ display: 'flex' }}>
                            {/* <div className='col-2'>
                                <Button><i className="bi bi-printer"></i>Cetak Nota</Button>
                            </div> */}
                            <div className="row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <div className="card">
                                        <h1>{productHistory.data?.product_name}</h1>
                                        <div className="card-body">
                                            <p className="card-text">Harga : {convertIDR(productHistory.data?.price)}</p>
                                            <p className="card-text">Total Omset : {convertIDR(productHistory.data?.total_omset)}</p>
                                            <p className="card-text">Total HPP : {convertIDR(productHistory.data?.total_hpp)}</p>
                                            <p className="card-text">Total Profit : {convertIDR(productHistory.data?.total_profit)}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text">Metode Pembayaran : {productHistory.data?.payment_method}</p>
                                            <p className="card-text">Diskon Global : {productHistory.data?.discount_global}</p>
                                            <p className="card-text">Nominal : {productHistory.data?.total}</p>
                                            <p className="card-text">Nominal Akhir : {productHistory.data?.grand_total}</p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <h1>Detail Transaksi</h1>
                            <div className='table-responsive' style={{ overflowX: 'auto' }}>
                                {/* begin::Table */}
                                <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                    {/* begin::Table head */}
                                    <thead>
                                        <tr className='fw-bold text-muted'>
                                            <th className='min-w-30px'>
                                                NO
                                            </th>
                                            <th className='min-w-30px'>No Nota</th>
                                            <th className='min-w-30px'>Tanggal</th>
                                            <th className='min-w-30px'>Jumlah</th>
                                            <th className='min-w-30px'>Diskon (RP)</th>
                                            <th className='min-w-30px'>Grand Total</th>
                                        </tr>
                                    </thead>
                                    {/* end::Table head */}
                                    {/* begin::Table body */}
                                    <tbody>
                                        {productHistory.data?.transactions &&
                                            productHistory.data.transactions.map((transactions: any, index: number) => (
                                                <tr key={transactions.id}>
                                                    <td>{index + 1}</td>
                                                    <td className='text-dark fw-bold'>
                                                        {transactions.nota_number}
                                                        <span className='fw-bold d-block fs-7' style={{ color: 'green' }}>
                                                            Payment: {transactions.payment_method}</span>
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {convertDate(transactions.date)}
                                                        <span className='fw-bold d-block fs-7' style={{ color: 'green' }}>
                                                            Status: {transactions.status}</span>
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {transactions.total}
                                                    </td>
                                                    <td>
                                                        {convertIDR(transactions.discount)}
                                                    </td>
                                                    <td>
                                                        {convertIDR(transactions.grand_total)}
                                                    </td>

                                                </tr>
                                            ))}

                                    </tbody>
                                    {/* <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>TOTAL</h3></td>
                                            <td className='text-dark fw-bold'>
                                                Rp {productHistory.data?.total}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>DISKON (Rp)</h3></td>
                                            <td className='text-dark fw-bold'>
                                                Rp {productHistory.data?.discount}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>GRAND TOTAL</h3></td>
                                            <td className='text-dark fw-bold'>
                                                Rp {productHistory.data?.grand_total}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Bayar</h3></td>
                                            <td className='text-dark fw-bold'>
                                                Rp {productHistory.data?.cash}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Kembali</h3></td>
                                            <td className=''>
                                                Rp {productHistory.data?.change}
                                            </td>
                                        </tr>
                                    </tbody> */}
                                </table>
                            </div>


                        </div>
                    </div>
                    {/* tabel */}

                </div>
            </KTCard>
        </>
    )
}

export default DetailLaporan