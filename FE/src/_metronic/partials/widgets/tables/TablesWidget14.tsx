import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { TablesWidget13 } from "./TablesWidget13";

type Props = {
    className: string
}

interface Item {
    id: number;
    label: string;
}

const TablesWidget14: React.FC<Props> = ({ className }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [items, setItems] = useState<Item[]>([
        { id: 1, label: 'Produk 1' },
        { id: 2, label: 'Produk 2' },
        { id: 3, label: 'Produk 3' },
        // Tambahkan item lain sesuai kebutuhan
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleItemSelect = (item: Item) => {
        setSelectedItem(item);
        setSearchText(item.label);
    };

    const filteredItems = items.filter((item: any) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className={`card ${className}`}>
            <div className='card-header border-0 pt-6'>

                <div aria-hidden="false" data-bs-backdrop="static" >
                    <div className="modal-dialog modal-dialog-scrollable" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" >Input Withdrawal</h1>
                                <button id={'hide'} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                    onClick={() => {
                                        // callbackNo()
                                    }}></button>
                            </div>
                            <div className="modal-body">

                                <div className='row'>

                                    <div className='col-12 mb-2 '>
                                        <label className='mb-2'>statusDeliveryCode</label>
                                        <input className='form-control' type='text' value={""} name='statusDeliveryCode' onChange={(e) => console.log(e)} disabled={true} />
                                    </div>
                                    <div className='col-12 mb-2 '>
                                        <label className='mb-2'>statusDeliveryDesc</label>
                                        <input className='form-control' type='text' value={""} name='statusDeliveryDesc' onChange={(e) => console.log(e)} disabled={true} />
                                    </div>

                                    <div className='col-12 mb-2 '>
                                        <label className='mb-2'>Status Approval</label>
                                        <select className="form-select" value={""} name='modeProcess' onChange={(e) => console.log(e)}>
                                            <option value="WAIT_CONFIRM">Pending</option>
                                            {/* <option value="CONFIRMED">Confirmed</option> */}
                                            <option value="ON_PACKING">Packing</option>
                                            <option value="WAIT_PICKUP">Wait Pickup</option>
                                            <option value="PICKED_UP">Pickup</option>
                                            <option value="ON_DELIVERY">Delivery</option>
                                            <option value="RECEIVED">Delivered</option>
                                            <option value="CANCELED">Canceled</option>
                                            {/* <option value="10">Return</option> */}
                                            <option value="RETURN_PROCESS">Return Process</option>
                                            <option value="RETURN_COMPLETE">Return Complete</option>
                                            <option value="COD_TO_REG">COD to REG</option>
                                            <option value="DAMAGE_OR_LOST">Paket Rusak / Hilang</option>
                                            <option value="PROCESS_CLAIM">Proses Claim</option>
                                            <option value="CLAIMED_DAMAGE_OR_LOST">Berhasil Claim</option>
                                            <option value="INVALID_AWB">Invalid Awb</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
                                    // callbackNo()
                                    // document.getElementById('hide' + idModal).click();
                                }}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={(e) => {
                                    // saveData()
                                }}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  */}
                <div className='col-3 mb-2 '>
                    <label className='mb-2'>Status Approval</label>
                    <select className="form-select" value={""} name='modeProcess' onChange={(e) => console.log(e)}>
                        <option value="WAIT_CONFIRM">Pending</option>
                        {/* <option value="CONFIRMED">Confirmed</option> */}
                        <option value="ON_PACKING">Packing</option>
                        <option value="WAIT_PICKUP">Wait Pickup</option>
                        <option value="PICKED_UP">Pickup</option>
                        <option value="ON_DELIVERY">Delivery</option>
                        <option value="RECEIVED">Delivered</option>
                        <option value="CANCELED">Canceled</option>
                        {/* <option value="10">Return</option> */}
                        <option value="RETURN_PROCESS">Return Process</option>
                        <option value="RETURN_COMPLETE">Return Complete</option>
                        <option value="COD_TO_REG">COD to REG</option>
                        <option value="DAMAGE_OR_LOST">Paket Rusak / Hilang</option>
                        <option value="PROCESS_CLAIM">Proses Claim</option>
                        <option value="CLAIMED_DAMAGE_OR_LOST">Berhasil Claim</option>
                        <option value="INVALID_AWB">Invalid Awb</option>
                    </select>
                </div>
            </div>
            <div>
                <div className='card-body py-3'>
                    {/* begin::Table container */}
                    <div className='table-responsive'>
                        {/* begin::Table */}
                        <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                            {/* begin::Table head */}
                            <thead>
                                <tr className='fw-bold text-muted'>
                                    <th align='center' className='min-w-30px'>
                                        NO
                                    </th>
                                    <th className='min-w-150px'>Kode</th>
                                    <th className='min-w-120px'>Nama Product</th>
                                    <th className='min-w-140px'>Tanggal</th>
                                    {/* <th className='min-w-120px'>Jumlah</th> */}
                                    <th className='min-w-120px'>Jumlah</th>
                                    <th className='min-w-120px'>Harga </th>
                                    <th className='min-w-120px'>Diskon </th>
                                    <th className='min-w-120px'>Sub Total</th>
                                </tr>
                            </thead>
                            {/* end::Table head */}
                            {/* begin::Table body */}
                            <tbody>
                                {Array.from(Array(10).keys()).map((val: number) => (
                                    <tr key={val}>
                                        <td align='center'>
                                            {val + 1}
                                        </td>
                                        <td>
                                            <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                                                8992753722747
                                            </a>
                                        </td>
                                        <td>
                                            <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                17 September 2023 13:34:34
                                            </a>
                                            <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: PH</span>
                                        </td>

                                        <td>
                                            <a href='#' className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                                                DAPUR KITA KALDU RASA JAMUR 1OGR
                                            </a>
                                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                    Web, UI/UX Design
                                </span> */}
                                        </td>
                                        <td align='center' className='text-dark fw-bold text-hover-primary fs-6'>2
                                        </td>
                                        <td>
                                            <span className='badge badge-light-success'>Rp.100.000,00</span>
                                        </td>
                                        <td>
                                            <span className='badge badge-light-success'>Rp.100.000,00</span>
                                        </td>
                                        <td>
                                            <span className='badge badge-light-success'>Rp.200.000,00</span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                            {/* end::Table body */}
                        </table>
                        {/* end::Table */}
                    </div>
                    {/* end::Table container */}
                </div>
            </div>
        </div>
    )
}

export { TablesWidget14 }