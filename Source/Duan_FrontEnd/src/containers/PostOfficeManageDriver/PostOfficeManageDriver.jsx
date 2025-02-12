import React, { useContext, useEffect, useState } from "react";
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
import styles from "./PostOfficeManageDriver.module.css";
import { getPostOfficeByEmailApi } from "../../utils/postOfficeAPI/postOfficeAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const PostOfficeManageDriver = () => {
  const [userData, setUserData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [error, setError] = useState("");
  const [postOfficeEmail, setPostOfficeEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch driver and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userRes, driverRes] = await Promise.all([
          getUserApi(),
          getDriverApi(),
        ]);

        setUserData(userRes || []);
        setDriverData(driverRes || []);
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch the PostOffice email associated with the current user
  useEffect(() => {
    const fetchPostOfficeEmail = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        if (res && res.email) {
          setPostOfficeEmail(res.email);
        } else {
          toast.error("Failed to fetch post office email.");
        }
      } catch (error) {
        console.error("Error fetching post office email:", error);
        toast.error("Error fetching post office email.");
      }
    };

    fetchPostOfficeEmail();
  }, []);

  const handleBecomeDriver = async (email) => {
    try {
      const [changeStatusResponse, makeDriverResponse] = await Promise.all([
        changeStatusDriverApi(email),
        makeDriverApi(email),
      ]);

      toast.success("Driver status and user role updated successfully!");

      const updatedDriverData = driverData.map((user) =>
        user.email === email
          ? { ...user, role: "driver", status: "active" }
          : user
      );
      setDriverData(updatedDriverData);

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
      const [changeStatusResponse, makeDriverResponse, deleteRequestResponse] =
        await Promise.all([
          changeStatusDriverToGuestApi(email),
          makeGuestApi(email),
          deleteRequestDriver(email),
        ]);

      toast.success(
        `${email} driver status and user role updated successfully!`
      );

      const updatedDriverData = driverData.filter(
        (driver) => driver.email !== email
      );
      setDriverData(updatedDriverData);

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
      await deleteRequestDriver(email);
      toast.success(`${email} request was canceled`);

      const updatedDriverData = driverData.filter(
        (driver) => driver.email !== email
      );
      setDriverData(updatedDriverData);
    } catch (error) {
      console.error("Error deleting driver request:", error);
      toast.error(
        error.message || "Failed to delete driver request. Please try again."
      );
    }
  };

  // Filter drivers by postOfficeEmail
  const filteredDriverData = driverData.filter(
    (driver) => driver.postOffice === postOfficeEmail
  );

  return (
    <div className={styles.maincontainer}>
      {isLoading ? (
        <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
      ) : error ? (
        <p>{error}</p>
      ) : filteredDriverData.length === 0 ? (
        <p>No driver requests found for this post office.</p>
      ) : (
        <>
          <div className={styles.container}>
            <table className={styles.tablecontainer}>
              <thead>
                <tr>
                  <th>DriverEmail</th>
                  <th>DriverNumber</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredDriverData.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{user.DriverNumber}</td>
                    <td>{user.status}</td>
                    <td>
                      {user.role !== "driver" ? (
                        <>
                          <button
                            className={styles.acceptbutton}
                            onClick={() => handleBecomeDriver(user.email)}
                          >
                            Accept Request
                          </button>
                          <button
                            className={styles.acceptbutton}
                            onClick={() =>
                              handleDeleteDriverRequest(user.email)
                            }
                          >
                            Cancel Request
                          </button>
                        </>
                      ) : (
                        <button
                          className={styles.acceptbutton}
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
          </div>
        </>
      )}
    </div>
  );
};

export default PostOfficeManageDriver;
