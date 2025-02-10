import React, { useContext, useEffect, useState } from "react";
import styles from "./PostOffice.module.css";
import { toast } from "react-toastify";
import {
  changeStatusNotActivatedPostOfficeApi,
  changeStatusPostOfficeApi,
  deleteRequestPostOffice,
  getPostOfficeApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import { makeGuestApi, makePostOfficeApi } from "../../utils/userAPI/userAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const PostOffice = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // State để kiểm tra trạng thái xử lý
  const [error, setError] = useState("");
  const [userData, setUserData] = useState([]);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch danh sách bưu cục
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await getPostOfficeApi();
        console.log("Post Office: ", res);
        if (res && Array.isArray(res)) {
          setData(res);
        } else {
          setData([]);
          toast.warn("No Post Office data found.");
        }
      } catch (err) {
        console.error("Error fetching post office data:", err);
        setError("Failed to fetch Post Office data.");
        toast.error("Failed to fetch user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Kích hoạt trạng thái bưu cục
  const handleActiveStatus = async (email) => {
    setIsUpdating(true);
    try {
      // Run both API calls concurrently using Promise.all
      const [changeStatusResponse, makePostOfficeResponse] = await Promise.all([
        changeStatusPostOfficeApi(email),
        makePostOfficeApi(email),
      ]);

      console.log("Change Status Post Response:", changeStatusResponse);
      console.log("Make Post Response:", makePostOfficeResponse);
      
      toast.success("Post Office activated successfully!");
      
      const updatedData = data.map((Office) =>
        Office.email === email ? { ...Office, status: "active" } : Office
      );
      setData(updatedData);

       // Update the user's role in the userData table (if needed)
       const updatedUserData = userData.map((user) =>
        user.email === email ? { ...user, role: "postoffice" } : user
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Hủy kích hoạt trạng thái bưu cục và xóa yêu cầu
  const handleNotActiveStatus = async (email) => {
    // Cập nhật UI ngay lập tức: xóa bưu cục khỏi data
    const updatedData = data.filter((office) => office.email !== email);
    setData(updatedData);

    setIsUpdating(true);
    try {
      // Thực hiện hai API đồng thời
      const [statusResponse, deleteResponse] = await Promise.allSettled([
        changeStatusNotActivatedPostOfficeApi(email),
        makeGuestApi(email),
        deleteRequestPostOffice(email),
      ]);

      // Kiểm tra kết quả từ API
      if (statusResponse.status === "rejected") {
        console.error("Failed to update status:", statusResponse.reason);
        throw new Error("Failed to update post office status.");
      }
      if (deleteResponse.status === "rejected") {
        console.error("Failed to cancel request:", deleteResponse.reason);
        throw new Error("Failed to cancel post office request.");
      }

      // Nếu cả hai API đều thành công
      toast.success(
        "Post Office status updated and request canceled successfully!"
      );
    } catch (error) {
      console.error("Error handling update and delete:", error);
      toast.error(
        error.message || "Failed to process request. Please try again."
      );

      // Nếu có lỗi, thêm lại bưu cục vào UI
      const revertData = [...data];
      const office = revertData.find((office) => office.email === email);
      if (office) {
        office.status = "active"; // Reset trạng thái về "active"
        setData(revertData);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {isLoading ? (
        <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : data.length === 0 ? (
        <p className={styles.noData}>No PostOffice found.</p>
      ) : (
        <table className={styles.tableuser}>
          <thead>
            <tr>
              {/* <th className={styles.tableuserHeader}>Id</th> */}
              {/* <th className={styles.tableuserHeader}>OfficeUserName</th>
              <th className={styles.tableuserHeader}>OfficeUserNumber</th>
              <th className={styles.tableuserHeader}>OfficeUserId</th>
              <th className={styles.tableuserHeader}>OfficeUserAddress</th>
              <th className={styles.tableuserHeader}>OfficeUserEmail</th> */}
              <th className={styles.tableuserHeader}>OfficeName</th>
              <th className={styles.tableuserHeader}>OfficeHotline</th>
              <th className={styles.tableuserHeader}>OfficeAddress</th>
              {/* <th className={styles.tableuserHeader}>OfficeLocation</th> */}
              <th className={styles.tableuserHeader}>Status</th>
              {/* <th className={styles.tableuserHeader}>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((Office) => (
              <tr key={Office._id} className={styles.tableRow}>
                {/* <td className={styles.tableCell}>{Office._id}</td> */}
                {/* <td className={styles.tableCell}>{Office.OfficeUserName}</td>
                <td className={styles.tableCell}>{Office.OfficeUserNumber}</td>
                <td className={styles.tableCell}>{Office.OfficeUserId}</td>
                <td className={styles.tableCell}>{Office.OfficeUserAddress}</td>
                <td className={styles.tableCell}>{Office.email}</td> */}
                <td className={styles.tableCell}>{Office.OfficeName}</td>
                <td className={styles.tableCell}>{Office.OfficeHotline}</td>
                <td className={styles.tableCell}>
                  {Office.OfficeAddress}, {Office.OfficeDistrict}, {Office.OfficeWard}, {Office.OfficeCity}
                </td>
                {/* <td className={styles.tableCell}>
                  {Office.OfficeLatitude}, {Office.OfficeLongitude}
                </td> */}
                <td className={styles.tableCell}>{Office.status}</td>
                <td className={styles.tableCell}>
                  {Office.status !== "active" ? (
                    <button
                      className={styles.becomeDriverButton}
                      onClick={() => handleActiveStatus(Office.email)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Processing..." : "Activate"}
                    </button>
                  ) : (
                    <button
                      className={styles.becomeDriverButton}
                      onClick={() => handleNotActiveStatus(Office.email)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Processing..." : "Deactivate"}
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

export default PostOffice;
