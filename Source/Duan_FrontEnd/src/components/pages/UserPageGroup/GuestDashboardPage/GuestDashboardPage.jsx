import React from 'react'
import styles from "./GuestDashboardPage.module.css";
import GuestNavbar from '../../../layout/GuestNavbar/GuestNavbar';
import GuestSidebar from '../../../layout/GuestSidebar/GuestSidebar';
import ViewOrder from '../../../../containers/ViewOrder/ViewOrder';
import TrackingFind from '../../../../containers/TrackingFind/TrackingFind';

const GuestDashboardPage = () => {
  
  return (
    <>
    <GuestNavbar></GuestNavbar>
    <GuestSidebar></GuestSidebar>
    <div className={styles.main}>
      {/* <ViewOrder></ViewOrder> */}
      <TrackingFind></TrackingFind>
    </div>
    </>
  )
}

export default GuestDashboardPage