import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import Shipments from "../../../../containers/Shipments/Shipments";
import styles from "./PostOfficeDriverPage.module.css";
import ViewOrder from "../../../../containers/ViewOrder/ViewOrder";
import PostOfficeGetOrder from "../../../../containers/PostOfficeGetOrder/PostOfficeGetOrder";
import PostOfficeManageOrder from "../../../../containers/PostOfficeManageOrder/PostOfficeManageOrder";
import PostOfficeHistory from "../../../../containers/PostOfficeHistory/PostOfficeHistory";
import PostOfficeManageDriver from "../../../../containers/PostOfficeManageDriver/PostOfficeManageDriver";

const PostOfficeDriverPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        <PostOfficeManageDriver></PostOfficeManageDriver>
      </div>
    </>
  );
};

export default PostOfficeDriverPage;
