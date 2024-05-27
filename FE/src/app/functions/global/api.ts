import axios from 'axios'
import { SupllierModel, ProductModel, SearchCriteria } from './model'
import { log } from 'console'

const API_URL = process.env.REACT_APP_API_URL

/* CEK HARGA */
export const SHOWCEKHARGA_URL = `${API_URL}/product?page=&search=`

/* Prediksi */
export const PENCARIAN_DATA = `${API_URL}/prediksi`

/* SUPPLIER */
export const SHOWSUPPLIER_URL = `${API_URL}/supplier?search`
export const SHOWSUPPLIERDETAIL_URL = `${API_URL}/supplier/:supplier_id`
export const ADDSUPPLIER_URL = `${API_URL}/supplier`
export const UPDATESUPPLIER_URL = `${API_URL}/supplier/{id_supplier}`

/* ALL PRODUK */
export const SHOWPRODUK_URL = `${API_URL}/product?search=&category_id=`
export const DELPRODUK_URL = `${API_URL}/product/{id_product}`
export const ADDPRODUK_URL = `${API_URL}/product`
export const UPDATEPRODUK_URL = `${API_URL}/product/:product_id`
export const SEARCHPRODUK_URL = `${API_URL}/product?page=&product_name=&category_id=&product_code=&arrange_by=&sort_by=`
export const label = `${API_URL}/product-label`
export const repak = `${API_URL}/product-repack`

/* LAPORAN STOK */
export const SHOWSTOK_URL = `${API_URL}/stock-opname?page=`
export const SEARCHSTOK_URL = `${API_URL}/stock-opname?page=&product_name=&start_date=&end_date=&arrange_by=&sort_by=`

/* HISTORY */
export const HISTORY_URL = `${API_URL}/product/:product_id/history`
export const UPDATEHISTORY_URL = `${API_URL}/stock-opname/:stock_opname_id`
export const UPDATENOTIF = `${API_URL}/stock-opname/:stock_opname_id/exp-notif`
export const REFUNDHISTORY_URL = `${API_URL}/stock-opname/:stock_opname_id/refund`
export const UpdateStok = `${API_URL}/stock-opname`
export const ADDPRODUCTOUT = `${API_URL}/product-out`
export const UPDATEPRODUCTOUT = `${API_URL}/product-out/:product_out_id`
export const historyRekap = `${API_URL}/data-shift`
export const historirepack = `${API_URL}/history-repack?page=`
export const approvestok = `${API_URL}/stock-opname/:stock_opname_id/approve`
// export const historiperrepack = `${API_URL}/history-repack?page=&product_id=${product_id}`

/* AKUN */
export const SHOWAKUN_URL = `${API_URL}/user?search`
export const UPDATEAKUN_URL = `${API_URL}/user/:user_id`
export const ADDAKUN_URL = `${API_URL}/user`
export const UPDATESTATUSAKUN_URL = `${API_URL}/user/:user_id/status`

/* PERMINTAAN RETURN */
export const SHOWREQ_URL = `${API_URL}/product-return?page=1`
export const STATUSRETURN_URL = `${API_URL}/product-return/1/status`
export const DETAILRETURN_URL = `${API_URL}/product-return/:product_return_id`

/* TRANSAKSI */
export const SHOWTRANSAKSI_URL = `${API_URL}/transaction?page=1`
export const MODALTRANSAKSI_URL = `${API_URL}/transaction/:transaction_id`

/* CATEGORY */
export const CATEGORY_URL = `${API_URL}/master/category`
export const SEARCHCATEGORY_URL = `${API_URL}/master/category?category_name=&code=&arrange_by=&sort_by=`
export const ADDCATEGORY_URL = `${API_URL}/master/category`
export const UPDATECATEGORY_URL = `${API_URL}/master/category/:category_id`
export const DELETECATEGORY_URL = `${API_URL}/master/category/:category_id`

