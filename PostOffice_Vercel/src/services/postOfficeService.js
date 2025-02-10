require("dotenv").config();
const PostOffice = require("../models/postoffice");
const axios = require("axios");

// HERE API Key
const HERE_API_KEY = "MnTadIKOVDRqhQYalpBxtEG3AiWROupfqiPOBzfiWsw";

// Hàm chuyển địa chỉ thành tọa độ (latitude, longitude)
const geocodeAddressWithHERE = async (address) => {
  try {
    const response = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode`,
      {
        params: {
          q: address,
          apiKey: HERE_API_KEY,
        },
      }
    );

    if (response.data.items.length > 0) {
      const { lat, lng } = response.data.items[0].position;
      return { lat, lng };
    } else {
      throw new Error("Không tìm thấy tọa độ cho địa chỉ.");
    }
  } catch (error) {
    console.error("Error during HERE geocoding:", error.message);
    throw error;
  }
};

// Tạo bưu cục
const createPostOfficeService = async (
  OfficeUserName,
  OfficeUserNumber,
  OfficeUserId,
  OfficeUserAddress,
  email,
  OfficeName,
  OfficeHotline,
  OfficeAddress,
  OfficeDistrict,
  OfficeWard,
  OfficeCity
) => {
  try {
    const fullAddress = `${OfficeAddress}, ${OfficeWard}, ${OfficeDistrict}, ${OfficeCity}`;
    const { lat, lng } = await geocodeAddressWithHERE(fullAddress);
    let result = await PostOffice.create({
      OfficeUserName: OfficeUserName,
      OfficeUserNumber: OfficeUserNumber,
      OfficeUserId: OfficeUserId,
      OfficeUserAddress: OfficeUserAddress,
      email: email,
      OfficeName: OfficeName,
      OfficeHotline: OfficeHotline,
      OfficeAddress: OfficeAddress,
      OfficeDistrict: OfficeDistrict,
      OfficeWard: OfficeWard,
      OfficeCity: OfficeCity,
      OfficeLatitude: lat,
      OfficeLongitude: lng,
      status: "not activated",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy dữ liệu bưu cục
const getPostOfficeService = async () => {
  try {
    let result = await PostOffice.find({});
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// đổi trạng thái bưu cục thành active
const updatePostOfficeStatusService = async (email) => {
  try {
    // Tìm và cập nhật driver theo ID
    const result = await PostOffice.findOneAndUpdate(
      { email: email },

      {
        status: "active",
      },
      { new: true } // Trả về document đã cập nhật
    );

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// đổi trạng thái bưu cục thành not activated
const UnActivePostOfficeStatusService = async (email) => {
  try {
    // Tìm và cập nhật driver theo ID
    const result = await PostOffice.findOneAndUpdate(
      { email: email },
      {
        status: "not activated",
      },
      { new: true } // Trả về document đã cập nhật
    );

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Xóa bưu cục
const deletePostOfficeService = async (email) => {
  try {
    // Find and delete the user by ID
    const result = await PostOffice.findOneAndDelete({ email: email });
    if (!result) {
      return { success: false, message: "không tìm thấy bưu cục" };
    }
    return { success: true, message: "xóa bưu cục thành công" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "lỗi trong quá trình xóa bưu cục" };
  }
};

// lấy dữ liệu postoffice bằng email
const getPostOfficeByEmailService = async (email) => {
  try {
    // Tìm bưu cục theo email (chỉ trả về một kết quả)
    const postOffice = await PostOffice.findOne({
      email: email, // Tìm theo email
    });

    if (!postOffice) {
      console.log("Không tìm thấy bưu cục với email:", email);
      return null; // Trả về null nếu không tìm thấy
    }

    return postOffice; // Trả về bưu cục nếu tìm thấy
  } catch (error) {
    console.log("Lỗi khi tìm bưu cục:", error);
    return null;
  }
};

module.exports = {
  createPostOfficeService,
  getPostOfficeService,
  updatePostOfficeStatusService,
  UnActivePostOfficeStatusService,
  deletePostOfficeService,
  getPostOfficeByEmailService
};
