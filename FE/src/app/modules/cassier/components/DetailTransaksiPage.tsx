import React, { useEffect, useState } from 'react'
import usePageTitle from '../../../functions/global/usePageTitle';
import { Button, Modal } from 'react-bootstrap'
import { KTCard } from '../../../../_metronic/helpers';
import { showDetailTransaksi } from '../../../functions/global/api';
import { useParams } from 'react-router-dom';
import { convertDate, convertIDR } from '../../../functions/global';
import jsPDF from 'jspdf';
import logo from '../../../../_metronic/assets/img/logo3.png'



const DetailTransaksiPage = () => {
    usePageTitle('Detail Transaksi');

    const { transaction_id } = useParams();
    const [productHistory, setProductHistory] = useState<any>({});

    const calculateDiscount = (originalPrice: any,discountPercentage: any,numberOfItems: any) => {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const totalDiscount = discountAmount * numberOfItems;
        const totalPrice = originalPrice * numberOfItems - totalDiscount;
        return totalDiscount;
      };
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

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
    };
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
        pdf.text(`Kasir  : ${productHistory.data?.cashier?.name}`, 2, 40);
        pdf.text(`Tgl    : ${convertDate(productHistory.data?.date)}`, 2, 43);

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
        
        pdf.text(`GrandTotal: `, 2, currentY + 8);
        pdf.text(`${convertIDR(productHistory.data?.grand_total)}`, pageWidth - 5, currentY + 8, { align: 'right' });

        pdf.text(`Tipe Bayar:`, 2, currentY + 14);
        pdf.text(`${productHistory.data?.payment_method === 'split' ? productHistory.data?.payment_method :
        productHistory.data?.cash >0 ? 'Cash':productHistory.data?.qris > 0 ? 'QRIS':'EDC / Transfer '}`,  pageWidth - 5, currentY + 14, { align: 'right' });

        pdf.text(`Tunai: `, 2, currentY + 17);
        pdf.text(`${convertIDR(productHistory.data?.cash)}`, pageWidth - 5, currentY + 17, { align: 'right' });

        pdf.text(`Transfer: `, 2, currentY + 20);
        pdf.text(`${convertIDR(productHistory.data?.transfer)}`, pageWidth - 5, currentY + 20, { align: 'right' });

        pdf.text(`QRIS: `, 2, currentY + 23);
        pdf.text(`${convertIDR(productHistory.data?.qris)}`, pageWidth - 5, currentY + 23, { align: 'right' });

        pdf.text(`Diskon: `, 2, currentY + 11);
        pdf.text(`${convertIDR(productHistory.data?.discount)}`,  pageWidth - 5, currentY + 11, { align: 'right' });

        pdf.text(`Kembalian: `, 2, currentY + 26);
        pdf.text(`${convertIDR(productHistory.data?.change)}`,  pageWidth - 5, currentY + 26, { align: 'right' })

        pdf.setFontSize(6);
        pdf.text('Maaf barang yang sudah dibeli', pageWidth / 2, currentY + 29, { align: 'center' });
            pdf.text('tidak dapat ditukar atau kembalikan', pageWidth / 2, currentY + 31, { align: 'center' });
            // pdf.text('kan', pageWidth / 2, currentY + 31, { align: 'center' });
            pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 34, { align: 'center', });
            pdf.text('https://projotech.id/', pageWidth / 2, currentY + 37, { align: 'center', });


        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
            newWindow.onload = () => {
                newWindow.print();

                // Add a delay before closing the window (e.g., 3 seconds)
                // setTimeout(() => {
                //     newWindow.close();
                // }, 1005000); // 3000 milliseconds = 3 seconds
            };
        } else {
            alert('Cannot open a new window. Make sure popups are not blocked.');
        }
    };
    const diskon = (diskon: any, prie: any) => {
        const harga = prie * diskon / 100;
        return harga;

    }

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
                                            <p className="card-text">No Nota : {productHistory.data?.nota_number}</p>
                                            <p className="card-text">Tanggal : {productHistory.data?.date}</p>
                                            <p className="card-text">Jam : {productHistory.data?.hour}</p>
                                            <p className="card-text">Status : {productHistory.data?.status}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text">Metode Pembayaran : {productHistory.data?.payment_method === 'split' ? productHistory.data?.payment_method :
                                            productHistory.data?.cash >0 ? 'Cash':productHistory.data?.qris > 0 ? 'QRIS':'EDC / Transfer '}</p>
                                            {/* <p className="card-text">Diskon Global : {convertIDR(productHistory.data?.discount_global)}</p> */}
                                            <p className="card-text">Jumlah : {productHistory.data?.total}</p>
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
                                            <th className='min-w-30px'>Diskon (%)</th>
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
                                                        {details.discount>0?details.discount+"%":'0'}
                                                    </td>
                                                    <td>
                                                        {details.discount>0?convertIDR(calculateDiscount(details.price,details.discount,details.quantity)):'Rp 0'}
                                                    </td>
                                                    <td>
                                                        {convertIDR(details.sub_total -calculateDiscount(details.price,details.discount,details.quantity))}
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
                                            <td></td>
                                            <td><h3>Total DISKON (Rp)</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.discount)}
                                            </td>
                                        </tr>
                                    </tbody>
                                   {productHistory.data?.cash >0 &&( <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Cash</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.cash)}
                                            </td>
                                        </tr>
                                    </tbody>)}
                                    {productHistory.data?.qris>0 && (<tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>QRIS</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.qris)}
                                            </td>
                                        </tr>
                                    </tbody>)}
                                   {productHistory.data?.transfer >0 &&( <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>EDC / Transfer</h3></td>
                                            <td className='text-dark fw-bold'>
                                                {convertIDR(productHistory.data?.transfer)}
                                            </td>
                                        </tr>
                                    </tbody>)}

                                    {/* <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h3>Bayar </h3></td>
                                            <td className='text-dark fw-bold'>
                                                {/* Rp {productHistory.data?.cash} */}
                                                {/* {productHistory.data?.payment_method === 'non_split' && ( */}
                                                <>
                                                    {/* {convertIDR(
                                                        productHistory.data?.cash +
                                                        productHistory.data?.transfer +
                                                        productHistory.data?.qris
                                                    )} */}
                                                </>
                                                {/* )} */}

                                                {/* {productHistory.data?.payment_method === 'split' && ( */}
                                                {/* <>
                                                        {convertIDR(productHistory.data?.transfer)}
                                                    </> */}
                                                {/* )} */}
                                            {/* </td> */}
                                        {/* </tr> */}
                                    {/* </tbody>  */}
                                    <tbody>
                                        <tr>
                                            <td></td>
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