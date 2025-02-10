const { createUserService, loginService, getUserService, deleteUserService, updateUserStatusService, DeActiveUserStatusService, UnActiveUserStatusService, updateUserStatusToPostOfficeService, updatePasswordService } = require("../services/userService");


// Tạo tài khoản
const createUser = async (req, res) => {
  // tạo request body
  const { name, email, password } = req.body;
  // tạo user
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

// API đăng nhập
const handleLogin = async (req, res) => {
  // tạo request body
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

// Lấy dữ liệu người dùng
const getUser = async (req, res) => {
  // tạo request body
  const data = await getUserService();
  return res.status(200).json(data);
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Call the service function
  const result = await deleteUserService(id);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Lấy dữ liệu tài khoản
const getAccount = async (req, res) => {
  // tạo request body
  return res.status(200).json(req.user);
};

// update trạng thái người dùng thành tài xế
const becomeDriver = async (req, res) => {
  try {
    const { email } = req.params; // Assuming `email` is passed in the URL

    // Call the service to update the user's role
    const updatedUser = await updateUserStatusService(email);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found or update failed." });
    }

    return res.status(200).json({
      message: "chúc mừng bạn đã trở thành tài xế!",
      user: updatedUser, // Return the updated user object
    });
  } catch (error) {
    console.error("cập nhật trạng thái tài xế lỗi:", error);
    return res.status(500).json({
      message: "lỗi rồi !",
      error: error.message,
    });
  }
};

// update trạng thái người dùng thành khách
const becomeGuest = async (req, res) => {
  try {
    const { email } = req.params; // Assuming `email` is passed in the URL

    // Call the service to update the user's role to guest
    const updatedUser = await UnActiveUserStatusService(email);

    if (!updatedUser) {
      return res.status(404).json({ message: "user không tìm thấy hoặc cập nhật thất bại" });
    }

    return res.status(200).json({
      message: "chúc mừng bạn đã trở lại thành user!",
      user: updatedUser, // Return the updated user object
    });
  } catch (error) {
    console.error("cập nhật trạng thái user lỗi:", error);
    return res.status(500).json({
      message: "lỗi rồi !",
      error: error.message,
    });
  }
};

// update trạng thái người dùng thành bưu cục
const becomePostOffice = async (req, res) => {
  try {
    const { email } = req.params; // Assuming `email` is passed in the URL

    // Call the service to update the user's role to guest
    const updatedUser = await updateUserStatusToPostOfficeService(email);

    if (!updatedUser) {
      return res.status(404).json({ message: "user không tìm thấy hoặc cập nhật thất bại" });
    }

    return res.status(200).json({
      message: "chúc mừng bạn đã trở lại thành postoffice!",
      user: updatedUser, // Return the updated user object
    });
  } catch (error) {
    console.error("cập nhật trạng thái user lỗi:", error);
    return res.status(500).json({
      message: "lỗi rồi !",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const email = req.user.email; // Lấy email từ token đã xác thực

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const result = await updatePasswordService(email, oldPassword, newPassword);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi cập nhật mật khẩu:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

module.exports = {
  createUser, handleLogin, getUser, deleteUser, getAccount, becomeDriver, becomeGuest, becomePostOffice, updatePassword
};
