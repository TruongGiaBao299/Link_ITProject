require("dotenv").config();
const axios = require("axios");
const Order = require("../models/order");

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

// Hàm tính khoảng cách giữa hai tọa độ
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Khoảng cách (km)
};

// Hàm tính khoảng cách giữa hai địa chỉ
const calculateDistanceBetweenAddresses = async (address1, address2) => {
  try {
    const coords1 = await geocodeAddressWithHERE(address1);
    const coords2 = await geocodeAddressWithHERE(address2);

    const distance = calculateDistance(
      coords1.lat,
      coords1.lng,
      coords2.lat,
      coords2.lng
    );

    return distance.toFixed(2); // Làm tròn 2 chữ số thập phân
  } catch (error) {
    console.error("Error calculating distance:", error.message);
    throw error;
  }
};

// Hàm tạo đơn hàng
const createOrderService = async (
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
  email
) => {
  try {
    const fromFullAddress = `${fromAddress}, ${fromWard}, ${fromDistrict}, ${fromCity}`;
    const toFullAddress = `${toAddress}, ${toWard}, ${toDistrict}, ${toCity}`;

    // Tính khoảng cách giữa 2 địa chỉ (nếu cần)
    const distance = await calculateDistanceBetweenAddresses(
      fromFullAddress,
      toFullAddress
    );

    console.log(`Địa chỉ gửi: ${fromFullAddress}`);
    console.log(`Địa chỉ nhận: ${toFullAddress}`);
    console.log(`Khoảng cách: ${distance} km`);

    let price = 0;

    // Kiểm tra nếu cùng thành phố hoặc khác thành phố
    if (fromCity === toCity) {
      // Cùng thành phố
      if (orderWeight <= 0.25) {
        price = 11000;
      } else if (orderWeight <= 0.5) {
        price = 15000;
      } else if (orderWeight <= 1) {
        price = 22500;
      } else if (orderWeight <= 1.5) {
        price = 28000;
      } else if (orderWeight <= 2) {
        price = 36000;
      } else {
        const extraWeight = orderWeight - 2;
        price = 36000 + Math.ceil(extraWeight / 0.5) * 2100;
      }
    } else {
      // Khác thành phố
      if (orderWeight <= 0.25) {
        price = 15000;
      } else if (orderWeight <= 0.5) {
        price = 19000;
      } else if (orderWeight <= 1) {
        price = 24500;
      } else if (orderWeight <= 1.5) {
        price = 32000;
      } else if (orderWeight <= 2) {
        price = 40000;
      } else {
        const extraWeight = orderWeight - 2;
        price = 40000 + Math.ceil(extraWeight / 0.5) * 3500;
      }
    }

    if (orderSize > 1) {
      const additionalSizeFee = Math.floor(orderSize - 1) * 10000;
      price += additionalSizeFee;
    }

    console.log(`Giá cước: ${price} VND`);

    const currentDate = new Date();
    let minDays = 2;
    let maxDays = 4;

    if (fromCity === toCity) {
      minDays = 1;
      maxDays = 2;
    } else {
      minDays = 3;
      maxDays = 5;
    }

    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() + minDays);

    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + maxDays);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    let estimatedDeliveryTime = "";
    if (minDays === maxDays) {
      estimatedDeliveryTime = formatDate(startDate);
    } else {
      estimatedDeliveryTime = `${formatDate(startDate)} - ${formatDate(
        endDate
      )}`;
    }

    console.log(`Thời gian giao hàng dự kiến: ${estimatedDeliveryTime}`);

    const createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)

    // Tạo đơn hàng và thêm sự kiện vào timeline
    const result = await Order.create({
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
      price,
      distance,
      status: "pending",
      createdBy: email,
      driver: "Find Driver",
      createdAt,
      estimatedDeliveryTime,
      timeline: [
        {
          status: "Order Created",
          timestamp: createdAt,
        },
      ],
    });

    return {
      ...result.toObject(),
      distance,
      estimatedDeliveryTime,
      createdAt,
    };
  } catch (error) {
    console.error("Error creating order:", error.message);
    return null;
  }
};

