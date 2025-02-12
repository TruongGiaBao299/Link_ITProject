import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  paidAPI,
  ShippedOrderApi,
} from "../../utils/driverAPI/driverAPI";
import styles from "./ViewOrder.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: "",
    cardNumber: "",
  });
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderByEmailApi();
        if (res && res.length > 0) {
          const filteredOrders = res.filter(
            (order) =>
              order.status === "pending" ||
              order.status === "is shipping" ||
              order.status === "delivery to post office" ||
              order.status === "prepare to delivery" ||
              order.status === "canceled"
          );
          setOrders(filteredOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (status === "shipped") {
        await ShippedOrderApi(orderId);
        toast.success("Order marked as shipped!");
      } else if (status === "canceled") {
        await CancelledOrderApi(orderId);
        toast.success("Order canceled successfully!");
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const handleOpenPaymentPopup = (order) => {
    setSelectedOrderForPayment(order);
    setIsPaymentPopupOpen(true);
  };

  const handleSubmitPayment = async (orderId) => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng để thanh toán.");
      return;
    }

    if (!paymentDetails.bankName || !paymentDetails.cardNumber) {
      toast.error("Vui lòng nhập đầy đủ thông tin thanh toán.");
      return;
    }

    try {
      await paidAPI(orderId);
      toast.success("Payment successful!");

      // Cập nhật trạng thái đơn hàng trong danh sách
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, payment: "paid" } : order
        )
      );

      setIsPaymentPopupOpen(false);
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Fail to pay, please try again");
    }
  };

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL("Thông tin thanh toán của bạn");
        setQrCodeImage(url);
      } catch (error) {
        console.error("Lỗi tạo QR Code:", error);
      }
    };

    generateQR();
  }, []);

  if (isLoading) {
    return <LoadingSpinner isLoading={isLoading} />;
  }

  return (
    <div className={styles.Container}>
      {orders.length === 0 ? (
        <p>You don't have any orders!</p>
      ) : (
        <div className={styles.containeroverview}>
          <div className={styles.newcontaineroverview}>
            <button
              className={styles.addnew}
              onClick={() => navigate("/guestcreateorder")}
            >
              Add New +
            </button>
            <div className={styles.heightcontainer}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderContainer}>
                  <div className={styles.orderstatus}>
                    <p>
                      <strong>Order ID:</strong> {order._id}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>

                  {/* Đổi màu khi đơn hàng được chọn */}
                  <div
                    className={`${styles.orderaddress} ${
                      selectedOrder?._id === order._id
                        ? styles.selectedOrder
                        : ""
                    }`}
                  >
                    <div className={styles.fromstatus}>
                      <p>
                        <strong>From:</strong> {order.fromAddress},{" "}
                        {order.fromDistrict}, {order.fromCity}
                      </p>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    {order.senderNumber}

                    <div className={styles.tostatus}>
                      <p>
                        <strong>To:</strong> {order.toAddress},{" "}
                        {order.toDistrict}, {order.toCity}
                      </p>
                      <p>{order.estimatedDeliveryTime}</p>
                    </div>

                    <div>
                      <p>
                        {" "}
                        <strong>Payment:</strong> {order.payment}
                      </p>
                    </div>

                    <button onClick={() => setSelectedOrder(order)}>
                      Show Details
                    </button>

                    {order.status === "is shipping" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "shipped")}
                      >
                        Shipped
                      </button>
                    )}
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "canceled")}
                      >
                        Cancelled
                      </button>
                    )}
                    {order.payment === "none" && (
                      <button onClick={() => handleOpenPaymentPopup(order)}>
                        Pay Now
                      </button>
                    )}

                    {isPaymentPopupOpen && (
                      <div className={styles.paymentPopup}>
                        <div className={styles.popupContent}>
                          <div className={styles.popupform}>
                            <h3>Thanh toán đơn hàng</h3>
                            <p>
                              <strong>Giá tiền:</strong>{" "}
                              {selectedOrderForPayment?.price} VND
                            </p>{" "}
                            {/* Hiển thị giá tiền */}
                            <label>Bank Name:</label>
                            <select
                              value={paymentDetails.bankName}
                              onChange={(e) =>
                                setPaymentDetails({
                                  ...paymentDetails,
                                  bankName: e.target.value,
                                })
                              }
                            >
                              <option value="">Chọn ngân hàng</option>
                              <option value="MB">MB Bank</option>
                              <option value="BIDV">BIDV</option>
                              <option value="VCB">Vietcombank</option>
                              <option value="ACB">ACB</option>
                              <option value="TPBank">TPBank</option>
                            </select>
                            <label>Card Number:</label>
                            <input
                              type="text"
                              value={paymentDetails.cardNumber}
                              onChange={(e) =>
                                setPaymentDetails({
                                  ...paymentDetails,
                                  cardNumber: e.target.value,
                                })
                              }
                            />
                            <button
                              onClick={() =>
                                handleSubmitPayment(
                                  selectedOrderForPayment?._id
                                )
                              }
                            >
                              Submit Payment
                            </button>
                            <button
                              onClick={() => setIsPaymentPopupOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                          <div className={styles.popupQR}>
                            {qrCodeImage && (
                              <img src={qrCodeImage} alt="QR Code" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div className={styles.overview}>
            <h3>Overview</h3>
            <div className={styles.map}>
              <MapContainer
                center={[10.7336, 106.6989]}
                zoom={13}
                style={{ height: "300px", width: "600px" }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </MapContainer>
            </div>

            <div className={styles.orderoverview}>
              {selectedOrder ? (
                <div className={styles.overviewgroup}>
                  <div>
                    <p>
                      <strong>Recipient Name:</strong>{" "}
                      {selectedOrder.recipientName}
                    </p>
                    <p>
                      <strong>Recipient Number:</strong>{" "}
                      {selectedOrder.recipientNumber}
                    </p>
                    <p>
                      <strong>Price:</strong> {selectedOrder.price}
                    </p>
                    <p>
                      <strong>Driver:</strong> {selectedOrder.driver}
                    </p>
                    <p>
                      <strong>Delivery Time:</strong>{" "}
                      {selectedOrder.estimatedDeliveryTime}
                    </p>
                  </div>
                  <div>
                    <div className={styles.timelinecontent}>
                      {selectedOrder.timeline &&
                        selectedOrder.timeline.length > 0 && (
                          <div className={styles.timeline}>
                            <ul>
                              {selectedOrder.timeline.map((entry, index) => (
                                <li key={entry._id}>
                                  {new Date(
                                    new Date(entry.timestamp).getTime() +
                                      17 * 60 * 60 * 1000
                                  ).toLocaleString()}
                                  : <strong>{entry.status}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                <p>...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
