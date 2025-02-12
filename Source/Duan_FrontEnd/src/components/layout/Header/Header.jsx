import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { MdOutlineLocalShipping } from "react-icons/md";
import { getOrderByEmailApi } from "../../../utils/orderAPI/orderAPI";
import { FaUserCircle, FaHistory } from "react-icons/fa";
import UpdatePassword from "../../../containers/UpdatePassword/UpdatePassword";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (token && auth?.user?.name) {
      setUsername(auth.user.name);
      fetchUserOrders(auth.user.email);
    } else {
      setUsername("");
      setOrderCount(0);
    }
  }, [auth]);

  const fetchUserOrders = async (email) => {
    try {
      const orders = await getOrderByEmailApi(email);
      const pendingOrders = orders.filter(
        (order) => order.status === "pending" || order.status === "is shipping"
      );
      setOrderCount(pendingOrders.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuth({
      isAuthenthicate: false,
      user: { email: "", name: "", role: "" },
    });

    navigate("/");
    window.location.reload();
    toast.success("Logged out successfully!");
  };

  return (
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <nav className={styles.navLinks}>
          {isLoggedIn ? (
            <>
              <img className={styles.img} src="logo.png"></img>
              <span className={styles.greeting}>Hello, {username}!</span>
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={() => navigate("/becomedriver")}>Driver</button>
              <button onClick={() => navigate("/service")}>Service</button>
              <button onClick={() => navigate("/contact")}>Contact</button>
              <button onClick={() => navigate("/vieworder")}>
                <MdOutlineLocalShipping />
                {orderCount > 0 && <span>{orderCount}</span>}
              </button>
              <button onClick={() => navigate("/viewhistory")}>
                <FaHistory />
              </button>

              {/* Nút User Icon để mở dropdown */}
              <div className={styles.userMenu}>
                <button onClick={() => setShowDropdown(!showDropdown)}>
                  <FaUserCircle />
                </button>

                {/* Dropdown box */}
                {showDropdown && (
                  <div className={styles.dropdown}>
                    <p>
                      <strong>User Name: </strong>
                      {auth.user.name}
                    </p>
                    <hr />
                    <p>
                      <strong>Email: </strong>
                      {auth.user.email}
                    </p>
                    <hr />
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowChangePasswordPopup(true);
                      }}
                    >
                      Change Password
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <img className={styles.img} src="logo.png"></img>
              <button onClick={() => navigate("/")}>Home</button>
              {/* <button onClick={() => navigate("/becomedriver")}>Driver</button> */}
              <button onClick={() => navigate("/service")}>Service</button>
              <button onClick={() => navigate("/contact")}>Contact</button>
              <div className={styles.signup}>
                <button className={styles.login} onClick={() => navigate("/login")}>Login</button>
                <button className={styles.register} onClick={() => navigate("/register")}>Register</button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Popup Change Password */}
      {showChangePasswordPopup && (
        <UpdatePassword onClose={() => setShowChangePasswordPopup(false)} />
      )}
    </header>
  );
};

export default Header;
