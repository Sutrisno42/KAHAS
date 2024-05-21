import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { TablesWidget14 } from '../../../_metronic/partials/widgets/tables/TablesWidget14'
import { Button, Modal } from 'react-bootstrap'
import { BsFile, BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { KTCard } from '../../../_metronic/helpers'
import axios from 'axios'
import { addNewKasir, deleteKasir, showKasir, updateKasir } from '../../functions/global/api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL

const MemberPage = () => {
    usePageTitle('Data Kasir');

    const [kasir, setKasir] = useState<any[]>([]);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [kasirToEdit, setKasirToEdit] = useState<number | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [kasirToDelete, setKasirToDelete] = useState<number | null>(null);
    const [showAkunConfirmation, setShowAkunConfirmation] = useState(false);
    const [menejemenToAkun, setMenejemenToAkun] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [newKasir, setNewKasir] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    const openEditConfirmation = (user_id: number) => {
        setKasirToEdit(user_id);
        setShowEditConfirmation(true);
    };

    const openDeleteConfirmation = (user_id: number) => {
        setKasirToDelete(user_id);
        setShowDeleteConfirmation(true);
    };

    const openAkunConfirmation = (id_product: number) => {
        setMenejemenToAkun(id_product);
        setShowAkunConfirmation(true);
    };

    const showData = () => {

        showKasir()
            .then(data => {
                setKasir(data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
        showData();
    }, []);

    useEffect(() => {
        if (showEditConfirmation && kasirToEdit !== null) {
            const selectedKasir = kasir.find((kasir) => kasir.id === kasirToEdit);

            if (selectedKasir) {
                setNewKasir({
                    name: selectedKasir.name,
                    username: selectedKasir.username,
                    email: selectedKasir.email,
                    phone: selectedKasir.phone,
                    password: selectedKasir.password,
                });
            }
        }
    }, [showEditConfirmation, kasirToEdit, kasir]);

    const addKasir = async () => {

        try {

            const response = await addNewKasir({
                name: newKasir.name,
                username: newKasir.username,
                email: newKasir.email,
                phone: newKasir.phone,
                password: newKasir.password,

            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setKasir([...kasir, response.data]);
                toast.success('Data berhasil dibuat', { position: toast.POSITION.TOP_RIGHT });
                setNewKasir({
                    name: '',
                    username: '',
                    email: '',
                    phone: '',
                    password: '',
                });

            } else {
                console.error('Gagal menambahkan data kasir, respons:', response);
                toast.error('Gagal menambahkan data kasir', { position: toast.POSITION.TOP_RIGHT });
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan data kasir:', error);
            toast.error('Data sudah ada sebelumnya', { position: toast.POSITION.TOP_RIGHT });
        }
    };

    const simpanPerubahan = () => {
        if (kasirToEdit !== null) {
            console.log('Product Data:', kasirToEdit, newKasir);
            updateKasir(kasirToEdit, newKasir.name, newKasir.username, newKasir.email, newKasir.phone, newKasir.password)

                .then((response) => {
                    console.log('Data kasir diperbarui:', response);
                    showData();
                    toast.success('Data berhasil diubah', { position: toast.POSITION.TOP_RIGHT });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit data kasir:', error);
                });

            setShowEditConfirmation(false);
        }
    };

    const handleDelete = async (user_id: number) => {
        try {
            const response = await deleteKasir(user_id);

            if (response.status === 200) {
                const updatedKasirData = kasir.filter(item => item.id !== user_id);
                setKasir(updatedKasirData);
                toast.success('Data berhasil dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus data kasir, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus data kasir:', error);
        }
    }

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                name: newKasir.name,
                phone: newKasir.phone,
                email: newKasir.email,
                username: newKasir.username,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/cashier?page=&name=&phone=&email=&username=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setKasir(response.data.data.data);
                    setCurrentPage(pageNumber);
                    setTotalPages(response.data.data.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
        }
    };
    const toggleAktifStatus = async (userId: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;

            const updatedAkunData = kasir.map((akun) => {
                if (akun.user_id === userId) {
                    return { ...akun, is_active: newStatus };
                }
                return akun;
            });

            setKasir(updatedAkunData);

            await axios.post(`${API_URL}/user/${userId}/status`, {
                is_active: newStatus,
            });

            console.log('Status updated successfully');
            window.location.reload();
        } catch (error) {
            console.error('Terjadi kesalahan saat mengubah status:', error);
        }
    };

    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama Kasir</label>
                                <input placeholder='Budi' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewKasir({ ...newKasir, name: e.target.value })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Username</label>
                                <input placeholder='Budi' className='form-control' type='text'
                                    name='statusDeliveryCode'
                                    onChange={(e) => setNewKasir({ ...newKasir, username: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>No HP</label>
                                <input placeholder='08xx' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewKasir({ ...newKasir, phone: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Email</label>
                                <input placeholder='@gmail.com' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewKasir({ ...newKasir, email: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select" name='modeProcess'
                                    value={arrangeBy}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                    required>
                                    <option value="">Pilihan</option>
                                    <option value="name">Nama Kasir</option>
                                    <option value="username">Username</option>
                                    <option value="phone">No HP</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutan</label>
                                <select className="form-select" name='modeProcess'
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
                                    <option value="">Pilihan</option>
                                    <option value="asc">A-Z</option>
                                    <option value="desc">Z-A</option>
                                </select>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={() => handleSearch(1)} >Cari</Button>
                            </div>
                            <div className='col-3 mt-8' data-bs-toggle="modal" data-bs-target="#ModalLabel" data-bs-whatever="@mdo">
                                <Button >Tambah Kasir</Button>
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
                                <tr className='fw-bold text-muted'>
                                    <th align='center' className='min-w-30px'>No</th>
                                    <th className='min-w-150px'>Nama Kasir</th>
                                    <th className='min-w-120px'>Username</th>
                                    <th className='min-w-120px'>No HP</th>
                                    <th className='min-w-120px'>Email</th>
                                    <th className='min-w-120px'>Aksi</th>
                                </tr>
                            </thead>
                            {/* end::Table head */}
                            {/* begin::Table body */}
                            <tbody>
                                {kasir.map((kasir, index) => (
                                    <tr key={index}>
                                        <td align="center">{index + 1}</td>
                                        <td>

                                            <button type="button" className="btn btn-text">
                                                <a onClick={() => openAkunConfirmation(kasir.id)} className='text-dark fw-bold text-hover-primary fs-6'>
                                                    {kasir.name}
                                                </a>
                                            </button>

                                        </td>
                                        <td>
                                            <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                {kasir.username}
                                            </strong>

                                        </td>
                                        <td>
                                            <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                {kasir.phone}
                                            </strong>
                                        </td>
                                        <td>
                                            <strong className='text-dark fw-bold d-block mb-1 fs-6'>
                                                {kasir.email}
                                            </strong>
                                        </td>
                                        <td>
                                            <button className="btn btn-info btn-sm"
                                                onClick={() => openEditConfirmation(kasir.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ms-2"
                                                type="button"
                                                onClick={() => openDeleteConfirmation(kasir.id)}
                                            >
                                                Hapus
                                            </button>
                                            <button
                                                style={{ marginLeft: '5px' }}
                                                className={`btn btn-sm ${kasir.is_active ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => toggleAktifStatus(kasir.id, kasir.is_active)}
                                            >
                                                {kasir.is_active ? 'Non-Aktif' : 'Aktif'}
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
                                        <button className="page-link" onClick={() => handleSearch(currentPage + 1)}>
                                            Selanjutnya                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* end::Table container */}

                    {/* modal */}
                    {showAkunConfirmation && menejemenToAkun !== null && (
                        <Modal show={showAkunConfirmation} onHide={() => setShowAkunConfirmation(false)} size='xl'>
                            <Modal.Header closeButton>
                                <Modal.Title>Detail Data Akun</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-2">
                                        <label className="col-form-label">Nama Kasir:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-4"
                                            value={kasir.find(kasir => kasir.id === menejemenToAkun)?.name || ''}
                                            // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                            disabled
                                        />
                                        <label className="col-form-label">Email:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-4"
                                            value={kasir.find(kasir => kasir.id === menejemenToAkun)?.email || ''}
                                            // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                            disabled
                                        />
                                        <label className="col-form-label">Phone:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-4"
                                            value={kasir.find(kasir => kasir.id === menejemenToAkun)?.phone || ''}
                                            disabled
                                        />
                                        <label className="col-form-label">Role:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-4"
                                            value={kasir.find(kasir => kasir.id === menejemenToAkun)?.role || ''}
                                            disabled
                                        />

                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>
                    )}

                    {/* Alert Tambah Kasir */}
                    <div className="modal fade" id="ModalLabel" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel" >Tambah Kasir</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="col-form-label">Nama Kasir:</label>
                                            <input type="text" placeholder="Masukkan nama kasir" className="form-control" id="product-name"
                                                value={newKasir.name}
                                                onChange={(e) => setNewKasir({ ...newKasir, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">Username:</label>
                                            <input type="text" placeholder="Masukkan username" className="form-control"
                                                value={newKasir.username}
                                                onChange={(e) => setNewKasir({ ...newKasir, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">Email:</label>
                                            <input type="email" placeholder="Masukkan email" className="form-control"
                                                value={newKasir.email}
                                                onChange={(e) => setNewKasir({ ...newKasir, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">No HP:</label>
                                            <input type="text" placeholder="Masukkan no hp" className="form-control "

                                                value={newKasir.phone}
                                                onChange={(e) => setNewKasir({ ...newKasir, phone: e.target.value })}

                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">Password:</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Masukkan password"
                                                    className="form-control"
                                                    required
                                                    value={newKasir.password}
                                                    onChange={(e) => setNewKasir({ ...newKasir, password: e.target.value })}
                                                />
                                                <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                                                </span>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                        onClick={addKasir}
                                    >Simpan</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit */}
                    {showEditConfirmation && kasirToEdit !== null && (
                        <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Data</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">Nama Kasir:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newKasir.name}
                                            onChange={event => setNewKasir({ ...newKasir, name: event.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newKasir.username}
                                            onChange={event => setNewKasir({ ...newKasir, username: event.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={newKasir.email}
                                            onChange={event => setNewKasir({ ...newKasir, email: event.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">No HP:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newKasir.phone}
                                            onChange={event => setNewKasir({ ...newKasir, phone: event.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Password:</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Masukkan password"
                                                className="form-control"
                                                required
                                                value={newKasir.password}
                                                onChange={(e) => setNewKasir({ ...newKasir, password: e.target.value })}
                                            />
                                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="danger" onClick={simpanPerubahan}>
                                    Setuju
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                    {showDeleteConfirmation && kasirToDelete !== null && (
                        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Apakah yakin anda ingin menghapus?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    handleDelete(kasirToDelete);
                                    setShowDeleteConfirmation(false);
                                }}>
                                    Setuju
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                    <ToastContainer position="top-right" autoClose={2000} />
                </div>
            </KTCard>
        </>
    )
}

export default MemberPage