/* STORE */
export const STORE_URL = `${API_URL}/store`
// export const SEARCHSTORE_URL = `${API_URL}/store?store_name=&code=&arrange_by=&sort_by=`
export const ADDSTORE_URL = `${API_URL}/store`
export const UPDATESTORE_URL = `${API_URL}/store/:store_id`
export const DELETESTORE_URL = `${API_URL}/store/:store_id`

/* UNIT */
export const UNIT_URL = `${API_URL}/master/unit`
export const UPDATEUNIT_URL = `${API_URL}/master/unit/{id_unit}`

/* DASHBOARD */
export const DASHBOARD_URL = `${API_URL}/dashboard`
export const SHOWNOTIF = `${API_URL}/notification`
export const DETAILNOTIF = `${API_URL}/notification/:notification_id`

/* Data Kasir */
export const SHOWKASIR_URL = `${API_URL}/cashier?page=1`
export const ADDKASIR_URL = `${API_URL}/cashier`
export const UPDATEKASIR_URL = `${API_URL}/cashier/:user_id`

/* LAPORAN KEUANGAN */
export const KEUANGAN_URL = `${API_URL}/report/financial?type=&page=`
export const PENJUALAN_URL = `${API_URL}/report/sales?type=&page=`
export const HARIAN_URL = `${API_URL}/report/financial`

// kasir dashbaorad
export const CEKSESI = `${API_URL}/check-session`
export const SETSALDO = `${API_URL}/initial-balance`
export const PENCARIAN_PROD = `${API_URL}/product`

//Kasir Data Produk
export const ALLDATA = `${API_URL}/product`
export const DATAKATEGORI = `${API_URL}/master/category`
//Kasir Data Transaksi
export const TRANSAKSI = `${API_URL}/transaction`
//Kasir History Return 
export const RETURN = `${API_URL}/product-return`
//Kasir Pelanggan 
export const MEMBER = `${API_URL}/member`
export const UPDATEMEMBER = `${API_URL}/member/{id_member}`

//Kasir Rekap Shift 
export const REKAPSHIFT = `${API_URL}/recap-shift`
export const UPLOADREKAPSHIFT = `${API_URL}/data-shift`


/* FUNCTION */


/* CEK HARGA */
export function showCekHarga(search = '', page = '') {
    return axios.get(SHOWCEKHARGA_URL, {
        params: {
            search,
            page,
        }
    })
        .then(response => response.data.data.data);
}

/* CATEGORY */
export async function fetchCategories() {
    try {
        const response = await axios.get(CATEGORY_URL);
        return response.data.data;
    } catch (error) {
        console.error('Gagal mengambil data kategori', error);
        return [];
    }
}

export function addCategory(newCategory: {
    category_name: string;
    code: string;
}) {
    return axios.post(ADDCATEGORY_URL, newCategory)
        .then(response => response.data);
}

export function deleteCategory(id_product: number) {
    return axios.delete(`${API_URL}/master/category/${id_product}`, {

    });
}

export function updateCategory(id: number, category_name: string, code: string,) {
    const url = UPDATECATEGORY_URL.replace(':category_id', id.toString());
    return axios.post(url, {
        category_name,
        code,
    })
        .then(response => response.data);
}

//Kasir
export function tahanTransaksihistory() {
    return axios.get(`${TRANSAKSI}?status=hold`)
        .then(response => response.data);
}
export function GetRecap() {
    return axios.get(`${REKAPSHIFT}`)
        .then(response => response.data);
}
export function postRecap(params: any) {
    return axios.post(`${UPLOADREKAPSHIFT}`, params)
        .then(response => response.data);
}

