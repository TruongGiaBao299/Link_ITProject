import React, { useContext, useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { BsBoxSeam } from "react-icons/bs";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Orders from "../Orders/Orders";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth Dashboard: ", auth.user.role);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [inWarehouseCount, setInWarehouseCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const trackingData = [
    {
      date: "12 Oct 2024",
      time: "12:05 PM",
      description: "Supplier Selection",
    },
    { date: "20 Oct 2024", time: "10:05 AM", description: "Customs Clearance" },
  ];

  const mapCenter = [10.813975742345935, 106.62511375117414];

  // Fake data for the chart
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Orders",
        data: [150, 200, 180, 220, 170, 250, 300, 380, 420, 270, 110, 500],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Revenue",
        data: [
          1000, 1500, 1200, 2000, 1800, 2500, 2700, 3000, 3200, 3100, 1500,
          4000,
        ],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderApi();
        console.log("Order:", res);

        // Lọc chỉ những đơn hàng có status === "shipped"
        const shippedOrders = res.filter((order) => order.status === "shipped");
        // Lấy 70% giá trị price
        const Revenue = shippedOrders.map((order) => order.price * 0.7);

        // Tính tổng giá trị 70%
        const totalRevenue = parseFloat(Revenue.reduce((sum, price) => sum + price, 0).toFixed(2));

        console.log("Shipped Prices (70% Total):", totalRevenue);
        // Cập nhật state với totalRevenue
        setTotalRevenue(totalRevenue);

        // Đếm số lượng đơn hàng có status === "is shipping"
        const inWarehouseOrders = res.filter(
          (order) => order.status === "is shipping"
        );
        setInWarehouseCount(inWarehouseOrders.length);

        // Check if the response has orders data
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]); // If no orders, set as empty
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

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.leftcontent}>
          <div className={styles.totalcontent1}>
            <div className={styles.item}>
              <div className={styles.itemicon}>
                <BsBoxSeam />
              </div>
              <div className={styles.itemtotal}>
                <div className={styles.itemname}>Total Order</div>
                <div className={styles.itemvalue}>{orders.length}</div>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemicon}>
                <BsBoxSeam />
              </div>
              <div className={styles.itemtotal}>
                <div className={styles.itemname}>Total Revenue</div>
                <div className={styles.itemvalue}>{totalRevenue}</div>
              </div>
            </div>
          </div>
          <div className={styles.chart}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className={styles.rightcontent}>
          <div className={styles.boxtracking}>
            <div className={styles.map}>
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: "470px", width: "450px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.bot}>
        <Orders></Orders>
      </div> */}
    </div>
  );
};

export default Dashboard;
