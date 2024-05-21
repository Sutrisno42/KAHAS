import React, { ReactNode, useState } from 'react';
interface Transaction {
    hour: ReactNode;
    id: number;
    date: string;
    total: number;
    details: {
      id: number;
      product_name: string;
      product_code: string;
      quantity_unit: string;
      price: number;
      quantity: number;
      product_id: string;
      unit_id: string;
    }[];
  }
  

interface TahanTransaksiProps {
    showTahanTransaksi: boolean;
    onCloseTahanTransaksi: () => void;
    ongetData: (product: any) => void; // Pass the appropriate type for the argument
    datatransakksi: Transaction[];
    idtrans:any
}
const TahanTransaksi: React.FC<TahanTransaksiProps> = ({ showTahanTransaksi, onCloseTahanTransaksi,ongetData, datatransakksi ,idtrans}) => {
    const handlegetdata = (trans: Transaction, idtranx: number) => {
        const originalArray = trans.details;
        console.log('data',idtranx);
        
        idtrans(idtranx)
        // console.log('dataa',originalArray);
        
        // const newArray = originalArray.map(item => ({
        //   id: item.id,
        //   name: item.product_name,
        //   code: item.product_code,
        //   unitName: item.quantity_unit,
        //   price: item.price,
        //   jumlah: item.quantity,
        //   product_id: item.product_id.toString(),
        //   unit_id: item.unit_id.toString(),
        // }));
        // console.log('datatrans',newArray);
        // console.log('datatrans2',originalArray);

        // originalArray.forEach(item => {
        //     const newData = {
        //       id: item.id,
        //       name: item.product_name,
        //       code: item.product_code,
        //       unitName: item.quantity_unit,
        //       price: item.price,
        //       jumlah: item.quantity,
        //       product_id: item.product_id.toString(),
        //       unit_id: item.unit_id.toString(),
        //     };
        
        //     console.log('datatrans3', newData);
            
        //     // Call ongetData for each item
        //   });      
          ongetData(trans);
          onCloseTahanTransaksi();
        };
    return (
        <>
            {showTahanTransaksi && (
                <div className='modal-backdrop fade show'></div>
            )}
            {showTahanTransaksi && (
                <div className='modal fade show d-flex align-items-center justify-content-center' id='kt_modal_add_user' style={{ display: 'block' }}>
                    <div className='modal-dialog modal-lg'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Transaksi Terkini</h5>
                                <button type='button' className='btn-close' onClick={onCloseTahanTransaksi}></button>
                            </div>
                            <div className='modal-body'>
                                <table>
                                    <tbody>
                                        {datatransakksi.map((transaction, index) => (
                                            <tr key={index}>
                                                <td style={{ paddingRight: "10px" }}>{transaction.id}</td>
                                                <td style={{ paddingRight: "50px" }}>{transaction.date} {transaction.hour}</td>
                                                <td style={{ paddingRight: "30px" }}>{transaction.details.length}</td>
                                                <td style={{ paddingRight: "10px" }}>
                                                    <a href="#" onClick={() => handlegetdata(transaction,transaction.id)}>
                                                        <i className="bi bi-pen-fill"></i>
                                                    </a>                                                    </td>
                                                {/* <td style={{ paddingRight: "10px" }}><a href=""><i className="bi bi-trash-fill"></i></a></td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* <tbody>
                                        <tr>
                                            <td style={{ paddingRight: "10px" }}>1</td>
                                            <td style={{ paddingRight: "50px" }}>2023/0038 (Walk-In Customer)</td>
                                            <td style={{ paddingRight: "30px" }}>13,200</td>
                                            <td style={{ paddingRight: "10px" }}><a href=""><i className="bi bi-pen-fill"></i></a></td>
                                            <td style={{ paddingRight: "10px" }}><a href=""><i className="bi bi-trash-fill"></i></a></td>
                                        </tr>
                                        <tr>
                                            <td >2</td>
                                            <td>2023/0037 (Walk-In Customer)</td>
                                            <td>9,800</td>
                                            <td><a href=""><i className="bi bi-pen-fill"></i></a></td>
                                            <td><a href=""><i className="bi bi-trash-fill"></i></a></td>
                                        </tr>
                                        <tr>
                                            <td >3</td>
                                            <td>2023/0036 (Walk-In Customer)</td>
                                            <td>1,300</td>
                                            <td><a href=""><i className="bi bi-pen-fill"></i></a></td>
                                            <td><a href=""><i className="bi bi-trash-fill"></i></a></td>
                                        </tr>
                                    </tbody> */}
                                </table>
                                <form id='kt_modal_add_user_form' className='form' noValidate>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' onClick={onCloseTahanTransaksi}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TahanTransaksi 