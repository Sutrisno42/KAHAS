import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import axios from 'axios';
import { showLapStok } from '../../functions/global/api';
import { convertDate, convertIDR } from '../../functions/global';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const HistoryReturnPage = () => {
    usePageTitle('Laporan Stok');

    const [products, setProducts] = useState<any[]>([]);
    const [showProdukConfirmation, setShowProdukConfirmation] = useState(false);
    const [produkToProduk, setProdukToProduk] = useState<number | null>(null);
    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        product_code: '',
        category_id: '',
        faktur_date_from: '',
        faktur_date_to: '',

    });

    const openProdukConfirmation = (id_product: number) => {
        setProdukToProduk(id_product);
        setShowProdukConfirmation(true);
    };

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                product_name: newProduct.product_name,
                start_date: newProduct.faktur_date_from,
                end_date: newProduct.faktur_date_to,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/stock-opname?page=&product_name=&start_date=&end_date=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setProducts(response.data.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data.total_pages);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };

    const showData = () => {
        showLapStok()
            .then(data => {
                setProducts(data);
            })
    };

    useEffect(() => {

        showData();
    }, []);

    const exportToExcel = () => {
        const dataToExport = products.map((product, index) => ({
            // Customize this based on your data structure
            No: index + 1,
            Kode: product.product ? product.product.product_code : 'N/A',
            'Tanggal Faktur': convertDate(product.faktur_date),
            'Nama Produk': product.product ? product.product.product_name : 'N/A',
            'Stok Awal': product.product ? product.amount : 'N/A',
            Harga: convertIDR(product.product ? product.product.price : 'N/A'),
            'Sub Total': convertIDR(product.product ? product.product.stock * product.product.price : 0),
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

        // Save the Excel file
        XLSX.writeFile(wb, 'exported_data.xlsx');
    };

    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama Produk</label>
                                <input placeholder='Masukkan nama produk' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Dari</label>
                                <input type="date" placeholder='dd/mm/yyyy' className='form-control' name='fromDate'
                                    onChange={(e) => setNewProduct({ ...newProduct, faktur_date_from: e.target.value })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Sampai</label>
                                <input type="date" placeholder='dd/mm/yyyy' className='form-control' name='toDate'
                                    onChange={(e) => setNewProduct({ ...newProduct, faktur_date_to: e.target.value })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={arrangeBy}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                    required
                                >
                                    <option value='tanggal'>Tanggal Input</option>
                                    <option value="category_id">Kategori</option>
                                    <option value="product_code">Kode Produk</option>
                                    <option value="product_name">Nama Produk</option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={sortBy}
                                    onChange={(e) => {
                                        if (arrangeBy) {
                                            setSortBy(e.target.value);
                                        } else {
                                            toast.error('Tolong isikan "Urutan" dahulu sebelum memilih "Urutkan Berdasarkan".', {
                                                position: toast.POSITION.TOP_RIGHT,
                                            });
                                        }
                                    }}
                                    required
                                >
                                    <option value="asc">A-Z</option>
                                    <option value="desc">Z-A</option>
                                </select>
                            </div>
                            <div className='col-1 mt-8 me-2'>
                                <Button onClick={() => handleSearch(1)} >Cari</Button>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={exportToExcel} className='bi bi-printer'><span> Ekspor </span> </Button>
                            </div>
                        </div>
                    </div>
                    {/* begin::Table container */}
                    <div className='card-body'>
                        <div className='table-responsive'>
                            {/* begin::Table */}
                            <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                {/* begin::Table head */}
                                <thead>
                                    <tr className='fw-bold text-black'>
                                        <th align='center' className='min-w-30px'>No</th>
                                        <th className='min-w-150px'>Kode Produk</th>
                                        <th className='min-w-140px'>Tanggal Faktur</th>
                                        <th className='min-w-120px'>Nama Produk</th>
                                        <th className='min-w-120px'>Stok Awal</th>
                                        <th className='min-w-120px'>Harga </th>
                                        <th className='min-w-120px'>Sub Total</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {products
                                        .filter(product => product.product && product.product.product_code !== 'N/A')
                                        .map((product, index) => (
                                            <tr key={index}>
                                                <td align='center'>{index + 1}</td>
                                                <td>
                                                    <button type="button" className="btn btn-text">
                                                        <a onClick={() => openProdukConfirmation(product.id)} className='text-dark fw-bold text-hover-primary fs-6'>
                                                            {product.product ? product.product.product_code : 'N/A'}
                                                        </a>
                                                    </button>
                                                </td>
                                                <td >
                                                    <strong className='text-dark fw-bold  d-block mb-1 fs-6'>
                                                        {convertDate(product.faktur_date)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {product.product ? product.product.product_name : 'N/A'}
                                                    </strong>
                                                </td>
                                                <td align='center' className='text-dark fw-bold  fs-6'>
                                                    {product.product ? product.amount : 'N/A'}
                                                </td>
                                                <td className='text-dark fw-bold fs-6'>
                                                    <span>{convertIDR(product.product ? product.product.price : 'N/A')}</span>
                                                </td>
                                                <td className='text-dark fw-bold fs-6'>
                                                    <span>{convertIDR(product.product.stock * product.product.price)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    {/* {products.map((product, index) => (
                                        <tr key={index}>
                                            <td align='center'>{index + 1}</td>
                                            <td>
                                                <button type="button" className="btn btn-text">
                                                    <a onClick={() => openProdukConfirmation(product.id)} className='text-dark fw-bold text-hover-primary fs-6'>
                                                        {product.product ? product.product.product_code : 'N/A'}
                                                    </a>
                                                </button>
                                            </td>
                                            <td>
                                                <strong className='text-dark fw-bold  d-block mb-1 fs-6'>
                                                    {convertDate(product.faktur_date)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {product.product ? product.product.product_name : 'N/A'}
                                                </strong>
                                            </td>
                                            <td align='center' className='text-dark fw-bold  fs-6'>
                                                {product.product ? product.amount : 'N/A'}
                                            </td>
                                            <td className='text-dark fw-bold fs-6'>
                                                <span>{convertIDR(product.product ? product.product.price : 'N/A')}</span>
                                            </td>
                                            <td className='text-dark fw-bold fs-6'>
                                                <span>
                                                    {product.product && product.product.stock !== null && product.product.stock !== undefined
                                                        ? convertIDR(product.product.stock * product.product.price)
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))} */}

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
                                            <button className="page-link" onClick={() => handleSearch(currentPage - 1)} disabled={currentPage === 1}>
                                                Sebelumnya
                                            </button>
                                        </li>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <a className="page-link" onClick={() => handleSearch(index + 1)}>
                                                    {index + 1}
                                                </a>
                                            </li>
                                        ))}

                                        {/* Next Page Button */}
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => handleSearch(currentPage + 1)} >
                                                Selanjutnya
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* end::Table container */}
                    </div>
                </div>
                {/* modal */}
                {showProdukConfirmation && produkToProduk !== null && (
                    <Modal show={showProdukConfirmation} onHide={() => setShowProdukConfirmation(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Produk Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-2">
                                    <label className="col-form-label">Nama Produk:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={products.find(product => product.id === produkToProduk)?.product.product_name || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">Nomor Faktur:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={products.find(product => product.id === produkToProduk)?.faktur_number || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">Tanggal Faktur:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertDate(products.find(product => product.id === produkToProduk)?.faktur_date) || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">Kadaluarsa:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertDate(products.find(product => product.id === produkToProduk)?.expired_date) || ''}
                                        disabled
                                    />

                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )}
                <ToastContainer position="top-right" autoClose={2000} />
            </KTCard>
        </>
    )
}

export default HistoryReturnPage