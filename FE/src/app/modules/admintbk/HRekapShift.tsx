import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { TablesWidget14 } from '../../../_metronic/partials/widgets/tables/TablesWidget14'
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { addNewMember, deletemember, fetchStore, postRecap, showHistoriRekap, showMember, updateMember } from '../../functions/global/api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { convertDate, convertIDR, convertTime } from '../../functions/global';
import jsPDF from 'jspdf';
import logo from '../../../_metronic/assets/img/logo3.png'

const API_URL = process.env.REACT_APP_API_URL

interface CashierData {
    cashier_id: number;
    cashier_name: string;
    discount_cash: number;
    discount_qris: number;
    discount_total: number;
    discount_transfer: number;
    end_date: string;
    end_time: string;
    nota_total: number;
    retur_nominal: number;
    retur_total: number;
    start_date: string;
    start_time: string;
    total_cash: number;
    total_qris: number;
    total_transaction: number;
    total_transfer: number;
}
interface Store {
    id: number;
    store_name: string;
}

const HRekapshift = () => {
    usePageTitle('Histori Rekap Shift');

    const [member, setMember] = useState<any[]>([]);
    const [store, setStore] = useState<Store[]>([]);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<number | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
    const [showMemberConfirmation, setShowMemberConfirmation] = useState(false);
    const [memberToMember, setmemberToMember] = useState<number | null>(null);
    const [newMember, setNewMember] = useState({
        cashier_name: '',
        code: '',
        phone: '',
        email: '',
        address: '',
        default_discount: 0,
        date: '',
        store_id: '',

    });
    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);


    const handlePrintReceipt = () => {
        const selectedMember = member.find(member => member.id === memberToMember);

        if (selectedMember) {
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
            pdf.text('Rekap Shift', 2, 38);
            const columnWidth = 80; // Lebar kolom
            const startX = 2; // Mulai dari posisi x: 2
            let ccy = 41; // Mulai dari posisi y: 41
            const addJustifiedText = (text: string) => {
                const splitText = pdf.splitTextToSize(text, columnWidth);
                pdf.text(splitText, startX, ccy);
                ccy += pdf.getTextDimensions(text).h + 3;
            };
            addJustifiedText(`Nama Kasir: ${selectedMember.cashier.name}`);
            addJustifiedText(`Modal Awal: ${convertIDR(selectedMember.initial_balance)}`);
            addJustifiedText(`Tanggal: ${convertDate(selectedMember.start_date)}`);
            addJustifiedText(`Jam Mulai: ${convertTime(selectedMember.start_date)}`);
            addJustifiedText(`Jam Berakhir: ${convertTime(selectedMember.end_date)}`);
            addJustifiedText(`Transaksi Cash: ${convertIDR(selectedMember.total_cash)}`);
            addJustifiedText(`Transaksi QRS: ${convertIDR(selectedMember.total_qris)}`);
            addJustifiedText(`Transaksi EDC: ${convertIDR(selectedMember.total_transfer)}`);
            addJustifiedText(`Diskon Transaksi: ${convertIDR(selectedMember.discount_payment)}`);
            addJustifiedText(`Total Diskon: ${selectedMember.discount_total}`);
            addJustifiedText(`Return: ${selectedMember.retur_total}`);
            addJustifiedText(`Total Transaksi: ${convertIDR(selectedMember.total_transaction)}`);
            addJustifiedText(`Total Nota: ${selectedMember.nota_total}`);

            let currentY = 60;

            pdf.setFontSize(6);
            pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 60, { align: 'center', });
            pdf.text('https://projotech.id/', pageWidth / 2, currentY + 63, { align: 'center', });


            // Sisipkan data lain sesuai kebutuhan

            // Cetak PDF
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            const newWindow = window.open(url, '_blank');
            if (newWindow) {
                newWindow.onload = () => {
                    newWindow.print();
                };
            } else {
                alert('Tidak dapat membuka jendela baru. Pastikan pop-up tidak diblokir.');
            }
        } else {
            alert('Data tidak ditemukan.');
        }
    };


    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                cashier_name: newMember.cashier_name,
                code: newMember.code,
                date: newMember.date,
                store_id: newMember.store_id,
                sort_by: sortBy,
                arrange_by: arrangeBy,
            };

            axios.get(`${API_URL}/data-shift?page=&cashier_name=&date=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setMember(response.data.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };

    const showData = () => {
        showHistoriRekap()
            .then(data => {
                setMember(data);
            })
    };

    useEffect(() => {
        showData();
        fetchStore().then((dataToko) => {
            setStore(dataToko);
        });
    }, []);

    const openMemberConfirmation = (id_member: number) => {
        setmemberToMember(id_member);
        setShowMemberConfirmation(true);
    };

    function convertWaktu(date: string | null) {
        if (!date) return ''; // Menambahkan penanganan untuk nilai null atau undefined

        const dataDate = new Date(date.replace(" ", "T"));
        const hours =
            dataDate.getHours() <= 9 ? "0" + dataDate.getHours() : dataDate.getHours();
        const minutes =
            dataDate.getMinutes() <= 9
                ? "0" + dataDate.getMinutes()
                : dataDate.getMinutes();

        return `${hours}:${minutes}`;
    }


    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama Pelanggan</label>
                                <input placeholder='Budi' className='form-control' type='text'
                                    name='search'
                                    onChange={(e) => setNewMember({ ...newMember, cashier_name: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Tanggal</label>
                                <input placeholder='' className='form-control' type='date'
                                    name='search'
                                    onChange={(e) => setNewMember({ ...newMember, date: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Toko</label>
                                <select
                                    className="form-select"
                                    name="modeProcess"
                                    value={newMember.store_id}
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
                                    value={arrangeBy}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                    required
                                >
                                    <option value="">Pilihan</option>
                                    <option value='cashier_name'>Nama Kasir</option>
                                    <option value="date">Tanggal</option>
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
                </div>

                {/* begin::Table container */}
                <div className='card-body'>
                    <div className='table-responsive'>
                        {/* begin::Table */}
                        <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                            {/* begin::Table head */}
                            <thead>
                                <tr className='fw-bold text-muted '>
                                    <th className='min-w-30px'>No</th>
                                    <th className='min-w-150px'>Nama Kasir</th>
                                    <th className='min-w-300px'>Toko</th>
                                    <th className='min-w-200px'>Modal Awal</th>
                                    <th className='min-w-150px text-center'>Tanggal</th>
                                    <th className='min-w-150px text-center'>Jam Mulai</th>
                                    <th className='min-w-150px text-center'>Jam Berakhir</th>
                                    <th className='min-w-150px text-center'>Jumlah Retur</th>
                                    <th className='min-w-150px text-center'>Jumlah Nota</th>
                                </tr>
                            </thead>
                            {/* end::Table head */}
                            {/* begin::Table body */}
                            <tbody>
                                {Array.isArray(member) ? (
                                    member.map((item, index) => (
                                        <tr key={index}>
                                            <td align="center">{index + 1}</td>
                                            <td>
                                                <button type="button" className="btn btn-text">
                                                    <a
                                                        onClick={() => openMemberConfirmation(item.id)}
                                                        className='text-dark fw-bold text-hover-primary fs-6'>
                                                        {item.cashier?.name}
                                                    </a>
                                                </button>
                                            </td>
                                            <td>
                                                <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {item.cashier?.store?.store_name}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {convertIDR(item.initial_balance)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                    {convertDate(item.start_date)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                    {convertWaktu(item.start_date)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                    {convertWaktu(item.end_date)}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                    {item.retur_total}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                    {item.nota_total}
                                                </strong>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <p>Data tidak tersedia</p>
                                )}
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

                {/* modal */}
                {showMemberConfirmation && memberToMember !== null && (
                    <Modal show={showMemberConfirmation} onHide={() => setShowMemberConfirmation(false)} size='xl'>
                        <Modal.Header closeButton>
                            <Modal.Title>Data Rekap</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-2">
                                    <label className="col-form-label">Nama Kasir:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.cashier.name || ''}
                                        readOnly
                                    />
                                    <label className="col-form-label">Modal Awal:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertIDR(member.find(member => member.id === memberToMember)?.initial_balance || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Tanggal:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertDate(member.find(member => member.id === memberToMember)?.start_date || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Jam Mulai:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertWaktu(member.find(member => member.id === memberToMember)?.start_date || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Jam Berakhir:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertWaktu(member.find(member => member.id === memberToMember)?.end_date || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Pembayaran Tunai:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertIDR(member.find(member => member.id === memberToMember)?.total_cash || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Pembayaran Qris:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertIDR(member.find(member => member.id === memberToMember)?.total_qris || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Pembayaran Transfer:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertIDR(member.find(member => member.id === memberToMember)?.total_transfer || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Total Diskon:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertIDR(member.find(member => member.id === memberToMember)?.discount_total || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Pengembalian Barang:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.retur_total}
                                        readOnly
                                    />
                                    <label className="col-form-label">Total Transaksi:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={convertIDR(member.find(member => member.id === memberToMember)?.total_transaction || '')}
                                        readOnly
                                    />
                                    <label className="col-form-label">Total Nota:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.nota_total}
                                        readOnly
                                    />
                                    <div className="d-flex justify-content-center mt-8">
                                        <Button variant="primary" size="lg" onClick={handlePrintReceipt}>
                                            Cetak
                                        </Button>
                                    </div>
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

export default HRekapshift