import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { addreturn, fetchCategories, showTransaksi } from '../../functions/global/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL

interface Category {
    id: number;
    category_name: string;
}
interface ReturDetail {
    id: number;
    nota_number: string;
    date: string;
    status: string;
    total: number;
    payment_method: string;
    details: ReturDetailItem[]; // Use a more specific type for details
}

interface ReturDetailItem {
    id: number;
    transaction_id: number;
    product_id: number;
    unit_id: number;
    product_name: string;
    // Add other properties as needed
    discount: number;
    discount_global: number;
    grand_total: number;
    hour: string;
    member: any; // You might want to replace `any` with a more specific type
    member_id: number | null;
    nota_number: string;
    payment_method: string;
    qris: number;
    status: string;
    total: number;
    transfer: number;
}
interface YourTransaksiType {
    discount: number;
    id: number;
    price: number;
    product_code: string;
    product_id: number;
    product_name: string;
    quantity: number;
    quantity_unit: number;
    sub_total: number;
    transaction_id: number;
    unit_id: number;
    reason: string;
    quantityreturn: number;

}

// Usage


const TransactionPage = () => {
    usePageTitle('Data Transaksi');

    const [transaksi, setTransaksi] = useState<any[]>([]);
    const [retur, setRetur] = useState<ReturDetail[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showDetailConfirmation, setShowDetailConfirmation] = useState(false);
    const [DetailToProduk, setDetailToProduk] = useState<number | null>(null);
    const [productNames, setProductNames] = useState<string[]>([]);
    const [returnToEdit, setReturnToEdit] = useState<number | null>(null);
    const [showEditReturn, setShowEditReturn] = useState(false);
    // const [newReturn, setNewReturn] = useState({
    //     kode: '',
    //     name: '',
    //     harga: 0,
    //     jumlah: '',
    //     subtotal: '',
    //     diskon: '',
    //     transaction_id: '',
    //     product_id: '',
    //     quantity: 0,
    //     reason: '',
    // });
    const [newReturn, setNewReturn] = useState<Array<YourTransaksiType>>([]);
    const [tanggal, setTanggal] = useState('')
    const navigate = useNavigate();
    const handleReturnButtonClick = (transaction_id: number) => {
        navigate(`/transaction/detailTransaksi/${transaction_id}`);
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

    const addReqReturn = async () => {
        const filteredData = newReturn.filter(
            (item) =>
                item.reason !== undefined &&
                item.quantityreturn !== undefined &&
                item.quantityreturn !== 0);
        console.log('data', filteredData);
        // try {

        //     const response = await addreturn({
        //         transaction_id: newReturn.transaction_id,
        //         product_id: newReturn.product_id,
        //         quantity: newReturn.quantity,
        //         reason: newReturn.reason,
        //     });

        //     console.log('Response:', response);
        //     if (response.status === 'success') {
        //         console.log('Product created successfully');
        //         showData();
        //         setRetur([...retur, response.data]);
        //         toast.success('Produk berhasil keluar', { position: toast.POSITION.TOP_RIGHT });
        //         setNewReturn({
        //             kode: '',
        //             name: '',
        //             harga: 0,
        //             jumlah: '',
        //             subtotal: '',
        //             diskon: '',
        //             transaction_id: '',
        //             product_id: '',
        //             quantity: 0,
        //             reason: '',

        //         });
        //         setShowEditReturn(false)
        //     } else {
        //         console.error('Gagal menambahkan produk, respons:', response);
        //     }
        // } catch (error) {
        //     console.error('Terjadi kesalahan saat menambahkan produk:', error);
        // }
        try {
            // Assuming addreturn is an asynchronous function
            for (const item of filteredData) {
                const response = await addreturn({
                    transaction_id: item.transaction_id.toString(),
                    product_id: item.product_id.toString(),
                    quantity: item.quantityreturn,
                    reason: item.reason,
                });

                console.log('Response:', response);

                if (response.status === 'success') {
                    console.log('Product created successfully');
                    showData();
                    setRetur((prevRetur) => [...prevRetur, response.data]);
                } else {
                    console.error('Gagal menambahkan produk, respons:', response);
                }
            }

            // After adding returns for all items, reset the newReturn state
            setNewReturn([]);
            toast.success('Berhasil Mengajukan Return', {
                position: toast.POSITION.TOP_RIGHT,
            });
            // Optionally, perform other actions after adding returns for all items
            setShowEditReturn(false);
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan produk:', error);
        }

    };

    const openEditReturn = (transaction_id: any) => {
        console.log('data', transaction_id.nota_number);
        console.log('data', transaction_id)
        const params = {

            kode: transaction_id.details[0].product_code,
            name: transaction_id.details[0].product_name,
            harga: transaction_id.details[0].price,
            jumlah: transaction_id.details[0].quantity,
            subtotal: transaction_id.details[0].sub_total,
            diskon: transaction_id.details[0].discount,
            transaction_id: transaction_id.details[0].transaction_id,
            product_id: transaction_id.details[0].product_id,
            quantity: 0,
            reason: '',
            // responsible: userData.name,
        }
        setTanggal(transaction_id.date);
        setNewReturn(transaction_id.details);
        setReturnToEdit(transaction_id.id);
        setShowEditReturn(true);
    };

    const openDetailConfirmation = (transaction_id: number) => {
        setDetailToProduk(transaction_id);
        setShowDetailConfirmation(true);
        const selectedDetail = transaksi.find(transaksi => transaksi.id === transaction_id);
        if (selectedDetail) {
            const details = selectedDetail.details;
            const names = details.map((detail: { product_name: string }) => detail.product_name);
            setProductNames(names);
        }
    };
    const [arrangeBy, setArrangeBy] = useState('');
    const [status, setStatus] = useState('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [newTransaksi, setNewTransaksi] = useState({
        date: '',
        nota_number: '',
        category_id: '',

    });
    // const returnHandle = async (item: any) => {
    //     console.log('return', item);
    //     console.log('returns', retur.length);
    //     console.log('retur', retur)
    //     setRetur(item);
    //     setShowEditProductOut(true);
    // }
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
                            <div className='col-4'>
                                <label className='mb-2'>No Nota</label>
                                <input placeholder='Masukkan no nota' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewTransaksi({ ...newTransaksi, nota_number: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Tanggal</label>
                                <input className='form-control' type="date" placeholder='dd/mm/yyyy' name='date'
                                    onChange={(e) => setNewTransaksi({ ...newTransaksi, date: e.target.value })} />
                            </div>

                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
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
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Status</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value='paid'>Terbayar</option>
                                    <option value="return">Pengembalian</option>
                                    <option value="hold">Tertahan</option>
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
                                        <th className='min-w-140px'>Nominal</th>
                                        <th className='min-w-120px'>Sub Total</th>
                                        <th className='min-w-120px'>Aksi</th>
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
                                                        // onClick={() => openDetailConfirmation(transaksi.id)}
                                                        onClick={() => handleReturnButtonClick(transaksi.id)}
                                                    >
                                                        {transaksi.nota_number}
                                                    </a>
                                                </button>

                                            </td>
                                            <td>
                                                <a href="" className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                    {transaksi.date}
                                                </a>
                                                <span className='text-muted fw-semibold text-muted d-block fs-7'>Status: {transaksi.status}</span>
                                            </td>
                                            <td>
                                                <a href="" className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                    {transaksi.total}
                                                </a>
                                                <span className='text-muted fw-semibold text-muted d-block fs-7'>Payment: {transaksi.payment_method}</span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '14px' }} className='badge badge-light-success '>RP.{transaksi.grand_total}</span>
                                            </td>
                                            <td className="d-flex">
                                                <button className="btn btn-info btn-sm me-2 flex-fill"
                                                    type="button" onClick={() => openEditReturn(transaksi)}>
                                                    Pengajuan Return
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
                                            <button className="page-link" onClick={() => handleSearch(currentPage + 1)} disabled={currentPage === totalPages}>
                                                Selanjutnya
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end::Table container */}

                    {/* modal */}
                    {showEditReturn && returnToEdit !== null && (
                        <Modal show={showEditReturn} onHide={() => setShowEditReturn(false)} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title>Pengajuan Retur</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="box-body">
                                        <div className="row mb-10">
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label htmlFor="invoice_no">No. Faktur:</label>
                                                    <input className="form-control" name="invoice_no" type="text" value="CN2023/0001" id="invoice_no" />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group">
                                                    <label htmlFor="invoice_no">Tanggal:*</label>
                                                    <input className='form-control' disabled type="date" placeholder='dd/mmmm/yyyy' name='date' value={tanggal}
                                                    // onChange={(e) => setNewTransaksi({ ...newTransaksi, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 mb-2">
                                            <table className='table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                                {/* begin::Table head */}
                                                <thead>
                                                    <tr className='fw-bold text-muted'>
                                                        <th align='center' className='min-w-30px'>
                                                            #
                                                        </th>
                                                        <th className='min-w-100px'>Kode Produk</th>
                                                        <th className='min-w-150px'>Nama Produk</th>
                                                        <th className='min-w-100px'>Harga Satuan</th>
                                                        <th className='min-w-100px'>Jumlah</th>
                                                        <th className='min-w-100px'>Subtotal</th>
                                                        <th className='min-w-100px'>Diskon</th>
                                                        <th className='min-w-200px'>Retur</th>
                                                    </tr>
                                                </thead>
                                                {/* end::Table head */}
                                                {/* begin::Table body */}
                                                <tbody>
                                                    {newReturn.map((transaksi, index) => (
                                                        <tr key={index}>
                                                            <td align='center'>1</td>
                                                            <td>{transaksi.product_code}</td>
                                                            <td>{transaksi.product_name}</td>
                                                            <td>{transaksi.price}</td>
                                                            <td>{transaksi.quantity}</td>
                                                            <td>{transaksi.sub_total}</td>
                                                            <td>{transaksi.discount}</td>
                                                            <td>
                                                                {/* <label className='col-5 ' htmlFor="">Jumlah Retur</label>
                                                        <label htmlFor="">Alasan</label> */}
                                                                <div className='col-10 d-flex'>
                                                                    <input placeholder='Jumlah retur' type="number" id="quantity"
                                                                        className="col form-control me-2"
                                                                        style={{ borderColor: 'black' }}
                                                                        min={0}
                                                                        value={transaksi.quantityreturn}
                                                                        onChange={(e) => {
                                                                            // Create a new array with the updated quantityreturn for the specific index
                                                                            const updatedNewReturn = [...newReturn];
                                                                            updatedNewReturn[index] = {
                                                                                ...transaksi,
                                                                                quantityreturn: parseInt(e.target.value),
                                                                            };
                                                                            setNewReturn(updatedNewReturn);
                                                                        }} />
                                                                    <input placeholder='Alasan retur' type="text"
                                                                        className="col form-control"
                                                                        style={{ borderColor: 'black' }}
                                                                        value={transaksi.reason}
                                                                        onChange={(e) => {
                                                                            // Create a new array with the updated quantityreturn for the specific index
                                                                            const updatedNewReturn = [...newReturn];
                                                                            updatedNewReturn[index] = {
                                                                                ...transaksi,
                                                                                reason: e.target.value,
                                                                            };
                                                                            setNewReturn(updatedNewReturn);
                                                                        }} />
                                                                </div>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                                {/* end::Table body */}
                                            </table>

                                        </div>
                                        <div className="row">
                                        </div>
                                        <input name="tax_id" type="hidden" />
                                        <input id="tax_amount" name="tax_amount" type="hidden" value="0" />
                                        <input id="tax_percent" name="tax_percent" type="hidden" value="0" />
                                        {/* <div className="row">
                                            <div className="col-sm-12 text-right">
                                                <strong>Total Diskon Retur:</strong>
                                                &nbsp;(-) <span id="total_return_discount">Rp 0</span>
                                            </div>
                                            <div className="col-sm-12 text-right">
                                                <strong>Total Retur Pajak - :</strong>
                                                &nbsp;(+) <span id="total_return_tax">Rp 0</span>
                                            </div>
                                            <div className="col-sm-12 text-right">
                                                <strong>Total Retur: </strong>&nbsp;
                                                <span id="net_return">Rp 29,000</span>
                                            </div>
                                        </div> */}
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditReturn(false)}>
                                    Batal
                                </Button>
                                <Button variant="primary" onClick={addReqReturn}>
                                    Simpan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                </div>
                <ToastContainer position="top-right" autoClose={2000} />
            </KTCard>
        </>
    )
}

export default TransactionPage