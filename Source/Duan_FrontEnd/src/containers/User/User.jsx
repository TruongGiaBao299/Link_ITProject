import React, { useEffect, useState } from "react";
import styles from "./User.module.css";
import { toast } from "react-toastify";
import { getUserApi } from "../../utils/userAPI/userAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const User = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await getUserApi();
        console.log("User:", res);
        if (res) {
          setData(res);
          setFilteredData(res); // Set initial filtered data to all users
        } else {
          setData([]);
          setFilteredData([]);
        }
      } catch (err) {
        toast.error("Failed to fetch user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleFilterChange = (role) => {
    setRoleFilter(role);
    if (role === "All") {
      setFilteredData(data); // Show all users
    } else {
      const filtered = data.filter((user) => user.role === role);
      setFilteredData(filtered);
    }
  };

  const roles = ["All", "guest", "driver", "postoffice"];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.filters}>
        {roles.map((role) => (
          <button
            key={role}
            className={`${styles.filterButton} ${
              roleFilter === role ? styles.active : ""
            }`}
            onClick={() => handleFilterChange(role)}
          >
            {role}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : filteredData.length === 0 ? (
        <p className={styles.noData}>No users found.</p>
      ) : (
        <table className={styles.tableuser}>
          <thead>
            <tr>
              <th className={styles.tableuserHeader}>Id</th>
              <th className={styles.tableuserHeader}>Name</th>
              <th className={styles.tableuserHeader}>Email</th>
              <th className={styles.tableuserHeader}>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user._id}</td>
                <td className={styles.tableCell}>{user.name}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default User;
