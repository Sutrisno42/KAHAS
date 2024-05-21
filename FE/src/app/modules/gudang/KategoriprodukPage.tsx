import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import SearchDropdown from '../cassier/components/SearchDropdown'
import { addCategory, addNewUnit, deleteCategory, deleteUnit, fetchCategories, showUnit, updateCategory, updateUnit } from '../../functions/global/api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const KategoriProdukPage = () => {
    usePageTitle('Kategori Produk');

    const [category, setCategory] = useState<any[]>([]);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<number | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [unit, setUnit] = useState<any[]>([]);
    const [showEditUnit, setShowEditUnit] = useState(false);
    const [unitToEdit, setUnitToEdit] = useState<number | null>(null);
    const [showDeleteUnit, setShowDeleteUnit] = useState(false);
    const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
    // const [showCategoryConfirmation, setShowCategoryConfirmation] = useState(false);
    // const [categoryToCategory, setCategoryToCategory] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState({
        category_name: '',
        code: '',

    });
    const [newUnit, setNewUnit] = useState({
        unit_name: '',
        unit_value: 0,

    });

    const showData = () => {
        fetchCategories()
            .then(data => {
                setCategory(data);
            })
    };
    useEffect(() => {
        showUnit().then((data) => {

            setUnit(data);
        });

        showData();
    }, []);

    useEffect(() => {
        if (showEditConfirmation && categoryToEdit !== null) {
            const selectedSupplier = category.find((category) => category.id === categoryToEdit);

            if (selectedSupplier) {
                setNewCategory({
                    category_name: selectedSupplier.category_name,
                    code: selectedSupplier.code,
                });
            }
        }

    }, [showEditConfirmation, categoryToEdit, category]);

    const addProduct = async () => {

        try {

            const response = await addCategory({
                category_name: newCategory.category_name,
                code: newCategory.code,

            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setCategory([...category, response.data]);
                toast.success('Kategori telah ditambah', { position: toast.POSITION.TOP_RIGHT });
                setNewCategory({
                    category_name: '',
                    code: '',
                });

            } else {
                console.error('Gagal menambahkan produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan produk:', error);
        }
    };

    const addUnit = async () => {

        try {

            const response = await addNewUnit({
                unit_name: newUnit.unit_name,
                unit_value: newUnit.unit_value,
            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setUnit([...unit, response.data]);
                toast.success('Unit telah ditambah', { position: toast.POSITION.TOP_RIGHT });
                setNewUnit({
                    unit_name: '',
                    unit_value: 0,
                });

            } else {
                console.error('Gagal menambahkan produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan produk:', error);
        }
    };


    const handleDelete = async (category_id: number) => {
        try {
            const response = await deleteCategory(category_id);

            if (response.status === 200) {
                const updatedCategory = category.filter(item => item.id !== category_id);
                setCategory(updatedCategory);
                toast.success('Kategori telah dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus produk:', error);
        }
    }

    const handleDeleteUnit = async (unit_id: number) => {
        try {
            const response = await deleteUnit(unit_id);

            if (response.status === 200) {
                const updatedUnit = unit.filter(item => item.id !== unit_id);
                setUnit(updatedUnit);
                toast.success('Unit telah dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus produk:', error);
        }
    }

    const simpanPerubahanKategori = () => {
        if (categoryToEdit !== null) {
            console.log('Product Data:', categoryToEdit, newCategory);
            updateCategory(categoryToEdit,
                newCategory.category_name,
                newCategory.code,

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

    const simpanPerubahanUnit = () => {
        if (unitToEdit !== null) {
            console.log('Unit Data:', unitToEdit, newUnit);
            updateUnit(unitToEdit,
                newUnit.unit_name,
                newUnit.unit_value,

            )
                .then((response) => {
                    console.log('Unit diperbarui:', response);
                    window.location.reload();
                    toast.success('Unit telah diubah', { position: toast.POSITION.TOP_RIGHT });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit produk:', error);
                });

            setShowEditUnit(false);
        }
    };

    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                category_name: newCategory.category_name,
                code: newCategory.code,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/master/category?category_name=&code=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setCategory(response.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };

    const openEditConfirmation = (category_id: number) => {
        setCategoryToEdit(category_id);
        setShowEditConfirmation(true);
    };

    const openDeleteConfirmation = (category_id: number) => {
        setCategoryToDelete(category_id);
        setShowDeleteConfirmation(true);
    };

    const openEditUnit = (unit_id: number) => {
        setUnitToEdit(unit_id);
        setShowEditUnit(true);
    };

    const openDeleteUnit = (unit_id: number) => {
        setUnitToDelete(unit_id);
        setShowDeleteUnit(true);
    };

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className='card-header m-grid-responsive-xs gap-1 fw-bold'>
                        <div className='col-3'>
                            <label className='mb-2'>Nama Kategori</label>
                            <input placeholder='Masukkan nama kategori' className='form-control' type='text'
                                name='search'
                                onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })} />
                        </div>
                        <div className='col-3'>
                            <label className='mb-2'>Kode Kategori</label>
                            <input placeholder='Masukkan kode kategori' className='form-control' type='text'
                                name='search'
                                onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })} />
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
                        <div className='col-2 mt-8'>
                            <Button className='m-grid-responsive-xs' onClick={() => handleSearch(1)} >Cari</Button>
                        </div>
                        <div className='col-3 mt-3 my-5' data-bs-toggle="modal" data-bs-target="#ModalLabel" data-bs-whatever="@mdo">
                            <Button className='m-grid-responsive-xs'>Tambah Kategori</Button>
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
                                        <th className='min-w-150px'>Nama Kategori</th>
                                        <th className='min-w-140px'>Kode Kategori</th>
                                        <th className='min-w-120px'>Aksi</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {Array.isArray(category) ? (
                                        category.map((item, index) => (
                                            <tr key={index}>
                                                <td align="center">{index + 1}</td>
                                                <td>
                                                    <button type="button" className="btn btn-text">
                                                        <a
                                                            // onClick={() => openProdukConfirmation(item.id)}
                                                            className='text-dark fw-bold text-hover-primary fs-6'>
                                                            {item.category_name}
                                                        </a>
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {item.code}
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

                        {/* Alert Tambah Kategori */}
                        <div className="modal fade" id="ModalLabel" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel" >Tambah Kategori</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="col-form-label">Nama Kategori:</label>
                                                <input type="text" placeholder="Masukkan nama Kategori" className="form-control" id="product-name"
                                                    value={newCategory.category_name}
                                                    onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Kode Kategori:</label>
                                                <input type="text" placeholder="Masukkan kode Kategori" className="form-control" id="product-name"
                                                    value={newCategory.code}
                                                    onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                            onClick={addProduct}
                                        >Tambah Stok</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="deleteModal" aria-labelledby="deleteModal" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Hapus Produk</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Anda ingin menghapus Stok Ini ?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Alert Tambah Kategori */}

                    </div>
                </div>

                {/* Edit */}
                {showEditConfirmation && categoryToEdit !== null && (
                    <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label className="col-form-label">Nama Kategori:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newCategory.category_name}
                                        onChange={event => setNewCategory({ ...newCategory, category_name: event.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Kode Kategori:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newCategory.code}
                                        onChange={event => setNewCategory({ ...newCategory, code: event.target.value })}
                                    />
                                </div>

                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditConfirmation(false)}>
                                Batal
                            </Button>
                            <Button variant="primary" onClick={simpanPerubahanKategori}>
                                Simpan Perubahan
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                {/* Delete */}
                {showDeleteConfirmation && categoryToDelete !== null && (
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
                                                handleDelete(categoryToDelete);
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

            {/* SET UNIT */}
            <KTCard className='mt-20'>
                <div className='card pt-6'>
                    <div className='card-header m-grid-responsive-xs gap-1'>
                        <div className='col-3 mt-3 my-5' data-bs-toggle="modal" data-bs-target="#ModalUnit" data-bs-whatever="@mdo">
                            <Button className='m-grid-responsive-xs'>Tambah Unit</Button>
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
                                        <th className='min-w-150px'>Nama Unit</th>
                                        <th className='min-w-140px'>Jumlah Unit</th>
                                        <th className='min-w-120px'>Aksi</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {Array.isArray(unit) ? (
                                        unit.map((item, index) => (
                                            <tr key={index}>
                                                <td align="center">{index + 1}</td>
                                                <td>
                                                    <button type="button" className="btn btn-text">
                                                        <a
                                                            // onClick={() => openProdukConfirmation(item.id)}
                                                            className='text-dark fw-bold text-hover-primary fs-6'>
                                                            {item.unit_name}
                                                        </a>
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {item.unit_value}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="btn btn-info btn-sm"
                                                        onClick={() => openEditUnit(item.id)}
                                                    >Edit</button>
                                                    <span>  </span>
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => openDeleteUnit(item.id)}
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
                        {/* pagination */}
                        {/* <div className='row'>
                            <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
                            <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
                                <div aria-label="..." id='kt_table_users_paginate'>
                                    <ul className="pagination">
                                        
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => handleSearch(currentPage - 1)} disabled={currentPage === 1}>
                                                Previous
                                            </button>
                                        </li>

                                        
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <a className="page-link" onClick={() => handleSearch(index + 1)}>
                                                    {index + 1}
                                                </a>
                                            </li>
                                        ))}

                                       
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => handleSearch(currentPage + 1)} disabled={currentPage === totalPages}>
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}
                        {/* end::Table container */}

                        {/* Alert Tambah Unit */}
                        <div className="modal fade" id="ModalUnit" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel" >Tambah Unit</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="col-form-label">Nama Unit:</label>
                                                <input type="text" placeholder="Masukkan nama Unit" className="form-control" id="product-name"
                                                    value={newUnit.unit_name}
                                                    onChange={(e) => setNewUnit({ ...newUnit, unit_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Jumlah Unit:</label>
                                                <input type="text" placeholder="" className="form-control" id="product-name"
                                                    value={newUnit.unit_value}
                                                    onChange={(e) => setNewUnit({ ...newUnit, unit_value: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                            onClick={addUnit}
                                        >Simpan</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Alert Tambah Unit */}

                    </div>
                </div>

                {/* Edit Unit*/}
                {showEditUnit && unitToEdit !== null && (
                    <Modal show={showEditUnit} onHide={() => setShowEditUnit(false)} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label className="col-form-label">Nama Unit:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newUnit.unit_name}
                                        onChange={event => setNewUnit({ ...newUnit, unit_name: event.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Jumlah Unit:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newUnit.unit_value}
                                        onChange={(e) => setNewUnit({ ...newUnit, unit_value: parseInt(e.target.value) })}
                                    />
                                </div>

                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditUnit(false)}>
                                Batal
                            </Button>
                            <Button variant="primary" onClick={simpanPerubahanUnit}>
                                Simpan Perubahan
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                {/* Delete Unit */}
                {showDeleteUnit && unitToDelete !== null && (
                    <div>
                        <div className="modal-backdrop fade show"></div>
                        <div className="modal fade show" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteConfirmationModalLabelUnit">
                                            Apakah yakin anda ingin menghapus unit ini?
                                        </h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowDeleteUnit(false)}></button>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowDeleteUnit(false)}>
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                handleDeleteUnit(unitToDelete);
                                                setShowDeleteUnit(false);
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

export default KategoriProdukPage