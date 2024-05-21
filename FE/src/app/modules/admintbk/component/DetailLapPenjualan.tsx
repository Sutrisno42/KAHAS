import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { showDetailLaporan, showDetailLaporanPenjualan } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { convertDate, convertIDR } from '../../../functions/global';



const DetailLapPenjualan = () => {
    usePageTitle('Detail Laporan Penjualan');

    const { transaction_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});

    const calculateDiscount = (originalPrice: any, discountPercentage: any, numberOfItems: any) => {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const totalDiscount = discountAmount * numberOfItems;
        const totalPrice = originalPrice * numberOfItems - totalDiscount;
        return totalDiscount;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!transaction_id) {
                return;
            }
            try {
                const historyData = await showDetailLaporanPenjualan(parseInt(transaction_id, 10));
                console.log('Product History Data:', historyData);
                setProductHistory(historyData);
            } catch (error) {
            }
        };

        fetchData();

    }, [transaction_id]);

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold' style={{ display: 'flex' }}>
                            <div className="col-8 mt-5">
                                <h1>Informasi Penjualan</h1>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text">Kasir : {productHistory.data?.cashier?.name}</p>
                                            <p className="card-text">No Nota : {productHistory.data?.nota_number}</p>
                                            <p className="card-text">Tanggal : {productHistory.data?.date}</p>
                                            <p className="card-text">Jam : {productHistory.data?.hour}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text">Metode Pembayaran : {productHistory.data?.payment_method === 'split' ? productHistory.data?.payment_method :
                                                productHistory.data?.cash > 0 ? 'Cash' : productHistory.data?.qris > 0 ? 'QRIS' : 'EDC / Transfer '}</p>
                                            <p className="card-text">Jumlah : {productHistory.data?.total}</p>
                                            <p className="card-text">Grand Total : {convertIDR(productHistory.data?.grand_total)}</p>
                                        </div>
                                    </div>
                                </div>
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
                                            <th className='min-w-30px'>Kode</th>
                                            <th className='min-w-30px'>Nama Produk</th>
                                            <th className='min-w-30px'>Harga</th>
                                            <th className='min-w-30px'>Jumlah</th>
                                            <th className='min-w-30px'>Diskon (%)</th>
                                            <th className='min-w-30px'>Diskon (RP)</th>
                                            <th className='min-w-30px'>Subtotal</th>
                                        </tr>
                                    </thead>
                                    {/* end::Table head */}
                                    {/* begin::Table body */}
                                    <tbody>
                                        {productHistory.data?.details &&
                                            productHistory.data.details.map((details: any, index: number) => (
                                                <tr key={details.id}>
                                                    <td>{index + 1}</td>
                                                    <td className='text-dark fw-bold'>
                                                        {details.product_code}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {details.product_name}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {convertIDR(details.price)}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {/* {stockOpname.supplier?.name} */}
                                                        {details.quantity}
                                                    </td>
                                                    <td>
                                                        {details.discount > 0 ? details.discount + "%" : '0'}
                                                    </td>
                                                    <td>
                                                        {details.discount > 0 ? convertIDR(calculateDiscount(details.price, details.discount, details.quantity)) : ''}
                                                    </td>
                                                    <td>
                                                        {convertIDR(details.sub_total - calculateDiscount(details.price, details.discount, details.quantity))}
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
                                            <td><h3>Diskon member(Rp)</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {productHistory.data?.member?.default_discount}%
                                            </td>
                                        </tr>
                                    </tbody> */}
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>GRAND TOTAL</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.grand_total)}
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
                                            <td></td>
                                            <td><h3>DISKON (Rp)</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.discount)}
                                            </td>
                                        </tr>
                                    </tbody>
                                    {productHistory.data?.cash > 0 && (<tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Cash</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.cash)}
                                            </td>
                                        </tr>
                                    </tbody>)}
                                    {productHistory.data?.qris > 0 && (<tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>QRIS</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.qris)}
                                            </td>
                                        </tr>
                                    </tbody>)}
                                    {productHistory.data?.transfer > 0 && (<tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>EDC / Transfer</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.transfer)}
                                            </td>
                                        </tr>
                                    </tbody>)}

                                    {/* <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Bayar </h3></td>
                                            <td className='text-dark fw-bold'>
                                                {/* Rp {productHistory.data?.cash} */}
                                    {/* {productHistory.data?.payment_method === 'non_split' && ( */}
                                    <>
                                        {/* {convertIDR(
                                                        productHistory.data?.cash +
                                                        productHistory.data?.transfer +
                                                        productHistory.data?.qris
                                                    )} */}
                                    </>
                                    {/* )} */}

                                    {/* {productHistory.data?.payment_method === 'split' && ( */}
                                    {/* <>
                                                        {convertIDR(productHistory.data?.transfer)}
                                                    </> */}
                                    {/* )} */}
                                    {/* </td> */}
                                    {/* </tr> */}
                                    {/* </tbody>  */}
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Kembali</h3></td>
                                            <td className=''>
                                                {convertIDR(productHistory.data?.change)}
                                            </td>
                                        </tr>
                                    </tbody>
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

export default DetailLapPenjualan