import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "./utils/userAPI/axiosUser";
import { useContext, useEffect, useState } from "react";
import Home from "./components/pages/Home/Home";
import Register from "./components/pages/Register/Register";
import Contact from "./components/pages/Contact/Contact";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./components/pages/Login/Login";
import { AuthContext, AuthWarrper } from "./context/auth.context";
import Admin from "./components/pages/Admin/Admin";
import DashboardPage from "./components/pages/DashboardPage/DashboardPage";
import OrdersPage from "./components/pages/OrdersPage/OrdersPage";
import ShipmentsPage from "./components/pages/ShipmentsPage/ShipmentsPage";
import UserPage from "./components/pages/UserPage/UserPage";
import ViewOrderPage from "./components/pages/ViewOrderPage/ViewOrderPage";
import DriverPage from "./components/pages/DriverPage/DriverPage";
import PostOfficePage from "./components/pages/PostOfficePage/PostOfficePage";
import DriverHomePage from "./components/pages/DriverHomePage/DriverHomePage";
import ViewHistoryPage from "./components/pages/ViewHistoryPage/ViewHistoryPage";
import PostOfficeHomePage from "./components/pages/PostOfficeHomePage/PostOfficeHomePage";
import UpdatePassword from "./containers/UpdatePassword/UpdatePassword";
import ServicePage from "./components/pages/ServicePage/ServicePage";
import BecomeDriverPage from "./components/pages/BecomeDriverPage/BecomeDriverPage";
import BecomePostOfficePage from "./components/pages/BecomePostOfficePage/BecomePostOfficePage";
import CreateOrderUserPage from "./components/pages/UserPageGroup/CreateOrderUserPage/CreateOrderUserPage";
import DriverGuestPage from "./components/pages/UserPageGroup/DriverGuestPage/DriverGuestPage";
import ShipmentGuestPage from "./components/pages/UserPageGroup/ShipmentGuestPage/ShipmentGuestPage";
import HistoryGuestPage from "./components/pages/UserPageGroup/HistoryGuestPage/HistoryGuestPage";
import OrderGuestPage from "./components/pages/UserPageGroup/OrderGuestPage/OrderGuestPage";
import PostOfficeGuestPage from "./components/pages/UserPageGroup/PostOfficeGuestPage/PostOfficeGuestPage";
import GuestDashboardPage from "./components/pages/UserPageGroup/GuestDashboardPage/GuestDashboardPage";
import PostOfficeDashboardPage from "./components/pages/PostOfficePageGroup/PostOfficeDashboardPage/PostOfficeDashboardPage";
import PostOfficeShipmentsPage from "./components/pages/PostOfficePageGroup/PostOfficeShipmentsPage/PostOfficeShipmentsPage";
import PostOfficeOrderPage from "./components/pages/PostOfficePageGroup/PostOfficeOrderPage/PostOfficeOrderPage";
import PostOfficeCreateOrderPage from "./components/pages/PostOfficePageGroup/PostOfficeCreateOrderPage/PostOfficeCreateOrderPage";
import PostOfficeSendOrder from "./components/pages/PostOfficePageGroup/PostOfficeSendOrderPage/PostOfficeSendOrderPage";
import PostOfficeSendOrderPage from "./components/pages/PostOfficePageGroup/PostOfficeSendOrderPage/PostOfficeSendOrderPage";
import PostOfficeManagePage from "./components/pages/PostOfficePageGroup/PostOfficeManagePage/PostOfficeManagePage";
import PostOfficeDriverPage from "./components/pages/PostOfficePageGroup/PostOfficeDriverPage/PostOfficeDriverPage";
import PostOfficeInfoPage from "./components/pages/PostOfficePageGroup/PostOfficeInfoPage/PostOfficeInfoPage";
import ServiceDriverPage from "./components/pages/ServiceDriverPage/ServiceDriverPage";
import ContactDriver from "./components/pages/ContactDriver/ContactDriver";
import ManageDrivePage from "./components/pages/ManageDrivePage/ManageDrivePage";
import ManageDriveSentPage from "./components/pages/ManageDriveSentPage/ManageDriveSentPage";
import ManageHistoryDrivePage from "./components/pages/ManageHistoryDrivePage/ManageHistoryDrivePage";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
  useEffect(() => {
    const fetchAccount = async () => {

      setAppLoading(true);

      const res = await axios.get(`/user/account`);
      if (res) {
        setAuth({
          isAuthenthicate: true,
          user: {
            email: res.email,
            name: res.name,
            role: res.role,
          },
        });
      }
      setAppLoading(false);
      console.log("check res:", res);
    };
    fetchAccount();
  }, []);

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="/user" element={<UserPage></UserPage>}></Route>
            <Route path="/contact" element={<Contact></Contact>}></Route>
            <Route path="/contactdriver" element={<ContactDriver></ContactDriver>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/admin" element={<Admin></Admin>}></Route>
            <Route path="/dashboard" element={<DashboardPage></DashboardPage>}></Route>
            <Route path="/orders" element={<OrdersPage></OrdersPage>}></Route>
            <Route path="/shipments" element={<ShipmentsPage></ShipmentsPage>}></Route>
            <Route path="/vieworder" element={<ViewOrderPage></ViewOrderPage>}></Route>
            <Route path="/viewhistory" element={<ViewHistoryPage></ViewHistoryPage>}></Route>
            <Route path="/driver" element={<DriverPage></DriverPage>}></Route>
            <Route path="/postoffice" element={<PostOfficePage></PostOfficePage>}></Route>
            <Route path="/driverhome" element={<DriverHomePage></DriverHomePage>}></Route>
            <Route path="/postofficehome" element={<PostOfficeDashboardPage></PostOfficeDashboardPage>}></Route>
            <Route path="/updatepassword" element={<UpdatePassword></UpdatePassword>}></Route>
            <Route path="/service" element={<ServicePage></ServicePage>}></Route>
            <Route path="/servicedriver" element={<ServiceDriverPage></ServiceDriverPage>}></Route>
            <Route path="/becomedriver" element={<BecomeDriverPage></BecomeDriverPage>}></Route>
            <Route path="/becomepostoffice" element={<BecomePostOfficePage></BecomePostOfficePage>}></Route>
            <Route path="/guesthome" element={<GuestDashboardPage></GuestDashboardPage>}></Route>
            <Route path="/guestpostoffice" element={<PostOfficeGuestPage></PostOfficeGuestPage>}></Route>
            <Route path="/guestorder" element={<OrderGuestPage></OrderGuestPage>}></Route>
            <Route path="/guesthistory" element={<HistoryGuestPage></HistoryGuestPage>}></Route>
            <Route path="/guestdriver" element={<DriverGuestPage></DriverGuestPage>}></Route>
            <Route path="/guestshipment" element={<ShipmentGuestPage></ShipmentGuestPage>}></Route>
            <Route path="/guestdriver" element={<DriverGuestPage></DriverGuestPage>}></Route>
            <Route path="/guestcreateorder" element={<CreateOrderUserPage></CreateOrderUserPage>}></Route>
            <Route path="/postofficeshipment" element={<PostOfficeShipmentsPage></PostOfficeShipmentsPage>}></Route>
            <Route path="/postofficeorder" element={<PostOfficeOrderPage></PostOfficeOrderPage>}></Route>
            <Route path="/postofficecreateorder" element={<PostOfficeCreateOrderPage></PostOfficeCreateOrderPage>}></Route>
            <Route path="/postofficesendorder" element={<PostOfficeSendOrderPage></PostOfficeSendOrderPage>}></Route>
            <Route path="/postofficemanage" element={<PostOfficeManagePage></PostOfficeManagePage>}></Route>
            <Route path="/postofficedriver" element={<PostOfficeDriverPage></PostOfficeDriverPage>}></Route>
            <Route path="/postofficeinfo" element={<PostOfficeInfoPage></PostOfficeInfoPage>}></Route>
            <Route path="/managedriver" element={<ManageDrivePage></ManageDrivePage>}></Route>
            <Route path="/managesentdriver" element={<ManageDriveSentPage></ManageDriveSentPage>}></Route>
            <Route path="/managehistorydriver" element={<ManageHistoryDrivePage></ManageHistoryDrivePage>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
