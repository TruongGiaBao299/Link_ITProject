import React, { useState, useEffect } from "react";
import Header from "../../layout/Header/Header";
import CreateOrder from "./CreateOrder/CreateOrder";
import FindOrder from "./FindOrder/FindOrder";
import PostOffice from "./PostOffice/PostOffice";
import BecomeDriver from "./BecomeDriver/BecomeDriver";
import SearchPrice from "./SearchPrice/SearchPrice";
import BecomePostOffice from "./BecomePostOffice/BecomePostOffice";
import Footer from "../../layout/Footer/Footer";
import HeroSection from "../../../containers/HeroSection/HeroSection";
import About from "../../../containers/About";
import styles from "./Home.module.css";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("create"); // State to track current page
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in

  useEffect(() => {
    // Check for token in localStorage to determine if the user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if there's a token, otherwise false
  }, []);

  return (
    <>
      <Header />
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

export default Home;

