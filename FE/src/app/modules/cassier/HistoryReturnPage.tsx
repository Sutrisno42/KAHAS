import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { showreq, updateStatus } from '../../functions/global/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL

const HistoryReturnPage = () => {
    usePageTitle('History Pengembalian');

    const [req, setReq] = useState<any[]>([]);
    const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
    const [reqToReturn, setReqToReturn] = useState<number | null>(null);
    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [newReturn, setNewReturn] = useState({
        product_name: '',
        quantity: '',
        date_from: '',
        date_to: '',

    });
    const navigate = useNavigate();

    const handleReturnButtonClick = (product_return_id: number) => {
        navigate(`/cassier/history-return/detail-return/${product_return_id}`);
    };

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                product_name: newReturn.product_name,
                quantiry: newReturn.quantity,
                start_date: newReturn.date_from,
                end_date: newReturn.date_to,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/product-return?page=&product_name=&quantity=&start_date=&end_date=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setReq(response.data.data.data);
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

        showreq()
            .then(data => {
                setReq(data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
        showData();
    }, []);

    const handleApprove = (returnId: number) => {
        updateStatus(returnId, 'accepted')
            .then(response => {
                console.log('Response Data:', response.data);
                console.log('Approval successful!');
                // showData();
                setReq(prevReq => prevReq.filter(item => item.id !== returnId));
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

    const openAkunConfirmation = (id_product: number) => {
        setReqToReturn(id_product);
        setShowReturnConfirmation(true);
    };

    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama Produk</label>
                                <input placeholder='Masukkan nama produk' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewReturn({ ...newReturn, product_name: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Jumlah</label>
                                <input placeholder='Masukkan jumlah produk' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewReturn({ ...newReturn, quantity: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Dari</label>
                                <input type="date" placeholder='dd/mm/yyyy' className='form-control' name='statusDeliveryCode'
                                    onChange={(e) => setNewReturn({ ...newReturn, date_from: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Sampai</label>
                                <input type="date" placeholder='dd/mm/yyyy' className='form-control' name='statusDeliveryCode'
                                    onChange={(e) => setNewReturn({ ...newReturn, date_to: e.target.value })} />
                            </div>

                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={arrangeBy}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                >
                                    <option value='quantity'>Jumlah</option>
                                    <option value="created_at">Tanggal</option>
                                    <option value="product_code">Kode Produk</option>
                                    <option value="product_name">Nama Produk</option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="asc">A-Z</option>
                                    <option value="desc">Z-A</option>
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
                                        <th className='min-w-150px'>Kode Produk</th>
                                        <th className='min-w-140px'>Tanggal</th>
                                        <th className='min-w-120px'>Nama Produk</th>
                                        <th className='min-w-120px'>Jumlah</th>
                                        <th className='min-w-120px'>Harga </th>
                                        <th className='min-w-120px'>Sub Total</th>
                                        <th className='min-w-120px'>Status</th>

                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {req.map((req, index) => (
                                        <tr key={index}>

                                            <td align="center">{index + 1}</td>
                                            <td>
                                                <a onClick={() => handleReturnButtonClick(req.id)}
                                                    className='text-dark fw-bold text-hover-primary fs-6'>
                                                    {req.product_code}
                                                </a>
                                            </td>
                                            <td>
                                                <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                    {req.date_return}
                                                </a>
                                            </td>
                                            <td>
                                                <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                    {req.product_name}
                                                </a>
                                            </td>
                                            <td align='center' className='text-dark fw-bold text-hover-primary fs-6'>{req.quantity}
                                            </td>
                                            <td>
                                                <span>Rp. {req.price}</span>
                                            </td>
                                            <td>
                                                <span>Rp. {req.sub_total}</span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '14px' }} className='badge badge-light-success '>{req.status}</span>
                                            </td>
                                            {/* <td className="d-flex">
                                                <button className="btn btn-info btn-sm me-2 flex-fill"
                                                    type="button" onClick={() => openAkunConfirmation(req.id)}>
                                                    return
                                                </button>
                                                <button className="btn btn-success btn-sm me-2 flex-fill"
                                                    onClick={() => handleApprove(req.id)}
                                                    type="button" >
                                                    Setuju
                                                </button>
                                            </td> */}

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
                                            <button className="page-link" onClick={() => handleSearch(currentPage + 1)} disabled={currentPage === totalPages}>
                                                Selanjutnya
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* end::Table container */}

                        {/* modal */}
                        {showReturnConfirmation && reqToReturn !== null && (
                            <Modal show={showReturnConfirmation} onHide={() => setShowReturnConfirmation(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Detail Permintaan Return</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form>
                                        <div className="mb-2">
                                            <label className="col-form-label">Nama Produk:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={req.find(req => req.id === reqToReturn)?.product_name || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Jumlah:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={req.find(req => req.id === reqToReturn)?.quantity || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Alasan:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={req.find(req => req.id === reqToReturn)?.reason || ''}
                                                disabled
                                            />


                                        </div>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        )}

                    </div>
                </div>
            </KTCard>
        </>
    )
}


export default HistoryReturnPage