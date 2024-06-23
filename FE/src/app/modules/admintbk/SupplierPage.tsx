import React, { useEffect, useState } from 'react';
import usePageTitle from '../../functions/global/usePageTitle';
import { addSupplier, deleteSupplier, showSupplier, showSupplierDetail, updateSupplier } from '../../functions/global/api';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { KTCard } from '../../../_metronic/helpers';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { end } from '@popperjs/core';

const API_URL = process.env.REACT_APP_API_URL

type supplier = {
    name: string;
    phone: string;
    products?: Product[];
};
type Product = {
    id: number;
    category_id: number;
    product_name: string;
    product_code: string;
    stock: number;
    price: number;
    discount: number;
    pivot: {
        supplier_id: number;
        product_id: number;
    };
    stock_opnames: StockOpname[];
};

type StockOpname = {
    id: number;
    product_id: number;
    supplier_id: number;
    amount: number;
    hpp_price: number;
    faktur_number: string;
    faktur_date: string;
    expired_date: string;
    expired_notif_date: string;
    note: string;
    responsible: string;
    exp_notif: boolean;
    is_approved: boolean;
};

const SupplierPage = () => {
    usePageTitle('Data Supplier');

    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newSupplier, setNewSupplier] = useState<supplier>({
        name: '',
        phone: '',
    });
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState<number | null>(null);
    const [showProdukConfirmation, setShowProdukConfirmation] = useState(false);
    const [supplierToProduk, setSupplierToProduk] = useState<number | null>(null);
    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                name: newSupplier.name,
                phone: newSupplier.phone,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/supplier?page=&name=&phone&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setSuppliers(response.data.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };

    const openDeleteConfirmation = (id_supplier: number) => {
        setSupplierToDelete(id_supplier);
        setShowDeleteConfirmation(true);
    };
    const openEditConfirmation = (id_supplier: number) => {
        setSupplierToEdit(id_supplier);
        setShowEditConfirmation(true);
        const selectedSupplier = suppliers.find((supplier) => supplier.id === id_supplier);

        if (selectedSupplier) {
            setNewSupplier({
                name: selectedSupplier.name,
                phone: selectedSupplier.phone,
            });
        }
    };

    // const openProdukConfirmation = (id_supplier: number) => {
    //     setSupplierToProduk(id_supplier);
    //     setShowProdukConfirmation(true);
    // };

    const [supplierName, setSupplierName] = useState<string>('');
    const [productsData, setProductsData] = useState<any[]>([]);
    const [supplierData, setSupplierData] = useState<supplier | null>(null);

    const openProdukConfirmation = (id_supplier: number) => {
        setSupplierToProduk(id_supplier);
        setShowProdukConfirmation(true);

        // Mengambil data pemasok dari API
        axios.get(`${API_URL}/supplier/${id_supplier}`)
            .then(response => {
                const supplierData = response.data.data;
                setSupplierData(supplierData); // Menyimpan data pemasok ke dalam state
            })
            .catch(error => {
                console.error('Error fetching supplier data:', error);
            });
    };


    const showData = () => {
        showSupplier()
            .then(data => {
                setSuppliers(data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
        showData();
    }, []);

    useEffect(() => {
        if (showEditConfirmation && supplierToEdit !== null) {
            const selectedSupplier = suppliers.find((supplier) => supplier.id === supplierToEdit);

            if (selectedSupplier) {
                setNewSupplier({
                    name: selectedSupplier.name,
                    phone: selectedSupplier.phone,
                });
            }
        }
    }, [showEditConfirmation, supplierToEdit, suppliers]);

    const handleDeleteSupplier = async (id_supplier: number) => {
        try {
            const response = await deleteSupplier(id_supplier);

            if (response.status === 200) {
                const updatedSupplierData = suppliers.filter(item => item.id !== id_supplier);
                setSuppliers(updatedSupplierData);
                toast.success('Data telah dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus produk:', error);
        }
    }

    const simpanPerubahanSupplier = () => {
        if (!newSupplier.name || !newSupplier.phone) {
            setValidationError('Tolong isi semua kolom');
            return;
        }

        setValidationError(null);

        if (supplierToEdit !== null) {
            const existingSupplier = suppliers.find((supplier) => supplier.id === supplierToEdit);

            if (existingSupplier) {
                setNewSupplier({
                    name: existingSupplier.name,
                    phone: existingSupplier.phone,
                });

                updateSupplier(supplierToEdit, newSupplier.name, newSupplier.phone)
                    .then((response) => {
                        console.log('Supplier diperbarui:', response);
                        showData();
                        setShowEditConfirmation(false);

                        // Show animated success alert
                        toast.success('Data berhasil diubah', { position: toast.POSITION.TOP_RIGHT });
                    })
                    .catch((error) => {
                        console.error('Kesalahan mengedit supplier:', error);
                    });
            }
        }
    };

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewSupplier({
            ...newSupplier,
            [name]: value,
        });
    };

    const handleAddSupplier = () => {
        const { name, phone } = newSupplier;
        if (!name || !phone) {
            setValidationError('Tolong isi semua kolom');
            return;
        }
        setValidationError(null);
        addSupplier(name, phone)
            .then((response) => {
                console.log('Supplier added:', response);
                setNewSupplier({
                    name: '',
                    phone: '',
                });
                handleToggleForm();
                showData();
                toast.success('Data telah ditambah', { position: toast.POSITION.TOP_RIGHT });
            })
            .catch((error) => {
                console.error('Error adding supplier:', error);
            });
    };
    const exportToExcel = () => {
        if (supplierData && supplierData.products) {
            const uniqueProducts: Product[] = [];
            const uniqueSupplierName: string[] = [];
            supplierData.products.forEach((product: Product) => {
                if (!uniqueProducts.some((item) => item.product_name === product.product_name)) {
                    uniqueProducts.push(product);
                }
            });
            if (!uniqueSupplierName.includes(supplierData.name)) {
                uniqueSupplierName.push(supplierData.name);
            }
            const dataToExport = uniqueProducts.map((product: Product) => ({
                "Nama Supplier": supplierData.name,
                "Produk": product.product_name,
                "Stok": product.stock
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
            XLSX.writeFile(wb, 'exported_data.xlsx');
        } else {
            console.error("Tidak ada data produk yang tersedia untuk diekspor.");
        }
    };


    return (
        <>
            <KTCard>
                <div className="container">
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama Supplier</label>
                                <input placeholder='...' className='form-control' type='text'
                                    name='search'
                                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>No HP</label>
                                <input placeholder='08xx' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
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
                                    <option value="">Pilihan</option>
                                    <option value='name'>Nama Supplier</option>
                                    <option value="phone">No HP</option>
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
                                <Button onClick={() => handleSearch(1)}>Cari</Button>
                                {/* <Button onClick={exportToExcel} className='bi bi-printer ms-3'><span> Ekspor </span> </Button> */}
                            </div>

                            <div className='col-8 mt-6'>
                                <div className=' mb-2'>
                                    {showForm ? (
                                        <div className="card p-4 shadow bg-white">
                                            <label htmlFor="nama">Nama Supplier</label>
                                            <input
                                                type="text"
                                                id="nama"
                                                name="name"
                                                value={newSupplier.name}
                                                className="form-control mb-2"
                                                onChange={handleInputChange}
                                            />

                                            <label htmlFor="fullname">No HP</label>
                                            <input
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                value={newSupplier.phone}
                                                className="form-control mb-2"
                                                onChange={handleInputChange}
                                            />
                                            {validationError && (
                                                <div className="alert alert-danger" role="alert">
                                                    {validationError}
                                                </div>
                                            )}
                                            <div className='d-flex mt-2'>
                                                <button
                                                    className='col-6 btn btn-secondary me-2'
                                                    onClick={handleToggleForm}
                                                >
                                                    Tutup
                                                </button>
                                                <button
                                                    className=' col-6 btn btn-primary '
                                                    onClick={handleAddSupplier}
                                                >
                                                    Simpan
                                                </button>

                                            </div>

                                        </div>
                                    ) : (
                                        <button
                                            className='btn btn-primary mt-2'
                                            onClick={() => {
                                                setValidationError(null);
                                                handleToggleForm();
                                            }}
                                        >
                                            Tambah Suplier
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' container-fluid border-0 mt-4 mb-3 bg-white '>
                        <div className='table-responsive'>
                            <table className='table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                <thead>
                                    <tr className='fw-bold text-muted'>
                                        <th className='min-w-30px'>No</th>
                                        <th className='min-w-150px'>Nama Supplier</th>
                                        <th className='min-w-125px'>No HP</th>
                                        <th className='min-w-125px'>Daftar Produk</th>
                                        <th className='min-w-80px'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((supplier, index) => (
                                        <tr key={index}>
                                            <td align="center">{index + 1}</td>
                                            <td >
                                                <strong className='text-dark fw-semibold d-block mb-1 fs-6'>
                                                    {supplier.name}
                                                </strong>
                                            </td>
                                            <td>
                                                <strong className='text-dark fw-semibold d-block mb-1 fs-6'>
                                                    {supplier.phone}
                                                </strong>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-text"
                                                >
                                                    <a className="text-dark fw-bold text-hover-primary fs-6"
                                                        onClick={() => openProdukConfirmation(supplier.id)}
                                                    >
                                                        Lihat Produk
                                                    </a>
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-info btn-sm"
                                                    onClick={() => openEditConfirmation(supplier.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm ms-2"
                                                    type="button"
                                                    onClick={() => openDeleteConfirmation(supplier.id)}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
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
                    {showProdukConfirmation && supplierToProduk !== null && (
                        <Modal show={showProdukConfirmation} onHide={() => setShowProdukConfirmation(false)} size="xl">
                            <Modal.Header closeButton>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                                        <Modal.Title>Produk Data</Modal.Title>
                                    </div>
                                    <div>
                                        <Button onClick={exportToExcel} className='bi bi-printer me-20'><span> Ekspor </span> </Button>
                                    </div>
                                </div>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder='namaSupplier'
                                            value={supplierData?.name || ''}
                                            disabled
                                        />

                                        <label className="col-form-label col-6">Produk:</label>
                                        <label className="col-form-label col-6">Stok:</label>
                                        {supplierData?.products &&
                                            supplierData.products
                                                .filter((product, index, self) => self.findIndex(p => p.product_name === product.product_name) === index) // Menyaring nama produk yang unik
                                                .map((product, index) => (
                                                    <div key={index} className="mb-3">
                                                        <div className="d-flex mb-3">
                                                            <div className="col-6 mb-1 me-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={product.product_name}
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className='col-6'>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={product.stock}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>
                    )}

                    {/* Edit */}
                    {showEditConfirmation && supplierToEdit !== null && (
                        <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Data</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">Nama Supplier:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newSupplier.name}
                                            onChange={event => setNewSupplier({ ...newSupplier, name: event.target.value })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="col-form-label">No HP:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newSupplier.phone}
                                            onChange={event => setNewSupplier({ ...newSupplier, phone: event.target.value })}
                                        />
                                    </div>
                                </form>
                                {validationError && (
                                    <div className="alert alert-danger" role="alert">
                                        {validationError}
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="info"
                                    onClick={simpanPerubahanSupplier}
                                >
                                    Simpan Perubahan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                    <ToastContainer position="top-right" autoClose={2000} />



                    {/* Delete */}
                    {showDeleteConfirmation && supplierToDelete !== null && (
                        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Apakah yakin anda ingin menghapus?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    handleDeleteSupplier(supplierToDelete);
                                    setShowDeleteConfirmation(false);
                                }}>
                                    Setuju
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}


                </div>
            </KTCard>
        </>
    )
}

export default SupplierPage;
