import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import styles from "./ShipmentsPage.module.css";
import Orders from "../../../containers/Orders/Orders";
import Shipments from "../../../containers/Shipments/Shipments";

const ShipmentsPage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.main}>
        <Shipments></Shipments>
      </div>
    </>
  );
};

export default ShipmentsPage;
