import React, { useContext, useEffect, useState } from "react";
import styles from "./Orders.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const { auth } = useContext(AuthContext);
  console.log("check auth Orders: ", auth.user.role);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderApi();
        console.log("Order:", res);

        if (res && res.length > 0) {
          setOrders(res);
          setFilteredOrders(res); // Set initial filtered orders to all orders
        } else {
          setOrders([]);
          setFilteredOrders([]); // No orders
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  const statuses = [
    "All",
    "pending",
    "delivery to post office",
    "prepare to delivery",
    "is shipping",
    "shipped",
    "canceled",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {statuses.map((status) => (
          <button
            key={status}
            className={`${styles.filterButton} ${
              statusFilter === status ? styles.active : ""
            }`}
            onClick={() => handleFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner isLoading={isLoading} />
      ) : filteredOrders.length === 0 ? (
        <p>You don't have any orders!</p>
      ) : (
        <div className={styles.content}>
          <table className={styles.content}>
            <thead>
              <tr>
                <th>Order ID</th>
                {/* <th>Sender Name</th>
                <th>Sender Number</th> */}
                <th>From Address</th>
                {/* <th>Recipient Name</th>
                <th>Recipient Number</th> */}
                <th>To Address</th>
                {/* <th>Order Weight</th>
                <th>Order Size</th>
                <th>Type</th>
                <th>Message</th>
                <th>Price</th> */}
                <th>Status</th>
                {/* <th>Created By</th> */}
                <th>Driver</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr className={styles.text} key={order._id}>
                  <td>{order._id}</td>
                  {/* <td>{order.senderName}</td>
                  <td>{order.senderNumber}</td> */}
                  <td>
                    {`${order.fromAddress}, ${order.fromDistrict}, ${order.fromCity}`}
                  </td>
                  {/* <td>{order.recipientName}</td>
                  <td>{order.recipientNumber}</td> */}
                  <td>
                    {`${order.toAddress}, ${order.toDistrict}, ${order.toCity}`}
                  </td>
                  {/* <td>{order.orderWeight}</td>
                  <td>{order.orderSize}</td>
                  <td>{order.type}</td>
                  <td>{order.message}</td>
                  <td>{order.price}</td> */}
                  <td>{order.status}</td>
                  {/* <td>{order.createdBy}</td> */}
                  <td>{order.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
