import React from "react";
import styles from "./Admin.module.css";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";

const Admin = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
    </>
  );
};

export default Admin;
