import axios from "./axiosUser";

// Tạo tài khoản
export const createUserApi = (name, email, password) => {
  const URL_API = "/user/register";
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

// Đăng nhập
export const loginApi = (email, password) => {
  const URL_API = "/user/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

// Lấy data người dùng
export const getUserApi = () => {
  const URL_API = "/user/user";

  return axios.get(URL_API);
};

// Lấy đơn hàng bằng id
export const makeDriverApi = (email) => {
  const URL_API = `/user/becomeDriver/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Lấy đơn hàng bằng id
export const makeGuestApi = (email) => {
  const URL_API = `/user/becomeGuest/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Lấy đơn hàng bằng id
export const makePostOfficeApi = (email) => {
  const URL_API = `/user/becomePostOffice/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Cập nhật mật khẩu
export const updatePasswordApi = (oldPassword, newPassword) => {
  const URL_API = "/user/updatepassword";
  const data = { oldPassword, newPassword };

  return axios.put(URL_API, data);
};