import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import SearchDropdown from '../cassier/components/SearchDropdown'
import { addPredik, deletePredik, getSearchData2, showProducts, updatedPredik } from '../../functions/global/api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

interface Product {
    id: number;
    product_name: string;
}

// const API_URL = process.env.REACT_APP_API_URL

const KelPenjualan = () => {
    usePageTitle('Kelola Penjualan Produk');

    const [predik, setPredik] = useState<any[]>([]);
    const [produk, setProduk] = useState<Product[]>([]);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [predikToEdit, setPredikToEdit] = useState<number | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [predikToDelete, setPredikToDelete] = useState<number | null>(null);
    const [newPredik, setNewPredik] = useState({
        nama_produk: '',
        data1: 0,
        data2: 0,
        data3: 0,
        data4: 0,
        data5: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const showData = () => {
        getSearchData2()
            .then(data => {
                setPredik(data);
            })
    };
    useEffect(() => {
        showData();

        showProducts().then((data) => {
            setProduk(data);
        });
    }, []);

    useEffect(() => {
        if (showEditConfirmation && predikToEdit !== null) {
            const selectedPredik = predik.find((predik) => predik.id === predikToEdit);

            if (selectedPredik) {
                setNewPredik({
                    nama_produk: selectedPredik.nama_produk,
                    data1: selectedPredik.data1,
                    data2: selectedPredik.data2,
                    data3: selectedPredik.data3,
                    data4: selectedPredik.data4,
                    data5: selectedPredik.data5
                });
            }
        }

    }, [showEditConfirmation, predikToEdit, predik]);

    const addPrediksi = async () => {
        // Validasi input
        if (
            !newPredik.nama_produk ||
            newPredik.data1 === 0 ||
            newPredik.data2 === 0 ||
            newPredik.data3 === 0 ||
            newPredik.data4 === 0 ||
            newPredik.data5 === 0
        ) {
            toast.error('Form harus diisi semua');
            return;
        }

        try {
            const response = await addPredik({
                nama_produk: newPredik.nama_produk,
                data1: newPredik.data1,
                data2: newPredik.data2,
                data3: newPredik.data3,
                data4: newPredik.data4,
                data5: newPredik.data5,
            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setPredik([...predik, response.data]);
                toast.success('Data Penjualan Produk berhasil ditambah', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setNewPredik({
                    nama_produk: '',
                    data1: 0,
                    data2: 0,
                    data3: 0,
                    data4: 0,
                    data5: 0,
                });
            } else {
                console.error('Gagal menambahkan data, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan data:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deletePredik(id);

            if (response.status === 200) {
                const updatedPrediksi = predik.filter(item => item.id !== id);
                setPredik(updatedPrediksi);
                toast.success('Data telah dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus data, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus data:', error);
        }
    }

    const simpanPerubahan = () => {
        if (predikToEdit !== null) {
            console.log('Product Data:', predikToEdit, newPredik);
            updatedPredik(predikToEdit,
                newPredik.nama_produk,
                newPredik.data1,
                newPredik.data2,
                newPredik.data3,
                newPredik.data4,
                newPredik.data5,
            )
                .then((response) => {
                    console.log('Produk diperbarui:', response);
                    showData();
                    toast.success('Kategori telah diubah', { position: toast.POSITION.TOP_RIGHT });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit produk:', error);
                });

            setShowEditConfirmation(false);
        }
    };

    const openEditConfirmation = (id: number) => {
        setPredikToEdit(id);
        setShowEditConfirmation(true);
    };

    const openDeleteConfirmation = (id: number) => {
        setPredikToDelete(id);
        setShowDeleteConfirmation(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = predik.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(predik.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className='card-header m-grid-responsive-xs gap-1 fw-bold'>
                        <div className='col-3 mt-3 my-5' data-bs-toggle="modal" data-bs-target="#ModalLabel" data-bs-whatever="@mdo">
                            <Button className='m-grid-responsive-xs'>Tambah</Button>
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
                                    <tr className='fw-bold text-muted'>
                                        <th align='center' className='min-w-30px'>No</th>
                                        <th className='min-w-300px'>Nama Produk</th>
                                        <th className='min-w-200px text-center'>Penjualan Bulan 1</th>
                                        <th className='min-w-200px text-center'>Penjualan Bulan 2</th>
                                        <th className='min-w-200px text-center'>Penjualan Bulan 3</th>
                                        <th className='min-w-200px text-center'>Penjualan Bulan 4</th>
                                        <th className='min-w-200px text-center'>Penjualan Bulan 5</th>
                                        <th className='min-w-150px'>Aksi</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={index}>
                                                <td align="center">{index + 1}</td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {item.nama_produk}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6 text-center '>
                                                        {item.data1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6 text-center'>
                                                        {item.data2}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6 text-center'>
                                                        {item.data3}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6 text-center'>
                                                        {item.data4}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6 text-center'>
                                                        {item.data5}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="btn btn-info btn-sm"
                                                        onClick={() => openEditConfirmation(item.id)}
                                                    >Edit</button>
                                                    <span>  </span>
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => openDeleteConfirmation(item.id)}
                                                    >Hapus</button>
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
                        {/* Pagination */}
                        <ul className="pagination justify-content-end">
                            {/* Tombol Previous */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>
                            </li>

                            {/* List halaman */}
                            {pageNumbers.map((number) => (
                                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(number)}>
                                        {number}
                                    </button>
                                </li>
                            ))}

                            {/* Tombol Next */}
                            <li className={`page-item ${currentPage === Math.ceil(predik.length / itemsPerPage) ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(predik.length / itemsPerPage)}>
                                    Next
                                </button>
                            </li>
                        </ul>


                        {/* Alert Tambah Kategori */}
                        <div className="modal fade" id="ModalLabel" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel" >Kelola Penjualan</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="col-form-label">Produk:</label>
                                                <select
                                                    className="form-select"
                                                    name="modeProcess"
                                                    value={newPredik.nama_produk}
                                                    onChange={(e) => setNewPredik({ ...newPredik, nama_produk: e.target.value })}
                                                >
                                                    <option value="">Pilih Produk</option>
                                                    {produk.map((produk) => (
                                                        <option key={produk.product_name} value={produk.product_name}>
                                                            {produk.product_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Penjualan Bulan 1:</label>
                                                <input type="quantity" className="form-control" min={0}
                                                    value={newPredik.data1 || '0'}
                                                    onChange={(e) => setNewPredik({ ...newPredik, data1: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Penjualan Bulan 2:</label>
                                                <input type="quantity" className="form-control" min={0}
                                                    value={newPredik.data2 || '0'}
                                                    onChange={(e) => setNewPredik({ ...newPredik, data2: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Penjualan Bulan 3:</label>
                                                <input type="quantity" className="form-control" min={0}
                                                    value={newPredik.data3 || '0'}
                                                    onChange={(e) => setNewPredik({ ...newPredik, data3: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Penjualan Bulan 4:</label>
                                                <input type="quantity" className="form-control" min={0}
                                                    value={newPredik.data4 || '0'}
                                                    onChange={(e) => setNewPredik({ ...newPredik, data4: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Penjualan Bulan 5:</label>
                                                <input type="quantity" className="form-control" min={0}
                                                    value={newPredik.data5 || '0'}
                                                    onChange={(e) => setNewPredik({ ...newPredik, data5: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                            onClick={addPrediksi}
                                        >Tambah</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Alert Tambah Kategori */}
                    </div>
                </div>

                {/* Edit */}
                {showEditConfirmation && predikToEdit !== null && (
                    <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label className="col-form-label">Produk:</label>
                                    <select
                                        className="form-select"
                                        name="modeProcess"
                                        value={newPredik.nama_produk}
                                        onChange={(e) => setNewPredik({ ...newPredik, nama_produk: e.target.value })}
                                    >
                                        <option value="">Pilih Produk</option>
                                        {produk.map((produk) => (
                                            <option key={produk.product_name} value={produk.product_name}>
                                                {produk.product_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Penjualan Bulan 1:</label>
                                    <input type="quantity" className="form-control" min={0}
                                        value={newPredik.data1 || '0'}
                                        onChange={(e) => setNewPredik({ ...newPredik, data1: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Penjualan Bulan 2:</label>
                                    <input type="quantity" className="form-control" min={0}
                                        value={newPredik.data2 || '0'}
                                        onChange={(e) => setNewPredik({ ...newPredik, data2: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Penjualan Bulan 3:</label>
                                    <input type="quantity" className="form-control" min={0}
                                        value={newPredik.data3 || '0'}
                                        onChange={(e) => setNewPredik({ ...newPredik, data3: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Penjualan Bulan 4:</label>
                                    <input type="quantity" className="form-control" min={0}
                                        value={newPredik.data4 || '0'}
                                        onChange={(e) => setNewPredik({ ...newPredik, data4: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Penjualan Bulan 5:</label>
                                    <input type="quantity" className="form-control" min={0}
                                        value={newPredik.data5 || '0'}
                                        onChange={(e) => setNewPredik({ ...newPredik, data5: parseInt(e.target.value) })}
                                    />
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditConfirmation(false)}>
                                Batal
                            </Button>
                            <Button variant="primary" onClick={simpanPerubahan}>
                                Simpan Perubahan
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                {/* Delete */}
                {showDeleteConfirmation && predikToDelete !== null && (
                    <div>
                        <div className="modal-backdrop fade show"></div>
                        <div className="modal fade show" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteConfirmationModalLabel">
                                            Apakah yakin anda ingin menghapus?
                                        </h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowDeleteConfirmation(false)}></button>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowDeleteConfirmation(false)}>
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                handleDelete(predikToDelete);
                                                setShowDeleteConfirmation(false);
                                            }}
                                        >
                                            Setuju
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer position="top-right" autoClose={2000} />
            </KTCard>
        </>
    )
}

export default KelPenjualan