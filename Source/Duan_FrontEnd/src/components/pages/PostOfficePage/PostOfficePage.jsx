import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import styles from "./PostOfficePage.module.css";
import User from "../../../containers/User/User";
import PostOffice from "../../../containers/PostOffice/PostOffice";

const PostOfficePage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.main}>
        <PostOffice></PostOffice>
      </div>
    </>
  );
};

export default PostOfficePage;
