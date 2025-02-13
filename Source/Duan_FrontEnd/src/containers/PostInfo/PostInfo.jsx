import React, { useEffect, useState } from "react";
import styles from "./PostInfo.module.css";
import {
  getPostOfficeByEmailApi,
  getPostOfficeOrderByEmailApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const PostInfo = () => {
  const [post, setPost] = useState({});
  const [postCity, setPostCity] = useState("");
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        if (res) {
          setPost(res);
          setPostCity(res.OfficeCity);
        } else {
          setPost({});
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching post office info");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getPostOfficeOrderByEmailApi();
        if (res && res.length > 0) {
          setOrders(res);
          processChartData(res);
        } else {
          setOrders([]);
          setChartData([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  const processChartData = (orders) => {
    const currentMonth = new Date().getMonth();
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth;
    });

    const groupedData = {};
    filteredOrders.forEach((order) => {
      const day = new Date(order.createdAt).getDate();
      if (!groupedData[day]) {
        groupedData[day] = 0;
      }
      groupedData[day]++;
    });

    const formattedData = Object.keys(groupedData).map((day) => ({
      day: `Day ${day}`,
      orders: groupedData[day],
    }));

    setChartData(formattedData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.maincontainer}>
      <div className={styles.topcontainer}>
        <div className={styles.postinfo}>
          <h2>{post.OfficeName || "N/A"}</h2>
          <p><strong>Address:</strong> {post.OfficeAddress}, {post.OfficeDistrict}, {post.OfficeCity}</p>
          <p><strong>Hotline:</strong> {post.OfficeHotline || "N/A"}</p>
          <p><strong>Email:</strong> {post.email || "N/A"}</p>
          <button>Edit</button>
        </div>

        {/* Biểu đồ đơn hàng trong tháng */}
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#FCC737" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.botcontainer}>
        <div className={styles.tracking}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>From Address</th>
                <th>To Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{`${order.fromAddress}, ${order.fromDistrict}, ${order.fromCity}`}</td>
                    <td>{`${order.toAddress}, ${order.toDistrict}, ${order.toCity}`}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PostInfo;
