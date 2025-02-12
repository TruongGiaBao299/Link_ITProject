import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import Shipments from "../../../../containers/Shipments/Shipments";
import styles from "./PostOfficeShipmentsPage.module.css";

const PostOfficeShipmentsPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        {/* <ViewOrder></ViewOrder> */}
        <Shipments></Shipments>
      </div>
    </>
  );
};

export default PostOfficeShipmentsPage;
