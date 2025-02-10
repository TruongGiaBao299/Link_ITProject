import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./DriverGetOrder.module.css";
import {
  AcceptOrderApi,
  getDriverByEmailApi,
  IsShippingOrderApi,
} from "../../utils/driverAPI/driverAPI";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const HERE_API_KEY = "MnTadIKOVDRqhQYalpBxtEG3AiWROupfqiPOBzfiWsw"; // Replace with your actual API key from HERE API

const DriverGetOrder = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverCity, setDriverCity] = useState("");
  const [driverLocation, setDriverLocation] = useState(null);
  const [distanceCache, setDistanceCache] = useState({}); // Cache for distances
  const [showPopup, setShowPopup] = useState(false); // To control popup visibility
  const [expandedOrder, setExpandedOrder] = useState(null); // To store the selected order
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  useEffect(() => {
    // Get the driver's current location
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

  useEffect(() => {
    // Fetch all orders
    const fetchOrders = async () => {
      try {
        const res = await getOrderApi();
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Fetch driver information
    const fetchDriver = async () => {
      try {
        const res = await getDriverByEmailApi();
        if (res) {
          setDrivers(res);
          setDriverCity(res.DriverCity);
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error fetching driver:", error);
        toast.error("Error fetching driver");
      }
    };

    fetchDriver();
  }, []);

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

  const calculateDistance = async (fromAddress) => {
    setIsLoading(true);
    try {
      const geocodeRes = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode`,
        {
          params: {
            q: fromAddress,
            apiKey: HERE_API_KEY,
          },
        }
      );

      if (geocodeRes.data.items.length > 0) {
        const { lat: fromLat, lng: fromLng } =
          geocodeRes.data.items[0].position;

        if (driverLocation) {
          const toLat = driverLocation.lat;
          const toLng = driverLocation.lng;

          const R = 6371; // Radius of the Earth in kilometers
          const dLat = ((fromLat - toLat) * Math.PI) / 180;
          const dLng = ((fromLng - toLng) * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((toLat * Math.PI) / 180) *
              Math.cos((fromLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return distance.toFixed(2); // Return distance in kilometers
        } else {
          throw new Error("Driver location not available.");
        }
      } else {
        throw new Error("Unable to fetch coordinates for the address.");
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      return "N/A";
    } finally {
      setIsLoading(false); // Mark loading as complete
    }
  };

  const AcceptOrder = async (orderId) => {
    try {
      await AcceptOrderApi(orderId);
      toast.success("Order status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: "delivery to post office" }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  const AcceptOrderIsShipping = async (orderId) => {
    try {
      await IsShippingOrderApi(orderId);
      toast.success("Order status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "is shipping" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  const sortedOrders = orders
    .filter(
      (order) => order.status === "pending" && order.fromCity === driverCity
    )
    .sort((a, b) => {
      const distanceA = parseFloat(distanceCache[a._id]) || Infinity;
      const distanceB = parseFloat(distanceCache[b._id]) || Infinity;
      return distanceA - distanceB; // Sort by distance ascending
    });

  return (
    <div className={styles.Container}>
      {isCalculatingDistance && <LoadingSpinner isLoading={true} />}

      {sortedOrders.length === 0 ? (
        <p>You don't have any pending orders!</p>
      ) : (
        <div>
          <div className={styles.OrderInfocontainer}>
            {sortedOrders.map((order) => (
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
                    <strong>Sender Address:</strong> {expandedOrder.fromAddress}
                    , {expandedOrder.fromDistrict}, {expandedOrder.fromWard},{" "}
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
                    <strong>Recipient Address:</strong>{" "}
                    {expandedOrder.toAddress}, {expandedOrder.toDistrict},{" "}
                    {expandedOrder.toWard}, {expandedOrder.toCity}
                  </p>
                  <p>
                    <strong>Weight:</strong> {expandedOrder.orderWeight}
                  </p>
                  <p>
                    <strong>Size:</strong> {expandedOrder.orderSize}
                  </p>
                  <p>
                    <strong>Price:</strong> {expandedOrder.price}
                  </p>
                  <p>
                    <strong>Status:</strong> {expandedOrder.status}
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

export default DriverGetOrder;
