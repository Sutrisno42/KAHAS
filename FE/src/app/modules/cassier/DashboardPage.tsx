import React, { useState, useEffect, useRef, ReactNode } from 'react';
import usePageTitle from '../../functions/global/usePageTitle';
// import SearchProductModal from './components/SearchProductModal';
import { convertIDR, formatCurrency } from '../../functions/global';
import { addInputsaldo, getSearchProduk, getSearchProduk2, getrespon, getsession, pushTransaksis, searchProduk, showMember, tahanTransaksihistory } from '../../functions/global/api';
import Pembayaran from '../apps/components/Pembayaran';
import TahanTransaksi from '../apps/components/TahanTransaksi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductPage from '../admintbk/AllProdukPage';

interface Product {
  id: number;
  kode: string;
  name: string;
  tanggal: string,
  jumlah: string,
  diskon: string,
  diskonprice: String,
  defaultunit: string;
  price: string;
  product_id: string,
  unit_id: string,
  subtotal: string,
  hargaatingkat: any,
}
interface searchproduk {
  stok: any;
  id: number,
  name: string,
  code: string,
  unitName: string,
  price: number,
  jumlah: number,
  product_id: string,
  unit_id: string,
  hargaatingkat: any,
}
interface SearchProductModalProps {
  show: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}


