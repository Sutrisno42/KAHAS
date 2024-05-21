import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../_metronic/helpers'
import { Link } from 'react-router-dom';
import { Repack, addProductOut, fetchCategories, getSearchProduk, showProducts, showSupplier, showUnit, updateProduct } from '../../functions/global/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { convertDate, convertIDR } from '../../functions/global';

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

interface Product {
    id: number;
    category_id: number;
    product_name: string;
    // product_id: string;
    stock: number;
}

const API_URL = process.env.REACT_APP_API_URL

interface Supplier {
    id: number;
    name: string;
}


const StokProductPage = () => {
    usePageTitle('Stok Produk');

    const navigate = useNavigate();
    const data = localStorage.getItem('user');
    const userData = data ? JSON.parse(data) : null;
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [productData, setProductData] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [unit, setUnit] = useState<any[]>([]);
    const [productToEdit, setProductToEdit] = useState<number | null>(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [productOutToEdit, setProductOutToEdit] = useState<number | null>(null);
    const [showEditProductOut, setShowEditProductOut] = useState(false);
    const [repackToEdit, setRepackToEdit] = useState<number | null>(null);
    const [showEditRepack, setShowEditRepack] = useState(false);
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
    const [newProductOut, setNewProductOut] = useState({
        name: '',
        stock_opname_id: '',
        total_out: 0,
        note: '',
        responsible: '',
    });
    const [newRepack, setNewRepack] = useState({
        origin_product_name: '',
        price: 0,
        stock: 0,
        origin_product_id: '',
        destination_product_id: '',
        current_stock: 0,
        // product_id: '',
        stock_repack: 0,
    });
    const [stokMasuk, setStokMasuk] = useState(0);

    const handleStokMasukChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredStokMasuk = parseInt(e.target.value, 10);

        // Check if entered value is a valid number and not NaN
        if (!isNaN(enteredStokMasuk) && enteredStokMasuk >= 0) {
            setStokMasuk(enteredStokMasuk);
        }
    };
    const handleHistoryButtonClick = (productId: number) => {
        navigate(`/StokProduk/history/${productId}`);
    };
    // const handleRepackButtonClick = (productId: number) => {
    //     navigate(`/StokProduk/repack/${productId}`);
    // };
    const handleLabelButtonClick = (productId: number) => {
        navigate(`/allProduk/label/${productId}`);
    };

    const openEditConfirmation = (productId: number) => {
        setProductToEdit(productId);
        setShowEditConfirmation(true);
    };

    const openEditProductOut = (productId: any) => {
        console.log('data', productId.stock_opnames[0].id);

        const params = {
            name: productId.product_name,
            stock_opname_id: productId.stock_opnames[0].id,
            total_out: 0,
            note: '',
            responsible: userData.name,
        }
        setNewProductOut(params);
        setProductOutToEdit(productId.id);
        setShowEditProductOut(true);
    };

    const openEditRepact = (productId: any) => {
        console.log('data', productId.stock_opnames[0].product_id);

        const params = {
            origin_product_name: productId.product_name,
            price: productId.price,
            stock: productId.stock,
            origin_product_id: productId.stock_opnames[0].product_id,
            destination_product_id: '',
            current_stock: productId.stock,
            stock_repack: 0,
        }
        setNewRepack(params);

        setRepackToEdit(productId.product_id);
        setShowEditRepack(true);
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

    useEffect(() => {
        if (productToEdit !== null) {
            const productToEditData = productData.find(product => product.id === productToEdit);

            if (productToEditData) {
                const unitIds = productToEditData.price_lists.map((priceList: any) => priceList.pivot.unit_id);
                const unitPrices = productToEditData.price_lists.map((priceList: any) => priceList.pivot.price);
                const minimums = productToEditData.price_lists.map((priceList: any) => priceList.pivot.minimum);

                const stockOpname = productToEditData.stock_opnames[0];

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
                    unit_id: unitIds,
                    unit_price: unitPrices,
                    minimum: minimums,
                });
            }
        }

    }, [productToEdit, productData]);

    const addProductsOut = async () => {
        console.log('data', newProductOut);
        try {

            const response = await addProductOut({
                stock_opname_id: newProductOut.stock_opname_id,
                total_out: newProductOut.total_out,
                note: newProductOut.note,
                responsible: newProductOut.responsible,
            });

            console.log('Response:', response);
            if (response.status === 'success') {
                console.log('Product created successfully');
                showData();
                setProductData([...productData, response.data]);
                toast.success('Produk berhasil keluar', { position: toast.POSITION.TOP_RIGHT });
                setNewProductOut({
                    name: '',
                    stock_opname_id: '',
                    total_out: 0,
                    note: '',
                    responsible: '',

                });
                setShowEditProductOut(false)
            } else {
                console.error('Gagal menambahkan produk, respons:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan produk:', error);
        }
    };

    // const addRepack = async () => {
    //     console.log('data', newRepack);
    //     try {

    //         const response = await Repack({
    //             origin_product_id: newRepack.origin_product_id,
    //             destination_product_id: newRepack.destination_product_id,
    //             current_stock: newRepack.current_stock,
    //             stock_repack: newRepack.stock_repack,
    //         });

    //         console.log('Response:', response);
    //         if (response.status === 'success') {
    //             console.log('Product created successfully');
    //             showData();
    //             setProductData([...productData, response.data]);
    //             toast.success('Produk berhasil direpak', { position: toast.POSITION.TOP_RIGHT });
    //             setNewRepack({
    //                 origin_product_name: '',
    //                 price: 0,
    //                 stock: 0,
    //                 origin_product_id: '',
    //                 destination_product_id: '',
    //                 current_stock: 0,
    //                 stock_repack: 0,

    //             });
    //             setShowEditRepack(false)
    //             setTimeout(() => {
    //                 window.location.reload();
    //             }, 2000);
    //         } else {
    //             console.error('Gagal menambahkan produk, respons:', response);
    //         }
    //     } catch (error) {
    //         console.error('Terjadi kesalahan saat menambahkan produk:', error);
    //     }
    // };

    const simpanPerubahanProduk = () => {
        if (productToEdit !== null) {
            const updatedStock = newProduct.stock + stokMasuk;
            updateProduct(productToEdit,
                newProduct.category_id,
                newProduct.product_name,
                newProduct.product_code,
                updatedStock,
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
                    toast.success('Stok berhasil ditambah', { position: toast.POSITION.TOP_RIGHT });
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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
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
    const handleSelectProduct = (selectedProduct: Product) => {
        setSelectedIndex(selectedProduct.id);
        setSelectedProducts([selectedProduct]);
        setNewRepack({
            ...newRepack,
            destination_product_id: String(selectedProduct.id),
        });

        setSearchValue('');
        setFilteredData([]);
    };
    const handleSearchProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.trim() !== '') {
            try {
                const response = await getSearchProduk(value);
                const searchData = response.data.data;
                setFilteredData(searchData);
            } catch (error) {
                console.error('Error fetching search data:', error);
            }
        } else {
            setFilteredData([]);
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
                                    required
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
                                        <th className='min-w-300px'>Nama Produk</th>
                                        <th className='min-w-140px'>Kategori</th>
                                        <th className='min-w-120px'>Kode Produk</th>
                                        <th className='min-w-120px'>Stok</th>
                                        <th className='min-w-500px'>Aksi</th>
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
                                                    <button className="btn btn-info btn-sm" onClick={() => openEditConfirmation(item.id)} >Tambah Stok</button>
                                                    <span> </span>
                                                    <button className="btn btn-info btn-sm"
                                                        onClick={() => openEditProductOut(item)}
                                                    >Retur Produk</button>
                                                    <span>  </span>
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => handleHistoryButtonClick(item.id)}
                                                    >History</button>
                                                    <span>  </span>
                                                    <button className="btn btn-danger btn-sm"
                                                        // onClick={() => handleRepackButtonClick(item)}
                                                        onClick={() => openEditRepact(item)}
                                                    >Repack</button>
                                                    <span>  </span>
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => handleLabelButtonClick(item.id)}
                                                    >Label</button>
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

                        {/* modal */}
                        {showProdukConfirmation && produkToProduk !== null && (
                            <Modal show={showProdukConfirmation} onHide={() => setShowProdukConfirmation(false)} size="xl">
                                <Modal.Header closeButton >
                                    <Modal.Title style={{ fontSize: '1.5em' }}>Produk Data</Modal.Title>
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
                                                value={convertIDR(productData.find(product => product.id === produkToProduk)?.stock_opnames[0]?.hpp_price) || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Harga:</label>
                                            {productData.find(product => product.id === produkToProduk)?.price_lists?.map((priceListItem: PriceListItem, index: number) => (
                                                <div key={index} className="d-flex mb-3">
                                                    <div className="col-6 mb-1 me-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            // value={`RP. ${priceListItem?.pivot?.price || ''}`}
                                                            value={convertIDR(priceListItem?.pivot?.price)}
                                                            // {convertIDR(val.price)}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div col-6>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={` ${convertToPcs3(priceListItem?.unit_value || 0, priceListItem?.unit_name || '')}  ${priceListItem?.unit_name || ''}`}
                                                            disabled
                                                        />
                                                    </div>

                                                </div>
                                            ))}
                                            <label className="col-form-label">Stok:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.stock || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">No Faktur:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={productData.find(product => product.id === produkToProduk)?.stock_opnames[0]?.faktur_number || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Tanggal Kadaluarsa:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={convertDate(productData.find(product => product.id === produkToProduk)?.stock_opnames[0]?.expired_date) || ''}
                                                disabled
                                            />
                                            <label className="col-form-label">Notif Tgl Kadaluarsa:</label>
                                            <input
                                                type="text"
                                                className="form-control mb-4"
                                                value={convertDate(productData.find(product => product.id === produkToProduk)?.stock_opnames[0]?.expired_notif_date) || ''}
                                                disabled
                                            />

                                        </div>

                                    </form>
                                </Modal.Body>
                            </Modal>
                        )}
                    </div>

                    {/*Retur Produk */}
                    {showEditProductOut && productOutToEdit !== null && (
                        <Modal show={showEditProductOut} onHide={() => setShowEditProductOut(false)} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title>Retur Produk</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">Nama Produk:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newProductOut.name}
                                            disabled
                                        // onChange={event => setNewProductOut({ ...newProductOut, name: event.target.value })}

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Total Refund:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={newProductOut.total_out}
                                            onChange={(e) => setNewProductOut({ ...newProductOut, total_out: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Keterangan:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newProductOut.note}
                                            onChange={event => setNewProductOut({ ...newProductOut, note: event.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Penanggung Jawab:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newProductOut.responsible}
                                            onChange={event => setNewProductOut({ ...newProductOut, responsible: event.target.value })}
                                        />
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditProductOut(false)}>
                                    Batal
                                </Button>
                                <Button variant="primary" onClick={addProductsOut}>
                                    Simpan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                    {/* Tambah Stok */}
                    {showEditConfirmation && productToEdit !== null && (
                        <Modal show={showEditConfirmation} onHide={() => setShowEditConfirmation(false)} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title>Tambah Stok</Modal.Title>
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
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Kategori:</label>
                                        <select
                                            className="form-select"
                                            name="modeProcess"
                                            value={newProduct.category_id}
                                            onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                            disabled
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
                                            disabled
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
                                        <input type="text" className="form-control" id="quantity"
                                            value={newProduct.faktur_number}
                                            onChange={(e) => setNewProduct({ ...newProduct, faktur_number: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="col-form-label">Stok Saat ini:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={newProduct.stock}
                                            disabled
                                        // onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Stok Masuk:</label>
                                        <input type="number" className="form-control" id="quantity"
                                            value={stokMasuk}
                                            onChange={handleStokMasukChange}
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
                                        <label className="col-form-label col-6">Harga Jual:</label>
                                        <label className="col-form-label col-6">Jumlah:</label>
                                        {newProduct.unit_price.map((price, index) => (
                                            <div className="d-flex mb-3" key={index}>
                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Harga Jual"
                                                    value={formatCurrency(price)}
                                                    onChange={(e) => handleUnitPriceChange(e, index, newProduct.price)}
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
                                        <label className="col-form-label">HPP:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={formatCurrency(newProduct.hpp_price)}
                                            onChange={(e) => setNewProduct({ ...newProduct, hpp_price: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })}
                                        />
                                    </div>

                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditConfirmation(false)}>
                                    Batal
                                </Button>
                                <Button variant="primary" onClick={simpanPerubahanProduk}>
                                    Simpan
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                    {/* Repack Produk */}
                    {showEditRepack && repackToEdit !== null && (
                        <Modal show={showEditRepack} onHide={() => { }} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title>Repack Produk</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/* <form>
                                    <div className="mb-3">
                                        <label className="col-form-label">Nama Produk:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newRepack.name}
                                            disabled

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Jumlah Stok:</label>
                                        <input type="text" className="form-control" id="quantity"
                                            value={newRepack.stock_repack}
                                            onChange={(e) => setNewRepack({ ...newRepack, stock_repack: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </form> */}
                                <form>
                                    <div className="box-body">
                                        <div className="row mb-10">
                                            <div className="col-sm-4">
                                                {/* <div className='d-flex align-items-center position-relative'>
                                                    <i className="fas fa-search position-absolute ms-3"></i>
                                                    <input className="form-control w-300px ps-9"
                                                        placeholder='Pencarian Produk'
                                                        data-kt-user-table-filter="search"
                                                    >
                                                    </input>
                                                </div> */}
                                            </div>
                                            {/* <div className="col-sm-3">
                                                <div className="form-group">
                                                    <label htmlFor="invoice_no">Tanggal:*</label>
                                                    <input className='form-control' disabled type="date" placeholder='dd/mmmm/yyyy' name='date'
                                                    />
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="col-sm-12 mb-2">
                                            <table className='table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                                {/* begin::Table head */}
                                                <thead>
                                                    <tr className='fw-bold text-muted'>
                                                        <th align='center' className='min-w-30px'>
                                                            #
                                                        </th>
                                                        <th className='min-w-100px'>Nama Produk</th>
                                                        <th className='min-w-100px'>Harga</th>
                                                        <th className='min-w-150px'>Stok saat ini</th>
                                                        <th className='min-w-100px'>Stok repack</th>
                                                        {/* <th className='min-w-100px'>Jumlah</th>
                                                        <th className='min-w-100px'>Subtotal</th>
                                                        <th className='min-w-100px'>Diskon</th>
                                                        <th className='min-w-200px'>Retur</th> */}
                                                    </tr>
                                                </thead>
                                                {/* end::Table head */}
                                                {/* begin::Table body */}
                                                <tbody>

                                                    <tr >
                                                        <td align='center'>1</td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-solid"
                                                                value={newRepack.origin_product_name}
                                                                // value={newProduct.product_code}
                                                                onChange={(e) => setNewRepack({ ...newRepack, origin_product_id: e.target.value })}
                                                                disabled

                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-solid"
                                                                value={convertIDR(newRepack.price)}
                                                                // value={newProduct.product_code}
                                                                // onChange={(e) => setNewRepack({ ...newRepack, origin_product_id: e.target.value })}
                                                                disabled

                                                            />
                                                        </td>
                                                        <td>
                                                            <div className='col-10 d-flex'>
                                                                <input placeholder='' type="number" id="quantity"
                                                                    className="col form-control me-2"
                                                                    style={{ borderColor: 'black' }}
                                                                    value={newRepack.stock}
                                                                    onChange={(e) => setNewRepack({ ...newRepack, current_stock: parseInt(e.target.value) })}
                                                                    disabled
                                                                />

                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input placeholder='' type="number" id="quantity"
                                                                className="col form-control"
                                                                style={{ borderColor: 'black' }}
                                                                value={newRepack.stock_repack}
                                                                onChange={(e) => setNewRepack({ ...newRepack, stock_repack: parseInt(e.target.value) })}
                                                                min={1}
                                                            />
                                                        </td>

                                                    </tr>

                                                </tbody>
                                                {/* end::Table body */}
                                            </table>

                                        </div>

                                        {/* <div className='d-flex align-items-center position-relative'>
                                            <i className="fas fa-search position-absolute ms-3"></i>
                                            <input className="form-control w-300px ps-9"
                                                placeholder='Tujuan Produk'
                                                data-kt-user-table-filter="search"
                                            >
                                            </input>
                                        </div> */}
                                        <div className='d-flex align-items-center position-relative my-1 col-3'>
                                            <i className='fas fa-search position-absolute ms-3'></i>
                                            <input
                                                className='form-control w-200px ps-9'
                                                placeholder='Tujuan Produk'
                                                value={searchValue}
                                                onChange={handleSearchProduct}
                                            ></input>
                                        </div>
                                        {searchValue && (
                                            <div className='card-title'>
                                                <div
                                                    className='search-results position-absolute bg-white border rounded '
                                                    style={{ marginTop: '-15px', width: 'auto' }}
                                                >
                                                    <ul className='list-group' style={{ marginBottom: '10px' }}>
                                                        {filteredData.length > 0 ? (
                                                            filteredData.map((item: Product, index: number) => (
                                                                <a
                                                                    key={item.id}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        color: index === selectedIndex ? '#34759a' : 'black',
                                                                    }}
                                                                    className='list-group-item d-flex justify-content-between align-items-center'
                                                                    onClick={() => {
                                                                        handleSelectProduct(item);
                                                                    }}
                                                                >
                                                                    <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                                                        {item.product_name}
                                                                    </div>
                                                                </a>
                                                            ))
                                                        ) : (
                                                            <span style={{ textAlign: 'center', margin: '20px 0' }}>Belum Ada Data Produk</span>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-sm-12 mb-2">
                                            <table className='table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                                {/* begin::Table head */}
                                                <thead>
                                                    <tr className='fw-bold text-muted'>
                                                        <th align='center' className='min-w-30px'>
                                                            #
                                                        </th>
                                                        <th className='min-w-100px'>Nama Produk</th>
                                                        <th className='min-w-350px'>Stok saat ini</th>
                                                        <th className='min-w-400px'>Stok setelah repack</th>
                                                        {/* <th className='min-w-150px'>Stok saat ini</th>
                                                        <th className='min-w-100px'>Stok repack</th> */}
                                                    </tr>
                                                </thead>
                                                {/* end::Table head */}
                                                {/* begin::Table body */}
                                                <tbody>
                                                    {selectedProducts.map((selectedProduct, index) => (
                                                        <tr key={selectedProduct.id}>
                                                            <td></td>
                                                            <td>
                                                                {/* {selectedProduct.product_name} */}
                                                                <input type="text"
                                                                    className='form-control form-control-solid'
                                                                    value={selectedProduct.product_name}
                                                                    // value={newRepack.destination_product_id}
                                                                    onChange={(e) => setNewRepack({ ...newRepack, destination_product_id: e.target.value })}
                                                                    disabled
                                                                />
                                                            </td>
                                                            <td>
                                                                <input type="text"
                                                                    className='form-control form-control-solid'
                                                                    value={selectedProduct.stock}
                                                                    disabled
                                                                />
                                                            </td>
                                                            <td>
                                                                <input type="text"
                                                                    className='form-control form-control-solid'
                                                                    value={selectedProduct.stock + newRepack.stock_repack}
                                                                    disabled
                                                                />

                                                            </td>
                                                            {/* <td>
                                            <label htmlFor={`total-${selectedProduct.id}`}></label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                id={`total-${selectedProduct.id}`}
                                                name={`total-${selectedProduct.id}`}
                                                min={1}
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor={`packing_date-${selectedProduct.id}`}></label>
                                            <input
                                                type='date'
                                                className='form-control'
                                                id={`packing_date-${selectedProduct.id}`}
                                                name={`packing_date-${selectedProduct.id}`}
                                            />
                                        </td>
                                        <td>
                                            <button className='btn btn-white btn-sm' onClick={() => handleRemoveItem(selectedProduct.id)}>
                                                <i className='bi bi-x-lg'></i>
                                            </button>
                                        </td> */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                {/* end::Table body */}
                                            </table>

                                        </div>
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditRepack(false)}>
                                    Batal
                                </Button>
                                <Button variant="primary"
                                // onClick={addRepack}
                                >
                                    Simpan
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

export default StokProductPage