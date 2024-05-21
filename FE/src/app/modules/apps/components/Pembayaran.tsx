import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react';
import logo from '../../../../_metronic/assets/img/logo3.png'
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { pushTransaksis, pushTransaksis2 } from '../../../functions/global/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { convertIDR, formatCurrency } from '../../../functions/global';
import { formatTime } from '@formatjs/intl';

interface TransaksiProps {
    showPayment: boolean;
    onClosePayment: () => void;
    onClosePayment2: () => void;
    onTahanPayment: () => void;
    totalQty: number;
    totamount: number;
    datapayment: [];
    amountPay: number;
    amountPay1: number;
    amountPay2: number;
    paymentMethod: string;
    paymentMethod1: string;
    paymentMethod2: string;
    bayar: number;
    idmember: string;
    defaultdis: any;
    trans_id: number;
}

const Pembayaran: React.FC<TransaksiProps> = ({ showPayment, onClosePayment, onClosePayment2, onTahanPayment, datapayment, totalQty, totamount, amountPay, paymentMethod,paymentMethod1,paymentMethod2, amountPay1,amountPay2, bayar, idmember, defaultdis, trans_id }) => {
    // const [paymentMethod, setPaymentMethod] = useState<string>('');

    // const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setPaymentMethod(event.target.value);
    // };
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
    const year = String(today.getFullYear());
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedDate = `${day}-${month}-${year}`;
    const [data, setDAta] = useState<any[]>([]);

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handlepostdata = async () => {
        const productDetails = datapayment.map((product: {
            diskon: any;
            hargaatingkat: any; product_id: any; unit_id: any; price: number; jumlah: number; discount: number;
        }) => ({
            product_id: product.hargaatingkat[0].product_id,
            unit_id: product.hargaatingkat[0].unit_id,
            price: product.price,
            quantity_unit: product.jumlah,
            discount: product.diskon || 0,
            sub_total: (product.price * product.jumlah),
        }));
        let totalDiscount = 0;

// Iterate over productDetails and sum up the discounts
productDetails.forEach((product) => {
    console.log('dataproduct',product);
    
    const tot = (parseFloat(product.discount) * parseFloat(product.price.toString()) * parseFloat(product.quantity_unit.toString())) / 100;
    totalDiscount += isNaN(tot) ? 0 : tot;    
});

        let cashAmount = 0;
        let qrid =0;
        let trans =0;

if (paymentMethod === 'cash') {
  // If payment method is 'cash', use amountPay
  cashAmount = amountPay|| 0;
  qrid =  0;
  trans =  0;
} else if (paymentMethod === 'qris'){
    cashAmount = 0;
    qrid = amountPay||  0;
    trans =  0;
}else if (paymentMethod === "transfer" ){
    cashAmount = 0;
    qrid =   0;
    trans =amountPay||  0;
} else if (paymentMethod === 'split') {
  // If payment method is 'split'
  const cashAmount1 = paymentMethod1 === 'cash' ? amountPay1 : 0;
  const cashAmount2 = paymentMethod2 === 'cash' ? amountPay2 : 0;
  const cashAmount3 = paymentMethod1 === 'qris' ? amountPay1 : 0;
  const cashAmount4 = paymentMethod2 === 'qris' ? amountPay2 : 0;
  const cashAmount5 = paymentMethod1 === 'transfer' ? amountPay1 : 0;
  const cashAmount6 = paymentMethod2 === 'transfer' ? amountPay2 : 0;
  
  // Sum the cash amounts from paymentMethod1 and paymentMethod2
  cashAmount = cashAmount1 + cashAmount2;
  qrid = cashAmount3 + cashAmount4;
  trans = cashAmount6 + cashAmount5;
}
const paymentnonsplit= cashAmount >0?'Cash':qrid>0?'QRIS':'EDC / Transfer';
// Now, cashAmount contains the calculated cash amount based on the payment method logic
console.log('Cash Amount:', totalDiscount);
        const transaksiData = {
            "products": productDetails,
            "member_id": idmember,
            "total": totalQty,
            "discount": totalDiscount,
            "grand_total": totamount,
            "change": (amountPay+amountPay1+amountPay2) - totamount,
            "payment_discount": trans !== 0 ? 1.5:0, // isi dengan nominal potongan pembayaran (menggunakan persentase) jika tidak ada isi dengan 0
            "payment_method": paymentMethod === 'split'?'split':'non_split' ,
            "cash": cashAmount, // isi nominal jika menggunakan cash atau isi dengan 0 jika tidak
            "transfer": trans, // isi nominal jika menggunakan transfer atau isi dengan 0 jika tidak
            "qris":qrid // isi 
        };
        console.log('dataTans', transaksiData);
        console.log('data', cashAmount);
        console.log('datass', trans);
        console.log('datass', qrid);
        let res;
        if (trans_id === 0 || trans_id === undefined) {
            res = await pushTransaksis(transaksiData);
        } else {
            res = await pushTransaksis2(transaksiData, trans_id);
            console.log('push',trans_id);
        }

        console.log('selectproduk', res.status);
        if (res.status === "success") {
            toast.success(res.message)
            onClosePayment2();
            handlePrintReceipt(res.data,paymentnonsplit)
        } else {
         toast.error(res.message);
        }

    }
    const subTotal = (qty: string, diskon: string, price: string) => {

        let totalAmount = parseInt(qty) * parseInt(price);

        let discountAmount = totalAmount * (parseInt(diskon)) / 100

        return totalAmount
    }

    const TotalAmount = (selectedProduct: { jumlah: string; diskon: string; price: string; }[]) => {
        let total = 0
        selectedProduct.forEach((product: { jumlah: string, diskon: string, price: string; }) => {
            total += subTotal(product.jumlah, product.diskon, product.price)
        });
        return total
    }

    const handlePrintReceipt = (data: any,paymentnonsplit: any) => {
        console.log('dataku',data);
        
        const details = data.details;
        const kasir = data.cashier;
        const def = defaultdis !== undefined ? defaultdis * 0.01 : 0;
        const metode =
            data.payment_method === 'non_split' ? paymentnonsplit :'Split';
        let totalQuantity = 0;
        const kasirName = capitalizeFirstLetter(kasir.name);

        details.forEach((detail: { quantity_unit: number; }) => {
            totalQuantity += detail.quantity_unit;
        });
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [48, 210],
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        // const pageHeight = pdf.internal.pageSize.getHeight();

        const logoWidth = 10; // Lebar logo dalam mm, sesuai dengan lebar kertas
        const logoHeight = 10; // Tinggi logo dalam mm
        const logoX = 20; // Letak X logo dalam mm
        const logoY = 10; // Letak Y logo dalam mm, di atas teks "D Hardjosoewarno"

        // Tambahkan logo ke PDF
        pdf.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

        pdf.setFontSize(8);


        // pdf.addImage(logo, "PNG", 15, 27, 180, 180);
        pdf.text('D Hardjosoewarno', pageWidth / 2, 23, { align: 'center' });
        pdf.text('Jl Parangtritis no.133, Brontok', pageWidth / 2, 26, { align: 'center' });
        pdf.text('usuman, Yogyakarta', pageWidth / 2, 29, { align: 'center' });
        pdf.text('081390408934', pageWidth / 2, 32, { align: 'center' });

        pdf.text(`No Nota : ${data.nota_number}`, 2, 37);
        pdf.text(`Kasir      : ${kasirName}`, 2, 40);
        pdf.text(`Tanggal : ${formattedDate} ${formattedTime}`, 2, 43);
        const dashLength = 1;
        const gapLength = 1;
        let currentX = 1;
        const endX = pageWidth - 1;

        const lineHeight = 2;
        let currentY = 45;

        details.forEach((detail: {
            discount: any; product_name: any; product_code: any; price: any; quantity_unit: any; sub_total: any; 
}) => {
            currentX = 1;
            while (currentX < endX) {
                pdf.line(currentX, currentY, currentX + dashLength, currentY);
                currentX += dashLength + gapLength;
            }
            pdf.text(`${detail.product_name} `, 2, currentY + 3);
            pdf.text(`${detail.quantity_unit} x  ${convertIDR(detail.price)}  ${detail.discount}% `, 2, currentY + 8);
            pdf.text(`${convertIDR(detail.sub_total)}`, pageWidth - 5, currentY + 8, { align: 'right' });
            currentY += 10;
        });

        currentX = 1;

        while (currentX < endX) {
            pdf.line(currentX, currentY, currentX + dashLength, currentY);
            currentX += dashLength + gapLength;
        }


        pdf.text(`Jml Barang: `, 2, currentY + 5);
        pdf.text(`${data.total}`, pageWidth - 5, currentY + 5, { align: 'right' });

        pdf.text(`GrandTotal: `, 2, currentY + 8);
        pdf.text(`${convertIDR(data.grand_total)}`, pageWidth - 5, currentY + 8, { align: 'right' });

        pdf.text(`Diskon: `, 2, currentY + 11);
        pdf.text(`${convertIDR(data.discount)}`, pageWidth - 5, currentY + 11, { align: 'right' });

        pdf.text(`Tipe Bayar:`, 2, currentY + 14);
        pdf.text(`${metode}`, pageWidth - 5, currentY + 14, { align: 'right' });

        pdf.text(`Tunai: `, 2, currentY + 17);
        pdf.text(`${convertIDR(data.cash)}`, pageWidth - 5, currentY + 17, { align: 'right' });

        pdf.text(`Transfer: `, 2, currentY + 20);
        pdf.text(`${convertIDR(data.transfer)}`, pageWidth - 5, currentY + 20, { align: 'right' });

        pdf.text(`QRIS: `, 2, currentY + 23);
        pdf.text(`${convertIDR(data.qris)}`, pageWidth - 5, currentY + 23, { align: 'right' });

       
        // pdf.text(`Jml Barang: `, 2, currentY + 5);
        // pdf.text(`${data.total}`, pageWidth - 5, currentY + 5, { align: 'right' });

        // pdf.text(`Tipe Bayar:`, 2, currentY + 8);
        // pdf.text(`${metode}`, pageWidth - 5, currentY + 8, { align: 'right' });

        // pdf.text(`Tunai: `, 2, currentY + 11);
        // pdf.text(`${convertIDR(data.cash)}`, pageWidth - 5, currentY + 11, { align: 'right' });

        // pdf.text(`Transfer: `, 2, currentY + 14);
        // pdf.text(`${convertIDR(data.transfer)}`, pageWidth - 5, currentY + 14, { align: 'right' });

        // pdf.text(`QRIS: `, 2, currentY + 17);
        // pdf.text(`${convertIDR(data.qris)}`, pageWidth - 5, currentY + 17, { align: 'right' });

        // pdf.text(`Diskon: `, 2, currentY + 20);
        // pdf.text(`${convertIDR(data.discount)}`, pageWidth - 5, currentY + 20, { align: 'right' });

        if (idmember !== "") {
            const jum = def * details.sub_total;
            // Mulai menuliskan teks di dokumen PDF
            pdf.text(`Member Diskon:`, 2, currentY + 26)
            // Menuliskan nilai diskon dengan menggunakan fungsi convertIDR
            pdf.text(`${defaultdis}%`, pageWidth - 5, currentY + 26, { align: 'right' });
            pdf.text(`Kembalian: `, 2, currentY + 29);
            pdf.text(`${convertIDR(data.change)}`, pageWidth - 5, currentY + 29, { align: 'right' });

            pdf.setFontSize(6);
            pdf.text('Maaf barang yang sudah dibeli', pageWidth / 2, currentY + 22, { align: 'center' });
            pdf.text('tidak dapat ditukar atau kembalikan', pageWidth / 2, currentY + 25, { align: 'center' });
            // pdf.text('kan', pageWidth / 2, currentY + 31, { align: 'center' });
            pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 28, { align: 'center', });
            pdf.text('https://projotech.id/', pageWidth / 2, currentY + 35, { align: 'center', });
        } else {
            pdf.text(`Kembalian: `, 2, currentY + 26);
            pdf.text(`${convertIDR(data.change)}`, pageWidth - 5, currentY + 26, { align: 'right' });

            pdf.setFontSize(6);
            pdf.text('Maaf barang yang sudah dibeli', pageWidth / 2, currentY + 29, { align: 'center' });
            pdf.text('tidak dapat ditukar atau kembalikan', pageWidth / 2, currentY + 31, { align: 'center' });
            // pdf.text('kan', pageWidth / 2, currentY + 31, { align: 'center' });
            pdf.text('POS System Powered by ProjoTech ', pageWidth / 2, currentY + 34, { align: 'center', });
            pdf.text('https://projotech.id/', pageWidth / 2, currentY + 37, { align: 'center', });
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
    function printElement(elem: HTMLElement) {
        console.log(elem); // Log the content of elem to the console

        var domClone = elem.cloneNode(true) as HTMLElement;
        
        var $printSection: HTMLDivElement | null = document.getElementById("printSection") as HTMLDivElement | null;
        
        if (!$printSection) {
            $printSection = document.createElement("div");
            $printSection.id = "printSection";
            document.body.appendChild($printSection);
        }
        
        $printSection.innerHTML = "";
        $printSection.appendChild(domClone);
        window.print();
    }
    
    
    
    return (
        <div>
            {showPayment && (
                <div className='modal-backdrop fade show'></div>
            )}
            {showPayment && (
                <div className={`modal ${showPayment ? 'd-block' : 'd-none'} align-items-center justify-content-center `} id='kt_modal_add_user'>
                    <div className="modal-dialog">
                        <div className="container-fluid modal-content">
                            <div className="modal-header">
                                <h1 className='modal-title'>Informasi Pembayaran</h1>
                                <button type='button' className='btn-close' onClick={onClosePayment}></button>                            </div>
                            <form id='kt_modal_add_user_form' className='form' noValidate>

                                <div
                                    className='d-flex flex-column scroll-y me-n7 pe-7'
                                    id='kt_modal_add_user_scroll'
                                    data-kt-scroll-dependencies='#kt_modal_add_user_header'
                                    data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
                                >
                                    <div className="container-fluid  ">
                                        <div className="row py-5">
                                            <div className="">
                                                {/* <div className="form-group">
                                                    <label>Metode Pembayaran:</label>
                                                    <select
                                                        className="form-control"
                                                    value={paymentMethod}
                                                    onChange={handlePaymentMethodChange}
                                                    >
                                                        <option value="">Pilih Metode Pembayaran</option>
                                                        <option value="tunai">Tunai</option>
                                                        <option value="qris">QRIS</option>
                                                        <option value="transfer">Transfer</option>

                                                    </select>
                                                </div>
                                                <br /> */}
                                                <div className="box-body  px-4 py-5 rounded-3">
                                                    <div className="col-md-12">
                                                        <h4>
                                                            Total Item:
                                                        </h4>
                                                        <h1 className="total_quantity" >{totalQty}</h1>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <hr />
                                                        <h4 >
                                                            Total Pembelian:
                                                        </h4>
                                                        <h1 className=" total_payable_span">{`${convertIDR(totamount)}`}</h1>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <hr />
                                                        <h4 >
                                                            Total Pembayaran:
                                                        </h4>
                                                        <h1 className=" total_paying">{`${convertIDR(bayar)}`}</h1>
                                                        <input type="hidden" id="total_paying_input" value={`${bayar}`} />
                                                    </div>

                                                    <div className="col-md-12">
                                                        <hr />
                                                        <h4 >
                                                            Kembalian:
                                                        </h4>
                                                        <h1 className=" text-danger change_return_span">{`${convertIDR((amountPay+amountPay1+amountPay2) - totamount)}`}</h1>
                                                        <input className="form-control change_return input_number" id="change_return" name="change_return" type="hidden" value={`${amountPay - totamount}`} aria-required="true" />
                                                    </div>
                                                </div>
                                                {/* <table className="summary-table">
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={2} className="summary-label">
                                                                <h1>Grand Total</h1>
                                                            </td>
                                                            <td colSpan={1} />
                                                            <td colSpan={2} className=" text-end summary-value">
                                                                <h1>{convertIDR(totamount)}</h1>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan={2} className="summary-label"><h1>Diskon</h1></td>
                                                            <td colSpan={1} />
                                                            <td colSpan={2} className=" text-end summary-value"><h1>{convertIDR(0)}</h1></td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} className="summary-label"><h1>Bayar</h1></td>
                                                            <td colSpan={1} />
                                                            <td colSpan={2} className=" text-end summary-value"><h1>{convertIDR(bayar)}</h1></td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} className="summary-label"><h1>Kembalian</h1></td>
                                                            <td colSpan={1} />
                                                            <td colSpan={2} className=" text-end  summary-value"><h1>{convertIDR(amountPay - totamount)}</h1></td>
                                                        </tr>
                                                    </tbody>
                                                </table> */}




                                            </div>
                                        </div>
                                        {/* <div className="row mt-4">
                                            <div className="col-md-12">
                                                <h4>Detail Produk</h4>
                                                <p>Grand Total: </p>
                                                <p>Bayar: </p>
                                                <p>Kembalian: </p>
                                                <p>Diskon: </p>
                                                <p>Nominal: </p>
                                            </div>
                                        </div> */}

                                    </div>



                                </div>

                                <div className='text-center pt-1 m-5'>

                                    <button
                                        type='button'
                                        onKeyDown={(e) => {
                                            console.log('selectproduk', e.key);
                                            if (e.key === 'Escape') {
                                                onClosePayment();
                                            } else if (e.key === 'Enter') {
                                                e.preventDefault(); // Menghentikan default behavior (misalnya, submit form)
                                                handlepostdata();
                                        
                                                
                                            }
                                        }}
                                        className='btn btn-primary'
                                        autoFocus
                                        onClick={handlepostdata}

                                    >
                                        <span className='indicator-label'>Cetak</span>
                                    </button>
                                    {/* <button
                                        type='button'
                                        className='btn btn-primary'
                                        style={{ marginLeft: "7px" }}
                                        onClick={onTahanPayment}

                                    >
                                        <span className='indicator-label'>Tahan</span>
                                    </button> */}
                                </div>

                            </form>

                        </div>
                    </div>

                </div>


            )}
            <ToastContainer position="top-right" autoClose={2000} />

        </div>
    );
};

export default Pembayaran;
