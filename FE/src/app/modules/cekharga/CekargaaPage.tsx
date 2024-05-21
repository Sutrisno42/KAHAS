import React, { useEffect, useState } from 'react';
import usePageTitle from '../../functions/global/usePageTitle';
import { showProducts } from '../../functions/global/api';
import { convertIDR } from '../../functions/global';
import { FooterWrapper } from '../../../_metronic/layout/components/footer';
import { toAbsoluteUrl } from '../../../_metronic/helpers';

interface ProductPrice {
    unit_name: string;
    unit_value: number;
    price: number;
    minimum: number
}

interface ProductWithPrices {
    id: number;
    product_name: string;
    product_code: string;
    stock: number;
    category: any;
    prices: ProductPrice[];
}

function CekHargaPage() {
    usePageTitle('Cek Harga');

    const [productData, setProductData] = useState<ProductWithPrices[]>([]);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const products = await showProducts(search, categoryId);

            const productsWithPrices = products.map((product: any) => ({
                id: product.id,
                product_name: product.product_name,
                product_code: product.product_code,
                stock: product.stock,
                category: product.category,
                prices: product.price_lists.map((price: any) => ({
                    unit_name: price.unit_name,
                    unit_value: price.unit_value,
                    price: price.pivot.price,
                    minimum: price.pivot.minimum,
                })),
            }));

            setProductData(productsWithPrices);
            setSearch('');
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data:', error);
        }
    };
    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            fetchData();
        }
    };

    function convertToPcs(quantity: number, unit: string) {
        if (quantity === undefined || unit === undefined) {
            return 0;
        }
        switch (unit) {
            case 'Pcs':
                return quantity;
            case 'Lusin':
                return quantity * 12;
            case 'Dus':
                return quantity * 24; // Misalnya, 1 dus = 48 pcs
            case 'Karton':
                return quantity * 240; // Misalnya, 1 karton = 240 pcs
            case 'Gross':
                return quantity * 144; // Misalnya, 1 gross = 1728 pcs
            case 'Kodi':
                return quantity * 20; // Misalnya, 1 kodi = 144 pcs
            case 'Box':
                return quantity * 100; // Misalnya, 1 box = 24 pcs
            default:
                return 0; // Unit tidak dikenali
        }
    }
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
    function convertToPcs2(quantity: number, unit: string) {
        if (quantity === undefined || unit === undefined) {
            return 0;
        }
        switch (unit) {
            case 'Pcs':
                return quantity;
            case 'Lusin':
                return 12;
            case 'Dus':
                return 24; // Misalnya, 1 dus = 48 pcs
            case 'Karton':
                return 240; // Misalnya, 1 karton = 240 pcs
            case 'Gross':
                return 144; // Misalnya, 1 gross = 1728 pcs
            case 'Kodi':
                return 20; // Misalnya, 1 kodi = 144 pcs
            case 'Box':
                return 100; // Misalnya, 1 box = 24 pcs
            default:
                return 0; // Unit tidak dikenali
        }
    }


    return (
        <>
            <div className="container">
                <div className="card-header row justify-content-between border-0 mt-4 mb-3 shadow-lg p-3 bg-white rounded">
                    <div style={{ display: 'flex' }} className='mt-4'>
                        <h1 className='col-4' style={{ fontSize: '20px' }}> Toko Bahan Kue D'Hardjosoewarno</h1>
                        <img src={toAbsoluteUrl("/logo2.svg")} alt="" className='col-3 h-45px' />
                    </div>

                    <div className="mb-10">
                        <label className="form-label">Cari Berdasarkan Nama Produk atau Barcode Scan</label>
                        <input
                            type="text"
                            style={{ borderWidth: '3px' }}
                            className="form-control"
                            value={search}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <a href="#" className="btn btn-primary mb-10" onClick={() => { fetchData() }}><i className="fas fa-search "></i>Search</a>

                    <div className="container-fluid">
                        <div className="table-responsive">
                            <table className="table table-row-dashed table-row-gray-300 gy-7">
                                <thead>
                                    <tr className="fw-bolder fs-1 text-gray-800 min-w-30px text-center" >
                                        <th>NO</th>
                                        <th className='min-w-100px'>Nama Barang</th>
                                        <th className='min-w-100px'>Kode</th>
                                        <th className='min-w-100px'>Stok</th>
                                        <th className='min-w-150px'>Harga</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(productData) ? (
                                        productData.map((product, index) => (
                                            <tr className="fs-1 text-gray-800 min-w-30px text-center" key={index}>
                                                {/* <td className='min-w-30px'>{product.id}</td> */}
                                                <td className='min-w-30px'>{index + 1}</td>
                                                <td className='min-w-100px'>{product.product_name}</td>
                                                <td className='min-w-100px'>{product.product_code}</td>
                                                <td className='min-w-100px'>{product.stock}</td>
                                                <td className='min-w-150px'>
                                                    <ul style={{ listStyle: 'none' }}>
                                                        {product.prices
                                                            .sort((a, b) => a.minimum - b.minimum)
                                                            .map((price, priceIndex) => (
                                                                <li key={priceIndex} >
                                                                    {convertToPcs(price.minimum, price.unit_name) || price.unit_value} Pcs - {convertIDR(price.price)}


                                                                </li>
                                                            ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <p>Data tidak tersedia.</p>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <FooterWrapper />

        </>
    )
}

export default CekHargaPage