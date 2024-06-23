import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { BiSortAlt2 } from 'react-icons/bi'
import { ChartsWidget3, ChartsWidget4, ChartsWidget5 } from '../../../_metronic/partials/widgets';
import { Button } from 'react-bootstrap';
import { fetchStore, showKeuangan, showLapPenjualan } from '../../functions/global/api';
import { useNavigate } from 'react-router-dom';
import { convertIDR, formatDate, formatDateSearch } from '../../functions/global';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { KTCard } from '../../../_metronic/helpers';

interface Data {
    summary_product: any;
    summary: any;
}

type ProductSummary = {
    transaction_id: number;
    nota_number: number;
    hpp: number;
    omset_before_discount: number;
    profit_before_discount: number;
    discount: number;
    omset: number;
    cashier: any;
    profit: number;
    details: [any];
};
interface Store {
    id: number;
    store_name: string;
}

const API_URL = process.env.REACT_APP_API_URL;

function LapPenjualanPage() {
    usePageTitle('Laporan Penjualan');

    const [keuangan, setKeuangan] = useState<Data | null>(null);
    const [productSummary, setProductSummary] = useState<ProductSummary[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [type, setType] = useState('');
    const [newMember, setNewMember] = useState({
        start_date: '',
        end_date: '',
        store_id: '',
    });
    const [store, setStore] = useState<Store[]>([]);
    const navigate = useNavigate();
    const handleReturnButtonClick = (transaction_id: number) => {
        navigate(`/laporanpenjualan/detailLapPenjualan/${transaction_id}`);
    };

    const showData = () => {
        showLapPenjualan()
            .then(data => {
                console.log(data);
                setKeuangan(data);
                // setProductSummary(data?.summary_product?.data || []);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
        fetchStore().then((dataToko) => {
            setStore(dataToko);
        });
        showData();
    }, []);

    useEffect(() => {
        if (keuangan) {
            setProductSummary(keuangan?.summary_product?.data || []);
        }
    }, [keuangan]);

    const handlePencarian = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                type: type,
                start_date: newMember.start_date,
                end_date: newMember.end_date,
                store_id: newMember.store_id,
            };
            console.log("Sending request with params:", searchParams);
            axios.get(`${API_URL}/report/sales`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    console.log('Response data:', response.data.data);
                    setKeuangan(response.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data.total_pages);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
            console.log("Invalid argument type:", typeof eventOrPageNumber);
        }
    };


    const handleExport = () => {
        // Check if productSummary is not empty
        if (productSummary.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }
        // Prepare the data to be exported
        const exportData: any[] = [];

        productSummary.forEach((product) => {
            product.details.forEach((detail, index) => {
                exportData.push({
                    'Nomor Nota': index === 0 ? product.nota_number : '',
                    'Nama Toko': index === 0 ? product.cashier?.store?.store_name || '' : '',
                    'HPP': index === 0 ? convertIDR(product.hpp) : '',
                    'Omset Sebelum Diskon': index === 0 ? convertIDR(product.omset_before_discount) : '',
                    'Profit Sebelum Diskon': index === 0 ? convertIDR(product.profit_before_discount) : '',
                    'Diskon': index === 0 ? convertIDR(product.discount) : '',
                    'Omset': index === 0 ? convertIDR(product.omset) : '',
                    'Profit': index === 0 ? convertIDR(product.profit) : '',
                    'Nama Produk': detail.product_name,
                    'Quantitas': detail.quantity,
                });
            });
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'ProductSummary');
        XLSX.writeFile(wb, 'product_summary.xlsx');
    };

    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Dari</label>
                                <input
                                    type={type === 'daily' ? 'date' : 'month'}
                                    placeholder={type === 'daily' ? 'dd/mm/yyyy' : 'mm/yyyy'}
                                    className='form-control'
                                    name='fromDate'
                                    onChange={(e) => setNewMember({ ...newMember, start_date: formatDateSearch(e.target.value, type) })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Sampai</label>
                                {/* <input type="date" placeholder='dd/mm/yyyy' className='form-control' name='toDate'
                                    onChange={(e) => setNewMember({ ...newMember, end_date: formatDateSearch(e.target.value, type) })}
                                /> */}
                                <input
                                    type={type === 'daily' ? 'date' : 'month'}
                                    placeholder={type === 'daily' ? 'dd/mm/yyyy' : 'mm/yyyy'}
                                    className='form-control'
                                    name='toDate'
                                    onChange={(e) => setNewMember({ ...newMember, end_date: formatDateSearch(e.target.value, type) })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Toko</label>
                                <select
                                    className="form-select"
                                    name="modeProcess"
                                    // value={newTransaksi.store_id}
                                    onChange={(e) => setNewMember({ ...newMember, store_id: e.target.value })}
                                >
                                    <option value="">Pilih Toko</option>
                                    {store.map((store) => (
                                        <option key={store.id} value={store.id}>
                                            {store.store_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                >
                                    <option value="">Pilihan</option>
                                    <option value="daily">Harian</option>
                                    <option value="monthly">Bulanan</option>
                                </select>
                            </div>
                            <div className='col-1 mt-8 me-2'>
                                <Button onClick={() => handlePencarian(1)}>Cari</Button>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={handleExport} className='bi bi-printer'><span> Ekspor </span> </Button>
                            </div>
                        </div>
                    </div>

                    {/* begin::Table container */}
                    <div className='card-body'>
                        <div className="d-flex flex-column">
                            <li className="d-flex align-items-center py-2">
                                <span className="bullet me-5"></span>Total HPP :  {convertIDR(keuangan?.summary?.total_hpp || 0)}
                            </li>
                            <li className="d-flex align-items-center py-2">
                                <span className="bullet me-5"></span>Total Omzet : {convertIDR(keuangan?.summary?.total_omset || 0)}
                            </li>
                            <li className="d-flex align-items-center py-2">
                                <span className="bullet me-5"></span>Total Profit : {convertIDR(keuangan?.summary?.total_profit || 0)}
                            </li>

                        </div>

                        <div className='table-responsive'>
                            {/* begin::Table */}
                            <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                {/* begin::Table head */}
                                <thead>
                                    <tr className='fw-bold text-black' style={{ cursor: "pointer" }}>
                                        <th align='center' className='min-w-30px'>
                                            No
                                        </th>
                                        <th className='min-w-150px'>No Nota</th>
                                        <th className='min-w-150px'>Toko</th>
                                        <th className='min-w-140px'>HPP</th>
                                        <th className='min-w-120px'>Omset Sebelum Diskon</th>
                                        <th className='min-w-120px'>Profit Sebelum Diskon</th>
                                        <th className='min-w-120px'>Diskon</th>
                                        <th className='min-w-120px'>Omset</th>
                                        <th className='min-w-120px'>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(productSummary) && productSummary.map((product, index) => (
                                        <tr key={index}>
                                            {/* Render table rows */}
                                            <td align='center'>{index + 1}</td>
                                            <td >
                                                <button
                                                    type="button"
                                                    className="btn btn-text"
                                                    onClick={() => handleReturnButtonClick(product.transaction_id)}
                                                >
                                                    <strong>
                                                        {product.nota_number}
                                                    </strong>

                                                </button>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {product.cashier?.store?.store_name}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {convertIDR(product.hpp)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {convertIDR(product.omset_before_discount)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {convertIDR(product.profit_before_discount)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {convertIDR(product.discount)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {convertIDR(product.omset)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong
                                                    className='text-dark fw-bold d-block mb-1 fs-6'
                                                >
                                                    {convertIDR(product.profit)}
                                                </strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {/* end::Table body */}
                            </table>
                            {/* end::Table */}
                        </div>
                        {/* pagination */}
                        <div className='row'>
                            <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
                            <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
                                <div aria-label="..." id='kt_table_users_paginate'>
                                    <ul className="pagination">
                                        {/* Previous Page Button */}
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => handlePencarian(currentPage - 1)} disabled={currentPage === 1}>
                                                Sebelumnya
                                            </button>
                                        </li>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <a className="page-link" onClick={() => handlePencarian(index + 1)}>
                                                    {index + 1}
                                                </a>
                                            </li>
                                        ))}

                                        {/* Next Page Button */}
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => handlePencarian(currentPage + 1)} >
                                                Selanjutnya
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="box-header">
                            <ChartsWidget3 title={`Laba Penjualan ${type === 'daily' ? 'Harian' : 'Bulanan'}`} className={'mb-5 mb-xxl-8'} searchType={type} />
                        </div>
                        <div className="box-header">
                            <ChartsWidget4 title='Laba Penjualan Pertahun' className={'mb-5 mb-xxl-8'} />
                        </div>
                        {/* end::Table container */}
                    </div>
                </div>
            </KTCard>
        </>
    )
}

export default LapPenjualanPage