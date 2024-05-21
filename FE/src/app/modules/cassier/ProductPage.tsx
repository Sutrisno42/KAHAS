import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { Link } from 'react-router-dom';
import { fetchCategories, showProducts, showSupplier, showUnit, updateProduct } from '../../functions/global/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Category {
    id: number;
    category_name: string;
}
type PriceListItem = {
    id: number;
    unit_name: string;
    unit_value: number;
    pivot: {
        product_id: number;
        unit_id: number;
        price: number;
        minimum: number;
    };
};

const API_URL = process.env.REACT_APP_API_URL

interface Supplier {
    id: number;
    name: string;
}


const StokProductPage = () => {
    usePageTitle('Data Produk');

    const navigate = useNavigate();
    const [productData, setProductData] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [unit, setUnit] = useState<any[]>([]);
    const [productToEdit, setProductToEdit] = useState<number | null>(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [showProdukConfirmation, setShowProdukConfirmation] = useState(false);
    const [produkToProduk, setProdukToProduk] = useState<number | null>(null);
    const [newProduct, setNewProduct] = useState({
        category_id: '',
        product_name: '',
        product_code: '',
        stock: 0,
        price: 0,
        discount: 0,
        supplier_id: '',
        hpp_price: 0,
        faktur_number: 0,
        expired_date: '',
        expired_notif_date: '',
        unit_id: [0],
        unit_price: [0],
        minimum: [0],
    });

    const handleHistoryButtonClick = (productId: number) => {
        navigate(`/product/history/${productId}`);
    };

    // const handleHistoryButtonClick = (productId: number) => {
    //     navigate(`/StokProduk/history/${productId}`);
    // };

    const openEditConfirmation = (productId: number) => {
        setProductToEdit(productId);
        setShowEditConfirmation(true);
    };

    const openProdukConfirmation = (id_product: number) => {
        setProdukToProduk(id_product);
        setShowProdukConfirmation(true);
    };

    const showData = () => {
        showProducts()
            .then(data => {
                setProductData(data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };

    useEffect(() => {
        fetchCategories().then((dataKategori) => {
            setCategories(dataKategori);
        });
        showSupplier().then((data) => {
            setSupplier(data);
        });

        showUnit().then((data) => {

            setUnit(data);
        });
        showData();
    }, []);

    const simpanPerubahanProduk = () => {
        if (productToEdit !== null) {
            updateProduct(productToEdit,
                newProduct.category_id,
                newProduct.product_name,
                newProduct.product_code,
                newProduct.stock,
                newProduct.price,
                newProduct.discount,
                newProduct.supplier_id,
                newProduct.hpp_price,
                newProduct.faktur_number,
                newProduct.expired_date,
                newProduct.expired_notif_date,
                newProduct.unit_id,
                newProduct.unit_price,
                newProduct.minimum
            )
                .then((response) => {
                    console.log('Produk diperbarui:', response);
                    showData(); // Ambil data yang diperbarui setelah mengedit
                    setProductData(prevData => {
                        const updatedData = prevData.map(item => (item.id === productToEdit ? response.data : item));
                        return updatedData;
                    });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit produk:', error);
                });

            setShowEditConfirmation(false);
        }
    };
    const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedPrices = [...newProduct.unit_price];
        updatedPrices[index] = parseFloat(e.target.value);
        setNewProduct({ ...newProduct, unit_price: updatedPrices });
    };

    const handleMinimumChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedMinimum = [...newProduct.minimum];
        updatedMinimum[index] = parseInt(e.target.value, 10);
        setNewProduct({ ...newProduct, minimum: updatedMinimum });
    };

    const handleUnitIdChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const updatedUnitId = [...newProduct.unit_id];
        updatedUnitId[index] = parseInt(e.target.value, 10);
        setNewProduct({ ...newProduct, unit_id: updatedUnitId });
    };

    const handleTambahHargaJual = () => {
        setNewProduct({
            ...newProduct,
            unit_price: [...newProduct.unit_price, 0],
            minimum: [...newProduct.minimum, 0],
            unit_id: [...newProduct.unit_id, 0],
        });
    };

    const [arrangeBy, setArrangeBy] = useState('');
    const [sortBy, setSortBy] = useState('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const handleSearch = (eventOrPageNumber: React.MouseEvent<HTMLButtonElement> | number) => {
        if (typeof eventOrPageNumber === 'number') {
            const pageNumber = eventOrPageNumber;

            const searchParams = {
                product_name: newProduct.product_name,
                category_id: newProduct.category_id,
                product_code: newProduct.product_code,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/product?page=&product_name=&category_id=&product_code=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: pageNumber }
            })
                .then(response => {
                    setProductData(response.data.data.data);
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
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama Produk</label>
                                <input placeholder='Masukkan nama produk' className='form-control' type='text' name='search'
                                    onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Kategori</label>
                                <select
                                    className="form-select"
                                    name="modeProcess"
                                    value={newProduct.category_id}
                                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Kode Produk</label>
                                <input placeholder='Masukkan kode produk' className='form-control' type='text' name='statusDeliveryCode'
                                    onChange={(e) => setNewProduct({ ...newProduct, product_code: e.target.value })} />
                            </div>

                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={arrangeBy}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                >
                                    <option value="category_id">Kategori</option>
                                    <option value="product_code">Kode Produk</option>
                                    <option value="product_name">Nama Produk</option>
                                </select>
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
                            <div className='col-3 mt-8'>
                                <Button onClick={() => handleSearch(1)} >Cari</Button>
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
                                    <tr className='fw-bold text-muted'>
                                        <th align='center' className='min-w-30px'>No</th>
                                        <th className='min-w-150px'>Nama Produk</th>
                                        <th className='min-w-140px'>Kategori</th>
                                        <th className='min-w-120px'>Kode Produk</th>
                                        <th className='min-w-120px'>Stok</th>
                                        <th className='min-w-120px'>Aksi</th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody>
                                    {Array.isArray(productData) ? (
                                        productData.map((item, index) => (
                                            <tr key={index}>
                                                <td align="center">{index + 1}</td>
                                                <td>
                                                    <button type="button" className="btn btn-text" >
                                                        <a onClick={() => openProdukConfirmation(item.id)} className='text-dark fw-bold text-hover-primary fs-6'>
                                                            {item.product_name}
                                                        </a>
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {item.category ? item.category.category_name : "N/A"}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {item.product_code}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='text-dark fw-bold d-block mb-1 fs-6'>
                                                        {item.stock}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span>  </span>
                                                    {/* <Link to="/StokProduk/history">
                                                        <button className="btn btn-danger btn-sm">History</button>
                                                    </Link> */}
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => handleHistoryButtonClick(item.id)}
                                                    >History</button>
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

                        {/* modal */}
                        {showProdukConfirmation && produkToProduk !== null && (
                            <Modal show={showProdukConfirmation} onHide={() => setShowProdukConfirmation(false)} size='xl'>
                                <Modal.Header closeButton>
                                    <Modal.Title>Data Produk</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form>
                                        <div className="mb-2">
                                            <label className="col-form-label">Nama Produk:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.product_name || ''}
                                                // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                                disabled
                                            />
                                            <label className="col-form-label">Kategori:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.category.category_name || ''}
                                                // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                                disabled
                                            />
                                            <label className="col-form-label">Kode Produk:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.product_code || ''}
                                                // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                                disabled
                                            />
                                            <label className="col-form-label">Stok:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.stock || ''}
                                                // value={"FRISIAN FLAG SKM POUCH CHOCOLATE 280GR"}
                                                disabled
                                            />
                                            <label className="col-form-label">Harga:</label>

                                            {productData.find(product => product.id === produkToProduk)?.price_lists?.map((priceListItem: PriceListItem, index: number) => (
                                                <div key={index} className="d-flex mb-3">
                                                    <div className="mb-1 me-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={`RP. ${priceListItem?.pivot?.price || ''}`}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={` ${priceListItem?.unit_value || ''}  ${priceListItem?.unit_name || ''}`}
                                                            disabled
                                                        />
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        )}
                    </div>

                    {/* edit */}
                    {showEditConfirmation && productToEdit !== null && (
                        <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Data</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">Nama Produk:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newProduct.product_name}
                                            onChange={event => setNewProduct({ ...newProduct, product_name: event.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Kategori:</label>
                                        <select
                                            className="form-select"
                                            name="modeProcess"
                                            value={newProduct.category_id}
                                            onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Kode Produk:</label>
                                        <input type="text" className="form-control" id="code"
                                            value={newProduct.product_code}
                                            onChange={(e) => setNewProduct({ ...newProduct, product_code: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Jumlah:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Harga Jual:</label>
                                        <input type="text" className="form-control "
                                            id="harga-jual"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Nama Supplier:</label>
                                        <select
                                            className="form-select"
                                            name="modeProcess"
                                            value={newProduct.supplier_id}
                                            onChange={(e) => setNewProduct({ ...newProduct, supplier_id: e.target.value })}
                                        >
                                            <option value="">Pilih Supplier</option>
                                            {supplier.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">HPP:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={newProduct.hpp_price}
                                            onChange={(e) => setNewProduct({ ...newProduct, hpp_price: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">No Faktur:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={newProduct.faktur_number}
                                            onChange={(e) => setNewProduct({ ...newProduct, faktur_number: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Tanggal Kadaluarsa:</label>
                                        <input type="date" className="form-control" id="product-name"
                                            value={newProduct.expired_date}
                                            onChange={(e) => setNewProduct({ ...newProduct, expired_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Notif Tanggal Kadaluarsa:</label>
                                        <input type="date" className="form-control" id="product-name"
                                            value={newProduct.expired_notif_date}
                                            onChange={(e) => setNewProduct({ ...newProduct, expired_notif_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Harga Jual:</label>

                                        {newProduct.unit_price.map((price, index) => (
                                            <div className="d-flex mb-3" key={index}>
                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Harga Jual"
                                                    value={price}
                                                    onChange={(e) => handleUnitPriceChange(e, index)}
                                                />

                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Minimum"
                                                    value={newProduct.minimum[index]}
                                                    onChange={(e) => handleMinimumChange(e, index)}
                                                />

                                                <select
                                                    className="form-select me-2"
                                                    placeholder="Pcs"
                                                    value={newProduct.unit_id[index]}
                                                    onChange={(e) => handleUnitIdChange(e, index)}
                                                >
                                                    <option value="">Select Unit</option>
                                                    {unit.map((unit) => (
                                                        <option key={unit.id} value={unit.id}>
                                                            {unit.unit_name}
                                                        </option>
                                                    ))}
                                                </select>

                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleTambahHargaJual}
                                        >
                                            Tambah Harga Jual
                                        </button>
                                    </div>

                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="primary" onClick={simpanPerubahanProduk}>
                                    Simpan Perubahan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                </div>
            </KTCard>
        </>
    )
}

export default StokProductPage