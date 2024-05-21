import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { addProductOut, refundHistory, showHistory, showSupplier, updateHistory } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { convertIDR } from '../../../functions/global';

interface Supplier {
    id: number;
    name: string;
}
interface StockOpname {
    id: number;
    // ... other properties
    product: {
        product_name: string;
        // ... other product properties
    };
    // ... other properties
}

const API_URL = process.env.REACT_APP_API_URL

const HistoryPage = () => {
    usePageTitle('History');

    const { product_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [expNotifState, setExpNotifState] = useState<{ [key: number]: boolean }>({});
    const [opnameToEdit, setOpnameToEdit] = useState<number | null>(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [newStokOpname, setNewStokOpname] = useState({
        hpp_price: 0,
        supplier_id: '',
        note: '',
    });
    const [refundToEdit, setRefundToEdit] = useState<number | null>(null);
    const [showEditRefund, setShowEditRefund] = useState(false);
    const [newRefund, setNewRefund] = useState({
        amount: 0,
        responsible: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!product_id) {
                return;
            }
            try {
                const historyData = await showHistory(parseInt(product_id, 10));
                setProductHistory(historyData);
            } catch (error) {
            }
        };

        fetchData();
        showSupplier().then((data) => {
            setSupplier(data);
        });

        const savedExpNotifState = JSON.parse(localStorage.getItem('expNotifState') || '{}');
        setExpNotifState(savedExpNotifState);
    }, []);

    useEffect(() => {
        if (showEditConfirmation && opnameToEdit !== null) {
            const selectedOpname = productHistory.stock_opnames.find((product: any) => product.id === opnameToEdit);

            if (selectedOpname) {
                setNewStokOpname({
                    hpp_price: selectedOpname.hpp_price,
                    supplier_id: selectedOpname.supplier_id,
                    note: selectedOpname.note,
                });
            }
        }
    }, [showEditConfirmation, opnameToEdit, productHistory]);



    return (
        <>
            <KTCard>
                <div className='container'>
                    <div className=' card-header border-0 mt-6'>
                        <div className='row gap-4 fw-bold'>
                            <div className='d-flex align-items-center position-relative'>
                                <i className="fas fa-search position-absolute ms-3"></i>
                                <input className="form-control w-200px ps-9"
                                    placeholder='Pencarian Produk'
                                    data-kt-user-table-filter="search"
                                >
                                </input>
                            </div>
                        </div>
                    </div>
                    {/* begin::Table container */}
                </div>
                <div className='card-body '>
                    <div className='table-responsive'>
                        {/* begin::Table */}
                        <table className='table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                            {/* begin::Table head */}
                            <thead>
                                <tr className='fw-bold text-bolder'>
                                    <th className='min-w-30px' >#</th>
                                    <th className='min-w-250px' >Nama Produk</th>
                                    <th className='min-w-30px'>Stok saat ini</th>
                                    <th className='min-w-30px'>Stok repack</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>Gula 1KG</td>
                                    <td>
                                        <div className='col-10 d-flex'>
                                            <input placeholder='' type="number" id="quantity"
                                                className="col form-control me-2"
                                                style={{ borderColor: 'black' }}
                                            />

                                        </div>
                                    </td>
                                    <td>
                                        <input placeholder='' type="number" id="quantity"
                                            className="col form-control"
                                            style={{ borderColor: 'black' }}
                                        />
                                    </td>
                                    <td>
                                        <div className='d-flex align-items-center position-relative'>
                                            <i className="fas fa-search position-absolute ms-3"></i>
                                            <input className="form-control w-200px ps-9"
                                                placeholder='Pencarian Produk'
                                                data-kt-user-table-filter="search"
                                            >
                                            </input>
                                        </div>
                                    </td>

                                </tr>
                                {/* <tr>
                                    <td>
                                        <div className='col-2 mt-8' style={{ alignContent: 'end' }}>
                                            <Button><span> Simpan</span> </Button>
                                        </div>
                                    </td>
                                </tr> */}
                            </tbody>
                            {/* end::Table body */}
                        </table>
                    </div>
                </div>
                <div className='d-flex align-items-center position-relative'>
                    <i className="fas fa-search position-absolute ms-3"></i>
                    <input className="form-control w-200px ps-9"
                        placeholder='Pencarian Produk'
                        data-kt-user-table-filter="search"
                    >
                    </input>
                </div>
                <div className="d-flex justify-content-end col-11">
                    <button className='btn btn-info mb-4' >Simpan</button>
                </div>

            </KTCard>
        </>
    )
}

export default HistoryPage