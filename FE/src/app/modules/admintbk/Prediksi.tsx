import { useState } from "react";
import usePageTitle from "../../functions/global/usePageTitle";
import { getSearchData } from "../../functions/global/api";
import { ChartsWidget9 } from "../../../_metronic/partials/widgets";
import * as XLSX from 'xlsx';
import { Button } from "react-bootstrap";

interface searchproduk {
    id: number,
    nama_produk: string,
    data1: number,
    data2: number,
    data3: number,
    data4: number,
    data5: number,
}

const Prediksi = () => {
    usePageTitle('Prediksi');

    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState<searchproduk[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<searchproduk[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleSelectProduct = (selectedProduct: any) => {
        // Check if the product is already selected
        if (!selectedProducts.some((product) => product.id === selectedProduct.id)) {
            setSelectedProducts((prevSelected) => [...prevSelected, selectedProduct]);
        }

        setSearchValue('');
        setFilteredData([]);
    };

    const handleSearchProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.trim() !== '') {
            try {
                const response = await getSearchData(value);
                console.log('API response:', response);

                // const searchData = response.data.data;
                const searchData = response || [];
                setFilteredData(searchData);
            } catch (error) {
                console.error('Error fetching search data:', error);
            }
        } else {
            setFilteredData([]);
        }
    };



    // Function to calculate prediction
    const calculatePrediction = (selectedProduct: searchproduk) => {
        const data1 = selectedProduct.data1;
        const data2 = selectedProduct.data2;
        const data3 = selectedProduct.data3;
        const data4 = selectedProduct.data4;
        const data5 = selectedProduct.data5;

        // Perform linear regression calculation (similar to handlePredict function)
        const n = 5;
        const sumX = (n * (n + 1)) / 2;
        const sumY = data1 + data2 + data3 + data4 + data5;
        const sumXY = (data1 * 1) + (data2 * 2) + (data3 * 3) + (data4 * 4) + (data5 * 5);
        const sumXSquare = (n * (n + 1) * (2 * n + 1)) / 6;

        const b = (n * sumXY - sumX * sumY) / (n * sumXSquare - Math.pow(sumX, 2));
        const a = (sumY - b * sumX) / n;

        // Predict sales for month 6
        const prediction = a + b * 6;

        // Round prediction to nearest whole number
        const roundedPrediction = Math.round(prediction);

        return roundedPrediction; // Return the rounded prediction
    };

    // Function to calculate MAPE
    const calculateMAPE = (selectedProduct: searchproduk) => {
        const data1 = selectedProduct.data1;
        const data2 = selectedProduct.data2;
        const data3 = selectedProduct.data3;
        const data4 = selectedProduct.data4;
        const data5 = selectedProduct.data5;

        // Perform similar calculations as handlePredict function
        const n = 5;
        const sumY = data1 + data2 + data3 + data4 + data5;
        const actualSales = sumY / n;
        const sumX = (n * (n + 1)) / 2;
        const sumXY = (data1 * 1) + (data2 * 2) + (data3 * 3) + (data4 * 4) + (data5 * 5);
        const sumXSquare = (n * (n + 1) * (2 * n + 1)) / 6;

        const b = (n * sumXY - sumX * sumY) / (n * sumXSquare - Math.pow(sumX, 2));
        const a = (sumY - b * sumX) / n;

        // Predict sales for month 6
        const prediction = a + b * 6;

        // Calculate MAPE
        const mape = Math.abs((actualSales - prediction) / actualSales) * 100;

        return mape.toFixed(2); // Adjust the number of decimal places as needed
    };


    const handleRemoveItem = (productId: number) => {
        setSelectedProducts((prevSelected) => prevSelected.filter((product) => product.id !== productId));
    };
    const productData = selectedProducts.map(product => ({
        name: product.nama_produk,
        data: [product.data1, product.data2, product.data3, product.data4, product.data5]
    }));

    const predictionData = selectedProducts.map(product => calculatePrediction(product));
    const exportToExcel = () => {
        const worksheetData = selectedProducts.map(product => ({
            'Nama Produk': product.nama_produk,
            'Bulan 1': product.data1,
            'Bulan 2': product.data2,
            'Bulan 3': product.data3,
            'Bulan 4': product.data4,
            'Bulan 5': product.data5,
            'Prediksi': calculatePrediction(product)
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Prediksi Produk');

        XLSX.writeFile(workbook, 'prediksi_produk.xlsx');
    };


    return (
        <div className='container'>
            <div className='card-header row justify-content-between border-0 mt-4 mb-3 p-3 rounded bg-white'>
                <h2>Prediksi Produk</h2>
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
                <div className="col-3">
                    <Button onClick={exportToExcel} className='bi bi-printer'><span>  Ekspor </span> </Button>
                </div>

                {searchValue && (
                    <div className='card-title'>
                        <div
                            className='search-results position-absolute bg-white border rounded '
                            style={{ marginTop: '-15px', width: 'auto' }}
                        >
                            <ul className='list-group' style={{ marginBottom: '10px' }}>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item: searchproduk, index: number) => (
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
                                                {item.nama_produk}
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
                                <th className='min-w-30px'>Bulan 1</th>
                                <th className='min-w-30px'>Bulan 2</th>
                                <th className='min-w-30px'>Bulan 3</th>
                                <th className='min-w-30px'>Bulan 4</th>
                                <th className='min-w-30px'>Bulan 5</th>
                                <th className='min-w-80px text-success'>Prediksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((selectedProduct, index) => (
                                <tr key={selectedProduct.id}>
                                    <td>{index + 1}</td>
                                    <td>{selectedProduct.nama_produk}</td>
                                    <td>{selectedProduct.data1}</td>
                                    <td>{selectedProduct.data2}</td>
                                    <td>{selectedProduct.data3}</td>
                                    <td>{selectedProduct.data4}</td>
                                    <td>{selectedProduct.data5}</td>
                                    <td className="text-success">
                                        {/* Display prediction results here */}
                                        <div>
                                            {calculatePrediction(selectedProduct)}
                                            {/* <br />
                                            <strong>MAPE:</strong> {calculateMAPE(selectedProduct)} */}
                                        </div>
                                    </td>
                                    <td>
                                        <button className='btn btn-white btn-sm' onClick={() => handleRemoveItem(selectedProduct.id)}>
                                            <i className='bi bi-x-lg'></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="box-header">
                    <ChartsWidget9 className={'mt-10'} productData={productData} predictionData={predictionData} />
                </div>
            </div>

        </div>
    )
}

export default Prediksi