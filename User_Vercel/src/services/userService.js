require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const salt = 10;

// Tạo người dùng
const createUserService = async (name, email, password) => {
  try {
    // check email unique (user exist)
    const user = await User.findOne({email});
    if(user){
      return null;
    }

    // hash user password
    const hashPassword = await bcrypt.hash(password, salt);
    // save user to database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "guest",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Đăng nhập
const loginService = async (email, password) => {
  try {
    //fetch user by email
    const user = await User.findOne({ email: email });
    if (user) {
      //compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "mật khẩu không đúng",
        };
      } else {
        //create an access token
        const payload = {
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token: access_token,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "không tìm thấy email",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy dữ liệu người dùng
const getUserService = async () => {
  try {
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Xóa người dùng
const deleteUserService = async (id) => {
  try {
    // Find and delete the user by ID
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: "không tìm thấy user" };
    }
    return { success: true, message: "xóa user thành công" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "lỗi khi xóa user" };
  }
};

// update trạng thái người dùng thành tài xế
const updateUserStatusService = async (email) => {
  try {
    // Find and update the user by email
    const result = await User.findOneAndUpdate(
      { email }, // Query by email
      {
        role: "driver", // Update role to driver
      },
      { new: true } // Return the updated document
    );

    return result;
  } catch (error) {
    console.error("cập nhật trạng thái tài xế lỗi:", error);
    return null;
  }
};

// update trạng thái người dùng thành khách
const UnActiveUserStatusService = async (email) => {
  try {
    // Find and update the user by email
    const result = await User.findOneAndUpdate(
      { email }, // Query by email
      {
        role: "guest", // Update role to guest
      },
      { new: true } // Return the updated document
    );

    return result;
  } catch (error) {
    console.error("cập nhật trạng thái user lỗi:", error);
    return null;
  }
};

// update trạng thái người dùng thành khách
const updateUserStatusToPostOfficeService = async (email) => {
  try {
    // Find and update the user by email
    const result = await User.findOneAndUpdate(
      { email }, // Query by email
      {
        role: "postoffice", // Update role to guest
      },
      { new: true } // Return the updated document
    );

    return result;
  } catch (error) {
    console.error("cập nhật trạng thái user lỗi:", error);
    return null;
  }
};

const updatePasswordService = async (email, oldPassword, newPassword) => {
  try {
    // Tìm user theo email
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: "Không tìm thấy người dùng" };
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "Mật khẩu cũ không đúng" };
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Cập nhật mật khẩu thành công" };
  } catch (error) {
    console.error("Lỗi khi cập nhật mật khẩu:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
};


module.exports = {
  createUserService,
  loginService,
  getUserService,
  deleteUserService,
  updateUserStatusService,
  UnActiveUserStatusService,
  updateUserStatusToPostOfficeService,
  updatePasswordService
};
