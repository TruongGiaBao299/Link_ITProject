import axios from "./axiosDriver";
import axiosorder from "../orderAPI/axiosOrder";

// Tạo đơn hàng
export const createDriverApi = (
  DriverName,
  DriverNumber,
  DriverBirth,
  DriverId,
  DriverAddress,
  DriverDistrict,
  DriverWard,
  DriverCity,
  postOffice
) => {
  const URL_API = "/driver/create";
  const data = {
    DriverName,
    DriverNumber,
    DriverBirth,
    DriverId,
    DriverAddress,
    DriverDistrict,
    DriverWard,
    DriverCity,
    postOffice
  };
  return axios.post(URL_API, data);
};

// Lấy dữ liệu tài xế
export const getDriverApi = () => {
  const URL_API = `/driver/get`;

  return axios.get(URL_API);
};

// kích hoạt hoạt động tài xế
export const changeStatusDriverApi = (email) => {
  const URL_API = `/driver/active/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// ngừng kích hoạt tài xế
export const changeStatusDriverToGuestApi = (email) => {
  const URL_API = `/driver/noactive/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Lấy đơn hàng theo gmail của tài xế
export const getDriverOrderByEmailApi = () => {
  const URL_API = "/order/getdriverorderbyemail";

  return axiosorder.get(URL_API);
};

// Tài xế nhận đơn hàng
export const AcceptOrderApi = (id) => {
  const URL_API = `/order/acceptorder/${id}`; // Thêm id vào URL

  return axiosorder.post(URL_API);
};

// Tài xế nhận đơn hàng
export const AcceptOrderPrepareApi = (id) => {
  const URL_API = `/order/prepare/${id}`; // Thêm id vào URL

  return axiosorder.post(URL_API);
};

// Tài xế gửi về bưu cục
export const SentPostOfficeApi = (id, email) => {
  const URL_API = `/order/updatepostoffice/${id}`; // URL API với id đơn hàng
  return axiosorder.post(URL_API, { email }); // Gửi email trong body request
};

// Tài xế hủy đơn hàng
export const CancelledOrderApi = (id) => {
  const URL_API = `/order/canceledorder/${id}`; // Thêm id vào URL

  return axiosorder.post(URL_API);
};

// Tài xế đã giao đơn hàng
export const ShippedOrderApi = (id) => {
  const URL_API = `/order/shippedorder/${id}`; // Thêm id vào URL

  return axiosorder.post(URL_API);
};

// Tài xế đang giao đơn hàng
export const IsShippingOrderApi = (id) => {
  const URL_API = `/order/isshippingorder/${id}`; // Thêm id vào URL

  return axiosorder.post(URL_API);
};

// kích hoạt hoạt động tài xế
export const deleteRequestDriver = (email) => {
  const URL_API = `/driver/noaccept/${email}`; // Thêm id vào URL

  return axios.delete(URL_API);
};

// Lấy tài xế theo gmail
export const getDriverByEmailApi = () => {
  const URL_API = "/driver/getdriverbyemail";

  return axios.get(URL_API);
};

// update trạng thái trả tiền
export const paidAPI = (id) => {
  const URL_API = `/order/payment/${id}`; // URL API với id đơn hàng
  return axiosorder.post(URL_API); // Gửi email trong body request
};
