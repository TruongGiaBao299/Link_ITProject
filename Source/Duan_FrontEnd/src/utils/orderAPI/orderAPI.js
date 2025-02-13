import axios from "./axiosOrder";

// Tạo đơn hàng
export const createOrderApi = (
  senderName,
  senderNumber,
  fromAddress,
  fromDistrict,
  fromWard,
  fromCity,
  recipientName,
  recipientNumber,
  toAddress,
  toDistrict,
  toWard,
  toCity,
  orderWeight,
  orderSize,
  type,
  message
) => {
  const URL_API = "/order/create";
  const data = {
    senderName,
    senderNumber,
    fromAddress,
    fromDistrict,
    fromWard,
    fromCity,
    recipientName,
    recipientNumber,
    toAddress,
    toDistrict,
    toWard,
    toCity,
    orderWeight,
    orderSize,
    type,
    message,
  };
  return axios.post(URL_API, data);
};

// Lấy đơn hàng bằng id
export const getOrderByIdApi = (id) => {
  const URL_API = `/order/getorder/${id}`; // Thêm id vào URL

  return axios.get(URL_API);
};

// Lấy đơn hàng theo gmail
export const getOrderByEmailApi = () => {
  const URL_API = "/order/getorderemail";

  return axios.get(URL_API);
};

// Lấy đơn hàng bằng id
export const getOrderApi = () => {
  const URL_API = `/order/getorder`; // Thêm id vào URL

  return axios.get(URL_API);
};

// Hàm gọi API tra cứu giá cước
export const SearchPriceApi = (
  fromAddress,
  fromDistrict,
  fromWard,
  fromCity,
  toAddress,
  toDistrict,
  toWard,
  toCity,
  orderWeight,
  orderSize,
  type
) => {
  const URL_API = `/order/checkprice`;

  // Tạo payload chứa dữ liệu cần gửi
  const payload = {
    fromAddress,
    fromDistrict,
    fromWard,
    fromCity,
    toAddress,
    toDistrict,
    toWard,
    toCity,
    orderWeight,
    orderSize,
    type,
  };

  // Gửi request POST với payload
  return axios.post(URL_API, payload);
};