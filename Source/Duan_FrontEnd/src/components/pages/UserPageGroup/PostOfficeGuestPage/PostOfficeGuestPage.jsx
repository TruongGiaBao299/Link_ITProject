import React from "react";
import GuestSidebar from "../../../layout/GuestSidebar/GuestSidebar";
import GuestNavbar from "../../../layout/GuestNavbar/GuestNavbar";
import styles from "./PostOfficeGuestPage.module.css";
import BecomePostOffice from "../../Home/BecomePostOffice/BecomePostOffice";

const PostOfficeGuestPage = () => {
  return (
    <>
      <GuestNavbar></GuestNavbar>
      <GuestSidebar></GuestSidebar>
      <div className={styles.main}>
        <BecomePostOffice></BecomePostOffice>
      </div>
    </>
  );
};

export default PostOfficeGuestPage;
