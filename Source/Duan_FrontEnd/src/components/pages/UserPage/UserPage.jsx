import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import styles from "./UserPage.module.css";
import User from "../../../containers/User/User";

const UserPage = () => {
  return (
    <>
      <div className={styles.container}>
        <Sidebar></Sidebar>
        <Navbar></Navbar>
        <div className={styles.main}>
          <User></User>
        </div>
      </div>
    </>
  );
};

export default UserPage;
