import axios from "./axiosPostOffice";
import axiosorder from "../orderAPI/axiosOrder";

// Lấy data người dùng
export const getPostOfficeApi = () => {
  const URL_API = "/postoffice/get";

  return axios.get(URL_API);
};

// đổi status thành active
export const changeStatusPostOfficeApi = (email) => {
  const URL_API = `/postoffice/status/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// đổi status thành not activated
export const changeStatusNotActivatedPostOfficeApi = (email) => {
  const URL_API = `/postoffice/statusnotactive/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// xóa bưu cục
export const deleteRequestPostOffice = (email) => {
  const URL_API = `/postoffice/delete/${email}`; // Thêm id vào URL

  return axios.delete(URL_API);
};

// tạo bưu cục
export const createPostOfficeApi = (
  OfficeUserName,
  OfficeUserId,
  OfficeUserNumber,
  OfficeUserAddress,
  OfficeName,
  OfficeHotline,
  OfficeAddress,
  OfficeDistrict,
  OfficeWard,
  OfficeCity,
) => {
  const URL_API = "/postoffice/create";
  const data = {
    OfficeUserName,
    OfficeUserId,
    OfficeUserNumber,
    OfficeUserAddress,
    OfficeName,
    OfficeHotline,
    OfficeAddress,
    OfficeDistrict,
    OfficeWard,
    OfficeCity,
  };
  return axios.post(URL_API, data);
};

// Lấy đơn hàng theo gmail của tài xế
export const getPostOfficeOrderByEmailApi = () => {
  const URL_API = "/order/getpostofficeorderbyemail";

  return axiosorder.get(URL_API);
};

// Lấy tài xế theo gmail
export const getPostOfficeByEmailApi = () => {
  const URL_API = "/postoffice/getpostofficeemail";

  return axios.get(URL_API);
};