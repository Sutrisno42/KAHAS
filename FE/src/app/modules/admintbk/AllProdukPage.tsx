import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { addCategory, addNewProduct, deleteProduct, fetchCategories, showProducts, showSupplier, showUnit, updateProduct } from '../../functions/global/api';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { convertDate, convertIDR, formatCurrency, getDaysRemaining } from '../../functions/global';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL

interface Category {
    id: number;
    category_name: string;
}
interface Supplier {
    id: number;
    name: string;
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
const unit = [
    { id: 1, unit_name: 'pcs' },
    // Other units...
];

const ProductPage = () => {
    usePageTitle('Semua Produk');

    const navigate = useNavigate();
    const [productData, setProductData] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [unit, setUnit] = useState<any[]>([]);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [productToEdit, setProductToEdit] = useState<number | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
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
        expired_notif_days: 0,
        unit_id: [1],
        unit_price: [0],
        minimum: [0],
    });
    const [newCategory, setNewCategory] = useState({
        category_name: '',
        code: '',

    });
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

    const handleHistoryButtonClick = () => {
        navigate(`/allProduk/label`);
    };

    const showData = () => {
        showProducts()
            .then(data => {
                setProductData(data);
            })
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

    useEffect(() => {
        if (productToEdit !== null) {
            const productToEditData = productData.find(product => product.id === productToEdit);

            if (productToEditData) {
                const unitIds = productToEditData.price_lists.map((priceList: any) => priceList.pivot.unit_id);
                const unitPrices = productToEditData.price_lists.map((priceList: any) => priceList.pivot.price);
                const minimums = productToEditData.price_lists.map((priceList: any) => priceList.pivot.minimum);

                const stockOpname = productToEditData.stock_opname;
                console.log('dataopname', productToEdit);
                console.log('dataopname', productData);
                console.log('dataopname', productToEditData);
                console.log('dataopname', stockOpname);


                const expiredDate = stockOpname?.expired_date ? stockOpname.expired_date.substring(0, 10) : '';
                const expiredNotifDate = stockOpname?.expired_notif_date ? stockOpname.expired_notif_date.substring(0, 10) : '';


                setNewProduct({
                    category_id: productToEditData.category_id,
                    product_name: productToEditData.product_name,
                    product_code: productToEditData.product_code,
                    stock: productToEditData.stock,
                    price: productToEditData.price,
                    discount: productToEditData.discount,
                    supplier_id: stockOpname?.supplier_id || '',
                    hpp_price: stockOpname?.hpp_price || 0,
                    faktur_number: stockOpname?.faktur_number || '',
                    expired_date: expiredDate,
                    expired_notif_date: expiredNotifDate,
                    expired_notif_days: expiredNotifDate,
                    unit_id: unitIds,
                    unit_price: unitPrices,
                    minimum: minimums,
                });
            }
        }

    }, [productToEdit, productData]);

    const handleDeleteProduct = async (id_product: number) => {
        try {
            const response = await deleteProduct(id_product);

            if (response.status === 200) {
                const updatedProductData = productData.filter(item => item.id !== id_product);
                setProductData(updatedProductData);
                toast.success('Produk telah dihapus', { position: toast.POSITION.TOP_RIGHT });
            } else {
                console.error('Gagal menghapus produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus produk:', error);
        }
    }

    const addKategori = async () => {
        try {
            const response = await addCategory({
                category_name: newCategory.category_name,
                code: newCategory.code,
            });
            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setShowNewCategoryInput(false);
                setCategories([...categories, response.data]);
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

    const addProduct = async () => {

        try {

            const response = await addNewProduct({
                category_id: newProduct.category_id,
                product_name: newProduct.product_name,
                product_code: newProduct.product_code,
                stock: newProduct.stock,
                price: newProduct.price,
                discount: newProduct.discount,
                supplier_id: newProduct.supplier_id,
                hpp_price: newProduct.hpp_price,
                faktur_number: newProduct.faktur_number,
                expired_date: newProduct.expired_date,
                expired_notif_date: newProduct.expired_notif_date,
                unit_id: newProduct.unit_id,
                unit_price: newProduct.unit_price,
                minimum: newProduct.minimum,
            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setProductData([...productData, response.data]);
                toast.success('Data telah dibuat', { position: toast.POSITION.TOP_RIGHT });
                setNewProduct({
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
                    expired_notif_days: 0,
                    unit_id: [1],
                    unit_price: [0],
                    minimum: [0],
                });

            } else {
                console.error('Gagal menambahkan produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan produk:', error);
        }
    };

    const simpanPerubahanProduk = () => {
        if (
            !newProduct.category_id ||
            !newProduct.product_name ||
            !newProduct.product_code ||
            newProduct.stock <= 0 ||
            !newProduct.supplier_id
        ) {
            toast.error('Semua kolom harus terisi semua.', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        if (productToEdit !== null) {
            // const categoryId = parseInt(newProduct.category_id, 10);
            // const suplierId = parseInt(newProduct.supplier_id, 10);
            console.log('Product Data:', productToEdit, newProduct);
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
                    showData();
                    toast.success('Produk telah diubah', { position: toast.POSITION.TOP_RIGHT });
                })
                .catch((error) => {
                    console.error('Kesalahan mengedit produk:', error);
                });

            setShowEditConfirmation(false);
        }
    };
    const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, price: number) => {
        const updatedPrices = [...newProduct.unit_price];
        const inputValue = e.target.value;

        // Remove non-numeric characters from the input value
        const numericValue = parseFloat(inputValue.replace(/\D/g, '')) || 0;

        updatedPrices[index] = numericValue;
        setNewProduct({ ...newProduct, unit_price: updatedPrices, price });
    };

    const handleMinimumChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedMinimum = [...newProduct.minimum];
        updatedMinimum[index] = parseInt(e.target.value, 10);
        setNewProduct({ ...newProduct, minimum: updatedMinimum });
    };

    const handleUnitIdChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        console.log('Selected Unit ID:', e.target.value);
        console.log('Index:', index);

        const updatedUnitId = [...newProduct.unit_id];
        updatedUnitId[index] = parseInt(e.target.value, 10);
        setNewProduct({ ...newProduct, unit_id: updatedUnitId });
    };
    const handleRemoveItem = (index: number) => {
        const updatedUnitPrices = [...newProduct.unit_price];
        const updatedMinimums = [...newProduct.minimum];
        const updatedUnitIds = [...newProduct.unit_id];

        updatedUnitPrices.splice(index, 1);
        updatedMinimums.splice(index, 1);
        updatedUnitIds.splice(index, 1);

        setNewProduct({
            ...newProduct,
            unit_price: updatedUnitPrices,
            minimum: updatedMinimums,
            unit_id: updatedUnitIds,
        });
    };
    function convertToPcs3(quantity: number, unit: string) {
        if (quantity === undefined || unit === undefined) {
            return 0;
        }
        switch (unit) {
            case 'Pcs':
                return quantity;
            case 'Lusin':
                return quantity / 12;
            case 'Dus':
                return quantity / 24; // Misalnya, 1 dus = 48 pcs
            case 'Karton':
                return quantity / 240; // Misalnya, 1 karton = 240 pcs
            case 'Gross':
                return quantity / 144; // Misalnya, 1 gross = 1728 pcs
            case 'Kodi':
                return quantity / 20; // Misalnya, 1 kodi = 144 pcs
            case 'Box':
                return quantity / 100; // Misalnya, 1 box = 24 pcs
            default:
                return 0; // Unit tidak dikenali
        }
    }

    const handleTambahHargaJual = () => {
        console.log('data', newProduct.unit_price);

        if (newProduct.unit_price[0] === 0 || newProduct.minimum[0] === 0 || newProduct.unit_id[0] === 0) {
            toast.error('Harap isi semua kolom.');
        } else {
            setNewProduct({
                ...newProduct,
                unit_price: [...newProduct.unit_price, 0],
                minimum: [...newProduct.minimum, 0],
                unit_id: [...newProduct.unit_id, 1],
            });
        }
    };


    const openProdukConfirmation = (id_product: number) => {
        console.log('Data produk:', productData);
        setProdukToProduk(id_product);
        setShowProdukConfirmation(true);
    };

    const openEditConfirmation = (productId: number) => {
        setProductToEdit(productId);
        setShowEditConfirmation(true);
    };

    const openDeleteConfirmation = (productId: number) => {
        setProductToDelete(productId);
        setShowDeleteConfirmation(true);
    };
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const exportToExcel = () => {
        try {
            const searchParams = {
                product_name: newProduct.product_name,
                category_id: newProduct.category_id,
                product_code: newProduct.product_code,
                arrange_by: arrangeBy,
                sort_by: sortBy,
            };

            axios.get(`${API_URL}/product?page=&product_name=&category_id=&product_code=&arrange_by=&sort_by=`, {
                params: { ...searchParams, page: 1 }
            })
                .then(response => {
                    const dataToExport = (response.data.data.data as any[]).map((product: any) => {
                        const stockOpname = product.stock_opname[0];
                        const hargaJual = product.price_lists.map((priceList: PriceListItem, index: number) => ({
                            [`Harga Jual ${index + 1}`]: convertIDR(priceList.pivot.price || 0),
                            [`Minimum ${index + 1}`]: priceList.pivot.minimum || 0,
                            [`Unit ${index + 1}`]: priceList.unit_name || 'N/A',
                        }));

                        return {
                            'Nama Produk': product.product_name,
                            'Kategori': product.category ? product.category.category_name : 'N/A',
                            'Kode': product.product_code,
                            'HPP': convertIDR(product.stock_opname?.hpp_price),
                            'Stok': product.stock,
                            'No Faktur': product.stock_opname?.faktur_number,
                            'Tanggal Kadaluarsa': convertDate(product.stock_opname?.expired_date),
                            'Notif Tanggal Kadaluarsa': convertDate(product.stock_opname?.expired_notif_date),
                            ...Object.assign({}, ...hargaJual),
                        };
                    });

                    const ws = XLSX.utils.json_to_sheet(dataToExport);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Products');
                    XLSX.writeFile(wb, 'products.xlsx');
                })
                .catch(error => {
                    console.error('Error exporting to Excel:', error);
                });
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryCode, setNewCategoryCode] = useState('');

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === '') {
            setShowNewCategoryInput(false);
        } else if (selectedCategory === 'new') {
            setShowNewCategoryInput(true);
        } else {
            setNewProduct({ ...newProduct, category_id: selectedCategory });
            setShowNewCategoryInput(false);
        }
    };

    const handleNewCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
    };

    const handleNewCategoryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryCode(e.target.value);
    };

    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold'>
                            <div className='col-3'>
                                <label className='mb-2'>Nama / Kode Produk</label>
                                <input placeholder='Masukkan nama / kode produk' className='form-control'
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(1)
                                        }
                                    }}
                                    type='text'
                                    name='search'
                                    onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                                />

                            </div>
                            <div className='col-3'>
                                <label className='mb-2'>Kategori</label>
                                <select
                                    className="form-select"
                                    name="modeProcess"
                                    value={newProduct.category_id}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSearch(1);
                                        }
                                    }}
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
                            {/* <div className='col-3'>
                                <label className='mb-2'>Kode Produk</label>
                                <input placeholder='Masukkan kode produk' className='form-control'
                                    type='text'
                                    name='statusDeliveryCode'
                                    onChange={(e) => setNewProduct({ ...newProduct, product_code: e.target.value })}
                                />
                            </div> */}

                            <div className='col-3'>
                                <label className='mb-2'>Urutkan Berdasarkan</label>
                                <select className="form-select"
                                    name='modeProcess'
                                    value={arrangeBy}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSearch(1);
                                        }
                                    }}
                                    onChange={(e) => setArrangeBy(e.target.value)}
                                    required
                                >
                                    <option value="category_id">Kategori</option>
                                    <option value="product_code">Kode Produk</option>
                                    <option value="product_name">Nama Produk</option>
                                </select>
                                {/* {sortBy && !arrangeBy && (
                                    <p style={{ color: 'red' }}>Tolong pilih "Arrange by" sebelum memilih "Order".</p>
                                )} */}
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
                                            toast.error('Tolong isikan "Urutan" dahulu sebelum memilih "Urutkan Berdasarkan".', {
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
                            <div className='col-1 mt-8'>
                                <Button className='btn btn-info' onClick={() => handleSearch(1)} >Cari</Button>
                            </div>
                            <div className='col-3 mt-8'>
                                <Button onClick={exportToExcel} className='bi btn-danger bi-printer'><span> Ekspor </span> </Button>
                            </div>
                            <div className='col-3 mt-8' data-bs-toggle="modal" data-bs-target="#ModalLabel" data-bs-whatever="@mdo">
                                <Button className='btn btn-info' >Tambah Produk</Button>
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
                                                    <button type="button" className="btn btn-text">
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
                                                    <button className="btn btn-info btn-sm" onClick={() => openEditConfirmation(item.id)}>Edit</button>
                                                    <span>  </span>
                                                    <button className="btn btn-danger btn-sm" onClick={() => openDeleteConfirmation(item.id)}>Hapus</button>
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

                        {/* Alert Tambah Produk */}
                        <div className="modal fade" id="ModalLabel" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel" >Tambah Produk</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="col-form-label">Nama Produk:</label>
                                                <input type="text" placeholder="Masukkan nama produk" className="form-control" id="product-name"
                                                    value={newProduct.product_name}
                                                    onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Kategori:</label>
                                                <select
                                                    className="form-select"
                                                    name="modeProcess"
                                                    value={newProduct.category_id}
                                                    // onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                                    onChange={handleCategoryChange}
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.category_name}
                                                        </option>
                                                    ))}
                                                    <option value="new">Lainnya</option>
                                                </select>
                                                {showNewCategoryInput && (
                                                    <div>
                                                        <label className="col-form-label">Kategori Baru:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Isikan nama kategori baru"
                                                            className="form-control mt-2"
                                                            value={newCategory.category_name}
                                                            onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Isikan kode kategori baru"
                                                            className="form-control mt-2"
                                                            value={newCategory.code}
                                                            onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                                                        />
                                                        <button type="button" className="btn btn-primary mt-2"
                                                            onClick={addKategori}
                                                        >Tambah</button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Kode Produk:</label>
                                                <input type="text" placeholder="Masukkan kode produk" className="form-control" id="code"
                                                    value={newProduct.product_code}
                                                    onChange={(e) => setNewProduct({ ...newProduct, product_code: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">HPP:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="hpp_price"
                                                    value={formatCurrency(newProduct.hpp_price)}
                                                    onChange={(e) => setNewProduct({ ...newProduct, hpp_price: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label col-6">Jumlah:</label>
                                                <label className="col-form-label col-6">Harga Jual:</label>
                                                {newProduct.unit_price.map((price, index) => (
                                                    <div className="d-flex mb-3" key={index}>

                                                        <input
                                                            type="quantity"
                                                            className="form-control me-2"
                                                            placeholder="Jumlah"
                                                            value={newProduct.minimum[index] || '0'}
                                                            onChange={(e) => handleMinimumChange(e, index)}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control me-2"
                                                            placeholder="Harga Jual"
                                                            value={formatCurrency(price)}
                                                            // onChange={(e) => handleUnitPriceChange(e, index, newProduct.price)}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;
                                                                const numericValue = parseFloat(inputValue.replace(/\D/g, '')) || 0;
                                                                handleUnitPriceChange(e, index, numericValue);
                                                            }}
                                                        />
                                                        <select
                                                            className="form-select me-2"
                                                            placeholder=""
                                                            value={newProduct.unit_id[index]}
                                                            onChange={(e) => handleUnitIdChange(e, index)}
                                                            disabled
                                                            hidden
                                                        >
                                                            {/* <option value="">Pilih Unit</option> */}
                                                            {unit.map((unit) => (
                                                                <option key={unit.id} value={unit.id}>
                                                                    {unit.unit_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {newProduct.unit_id.length > 1 && (
                                                            <button className="btn btn-white btn-sm"
                                                                onClick={() => handleRemoveItem(index)}
                                                            >
                                                                <i className="bi bi-x-lg"></i>
                                                            </button>
                                                        )}
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
                                            <div className="mb-3">
                                                <label className="col-form-label">Stok:</label>
                                                <input type="quantity" placeholder="0" className="form-control" min={0}
                                                    value={newProduct.stock || '0'}
                                                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}

                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="col-form-label">Diskon:</label>
                                                <input type="text" placeholder="Isikan 0 jika tidak ada diskon" className="form-control "
                                                    id="discount"
                                                    value={formatCurrency(newProduct.discount)}
                                                    onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}

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
                                                <label className="col-form-label">No Faktur:</label>
                                                <input type="quantity" className="form-control" min={0}
                                                    value={newProduct.faktur_number || '0'}
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
                                                {/* <input type="date" className="form-control" id="product-name"
                                                    value={newProduct.expired_notif_date}
                                                    onChange={(e) => setNewProduct({ ...newProduct, expired_notif_date: e.target.value })}
                                                /> */}
                                                <select
                                                    className="form-select"
                                                    value={newProduct.expired_notif_days}
                                                    onChange={(e) => {
                                                        const selectedDays = parseInt(e.target.value);
                                                        const currentDate = new Date();
                                                        const newExpiredNotifDate = new Date(currentDate.setDate(currentDate.getDate() + selectedDays)).toISOString().split('T')[0];
                                                        setNewProduct({ ...newProduct, expired_notif_days: selectedDays, expired_notif_date: newExpiredNotifDate });
                                                    }}
                                                >
                                                    {Array.from({ length: 180 }, (_, index) => (
                                                        <option key={index + 1} value={index + 1}>{index + 1} hari</option>
                                                    ))}

                                                </select>
                                            </div>
                                            {/* <div className="mb-3">
                                                <label className="col-form-label">Harga Jual:</label>
                                                <input type="text" placeholder="Harga Jual" className="form-control "
                                                    id="harga-jual"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}

                                                />
                                            </div> */}


                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                            onClick={addProduct}
                                        >Tambah Produk</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Alert Tambah Produk */}


                        {/* modal */}
                        {showProdukConfirmation && produkToProduk !== null && (
                            <Modal show={showProdukConfirmation} onHide={() => setShowProdukConfirmation(false)} size="xl">
                                <Modal.Header closeButton >
                                    <Modal.Title style={{ fontSize: '1.5em' }}>Data Produk</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form >
                                        <div className="mb-2" >
                                            <label className="col-form-label" style={{ fontSize: '1.2em' }} >Nama Produk:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                style={{ fontSize: '1.2em' }}
                                                value={productData.find(product => product.id === produkToProduk)?.product_name || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">HPP:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={convertIDR(productData.find(product => product.id === produkToProduk)?.stock_opname?.hpp_price) || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Stok:</label>
                                            <input
                                                type="number"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.stock || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">No Faktur:</label>
                                            <input
                                                // type="number"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.stock_opname?.faktur_number || ''}
                                                // value={(productData.find(product => product.id === produkToProduk)?.stock_opname?.faktur_number !== undefined) ? productData.find(product => product.id === produkToProduk)?.stock_opname?.faktur_number : ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Tanggal Kadaluarsa:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={convertDate(productData.find(product => product.id === produkToProduk)?.stock_opname?.expired_date) || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Notif Tgl Kadaluarsa:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={`${getDaysRemaining(productData.find(product => product.id === produkToProduk)?.stock_opname?.expired_notif_date) || ''} hari`}
                                                disabled
                                            />
                                            <label className="col-form-label">Diskon:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={convertIDR(productData.find(product => product.id === produkToProduk)?.discount) || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Harga:</label>
                                            {productData.find(product => product.id === produkToProduk)?.price_lists?.map((priceListItem: PriceListItem, index: number) => (
                                                <div key={index} className="d-flex mb-3">
                                                    <div className="col-6 mb-1 me-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={convertIDR(priceListItem?.pivot?.price)}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div col-6>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={`${priceListItem?.pivot?.minimum || ''} ${priceListItem?.unit_name || ''}`}
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
                </div>

                {/* Edit */}
                {showEditConfirmation && productToEdit !== null && (
                    <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
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
                                {/* <div className="mb-3">
                                    <label className="col-form-label">HPP:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="hpp_price"
                                        value={formatCurrency(newProduct.hpp_price)}
                                        onChange={(e) => setNewProduct({ ...newProduct, hpp_price: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="col-form-label col-6">Harga Jual:</label>
                                    <label className="col-form-label col-6">Jumlah:</label>
                                    {newProduct.unit_price.map((price, index) => (
                                        <div className="d-flex mb-3" key={index}>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Harga Jual"
                                                value={formatCurrency(price)}
                                                // onChange={(e) => handleUnitPriceChange(e, index, newProduct.price)}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    const numericValue = parseFloat(inputValue.replace(/\D/g, '')) || 0;
                                                    handleUnitPriceChange(e, index, numericValue);
                                                }}
                                            />

                                            <input
                                                type="quantity"
                                                className="form-control me-2"
                                                placeholder="Jumlah"
                                                min={0}
                                                value={newProduct.minimum[index] || '0'}
                                                onChange={(e) => handleMinimumChange(e, index)}
                                            />

                                            <select
                                                className="form-select me-2"
                                                placeholder=""
                                                value={newProduct.unit_id[index]}
                                                onChange={(e) => handleUnitIdChange(e, index)}
                                                disabled
                                                hidden
                                            >
                                                {/* <option value="">Pilih Unit</option> */}
                                                {unit.map((unit) => (
                                                    <option key={unit.id} value={unit.id}>
                                                        {unit.unit_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {newProduct.unit_id.length > 1 && (
                                                <button className="btn btn-white btn-sm"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            )}
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
                                {/* <div className="mb-3">
                                    <label className="col-form-label">Stok:</label>
                                    <input type="number" className="form-control" id="quantity"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="col-form-label">Diskon:</label>
                                    <input type="text" placeholder="Isikan 0 jika tidak ada diskon" className="form-control "
                                        id="discount"
                                        value={formatCurrency(newProduct.discount)}
                                        onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}

                                    />
                                </div>

                                {/* <div className="mb-3">
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
                                </div> */}
                                <div className="mb-3">
                                    <label className="col-form-label">No Faktur:</label>
                                    <input type="quantity" className="form-control" min={0}
                                        value={newProduct.faktur_number || '0'}
                                        onChange={(e) => setNewProduct({ ...newProduct, faktur_number: parseInt(e.target.value) })}
                                    />
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
                {/* End Edit Produk */}

                {/* Delete */}
                {showDeleteConfirmation && productToDelete !== null && (
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
                                                handleDeleteProduct(productToDelete);
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

export default ProductPage