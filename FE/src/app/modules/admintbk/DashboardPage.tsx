import React, { useState, useEffect } from 'react';
import usePageTitle from '../../functions/global/usePageTitle';
import { ChartsWidget1, ChartsWidget2 } from '../../../_metronic/partials/widgets';
import { showDashboard, showNotif, showNotifDetail } from '../../functions/global/api';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL

interface DashboardData {
    total_transaction: number;
    total_request_retur: number;
    total_retur: number;
}

const DashboardPage = () => {
    usePageTitle('Dashboard');

    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [notif, setNotif] = useState<any[]>([]);
    const [detail, setDetail] = useState<any | null>(null);
    const [showProdukConfirmation, setShowProdukConfirmation] = useState(false);
    const [produkToProduk, setProdukToProduk] = useState<number | null>(null);

    const showData = () => {
        showDashboard()
            .then(data => {
                setDashboard(data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    };
    const shownotif = () => {
        showNotif()
            .then(data => {
                setNotif(data);
                // console.log('Product History Data:', data);
            })
            .catch(error => {
                console.error('error:', error)
            });
    }

    useEffect(() => {
        showData();
        shownotif();
    }, []);

    const showNotificationDetail = (notification_id: number) => {
        showNotifDetail(notification_id)
            .then(data => {
                setDetail(data);
                setProdukToProduk(notification_id);
                setShowProdukConfirmation(true);
            })
            .catch(error => {
                console.error('Error fetching notification details:', error);
            });
    };
    const readData = (notification_id: number, type: string) => {
        const combinedType = type === 'expired' ? 'expired' : 'return';

        axios
            .get(`${API_URL}/notification/${notification_id}/${combinedType}/read`)
            .then(response => {
                console.log('Notification marked as read:', response.data);
                setNotif(prevNotif =>
                    prevNotif.map(item => {
                        if (item.id === notification_id) {
                            return { ...item, isRead: true };
                        }
                        return item;
                    })
                );
                navigate('/permintaanreturn');
                const productId = response.data.productId;
                if (productId) {
                    navigate(`/permintaanreturn/${productId}`);
                }
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
    };
    // const readData = (notification_id: number, type: string) => {
    //     const combinedType = type === 'expired' ? 'expired' : 'return';

    //     axios
    //         .get(`${API_URL}/notification/${notification_id}/${combinedType}/read`)
    //         .then(response => {
    //             console.log('Notification marked as read:', response.data);
    //             setNotif(prevNotif =>
    //                 prevNotif.map(item => {
    //                     if (item.id === notification_id) {
    //                         return { ...item, isRead: true };
    //                     }
    //                     return item;
    //                 })
    //             );

    //             // Extract productId from the response
    //             const productId = response.data.productId;

    //             // Check conditions and navigate accordingly
    //             if (type === 'expired') {
    //                 navigate('/allproduk');
    //             } else if (type === 'return') {
    //                 navigate('/permintaanreturn');
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error marking notification as read:', error);
    //         });
    // };

    const openProdukConfirmation = (notification_id: number) => {
        showNotificationDetail(notification_id);
        setProdukToProduk(notification_id);
        setShowProdukConfirmation(true);
    };
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
    };

    return (
        <div className="container">
            <div>
                <section className="content-header content-header-custom">
                    <h1>SELAMAT DATANG ADMIN</h1>
                </section>
            </div>
            <div>
                <section className="content-header content-header-custom mt-10" >
                    <h3 >Data Produk Return/Kadaluarsa</h3>
                </section>
            </div>
            <div className="table-responsive">
                <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                    {/* begin::Table head */}
                    <thead>
                        <tr className='fw-bold text-muted'>
                            <th align='center' className='min-w-30px'>No</th>
                            <th className='min-w-150px'>Keterangan Kadaluarsa</th>
                            <th className='min-w-140px'>Keterangan Produk</th>
                            <th className='min-w-140px'>Aksi</th>
                        </tr>
                    </thead>
                    {/* end::Table head */}
                    {/* begin::Table body */}
                    <tbody>
                        {notif.map((notif, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td >
                                    {/* <button type="button" className="btn btn-text" onClick={() => openProdukConfirmation(notif.id)}> */}
                                    <a style={{ cursor: 'pointer' }} onClick={() => openProdukConfirmation(notif.id)}>{notif.title}</a>
                                </td>
                                <td>{notif.description}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm"
                                        onClick={() => readData(notif.id, 'combined')}
                                        disabled={notif.isRead}
                                    >Baca</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                    {/* end::Table body */}
                </table>
            </div>

            <div className="row g-4 my-10">
                <div className="col-lg-4 col-md-6">
                    <div className="card bg-success">
                        <div className="card-body text-white">
                            {/* <h1 className="total_sell" style={{ color: 'aliceblue' }}>Rp 0</h1> */}
                            <h3 className="text-white">
                                <strong>{dashboard && dashboard.total_transaction} Produk Terjual</strong>
                            </h3>
                            {/* <p>Penjualan tgl 01-10 Oktober</p> */}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card bg-warning">
                        <div className="card-body text-white">
                            {/* <h1 className="total_sell" style={{ color: 'aliceblue' }}>Rp 0</h1> */}
                            <h3 className="text-white">
                                <strong>{dashboard && dashboard.total_request_retur} Permintaan Return</strong>
                            </h3>
                            {/* <p>Penjualan tgl 01-10 Oktober</p> */}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card bg-primary">
                        <div className="card-body text-white">
                            {/* <h1 className="total_sell" style={{ color: 'aliceblue' }}>Rp 0</h1> */}
                            <h3 className="text-white">
                                <strong>{dashboard && dashboard.total_retur} Produk Return</strong>
                            </h3>
                            {/* <p>Penjualan tgl 01-10 Oktober</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="box-header">
                <ChartsWidget1 title='Transaksi Harian' className={'mb-5 mb-xxl-8'} />
            </div>
            <div className="box-header">
                <ChartsWidget2 title='Transaksi Bulanan' className={'mb-5 mb-xxl-8'} />
            </div>

            {/* modal */}
            {showProdukConfirmation && produkToProduk !== null && (
                <Modal show={showProdukConfirmation} onHide={() => setShowProdukConfirmation(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Produk Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-2">
                                <label className="col-form-label">Nama Produk:</label>
                                <input
                                    type="text"
                                    className="form-control mb-4"
                                    value={detail?.data?.product?.product_name || ''}
                                    disabled
                                />
                                <label className="col-form-label">Kategori:</label>
                                <input
                                    type="text"
                                    className="form-control mb-4"
                                    value={detail?.data?.product?.category?.category_name || ''}
                                    disabled
                                />
                                <label className="col-form-label">Stok:</label>
                                <input
                                    type="text"
                                    className="form-control mb-4"
                                    value={detail?.data?.product?.stock || ''}
                                    disabled
                                />
                                <label className="col-form-label">Tanggal Kadaluarsa:</label>
                                <input
                                    type="text"
                                    className="form-control mb-4"
                                    value={formatDate(detail?.data?.stock_opname?.expired_date || '')}
                                    disabled
                                />
                                <label className="col-form-label">Tanggal Kadaluarsa:</label>
                                <input
                                    type="text"
                                    className="form-control mb-4"
                                    value={detail?.data?.stock_opname?.note || ''}
                                    disabled
                                />

                            </div>

                        </form>
                    </Modal.Body>
                </Modal>
            )}

        </div>


    )
}

export default DashboardPage