export function pushTransaksis(params: any) {
    return axios.post(`${TRANSAKSI}`, params)
        .then(Response => Response.data);
}
export function pushTransaksis2(params: any, id: number) {
    return axios.post(`${TRANSAKSI}/${id}`, params)
        .then(Response => Response.data);
}
export const showDetailTransaksi = async (transaction_id: number) => {
    try {
        const response = await axios.get(`${API_URL}/transaction/${transaction_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product history:', error);
        throw error;
    }
};

export function addreturn(newReturn: { transaction_id: string; product_id: string, quantity: number; reason: string; }) {
    return axios.post(RETURN, newReturn)
        .then(response => response.data);
}

//Member Kasir
export function showMember() {
    return axios.get(MEMBER)
        .then(response => response.data.data.data);
}

export function addNewMember(newMember: {
    name: string;
    code: string;
    phone: string;
    email: string;
    address: string,
    default_discount: number,
}) {
    return axios.post(MEMBER, newMember)
        .then(response => response.data);
}
export function deletemember(id_member: number) {
    return axios.delete(`${API_URL}/member/${id_member}`, {

    });
}

export function updateMember(
    id: number,
    name: string,
    code: string,
    phone: string,
    email: string,
    address: string,
    default_discount: number,
) {
    const url = UPDATEMEMBER.replace('{id_member}', id.toString());
    return axios.post(url, {
        name,
        code,
        phone,
        email,
        address,
        default_discount,
    })
        .then(response => response.data);
}

/* SUPPLIER */
export function showSupplier() {
    return axios.get(SHOWSUPPLIER_URL)
        .then(response => response.data.data.data);
}
export function showSupplierDetail() {
    return axios.get(SHOWSUPPLIERDETAIL_URL)
        .then(response => response.data.data.data);
}


export function addSupplier(name: string, phone: string) {
    return axios.post<SupllierModel>(ADDSUPPLIER_URL, {
        name,
        phone,
    }).then(response => response.data)
}

export function deleteSupplier(id_supplier: number) {
    return axios.delete(`${API_URL}/supplier/${id_supplier}}`, {

    });
}

export function updateSupplier(id: number, name: string, phone: string) {
    const url = UPDATESUPPLIER_URL.replace('{id_supplier}', id.toString());
    console.log('dat', UPDATESUPPLIER_URL);

    return axios.post<SupllierModel>(url, {
        name,
        phone,
    }).then(response => response.data);
}



// cashier_id: number;
// cashier_name: string;
// discount_cash: number;
// discount_qris: number;
// discount_total: number;
// discount_transfer: number;
// end_date: string;
// end_time: string;
// nota_total: number;
// retur_nominal: number;
// retur_total: number;
// start_date: string;
// start_time: string;
// total_cash: number;
// total_qris: number;
// total_transaction: number;
// total_transfer: number;

/* ALL PRODUK */
export const searchProduk = (searchCriteria: SearchCriteria) => {
    const {
        page = 1,
        product_name = '',
        category_id = '',
        product_code = '',
        arrange_by = '',
        sort_by = '',
    } = searchCriteria;

    const apiUrl = `${API_URL}/product?page=${page}&product_name=${product_name}&category_id=${category_id}&product_code=${product_code}&arrange_by=${arrange_by}&sort_by=${sort_by}`;

    return axios.get(apiUrl)
        .then((response) => response.data)
        .catch((error) => {
            console.error('Error fetching products:', error);
            throw error;
        });
};

export function showProducts(search = '', category_id = '') {
    return axios.get(SHOWPRODUK_URL, {
        params: {
            search,
            category_id,
        }
    })
        .then(response => response.data.data.data);
}

export function addNewProduct(newProductData: {
    category_id: string,
    product_name: string,
    product_code: string,
    stock: number;
    price: number,
    discount: number,
    supplier_id: string,
    hpp_price: number,
    faktur_number: number,
    expired_date: string,
    expired_notif_date: string,
    unit_id: number[],
    unit_price: number[],
    minimum: number[],
}) {
    return axios.post(ADDPRODUK_URL, newProductData)
        .then(response => response.data);
}

export function deleteProduct(id_product: number) {
    return axios.delete(`${API_URL}/product/${id_product}`, {

    });
}

export function updateProduct(
    id: number,
    category_id: string,
    product_name: string,
    product_code: string,
    stock: number,
    price: number,
    discount: number,
    supplier_id: string,
    hpp_price: number,
    faktur_number: number,
    expired_date: string,
    expired_notif_date: string,
    unit_id: number[],
    unit_price: number[],
    minimum: number[],) {
    const url = UPDATEPRODUK_URL.replace(':product_id', id.toString());
    return axios.post(url, {
        category_id,
        product_name,
        product_code,
        stock,
        price,
        discount,
        supplier_id,
        hpp_price,
        faktur_number,
        expired_date,
        expired_notif_date,
        unit_id,
        unit_price,
        minimum,
    })
        .then(response => response.data);
}
export function tambahStok(
    product_id: number,
    supplier_id: string,
    product_code: string,
    amount: number,
    hpp_price: number,
    expired_date: string,
    expired_notif_date: string,
    note: string,
    responsible: string,
    unit_id: number[],
    unit_price: number[],
    minimum: number[],) {
    const url = UpdateStok;
    return axios.post(url, {
        product_id,
        supplier_id,
        product_code,
        amount,
        hpp_price,
        expired_date,
        expired_notif_date,
        note,
        responsible,
        unit_id,
        unit_price,
        minimum,
    })
        .then(response => response.data);
}
export function barcode(newLabel: {
    product_id: any[],
    total: number[],
    expired_date: string[],
}) {
    return axios.post(label, newLabel)
        .then(response => response.data);

}

export function Repack(newRepack: {
    origin_product_id: string,
    destination: any,
    current_stock: number,
}) {
    return axios.post(repak, newRepack)
        .then(response => response.data);
}


/* Laporan Stok */
export function showLapStok() {
    return axios.get(SHOWSTOK_URL)
        .then(response => response.data.data.data);
}
export function getSearchProduk(name: string) {
    return axios.get(`${PENCARIAN_PROD}?search=${name}`)
        .then(response => response.data);
}
export function getSearchProduk2(name: any) {
    return axios.get(`${name}`)
        .then(response => response.data);
}
// Dashboard session
export function getsession() {
    return axios.get(CEKSESI)
        .then(response => response.data)
}
//Dashboard Saldo
export function addInputsaldo(initial_balance: number) {
    console.log('data', { initial_balance });

    return axios.post(SETSALDO, { initial_balance })
        .then(response => response.data);
}
/* AKUN */
export function showAkun() {
    return axios.get(SHOWAKUN_URL)
        .then(response => response.data.data.data);
}

export function addNewAkun(newAkunData: { name: string; username: string; phone: string; email: string; role: string; password: string }) {
    return axios.post(ADDAKUN_URL, newAkunData)
        .then(response => response.data);
}

export function updateAccount(id: number, name: string, email: string, password: string, username: string, phone: string, role: string) {
    const url = UPDATEAKUN_URL.replace(':user_id', id.toString());
    return axios.post(url, {
        name,
        email,
        password,
        username,
        phone,
        role,
    })
        .then(response => response.data);

}

export function deleteAccount(userId: number) {
    const url = `${API_URL}/user/${userId}`;

    return axios.delete(url)
        .then(response => response.data);
}
export const toggleActiveStatus = async (userId: number) => {
    try {
        const response = await axios.post(`${API_URL}/user/${userId}/status`);
        return response.data;
    } catch (error) {
        console.log('Status update gagal', error);
        return [];

    }
};

/* Data Kasir */
export function showKasir() {
    return axios.get(SHOWKASIR_URL)
        .then(response => response.data.data.data);
}
export function addNewKasir(newAkunData: { name: string; username: string; email: string; phone: string; store_id: string; password: string }) {
    return axios.post(ADDKASIR_URL, newAkunData)
        .then(response => response.data);
}
export function updateKasir(id: number, name: string, username: string, email: string, phone: string, store_id: string, password: string) {
    const url = UPDATEKASIR_URL.replace(':user_id', id.toString());
    return axios.post(url, {
        name,
        username,
        email,
        phone,
        store_id,
        password,
    }).then(response => response.data);
}


export function deleteKasir(user_id: number) {
    return axios.delete(`${API_URL}/cashier/${user_id}}`, {

    });
}

/* Permintaan Return */
export function showreq() {
    return axios.get(SHOWREQ_URL)
        .then(response => response.data.data.data);
}
export function updateStatus(returnId: number, status: string) {
    const updateStatusUrl = `${API_URL}/product-return/${returnId}/status`;

    const data = {
        status: status
    };

    return axios.post(updateStatusUrl, data)
        .then(response => response.data);
}
export const showDetailReturn = async (product_return_id: number) => {
    try {
        const response = await axios.get(`${API_URL}/product-return/${product_return_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product history:', error);
        throw error;
    }
};

