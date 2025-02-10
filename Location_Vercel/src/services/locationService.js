const axios = require("axios");

const getAllDistrictAndWardService = async () => {
    try {
      // Gửi yêu cầu HTTP tới API
      const response = await axios.get(`https://provinces.open-api.vn/api/?depth=3`);
  
      // Trả về dữ liệu quận/huyện, phường/xã
      return response.data; 
    } catch (error) {
      console.error("Error fetching district and ward information:", error.message);
      throw new Error("Failed to fetch district and ward data");
    }
  };

module.exports = { getAllDistrictAndWardService};
