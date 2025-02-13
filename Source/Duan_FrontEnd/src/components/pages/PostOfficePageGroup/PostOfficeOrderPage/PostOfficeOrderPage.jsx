import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import Shipments from "../../../../containers/Shipments/Shipments";
import styles from "./PostOfficeOrderPage.module.css";
import ViewOrder from "../../../../containers/ViewOrder/ViewOrder";
import PostOfficeGetOrder from "../../../../containers/PostOfficeGetOrder/PostOfficeGetOrder";

const PostOfficeOrderPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        {/* <ViewOrder></ViewOrder> */}
        <PostOfficeGetOrder></PostOfficeGetOrder>
      </div>
    </>
  );
};

export default PostOfficeOrderPage;
