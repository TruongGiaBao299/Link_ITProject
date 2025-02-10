import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./DriverSentOrder.module.css";
import {
  AcceptOrderApi,
  getDriverByEmailApi,
  IsShippingOrderApi,
} from "../../utils/driverAPI/driverAPI";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const HERE_API_KEY = "MnTadIKOVDRqhQYalpBxtEG3AiWROupfqiPOBzfiWsw"; // Replace with your actual API key from HERE API

const DriverSentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverCity, setDriverCity] = useState(""); // Driver city
  const [driverLocation, setDriverLocation] = useState(null); // Driver location
  const [distanceCache, setDistanceCache] = useState({}); // Cache for distances
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const [expandedOrder, setExpandedOrder] = useState(null); // Store the selected order for details
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const AcceptOrder = async (orderId) => {
    try {
      const res = await AcceptOrderApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: "delivery to post office" }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const AcceptOrderIsShipping = async (orderId) => {
    try {
      const res = await IsShippingOrderApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: "is shipping" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  // Get driver's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDriverLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching location:", error);
        toast.error("Unable to fetch your location");
      }
    );
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrderApi();
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };
    fetchOrders();
  }, []);

  // Fetch driver info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getDriverByEmailApi();
        if (res) {
          setDrivers(res);
          setDriverCity(res.DriverCity); // Assuming the driver's city is available in the response
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching driver");
      }
    };
    fetchUser();
  }, []);

  // Calculate distance between driver's location and order's toAddress
  useEffect(() => {
    const calculateDistances = async () => {
      if (!driverLocation || orders.length === 0) return;

      setIsCalculatingDistance(true); // Bắt đầu tính khoảng cách

      const updatedCache = { ...distanceCache };
      for (const order of orders) {
        if (!updatedCache[order._id]) {
          try {
            const distance = await calculateDistance(order.fromAddress);
            updatedCache[order._id] = distance;

            // Thêm delay để tránh bị rate limit API
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error("Error calculating distance:", error);
          }
        }
      }

      setDistanceCache(updatedCache);
      setIsCalculatingDistance(false); // Hoàn tất tính toán
    };

    calculateDistances();
  }, [driverLocation, orders]);

  // Function to calculate distance using HERE API
  const calculateDistance = async (toAddress) => {
    try {
      const geocodeRes = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode`,
        {
          params: {
            q: toAddress,
            apiKey: HERE_API_KEY,
          },
        }
      );

      if (geocodeRes.data.items.length > 0) {
        const { lat: toLat, lng: toLng } = geocodeRes.data.items[0].position;

        if (driverLocation) {
          const fromLat = driverLocation.lat;
          const fromLng = driverLocation.lng;

          const R = 6371; // Earth's radius in kilometers
          const dLat = ((toLat - fromLat) * Math.PI) / 180;
          const dLng = ((toLng - fromLng) * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((fromLat * Math.PI) / 180) *
              Math.cos((toLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return distance.toFixed(2); // Return the distance in kilometers
        } else {
          throw new Error("Driver location not available.");
        }
      } else {
        throw new Error("Unable to fetch coordinates for the address.");
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      return "N/A";
    }
  };

  return (
    <div className={styles.driverordercontainer}>
      {isCalculatingDistance && <LoadingSpinner isLoading={true} />}
      {orders.filter(
        (order) =>
          order.status === "prepare to delivery" && order.toCity === driverCity
      ).length === 0 ? (
        <p>You don't have any pending orders!</p>
      ) : (
        <div>
          <div className={styles.driverordertable}>
            <div className={styles.OrderInfocontainer}>
              {orders
                .filter(
                  (order) =>
                    order.status === "prepare to delivery" &&
                    order.toCity === driverCity
                )
                .map((order) => (
                  <div className={styles.OrderInfo} key={order._id}>
                    <div className={styles.StatusInfo}>
                      <p>
                        <strong>Order ID:</strong> {order._id}
                      </p>

                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                    </div>
                    <div className={styles.AddressInfo}>
                      <p>
                        <strong>Sender Address:</strong> {order.fromAddress},{" "}
                        {order.fromDistrict}, {order.fromWard}, {order.fromCity}
                      </p>
                      <p>
                        <strong>Recipient Address:</strong> {order.toAddress},{" "}
                        {order.toDistrict}, {order.toWard}, {order.toCity}
                      </p>
                    </div>

                    <div className={styles.NoteInfo}>
                      <p>
                        <strong>Distance:</strong>{" "}
                        {distanceCache[order._id] || "Calculating..."} km
                      </p>

                      <p>
                        <strong>Message:</strong> {order.message}
                      </p>
                      <p>
                        <strong>Price:</strong> {order.price}
                      </p>
                    </div>

                    <div className={styles.ButtonInfo}>
                      <button
                        className={styles.acceptButton}
                        onClick={() =>
                          order.status === "pending"
                            ? AcceptOrder(order._id)
                            : AcceptOrderIsShipping(order._id)
                        }
                      >
                        Accept Request
                      </button>
                      <button
                        className={styles.detailsButton}
                        onClick={() => {
                          setExpandedOrder(order);
                          setShowPopup(true);
                        }}
                      >
                        Show Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

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
                    <strong>Sender Name:</strong> {expandedOrder.senderName}
                  </p>
                  <p>
                    <strong>Sender Number:</strong> {expandedOrder.senderNumber}
                  </p>
                  <p>
                    <strong>From Address:</strong> {expandedOrder.fromAddress},{" "}
                    {expandedOrder.fromDistrict}, {expandedOrder.fromWard},{" "}
                    {expandedOrder.fromCity}
                  </p>
                  <p>
                    <strong>Recipient Name:</strong>{" "}
                    {expandedOrder.recipientName}
                  </p>
                  <p>
                    <strong>Recipient Number:</strong>{" "}
                    {expandedOrder.recipientNumber}
                  </p>
                  <p>
                    <strong>To Address:</strong> {expandedOrder.toAddress},{" "}
                    {expandedOrder.toDistrict}, {expandedOrder.toWard},{" "}
                    {expandedOrder.toCity}
                  </p>
                  <p>
                    <strong>Order Weight:</strong> {expandedOrder.orderWeight}
                  </p>
                  <p>
                    <strong>Order Size:</strong> {expandedOrder.orderSize}
                  </p>
                  <p>
                    <strong>Price:</strong> {expandedOrder.price}
                  </p>
                  <p>
                    <strong>Status:</strong> {expandedOrder.status}
                  </p>
                  <p>
                    <strong>Created By:</strong> {expandedOrder.createdBy}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverSentOrder;