// Lấy dữ liệu đơn hàng
const getOrderService = async () => {
  try {
    let result = await Order.find({});
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// lấy dữ liệu đơn hàng được tạo bởi email người dùng
const getOrderByEmailService = async (email) => {
  try {
    // Fetch order by id and createdBy (email) field
    const order = await Order.find({
      createdBy: email, // Match by the email of the creator
    });

    return order; // Return the order if found
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Xóa đơn hàng
const deleteOrderService = async (id) => {
  try {
    // Find and delete the user by ID
    const result = await Order.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: "không tìm thấy đơn hàng" };
    }
    return { success: true, message: "xóa đơn hàng thành công" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "lỗi trong quá trình xóa đơn hàng" };
  }
};

// Lấy dữ liệu đơn hàng theo ID
const getOrderByIdService = async (id) => {
  try {
    // Find the order by its ID
    const order = await Order.findById(id);

    // Check if the order exists
    if (!order) {
      return null; // Return null if no order is found
    }

    return order; // Return the found order
  } catch (error) {
    console.error("lỗi trong quá trình lấy đơn hàng theo id:", error.message);
    return null; // Return null in case of any errors
  }
};

// update trạng thái đơn hàng đang giao
const updateOrderDriverStatusService = async (OrderId, emailDriver) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(OrderId);
    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Cập nhật trạng thái đơn hàng và tài xế
    order.status = "delivery to post office";
    order.driver = emailDriver;

    // Thêm sự kiện vào timeline
    order.timeline.push({
      status: "Driver Assigned",
      timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    });

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// lấy dư liệu đơn hàng tài xế đã nhận
const getDriverOrderByEmailService = async (emailDriver) => {
  try {
    // Fetch order by id and createdBy (email) field
    const order = await Order.find({
      driver: emailDriver, // Match by the email of the creator
    });

    return order; // Return the order if found
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update trạng thái đơn hàng chuẩn bị giao
const updateOrderPrepareStatusService = async (OrderId) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(OrderId);
    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Cập nhật trạng thái đơn hàng
    order.status = "prepare to delivery";

    // Thêm sự kiện vào timeline
    order.timeline.push({
      status: "Preparing for Delivery",
      timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    });

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update trạng thái đơn hàng đang đang giao
const updateOrderIsShippingStatusService = async (OrderId, emailDriver) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(OrderId);
    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Cập nhật trạng thái đơn hàng và tài xế
    order.status = "is shipping";
    order.driver = emailDriver;

    // Thêm sự kiện vào timeline
    order.timeline.push({
      status: "Order is being delivered, please keep your phone available.",
      timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    });

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// update trạng thái đơn hàng đang đã giao
const updateOrderShippedStatusService = async (OrderId) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(OrderId);
    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Cập nhật trạng thái đơn hàng
    order.status = "shipped";

    // Thêm sự kiện vào timeline
    order.timeline.push({
      status: "Order has been successfully delivered.",
      timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    });

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// update trạng thái đơn hàng đã hủy
const updateOrderCancelledStatusService = async (OrderId) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(OrderId);
    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Cập nhật trạng thái đơn hàng
    order.status = "canceled";

    // Thêm sự kiện vào timeline
    order.timeline.push({
      status: "Order has been canceled.",
      timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    });

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// update trạng thái đã gửi bưu cục
const updateOrderPostOfficeStatusService = async (OrderId, emailPostOffice) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(OrderId);
    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Cập nhật thông tin bưu cục
    order.postOffice = emailPostOffice;

    // Thêm sự kiện vào timeline
    order.timeline.push({
      status: "Sent to Post Office",
      timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    });

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// lấy dư liệu đơn hàng tài xế đã nhận
const getPostOfficeOrderByEmailService = async (emailPostOffice) => {
  try {
    // Fetch order by id and createdBy (email) field
    const order = await Order.find({
      postOffice: emailPostOffice, // Match by the email of the creator
    });

    return order; // Return the order if found
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Hàm tra cứu gói cước
const searchOrderService = async (
  fromAddress,
  fromDistrict,
  fromWard,
  fromCity,
  toAddress,
  toDistrict,
  toWard,
  toCity,
  orderWeight,
  orderSize
) => {
  try {
    const fromFullAddress = `${fromAddress}, ${fromWard}, ${fromDistrict}, ${fromCity}`;
    const toFullAddress = `${toAddress}, ${toWard}, ${toDistrict}, ${toCity}`;

    // Tính khoảng cách giữa 2 địa chỉ (nếu cần)
    const distance = await calculateDistanceBetweenAddresses(
      fromFullAddress,
      toFullAddress
    );

    console.log(`Địa chỉ gửi: ${fromFullAddress}`);
    console.log(`Địa chỉ nhận: ${toFullAddress}`);
    console.log(`Khoảng cách: ${distance} km`);

    let price = 0;

    // Kiểm tra nếu cùng thành phố hoặc khác thành phố
    if (fromCity === toCity) {
      // Cùng thành phố
      if (orderWeight <= 0.25) {
        price = 11000; // Mức giá cho <= 250g
      } else if (orderWeight <= 0.5) {
        price = 15000; // Mức giá cho > 250g - 500g
      } else if (orderWeight <= 1) {
        price = 22500; // Mức giá cho > 500g - 1kg
      } else if (orderWeight <= 1.5) {
        price = 28000; // Mức giá cho > 1kg - 1.5kg
      } else if (orderWeight <= 2) {
        price = 36000; // Mức giá cho > 1.5kg - 2kg
      } else {
        // Thêm phí cho mỗi 0.5kg vượt quá 2kg
        const extraWeight = orderWeight - 2;
        price = 36000 + Math.ceil(extraWeight / 0.5) * 2100; // 2100 cho mỗi 0.5kg
      }
    } else {
      // Khác thành phố
      if (orderWeight <= 0.25) {
        price = 15000; // Mức giá cho <= 250g
      } else if (orderWeight <= 0.5) {
        price = 19000; // Mức giá cho > 250g - 500g
      } else if (orderWeight <= 1) {
        price = 24500; // Mức giá cho > 500g - 1kg
      } else if (orderWeight <= 1.5) {
        price = 32000; // Mức giá cho > 1kg - 1.5kg
      } else if (orderWeight <= 2) {
        price = 40000; // Mức giá cho > 1.5kg - 2kg
      } else {
        // Thêm phí cho mỗi 0.5kg vượt quá 2kg
        const extraWeight = orderWeight - 2;
        price = 40000 + Math.ceil(extraWeight / 0.5) * 3500; // 3500 cho mỗi 0.5kg
      }
    }

    // Cộng thêm phí theo kích thước
    if (orderSize > 1) {
      const additionalSizeFee = Math.floor(orderSize - 1) * 10000;
      price += additionalSizeFee;
    }

    console.log(`Giá cước: ${price} VND`);

    // Tính thời gian giao hàng dự kiến
    const currentDate = new Date();
    let minDays = 2;
    let maxDays = 4;

    if (fromCity === toCity) {
      // Cùng thành phố: 1-2 ngày
      minDays = 1;
      maxDays = 2;
    } else {
      // Khác thành phố: 3-5 ngày
      minDays = 3;
      maxDays = 5;
    }

    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() + minDays);

    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + maxDays);

    // Format ngày theo dd/mm/yyyy
    const formatDate = (date) => {
      const day = String(date.getDate());
      const month = String(date.getMonth() + 1);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const estimatedDeliveryTime =
      minDays === maxDays
        ? formatDate(startDate)
        : `${formatDate(startDate)} - ${formatDate(endDate)}`;

    console.log(`Thời gian giao hàng dự kiến: ${estimatedDeliveryTime}`);

    return {
      distance,
      price,
      estimatedDeliveryTime,
    };
  } catch (error) {
    console.error("Error calculating order details:", error.message);
    return { error: "An error occurred while calculating the details." };
  }
};

module.exports = {
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
};
