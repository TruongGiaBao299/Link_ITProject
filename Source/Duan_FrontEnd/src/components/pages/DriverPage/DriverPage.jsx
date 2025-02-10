import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import styles from "./DriverPage.module.css";
import Driver from "../../../containers/Driver/Driver";

const DriverPage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.main}>
        <Driver></Driver>
      </div>
    </>
  );
};

export default DriverPage;
