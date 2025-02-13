import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import Shipments from "../../../../containers/Shipments/Shipments";
import styles from "./PostOfficeSendOrderPage.module.css";
import PostOfficeManageOrder from "../../../../containers/PostOfficeManageOrder/PostOfficeManageOrder";
import PostOfficeSentOrder from "../../../../containers/PostOfficeSentOrder/PostOfficeSentOrder";

const PostOfficeSendOrderPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        {/* <ViewOrder></ViewOrder> */}
        <PostOfficeSentOrder></PostOfficeSentOrder>
      </div>
    </>
  );
};

export default PostOfficeSendOrderPage;
