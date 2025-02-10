const {getAllDistrictAndWardService } = require("../services/locationService");

const getAllDistrictAndWard = async (req, res) => {
  try {
    const data = await getAllDistrictAndWardService();
    res.status(200).json(data); // Gửi dữ liệu về client
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch district and ward data" });
  }
};

module.exports = { getAllDistrictAndWard };
