import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./PostOfficeGetOrder.module.css";
import {
  AcceptOrderApi,
  AcceptOrderPrepareApi,
  IsShippingOrderApi,
  SentPostOfficeApi,
} from "../../utils/driverAPI/driverAPI";
import {
  getPostOfficeByEmailApi,
  getPostOfficeOrderByEmailApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";
import { getPostOfficeApi } from "../../utils/postOfficeAPI/postOfficeAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { MdOutlineDoubleArrow } from "react-icons/md";

const PostOfficeGetOrder = () => {
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [emails, setEmails] = useState({}); // Store email for each order
  const [post, setPost] = useState({}); // Store post office information
  const [postCity, setPostCity] = useState("");
  const [showPopup, setShowPopup] = useState(false); // To control popup visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the selected order for details
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getPostOfficeOrderByEmailApi();
        console.log("Order by email:", res);
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        console.log("Post Office by email:", res);
        console.log("Post Office by email City:", res.OfficeCity);

        if (res) {
          setPost(res);
          setPostCity(res.OfficeCity);
        } else {
          setPost([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi();
        if (res) {
          setData(res); // Store post office email data
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch post office data. Please try again!");
      }
    };
    fetchPostOffices();
  }, []);

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    const email = emails[orderId];

    if (!email) {
      toast.error("Please choose a valid email.");
      return;
    }

    try {
      await SentPostOfficeApi(orderId, email);
      toast.success("Post office email updated successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, postOffice: email } : order
      );
      setOrders(updatedOrders);

      setEmails((prev) => ({
        ...prev,
        [orderId]: "", // Reset email after update
      }));
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const AcceptOrderPrepare = async (orderId) => {
    try {
      const res = await AcceptOrderPrepareApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      // Update the order's status in the UI
      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: "Prepare to delivery" }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  // Show order details in the popup
  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <div className={styles.driverordercontainer}>
      {orders.filter(
        (order) =>
          order.status === "delivery to post office" &&
          order.toCity === postCity
      ).length === 0 ? (
        <p>You don't have any pending orders!</p>
      ) : (
        <div>
          <div className={styles.driverordertable}>
            <div>
              {orders
                .filter(
                  (order) =>
                    order.status === "delivery to post office" &&
                    order.toCity === postCity
                )
                .map((order) => (
                  <div className={styles.OrderInfo} key={order._id}>
                    <div className={styles.addressInfo}>
                      <p>
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <div className={styles.addressGroup}>
                        <p>
                          <strong>From Address: </strong>
                          {`${order.fromAddress}, ${order.fromDistrict},  ${order.fromWard}, ${order.fromCity}`}
                        </p>

                        <MdOutlineDoubleArrow />

                        <p>
                          <strong>To Address:</strong>{" "}
                          {`${order.toAddress}, ${order.toDistrict},  ${order.toWard}, ${order.toCity}`}
                        </p>
                      </div>
                    </div>

                    <div className={styles.noteInfo}>
                      <p>
                        <strong>Order Weight:</strong> {order.orderWeight}
                      </p>
                      <p>
                        <strong>Order Size:</strong> {order.orderSize}
                      </p>
                      <p>
                        <strong>Type:</strong> {order.type}
                      </p>
                    </div>

                    <div className={styles.SentContent}>
                      <button
                        className=""
                        onClick={() => AcceptOrderPrepare(order._id)}
                      >
                        Accept Request
                      </button>
                      {/* Show Details Button */}
                      <button onClick={() => handleShowDetails(order)}>
                        Show Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Popup for Order Details */}
      {showPopup && selectedOrder && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowPopup(false)}
        >
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              x
            </button>
            <h3>Order Details</h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Sender Name:</strong> {selectedOrder.senderName}
            </p>
            <p>
              <strong>Sender Number:</strong> {selectedOrder.senderNumber}
            </p>
            <p>
              <strong>From Address:</strong>
              {`${selectedOrder.fromAddress}, ${selectedOrder.fromDistrict},  ${selectedOrder.fromWard}, ${selectedOrder.fromCity}`}
            </p>
            <p>
              <strong>Recipient Name:</strong> {selectedOrder.recipientName}
            </p>
            <p>
              <strong>Recipient Number:</strong> {selectedOrder.recipientNumber}
            </p>
            <p>
              <strong>To Address:</strong>{" "}
              {`${selectedOrder.toAddress}, ${selectedOrder.toDistrict},  ${selectedOrder.toWard}, ${selectedOrder.toCity}`}
            </p>
            <p>
              <strong>Order Weight:</strong> {selectedOrder.orderWeight}
            </p>
            <p>
              <strong>Order Size:</strong> {selectedOrder.orderSize}
            </p>
            <p>
              <strong>Type:</strong> {selectedOrder.type}
            </p>
            <p>
              <strong>Message:</strong> {selectedOrder.message}
            </p>
            <p>
              <strong>Price:</strong> {selectedOrder.price}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Created By:</strong> {selectedOrder.createdBy}
            </p>
            <p>
              <strong>Driver:</strong> {selectedOrder.driver}
            </p>
            <p>
              <strong>PostOffice:</strong> {selectedOrder.postOffice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostOfficeGetOrder;
