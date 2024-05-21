import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { TablesWidget14 } from '../../../_metronic/partials/widgets/tables/TablesWidget14'
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { addNewMember, deletemember, showMember, updateMember } from '../../functions/global/api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const MemberPage = () => {
    usePageTitle('Data Pelanggan');

    const [member, setMember] = useState<any[]>([]);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<number | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
    const [showMemberConfirmation, setShowMemberConfirmation] = useState(false);
    const [memberToMember, setmemberToMember] = useState<number | null>(null);
    const [newMember, setNewMember] = useState({
        name: '',
        code: '',
        phone: '',
        email: '',
        address: '',
        default_discount: 0,

    });
    const [arrangeBy, setArrangeBy] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                name: newMember.name,
                code: newMember.code,
                phone: newMember.phone,
                email: newMember.email,
                address: newMember.address,
                arrange_by: arrangeBy,
            };

            axios.get(`${API_URL}/member?page=&name=&code=&phone=&email=&address=&arrange_by=`, {
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
        showMember()
            .then(data => {
                setMember(data);
            })
    };

    useEffect(() => {
        showData();
    }, []);

    useEffect(() => {
        if (showEditConfirmation && memberToEdit !== null) {
            const selectedMember = member.find((m) => m.id === memberToEdit);

            if (selectedMember) {
                setNewMember({
                    name: selectedMember.name,
                    code: selectedMember.code,
                    phone: selectedMember.phone,
                    email: selectedMember.email,
                    address: selectedMember.address,
                    default_discount: selectedMember.default_discount,
                });
            }
        } else {
            const randomCode = generateUniqueRandomCode();
            setNewMember({ ...newMember, code: randomCode });
        }
    }, [showEditConfirmation, memberToEdit, member]);

    const generateUniqueRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 8;

        let randomCode: string;
        do {
            randomCode = '';
            for (let i = 0; i < codeLength; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomCode += characters.charAt(randomIndex);
            }
        } while (member.some((m) => m.code === randomCode));

        return randomCode;
    };



    const addMember = async () => {
        try {

            const response = await addNewMember({
                name: newMember.name,
                code: newMember.code,
                phone: newMember.phone,
                email: newMember.email,
                address: newMember.address,
                default_discount: newMember.default_discount,
            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setMember([...member, response.data]);
                toast.success('Data telah dibuat', { position: toast.POSITION.TOP_RIGHT });
                setNewMember({
                    name: '',
                    code: '',
                    phone: '',
                    email: '',
                    address: '',
                    default_discount: 0,

                });

            } else {
                console.error('Gagal menambahkan produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan produk:', error);
        }
    };

    const simpanPerubahan = () => {
        if (memberToEdit !== null) {
            // const categoryId = parseInt(newProduct.category_id, 10);
            // const suplierId = parseInt(newProduct.supplier_id, 10);
            console.log('Product Data:', memberToEdit, newMember);
            updateMember(memberToEdit,
                newMember.name,
                newMember.code,
                newMember.phone,
                newMember.email,
                newMember.address,
                newMember.default_discount,
            )
                .then((response) => {
                    console.log('Produk diperbarui:', response);
                    showData();
                    toast.success('Data telah diubah', { position: toast.POSITION.TOP_RIGHT });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit produk:', error);
                });

            setShowEditConfirmation(false);
        }
    };

    const handleDeleteProduct = async (id_member: number) => {
        try {
            const response = await deletemember(id_member);

            if (response.status === 200) {
                const updatedData = member.filter(item => item.id !== id_member);
                setMember(updatedData);
                toast.success('Data telah dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus produk:', error);
        }
    }

    const openMemberConfirmation = (id_member: number) => {
        setmemberToMember(id_member);
        setShowMemberConfirmation(true);
    };

    const openEditConfirmation = (id_member: number) => {
        setMemberToEdit(id_member);
        setShowEditConfirmation(true);
    };

    const openDeleteConfirmation = (id_member: number) => {
        setMemberToDelete(id_member);
        setShowDeleteConfirmation(true);
    };

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
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Kode</label>
                                <input placeholder='09876' className='form-control' type='text'
                                    name='search'
                                    onChange={(e) => setNewMember({ ...newMember, code: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>No HP</label>
                                <input placeholder='08xx' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Email</label>
                                <input placeholder='budi@gmail.com' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Alamat</label>
                                <input placeholder='Jl.IniBapakBudi' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewMember({ ...newMember, address: e.target.value })} />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select" name='modeProcess' onChange={(e) => console.log(e)}>
                                    <option value="name">Nama Pelanggan</option>
                                    <option value="code">Kode Pelanggan</option>
                                    <option value="phone">No HP</option>
                                    <option value="email">Email</option>
                                    <option value="address">Alamat</option>
                                </select>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={() => handleSearch(1)} >Cari</Button>
                            </div>
                            <div className='col-3 mt-8' data-bs-toggle="modal" data-bs-target="#ModalLabel" data-bs-whatever="@mdo">
                                <Button >Tambah Pelanggan</Button>
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
                                    <th className='min-w-150px'>Nama Pelanggan</th>
                                    <th className='min-w-120px'>Kode Pelanggan</th>
                                    <th className='min-w-120px'>No HP</th>
                                    <th className='min-w-120px'>Diskon</th>
                                    {/* <th className='min-w-120px' style={{ textAlign: 'center' }}>Action</th> */}
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
                                                        {item.name}
                                                    </a>
                                                </button>
                                            </td>
                                            <td>
                                                <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                    {item.code}
                                                </a>
                                            </td>
                                            <td>
                                                <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                    {item.phone}
                                                </a>
                                            </td>
                                            <td>
                                                <span className='badge badge-light-success' style={{ fontSize: '14px' }} >{item.default_discount}%</span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
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
                                        <button className="page-link" onClick={() => handleSearch(currentPage + 1)} disabled={currentPage === totalPages}>
                                            Selanjutnya
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* end::Table container */}


                    {/* Alert Tambah Pelanggan */}
                    <div className="modal fade" id="ModalLabel" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel" >Tambah Pelanggan</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="col-form-label">Nama Pelanggan:</label>
                                            <input type="text" placeholder="" className="form-control" id="product-name"
                                                value={newMember.name}
                                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">Kode Pelanggan:</label>
                                            <input type="text" placeholder="" className="form-control" id="product-name"
                                                value={newMember.code}
                                                onChange={(e) => setNewMember({ ...newMember, code: e.target.value })}
                                                disabled
                                            />

                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">No HP:</label>
                                            <input type="text" placeholder="" className="form-control" id="product-name"
                                                value={newMember.phone}
                                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">Email:</label>
                                            <input type="email" placeholder="" className="form-control" id="product-name"
                                                value={newMember.email}
                                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">Alamat:</label>
                                            <input type="text" placeholder="" className="form-control" id="product-name"
                                                value={newMember.address}
                                                onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                        onClick={addMember}
                                    >Simpan</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                {/* modal */}
                {showMemberConfirmation && memberToMember !== null && (
                    <Modal show={showMemberConfirmation} onHide={() => setShowMemberConfirmation(false)} size='xl'>
                        <Modal.Header closeButton>
                            <Modal.Title>Data Pelanggan</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-2">
                                    <label className="col-form-label">Nama Pelanggan:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.name || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">No HP:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.phone || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.email || ''}
                                        disabled
                                    />
                                    <label className="col-form-label">Alamat:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        value={member.find(member => member.id === memberToMember)?.address || ''}
                                        disabled
                                    />
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )}

                {/* Edit */}
                {showEditConfirmation && memberToEdit !== null && (
                    <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size='xl'>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label className="col-form-label">Nama Pelanggan:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMember.name}
                                        onChange={event => setNewMember({ ...newMember, name: event.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Kode Pelanggan:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMember.code}
                                        onChange={event => setNewMember({ ...newMember, code: event.target.value })}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">No HP:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMember.phone}
                                        onChange={event => setNewMember({ ...newMember, phone: event.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMember.email}
                                        onChange={event => setNewMember({ ...newMember, email: event.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Alamat:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMember.address}
                                        onChange={event => setNewMember({ ...newMember, address: event.target.value })}
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
                {showDeleteConfirmation && memberToDelete !== null && (
                    <div>
                        <div className="modal-backdrop fade show"></div>
                        <div className="modal fade show" style={{ display: 'block' }} >
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
                                                handleDeleteProduct(memberToDelete);
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

export default MemberPage