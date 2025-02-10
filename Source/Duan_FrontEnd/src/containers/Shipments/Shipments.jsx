import React, { useEffect, useState } from "react";
import styles from "./Shipments.module.css";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";

const Shipments = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className={styles.container}>
      <div className={styles.add}>
        <button>+ New Load</button>
      </div>
      <div className={styles.content}>
        {isLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>From Address</th>
                <th>To Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.fromAddress}, {order.fromDistrict}, {order.fromCity}</td>
                  <td>{order.toAddress}, {order.toDistrict}, {order.toCity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Shipments;
