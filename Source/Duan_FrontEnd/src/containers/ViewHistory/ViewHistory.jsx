import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";
import styles from "./ViewHistory.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ViewHistory = () => {
  const [orders, setOrders] = useState([]); // All orders fetched from API
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders to display based on filter
  const [filter, setFilter] = useState("all"); // Filter state: "all", "shipped", "canceled"
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderByEmailApi();
        console.log("Order by email:", res);

        if (res && res.length > 0) {
          setOrders(res); // Store all orders
          setFilteredOrders(
            res.filter(
              (order) =>
                order.status === "shipped" || order.status === "canceled"
            )
          ); // Initially show only shipped and canceled orders
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchUser();
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);

    if (status === "all") {
      setFilteredOrders(
        orders.filter(
          (order) => order.status === "shipped" || order.status === "canceled"
        )
      );
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <div className={styles.Container}>
      <h2>Order History</h2>

      {/* Filter Buttons */}
      <div className={styles.FilterButton}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{ marginRight: "10px" }}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("shipped")}
          style={{ marginRight: "10px" }}
        >
          Shipped
        </button>
        <button onClick={() => handleFilterChange("canceled")}>Canceled</button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p>No orders match the selected filter!</p>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderContainer}>
              <div className={styles.orderstatus}>
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
              </div>

              <div className={styles.orderaddress}>
                <p>
                  <strong>From:</strong> {order.fromAddress},{" "}
                  {order.fromDistrict}, {order.fromWard}, {order.fromCity}
                </p>
                <p>
                  <strong>To:</strong> {order.toAddress}, {order.toDistrict},{" "}
                  {order.toWard}, {order.toCity}
                </p>
              </div>
              {/* Timeline Display */}
              {order.timeline && order.timeline.length > 0 && (
                <div className={styles.timeline}>
                  <ul>
                    {order.timeline.map((entry, index) => (
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
              <button
                onClick={() => {
                  setExpandedOrder(order);
                  setShowPopup(true);
                }}
              >
                Show Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {showPopup && expandedOrder && (
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
            <div className={styles.orderDetails}>
              <p>
                <strong>Order ID:</strong> {expandedOrder._id}
              </p>
              <p>
                <strong>Sender Name:</strong> {expandedOrder.senderName}
              </p>
              <p>
                <strong>Sender Number:</strong> {expandedOrder.senderNumber}
              </p>
              <p>
                <strong>Recipient Name:</strong> {expandedOrder.recipientName}
              </p>
              <p>
                <strong>Recipient Number:</strong>{" "}
                {expandedOrder.recipientNumber}
              </p>
              <p>
                <strong>Order Weight:</strong> {expandedOrder.orderWeight}
              </p>
              <p>
                <strong>Order Size:</strong> {expandedOrder.orderSize}
              </p>
              <p>
                <strong>Type:</strong> {expandedOrder.type}
              </p>
              <p>
                <strong>Message:</strong> {expandedOrder.message}
              </p>
              <p>
                <strong>Price:</strong> {expandedOrder.price}
              </p>
              <p>
                <strong>Created By:</strong> {expandedOrder.createdBy}
              </p>
              <p>
                <strong>Driver:</strong> {expandedOrder.driver}
              </p>
              <p>
                <strong>Distance:</strong> {expandedOrder.distance} km
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewHistory;
