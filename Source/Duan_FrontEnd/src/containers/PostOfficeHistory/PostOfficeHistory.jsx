import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./PostOfficeHistory.module.css";
import {
  getPostOfficeByEmailApi,
  getPostOfficeOrderByEmailApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PostOfficeHistory = () => {
  const [orders, setOrders] = useState([]);
  const [postCity, setPostCity] = useState("");
  const [postEmail, setPostEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getPostOfficeOrderByEmailApi();
        setOrders(res && res.length > 0 ? res : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders.");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchPostOffice = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        if (res) {
          setPostCity(res.city);
          setPostEmail(res.email);
        }
      } catch (error) {
        console.error("Error fetching post office:", error);
        toast.error("Error fetching post office data.");
      }
    };
    fetchPostOffice();
  }, []);

  const totalOrders = orders.length;
  const totalShippedOrders = orders.filter(
    (order) => order.status === "shipped" && order.postOffice === postEmail
  ).length;

  const totalCommission = orders
    .filter(
      (order) => order.status === "shipped" && order.postOffice === postEmail
    )
    .reduce((sum, order) => sum + order.price * 0.2, 0);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <div className={styles.driverordercontainer}>
      {/* <div className={styles.stats}>
        <h3>Total Orders: {totalShippedOrders}</h3>
      </div> */}

      {totalShippedOrders === 0 ? (
        <p>You don't have any shipped orders!</p>
      ) : (
        <div>
          {orders
            .filter(
              (order) =>
                order.status === "shipped" && order.postOffice === postEmail
            )
            .map((order) => (
              <>
                <div className={styles.overcontent}>
                  <div className={styles.topContent} key={order._id}>
                    <div className={styles.OrderContent}>
                      <div className={styles.addressInfo}>
                        <div className={styles.statusGroup}>
                          <p>
                            <strong>Order ID:</strong> {order._id}
                          </p>
                          <p>
                            <strong>Status:</strong> {order.status}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`${styles.contentgroup} ${
                          selectedOrder?._id === order._id
                            ? styles.selected
                            : ""
                        }`}
                      >
                        <div className={styles.addressGroup}>
                          <p>
                            <strong>From Address: </strong>
                            {`${order.fromAddress}, ${order.fromDistrict},  ${order.fromWard}, ${order.fromCity}`}
                          </p>

                          {order.senderNumber}

                          <p>
                            <strong>To Address:</strong>{" "}
                            {`${order.toAddress}, ${order.toDistrict},  ${order.toWard}, ${order.toCity}`}
                          </p>

                          {order.recipientNumber}
                        </div>

                        <div className={styles.SentContent}>
                          {/* Show Details Button */}
                          <button onClick={() => handleShowDetails(order)}>
                            Show Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.mapcontent}>
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

                    {selectedOrder && (
                      <div className={styles.orderDetails}>
                        <p>
                          <strong>Recipient Name:</strong>{" "}
                          {selectedOrder.recipientName}
                        </p>
                        <p>
                          <strong>Recipient Number:</strong>{" "}
                          {selectedOrder.recipientNumber}
                        </p>
                        <p>
                          <strong>To Address:</strong> {selectedOrder.toAddress}
                          , {selectedOrder.toDistrict}, {selectedOrder.toCity}
                        </p>
                        <p>
                          <strong>Price:</strong> {selectedOrder.price}
                        </p>

                        <p>
                          <strong>Delivery Time:</strong>{" "}
                          {selectedOrder.estimatedDeliveryTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ))}
        </div>
      )}
    </div>
  );
};

export default PostOfficeHistory;
