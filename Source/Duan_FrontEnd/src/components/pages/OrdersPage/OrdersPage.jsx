import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import styles from "./OrdersPage.module.css";
import Orders from "../../../containers/Orders/Orders";

const OrdersPage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.main}>
        <Orders></Orders>
      </div>
    </>
  );
};

export default OrdersPage;
