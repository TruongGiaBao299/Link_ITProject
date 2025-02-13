import React from "react";
import GuestNavbar from "../../../layout/GuestNavbar/GuestNavbar";
import GuestSidebar from "../../../layout/GuestSidebar/GuestSidebar";
import styles from "./HistoryGuestPage.module.css";
import ViewHistory from "../../../../containers/ViewHistory/ViewHistory";

const HistoryGuestPage = () => {
  return (
    <>
      <GuestNavbar></GuestNavbar>
      <GuestSidebar></GuestSidebar>
      <div className={styles.main}>
        <ViewHistory></ViewHistory>
      </div>
    </>
  );
};

export default HistoryGuestPage;
