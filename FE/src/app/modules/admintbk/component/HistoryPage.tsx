import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { addProductOut, approveStok, refundHistory, showHistoriPerRepack, showHistoriRepack, showHistory, showSupplier, updateHistory } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { convertDate, convertIDR, getDaysRemaining } from '../../../functions/global';
import * as XLSX from 'xlsx';

interface Supplier {
    id: number;
    name: string;
}
interface StockOpname {
    id: number;
    // ... other properties
    product: {
        product_name: string;
        // ... other product properties
    };
    // ... other properties
}

const API_URL = process.env.REACT_APP_API_URL

const HistoryPage = () => {
    usePageTitle('History');

    const { product_id } = useParams();
    const [selectedStockOpnameId, setSelectedStockOpnameId] = useState<number | null>(null);
    const [repack, setRepack] = useState<any[]>([]);
    const [productHistory, setProductHistory] = useState<any>({});
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [expNotifState, setExpNotifState] = useState<{ [key: number]: boolean }>({});
    const [opnameToEdit, setOpnameToEdit] = useState<number | null>(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [newStokOpname, setNewStokOpname] = useState({
        hpp_price: 0,
        supplier_id: '',
        note: '',
        amount: 0,
        responsible: '',
        expired_notif_date: '',
        expired_date: '',
        expired_notif_days: 0,

    });
    const [refundToEdit, setRefundToEdit] = useState<number | null>(null);
    const [showEditRefund, setShowEditRefund] = useState(false);
    const [newRefund, setNewRefund] = useState({
        amount: 0,
        responsible: '',
        note: '',
        status: '',
    });
    const showRepack = (productId: number) => {
        showHistoriPerRepack(productId)
            .then(data => {
                setRepack(data);
                console.log('datarepak', data);

            })
    }

    useEffect(() => {
        if (!product_id) {
            return;
        }
        const productId = parseInt(product_id, 10);
        if (!isNaN(productId)) {
            showRepack(productId);
        }
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
    }, [product_id]);

    useEffect(() => {
        if (showEditConfirmation && opnameToEdit !== null) {
            const selectedOpname = productHistory.stock_opnames.find((product: any) => product.id === opnameToEdit);

            if (selectedOpname) {
                setNewStokOpname({
                    hpp_price: selectedOpname.hpp_price,
                    supplier_id: selectedOpname.supplier_id,
                    note: selectedOpname.note,
                    amount: selectedOpname.amount,
                    responsible: selectedOpname.responsible,
                    expired_notif_date: selectedOpname.expired_notif_date,
                    expired_date: selectedOpname.expired_date,
                    expired_notif_days: selectedOpname.expired_notif_days,

                });
            }
        }
    }, [showEditConfirmation, opnameToEdit, productHistory]);

    const simpanPerubahan = () => {
        const { hpp_price, supplier_id, note } = newStokOpname;
        if (!hpp_price || !supplier_id || !note) {
            setValidationError('Tolong isi semua kolom !');
            return;
        }

        if (opnameToEdit !== null) {
            updateHistory(
                opnameToEdit,
                newStokOpname.hpp_price,
                newStokOpname.amount,
                newStokOpname.supplier_id,
                newStokOpname.note,
                newStokOpname.responsible,
                newStokOpname.expired_notif_date,
                newStokOpname.expired_date,
            )
                .then((response) => {
                    console.log('data', newStokOpname);

                    console.log('Akun diperbarui:', response);
                    if (product_id) {
                        showHistory(parseInt(product_id, 10))
                            .then((updatedHistoryData) => {
                                setProductHistory(updatedHistoryData);
                                setShowEditConfirmation(false);

                                toast.success('Data berhasil diubah', { position: toast.POSITION.TOP_RIGHT });
                            })
                            .catch((error) => {
                                console.error('Error fetching updated product history:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit akun:', error);
                });
        }
    };

    const simpanPerubahanRefund = () => {
        const { amount, responsible } = newRefund;
        if (!amount || !responsible) {
            setValidationError('Tolong isi semua kolom !');
            return;
        }

        if (refundToEdit !== null) {
            refundHistory(
                refundToEdit,
                newRefund.amount,
                newRefund.responsible,
                newRefund.note,
                newRefund.status
            )
                .then((response) => {
                    console.log('Akun diperbarui:', response);
                    if (product_id) {
                        showHistory(parseInt(product_id, 10))
                            .then((updatedHistoryData) => {
                                setProductHistory(updatedHistoryData);
                                setShowEditRefund(false);

                                toast.success('Data berhasil diubah', { position: toast.POSITION.TOP_RIGHT });
                            })
                            .catch((error) => {
                                console.error('Error fetching updated product history:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit akun:', error);
                });
        }
    };

    const saveExpNotifStateToLocalStorage = (state: { [key: number]: boolean }) => {
        localStorage.setItem('expNotifState', JSON.stringify(state));
    };

    const handleCheckboxChange = (stockOpnameId: number) => {
        const updatedExpNotifState = { ...expNotifState };
        updatedExpNotifState[stockOpnameId] = !expNotifState[stockOpnameId];

        setExpNotifState(updatedExpNotifState);
        saveExpNotifStateToLocalStorage(updatedExpNotifState);

        const apiUrl = `${API_URL}/stock-opname/${stockOpnameId}/exp-notif`;
        const expNotifValue = updatedExpNotifState[stockOpnameId] ? 1 : 0;

        axios.post(apiUrl, { exp_notif: expNotifValue })
            .then((response) => {
                console.log('Exp Notif updated successfully:', response);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating Exp Notif:', error);
            });
    };

    const openEditRefund = (stock_opname_id: number) => {
        setRefundToEdit(stock_opname_id);
        setShowEditRefund(true);
    };

    const openEditConfirmation = (stock_opname_id: number) => {
        setOpnameToEdit(stock_opname_id);
        setShowEditConfirmation(true);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
    };
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const exportToExcel = () => {
        if (!productHistory || !productHistory.transactions) {
            return;
        }

        // Step 1: Group transactions by month
        const groupedTransactions: { [month: string]: number } = {};
        productHistory.transactions.forEach((transaction: any) => {
            const transactionDate = new Date(transaction.transaction?.date);
            const month = transactionDate.toLocaleString('en-US', { month: 'long' });
            const amount = parseInt(transaction.quantity_unit, 10); // Assuming quantity_unit is numeric
            if (groupedTransactions[month]) {
                groupedTransactions[month] += amount;
            } else {
                groupedTransactions[month] = amount;
            }
        });

        // Step 2: Prepare data for Excel export
        const data = Object.keys(groupedTransactions).map(month => ({
            Bulan: month,
            'Jumlah Total': groupedTransactions[month],
        }));

        // Step 3: Export to Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'History Terjual by Month');

        // Export the Excel file
        XLSX.writeFile(workbook, 'history_terjual_by_month.xlsx');
    };

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <h1>{productHistory?.product?.product_name} (Kategori : {productHistory?.product?.category?.category_name} )</h1>
                    </div>

                    {/* History Input Stok */}
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className=''>
                                <h1 className='mt-10'>History Input Stok</h1>
                            </div>
                        </div>
                    </div>
                    {/* tabel */}
                    <div className='card-body'>
                        {/* begin::Table container */}
                        <div className='table-responsive' style={{ overflowX: 'auto' }}>
                            {/* begin::Table */}
                            <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                {/* begin::Table head */}
                                <thead>
                                    <tr className='fw-bold text-muted text-center'>
                                        <th align='center' className='min-w-150px'>
                                            Tgl Masuk
                                        </th>
                                        <th className='min-w-150px'>Tgl Kadaluarsa</th>
                                        <th className='min-w-100px'>Jml Masuk</th>
                                        <th className='min-w-30px'>HPP</th>
                                        <th className='min-w-200px'>Suplier</th>
                                        <th className='min-w-200px'>Keterangan</th>
                                        <th className='min-w-200px'>Penanggung Jawab</th>
                                        <th className='min-w-200px'>Aksi</th>
                                        <th className='min-w-200px'>Notif Kadaluarsa</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {productHistory.stock_opnames &&
                                        productHistory.stock_opnames.map((stockOpname: any) => (
                                            <tr className='text-center' key={stockOpname.id}>
                                                <td>
                                                    {formatDate(stockOpname.faktur_date)}
                                                </td>
                                                <td>
                                                    {formatDate(stockOpname.expired_date)}
                                                </td>

                                                <td className='text-dark fw-bold'>
                                                    {stockOpname.amount}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {convertIDR(stockOpname.hpp_price)}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {/* {stockOpname.supplier?.name} */}
                                                    {stockOpname.supplier?.name || 'N/A'}
                                                </td>
                                                <td>
                                                    {stockOpname.note}
                                                </td>
                                                <td>
                                                    {stockOpname.responsible}
                                                </td>
                                                <td>
                                                    <button className="btn btn-info btn-sm me-3"
                                                        onClick={() => openEditConfirmation(stockOpname.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-danger btn-sm"
                                                        onClick={() => openEditRefund(stockOpname.id)}
                                                    >
                                                        Refund
                                                    </button>
                                                </td>
                                                <td>
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${stockOpname.id}-on`}
                                                            className="form-check-input rounded-circle"
                                                            checked={expNotifState[stockOpname.id] || false}
                                                            onChange={() => handleCheckboxChange(stockOpname.id)}
                                                        />
                                                        <label htmlFor={`checkbox-${stockOpname.id}-on`} className="form-check-label">On</label>
                                                    </div>
                                                    <div className='mt-4'>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${stockOpname.id}-off`}
                                                            className="form-check-input rounded-circle"
                                                            checked={!expNotifState[stockOpname.id]}
                                                            onChange={() => handleCheckboxChange(stockOpname.id)}
                                                        />
                                                        <label htmlFor={`checkbox-${stockOpname.id}-off`} className="form-check-label">Off</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                </tbody>
                                <tbody>
                                    {productHistory.stock_opnames && productHistory.stock_opnames.length > 0 ? (
                                        <>
                                            {productHistory.stock_opnames.map((stockOpname: any) => (
                                                <tr className='text-center' key={stockOpname.id}>
                                                    {/* ... rest of the code */}
                                                </tr>
                                            ))}
                                            <tr className='text-center'>
                                                <td></td>
                                                <td><h2>TOTAL</h2></td>
                                                <td className='text-dark fw-bold'>
                                                    {productHistory.stock_opnames.reduce((total: number, stockOpname: any) => total + parseInt(stockOpname.amount), 0)}
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


                    {/* Edit */}
                    {showEditConfirmation && opnameToEdit !== null && (
                        <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Data</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">HPP:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            // value={newStokOpname.hpp_price}
                                            // onChange={(e) => setNewStokOpname({ ...newStokOpname, hpp_price: parseInt(e.target.value) })}
                                            value={formatCurrency(newStokOpname.hpp_price)}
                                            onChange={(e) => setNewStokOpname({ ...newStokOpname, hpp_price: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Jumlah Masuk:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formatCurrency(newStokOpname.amount)}
                                            onChange={(e) => setNewStokOpname({ ...newStokOpname, amount: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Supplier:</label>
                                        <select
                                            className="form-select"
                                            name="modeProcess"
                                            value={newStokOpname.supplier_id}
                                            onChange={(e) => setNewStokOpname({ ...newStokOpname, supplier_id: e.target.value })}
                                        >
                                            <option value="">Select a category</option>
                                            {supplier.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Catatan:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newStokOpname.note}
                                            onChange={(e) => setNewStokOpname({ ...newStokOpname, note: e.target.value })}

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Penanggung Jawab:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newStokOpname.responsible}
                                            onChange={(e) => setNewStokOpname({ ...newStokOpname, responsible: e.target.value })}

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Tanggal Kadaluarsa:</label>
                                        <input type="date" className="form-control" id="product-name"
                                            value={newStokOpname.expired_date}
                                            onChange={(e) => setNewStokOpname({ ...newStokOpname, expired_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Notif Tanggal Kadaluarsa:</label>
                                        <select
                                            className="form-select"
                                            value={getDaysRemaining(newStokOpname.expired_notif_date)}
                                            onChange={(e) => {
                                                const selectedDays = parseInt(e.target.value);
                                                const currentDate = new Date();
                                                const newExpiredNotifDate = new Date(currentDate.setDate(currentDate.getDate() + selectedDays)).toISOString().split('T')[0];
                                                setNewStokOpname({ ...newStokOpname, expired_notif_days: selectedDays, expired_notif_date: newExpiredNotifDate });
                                            }}
                                        >
                                            {Array.from({ length: 180 }, (_, index) => (
                                                <option key={index + 1} value={index + 1}>{index + 1} hari</option>
                                            ))}

                                        </select>
                                    </div>
                                </form>
                                {validationError && (
                                    <div className="alert alert-danger" role="alert">
                                        {validationError}
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={() => setShowEditConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="info"
                                    onClick={simpanPerubahan}
                                >
                                    Simpan Perubahan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                    {/* REFUND */}
                    {showEditRefund && refundToEdit !== null && (
                        <Modal show={showEditRefund} onHide={() => setShowEditRefund(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Refund Produk</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">Jumlah:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newRefund.amount}
                                            onChange={(e) => setNewRefund({ ...newRefund, amount: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Penaggung Jawab:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newRefund.responsible}
                                            onChange={(e) => setNewRefund({ ...newRefund, responsible: e.target.value })}

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Keterangan:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newRefund.note}
                                            onChange={(e) => setNewRefund({ ...newRefund, note: e.target.value })}

                                        />
                                    </div>
                                    {/* <div className="mb-3">
                                        <label className="col-form-label">Status:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder='status jadikan otomatis keluar'
                                            value={newRefund.status}
                                            onChange={(e) => setNewRefund({ ...newRefund, status: e.target.value })}

                                        />
                                    </div> */}
                                </form>
                                {validationError && (
                                    <div className="alert alert-danger" role="alert">
                                        {validationError}
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={() => setShowEditRefund(false)}>
                                    Batal
                                </Button>
                                <Button variant="info"
                                    onClick={simpanPerubahanRefund}
                                >
                                    Simpan Perubahan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                    <ToastContainer position="top-right" autoClose={2000} />
                    {/* END :: Tabel History Input Stok */}

                    {/* History Repack */}
                    <div className='card pt-6'>
                        <div className=' card-header border-0'>
                            <div className='row gap-4 fw-bold'>
                                <div className=''>
                                    <h1 className='mt-10'>History Repack</h1>
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
                                            <th align='center' className='min-w-30px'>
                                                No
                                            </th>
                                            <th className='min-w-30px'>Nama Produk</th>
                                            <th className='min-w-30px'>Jumlah Masuk</th>
                                            <th className='min-w-30px'>Jumlah Keluar</th>
                                            <th className='min-w-30px'>Tujuan/Asal Produk</th>
                                            <th className='min-w-30px'>Tanggal Repack</th>
                                        </tr>
                                    </thead>
                                    {/* end::Table head */}
                                    {/* begin::Table body */}
                                    <tbody>
                                        {Array.isArray(repack) ? (
                                            repack.map((item, index) => (
                                                <tr key={index} className='text-center'>
                                                    <td align="center">{index + 1}</td>
                                                    <td>
                                                        <button type="button" className="btn btn-text">
                                                            <a
                                                                // onClick={() => openMemberConfirmation(item.id)}
                                                                className='text-dark fw-bold text-hover-primary fs-6'>
                                                                {item.product_name}
                                                            </a>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                            {item.quantity_in}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                            {item.quantity_out}
                                                        </strong>
                                                    </td>
                                                    {/* <td></td> */}
                                                    <td>
                                                        <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                            {item.origin_destination}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <strong className='text-dark text-center fw-bold d-block mb-1 fs-6'>
                                                            {convertDate(item.date)}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <p>Data tidak tersedia</p>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>

                    {/* History Terjual */}
                    <div className='card pt-6'>
                        <div className=' card-header border-0'>
                            <div className='row gap-4 fw-bold'>
                                <div className=''>
                                    <h1 className='mt-10'>History Terjual</h1>
                                </div>
                                <div>
                                    <button className="btn btn-primary" onClick={exportToExcel}>
                                        Export
                                    </button>
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
                                            <th align='center' className='min-w-30px'>
                                                No
                                            </th>
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
                                                        {/* {convertIDR(transactions.transaction?.grand_total || 'N/A')} */}
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
                                                    <td><h2>TOTAL</h2></td>
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
                </div>
                {/* End :: Tabel History Terjual */}



                {/* Tabel History Refund */}
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className=''>
                                <h1 className='mt-10'>History Refund & Produk Keluar / Hilang / Kadaluarsa</h1>
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
                                        {/* <th align='center' className='min-w-30px'>
                                            No
                                        </th> */}
                                        <th className='min-w-30px'>Tanggal</th>
                                        <th className='min-w-30px'>Jumlah</th>
                                        <th className='min-w-30px'>Nominal Harga</th>
                                        <th className='min-w-30px'>Suplier</th>
                                        <th className='min-w-30px'>Keterangan</th>
                                        <th className='min-w-30px'>Penaggung Jawab</th>
                                        <th className='min-w-30px'>Status</th>
                                        {/* <th className='min-w-120px'>No Faktur</th>
                                        <th className='min-w-30px'>Penanggung Jawab</th> */}
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {productHistory.product_refund &&
                                        productHistory.product_refund.map((product_refund: any, index: number) => (
                                            <tr className='text-center' key={product_refund.id}>
                                                {/* <td align="center">{index + 1}</td> */}
                                                <td className='text-dark fw-bold'>
                                                    {formatDate(product_refund.refund_date)}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_refund.total_refund}
                                                </td>

                                                <td className='text-dark fw-bold'>
                                                    {convertIDR(product_refund.nominal)}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_refund.stock_opname?.supplier?.name || 'N/A'}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {/* {stockOpname.supplier?.name} */}
                                                    {product_refund.note}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_refund.responsible}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_refund.status}
                                                </td>

                                            </tr>
                                        ))}
                                    {productHistory.product_expired &&
                                        productHistory.product_expired.map((product_expired: any, index: number) => (
                                            <tr className='text-center' key={product_expired.id}>
                                                {/* <td align="center">{index + 1}</td> */}
                                                <td className='text-dark fw-bold'>
                                                    {formatDate(product_expired.date)}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_expired.total}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {convertIDR(product_expired.nominal)}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_expired.supplier_name}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_expired.note}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {product_expired.responsible}
                                                </td>
                                                <td className='text-dark fw-bold'>
                                                    {/* {product_expired.type} */}
                                                    {product_expired.type === 'out' ? 'keluar' : product_expired.type}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </KTCard>
        </>
    )
}

export default HistoryPage