const DashboardPage = () => {
  usePageTitle('Dashboard');

  // const [show, setShow] = useState(false);
  const inputModalRef = useRef<HTMLInputElement | null>(null);
  const inputModalRef2 = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('0');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState('');
  const [valuespcs, setValuespcs] = useState('0');
  const [valuemember, setValuemember] = useState('');
  const [transid, setTransid] = useState<any>(0);
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showTahanTransaksi, setShowTahanTransaksi] = useState(false);
  const [productQty, setProductQty] = useState<any>({});
  const [amountPay, setAmountPay] = useState('0');
  const [idtransaksi, setidTransaksi] = useState('0');
  const [amountPay1, setAmountPay1] = useState('0');
  const [amountPay3, setAmountPay2] = useState('0');
  const [selectedProduct, setSelectedProduct] = useState<Product | null | any>([
  ]);
  const [allProduck, setAllProduk] = useState<Product | null | any>([
  ]);
  const [member, setMember] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<searchproduk[]>([]);
  const [tahanTransaksi, setTahantransaksi] = useState<any>([])
  const tableRef = useRef<HTMLTableElement>(null);
  const inputuang = useRef<HTMLInputElement | null>(null);
  const inputuang2 = useRef<HTMLInputElement | null>(null);
  const inputuang3 = useRef<HTMLInputElement | null>(null);
  const historiRef = useRef<HTMLButtonElement | null>(null);
  const tahanRef = useRef<HTMLButtonElement | null>(null);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const inputdiskonRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const inputdiskonRefs2 = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const dropdownRef = useRef<HTMLSelectElement>(null);
  const dropdownRef1 = useRef<HTMLSelectElement>(null);
  const dropdownRef2 = useRef<HTMLSelectElement>(null);
  const handlePaymentClick = () => {

    setShowPayment(true)

  };


  const handleClosePayment = () => {
    setShowPayment(false);
  };
  const handleClosePayment2 = () => {
    setShowPayment(false);
    setSelectedProduct([])
    setPaymentMethod('cash')
    setSplit('');
    setAmountPay('0');
    setAmountPay1('0');
    setAmountPay2('0');
    if (transid !== 0) {
      setTransid(0);
      getdatatransaksi();
    }
    TotalAmount();
    totalQty();
    inputModalRef2.current?.focus();
  };

  // "products": productDetails,
  // "member_id": idmember,
  // "total": totalQty,
  // "discount": 0,
  // "grand_total": totamount,
  // "change": amountPay - totamount,
  // "payment_discount": 2.5, // isi dengan nominal potongan pembayaran (menggunakan persentase) jika tidak ada isi dengan 0
  // "payment_method": paymentMethod !== 'split'?'non_split':'split' ,

  const handlertahan = async () => {
    if (selectedProduct.length !== 0) {
      const productDetails = selectedProduct.map((product: {
        diskon: any;
        hargaatingkat: any; product_id: any; unit_id: any; price: number; jumlah: number; discount: number;
      }) => ({
        product_id: product.hargaatingkat[0].product_id,
        unit_id: product.hargaatingkat[0].unit_id,
        price: product.price,
        quantity_unit: product.jumlah,
        discount: product.diskon | 0,
        sub_total: (product.price * product.jumlah),
      }));

      const transaksiData = {
        "products": productDetails,
        "member_id": valuemember,
        "total": totalQty(),
        "discount": 5000,
        "payment_discount": valuespcs,
        "grand_total": TotalAmount(),
        "change": parseFloat(amountPay) - TotalAmount(),
        "payment_method": paymentMethod !== 'split' ? 'non_split' : 'split',
        "cash": 0, // isi nominal jika menggunakan cash atau isi dengan 0 jika tidak
        "transfer": 0, // isi nominal jika menggunakan transfer atau isi dengan 0 jika tidak
        "qris": 0, // isi 
        "status": "hold"
      };
      console.log('dataxx', transaksiData);
      console.log('dataxx', selectedProduct);

      const res = await pushTransaksis(transaksiData);

      console.log('selectproduk', res.status);
      if (res.status === "success") {
        getdatatransaksi();
        setShowPayment(false);
        setSelectedProduct([])
        toast.success(res.message)
      }

    } else {
      toast.error('Belum ada data', { position: toast.POSITION.TOP_RIGHT })
    }

  };
  const handleTahanTransaksiClick = () => {
    if (tahanTransaksi.length === 0) {
      toast.error('Data Masih Kosong', { position: toast.POSITION.TOP_RIGHT })
    } else {
      setShowTahanTransaksi(true);
    }
  };

  const handleCloseTahanTransaksi = () => {
    setShowTahanTransaksi(false);
  };

  useEffect(() => {
    getalldaata();
    getdatatransaksi();
    showData();
    allDAta();
  }, [])
  const allDAta = async () => {
    const value = '';
    const response = await getSearchProduk(value);
    const data = response.data.data;
    const last = response.data.last_page;
    console.log('response', data);

    let dt: string | undefined; // atau jenis data yang sesuai
    dt = response.data.next_page_url;

    const fillerData = data.map((item: {
      [x: string]: any; id: any; product_name: any; product_code: any; price: any; price_lists: any[];
    }) => {
      return {
        id: item.id,
        name: item.product_name,
        code: item.product_code,
        stok: item.stock,
        hargaatingkat: item.price_lists.map((priceList: {
          unit_name: any; unit_value: any; pivot: {
            unit_id: any;
            product_id: any;
            minimum: any; price: any;
          };
        }) => {
          return {
            unitName: priceList.unit_name,
            unitValue: priceList.unit_value,
            price: priceList.pivot.price,
            minimum: priceList.pivot.minimum,
            product_id: priceList.pivot.product_id,
            unit_id: priceList.pivot.unit_id,
          };
        }),
      };
    });
    setAllProduk(fillerData);
    if (last !== 1) {
      for (let i = 1; i < last; i++) {
        const res = await getSearchProduk2(dt);
        const datas = res.data.data;
        dt = res.data.next_page_url;
        console.log('dat', datas);
        const fillerDatas = datas.map((item: {
          [x: string]: any; id: any; product_name: any; product_code: any; price: any; price_lists: any[];
        }) => {
          return {
            id: item.id,
            name: item.product_name,
            code: item.product_code,
            stok: item.stock,
            hargaatingkat: item.price_lists.map((priceList: {
              unit_name: any; unit_value: any; pivot: {
                unit_id: any;
                product_id: any;
                minimum: any; price: any;
              };
            }) => {
              return {
                unitName: priceList.unit_name,
                unitValue: priceList.unit_value,
                price: priceList.pivot.price,
                minimum: priceList.pivot.minimum,
                product_id: priceList.pivot.product_id,
                unit_id: priceList.pivot.unit_id,
              };
            }),
          };
        });
        setAllProduk((prevAllProduk: any) => [...prevAllProduk, ...fillerDatas]);
        console.log('i', i);

      }
    }
  };
  const showData = () => {
    showMember()
      .then(data => {
        setMember(data);
      })
  };
  useEffect(() => {
    if (showModal === true) {
      if (inputModalRef.current) {
        inputModalRef.current.focus();
      }
    } else {
      if (inputModalRef2.current) {
        inputModalRef2.current.focus();
      }
    }
  }, [showModal])
  const getdatatransaksi = async () => {
    const restransasksi = await tahanTransaksihistory();
    console.log('datatresss', restransasksi.data.data);
    setTahantransaksi(restransasksi.data.data);
  }
  const getalldaata = async () => {
    const session = await getsession();
    console.log('dataxxx', session.data.sesi);

    if (session.data.sesi === "inactive") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }
  const handleInputChange = (e: any) => {
    const number = formatCurrency(e.target.value)
    console.log('nilaai', number);

    setInputValue(number);
  };
  const handleInputChange2 = (e: any) => {
    const number = formatCurrency(e.target.value)
    console.log('nilaai', number);

    setAmountPay(number);
  };
  const handleInputChange3 = (e: any) => {
    const number = formatCurrency(e.target.value)
    console.log('nilaai', number);

    setAmountPay1(number);
  };
  const handleInputChange4 = (e: any) => {
    const number = formatCurrency(e.target.value)
    console.log('nilaai', number);
    setAmountPay2(number);
  };
  const getSelectedRange = function (qty: any, product: { hargaatingkat: any; }) {
    const ranges = product.hargaatingkat.sort((a: { minimum: number; }, b: { minimum: number; }) => b.minimum - a.minimum);

    for (const range of ranges) {
      if (qty >= range.minimum) {
        return range;
      }
    }

    // Default to the lowest range if none matches
    return ranges[ranges.length - 1];
  };
  // Function to close the modal
  const closeModal = async () => {
    if (parseInt(inputValue) > 0) {
      // If input is not empty, close the modal
      const convertedNumber = parseInt(inputValue.replace(/,/g, ''), 10);
      const response = await addInputsaldo(convertedNumber)
      if (response.status == 'success') {
        setShowModal(false);
        localStorage.setItem('drawer', inputValue);
        toast.success(response.message, { position: toast.POSITION.TOP_RIGHT })
      } else {
        toast.error(response.message, { position: toast.POSITION.TOP_RIGHT })
      }
    } else {
      // If input is empty, you can show an error message or take other actions
      alert('Input cannot be empty');
    }
  };


  const handleSearchProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const response = await getSearchProduk(value);
    const data = response.data.data;
    const processedData = data.map((item: {
      stock: any; id: any; product_name: any; product_code: any; price: any; price_lists: any[];
    }) => {
      return {
        id: item.id,
        name: item.product_name,
        code: item.product_code,
        stock: item.stock,
        price_list: item.price_lists.map((priceList: {
          unit_name: any; unit_value: any; pivot: {
            unit_id: any;
            product_id: any;
            minimum: any; price: any;
          };
        }) => {
          return {
            unitName: priceList.unit_name,
            unitValue: priceList.unit_value,
            price: priceList.pivot.price,
            minimum: priceList.pivot.minimum,
            product_id: priceList.pivot.product_id,
            unit_id: priceList.pivot.unit_id,
          };
        }),
      };
    });
    const fillerData = data.map((item: {
      [x: string]: any; id: any; product_name: any; product_code: any; price: any; price_lists: any[];
    }) => {
      return {
        id: item.id,
        name: item.product_name,
        code: item.product_code,
        stok: item.stock,
        hargaatingkat: item.price_lists.map((priceList: {
          unit_name: any; unit_value: any; pivot: {
            unit_id: any;
            product_id: any;
            minimum: any; price: any;
          };
        }) => {
          return {
            unitName: priceList.unit_name,
            unitValue: priceList.unit_value,
            price: priceList.pivot.price,
            minimum: priceList.pivot.minimum,
            product_id: priceList.pivot.product_id,
            unit_id: priceList.pivot.unit_id,
          };
        }),
      };
    });
    interface PriceConverter {
      pcs: number;
      lusin: number;
      kodi: number;
      gross: number;
      box: number;
      dus: number;
    }

    const converter: PriceConverter = {
      pcs: 1,
      lusin: 12,
      kodi: 144,
      gross: 1728,
      box: 24,  // Misalnya, 1 box berisi 24 pcs
      dus: 48   // Misalnya, 1 dus berisi 48 pcs
    };
    // const fillerData = processedData.flatMap((item: {
    //   stock: any; id: any; name: any; code: any; priceLists: { unitName: any; unitValue: any; price: any; minimum: any; product_id: any; unit_id: any; stock: any; }[];
    // }) => {
    //   const pcsPriceLists = item.priceLists
    //     .filter((priceList: { unitName: any }) => priceList.unitName === 'Pcs')
    //     .map((priceList: { unitName: any; unitValue: any; price: any; minimum: any; product_id: any; unit_id: any; }) => ({
    //       id: item.id,
    //       name: item.name,
    //       code: item.code,
    //       stok: item.stock,
    //       jumlah: 1,
    //       unitName: priceList.unitName,
    //       price: priceList.price,
    //       product_id: priceList.product_id,
    //       unit_id: priceList.unit_id,
    //     }));

    //   return pcsPriceLists.map((priceList: any) => {
    //     const conversionFactor = converter[priceList.unitName as keyof PriceConverter] || 1;
    //     const pricePerPcs = priceList.price / conversionFactor;

    //     return {
    //       ...priceList,
    //       price: pricePerPcs,
    //     };
    //   });
    // });


    // const fillerData = processedData.flatMap((item: { id: any; name: any; code: any; priceLists: { unitName: any; unitValue: any; price: any; minimum: any; product_id: any; unit_id: any; }[]; }) => {
    //   return item.priceLists.map((priceList: { unitName: any; unitValue: any; price: any; minimum: any; product_id: any; unit_id: any; }) => ({
    //     id: item.id,
    //     name: item.name,
    //     code: item.code,
    //     jumlah: priceList.minimum,
    //     unitName: priceList.unitName,
    //     price: priceList.price,
    //     product_id: priceList.product_id,
    //     unit_id: priceList.unit_id,
    //   }));
    // });


    console.log(fillerData);
    setFilteredData(fillerData);
    console.log('prosess2', fillerData);

    // const filtered = filteredData.filter((item) =>
    //   item.kode.toLowerCase().includes(value.toLowerCase()) ||
    //   item.name.toLowerCase().includes(value.toLowerCase())

    // );

    // setFiltereNewdData(filtered);
  };

  function convertToPcs(quantity: number, unit: string) {
    if (quantity === undefined || unit === undefined) {
      return 0;
    }
    switch (unit) {
      case 'Pcs':
        return quantity;
      case 'Lusin':
        return quantity * 12;
      case 'Dus':
        return quantity * 24; // Misalnya, 1 dus = 48 pcs
      case 'Karton':
        return quantity * 240; // Misalnya, 1 karton = 240 pcs
      case 'Gross':
        return quantity * 144; // Misalnya, 1 gross = 1728 pcs
      case 'Kodi':
        return quantity * 20; // Misalnya, 1 kodi = 144 pcs
      case 'Box':
        return quantity * 100; // Misalnya, 1 box = 24 pcs
      default:
        return 0; // Unit tidak dikenali
    }
  }
  function convertToPcs3(quantity: number, unit: string) {
    if (quantity === undefined || unit === undefined) {
      return 0;
    }
    switch (unit) {
      case 'Pcs':
        return quantity;
      case 'Lusin':
        return quantity / 12;
      case 'Dus':
        return quantity / 24; // Misalnya, 1 dus = 48 pcs
      case 'Karton':
        return quantity / 240; // Misalnya, 1 karton = 240 pcs
      case 'Gross':
        return quantity / 144; // Misalnya, 1 gross = 1728 pcs
      case 'Kodi':
        return quantity / 20; // Misalnya, 1 kodi = 144 pcs
      case 'Box':
        return quantity / 100; // Misalnya, 1 box = 24 pcs
      default:
        return 0; // Unit tidak dikenali
    }
  }
  function convertToPcs2(quantity: number, unit: string) {
    if (quantity === undefined || unit === undefined) {
      return 0;
    }
    switch (unit) {
      case 'Pcs':
        return quantity;
      case 'Lusin':
        return 12;
      case 'Dus':
        return 24; // Misalnya, 1 dus = 48 pcs
      case 'Karton':
        return 240; // Misalnya, 1 karton = 240 pcs
      case 'Gross':
        return 144; // Misalnya, 1 gross = 1728 pcs
      case 'Kodi':
        return 20; // Misalnya, 1 kodi = 144 pcs
      case 'Box':
        return 100; // Misalnya, 1 box = 24 pcs
      default:
        return 0; // Unit tidak dikenali
    }
  }
  const handleSelectProduct = (product: any) => {
    console.log('dataprod', product);
    const existingProduct = selectedProduct.find((item: Product) => item.id === product.id);

    if (existingProduct) {

      const updatedProducts = selectedProduct.map((item: Product) => {
        if (item.id === product.id) {
          const minimumPcs = product.hargaatingkat.find((unit: { unitName: string; }) => unit.unitName === product.defaultunit)?.minimum || 1;
          const updatedQuantity = parseInt(item.jumlah) + minimumPcs;
          console.log('updatequntity', updatedQuantity);
          console.log('updatequntity', item.jumlah);
          const updatedProductQty = { ...productQty, [product.id]: updatedQuantity };
          setProductQty(updatedProductQty)

          const priceTier = product.hargaatingkat.find((unit: { unitName: string; minimum: number; price: number }) => updatedQuantity >= unit.minimum);

          // Calculate the updated subtotal based on the selected price tier
          const updatedSubtotal = priceTier ? priceTier.price : updatedQuantity * product.hargaatingkat[0].price;
          const hargaunit = getSelectedRange(parseInt(updatedQuantity), product)
          // Increase quantity based on minimumPcs
          return { ...item, jumlah: String(updatedQuantity), price: hargaunit.price, defaulunit: hargaunit.uniName };
        }
        return item;
      });
      console.log('datakus', updatedProducts);

      setSelectedProduct(updatedProducts);

    } else {
      const hargaPcs = product.hargaatingkat.find((unit: { unitName: string; }) => unit.unitName === 'Pcs')?.price || convertToPcs3(product.hargaatingkat[0].price, product.hargaatingkat[0].unitName);
      const jumlahPcs = product.hargaatingkat.find((unit: { unitName: string; }) => unit.unitName === 'Pcs')?.minimum || convertToPcs2(product.hargaatingkat[0].minimum, product.hargaatingkat[0].unitName);
      const updatedProduct: Product = {
        ...product,
        jumlah: String(jumlahPcs),
        price: String(hargaPcs),
        defaultunit: 'Pcs'
      };
      console.log('datakus', updatedProduct);
      setSelectedProduct([...selectedProduct, updatedProduct]);
    }
    setSearchValue("")
  }

  const handleSelectProduct2 = (prodproduct: any) => {
    const detailsOnly = prodproduct.details.map((detail: { id: any; transaction_id: any; product_id: any; product_name: any; product_code: any; price: any; quantity: any; discount: any; sub_total: any; }) => ({
      id: detail.id,
      transaction_id: detail.transaction_id,
      product_id: detail.product_id,
      product_name: detail.product_name,
      product_code: detail.product_code,
      price: detail.price,
      quantity: detail.quantity,
      discount: detail.discount,
      sub_total: detail.sub_total,
    }));

    const foundProducts = detailsOnly.map((detail: {
      transaction_id(transaction_id: number): unknown;
      price: any;
      quantity: any; product_id: any;
    }) => {
      const foundProduct = allProduck.find((product: { id: any; }) => product.id === detail.product_id);

      // Optionally, you can include additional details from the detail object
      setTransid(detail.transaction_id);
      return {
        ...foundProduct,
        jumlah: detail.quantity,
        price: detail.price,
      };
    });

    console.log('data1', detailsOnly);
    console.log('data2', idtransaksi);
    console.log('data3', prodproduct);

    // if (selectedProduct.length !== 0) {
    //   let prod =[];
    //   prod.push(foundProducts)
    //   console.log('selected',selectedProduct);
    //   console.log('selected',prod);
    //   setSelectedProduct(foundProducts)

    // } else {
    //   setSelectedProduct([...selectedProduct, foundProducts]);
    // }
    const transformedProducts = foundProducts.map((prod: {
      jumlah: any; code: any; id: any; quantity: any; name: any; price: any; product_id: { toString: () => any; }; quantity_unit: any; unit_id: { toString: () => any; };
    }) => ({
      code: prod.code,
      id: prod.id,
      jumlah: prod.jumlah,
      name: prod.name,
      price: prod.price,
      product_id: prod.product_id,
      unitName: prod.quantity_unit,
      unit_id: prod.unit_id,
    }));
    console.log('dataa4', transformedProducts);

    setSelectedProduct(foundProducts)
    setSearchValue("")
  }
  const calculateDiscountPrice = (originalPrice: number, discountPercentage: number): number => {
    const discountedAmount = (originalPrice * discountPercentage) / 100;
    const discountedPrice = originalPrice - discountedAmount;
    return discountedPrice;
  };
  const findPercentage = (amount: number, total: number): number => {
    if (total === 0) {
      return 0; // Avoid division by zero
    }

    const percentage = (amount / total) * 100;
    return percentage;
  };

  const handlediskon = (productId: string, qty: string, jenis: string) => {
    if (jenis === 'present') {
      const newSubtotal = selectedProduct.find((product: { id: string; }) => product.id === productId).price;
      const diskonpersen = calculateDiskonPrice(newSubtotal, parseInt(qty))
      const updatedSelectedProduct = selectedProduct.map((product: { id: string; }) => {
        if (product.id === productId) {
          return { ...product, diskon: qty, diskonprice: diskonpersen };
        }
        return product;
      });
      setSelectedProduct(updatedSelectedProduct);
    } else {
      const newSubtotal = selectedProduct.find((product: { id: string; }) => product.id === productId).price;
      const discountAmount = parseFloat(qty) || 0;
      const totalAmount = parseFloat(newSubtotal) || 0;
      const discountPercentage = findPercentage(discountAmount, totalAmount);
      const updatedSelectedProduct = selectedProduct.map((product: { id: string; }) => {
        if (product.id === productId) {
          return { ...product, diskonprice: qty, diskon: discountPercentage };
        }
        return product;
      });
      setSelectedProduct(updatedSelectedProduct);
    }
  }
  const handleChangeQty = (productId: string, qty: string) => {
    //  const dataubah = handlemethodChaange(qty,productId);
    //  console.log('ubah',dataubah);

    const updatedProductQty = { ...productQty, [productId]: qty };
    console.log('dataanya', updatedProductQty);
    console.log('helo', selectedProduct);
    const calculateAbsoluteDifference = (a: number, b: number) => Math.abs(a - b);
    if (parseInt(qty) < 1) {
      alert("minimal 1")

      setProductQty({ ...productQty, [productId]: 1 })
      const updatedSelectedProduct = selectedProduct.map((product: {
        hargaatingkat: any; id: string;
      }) => {
        const hargaUnit = product.hargaatingkat.reduce((closest: { minimum: number; }, current: { minimum: number; }) => {
          const currentDifference = calculateAbsoluteDifference(1, current.minimum);
          const closestDifference = calculateAbsoluteDifference(1, closest.minimum);

          // Memilih elemen dengan perbedaan minimum yang lebih kecil
          return currentDifference < closestDifference ? current : closest;
        });
        if (product.id === productId) {
          return {
            ...product,
            jumlah: 1,
            defaultunit: hargaUnit.unitName,
            price: hargaUnit.price,
          };
        }
        return product;
      });

      setSelectedProduct(updatedSelectedProduct);
    } else {
      setProductQty(updatedProductQty);


      // Hitung ulang subtotal
      // const newSubtotal = subTotal(qty, selectedProduct.find((product: { id: string; }) => product.id === productId).diskon, selectedProduct.find((product: { id: string; }) => product.id === productId).price);

      // Simpan subtotal dalam state produk yang sesuai
      const updatedSelectedProduct = selectedProduct.map((product: {
        hargaatingkat: any; id: string;
      }) => {
        if (product.id === productId) {

          const hargaUnit = product.hargaatingkat.reduce((closest: { minimum: number; unitValue: any; }, current: {
            unitValue: number; minimum: number;
          }) => {
            const currentDifference = calculateAbsoluteDifference(parseInt(qty), current.minimum);
            const closestDifference = calculateAbsoluteDifference(parseInt(qty), closest.minimum);

            // Check if the current element's minimum is within the range of closest element
            const isWithinRange = current.minimum >= closest.minimum && current.minimum <= closest.minimum;
            // Selecting the element with the smaller minimum difference and within range
            return getSelectedRange(parseInt(qty), product);
          });
          return {
            ...product, jumlah: qty,
            defaultunit: hargaUnit.unitName,
            price: hargaUnit.price,
          };
        }
        return product;
      });

      console.log('isis', updatedSelectedProduct);


      setSelectedProduct(updatedSelectedProduct);

    }
  };

  const handleRemoveItem = (id: number) => { // Update the parameter type to string
    const updatedTableData = selectedProduct.filter((product: Product) => product.id !== id);
    setProductQty((prevProductQty: any) => {
      // Buat salinan baru dari objek tanpa elemen yang memiliki ID yang sesuai
      const updatedProductQty = { ...prevProductQty };
      delete updatedProductQty[id];
      return updatedProductQty;
    });
    console.log('upadettabe', updatedTableData.length);
    if (updatedTableData.length === 0) {
      setTransid(0);
    }
    setSelectedProduct(updatedTableData);
  };

  const datashowdata = (product: any) => {
    handleSelectProduct2(product)
  }

  const subTotal = (qty: string, diskon: string, price: string, subtotal: string) => {
    const disdata = parseInt(diskon) || 0;
    let totalAmount = parseInt(qty) * parseInt(price);
    if (disdata !== 0) {
      let discountAmount = totalAmount * disdata / 100
      totalAmount = parseInt(diskon) === 0 ? totalAmount : totalAmount - discountAmount;
      return subtotal === 'ya' ? discountAmount : totalAmount
    } else {
      totalAmount = totalAmount;
      return totalAmount
    }
  }

  const totalQty = () => {
    let total = 0;
    selectedProduct.map((product: { jumlah: string; }) => {
      total += parseInt(product.jumlah);
    });
    return total;
  }
  const calculateDiskonPrice = (originalPrice: number, persentaseDiskon: number) => {
    const diskonAmount = (originalPrice * persentaseDiskon) / 100;
    const diskonPrice = originalPrice - diskonAmount;
    return diskonAmount;
  };
  const calculateDiskonPrice2 = (originalPrice: number, persentaseDiskon: number) => {
    const diskonAmount = (originalPrice * persentaseDiskon) / 100;
    const diskonPrice = originalPrice - diskonAmount;
    return diskonAmount;
  };
  const calculatePersentaseDiskon = (subtotal: string, persentase: number): string => {
    const diskon = (parseInt(subtotal) * persentase) / 100;
    return diskon.toString(); // pastikan dikonversi ke string
  };

  const TotalAmount = () => {
    let total = 0
    selectedProduct.forEach((product: { jumlah: string, diskon: string, price: string; }) => {
      const disk = parseInt(product.diskon) || 0;
      const deis = disk + parseInt(valuespcs);
      total += subTotal(product.jumlah, deis.toString(), product.price, 'tidak')
    });
    return total
  }

  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paymentMethodsplit, setPaymentMethodsplit] = useState<string>('cash');
  const [paymentMethodsplit2, setPaymentMethodsplit2] = useState<string>('cash');
  const [split, setSplit] = useState<string>('');

  const handlePaymentMethodChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethodsplit(event.target.value);
  };
  const handlePaymentMethodChange3 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethodsplit2(event.target.value);
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
    const datasplit = event.target.value === 'split' ? 'masuk' : '';
    console.log(event.target.value);
    setSplit(datasplit);
    if (event.target.value !== 'cash' && event.target.value !== 'split') {
      setAmountPay(TotalAmount().toString())
    } else {
      setAmountPay('0')
      inputuang.current?.focus();
    }
  };
  const handlemethodChaange = (event: any, idku: any) => {
    const updatedSelectedProduct = selectedProduct.map((product: Product) => {
      // Periksa jika product.id cocok dengan produk yang ingin diperbarui
      // const hargaunitString = event.target.value;
      // let nilaiNumerik: string = ''; // pastikan tipe variabel sesuai kebutuhan

      // nilaiNumerik = ""+parseInt(hargaunitString);
      var str = "";
      var newarr = str.split(" ");


      if (product.id === parseInt(idku)) {
        const calculateAbsoluteDifference = (a: number, b: number) => Math.abs(a - b);
        const hargaUnit = product.hargaatingkat.reduce((closest: { minimum: number; }, current: { minimum: number; }) => {
          const currentDifference = calculateAbsoluteDifference(parseInt(event), current.minimum);
          const closestDifference = calculateAbsoluteDifference(parseInt(event), closest.minimum);

          // Memilih elemen dengan perbedaan minimum yang lebih kecil
          return currentDifference < closestDifference ? current : closest;
        });
        console.log('hargaUnit:', hargaUnit);        // console.log('hargaunit', hargaUnit.price); 
        console.log('product:', hargaUnit.unitName);
        console.log('newarr:', hargaUnit.price);
        console.log('product.hargaatingkat:', product.hargaatingkat);
        // Lakukan pembaruan pada properti defaultunit
        return {
          ...product,
          defaultunit: hargaUnit.unitName,
          price: hargaUnit.price,
        };
      }
      // Jika product.id tidak cocok, kembalikan produk tanpa perubahan
      return product;
    });

    // Atur ulang state dengan array yang diperbarui
    setSelectedProduct(updatedSelectedProduct);

  }
  const getNextIndex = (currentIndex: number): number => {
    let nextIndex = currentIndex + 1;

    // Add your conditions here to skip certain indices
    while (nextIndex < inputRefs.current.length) {
      nextIndex++;
    }

    // If nextIndex exceeds the array length, wrap around
    if (nextIndex >= inputRefs.current.length) {
      nextIndex = 0;
    }

    return nextIndex;
  };
  const calculateTotalPayment = () => {
    try {
      const parsedAmountPay = parseInt(amountPay.replace(/,/g, ''), 10) || 0;
      const parsedAmountPay1 = parseInt(amountPay1.replace(/,/g, ''), 10) || 0;
      const parsedAmountPay3 = parseInt(amountPay3.replace(/,/g, ''), 10) || 0;

      const totalPayment = parsedAmountPay + parsedAmountPay1 + parsedAmountPay3;

      // Update your state or perform any action with the totalPayment value
      // Example: setTotalPayment(totalPayment);

      return totalPayment;
    } catch (error) {
      console.error('Error calculating total payment:', error);
      return 0; // Handle the error gracefully
    }
  };

  const [respon, setRespon] = useState<any>({});
  const tampilData = () => {
    getrespon()

      .then(data => {
        console.log('muncul', data);
        setRespon(data);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  };
  useEffect(() => {
    tampilData();
  }, []);


  return (
    <div className='container'>
      <div>
        {showModal && (

          <div className="modal fade show" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">INPUT SALDO AWAL CASH DRAWER
                  </h1>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="col-form-label">Input Saldo Awal Cash Drawer
                      </label>
                      <input
                        type="text"
                        ref={inputModalRef}
                        className="form-control"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            closeModal();
                          }
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='card-header row justify-content-between border-0 mt-4 mb-3 shadow-lg p-3 rounded bg-white'>
        {/* <h2>Penjualan Produk</h2> */}
        <h2>{respon?.store?.store_name || 'Store not available'}</h2>
        <div className='col-12 col-md-2 mb-2 mt-4 d-flex align-items-center gap-5'>
          <div>
            <div className='d-flex align-items-center position-relative my-1 col-3'>
              <i className="fas fa-search position-absolute ms-3"></i>
              <input className="form-control w-200px ps-9"
                onKeyDown={(e) => {
                  console.log("key", e.key);

                  if (e.key == 'Tab') {
                    e.preventDefault();
                    setSearchValue('')
                    // Fokus pada input pertama di dalam tabel
                    const firstInputInTable = tableRef.current?.querySelector('input');
                    console.log("keysss", firstInputInTable);
                    if (firstInputInTable) {
                      firstInputInTable.focus();
                    } else {
                      dropdownRef.current?.focus();
                    }
                  } else if (e.key == 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((prevIndex) =>
                      prevIndex === null ? filteredData.length - 1 : Math.max(0, prevIndex - 1)
                    );
                  } else if (e.key == 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((prevIndex) =>
                      prevIndex === null ? 0 : Math.min(filteredData.length - 1, prevIndex + 1)
                    );
                  } else if (e.key == 'Enter') {
                    e.preventDefault();
                    if (filteredData.length === 1) {
                      handleSelectProduct(filteredData[0])
                    } else if (filteredData.length === 0) {
                      setSearchValue('')
                    } else {
                      handleSelectProduct(filteredData[selectedIndex])
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setSearchValue('');
                  }
                }}
                placeholder='Search'
                onFocus={() => {
                  if (inputModalRef2.current) {
                    inputModalRef2.current.style.borderColor = 'blue';
                  }
                }}
                onBlur={() => {
                  if (inputModalRef2.current) {
                    inputModalRef2.current.style.borderColor = '';
                  }
                }}
                data-kt-user-table-filter="search"
                value={searchValue}
                ref={inputModalRef2}
                onChange={e => handleSearchProduct(e)}
              >
              </input>
            </div>
          </div>
          <div className='col-3'>
            <select
              className="w-250px form-control"
              value={valuemember}
              onChange={(e) => {
                setValuemember(e.target.value)
                const memberId = parseInt(e.target.value, 10);
                const hargaUnit = member.find((memberData) => memberData.id === memberId);
                if (hargaUnit !== undefined) {
                  setValuespcs(hargaUnit.default_discount)
                } else {
                  setValuespcs('0')
                }
                // Lakukan pembaruan pada properti defaultunit
              }}
            >
              <option value="">Pilih Pelanggaan</option>
              {member.map((option, index: number) => (
                <option key={index} value={option.id}>
                  {`${option.name}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {searchValue && (
          <div className="card-title">
            <div className="search-results position-absolute bg-white border rounded " style={{ marginTop: "-15px", width: "auto" }} >

              <ul className="list-group" style={{ marginBottom: '10px' }}>
                <div
                  className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                    Nama
                  </div>
                  <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                    Kode
                  </div>
                  <div className="col ms-auto" style={{ flex: 1, minWidth: 100, fontWeight: 'bold' }}>
                    Harga
                  </div>
                  <div className="ms-auto" style={{ flex: 0.5, minWidth: 50, fontWeight: 'bold' }}>
                    Stok
                  </div>
                </div>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <a
                      key={item.id}
                      style={{
                        cursor: 'pointer',
                        color: index === selectedIndex ? 'white' : 'black', // Change text color here
                        backgroundColor: index === selectedIndex ? '#34759a' : '',
                      }}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onClick={() => {
                        inputModalRef2.current?.focus();
                        handleSelectProduct(item)
                      }}
                    >
                      <div className="col ms-auto" style={{ flex: 1, minWidth: 100 }}>
                        {item.name}
                      </div>
                      <div className="col ms-auto" style={{ flex: 1, minWidth: 100 }}>
                        {item.code}
                      </div>
                      <div className="col ms-auto" style={{ flex: 1, minWidth: 100 }}>
                        {item.hargaatingkat.map((harga: {
                          unitName: ReactNode;
                          minimum: ReactNode; price: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
                        }, index: React.Key | null | undefined) => (
                          <div key={index}>
                            {harga.minimum} {harga.unitName} - {harga.price}
                          </div>
                        ))}
                      </div>
                      <div className="ms-auto" style={{ flex: 0.5, minWidth: 50 }}>
                        {`${item.stok} `}
                      </div>
                    </a>
                  ))
                ) : (
                  <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Belum Ada Data Produk</h1>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <Pembayaran showPayment={showPayment} onClosePayment={handleClosePayment} onClosePayment2={handleClosePayment2} onTahanPayment={handlertahan} datapayment={selectedProduct} totalQty={totalQty()} totamount={TotalAmount()} paymentMethod={paymentMethod} paymentMethod1={paymentMethodsplit} paymentMethod2={paymentMethodsplit2} amountPay={parseInt(amountPay.replace(/,/g, ''), 10)} amountPay1={parseInt(amountPay1.replace(/,/g, ''), 10)} amountPay2={parseInt(amountPay3.replace(/,/g, ''), 10)} bayar={calculateTotalPayment()} idmember={valuemember} defaultdis={valuespcs} trans_id={transid} />
      <TahanTransaksi showTahanTransaksi={showTahanTransaksi} onCloseTahanTransaksi={handleCloseTahanTransaksi} ongetData={datashowdata} datatransakksi={tahanTransaksi} idtrans={setidTransaksi} />
      <div className='row container-fluid border-0 mt-4 mb-3 shadow-lg bg-white rounded'>
        <div className='table-responsive'>
          {/* begin::Table */}
          <table ref={tableRef} className='table table-striped table-row-bordered table-row-white-100 align-middle'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-bolder'>
                <th className='col-3' >Nama Produk</th>
                <th className='min-w-80px'>Kode</th>
                <th className='min-w-125px'>Kwantitas</th>
                <th className='min-w-125px'>Harga</th>
                <th className='min-w-125px'>Diskon</th>
                <th className='min-w-140px'>Subtotal</th>
                <th className='min-w-80px'>Aksi</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {selectedProduct.map((val: any, index: number) => (
                <tr key={val.id} >
                  <td>
                    <a href='#' className='text-dark fw-bold text-hover-primary fs-6 ms-2' style={{ width: '50px' }}>
                      {val.name}
                    </a>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                      {val.code}
                    </p>
                  </td>
                  <td align='center' className='text-dark fw-bold text-hover-primary fs-6 row'>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        className='form-control'
                        type='number'
                        ref={(ref) => {
                          if (ref) {
                            const inputRef = { current: ref } as React.RefObject<HTMLInputElement>;
                            inputRefs.current[index] = inputRef;
                          }
                        }}
                        value={productQty[val.id] ? productQty[val.id] : val.jumlah}
                        onChange={(e) => handleChangeQty(val.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            const currentInputIndex = inputRefs.current.findIndex((ref) => ref.current === e.currentTarget);
                            const isLastInput = currentInputIndex === inputRefs.current.length - 1;
                            const nextIndex = getNextIndex(currentInputIndex);
                            const cur = isLastInput === true ? 0 : currentInputIndex + 1;
                            console.log('current', cur);

                            inputdiskonRefs.current[currentInputIndex].current?.focus()
                          } else if (e.key === 'Enter') {
                            dropdownRef.current?.focus(); // Pindah ke dropdown
                          } else if (e.shiftKey && e.key === 'Backspace') {
                            e.preventDefault();
                            const currentInputIndex = inputRefs.current.findIndex((ref) => ref.current === e.currentTarget);
                            const isLastInput = currentInputIndex === inputRefs.current.length - 1;
                            const nextIndex = getNextIndex(currentInputIndex);
                            const cur = isLastInput === true ? 0 : currentInputIndex - 1 == -1 ? 0 : currentInputIndex - 1;
                            console.log(cur);
                            if (selectedProduct.length === 0 || selectedProduct.length === 1) {
                              handleRemoveItem(val.id)
                              inputModalRef2.current?.focus();
                            } else if (selectedProduct.length > 1) {
                              if (isLastInput) {
                                handleRemoveItem(val.id)
                                inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                              } else {
                                handleRemoveItem(val.id)
                                inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                              }
                            }
                          }
                        }}
                      />
                      {/* <select
                        ref={dropdownRef}
                        className=" form-control-solid-bg form-control"
                        value={val.defaultunit}
                        style={{ width: '100px', height: '40px' }}
                        onChange={(e) => {
                          handlemethodChaange(e, val.id);
                        }}  >
                        {val.hargaatingkat.map((option: {
                          unitName: any; price: string | number | readonly string[] | undefined; minimum: any;
                        }, index: number) => (
                          <option key={index} value={`${option.minimum} ${option.unitName}`}>
                            {`${option.minimum} ${option.unitName}`}
                          </option>
                        ))}

                      </select> */}
                    </div>
                  </td>
                  <td>
                    <span>{convertIDR(val.price)}</span>
                  </td>
                  <td className="d-flex justify-content-between align-items-center">
                    <input
                      className='form-control'
                      type='number'
                      ref={(ref) => {
                        if (ref) {
                          const inputRef = { current: ref } as React.RefObject<HTMLInputElement>;
                          inputdiskonRefs.current[index] = inputRef;
                        }
                      }}
                      value={val.diskon}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const currentInputIndex = inputdiskonRefs.current.findIndex((ref) => ref.current === e.currentTarget);
                          const isLastInput = currentInputIndex === inputdiskonRefs.current.length - 1;
                          const nextIndex = getNextIndex(currentInputIndex);
                          const cur = isLastInput === true ? 0 : currentInputIndex + 1;
                          inputdiskonRefs2.current[currentInputIndex].current?.focus()
                        } else if (e.key === 'Enter') {
                          dropdownRef.current?.focus(); // Pindah ke dropdown
                        } else if (e.shiftKey && e.key === 'Backspace') {
                          e.preventDefault();
                          const currentInputIndex = inputdiskonRefs.current.findIndex((ref) => ref.current === e.currentTarget);
                          const isLastInput = currentInputIndex === inputdiskonRefs.current.length - 1;
                          const nextIndex = getNextIndex(currentInputIndex);
                          const cur = isLastInput === true ? 0 : currentInputIndex - 1 == -1 ? 0 : currentInputIndex - 1;
                          console.log(cur);
                          if (selectedProduct.length === 0 || selectedProduct.length === 1) {
                            handleRemoveItem(val.id)
                            inputModalRef2.current?.focus();
                          } else if (selectedProduct.length > 1) {
                            if (isLastInput) {
                              handleRemoveItem(val.id)
                              inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                            } else {
                              handleRemoveItem(val.id)
                              inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                            }
                          }
                        }
                      }}
                      onChange={(e) => handlediskon(val.id, e.target.value, 'present')}
                      min={0}

                    />
                    <span className="percent-text">%</span>

                    <input
                      className='form-control'
                      type='number'
                      value={val.diskonprice}
                      ref={(ref) => {
                        if (ref) {
                          const inputRef = { current: ref } as React.RefObject<HTMLInputElement>;
                          inputdiskonRefs2.current[index] = inputRef;
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const currentInputIndex = inputdiskonRefs2.current.findIndex((ref) => ref.current === e.currentTarget);
                          const isLastInput = currentInputIndex === inputdiskonRefs2.current.length - 1;
                          const nextIndex = getNextIndex(currentInputIndex);
                          const cur = isLastInput === true ? 0 : currentInputIndex + 1;
                          console.log('daataalast', isLastInput);

                          if (selectedProduct.length > 0) {
                            console.log('cek');
                            // Jika lebih dari satu input dan ini input terakhir
                            if (isLastInput === true || selectedProduct.length === 1) {
                              console.log('cek3');
                              dropdownRef.current?.focus(); // Pindah ke inputModalRef
                            } else {
                              console.log('cek4');
                              inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                            }
                          } else {
                            console.log('cek5');
                            // Jika selectedProduct.length sama dengan 0
                            dropdownRef.current?.focus(); // Pindah ke dropdown
                          }

                        } else if (e.key === 'Enter') {
                          dropdownRef.current?.focus(); // Pindah ke dropdown
                        } else if (e.shiftKey && e.key === 'Backspace') {
                          e.preventDefault();
                          const currentInputIndex = inputdiskonRefs2.current.findIndex((ref) => ref.current === e.currentTarget);
                          const isLastInput = currentInputIndex === inputdiskonRefs2.current.length - 1;
                          const nextIndex = getNextIndex(currentInputIndex);
                          const cur = isLastInput === true ? 0 : currentInputIndex - 1 == -1 ? 0 : currentInputIndex - 1;
                          console.log(cur);
                          if (selectedProduct.length === 0 || selectedProduct.length === 1) {
                            handleRemoveItem(val.id)
                            inputModalRef2.current?.focus();
                          } else if (selectedProduct.length > 1) {
                            if (isLastInput) {
                              handleRemoveItem(val.id)
                              inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                            } else {
                              handleRemoveItem(val.id)
                              inputRefs.current[cur].current?.focus(); // Pindah ke input berikutnya
                            }
                          }
                        }
                      }}
                      onChange={(e) => handlediskon(val.id, e.target.value, 'now')}
                    />
                  </td>
                  <td>
                    <span>{convertIDR(subTotal(val.jumlah, val.diskon, val.price, 'tidak'))}</span>
                  </td>
                  <td>
                    <button className="btn btn-white btn-sm" onClick={() => handleRemoveItem(val.id)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {valuespcs !== '0' && (
                <tr>
                  <td colSpan={3}></td>
                  <td colSpan={2}>
                    <h1>Diskon member</h1>
                  </td>
                  <td colSpan={2}>
                    <h1>{valuespcs}%</h1>
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={3}></td>
                <td colSpan={2}>
                  <h1>Grand Total</h1>
                </td>
                <td colSpan={2}>
                  <h1>{convertIDR(TotalAmount())}</h1>
                </td>
              </tr>
              {/* <tr>
                <td colSpan={4}></td>
                <td colSpan={2}>
                  <h3>Jumlah Barang</h3>
                </td>
                <td colSpan={2}>
                  <h3>{totalQty()}</h3>
                </td>
              </tr> */}
              {/* <tr>
              <td colSpan={6}></td>
              <td>
                <h5 className='text-light text-bold-success'>Diskon</h5>
              </td>
              <td>
                <h5 className='text text-success'>0</h5>
              </td>
            </tr> */}
              <tr>
                <td colSpan={3}></td>
                <td colSpan={2}>
                  <h2>Tipe Bayar</h2>
                </td>
                <td colSpan={2}>
                  <select
                    ref={dropdownRef}
                    className=" form-control-solid-bg form-control"
                    value={paymentMethod}
                    onFocus={() => {
                      if (dropdownRef.current) {
                        dropdownRef.current.style.borderColor = 'blue';
                      }
                    }}
                    onBlur={() => {
                      if (dropdownRef.current) {
                        dropdownRef.current.style.borderColor = '';
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (paymentMethod === 'cash') {
                          setSplit('')
                          inputuang.current?.focus();
                        } if (paymentMethod === 'split') {
                          setSplit('masuk')
                        } else {
                          setSplit('')
                          handlePaymentClick();
                        }
                      }
                    }}
                    onChange={(e) => {
                      handlePaymentMethodChange(e);
                    }}                  >
                    <option value="cash">Tunai</option>
                    <option value="qris">QRIS</option>
                    <option value="transfer">EDC / Transfer</option>
                    <option value="split">Split</option>
                  </select>

                </td>
              </tr>
              {paymentMethod === 'cash' && (
                <tr>
                  <td colSpan={3}></td>

                  <td colSpan={2}>
                    <h1>Bayar</h1>
                  </td>
                  <td colSpan={2}>

                    <input
                      className='form-control'
                      type="text"
                      value={amountPay}
                      ref={inputuang}
                      onFocus={() => {
                        if (inputuang.current) {
                          inputuang.current.style.borderColor = 'blue';
                        }
                      }}
                      onBlur={() => {
                        if (inputuang.current) {
                          inputuang.current.style.borderColor = '';
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (parseInt(amountPay.replace(/,/g, ''), 10) !== 0 && parseInt(amountPay.replace(/,/g, ''), 10) >= TotalAmount()) {
                            handlePaymentClick();
                          } else {
                            toast.error('Harap Periksa Data Anda ' + paymentMethod)
                            console.log('total', TotalAmount());
                            console.log('total', parseInt(amountPay.replace(/,/g, ''), 10));
                          }
                        } else if (e.key === 'Tab') {
                          e.preventDefault();
                          historiRef.current?.focus();
                        }
                      }}
                      onChange={handleInputChange2} />
                    {/* <h6 className='mt-2'>Rp {amountPay}</h6> */}
                  </td>
                </tr>
              )}
              {
                split !== '' && (
                  <>
                    <tr>
                      <td colSpan={3}></td>
                      <td colSpan={2}>
                        <h2>Tipe Bayars Split 1</h2>
                      </td>
                      <td colSpan={2}>
                        <select
                          ref={dropdownRef1}
                          className=" form-control-solid-bg form-control"
                          value={paymentMethodsplit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              inputuang2.current?.focus();
                            }
                          }}
                          onChange={(e) => {
                            handlePaymentMethodChange2(e);
                          }}>
                          <option value="cash">Tunai</option>
                          <option value="qris">QRIS</option>
                          <option value="transfer">EDC / Transfer</option>
                        </select>

                      </td>
                    </tr><tr>
                      <td colSpan={3}></td>

                      <td colSpan={2}>
                        <h1>Bayar</h1>
                      </td>
                      <td colSpan={2}>

                        <input
                          className='form-control'
                          type="text"
                          value={amountPay1}
                          ref={inputuang2}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const dataa = parseInt(amountPay3.replace(/,/g, ''), 10) + parseInt(amountPay1.replace(/,/g, ''), 10);
                              console.log('totamount', dataa);

                              if (TotalAmount() - 1 < dataa) {
                                handlePaymentClick();
                              } else {
                                toast.error('Harap Periksa Data Anda ');
                                console.log('total', TotalAmount());
                                console.log('total', parseInt(amountPay1.replace(/,/g, ''), 10));
                              }
                            } else if (e.key === 'Tab') {
                              e.preventDefault();
                              dropdownRef2.current?.focus();
                            }
                          }}
                          onChange={handleInputChange3} />
                        {/* <h6 className='mt-2'>Rp {amountPay}</h6> */}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}></td>
                      <td colSpan={2}>
                        <h2>Tipe Bayars Split 2</h2>
                      </td>
                      <td colSpan={2}>
                        <select
                          ref={dropdownRef2}
                          className=" form-control-solid-bg form-control"
                          value={paymentMethodsplit2}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              inputuang3.current?.focus();
                            }
                          }}
                          onChange={(e) => {
                            handlePaymentMethodChange3(e);
                          }}>
                          <option value="cash">Tunai</option>
                          <option value="qris">QRIS</option>
                          <option value="transfer">EDC / Transfer</option>
                        </select>

                      </td>
                    </tr><tr>
                      <td colSpan={3}></td>

                      <td colSpan={2}>
                        <h1>Bayar</h1>
                      </td>
                      <td colSpan={2}>

                        <input
                          className='form-control'
                          type="text"
                          value={amountPay3}
                          ref={inputuang3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const dataa = parseInt(amountPay3.replace(/,/g, ''), 10) + parseInt(amountPay1.replace(/,/g, ''), 10);
                              console.log('totamount', dataa);

                              if (TotalAmount() - 1 < dataa) {
                                handlePaymentClick();
                              } else {
                                toast.error('Harap Periksa Data Anda ');
                                console.log('total', TotalAmount());
                                console.log('total', parseInt(amountPay3.replace(/,/g, ''), 10));
                              }
                            } else if (e.key === 'Tab') {
                              e.preventDefault();
                              historiRef.current?.focus();
                            }
                          }}
                          onChange={handleInputChange4} />
                        {/* <h6 className='mt-2'>Rp {amountPay}</h6> */}
                      </td>
                    </tr>
                  </>
                )
              }
              <tr>
                <td colSpan={3}></td>
                <td colSpan={2}>
                  <h1>Kembali</h1>
                </td>
                <td colSpan={2}>
                  {paymentMethod === 'cash' ? <h1>{convertIDR(parseInt(amountPay.replace(/,/g, ''), 10) - TotalAmount())}</h1> : split !== '' ? <h1>{convertIDR((parseInt(amountPay3.replace(/,/g, ''), 10) + parseInt(amountPay1.replace(/,/g, ''), 10)) - TotalAmount())}</h1> : <h1>Rp 0</h1>}
                </td>
              </tr>

              <tr>
                <td className="col-10 d-flex">
                  <button ref={historiRef}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        tahanRef.current?.focus();
                      }
                    }}
                    className='col-10 btn btn-info btn-lg text-wrap mt-2 me-2' onClick={handleTahanTransaksiClick}>
                    Histori Transaksi
                  </button>
                  <button ref={tahanRef}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        inputModalRef2.current?.focus();
                      }
                    }}
                    className='col-10 btn btn-secondary btn-lg text-wrap mt-2 me-2' onClick={handlertahan}>
                    <span>Tahan Transaksi</span>
                  </button>
                </td>
              </tr>



              {/* <td colSpan={8} className="text-end">
                <button className='btn btn-primary me-2' onClick={handlePaymentClick}>
                  button
                </button>
              </td> */}

            </tbody>

            {/* end::Table body */}
          </table>
          <ToastContainer position="top-right" autoClose={2000} />
          {/* <div className="d-flex justify-content-end mt-4">
            <table className="table table-striped table-rounded border border-gray-300 table-row-bordered table-row-gray-300 gy-7" style={{ width: '50%', textAlign: 'center' }}>
              <tbody>
                <tr>

                  <td className="fw-bolder text-gray-800" style={{ width: '50%' }}> <h3>JUMLAH BARANG</h3> </td>
                  <td >
                    <td className='border'>
                      <h1><strong>{totalQty()}</strong></h1>

                    </td>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bolder text-gray-800" style={{ width: '50%' }}> <h2>GRAND TOTAL</h2> </td>
                  <td className='border'>
                    <h1><strong>{convertIDR(TotalAmount())}</strong></h1>

                  </td>
                </tr>
                <tr>
                  <td className="fw-bolder text-gray-800" style={{ width: '50%' }}> <h2>BAYAR</h2></td>
                  <td >
                    <input
                      className='form-control'
                      type='number'
                      value={amountPay}
                      onChange={(e) => setAmountPay(parseInt(e.target.value))}
                    />
                    <h6 className='text-light text-bold-success mt-2'>{convertIDR(amountPay)}</h6>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bolder text-gray-800" style={{ width: '50%' }} > <h3>KEMBALIAN</h3> </td>
                  <td>
                    <h1><strong>{convertIDR(amountPay - TotalAmount())}</strong></h1>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
          {/* end::Table */}
        </div>
        {/* <div className="d-grid">
          <button className="btn btn-primary" type="button">finish</button>
        </div> */}
      </div>
      {/* </div> */}
    </div>

  )
}

export default DashboardPage
function TotalAmount() {
  throw new Error('Function not implemented.');
}

