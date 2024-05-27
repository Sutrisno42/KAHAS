import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { showDetailTransaksi } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { convertDate, convertIDR } from '../../../functions/global';
import jsPDF from 'jspdf';
import logo from '../../../../_metronic/assets/img/logo3.png'

interface DetailTransaksiPageProps {
    idmember: string;
    defaultdis: any;
    // ... other props
}

const DetailTransaksiPage: React.FC<DetailTransaksiPageProps> = ({ idmember, defaultdis, }) => {
    usePageTitle('Detail Transaksi');

    const { transaction_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});


    useEffect(() => {
        const fetchData = async () => {
            if (!transaction_id) {
                return;
            }
            try {
                const historyData = await showDetailTransaksi(parseInt(transaction_id, 10));
                console.log('Product History Data:', historyData);
                setProductHistory(historyData);
            } catch (error) {
            }
        };

        fetchData();

    }, [transaction_id]);

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

        pdf.text(`No Nota: ${productHistory.data?.nota_number}`, 2, 37);
        pdf.text(`Kasir     : ${productHistory.data?.cashier?.name}`, 2, 40);
        pdf.text(`Tgl        : ${convertDate(productHistory.data?.date)}`, 2, 43);

        const dashLength = 1;
        const gapLength = 1;
        let currentX = 1;
        const endX = pageWidth - 1;

        const lineHeight = 2;
        let currentY = 45;

        if (productHistory.data?.details) {
            productHistory.data.details.forEach((details: any, index: number) => {
                currentX = 1;
                while (currentX < endX) {
                    pdf.line(currentX, currentY, currentX + dashLength, currentY);
                    currentX += dashLength + gapLength;
                }
                pdf.text(`${details.product_name}`, 2, currentY + 3);
                pdf.text(`${details.quantity} x ${convertIDR(details.price)} `, 2, currentY + 8);
                pdf.text(`${convertIDR(details.sub_total)}`, pageWidth - 5, currentY + 8, { align: 'right' });
                currentY += 10;
            });
        }

        currentX = 1;

        while (currentX < endX) {
            pdf.line(currentX, currentY, currentX + dashLength, currentY);
            currentX += dashLength + gapLength;
        }

        const totalItems = productHistory.data?.details?.length || 0;
        const receiptHeight = currentY + 10 + totalItems * 15;

        pdf.text(`Jml Barang: `, 2, currentY + 5);
        pdf.text(`${productHistory.data?.total}`, pageWidth - 5, currentY + 5, { align: 'right' });

        pdf.text(`Tipe Bayar:`, 2, currentY + 8);
        pdf.text(`${productHistory.data?.payment_method}`, pageWidth - 5, currentY + 8, { align: 'right' });

        pdf.text(`Tunai: `, 2, currentY + 11);
        pdf.text(`${convertIDR(productHistory.data?.cash)}`, pageWidth - 5, currentY + 11, { align: 'right' });

        pdf.text(`Transfer: `, 2, currentY + 14);
        pdf.text(`${convertIDR(productHistory.data?.transfer)}`, pageWidth - 5, currentY + 14, { align: 'right' });

        pdf.text(`Diskon: `, 2, currentY + 17);
        pdf.text(`${convertIDR(productHistory.data?.discount)}`, pageWidth - 5, currentY + 17, { align: 'right' });

        if (idmember !== "") {
            // const jum = def * details.sub_total;
            // Mulai menuliskan teks di dokumen PDF
            pdf.text(`Member Diskon:`, 2, currentY + 20);
            // Menuliskan nilai diskon dengan menggunakan fungsi convertIDR
            pdf.text(`${productHistory.data?.member?.default_discount}%`, pageWidth - 5, currentY + 20, { align: 'right' });
            pdf.text(`Kembalian: `, 2, currentY + 23);
            pdf.text(`${convertIDR(productHistory.data?.change)}`, pageWidth - 5, currentY + 23, { align: 'right' });

            pdf.setFontSize(6);
            pdf.text('Maaf barang yang sudah dibeli', pageWidth / 2, currentY + 27, { align: 'center' });
            pdf.text('tidak dapat ditukar atau kembalikan', pageWidth / 2, currentY + 29, { align: 'center' });
            // pdf.text('kan', pageWidth / 2, currentY + 31, { align: 'center' });
            pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 31, { align: 'center', });
            pdf.text('https://projotech.id/', pageWidth / 2, currentY + 34, { align: 'center', });
        } else {
            pdf.text(`Kembalian: `, 2, currentY + 20);
            pdf.text(`${convertIDR(productHistory.data?.change)}`, pageWidth - 5, currentY + 20, { align: 'right' });

            pdf.setFontSize(6);
            pdf.text('Maaf barang yang sudah dibeli', pageWidth / 2, currentY + 25, { align: 'center' });
            pdf.text('tidak dapat ditukar atau kembalikan', pageWidth / 2, currentY + 28, { align: 'center' });
            // pdf.text('kan', pageWidth / 2, currentY + 31, { align: 'center' });
            pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 31, { align: 'center', });
            pdf.text('https://projotech.id/', pageWidth / 2, currentY + 34, { align: 'center', });
        }

        pdf.autoPrint();
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);

        // Create an iframe element to load the PDF
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;

        // Append the iframe to the body
        document.body.appendChild(iframe);

        // Wait for the PDF to load in the iframe
        iframe.onload = () => {
            // Print the PDF
            iframe.contentWindow?.print();

            // Remove the iframe from the DOM
            // setTimeout(() => {
            //     document.body.removeChild(iframe);
            //     URL.revokeObjectURL(url);
            // }, 100);
        };

    };


    return (
        <>
            <KTCard>
                <div className='card pt-6'>
                    <div className=' card-header border-0'>
                        <div className='row gap-4 fw-bold' style={{ display: 'flex' }}>
                            <div className="col-8">
                                <h1>Informasi Transaksi</h1>
                            </div>

                            <div className='col-2'>
                                <Button onClick={handlePrintReceipt}>
                                    <i className="bi bi-printer"></i>Cetak Nota</Button>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text">Kasir : {productHistory.data?.cashier?.name}</p>
                                            <p className="card-text">Toko : {productHistory.data?.cashier?.store?.store_name}</p>
                                            <p className="card-text">No Nota : {productHistory.data?.nota_number}</p>
                                            <p className="card-text">Tanggal : {productHistory.data?.date}</p>
                                            <p className="card-text">Jam : {productHistory.data?.hour}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text">Status : {productHistory.data?.status}</p>
                                            <p className="card-text">Metode Pembayaran : {productHistory.data?.payment_method}</p>
                                            {/* <p className="card-text">Jumlah : {productHistory.data?.total}</p> */}
                                            <p className="card-text">Grand Total : {convertIDR(productHistory.data?.grand_total)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' card-header border-0'>
                                <h1>Detail Produk</h1>
                            </div>
                            <div className='table-responsive' style={{ overflowX: 'auto' }}>
                                {/* begin::Table */}
                                <table className=' table table-striped table-row-bordered table-row-white-100 align-middle gs-0 gy-3'>
                                    {/* begin::Table head */}
                                    <thead>
                                        <tr className='fw-bold text-muted'>
                                            <th className='min-w-30px'>
                                                NO
                                            </th>
                                            <th className='min-w-30px'>Kode</th>
                                            <th className='min-w-30px'>Nama Produk</th>
                                            <th className='min-w-30px'>Harga</th>
                                            <th className='min-w-30px'>Jumlah</th>
                                            <th className='min-w-30px'>Diskon (RP)</th>
                                            <th className='min-w-30px'>Subtotal</th>
                                        </tr>
                                    </thead>
                                    {/* end::Table head */}
                                    {/* begin::Table body */}
                                    <tbody>
                                        {productHistory.data?.details &&
                                            productHistory.data.details.map((details: any, index: number) => (
                                                <tr key={details.id}>
                                                    <td>{index + 1}</td>
                                                    <td className='text-dark fw-bold'>
                                                        {details.product_code}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {details.product_name}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {convertIDR(details.price)}
                                                    </td>
                                                    <td className='text-dark fw-bold'>
                                                        {/* {stockOpname.supplier?.name} */}
                                                        {details.quantity}
                                                    </td>
                                                    <td>
                                                        {convertIDR(details.discount)}
                                                    </td>
                                                    <td>
                                                        {convertIDR(details.sub_total)}
                                                    </td>

                                                </tr>
                                            ))}

                                    </tbody>
                                    {/* <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>TOTAL</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.total)}
                                            </td>
                                        </tr>
                                    </tbody> */}
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Diskon member(Rp)</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {productHistory.data?.member?.default_discount}%
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>GRAND TOTAL</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.grand_total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Bayar</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {/* Rp {productHistory.data?.cash} */}
                                                {productHistory.data?.payment_method === 'cash' && (
                                                    <>
                                                        {convertIDR(productHistory.data?.cash)}
                                                    </>
                                                )}
                                                {productHistory.data?.payment_method === 'transfer' && (
                                                    <>
                                                        {convertIDR(productHistory.data?.transfer)}
                                                    </>
                                                )}
                                                {productHistory.data?.payment_method === 'qris' && (
                                                    <>
                                                        {convertIDR(productHistory.data?.qris)}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Kembali</h3></td>
                                            <td className=''>
                                                {convertIDR(productHistory.data?.change)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    </div>
                    {/* tabel */}

                </div>
            </KTCard>
        </>
    )
}

export default DetailTransaksiPage