const {
  createPostOfficeService,
  getPostOfficeService,
  updatePostOfficeStatusService,
  UnActivePostOfficeStatusService,
  deletePostOfficeService,
  getPostOfficeByEmailService,
} = require("../services/postOfficeService");

// Tạo bưu cục
const createPostOffice = async (req, res) => {
  const { email } = req.user;
  // tạo request body
  const {
    OfficeUserName,
    OfficeUserNumber,
    OfficeUserId,
    OfficeUserAddress,
    OfficeName,
    OfficeHotline,
    OfficeAddress,
    OfficeDistrict,
    OfficeWard,
    OfficeCity,
  } = req.body;
  // tạo đơn
  const data = await createPostOfficeService(
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
    OfficeCity,
  );
  return res.status(200).json(data);
};

// Lấy dữ liệu bưu cục
const getPostOffice = async (req, res) => {
  // tạo request body
  const data = await getPostOfficeService();
  return res.status(200).json(data);
};

// đổi trạng thái bưu cục thành active
const updatePostOfficeStatus = async (req, res) => {
  const { email } = req.params; // Get email from URL parameters

  try {
    const updatedPostOffice = await updatePostOfficeStatusService(email);

    if (!updatedPostOffice) {
      return res.status(404).json({
        message: "PostOffice not found or update failed",
      });
    }

    return res.status(200).json({
      message: "PostOffice status updated successfully",
      data: updatedPostOffice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// đổi trạng thái bưu cục thành not activated
const UnActivePostOfficeStatus = async (req, res) => {
  const { email } = req.params; // Get email from URL parameters

  try {
    const updatedPostOffice = await UnActivePostOfficeStatusService(email);

    if (!updatedPostOffice) {
      return res.status(404).json({
        message: "PostOffice not found or update failed",
      });
    }

    return res.status(200).json({
      message: "PostOffice status updated successfully",
      data: updatedPostOffice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Xóa đơn hàng
const deletePostOffice = async (req, res) => {
  const { email } = req.params; // Get email from URL parameters

  // Call the service function
  const result = await deletePostOfficeService(email);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const getPostOfficeByEmail = async (req, res) => {
  const { email } = req.user; // Extract the email of the logged-in user

  // Fetch orders by email and filter by the specific order id
  const data = await getPostOfficeByEmailService(email);

  if (!data) {
    return res.status(404).json({
      message: "không tìm thấy bưu cục với email này",
    });
  }

  return res.status(200).json(data);
};

module.exports = {
  createPostOffice,
  getPostOffice,
  updatePostOfficeStatus,
  UnActivePostOfficeStatus,
  deletePostOffice,
  getPostOfficeByEmail
};
