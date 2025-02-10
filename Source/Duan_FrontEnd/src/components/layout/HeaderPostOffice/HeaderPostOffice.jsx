import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderPostOffice.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { MdOutlineLocalShipping } from "react-icons/md";
import { getOrderByEmailApi } from "../../../utils/orderAPI/orderAPI"; // Import your API call
import { FaUserCircle, FaHistory } from "react-icons/fa";
import UpdatePassword from "../../../containers/UpdatePassword/UpdatePassword";

const HeaderPostOffice = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [orderCount, setOrderCount] = useState(0); // State for storing order count
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth: ", auth);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  }); // Tọa độ
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Check for token
    setIsLoggedIn(!!token);

    // Check if auth object and user data are valid
    if (token && auth?.user?.name) {
      setUsername(auth.user.name); // Update username
      fetchUserOrders(auth.user.email); // Fetch orders when the user is logged in
    } else {
      setUsername("");
      setOrderCount(0); // Reset order count if not logged in
    }
  }, [auth]);

  useEffect(() => {
    const fetchCoordinates = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error(
              "Unable to fetch location. Please enable location services."
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    fetchCoordinates();
  }, []);

  const fetchUserOrders = async (email) => {
    try {
      const orders = await getOrderByEmailApi(email); // Fetch orders by email
      console.log("Header order: ", orders);

      // Filter orders to exclude those with the status "shipped"
      const pendingOrders = orders.filter(
        (order) => order.status === "pending" || order.status === "is shipping"
      );

      setOrderCount(pendingOrders.length); // Set order count based on filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderCount(0); // Set order count to 0 in case of error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove token from storage
    setIsLoggedIn(false); // Update state
    setAuth({
      isAuthenthicate: false,
      user: {
        email: "",
        name: "",
        role: "",
      },
    });

    // Force page reload to reset the state and UI
    navigateTo("/");
    window.location.reload();
    toast.success("Logged out successfully!");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <nav className={styles.navLinks}>
          {isLoggedIn ? (
            <>
              <img className={styles.img} src="logo.png"></img>
              <span className={styles.greeting}>Hello, {username}!</span>
              <button onClick={() => navigate("/postofficehome")}>Home</button>
              <button onClick={() => navigate("/service")}>Service</button>
              <button onClick={() => navigate("/contact")}>Contact</button>

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
              <button onClick={() => navigate("/driverhome")}>Home</button>
              <button onClick={() => navigate("/service")}>Service</button>
              <button onClick={() => navigate("/contact")}>Contact</button>
              <div className={styles.signup}>
                <button
                  className={styles.login}
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className={styles.register}
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
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

export default HeaderPostOffice;
