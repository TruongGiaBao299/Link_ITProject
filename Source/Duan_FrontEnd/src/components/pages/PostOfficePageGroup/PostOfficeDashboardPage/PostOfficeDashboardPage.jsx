import React from 'react'
import styles from "./PostOfficeDashboardPage.module.css";
import GuestNavbar from '../../../layout/GuestNavbar/GuestNavbar';
import GuestSidebar from '../../../layout/GuestSidebar/GuestSidebar';
import ViewOrder from '../../../../containers/ViewOrder/ViewOrder';
import TrackingFind from '../../../../containers/TrackingFind/TrackingFind';
import PostOfficeNavbar from '../../../layout/PostOfficeNavbar/PostOfficeNavbar';
import PostOfficeSidebar from '../../../layout/PostOfficeSidebar/PostOfficeSidebar';
import TrackingFindPostOffice from '../../../../containers/TrackingFindPostOffice/TrackingFindPostOffice';

const PostOfficeDashboardPage = () => {
  
  return (
    <>
    <PostOfficeNavbar></PostOfficeNavbar>
    <PostOfficeSidebar></PostOfficeSidebar>
    <div className={styles.main}>
      {/* <ViewOrder></ViewOrder> */}
      <TrackingFindPostOffice></TrackingFindPostOffice>
    </div>
    </>
  )
}

export default PostOfficeDashboardPage