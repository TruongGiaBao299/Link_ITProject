import React, { useState } from "react";
import DriverGetOrder from "../../../containers/DriverGetOrder/DriverGetOrder";
import DriverMangeOrder from "../../../containers/DriverManageOrder/DriverMangeOrder";
import HeaderDriver from "../../layout/HeaderDriver/HeaderDriver";
import styles from "./ManageHistoryDrivePage.module.css";
import HeroSection from "../../../containers/HeroSection/HeroSection";
import About from "../../../containers/About";
import Footer from "../../layout/Footer/Footer";
import FindOrder from "../Home/FindOrder/FindOrder";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DriverSentOrder from "../../../containers/DriverSentOrder/DriverSentOrder";
import DriverManageOrderSent from "../../../containers/DriverManageOrderSent/DriverManageOrderSent";

const ManageHistoryDrivePage = () => {
  const [currentPage, setCurrentPage] = useState("drivergetorder");

  return (
    <>
      <HeaderDriver />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <DriverMangeOrder></DriverMangeOrder>
        </div>
      </div>
    </>
  );
};

export default ManageHistoryDrivePage;
