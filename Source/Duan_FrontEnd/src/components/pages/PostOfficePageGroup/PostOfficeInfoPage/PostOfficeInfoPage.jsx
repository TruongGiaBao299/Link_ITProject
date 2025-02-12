import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import styles from "./PostOfficeInfoPage.module.css";
import PostInfo from "../../../../containers/PostInfo/PostInfo";

const PostOfficeInfoPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        {/* <ViewOrder></ViewOrder> */}
        <PostInfo></PostInfo>
      </div>
    </>
  );
};

export default PostOfficeInfoPage;
