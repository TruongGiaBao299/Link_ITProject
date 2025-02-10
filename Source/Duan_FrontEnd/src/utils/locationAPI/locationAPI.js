import axios from "./axiosLocation";

// Lấy data người dùng
export const getLocationAPI = () => {
  const URL_API = "/location/getall";

  return axios.get(URL_API);
};
