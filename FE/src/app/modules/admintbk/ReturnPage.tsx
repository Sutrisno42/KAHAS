import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { showreq, updateStatus } from '../../functions/global/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { convertDate, convertIDR } from '../../functions/global';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import logo from '../../../_metronic/assets/img/logo3.png'

const API_URL = process.env.REACT_APP_API_URL

interface ApprovedRequest {
    product_name: string;
    product_code: string;
    status: string;
    reason: string;
    quantity: number;
    date_return: string;
    transaction: any;
    cashier: any;
    product: any;
    // tambahkan properti lain jika diperlukan
}

const HistoryReturnPage = () => {
    usePageTitle('Permintaan Return');

    const [req, setReq] = useState<any[]>([]);
    const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
    const [reqToReturn, setReqToReturn] = useState<number | null>(null);
    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [status, setstatus] = useState('');
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
        navigate(`/permintaanreturn/detailReturn/${product_return_id}`);
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
                status: status,
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

    const [approvedRequests, setApprovedRequests] = useState<number[]>([]);
    const [rejectedRequests, setRejectedRequests] = useState<number[]>([]);

    const handleApprove = (returnId: number) => {
        updateStatus(returnId, 'accepted')
            .then(response => {
                console.log('Response Data:', response.data);
                console.log('Approval successful!');
                // showData();
                setReq(prevReq => prevReq.filter(item => item.id !== returnId));
                setApprovedRequests(prevState => [...prevState, returnId]);

                // const approvedRequest = req.find(item => item.id === returnId);
                // if (approvedRequest) {
                //     const doc = new jsPDF();
                //     doc.text('Nota Retur', 10, 10);
                //     doc.text(`Nama Produk: ${approvedRequest.product_name}`, 10, 20);
                //     doc.text(`Kode Produk: ${approvedRequest.product_code}`, 10, 30);
                //     doc.text(`Status: ${approvedRequest.status}`, 10, 40);
                //     doc.text(`Alasan: ${approvedRequest.reason}`, 10, 50);
                //     doc.save('nota_retur.pdf');
                // } else {
                //     console.error('Failed to find approved request');
                // }
                const approvedRequest = req.find(item => item.id === returnId);
                if (approvedRequest) {
                    printReturnNote(approvedRequest);
                } else {
                    console.error('Failed to find approved request');
                }
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };
    const handleRejected = (returnId: number) => {
        updateStatus(returnId, 'rejected')
            .then(response => {
                console.log('Response Data:', response.data);
                console.log('rejected successful!');
                setReq(prevReq => prevReq.filter(item => item.id !== returnId));
                setRejectedRequests(prevState => [...prevState, returnId]);

                const approvedRequest = req.find(item => item.id === returnId);
                // if (approvedRequest) {
                //     printReturnNote(approvedRequest);
                // } else {
                //     console.error('Failed to find approved request');
                // }
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };
    const printReturnNote = (approvedRequest: ApprovedRequest) => {
        // const doc = new jsPDF();
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [48, 210],
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 10;
        const logoHeight = 10;
        const logoX = 20;
        const logoY = 10;

        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

        pdf.setFontSize(8);

        pdf.text('D Hardjosoewarno', pageWidth / 2, 23, { align: 'center' });
        pdf.text('Jl Parangtritis no.133, Brontok', pageWidth / 2, 26, { align: 'center' });
        pdf.text('usuman, Yogyakarta', pageWidth / 2, 29, { align: 'center' });
        pdf.text('081390408934', pageWidth / 2, 32, { align: 'center' });

        // pdf.text(`Nama Produk: ${approvedRequest.product_name}`, 2, 37);
        // pdf.text(`Kode Produk: ${approvedRequest.product_code}`, 2, 40);
        // pdf.text(`Jumlah Retur: ${approvedRequest.quantity}`, 2, 43);
        // pdf.text(`Status: ${approvedRequest.status}`, 2, 46);
        // pdf.text(`Alasan: ${approvedRequest.reason}`, 2, 49);
        // pdf.text(`Tgl Retur: ${approvedRequest.date_return}`, 2, 52);
        pdf.text(`No Nota : ${approvedRequest.transaction.nota_number}`, 2, 37);
        pdf.text(`Kasir : ${approvedRequest.cashier?.name}`, 2, 40);
        pdf.text(`Tgl Retur : ${approvedRequest.date_return}`, 2, 43);

        const dashLength = 1;
        const gapLength = 1;
        let currentX = 1;
        const endX = pageWidth - 1;

        const lineHeight = 2;
        let currentY = 45;

        currentX = 1;
        while (currentX < endX) {
            pdf.line(currentX, currentY, currentX + dashLength, currentY);
            currentX += dashLength + gapLength;
        }
        pdf.text(`${approvedRequest.product_name} `, 2, currentY + 5);
        pdf.text(`${approvedRequest.quantity}`, pageWidth - 5, currentY + 5, { align: 'right' });
        currentY += 10;

        currentX = 1;

        while (currentX < endX) {
            pdf.line(currentX, currentY, currentX + dashLength, currentY);
            currentX += dashLength + gapLength;
        }

        pdf.text(`Jml Retur: `, 2, currentY + 5);
        pdf.text(`${approvedRequest.quantity}`, pageWidth - 5, currentY + 5, { align: 'right' });

        pdf.text(`Status:`, 2, currentY + 8);
        pdf.text(`${approvedRequest.status}`, pageWidth - 5, currentY + 8, { align: 'right' });

        pdf.text(`Alasan: `, 2, currentY + 11);
        pdf.text(`${approvedRequest.reason}`, pageWidth - 5, currentY + 11, { align: 'right' });
        pdf.setFontSize(6);
        pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 15, { align: 'center', });
        pdf.text('https://projotech.id/', pageWidth / 2, currentY + 18, { align: 'center', });

        pdf.autoPrint();
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = () => {
            iframe.contentWindow?.print();
        };
    };


    const openAkunConfirmation = (id_product: number) => {
        setReqToReturn(id_product);
        setShowReturnConfirmation(true);
    };

    const itemsPerPage = 10;
    console.log('Filtered Data:', req.filter(request => request.status === 'pending'));
    console.log('currentPage:', currentPage, 'ITEMS_PER_PAGE:', itemsPerPage);

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
                            {/* <div className='col-3'>
                                <label className='mb-2'>Status</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={status}
                                    onChange={(e) => setstatus(e.target.value)}
                                    required
                                >
                                    <option value="">Pilihan</option>
                                    <option value='pending'>Tertunda</option>
                                    <option value="accepted">Diterima</option>
                                </select>
                            </div> */}
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
                                    required
                                >
                                    <option value="">Pilihan</option>
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
                                    onChange={(e) => {
                                        if (arrangeBy) {
                                            setSortBy(e.target.value);
                                        } else {
                                            toast.error('Tolong isikan "Urutkan Berdasarkan" dahulu sebelum memilih "Urutan".', {
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
                                        <th className='min-w-200px'>Tanggal</th>
                                        <th className='min-w-200px'>Nama Produk</th>
                                        <th className='min-w-120px'>Jumlah</th>
                                        <th className='min-w-150px'>Harga </th>
                                        <th className='min-w-150px'>Sub Total</th>
                                        <th className='min-w-120px'>Status </th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {req
                                        .filter(request => (status ? request.status === status : true))
                                        .map((req, index) => (
                                            <tr key={index}>
                                                <td align="center">{index + 1}</td>
                                                <td>
                                                    <strong className='text-dark fw-bold fs-6'>
                                                        {req.product_code}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {req.date_return}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {req.product_name}
                                                    </strong>
                                                </td>
                                                <td align='center' className='text-dark fw-bold fs-6'>{req.quantity}
                                                </td>
                                                <td>
                                                    <span className='text-dark fw-bold fs-6'>{convertIDR(req.price)}</span>
                                                </td>
                                                <td>
                                                    <span className='text-dark fw-bold fs-6'>{convertIDR(req.sub_total)}</span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '14px' }} className='badge badge-light-success '>{req.status} </span>
                                                </td>
                                                {/* <td>
                                                    <span style={{ fontSize: '14px' }} className={`badge ${req.status === 'accepted' ? 'badge-light-success' : req.status === 'rejected' ? 'badge-light-danger' : ''}`}>{req.status}</span>
                                                </td> */}
                                                <td className="d-flex">
                                                    <button className="btn btn-success btn-sm me-2 flex-fill"
                                                        onClick={() => handleApprove(req.id)}
                                                        // disabled={approvedRequests.includes(req.id)}
                                                        type="button" >
                                                        Setuju
                                                    </button>
                                                    <button className="btn btn-danger btn-sm me-2 flex-fill"
                                                        type="button"
                                                        onClick={() => handleRejected(req.id)}
                                                    // disabled={rejectedRequests.includes(req.id)}
                                                    >
                                                        Batal
                                                    </button>
                                                    <button className="btn btn-info btn-sm me-2 flex-fill"
                                                        type="button"
                                                        onClick={() => handleReturnButtonClick(req.id)}
                                                    // onClick={() => openAkunConfirmation(req.id)}
                                                    >
                                                        Detail
                                                    </button>

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

                        {/* end::Table container */}

                        {/* modal */}
                        {showReturnConfirmation && reqToReturn !== null && (
                            <Modal show={showReturnConfirmation} onHide={() => setShowReturnConfirmation(false)} size='xl'>
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
                        <ToastContainer position="top-right" autoClose={2000} />
                    </div>
                </div>
            </KTCard>
        </>
    )
}

export default HistoryReturnPage