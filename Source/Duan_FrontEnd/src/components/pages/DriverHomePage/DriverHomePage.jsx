import React, { useState } from "react";
import DriverGetOrder from "../../../containers/DriverGetOrder/DriverGetOrder";
import DriverMangeOrder from "../../../containers/DriverManageOrder/DriverMangeOrder";
import DriverSentOrder from "../../../containers/DriverSentOrder/DriverSentOrder";
import HeaderDriver from "../../layout/HeaderDriver/HeaderDriver";
import styles from "./DriverHomePage.module.css";
import HeroSection from "../../../containers/HeroSection/HeroSection";
import About from "../../../containers/About";
import Footer from "../../layout/Footer/Footer";
import FindOrder from "../Home/FindOrder/FindOrder";

const DriverHomePage = () => {
  const [currentPage, setCurrentPage] = useState("drivergetorder");

  return (
    <>
      <HeaderDriver />
      <HeroSection></HeroSection>
      <FindOrder></FindOrder>
      {/* <CreateOrder></CreateOrder> */}
      {/* <div className={styles.group}>
        <PostOffice></PostOffice>
        <SearchPrice></SearchPrice>
      </div> */}
      <About></About>
      <Footer></Footer>
    </>
  );
};

export default DriverHomePage;

// <div className={styles.mainContent}>
//         <div className={styles.container}>
//           <div className={styles.listbutton}>
//             <button
//               className={currentPage === "drivergetorder" ? styles.active : ""}
//               onClick={() => setCurrentPage("drivergetorder")}
//             >
//               Get Order
//             </button>
//             <button
//               className={currentPage === "sentorder" ? styles.active : ""}
//               onClick={() => setCurrentPage("sentorder")}
//             >
//               Sent Order
//             </button>
//             <button
//               className={currentPage === "drivermanageorder" ? styles.active : ""}
//               onClick={() => setCurrentPage("drivermanageorder")}
//             >
//               Manage Order
//             </button>
//           </div>

//           {/* Hiển thị component tương ứng */}
//           {currentPage === "drivergetorder" && <DriverGetOrder />}
//           {currentPage === "sentorder" && <DriverSentOrder />}
//           {currentPage === "drivermanageorder" && <DriverMangeOrder />}
//         </div>
//       </div>
