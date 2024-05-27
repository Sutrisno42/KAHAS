import { useState } from "react";
import usePageTitle from "../../functions/global/usePageTitle";
import { getSearchData } from "../../functions/global/api";
import { Button, Modal } from "react-bootstrap";

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
    const [showModal, setShowModal] = useState(false);

    const handleSelectProduct = (selectedProduct: any) => {
        setSelectedIndex(selectedProduct.id);
        setSelectedProducts([selectedProduct]);
        setSearchValue('');
        setFilteredData([]);
        const productNameInput = document.getElementById('productName') as HTMLInputElement;
        productNameInput.value = selectedProduct.nama_produk;
        const productData1Input = document.getElementById('data1') as HTMLInputElement;
        productData1Input.value = selectedProduct.data1;
        const productData2Input = document.getElementById('data2') as HTMLInputElement;
        productData2Input.value = selectedProduct.data2;
        const productData3Input = document.getElementById('data3') as HTMLInputElement;
        productData3Input.value = selectedProduct.data3;
        const productData4Input = document.getElementById('data4') as HTMLInputElement;
        productData4Input.value = selectedProduct.data4;
        const productData5Input = document.getElementById('data5') as HTMLInputElement;
        productData5Input.value = selectedProduct.data5;
    };

    const handleSearchProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value.trim() !== '') {
            try {
                const response = await getSearchData(value);
                if (Array.isArray(response)) {
                    const searchData = response.map(item => ({
                        id: item.id,
                        nama_produk: item.nama_produk,
                        data1: item.data1,
                        data2: item.data2,
                        data3: item.data3,
                        data4: item.data4,
                        data5: item.data5,
                    }));
                    setFilteredData(searchData);
                } else {
                    console.error('Invalid response structure:', response);
                }
            } catch (error) {
                console.error('Error fetching search data:', error);
            }
        } else {
            setFilteredData([]);
        }
    };

    // const handlePredict = () => {
    //   setShowModal(true);
    // };
    const [predictedProductName, setPredictedProductName] = useState<string>('');
    const [predictedSales, setPredictedSales] = useState<number>(0);
    const [MAPE, setMAPE] = useState<number>(0);

    const handlePredict = () => {
        // Ambil nilai dari formulir
        const productName = (document.getElementById('productName') as HTMLInputElement).value;
        const data1 = parseFloat((document.getElementById('data1') as HTMLInputElement).value);
        const data2 = parseFloat((document.getElementById('data2') as HTMLInputElement).value);
        const data3 = parseFloat((document.getElementById('data3') as HTMLInputElement).value);
        const data4 = parseFloat((document.getElementById('data4') as HTMLInputElement).value);
        const data5 = parseFloat((document.getElementById('data5') as HTMLInputElement).value);

        // Hitung koefisien regresi linier (a dan b)
        const n = 5; // Jumlah data (bulan)
        const sumX = (n * (n + 1)) / 2; // Penjumlahan nilai bulan
        const sumY = data1 + data2 + data3 + data4 + data5; // Penjumlahan nilai penjualan
        const sumXY = (data1 * 1) + (data2 * 2) + (data3 * 3) + (data4 * 4) + (data5 * 5); // Penjumlahan perkalian bulan dan penjualan
        const sumXSquare = (n * (n + 1) * (2 * n + 1)) / 6; // Penjumlahan kuadrat nilai bulan

        const b = (n * sumXY - sumX * sumY) / (n * sumXSquare - Math.pow(sumX, 2)); // Kemiringan (slope)
        const a = (sumY - b * sumX) / n; // Intercept

        // Prediksi penjualan bulan ke-6
        const prediction = a + b * 6;

        // Hitung MAPE
        const actualSales = (data1 + data2 + data3 + data4 + data5) / 5; // Rata-rata dari data yang tersedia
        const mape = Math.abs((actualSales - prediction) / actualSales) * 100;

        // Tampilkan modal dengan hasil prediksi
        setShowModal(true);

        // Update state dengan hasil prediksi, nama produk, dan MAPE
        setPredictedProductName(productName);
        setPredictedSales(prediction);
        setMAPE(mape);
    };

    return (
        <div className='card-header row justify-content-between border-0 mt-4 mb-3 shadow-lg p-3 rounded bg-white'>
            <h2>Penjualan Produk</h2>
            <div className='col-12 col-md-2 mb-2 mt-4 d-flex align-items-center gap-5'>
                <div>
                    <div className='d-flex align-items-center position-relative my-1 col-3'>
                        <i className="fas fa-search position-absolute ms-3"></i>
                        <input className="form-control w-200px ps-9"
                            placeholder='Search'
                            data-kt-user-table-filter="search"
                            value={searchValue}
                            onChange={handleSearchProduct}
                        >
                        </input>
                    </div>
                </div>
                <div className='col-3'>

                </div>
            </div>
            {searchValue && (
                <div className='card-title'>
                    <div
                        className='search-results position-absolute bg-white border rounded '
                        style={{ marginTop: '-15px', width: 'auto' }}
                    >
                        <ul className='list-group' style={{ marginBottom: '10px' }}>
                            <div
                                className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                                    Nama
                                </div>
                                <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                                    Data 1
                                </div>
                                <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                                    Data 2
                                </div>
                                <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                                    Data 3
                                </div>
                                <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                                    Data 4
                                </div>
                                <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                                    Data 5
                                </div>
                            </div>
                            {filteredData.length > 0 ? (
                                filteredData.map((item: searchproduk, index: number) => (
                                    <a
                                        key={item.id}
                                        style={{
                                            cursor: 'pointer',
                                            color: index === selectedIndex ? 'white' : 'black',
                                            // backgroundColor: index === selectedIndex ? '#34759a' : '',
                                        }}
                                        className='list-group-item d-flex justify-content-between align-items-center'
                                        onClick={() => {
                                            handleSelectProduct(item);
                                        }}
                                    >
                                        <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                            {item.nama_produk}
                                        </div>
                                        <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                            {item.data1}
                                        </div>
                                        <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                            {item.data2}
                                        </div>
                                        <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                            {item.data3}
                                        </div>
                                        <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                            {item.data4}
                                        </div>
                                        <div className='col ms-auto' style={{ flex: 1, minWidth: 100 }}>
                                            {item.data5}
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
            <div className="mb-10 mt-10">
                <label className="form-label">Nama Produk</label>
                <input
                    type="text"
                    className="form-control"
                    id="productName"
                // style={{ borderColor: 'black' }}
                />
            </div>
            <div className="mb-10">
                <label className="form-label">Penjualan Harian Sept 2023</label>
                <input
                    type="number"
                    className="form-control"
                    id="data1"
                // style={{ borderColor: 'black' }}
                />
            </div>
            <div className="mb-10">
                <label className="form-label">Penjualan Harian Oct 2023</label>
                <input
                    type="text"
                    className="form-control form-control-white"
                    id="data2"
                />
            </div>
            <div className="mb-10">
                <label className="form-label">Penjualan Harian Nov 2023</label>
                <input
                    type="text"
                    className="form-control form-control-white"
                    id="data3"
                />
            </div>
            <div className="mb-10">
                <label className="form-label">Penjualan Harian Des 2023</label>
                <input
                    type="text"
                    className="form-control form-control-white"
                    id="data4"
                />
            </div>
            <div className="mb-10">
                <label className="form-label">Penjualan Harian Jan 2024</label>
                <input
                    type="text"
                    className="form-control form-control-white"
                    id="data5"
                />
            </div>
            <div className="mb-10">
                <Button className='btn btn-success' onClick={handlePredict} >Prediksi</Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Prediksi Penjualan Produk Bulan Depan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <table className="table table-rounded table-flush">
                            <thead>
                                <tr className="fw-bold fs-7 text-danger border-bottom border-gray-500 py-4">
                                    <th className='text-dark'>Nama Produk</th>
                                    <th className='text-success'>Prediksi</th>
                                    <th className='text-danger'>MAPE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="py-5 fw-bolder  border-bottom border-gray-500 fs-4">
                                    <td>{predictedProductName}</td>
                                    <td>{Math.round(predictedSales)}</td>
                                    <td>{MAPE.toFixed(2)}%</td>
                                </tr>
                                <tr className="py-5 fw-bolder border-bottom border-gray-500 fs-4">
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    )
}

export default Prediksi