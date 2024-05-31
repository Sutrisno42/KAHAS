import React, { useEffect, useState } from 'react'
import usePageTitle from '../../functions/global/usePageTitle';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { KTCard } from '../../../_metronic/helpers';
import { useAuth } from '../auth';
import { GetRecap, postRecap } from '../../functions/global/api';
import { Interface } from 'readline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import logo from '../../../_metronic/assets/img/logo3.png'
import 'jspdf-autotable';


interface CashierData {
    cashier_id: number;
    cashier_name: string;
    discount_cash: number;
    discount_qris: number;
    discount_total: number;
    discount_transfer: number;
    end_date: string;
    end_time: string;
    nota_total: number;
    retur_nominal: number;
    retur_total: number;
    start_date: string;
    start_time: string;
    total_cash: number;
    total_qris: number;
    total_transaction: number;
    total_transfer: number;
}


const ShiftRecapPage = () => {
    usePageTitle('Rekap Shift');

    const { currentUser, logout } = useAuth()
    const [data, setdata] = useState<CashierData | null | any>([]);
    const [currentTime, setCurrentTime] = useState<string | undefined>(undefined);

    useEffect(() => {
        getdatarekap();
    }, []);
    const getdatarekap = async () => {
        const res = await GetRecap();
        console.log('data', res)
        setdata(res.data)
        const dat = localStorage.getItem('drawer');
        if (dat != null) {
            setCurrentTime(dat)
        }
    }
    const handleout = async () => {
        const res = await postRecap(data);
        if (res.status === 'success') {
            handlePrintReceipt();
            logout();
            console.log('res', res.data);

        }
    }
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const handlePrintReceipt = () => {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [48, 210],
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 10;
        const logoHeight = 10;
        const logoX = 20;
        const logoY = 10;

        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

        pdf.setFontSize(8);

        pdf.text('D Hardjosoewarno', pageWidth / 2, 23, { align: 'center' });
        pdf.text('Jl Parangtritis no.133, Brontok', pageWidth / 2, 26, { align: 'center' });
        pdf.text('usuman, Yogyakarta', pageWidth / 2, 29, { align: 'center' });
        pdf.text('081390408934', pageWidth / 2, 32, { align: 'center' });

        pdf.text('Rekap Shift', 2, 38);
        // pdf.text(`Kasir           : ${data?.cashier_name}`, 2, 41);
        // pdf.text(`Modal Awal      : ${currentTime}`, 2, 44);
        // pdf.text(`Tanggal         : ${data?.start_date}`, 2, 47);
        // pdf.text(`Jam Mulai        : ${data?.start_time}`, 2, 50);
        // pdf.text(`Transaksi Cash   : ${data?.total_cash}`, 2, 53);
        // pdf.text(`Transaksi QRS    : ${data?.total_qris}`, 2, 57);
        // pdf.text(`Transaksi EDC    : ${data?.total_transfer}`, 2, 60);
        // pdf.text(`Diskon Cash      : ${data?.discount_cash}`, 2, 63);
        // pdf.text(`Diskon QRS       : ${data?.discount_qris}`, 2, 66);
        // pdf.text(`Diskon EDC       : ${data?.discount_transfer}`, 2, 69);


        // pdf.text(`Return: ${data?.retur_nominal}`, 2, 72);
        // pdf.text(`Total Transaksi: ${data?.total_transaction}`, 2, 75);

        // pdf.text(`Total Nota: ${data?.nota_total}`, 2, 79);
        const columnWidth = 80; // Lebar kolom
        const startX = 2; // Mulai dari posisi x: 2
        let ccy = 41; // Mulai dari posisi y: 41

        // Fungsi untuk menambahkan teks dengan spasi di sekitarnya
        const addJustifiedText = (text: string) => {
            const splitText = pdf.splitTextToSize(text, columnWidth);
            pdf.text(splitText, startX, ccy);
            ccy += pdf.getTextDimensions(text).h + 3;
        };

        // Tambahkan teks dengan spasi di sekitarnya
        addJustifiedText(`Kasir                     : ${data?.cashier_name}`);
        addJustifiedText(`Modal Awal          : Rp ${currentTime}`);
        addJustifiedText(`Tanggal                : ${data?.start_date}`);
        addJustifiedText(`Jam Mulai             : ${data?.start_time}`);
        addJustifiedText(`Jam Berakhir        : ${data?.end_time}`);
        addJustifiedText(`Transaksi Cash    : Rp ${data?.total_cash?.toLocaleString() || 0}`);
        addJustifiedText(`Transaksi QRS     : Rp ${data?.total_qris?.toLocaleString() || 0}`);
        addJustifiedText(`Transaksi EDC     : Rp ${data?.total_transfer?.toLocaleString() || 0}`);
        // addJustifiedText(`Diskon Transaksi : Rp ${data?.discount_payment?.toLocaleString() || 0}`);
        addJustifiedText(`Total Diskon         : Rp ${data?.discount_total?.toLocaleString() || 0}`);
        // addJustifiedText(`Diskon EDC       : ${data?.discount_transfer}`);

        addJustifiedText(`Return                  : ${data?.retur_nominal}`);
        addJustifiedText(`Total Transaksi    : Rp ${data?.total_transaction?.toLocaleString() || 0}`);
        addJustifiedText(`Total Nota            : ${data?.nota_total}`);

        const dashLength = 1;
        const gapLength = 1;
        let currentX = 1;
        const endX = pageWidth - 1;

        const lineHeight = 2;
        let currentY = 60;

        // if (productHistory.data?.details) {
        //     productHistory.data.details.forEach((details: any, index: number) => {
        //         currentX = 1;
        //         while (currentX < endX) {
        //             pdf.line(currentX, currentY, currentX + dashLength, currentY);
        //             currentX += dashLength + gapLength;
        //         }
        //         pdf.text(`${details.product_name}`, 2, currentY + 3);
        //         pdf.text(`${details.quantity} x ${convertIDR(details.price)} `, 2, currentY + 8);
        //         pdf.text(`${convertIDR(details.sub_total)}`, pageWidth - 5, currentY + 8, { align: 'right' });
        //         currentY += 10;
        //     });
        // }

        // currentX = 1;

        // while (currentX < endX) {
        //     pdf.line(currentX, currentY, currentX + dashLength, currentY);
        //     currentX += dashLength + gapLength;
        // }

        // const totalItems = productHistory.data?.details?.length || 0;
        // const receiptHeight = currentY + 10 + totalItems * 15;

        // pdf.text(`Jml Barang: `, 2, currentY + 5);
        // pdf.text(`${productHistory.data?.total}`, pageWidth - 5, currentY + 5, { align: 'right' });

        // pdf.text(`Tipe Bayar: `, 2, currentY + 8);
        // pdf.text(`${productHistory.data?.payment_method}`, pageWidth - 5, currentY + 8, { align: 'right' });

        // pdf.text(`Tunai: `, 2, currentY + 11);
        // pdf.text(`${convertIDR(productHistory.data?.cash)}`, pageWidth - 5, currentY + 11, { align: 'right' });

        // pdf.text(`Diskon: `, 2, currentY + 14);
        // pdf.text(`${convertIDR(productHistory.data?.discount)}`, pageWidth - 5, currentY + 14, { align: 'right' });

        // pdf.text(`Kembalian: `, 2, currentY + 17);
        // pdf.text(`${convertIDR(productHistory.data?.change)}`, pageWidth - 5, currentY + 17, { align: 'right' });

        pdf.setFontSize(6);
        // pdf.text('Maaf barang yang sudah dibeli', pageWidth / 2, currentY + 22, { align: 'center' });
        // pdf.text('tidak dapat ditukar atau kembalikan', pageWidth / 2, currentY + 25, { align: 'center' });
        pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 60, { align: 'center', });
        pdf.text('https://projotech.id/', pageWidth / 2, currentY + 63, { align: 'center', });


        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
            newWindow.onload = () => {
                newWindow.print();

                // Add a delay before closing the window (e.g., 3 seconds)
                // setTimeout(() => {
                //     newWindow.close();
                // }, 3000); // 3000 milliseconds = 3 seconds
            };
        } else {
            alert('Cannot open a new window. Make sure popups are not blocked.');
        }
    };
    return (
        <>
            <KTCard>
                <div className='container px-12 pt-6 '>
                    <h2 className='text-center mb-8'>Rekap Shift</h2>
                    <div className="d-flex justify-content-center mb-6">
                        <Form style={{
                            width: "720px"
                        }}>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Nama Kasir</Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text" disabled value={data?.cashier_name || ''}

                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Modal Awal </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text" disabled value={"Rp " + currentTime || "Rp " + '0'}

                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formGroupEmail">
                                <Form.Label column sm="4" className="fw-bold">Tanggal</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={data?.start_date} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Jam Mulai</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={data?.start_time} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" className="fw-bold">Jam Berakhir</Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text" value={data?.end_time} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Transaksi Cash</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={"Rp " + (data?.total_cash?.toLocaleString() || 0)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Transaksi QRS</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={"Rp " + (data?.total_qris?.toLocaleString() || 0)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Transaksi EDC / Transfer</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={"Rp " + (data?.total_transfer?.toLocaleString() || 0)} />
                                </Col>
                            </Form.Group>
                            {/* <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Diskon Transaksi</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={"Rp " + (data?.discount_transaction?.toLocaleString() || 0)} />
                                </Col>
                            </Form.Group> */}
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Total Diskon</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={"Rp " + (data?.discount_total?.toLocaleString() || 0)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Return</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={data?.retur_nominal} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Total Transaksi</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled value={"Rp " + (currentTime ? ((data?.total_transaction ?? 0)).toLocaleString() : '0')} type="text" />
                                </Col>
                            </Form.Group>
                            {/* <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Cash Drawer</Form.Label>
                                <Col sm="8">
                                    <Form.Control type="number" placeholder="Input here..." />
                                </Col>
                            </Form.Group> */}
                            {/* <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Selisih Cash Drawer</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" placeholder="Rp.100.000,00" />
                                </Col>
                            </Form.Group> */}
                            <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Total Nota</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" value={data?.nota_total} />
                                </Col>
                            </Form.Group>
                            {/* <Form.Group as={Row} className="mb-3" controlId="formGroupPassword">
                                <Form.Label column sm="4" clasaName="fw-bold">Saldo Awal</Form.Label>
                                <Col sm="8">
                                    <Form.Control disabled type="text" placeholder="Rp.200.000,00" />
                                </Col>
                            </Form.Group> */}
                            <div className="d-flex justify-content-center mt-8">
                                <Button variant="primary" size="lg" onClick={handleout}>
                                    Simpan & Log Out
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <ToastContainer position="top-right" autoClose={2000} />
            </KTCard>
        </>

    )
}

export default ShiftRecapPage