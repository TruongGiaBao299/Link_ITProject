import React, { useState } from "react";
import DriverGetOrder from "../../../containers/DriverGetOrder/DriverGetOrder";
import DriverMangeOrder from "../../../containers/DriverManageOrder/DriverMangeOrder";
import HeaderDriver from "../../layout/HeaderDriver/HeaderDriver";
import styles from "./ManageDriveSentPage.module.css";
import HeroSection from "../../../containers/HeroSection/HeroSection";
import About from "../../../containers/About";
import Footer from "../../layout/Footer/Footer";
import FindOrder from "../Home/FindOrder/FindOrder";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DriverSentOrder from "../../../containers/DriverSentOrder/DriverSentOrder";
import DriverManageOrderSent from "../../../containers/DriverManageOrderSent/DriverManageOrderSent";

const ManageDriveSentPage = () => {
  const [currentPage, setCurrentPage] = useState("drivergetorder");

  return (
    <>
      <HeaderDriver />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.mainer}>
            <div className={styles.listbutton}>
              {/* <button
                className={
                  currentPage === "drivergetorder" ? styles.active : ""
                }
                onClick={() => setCurrentPage("drivergetorder")}
              >
                Sent Order
              </button> */}
              <button
              className={currentPage === "sentorder" ? styles.active : ""}
              onClick={() => setCurrentPage("sentorder")}
            >
              Sent Order
            </button>
              <button
                className={
                  currentPage === "drivermanageorder" ? styles.active : ""
                }
                onClick={() => setCurrentPage("drivermanageorder")}
              >
                Manage Order
              </button>
            </div>

            {/* Hiển thị component tương ứng */}
            {currentPage === "sentorder" && <DriverSentOrder />}
            {currentPage === "drivermanageorder" && <DriverManageOrderSent />}
          </div>
        </div>

        <div className={styles.map}>
          <MapContainer
            center={[10.7336, 106.6989]}
            zoom={13}
            style={{ height: "650px", width: "500px" }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default ManageDriveSentPage;