/* Data Transaksi */
export function showTransaksi() {
    return axios.get(SHOWTRANSAKSI_URL)
        .then(response => response.data.data.data);
}
export function modalTransaksi() {
    return axios.get(MODALTRANSAKSI_URL)
        .then(response => response.data.data.data)
}

/* Dashboard */
export function showDashboard() {
    return axios.get(DASHBOARD_URL)
        .then(response => response.data.data);
}
export function showNotif() {
    return axios.get(SHOWNOTIF)
        .then(response => response.data.data);
}
export function showNotifDetail(notification_id: number) {
    const url = `${API_URL}/notification/${notification_id}`;

    return axios.get(url)
        .then(response => response.data);
}


/* Laporan Keuangan */
// export function showKeuangan() {
//     return axios.get(KEUANGAN_URL)
//         .then(response => response.data.data);

// }

export function showKeuangan(type = '', page = 1) {
    const params = { type, page };

    return axios.get(KEUANGAN_URL, { params })
        .then(response => response.data.data);
}

export function showLapPenjualan() {
    return axios.get(PENJUALAN_URL)
        .then(response => response.data.data);

}
export function showLapHarian() {
    return axios.get(HARIAN_URL)
        .then(response => response.data.data);

}
export const showDetailLaporan = async (product_id: number) => {
    try {
        const response = await axios.get(`${API_URL}/report/financial/${product_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product history:', error);
        throw error;
    }
};
export const showDetailLaporanPenjualan = async (transaction_id: number) => {
    try {
        const response = await axios.get(`${API_URL}/report/sales/${transaction_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product history:', error);
        throw error;
    }
};

/* Unit */
export function showUnit() {
    return axios.get(UNIT_URL)
        .then(response => response.data.data);

}
export function addNewUnit(newUnit: {
    unit_name: string;
    unit_value: number;
}) {
    return axios.post(UNIT_URL, newUnit)
        .then(response => response.data);
}

export function deleteUnit(id_unit: number) {
    return axios.delete(`${API_URL}/master/unit/${id_unit}`, {

    });
}

export function updateUnit(
    id: number,
    unit_name: string,
    unit_value: number,
) {
    const url = UPDATEUNIT_URL.replace('{id_unit}', id.toString());
    return axios.post(url, {
        unit_name,
        unit_value,
    })
        .then(response => response.data);
}

/* History */
export const showHistory = async (product_id: number) => {
    try {
        const response = await axios.get(`${API_URL}/product/${product_id}/history`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching product history:', error);
        throw error;
    }
};
export function updateHistory(stock_opname_id: number, hpp_price: number, amount: number, supplier_id: string, note: string, responsible: string, expired_notif_date: string, expired_date: string) {
    console.log('data', stock_opname_id + "-" + hpp_price + "" + supplier_id + "-" + supplier_id + "-" + note + "-" + responsible);
    //     hpp_price:100
    // supplier_id:1
    // amount:100
    // note:Penyesuaian Stok Opname
    // responsible:baru
    const url = UPDATEHISTORY_URL.replace(':stock_opname_id', stock_opname_id.toString());
    return axios.post(url, {
        hpp_price,
        supplier_id,
        amount,
        note,
        responsible,
        expired_date,
        expired_notif_date,
    }).then(response => response.data);
}
export function refundHistory(stock_opname_id: number, amount: number, responsible: string, note: string, status: string) {
    const url = REFUNDHISTORY_URL.replace(':stock_opname_id', stock_opname_id.toString());
    console.log('data', stock_opname_id + "-" + amount + "" + stock_opname_id + "-" + responsible + "-" + note + "-" + responsible);

    return axios.post(url, {
        amount,
        responsible,
        note,
        status
    }).then(response => response.data)
}
export function showHistoriRekap() {
    return axios.get(historyRekap)
        .then(response => response.data.data.data);

}
export function showHistoriRepack() {
    return axios.get(historirepack)
        .then(response => response.data.data.data);

}
// export function showHistoriPerRepack() {
//     return axios.get(historiperrepack)
//         .then(response => response.data.data.data);

// }
export function showHistoriPerRepack(product_id: number) {
    const url = `${API_URL}/history-repack?page=&product_id=${product_id}`;
    return axios.get(url)
        .then(response => response.data.data);
}
// export function approveStok(stock_opname_id: number) {
//     const url = approvestok.replace(':stock_opname_id', stock_opname_id.toString());
//     return axios.post(url, {
//         stock_opname_id,
//     }).then(response => response.data)
// }

export const approveStok = (stock_opname_id: number) => {
    const url = `${API_URL}/stock-opname/${stock_opname_id}/approve`;
    return axios.post(url)
        .then(response => response.data)
        .catch(error => {
            throw error.response.data;
        });
};

/* Produk Keluar */
export const showOutProduct = async (product_out_id: number) => {
    try {
        const response = await axios.get(`${API_URL}/product-out/${product_out_id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching product history:', error);
        throw error;
    }
};
export function addProductOut(newProductOut: { stock_opname_id: string; total_out: number; note: string; responsible: string; }) {
    return axios.post(ADDPRODUCTOUT, newProductOut)
        .then(response => response.data);
}
export function updateProductOut(id: number, stock_opname_id: string, total_out: number, note: string, responsible: string) {
    const url = UPDATEPRODUCTOUT.replace(':product_out_id', id.toString());
    return axios.post(url, {
        stock_opname_id,
        total_out,
        note,
        responsible,
    }).then(response => response.data);
}


export function deleteProductOut(product_out_id: number) {
    return axios.delete(`${API_URL}/product-out/${product_out_id}}`, {

    });
}

export function getSearchData(nama_produk: string) {
    return axios.get(`${PENCARIAN_DATA}?search=${nama_produk}`)
        .then(response => response.data.data);
}

export function getSearchData2() {
    return axios.get(PENCARIAN_DATA)
        .then(response => response.data.data);
}

/* STORE */
export async function fetchStore() {
    try {
        const response = await axios.get(STORE_URL);
        return response.data.data;
    } catch (error) {
        console.error('Gagal mengambil data kategori', error);
        return [];
    }
}

export function addStore(newStore: {
    store_name: string;
}) {
    return axios.post(ADDSTORE_URL, newStore)
        .then(response => response.data);
}

// export function deleteCategory(id_product: number) {
//     return axios.delete(`${API_URL}/master/category/${id_product}`, {

//     });
// }

// export function updateCategory(id: number, category_name: string, code: string,) {
//     const url = UPDATECATEGORY_URL.replace(':category_id', id.toString());
//     return axios.post(url, {
//         category_name,
//         code,
//     })
//         .then(response => response.data);
// }