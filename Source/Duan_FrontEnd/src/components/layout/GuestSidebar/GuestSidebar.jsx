import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./GuestSidebar.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { MdDashboard } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaUserNinja } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { MdOutlineLocalShipping } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { MdLogout } from "react-icons/md";

const GuestSidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    // Set active item based on the current route
    const currentPath = location.pathname.slice(1); // Remove leading slash
    setActiveItem(currentPath || "dashboard");
  }, [location]);

  const handleItemClick = (item, path) => {
    setActiveItem(item); // Set the active menu item
    navigate(path); // Navigate to the specified path
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenthicate: false,
      user: { email: "", name: "", role: "" },
    });
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to home
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logocontent}>
          <img className={styles.logo} src="logo2.png" alt="" />
          <p className={styles.logotitle}>BaShip</p>
        </div>
        <ul className={styles.menu}>
          <li
            className={`${styles.menuItem} ${
              activeItem === "dashboard" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("dashboard", "/guesthome")}
          >
            <RiDashboardHorizontalFill /> Dashboard
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Shipment" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Shipment", "/guestshipment")}
          >
            <MdOutlineLocalShipping /> Shipment
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "orders" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("orders", "/guestorder")}
          >
            <MdOutlineShoppingCart /> Orders
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "driver" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("driver", "/guestdriver")}
          >
            <MdOutlineSupervisorAccount /> Driver
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "postoffice" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("postoffice", "/guestpostoffice")}
          >
            <MdOutlineBusinessCenter /> Post Office
          </li>
          <li onClick={handleLogout} className={styles.menuItem}>
            <IoLogOutOutline /> Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GuestSidebar;
