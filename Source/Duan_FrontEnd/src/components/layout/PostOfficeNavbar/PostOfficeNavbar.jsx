import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostOfficeNavbar.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsChatLeftText } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { IoChatbox } from "react-icons/io5";

const PostOfficeNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth: ", auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Check for token
    setIsLoggedIn(!!token);

    // Check if auth object and user data are valid
    if (token && auth?.user?.name) {
      setUsername(auth.user.name); // Update username
    } else {
      setUsername("");
    }
  }, [auth]);

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
    navigate("/"); // Redirect to home
    toast.success("Logged out successfully!");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.hello}>
        <span className={styles.welcome}>Welcome back, {username}</span>
      </div>

      {/* <div className={styles.right}>
        <input type="text" className={styles.searchbar} placeholder="Search" />

        <div className={styles.groupicon}>
          <div className={styles.icon}>
            <IoIosNotificationsOutline />
          </div>
          <div className={styles.icon}>
            <BsChatLeftText />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PostOfficeNavbar;
