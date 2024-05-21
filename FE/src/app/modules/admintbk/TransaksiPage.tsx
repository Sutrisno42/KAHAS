import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { fetchCategories, showTransaksi } from '../../functions/global/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { convertDate, convertIDR } from '../../functions/global';

const API_URL = process.env.REACT_APP_API_URL

interface Category {
    id: number;
    category_name: string;
}

const TransactionPage = () => {
    usePageTitle('Data Transaksi');

    const [transaksi, setTransaksi] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const navigate = useNavigate();
    const handleReturnButtonClick = (transaction_id: number) => {
        navigate(`/dataatransaksi/detailTransaksi/${transaction_id}`);
    };

    const showData = () => {

        showTransaksi()
            .then(data => {
                setTransaksi(data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
        fetchCategories().then((dataKategori) => {
            setCategories(dataKategori);
        });

        showData();
    }, []);

    const [arrangeBy, setArrangeBy] = useState('');
    const [status, setStatus] = useState('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [newTransaksi, setNewTransaksi] = useState({
        date: '',
        nota_number: '',
        category_id: '',

    });

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {

                date: newTransaksi.date,
                nota_number: newTransaksi.nota_number,
                category_id: newTransaksi.category_id,
                status: status,
                arrange_by: arrangeBy,
            };

            axios.get(`${API_URL}/transaction?page=&status=&date=&nota_number=&category_id=&arrange_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setTransaksi(response.data.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };

    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>No Nota</label>
                                <input placeholder='Masukkan no nota' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewTransaksi({ ...newTransaksi, nota_number: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Tanggal</label>
                                <input className='form-control' type="date" placeholder='dd/mm/yyyy' name='date'
                                    onChange={(e) => setNewTransaksi({ ...newTransaksi, date: e.target.value })} />
                            </div>
                            {/* <div className='col-3'>
                                <label className='mb-2'>Arrange by</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={arrangeBy}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                >
                                    <option value='nota_number'>No Nota</option>
                                    <option value="category_id">Kategori</option>
                                    <option value="grand_total">Sub Total</option>
                                    <option value="date">Tanggal</option>
                                </select>
                            </div> */}
                            <div className='col-3'>
                                <label className='mb-2'>Status</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value=''>Pilih Status</option>
                                    <option value='paid'>Terbayar</option>
                                    <option value="return">Pengembalian</option>
                                    {/* <option value="hold">Tertahan</option> */}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Kategori</label>
                                <select
                                    className="form-select"
                                    name="modeProcess"
                                    value={newTransaksi.category_id}
                                    onChange={(e) => setNewTransaksi({ ...newTransaksi, category_id: e.target.value })}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={() => handleSearch(1)} >Cari</Button>
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
                                    <tr className='fw-bold text-muted'>
                                        <th align='center' className='min-w-30px'>No</th>
                                        <th className='min-w-150px'>No Nota</th>
                                        <th className='min-w-120px'>Tanggal</th>
                                        {/* <th className='min-w-140px'>Nominal</th> */}
                                        <th className='min-w-120px'>Sub Total</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {transaksi.map((transaksi, index) => (
                                        <tr key={index}>
                                            <td align="center">{index + 1}</td>
                                            <td>

                                                <button type="button" className="btn btn-text">
                                                    <a className='text-dark fw-bold text-hover-primary fs-6'
                                                        onClick={() => handleReturnButtonClick(transaksi.id)}
                                                    >
                                                        {transaksi.nota_number}
                                                    </a>
                                                </button>

                                            </td>
                                            <td className='text-dark fw-bold d-block mb-1 fs-6'>
                                                {convertDate(transaksi.date)}
                                                <span className='text-muted fw-semibold text-muted d-block fs-7'>Status: {transaksi.status}</span>
                                            </td>
                                            {/* <td >
                                                <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {transaksi.total}
                                                </strong>
                                                <span className='text-muted fw-semibold text-muted d-block fs-7'>Pembayaran: {transaksi.payment_method}</span>
                                            </td> */}
                                            <td>
                                                <span style={{ fontSize: '14px' }} className='badge badge-light-success '>{convertIDR(transaksi.grand_total)} </span>
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
                    </div>
                    {/* end::Table container */}
                </div>
            </KTCard>
        </>
    )
}

export default TransactionPage