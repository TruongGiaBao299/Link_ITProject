import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/auth.context";
import { useNavigate } from "react-router-dom";
import HeaderDriver from "../../layout/HeaderDriver/HeaderDriver";
import PostOfficeGetOrder from "../../../containers/PostOfficeGetOrder/PostOfficeGetOrder";
import PostOfficeManageOrder from "../../../containers/PostOfficeManageOrder/PostOfficeManageOrder";
import PostOfficeSentOrder from "../../../containers/PostOfficeSentOrder/PostOfficeSentOrder";
import PostOfficeManageDriver from "../../../containers/PostOfficeManageDriver/PostOfficeManageDriver";
import PostOfficeHistory from "../../../containers/PostOfficeHistory/PostOfficeHistory";
import HeaderPostOffice from "../../layout/HeaderPostOffice/HeaderPostOffice";
import styles from "./PostOfficeHomePage.module.css"

const PostOfficeHomePage = () => {
  const [currentPage, setCurrentPage] = useState("drivergetorder"); // State to track current page
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in

  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth Driver Home: ", auth.user.role);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage to determine if the user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if there's a token, otherwise false
  }, []);

  return (
    <>
      <HeaderPostOffice></HeaderPostOffice>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.listbutton}>
            <button
              className={
                currentPage === "postofficesentorder" ? styles.active : ""
              }
              onClick={() => setCurrentPage("postofficesentorder")}
            >
              Sent Order
            </button>
            <button
              className={
                currentPage === "postofficegetorder" ? styles.active : ""
              }
              onClick={() => setCurrentPage("postofficegetorder")}
            >
              Get Order
            </button>
            <button
              className={
                currentPage === "postofficemanagedriver" ? styles.active : ""
              }
              onClick={() => setCurrentPage("postofficemanagedriver")}
            >
              Manage Driver
            </button>
            <button
              className={
                currentPage === "postofficehistory" ? styles.active : ""
              }
              onClick={() => setCurrentPage("postofficehistory")}
            >
              History
            </button>
          </div>

          {/* Display components based on the current page */}
          {currentPage === "postofficesentorder" && <PostOfficeSentOrder />}
          {currentPage === "postofficegetorder" && <PostOfficeGetOrder />}
          {currentPage === "postofficemanagedriver" && (
            <PostOfficeManageDriver />
          )}
          {currentPage === "postofficehistory" && <PostOfficeHistory />}
        </div>
      </div>
    </>
  );
};

export default PostOfficeHomePage;
