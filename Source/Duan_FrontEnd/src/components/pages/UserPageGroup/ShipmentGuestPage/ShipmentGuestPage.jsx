import React from "react";
import GuestNavbar from "../../../layout/GuestNavbar/GuestNavbar";
import GuestSidebar from "../../../layout/GuestSidebar/GuestSidebar";
import styles from "./ShipmentGuestPage.module.css";
import ViewHistory from "../../../../containers/ViewHistory/ViewHistory";
import Shipments from "../../../../containers/Shipments/Shipments";

const ShipmentGuestPage = () => {
  return (
    <>
      <GuestNavbar></GuestNavbar>
      <GuestSidebar></GuestSidebar>
      <div className={styles.main}>
        <Shipments></Shipments>
      </div>
    </>
  );
};

export default ShipmentGuestPage;
