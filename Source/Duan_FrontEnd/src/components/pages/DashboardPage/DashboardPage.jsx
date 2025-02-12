import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import Dashboard from "../../../containers/Dashboard/Dashboard";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.main}>
        <Dashboard></Dashboard>
      </div>
    </>
  );
};

export default DashboardPage;
