require("dotenv").config();
const Driver = require("../models/driver");

// Tạo tài xế
const createDriverService = async (
  // Sender
  DriverName,
  DriverNumber,
  email,
  DriverBirth,
  DriverId,
  DriverAddress,
  DriverDistrict,
  DriverWard,
  DriverCity,
  postOffice,
  role,
  status,
) => {
  try {
    let result = await Driver.create({
      DriverName: DriverName,
      DriverNumber: DriverNumber,
      email: email,
      DriverBirth: DriverBirth,
      DriverId: DriverId,
      DriverAddress: DriverAddress,
      DriverDistrict: DriverDistrict,
      DriverWard: DriverWard,
      DriverCity: DriverCity,
      postOffice: postOffice,
      role: role,
      status: "pending",
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy dữ liệu tài xế
const getDriverService = async () => {
  try {
    let result = await Driver.find({});
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update trạng thái hoạt động của tài xế
const updateDriverStatusService = async (email) => {
  try {
    // Find and update the driver by email
    const result = await Driver.findOneAndUpdate(
      { email: email }, // Query by DriverEmail
      {
        status: "active", // Update status
        role: "driver", // Update role
      },
      { new: true } // Return the updated document
    );

    return result;
  } catch (error) {
    console.error("Error updating driver status:", error);
    return null;
  }
};

// update hủy trạng thái hoạt động của tài xế
const updateDriverStatustoGuestService = async (email) => {
  try {
    // Find and update the driver by email
    const result = await Driver.findOneAndUpdate(
      { email: email }, // Query by DriverEmail
      {
        status: "pending", // Update status
        role: "guest", // Update role
      },
      { new: true } // Return the updated document
    );

    return result;
  } catch (error) {
    console.error("Error updating driver status:", error);
    return null;
  }
};

// Xóa tài xế
const deleteDriverService = async (email) => {
  try {
    // Find and delete the user by ID
    const result = await Driver.findOneAndDelete({ email: email });
    if (!result) {
      return { success: false, message: "Driver not found" };
    }
    return { success: true, message: "Driver request deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error deleting Driver request" };
  }
};

//  lấy dữ liệu tài xế bằng email
const getDriverByEmailService = async (email) => {
  try {
    // Tìm bưu cục theo email (chỉ trả về một kết quả)
    const driver = await Driver.findOne({
      email: email, // Tìm theo email
    });

    if (!driver) {
      console.log("Không tìm thấy tài xế với email:", email);
      return null; // Trả về null nếu không tìm thấy
    }

    return driver; // Trả về tài xế nếu tìm thấy
  } catch (error) {
    console.log("Lỗi khi tìm tài xế:", error);
    return null;
  }
};

module.exports = {
  createDriverService,
  updateDriverStatusService,
  getDriverService,
  updateDriverStatustoGuestService,
  deleteDriverService,
  getDriverByEmailService,
};
