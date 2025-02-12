import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth.context";
import {
  createDriverApi,
  getDriverApi,
} from "../../../../utils/driverAPI/driverAPI";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";
import { getPostOfficeApi } from "../../../../utils/postOfficeAPI/postOfficeAPI";
import styles from "./BecomeDriver.module.css";
import LoadingSpinner from "../../../../containers/LoadingSpinner/LoadingSpinner";
import stmImage from "../../../../../public/5.jpg";

const BecomeDriver = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false); // Trạng thái nếu đã nộp

  const [location, setLocation] = useState([]);
  const [locationCity, setLocationCity] = useState([]); // Store list of city names

  // Separate states for From and To dropdowns
  const [locationDistrictFrom, setLocationDistrictFrom] = useState([]);
  const [locationWardFrom, setLocationWardFrom] = useState([]);
  const [locationDistrictTo, setLocationDistrictTo] = useState([]);
  const [locationWardTo, setLocationWardTo] = useState([]);

  const [selectedFromCity, setSelectedFromCity] = useState(""); // Selected city for From
  const [selectedToCity, setSelectedToCity] = useState(""); // Selected city for To
  const [selectedFromDistrict, setSelectedFromDistrict] = useState(""); // Selected district for From
  const [selectedToDistrict, setSelectedToDistrict] = useState(""); // Selected district for To

  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const [emails, setEmails] = useState({}); // Lưu giá trị email cho từng đơn hàng
  const [post, setPost] = useState({}); // Lưu giá trị email cho từng đơn hàng
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await getLocationAPI();
        console.log("Location:", res);

        const LocationCity = res.map((location) => location.name);
        console.log("LocationCity:", LocationCity);

        if (res) {
          setLocation(res); // Save the received data
          setLocationCity(LocationCity); // Save list of city names
        } else {
          setLocation([]); // If no data, set empty
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch location data. Please try again!");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi();
        console.log("PostOffice:", res);
        if (res) {
          setData(res); // Lưu dữ liệu email bưu cục từ API
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch post office data. Please try again!");
      }
    };
    fetchPostOffices();
  }, []);

  // Update districts for "From"
  useEffect(() => {
    if (selectedFromCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      setLocationDistrictFrom(selectedCity ? selectedCity.districts : []);
    }
  }, [selectedFromCity]);

  // Update districts for "To"
  useEffect(() => {
    if (selectedToCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      setLocationDistrictTo(selectedCity ? selectedCity.districts : []);
    }
  }, [selectedToCity]);

  // Update wards for "From"
  useEffect(() => {
    if (selectedFromDistrict) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      const selectedDistrict = selectedCity?.districts.find(
        (district) => district.name === selectedFromDistrict
      );
      setLocationWardFrom(selectedDistrict ? selectedDistrict.wards : []);
    }
  }, [selectedFromDistrict, selectedFromCity]);

  // Update wards for "To"
  useEffect(() => {
    if (selectedToDistrict) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      const selectedDistrict = selectedCity?.districts.find(
        (district) => district.name === selectedToDistrict
      );
      setLocationWardTo(selectedDistrict ? selectedDistrict.wards : []);
    }
  }, [selectedToDistrict, selectedToCity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const driverRes = await getDriverApi();

        // Kiểm tra xem email của người dùng đã có trong danh sách driver chưa
        const isAlreadyDriver = driverRes.some(
          (driver) => driver.email === auth.user.email
        );
        setIsAlreadySubmitted(isAlreadyDriver); // Cập nhật trạng thái
        setDriverData(driverRes || []);
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.user.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      DriverName: formData.get("driverName"),
      DriverNumber: formData.get("driverNumber"),
      DriverBirth: formData.get("driverBirth"),
      DriverId: formData.get("driverId"),
      DriverAddress: formData.get("driverAddress"),
      DriverDistrict: formData.get("driverDistrict"),
      DriverWard: formData.get("driverWard"),
      DriverCity: formData.get("driverCity"),
      postOffice: formData.get("postOffice"),
    };

    try {
      const res = await createDriverApi(
        data.DriverName,
        data.DriverNumber,
        data.DriverBirth,
        data.DriverId,
        data.DriverAddress,
        data.DriverDistrict,
        data.DriverWard,
        data.DriverCity,
        data.postOffice
      );

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("Driver request sent!");
        form.reset(); // Xóa dữ liệu form sau khi submit
        setIsAlreadySubmitted(true); // Cập nhật trạng thái
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("You need to log in to fill out the form");
      navigate("/login");
    }
  };

  const [filteredPostOffices, setFilteredPostOffices] = useState([]);

  useEffect(() => {
    if (selectedFromCity) {
      const filtered = data.filter(
        (postOffice) => postOffice.OfficeCity === selectedFromCity
      );
      setFilteredPostOffices(filtered);
    } else {
      setFilteredPostOffices([]);
    }
  }, [selectedFromCity, data]);

  {
    isLoading && <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {loading ? (
          <LoadingSpinner />
        ) : isAlreadySubmitted ? ( // Kiểm tra nếu đã nộp
          <p className={styles.alert}>
            Your request has been sent, please wait for us to review.
          </p>
        ) : (
          <>
            <div className={styles.containerform}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                  <h3 className={styles.title}>
                    Register to become a BaShip driver
                  </h3>
                  <div className={styles.label}>
                    <label htmlFor="">1. Personal information</label>
                  </div>

                  <div className={styles.personalInfo}>
                    <div className={styles.personalInfoInput}>
                      <input
                        placeholder="Enter your fullnam"
                        type="text"
                        id="driverName"
                        name="driverName"
                        required
                      />
                    </div>

                    <div className={styles.personalInfoInput}>
                      <input
                        placeholder="Enter your phone number"
                        type="text"
                        id="driverNumber"
                        name="driverNumber"
                        required
                      />
                    </div>

                    <div className={styles.personalInfoInput}>
                      <input
                        placeholder="Enter your date of birth"
                        type="text"
                        id="driverBirth"
                        name="driverBirth"
                        required
                      />
                    </div>

                    <div className={styles.personalInfoInput}>
                      <input
                        placeholder="Enter your id or passboard code"
                        type="text"
                        id="driverId"
                        name="driverId"
                        required
                      />
                    </div>

                    <div className={styles.personalInfoInput}>
                      <input
                        placeholder="Enter your address"
                        type="text"
                        id="driverAddress"
                        name="driverAddress"
                        required
                      />
                    </div>

                    <div className={styles.personalInfoAddress}>
                      {/* From City */}
                      <div className={styles.personalInfoInput}>
                        <select
                          id="driverCity"
                          name="driverCity"
                          required
                          value={selectedFromCity}
                          onChange={(e) => setSelectedFromCity(e.target.value)}
                        >
                          <option value="">Select City</option>
                          {locationCity.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* From District */}
                      <div className={styles.personalInfoInput}>
                        <select
                          id="driverDistrict"
                          name="driverDistrict"
                          required
                          value={selectedFromDistrict}
                          onChange={(e) =>
                            setSelectedFromDistrict(e.target.value)
                          }
                        >
                          <option value="">Select District</option>
                          {locationDistrictFrom.map((district, index) => (
                            <option key={index} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* From Ward */}
                      <div className={styles.personalInfoInput}>
                        <select id="driverWard" name="driverWard" required>
                          <option value="">Select Ward</option>
                          {locationWardFrom.map((ward, index) => (
                            <option key={index} value={ward.name}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.label}>
                    <label htmlFor="">2. Choose your Post Office</label>
                  </div>

                  <div className={styles.personalInfoSelect}>
                    <select id="postOffice" name="postOffice" required>
                      <option value="">Select Post Office</option>
                      {filteredPostOffices.map((postOffice, index) => (
                        <option key={index} value={postOffice.email}>
                          {postOffice.OfficeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nút Submit */}
                  <div className={styles.personalInfoSubmit}>
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </form>

              {!loading && (
                <div className={styles.img}>
                  <img
                    src={stmImage}
                    alt="STM intro"
                    className={styles.image}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Hiển thị hình ảnh chỉ khi loading là false */}
    </div>
  );
};

export default BecomeDriver;
