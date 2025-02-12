const {
  createOrderService,
  getOrderService,
  deleteOrderService,
  getOrderByIdService,
  getOrderByEmailService,
  updateOrderDriverStatusService,
  getDriverOrderByEmailService,
  updateOrderShippedStatusService,
  updateOrderCancelledStatusService,
  searchOrderService,
  updateOrderPostOfficeStatusService,
  getPostOfficeOrderByEmailService,
  updateOrderIsShippingStatusService,
  updateOrderPrepareStatusService,
  updatePaymentStatusService,
} = require("../services/orderService");

// Tạo đơn hàng
const createOrder = async (req, res) => {
  // Access the user email from req.user (set by the JWT middleware)
  const { email } = req.user;

  // Extract other request body data
  const {
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
  } = req.body;

  // Call the createOrderService and pass the email along with other data
  const data = await createOrderService(
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
    email, // Pass the email as createdBy
  );

  // Return the created order data
  return res.status(200).json(data);
};

// Lấy dữ liệu đơn hàng
const getOrder = async (req, res) => {
  // tạo request body
  const data = await getOrderService();
  return res.status(200).json(data);
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  // Call the service function
  const result = await deleteOrderService(id);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Lấy dữ liệu đơn hàng bằng id
const getOrderById = async (req, res) => {
  const { id } = req.params;

  // tạo request body
  const data = await getOrderByIdService(id);
  return res.status(200).json(data);
};

// lấy dữ liệu đơn hàng được tạo bởi email người dùng
const getOrderByEmail = async (req, res) => {
  const { email } = req.user; // Extract the email of the logged-in user

  // Fetch orders by email and filter by the specific order id
  const data = await getOrderByEmailService(email);

  if (!data) {
    return res.status(404).json({
      message: "không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn hàng này",
    });
  }

  return res.status(200).json(data);
};

// update trạng thái đơn hàng đang giao
const updateOrderDriverStatus = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const { email, } = req.user;

  try {
    const updatedDriver = await updateOrderDriverStatusService(id, email);

    if (!updatedDriver) {
      return res.status(404).json({
        message: "không tìm thấy tài xế hoặc cập nhật trạng thái không thành công",
      });
    }

    return res.status(200).json({
      message: "trạng thái đã được cập nhật thành đang giao",
      data: updatedDriver,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "lỗi server",
    });
  }
};

// lấy đơn hàng bằng email cho driver
const getDriverOrderByEmail = async (req, res) => {
  const { email } = req.user; // Extract the email of the logged-in user

  // Fetch orders by email and filter by the specific order id
  const data = await getDriverOrderByEmailService(email);

  if (!data) {
    return res.status(404).json({
      message: "không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn hàng này",
    });
  }

  return res.status(200).json(data);
};

// update đang ship hàng
const updateOrderIsShippingStatus = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const { email, } = req.user;

  try {
    const updatedDriver = await updateOrderIsShippingStatusService(id, email);

    if (!updatedDriver) {
      return res.status(404).json({
        message: "không tìm thấy tài xế hoặc cập nhật trạng thái không thành công",
      });
    }

    return res.status(200).json({
      message: "trạng thái đã được cập nhật thành đã giao",
      data: updatedDriver,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update đang ship hàng
const updateOrderPrepareStatus = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL

  try {
    const updatedDriver = await updateOrderPrepareStatusService(id);

    if (!updatedDriver) {
      return res.status(404).json({
        message: "không tìm thấy tài xế hoặc cập nhật trạng thái không thành công",
      });
    }

    return res.status(200).json({
      message: "trạng thái đã được cập nhật thành chuẩn bị giao",
      data: updatedDriver,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update đã ship hàng
const updateOrderShippedStatus = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL

  try {
    const updatedDriver = await updateOrderShippedStatusService(id);

    if (!updatedDriver) {
      return res.status(404).json({
        message: "không tìm thấy tài xế hoặc cập nhật trạng thái không thành công",
      });
    }

    return res.status(200).json({
      message: "trạng thái đã được cập nhật thành đã giao",
      data: updatedDriver,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update đã hủy hàng
const updateOrderCancelledStatus = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL

  try {
    const updatedDriver = await updateOrderCancelledStatusService(id);

    if (!updatedDriver) {
      return res.status(404).json({
        message: "không tìm thấy tài xế hoặc cập nhật trạng thái không thành công",
      });
    }

    return res.status(200).json({
      message: "trạng thái đã được cập nhật thành đã hủy",
      data: updatedDriver,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "lỗi server",
    });
  }
};

const searchOrder = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Gọi service để xử lý logic
    const result = await searchOrderService(
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
    );

    // Kiểm tra lỗi từ service
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // Trả về kết quả thành công
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in searchOrder controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update trạng thái đơn hàng đang giao
const updateOrderPostOfficeStatus = async (req, res) => {
  const { id } = req.params; // Lấy Order ID từ URL
  const { email } = req.body; // Lấy email từ body

  if (!email) {
    return res.status(400).json({
      message: "Email của bưu cục là bắt buộc.",
    });
  }

  try {
    const updatedOrder = await updateOrderPostOfficeStatusService(id, email);

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng hoặc cập nhật trạng thái không thành công.",
      });
    }

    return res.status(200).json({
      message: "Đã gửi đến bưu cục",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// lấy đơn hàng bằng email cho driver
const getPostOfficeOrderByEmail = async (req, res) => {
  const { email } = req.user; // Extract the email of the logged-in user

  // Fetch orders by email and filter by the specific order id
  const data = await getPostOfficeOrderByEmailService(email);

  if (!data) {
    return res.status(404).json({
      message: "không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn hàng này",
    });
  }

  return res.status(200).json(data);
};

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params; // Lấy ID đơn hàng

  try {
    const updatedOrder = await updatePaymentStatusService(id);

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng hoặc cập nhật trạng thái không thành công",
      });
    }

    return res.status(200).json({
      message: "Trạng thái thanh toán đã được cập nhật thành Paid",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};


module.exports = {
  createOrder,
  getOrder,
  deleteOrder,
  getOrderById,
  getOrderByEmail,
  updateOrderDriverStatus,
  getDriverOrderByEmail,
  updateOrderShippedStatus,
  updateOrderCancelledStatus,
  searchOrder,
  updateOrderPostOfficeStatus,
  getPostOfficeOrderByEmail,
  updateOrderIsShippingStatus,
  updateOrderPrepareStatus,
  updatePaymentStatus
};
