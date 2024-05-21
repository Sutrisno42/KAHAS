import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { BiSortAlt2 } from 'react-icons/bi'
import { ChartsWidget3, ChartsWidget4 } from '../../../_metronic/partials/widgets';
import { Button } from 'react-bootstrap';
import { showKeuangan } from '../../functions/global/api';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { convertIDR } from '../../functions/global';
import axios from 'axios';

interface Data {
    summary_product: any;
    summary: any;
}

type ProductSummary = {
    product_id: number;
    product_name: string;
    quantity: number;
    hpp_price: number;
    omset: number;
    profit: number;
};

const API_URL = process.env.REACT_APP_API_URL;

function LapHarianPage() {
    usePageTitle('Laporan Harian');

    const [keuangan, setKeuangan] = useState<Data | null>(null);
    const [productSummary, setProductSummary] = useState<ProductSummary[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [type, setType] = useState('');

    const navigate = useNavigate();
    const handleReturnButtonClick = (product_id: number) => {
        navigate(`/laporankeuangaan/detailLaporan/${product_id}`);
    };

    const showData = () => {
        showKeuangan()
            .then(data => {
                console.log(data);
                setKeuangan(data);
                setProductSummary(data?.summary_product?.data || []);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
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
            };

            axios.get(`${API_URL}/report/financial?type=&page=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setKeuangan(response.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.total_pages);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };
    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(productSummary);
        XLSX.utils.book_append_sheet(wb, ws, 'ProductSummary');
        XLSX.writeFile(wb, 'product_summary.xlsx');
    };


    return (
        <>
            <div className='container'>
                <div className='card-header row justify-content-between border-0 mt-4 mb-3 shadow-lg p-3 bg-secondary rounded'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="daily">Harian</option>
                                    <option value="monthly">Bulanan</option>
                                </select>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button
                                    onClick={() => handlePencarian(1)}
                                >Cari</Button>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={handleExport}><i className="bi bi-printer"></i>Ekspor Semua</Button>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Komponen tabel */}
                <div className='card-body mt-10'>

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
                        <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                            <thead>
                                <tr className='fw-bold text-muted' style={{ cursor: "pointer" }}>
                                    <th align='center' className='min-w-30px'>
                                        No
                                    </th>
                                    <th className='min-w-150px'
                                    >
                                        Nama Produk
                                    </th>
                                    <th className='min-w-140px'
                                    >
                                        Jumlah
                                    </th>
                                    <th className='min-w-120px'
                                    >
                                        HPP
                                    </th>
                                    <th className='min-w-120px'
                                    >
                                        Omzet
                                    </th>
                                    <th className='min-w-120px'
                                    >
                                        Profit
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {productSummary.map((product, index) => (
                                    <tr key={index}>
                                        <td align='center'>{index + 1}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-text"
                                                onClick={() => handleReturnButtonClick(product.product_id)}
                                            >
                                                {product.product_name}
                                            </button>
                                        </td>
                                        <td>
                                            <strong
                                                className='text-dark fw-bold d-block mb-1 fs-6'
                                            >
                                                {product.quantity}
                                            </strong>
                                        </td>
                                        <td>
                                            <strong
                                                className='text-dark fw-bold d-block mb-1 fs-6'
                                            >
                                                {convertIDR(product.hpp_price)}
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
                                    {Array.from({ length: totalPages }, (_, pageIndex) => (
                                        <li key={pageIndex} className={`page-item ${currentPage === pageIndex + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePencarian(pageIndex + 1)}>
                                                {pageIndex + 1}
                                            </button>
                                        </li>
                                    ))}

                                    {/* Next Page Button */}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePencarian(currentPage + 1)} disabled={currentPage === totalPages}>
                                            Selanjutnya
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    {/* end::Table container */}

                    {/* modal */}

                    {/* Charts */}
                    <div className="box-header">
                        <ChartsWidget3 title={`Laba Penjualan ${type === 'daily' ? 'Harian' : 'Bulanan'}`} className={'mb-5 mb-xxl-8'} searchType={type} />
                    </div>
                    <div className="box-header">
                        <ChartsWidget4 title='Laba Penjualan Pertahun' className={'mb-5 mb-xxl-8'} />
                    </div>
                </div>

            </div>
        </>
    )
}


export default LapHarianPage