import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { refundHistory, showHistory, showSupplier, updateHistory } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { convertIDR } from '../../../functions/global';

interface Supplier {
    id: number;
    name: string;
}

const API_URL = process.env.REACT_APP_API_URL

const HistoryPage = () => {
    usePageTitle('History');

    const { product_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [expNotifState, setExpNotifState] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const fetchData = async () => {
            if (!product_id) {
                return;
            }
            try {
                const historyData = await showHistory(parseInt(product_id, 10));
                setProductHistory(historyData);
            } catch (error) {
            }
        };

        fetchData();
        showSupplier().then((data) => {
            setSupplier(data);
        });

        const savedExpNotifState = JSON.parse(localStorage.getItem('expNotifState') || '{}');
        setExpNotifState(savedExpNotifState);
    }, []);

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
                            <h1>{productHistory.product?.product_name} (Kategori : {productHistory.product?.category?.category_name} )</h1>
                        </div>
                    </div>
                    {/* History Terjual */}
                    <div className='card pt-6'>
                        <div className=' card-header border-0'>
                            <div className='row gap-4 fw-bold'>
                                <div className=''>
                                    <h1 className='mt-10'>History Terjual</h1>
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
                                        <tr className='fw-bold text-muted text-center'>
                                            <th align='center' className='min-w-30px'>No</th>
                                            <th className='min-w-30px'>No Nota</th>
                                            <th className='min-w-30px'>Tanggal</th>
                                            <th className='min-w-30px'>Jumlah</th>
                                            <th className='min-w-30px'>Kasir</th>
                                            <th className='min-w-30px'>Status</th>
                                            <th className='min-w-30px'>Total Nominal</th>
                                            <th className='min-w-30px'>Pembayaran</th>
                                        </tr>
                                    </thead>
                                    {/* end::Table head */}
                                    {/* begin::Table body */}
                                    <tbody>
                                        {productHistory.transactions &&
                                            productHistory.transactions.map((transactions: any, index: number) => (
                                                <tr className='text-center' key={transactions.id}>
                                                    <td align="center">{index + 1}</td>
                                                    <td>
                                                        {transactions.transaction?.nota_number || 'N/A'}
                                                    </td>
                                                    <td>
                                                        {formatDate(transactions.transaction?.date)}
                                                    </td>

                                                    <td className='text-dark fw-bold'>
                                                        {transactions.quantity_unit}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {transactions.transaction?.cashier?.name || 'N/A'}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {/* {stockOpname.supplier?.name} */}
                                                        {transactions.transaction?.status || 'N/A'}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {/* {stockOpname.supplier?.name} */}
                                                        {isNaN(transactions.transaction?.grand_total) ? 0 : convertIDR(transactions.transaction?.grand_total)}
                                                    </td>
                                                    <td>
                                                        {transactions.transaction?.payment_method || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                    <tbody>
                                        {productHistory.transactions && productHistory.transactions.length > 0 ? (
                                            <>
                                                {productHistory.transactions.map((transactions: any) => (
                                                    <tr className='text-center' key={transactions.id}>
                                                        {/* ... rest of the code */}
                                                    </tr>
                                                ))}
                                                <tr className='text-center'>
                                                    <td></td>
                                                    <td></td>
                                                    <td><h2>Total</h2></td>
                                                    <td className='text-dark fw-bold'>
                                                        {productHistory.transactions.reduce((quantity_unit: number, transactions: any) => quantity_unit + parseInt(transactions.quantity_unit), 0)}
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr className='text-center'>
                                                <td >No data available</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                    {/* End :: Tabel History Terjual */}

                </div>
            </KTCard>
        </>
    )
}

export default HistoryPage