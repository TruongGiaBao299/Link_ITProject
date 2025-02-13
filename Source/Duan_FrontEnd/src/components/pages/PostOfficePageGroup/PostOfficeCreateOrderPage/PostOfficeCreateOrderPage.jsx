import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import Shipments from "../../../../containers/Shipments/Shipments";
import styles from "./PostOfficeCreateOrderPage.module.css";
import CreateOrder from "../../Home/CreateOrder/CreateOrder";

const PostOfficeCreateOrderPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        <CreateOrder></CreateOrder>
      </div>
    </>
  );
};

export default PostOfficeCreateOrderPage;
