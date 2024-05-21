import React, { useState, useEffect } from 'react';
import usePageTitle from '../../functions/global/usePageTitle';
import { addNewAkun, deleteAccount, showAkun, toggleActiveStatus, updateAccount } from '../../functions/global/api';
import { Button, Modal } from 'react-bootstrap';
import { BsFile, BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL

const ManagementAccountPage = () => {
    usePageTitle('Manajemen Akun');

    const [show, setShow] = useState(false);
    const [akun, setAkun] = useState<any[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [akunToEdit, setAkunToEdit] = useState<number | null>(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [akunToDelete, setAkunToDelete] = useState<number | null>(null);
    const [showAkunConfirmation, setShowAkunConfirmation] = useState(false);
    const [menejemenToAkun, setMenejemenToAkun] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [newAkun, setNewAkun] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
        phone: '',
        role: '',
    });



    const showData = () => {
        showAkun()
            .then(data => {
                setAkun(data);
            })
            .catch(error => {
                console.error('Error fetching akun:', error);
            });
    };

    useEffect(() => {
        showData();
    }, []);

    useEffect(() => {
        if (showEditConfirmation && akunToEdit !== null) {
            const selectedAkun = akun.find((akun) => akun.id === akunToEdit);

            if (selectedAkun) {
                setNewAkun({
                    name: selectedAkun.name,
                    email: selectedAkun.email,
                    password: selectedAkun.password,
                    username: selectedAkun.username,
                    phone: selectedAkun.phone,
                    role: selectedAkun.role,
                });
            }
        }
    }, [showEditConfirmation, akunToEdit, akun]);

    const handleshow = () => {
        setShow(!show)
    }

    const addAccount = async () => {
        const { name, email, password, username, phone, role } = newAkun;
        if (!name || !email || !password || !username || !phone || !role) {
            setValidationError('Tolong isi semua kolom !');
            return;
        }

        setValidationError(null);
        try {

            const response = await addNewAkun({
                name: newAkun.name,
                username: newAkun.username,
                phone: newAkun.phone,
                email: newAkun.email,
                role: newAkun.role,
                password: newAkun.password,
            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Akun created successfully');
                showData();

                setNewAkun({
                    name: '',
                    username: '',
                    email: '',
                    phone: '',
                    role: '',
                    password: '',
                });
                handleshow();
                toast.success('Data berhasil dibuat', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menambahkan akun, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan akun:', error);
        }
    };

    const simpanPerubahanAkun = () => {
        const { name, email, password, username, phone, role } = newAkun;
        if (!name || !email || !password || !username || !phone || !role) {
            setValidationError('Tolong isi semua kolom !');
            return;
        }
        if (akunToEdit !== null) {

            console.log('Data', {
                name: newAkun.name,
                email: newAkun.email,
                password: newAkun.password,
                username: newAkun.username,
                phone: newAkun.phone,
                role: newAkun.role,
            });
            updateAccount(akunToEdit,
                newAkun.name,
                newAkun.email,
                newAkun.password,
                newAkun.username,
                newAkun.phone,
                newAkun.role,
            )

                .then((response) => {
                    console.log('Akun diperbarui:', response);
                    showData();
                    toast.success('Data berhasil diubah', { position: toast.POSITION.TOP_RIGHT });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit akun:', error);
                });

            setShowEditConfirmation(false);
        }
    };


    const handleDelete = async (userId: number) => {
        try {
            // Update the UI immediately
            const updatedAkunData = akun.filter((akun) => akun.user_id !== userId);
            setAkun(updatedAkunData);

            const response = await deleteAccount(userId);

            if (response.status === 'success') {
                console.log('Account deleted successfully:', response.message);
                showData();
                toast.success('Data berhasil dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus akun, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus akun:', error);
        }
    };

    const toggleAktifStatus = async (userId: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;

            const updatedAkunData = akun.map((akun) => {
                if (akun.user_id === userId) {
                    return { ...akun, is_active: newStatus };
                }
                return akun;
            });

            setAkun(updatedAkunData);

            await axios.post(`${API_URL}/user/${userId}/status`, {
                is_active: newStatus,
            });

            console.log('Status updated successfully');
            window.location.reload();
        } catch (error) {
            console.error('Terjadi kesalahan saat mengubah status:', error);
        }
    };

    const openEditConfirmation = (akunId: number) => {
        setAkunToEdit(akunId);
        setShowEditConfirmation(true);
    };
    const openDeleteConfirmation = (userId: number) => {
        setAkunToDelete(userId);
        setShowDeleteConfirmation(true);
    };
    const openAkunConfirmation = (id_product: number) => {
        setMenejemenToAkun(id_product);
        setShowAkunConfirmation(true);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <section className="content-header content-header-custom">
                        <h1>Manajemen Akun</h1>
                    </section>
                </div>
            </div>
            <div className='row my-5'>
                {show === true && (<div className='col-30 col-md-6 mb-2'>
                    <div className="card p-4 shadow bg-white">
                        <label htmlFor="username">Nama</label>
                        <input type="text" id="username"
                            className="form-control mb-2"
                            value={newAkun.name}
                            onChange={(e) => setNewAkun({ ...newAkun, name: e.target.value })}
                        />

                        <label htmlFor="username">Username</label>
                        <input type="text" id="username"
                            className="form-control mb-2"
                            value={newAkun.username}
                            onChange={(e) => setNewAkun({ ...newAkun, username: e.target.value })}
                        />

                        <label htmlFor="username">No HP</label>
                        <input type="text" id="username"
                            className="form-control mb-2"
                            value={newAkun.phone}
                            onChange={(e) => setNewAkun({ ...newAkun, phone: e.target.value })}
                        />

                        <label htmlFor="username">Email</label>
                        <input type="text" id="username"
                            className="form-control mb-2"
                            value={newAkun.email}
                            onChange={(e) => setNewAkun({ ...newAkun, email: e.target.value })}
                        />

                        <label htmlFor="level" className='mb-2'>Level</label>
                        <select
                            className="form-select mb-2"
                            name="modeProcess"
                            value={newAkun.role}
                            onChange={(e) => setNewAkun({ ...newAkun, role: e.target.value })}
                        >
                            <option value="">Pilih Level</option>
                            <option value='admin'>Admin</option>
                            <option value="warehouse">Gudang</option>
                            <option value="price_check">Cek Harga</option>
                        </select>

                        <label htmlFor="password" className='mb-2'>Password</label>
                        <div className='input-group mb-2'>
                            <input type={showPassword ? "text" : "password"} id="password"
                                placeholder="Masukkan password"
                                className="form-control "
                                required
                                value={newAkun.password}
                                onChange={(e) => setNewAkun({ ...newAkun, password: e.target.value })}
                            />
                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                            </span>
                        </div>

                        {validationError && (
                            <div className="alert alert-danger" role="alert">
                                {validationError}
                            </div>
                        )}
                        <div className='d-flex mt-2'>
                            <button
                                className=' col-6 btn btn-secondary me-2'
                                onClick={handleshow}
                            >
                                Tutup
                            </button>
                            <button
                                className='col-6 btn btn-primary '
                                onClick={addAccount}
                            >
                                Simpan
                            </button>
                        </div>

                    </div>
                </div>)}
                {show === false && (<div className='col-12 col-md-2 mb-2'>
                    <div>
                        <button
                            className='btn btn-primary mt-2'
                            // onClick={handleshow}
                            onClick={() => {
                                setValidationError(null);
                                handleshow();
                            }}
                        >
                            Tambah User
                        </button>
                    </div>
                </div>)}
            </div>


            <div className='row container-fluid border-0 mt-4 mb-3 shadow-lg bg-white rounded'>
                <div className='table-responsive'>
                    {/* begin::Table */}
                    <table className='table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                        {/* begin::Table head */}
                        <thead>
                            <tr className='fw-bold text-muted'>
                                {/* <th className='min-w-30px'>No</th> */}
                                <th className='min-w-150px'>Username</th>
                                <th className='min-w-125px'>Nama</th>
                                <th className='min-w-125px'>Level</th>
                                <th className='min-w-125px'>Status</th>
                                <th className='min-w-80px'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {akun.map((akun, index) => {
                                if (akun.role !== 'cashier') {
                                    return (
                                        <tr key={index}>
                                            {/* <td align="center">{index + 1}</td> */}
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-text"
                                                >
                                                    <a className="text-dark fw-bold text-hover-primary fs-6"
                                                        onClick={() => openAkunConfirmation(akun.id)}
                                                    >
                                                        {akun.username}
                                                    </a>
                                                </button>
                                            </td>
                                            <td>
                                                <a className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {akun.name}
                                                </a>
                                            </td>
                                            <td>
                                                <a className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {akun.role}
                                                </a>
                                            </td>
                                            <td>
                                                <a className='text-dark fw-bold d-block mb-1 fs-6'>
                                                    {akun.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </a>

                                            </td>
                                            <td>
                                                <button className="btn btn-info btn-sm"
                                                    onClick={() => openEditConfirmation(akun.id)}
                                                >Edit
                                                </button>
                                                <span>   </span>
                                                <button
                                                    className="btn btn-danger btn-sm "
                                                    onClick={() => openDeleteConfirmation(akun.id)}

                                                >Hapus
                                                </button>
                                                <span>  </span>
                                                <button
                                                    className={`btn btn-sm ${akun.is_active ? 'btn-danger' : 'btn-success'}`}
                                                    onClick={() => toggleAktifStatus(akun.id, akun.is_active)}
                                                >
                                                    {akun.is_active ? 'Non-Aktif' : 'Aktif'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                        {/* end::Table body */}
                    </table>
                    {/* end::Table */}
                </div>

                {/* modal */}
                {showAkunConfirmation && menejemenToAkun !== null && (
                    <Modal show={showAkunConfirmation} onHide={() => setShowAkunConfirmation(false)} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Detail Data Akun</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-2">
                                    <label className="col-form-label">Nama:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={akun.find(akun => akun.id === menejemenToAkun)?.name || ''}
                                        // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                        disabled
                                    />
                                    <label className="col-form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={akun.find(akun => akun.id === menejemenToAkun)?.email || ''}
                                        // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                        disabled
                                    />
                                    <label className="col-form-label">No HP:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={akun.find(akun => akun.id === menejemenToAkun)?.phone || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">Role:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={akun.find(akun => akun.id === menejemenToAkun)?.role || ''}
                                        disabled
                                    />

                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )}

                {/* Edit */}
                {showEditConfirmation && akunToEdit !== null && (
                    <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label className="col-form-label">Nama:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAkun.name}
                                        onChange={(e) => setNewAkun({ ...newAkun, name: e.target.value })}

                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAkun.username}
                                        onChange={(e) => setNewAkun({ ...newAkun, username: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">No HP:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAkun.phone}
                                        onChange={(e) => setNewAkun({ ...newAkun, phone: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAkun.email}
                                        onChange={(e) => setNewAkun({ ...newAkun, email: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Level:</label>
                                    <select
                                        className="form-select"
                                        name="modeProcess"
                                        value={newAkun.role}
                                        onChange={(e) => setNewAkun({ ...newAkun, role: e.target.value })}
                                    >
                                        <option value="">Pilih Level</option>
                                        {/* {akun.map((akun) => (
                                            <option key={akun.role} value={akun.role} >
                                                {akun.role}
                                            </option>
                                        ))} */}
                                        <option value='admin'>Admin</option>
                                        <option value="warehouse">Gudang</option>
                                        <option value="price_check">Cek Harga</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Password:</label>
                                    <div className='input-group'>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className="form-control"
                                            value={newAkun.password}
                                            onChange={(e) => setNewAkun({ ...newAkun, password: e.target.value })}
                                        />
                                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                                        </span>
                                    </div>

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
                                onClick={simpanPerubahanAkun}
                            >
                                Simpan
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                {/* Delete */}
                {showDeleteConfirmation && akunToDelete !== null && (
                    <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Apakah yakin anda ingin menghapus?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                                Batal
                            </Button>
                            <Button variant="danger" onClick={() => {
                                handleDelete(akunToDelete);
                                setShowDeleteConfirmation(false);
                            }}>
                                Setuju
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
                <ToastContainer position="top-right" autoClose={2000} />
            </div>




        </div>

    )
}

export default ManagementAccountPage
