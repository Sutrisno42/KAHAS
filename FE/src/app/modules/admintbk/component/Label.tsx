import React, { useState } from 'react';
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { barcode, getSearchProduk } from '../../../functions/global/api';
// import Barcode from 'react-barcode';
// import { Barcode } from '@createnextapp/react-barcode';
import ReactDOMServer from 'react-dom/server';
import { convertIDR, formatDate } from '../../../functions/global';
import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';

interface Product {
    id: number;
    category_id: number;
    product_name: string;
    stock: number;
    total: number;
    stock_opname: any
}
interface Label {
    id: number;
    product_name: string;
    product_code: string;
    price: number;
    total: number;
    price_total: number;
    packing_date: string;
    expired_date: string;
    packing_date_formated: string;
    expired_date_formated: string;
    hideProductCode?: boolean;
}

const API_URL = process.env.REACT_APP_API_URL;

const Label = () => {
    usePageTitle('Label Produk');

    const [filteredData, setFilteredData] = useState<Product[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const [data, setData] = useState<Label[]>([]);
    const [createdData, setCreatedData] = useState<Label | null>(null);

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

    const handleSelectProduct = (selectedProduct: Product) => {
        // Check if the product is already selected
        if (!selectedProducts.some((product) => product.id === selectedProduct.id)) {
            setSelectedProducts((prevSelected) => [...prevSelected, selectedProduct]);
        }

        setSearchValue('');
        setFilteredData([]);
    };


    const handleRemoveItem = (productId: number) => {
        setSelectedProducts((prevSelected) => prevSelected.filter((product) => product.id !== productId));
    };

    const [totalQuantity, setTotalQuantity] = useState<number>(1);

    const handleCreateData = async () => {
        try {
            const totalValues = selectedProducts.map(product => product.total);
            console.log('Total values:', totalValues);

            const response = await barcode({
                product_id: selectedProducts.map(product => product.id),
                total: totalValues,
                expired_date: selectedProducts.map(product => product.stock_opname?.expired_date),
            });

            console.log('Response:', response.data);
            if (response.status === 'success') {
                console.log('Labels created successfully');
                printLabel(response.data);

            } else {
                console.error('Failed to create labels, response:', response);
            }
        } catch (error) {
            console.error('An error occurred while creating labels:', error);
        }
    };

    const printLabel = (labelData: { product_code: string; product_name: any; expired_date: string; }[]) => {
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            console.error('Unable to open print window.');
            return;
        }

        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
          <style>
          /* Add your print styles here */
          @media print {
              @page {
                  margin: 0px;
                  padding: 0px;
                  size: 100vh;
              }
          }
          body {
              font-family: Arial, sans-serif;
              text-align: center;
          }
          .label-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              align-items: center;
              margin: 0 auto;
              width: 25%;
              max-width: 500px;
          }
          .label-content {
              box-sizing: border-box;
              padding: 5px;
              margin: 5px 0 10px;
              height: auto;
              page-break-before: always; /* Mulai setiap label pada halaman baru */
          }
          h1 {
              padding: 0;
              margin: 0;
              max-width: 100%; 
              font-weight: bold;
              white-space: nowrap; 
              text-overflow: ellipsis;
              text-align: center;
              font-size: 48px; 
          }
          .exp {
              padding: 0;
              margin: 0;
              font-weight: bold;
              font-size: 35px;
          }
          .barcode {
              width: 90%;
              height: 130px;
              margin: 0;
              padding: 0;
          }
          .product-code {
              padding: 0;
              margin: 2px;
              font-weight: bold;
              font-size: 48px; 
          }
          .pcode {
              margin-bottom: 5px;
          }
      </style>
      
          </head>
          <body>
            ${labelData.flatMap((product: { product_code: string; product_name: any; expired_date: string; total?: number }, index: any) => {
            const total = product.total || 1; // Use 1 as the default value if 'total' is not present
            const labels = Array.from({ length: total }, (_, i) => {
                const canvas = document.createElement('canvas');
                canvas.style.padding = '0'
                JsBarcode(canvas, product.product_code, { width: 4, height: 50, displayValue: false, margin: 0 });
                const barcodeDataURL = canvas.toDataURL();

                return `
                  <div class='label-content'>
                    <h1>${product.product_name}</h1>
                    <p class="exp">EXP ${formatDate(product.expired_date)}</p>
                    <img class="barcode" src=${barcodeDataURL}  alt="Barcode" />
                    <p class="product-code">${product.product_code}</p>
                  </div>
                `;
            });


            return labels.join('');
        }).join('')}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);

        printWindow.document.close();
    };
    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
        const { value } = e.target;
        // Update the total of the selected product
        setSelectedProducts(prevSelected =>
            prevSelected.map(product =>
                product.id === productId ? { ...product, total: parseInt(value) } : product
            )
        );
    };


    return (
        <>
            <div className='container'>
                <div className='card-header row justify-content-between border-0 mt-4 mb-3 p-3 rounded bg-white'>
                    <h2>Label Produk</h2>
                    <div className='col-12 col-md-2 mb-2 mt-4 d-flex align-items-center gap-5'>
                        <div>
                            <div className='d-flex align-items-center position-relative my-1 col-3'>
                                <i className='fas fa-search position-absolute ms-3'></i>
                                <input
                                    className='form-control w-200px ps-9'
                                    placeholder='Search'
                                    value={searchValue}
                                    onChange={handleSearchProduct}
                                ></input>
                            </div>
                        </div>
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
                </div>

                <div className='row container-fluid bg-white rounded'>
                    <div className='table-responsive'>
                        <table className='table table-striped table-row-bordered table-row-white-100 align-middle'>
                            <thead>
                                <tr className='fw-bold text-bolder'>
                                    <th className='min-w-30px'>#</th>
                                    <th className='min-w-300px'>Nama Produk</th>
                                    <th className='min-w-30px'>Jumlah</th>
                                    <th className='min-w-300px'>Tanggal Kadaluarsa</th>
                                    <th className='min-w-80px'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map((selectedProduct, index) => (
                                    <tr key={selectedProduct.id}>
                                        <td>{index + 1}</td>
                                        <td>{selectedProduct.product_name}</td>
                                        <td>
                                            <input
                                                type="quantity"
                                                min={0}
                                                className='form-control'
                                                value={selectedProduct.total || '0'}
                                                onChange={(e) => handleTotalChange(e, selectedProduct.id)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='date'
                                                className='form-control'
                                                value={selectedProduct.stock_opname?.expired_date}
                                            />

                                        </td>
                                        <td>
                                            <button className='btn btn-white btn-sm' onClick={() => handleRemoveItem(selectedProduct.id)}>
                                                <i className='bi bi-x-lg'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5}>
                                        <div className='col-2 mt-8' style={{ alignContent: 'end' }}>
                                            <Button onClick={handleCreateData}>
                                                <span>Cetak</span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Label;
