import React from "react";
import GuestNavbar from "../../../layout/GuestNavbar/GuestNavbar";
import GuestSidebar from "../../../layout/GuestSidebar/GuestSidebar";
import styles from "./DriverGuestPage.module.css";
import BecomeDriver from "../../Home/BecomeDriver/BecomeDriver";

const DriverGuestPage = () => {
  return (
    <>
      <GuestNavbar></GuestNavbar>
      <GuestSidebar></GuestSidebar>
      <div className={styles.main}>
        <BecomeDriver></BecomeDriver>
      </div>
    </>
  );
};

export default DriverGuestPage;
