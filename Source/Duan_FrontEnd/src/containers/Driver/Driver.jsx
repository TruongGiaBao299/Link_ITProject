import React, { useContext, useEffect, useState } from "react";
import styles from "./Driver.module.css";
import { toast } from "react-toastify";
import {
  changeStatusDriverApi,
  changeStatusDriverToGuestApi,
  deleteRequestDriver,
  getDriverApi,
} from "../../utils/driverAPI/driverAPI";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import {
  getUserApi,
  makeDriverApi,
  makeGuestApi,
} from "../../utils/userAPI/userAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Driver = () => {
  const [userData, setUserData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth Driver: ", auth.user.role);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Making both API calls concurrently using Promise.all
        const [userRes, driverRes] = await Promise.all([
          getUserApi(),
          getDriverApi(),
        ]);

        console.log("User:", userRes);
        console.log("Driver:", driverRes);

        // Handling both responses
        if (userRes) {
          // Set user data (or handle it as required)
          setUserData(userRes);
        } else {
          setUserData([]); // If no user data
        }

        if (driverRes) {
          // Set driver data (or handle it as required)
          setDriverData(driverRes);
        } else {
          setDriverData([]); // If no driver data
        }
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once when the component mounts

  const handleBecomeDriver = async (email) => {
    try {
      // Run both API calls concurrently using Promise.all
      const [changeStatusResponse, makeDriverResponse] = await Promise.all([
        changeStatusDriverApi(email),
        makeDriverApi(email),
      ]);

      console.log("Change Status Driver Response:", changeStatusResponse);
      console.log("Make Driver Response:", makeDriverResponse);

      toast.success("Driver status and user role updated successfully!");

      // Update the user's role in the driverData table
      const updatedDriverData = driverData.map((user) =>
        user.email === email
          ? { ...user, role: "driver", status: "active" }
          : user
      );
      setDriverData(updatedDriverData);

      // Update the user's role in the userData table (if needed)
      const updatedUserData = userData.map((user) =>
        user.email === email ? { ...user, role: "driver" } : user
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error making driver:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleBecomeGuest = async (email) => {
    try {
      // Run all API calls concurrently using Promise.all
      const [changeStatusResponse, makeDriverResponse, deleteRequestResponse] =
        await Promise.all([
          changeStatusDriverToGuestApi(email),
          makeGuestApi(email),
          deleteRequestDriver(email),
        ]);

      console.log("Change Status Driver Response:", changeStatusResponse);
      console.log("Make Guest Response:", makeDriverResponse);
      console.log("Delete Request Response:", deleteRequestResponse);

      toast.success(
        `${email} driver status and user role updated successfully!`
      );

      // Update the user's role and status in the driverData table
      const updatedDriverData = driverData
        .filter((driver) => driver.email !== email) // Remove the driver request from the list
        .map((user) =>
          user.email === email
            ? { ...user, role: "guest", status: "pending" }
            : user
        );
      setDriverData(updatedDriverData);

      // Update the user's role in the userData table (if needed)
      const updatedUserData = userData.map((user) =>
        user.email === email ? { ...user, role: "guest" } : user
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error handling driver request:", error);
      toast.error(
        "Failed to update user role and delete driver request. Please try again."
      );
    }
  };

  const handleDeleteDriverRequest = async (email) => {
    try {
      const res = await deleteRequestDriver(email);
      toast.success(`${email} request was canceled`);

      // Cập nhật driverData ngay lập tức bằng cách loại bỏ yêu cầu đã xóa
      const updatedDriverData = driverData.filter(
        (driver) => driver.email !== email // Loại bỏ driver có email trùng với email đã xóa
      );
      setDriverData(updatedDriverData);
    } catch (error) {
      console.error("Error deleting driver request:", error);
      toast.error(
        error.message || "Failed to delete driver request. Please try again."
      );
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {isLoading ? (
        <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : driverData.length === 0 ? (
        <p className={styles.noData}>No driver requests found.</p>
      ) : (
        <table className={styles.tableuser}>
          <thead>
            <tr>
              <th className={styles.tableuserHeader}>Id</th>
              <th className={styles.tableuserHeader}>DriverName</th>
              {/* <th className={styles.tableuserHeader}>DriverNumber</th> */}
              <th className={styles.tableuserHeader}>DriverEmail</th>
              {/* <th className={styles.tableuserHeader}>DriverBirth</th>
              <th className={styles.tableuserHeader}>DriverId</th> */}
              {/* <th className={styles.tableuserHeader}>DriverAddress</th>
              <th className={styles.tableuserHeader}>DriverCity</th> */}
              <th className={styles.tableuserHeader}>PostOffice</th>
              <th className={styles.tableuserHeader}>status</th>
              {/* <th className={styles.tableuserHeader}>role</th> */}
            </tr>
          </thead>
          <tbody>
            {driverData.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user._id}</td>
                <td className={styles.tableCell}>{user.DriverName}</td>
                {/* <td className={styles.tableCell}>{user.DriverNumber}</td> */}
                <td className={styles.tableCell}>{user.email}</td>
                {/* <td className={styles.tableCell}>{user.DriverBirth}</td>
                <td className={styles.tableCell}>{user.DriverId}</td>
                <td className={styles.tableCell}>{user.DriverAddress}</td>
                <td className={styles.tableCell}>{user.DriverCity}</td> */}
                <td className={styles.tableCell}>{user.postOffice}</td>
                <td className={styles.tableCell}>{user.status}</td>
                {/* <td className={styles.tableCell}>{user.role}</td> */}
                <td className={styles.tableCell}>
                  {user.role !== "driver" ? (
                    <>
                      <button
                        className={styles.becomeDriverButton}
                        onClick={() => handleBecomeDriver(user.email)}
                      >
                        Accept Request
                      </button>
                      <button
                        className={styles.becomeGuestButton}
                        onClick={() => handleDeleteDriverRequest(user.email)}
                      >
                        Cancel Request
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.becomeGuestButton}
                      onClick={() => handleBecomeGuest(user.email)}
                    >
                      Become Guest
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Driver;
