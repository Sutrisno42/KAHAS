export function convertIDR(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 9,
  }).format(price)
}
export function formatCurrency(amount: string) {
  const amountNumber = parseInt(amount.replace(/,/g, ''), 10); // Ini akan menjadi angka 1000000
  const formattedAmount = isNaN(amountNumber) ? '0' : amountNumber.toLocaleString('en-US');
  return formattedAmount

}



export function convertDate(date: string) {
  const month = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dataDate = new Date(date.replace(" ", "T"));
  return `${dataDate.getDate()} ${month[dataDate.getMonth()]
    } ${dataDate.getFullYear()}`;
}

export function convertTime(date: string) {
  const dataDate = new Date(date.replace(" ", "T"));
  const hours =
    dataDate.getHours() <= 9 ? "0" + dataDate.getHours() : dataDate.getHours();
  const minutes =
    dataDate.getMinutes() <= 9
      ? "0" + dataDate.getMinutes()
      : dataDate.getMinutes();

  return `${hours}:${minutes}`;
}
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
export const formdate = (datestring: string) => {
  const parts = datestring.split("-");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}
export const formatDateSearch = (date: string, searchType: string) => {
  const [year, month, day] = date.split('-');
  if (searchType === 'monthly') {
    return `${month}-${year}`;
  } else {
    return `${day}-${month}-${year}`;
  }
};

//convert hari
export const getDaysRemaining = (expirationDate: string) => {
  const today = new Date();
  const expiration = new Date(expirationDate);
  const timeDiff = expiration.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysRemaining;
};