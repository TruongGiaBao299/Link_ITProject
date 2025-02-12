import React from "react";
import GuestNavbar from "../../../layout/GuestNavbar/GuestNavbar";
import GuestSidebar from "../../../layout/GuestSidebar/GuestSidebar";
import CreateOrder from "../../Home/CreateOrder/CreateOrder";
import styles from "./OrderGuestPage.module.css";
import ViewOrder from "../../../../containers/ViewOrder/ViewOrder";

const OrderGuestPage = () => {
  return (
    <>
      <GuestNavbar></GuestNavbar>
      <GuestSidebar></GuestSidebar>
      <div className={styles.main}>
        {/* <CreateOrder></CreateOrder> */}
        <ViewOrder></ViewOrder>
      </div>
    </>
  );
};

export default OrderGuestPage;
