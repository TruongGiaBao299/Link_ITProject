import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth.context";
import {
  createPostOfficeApi,
  getPostOfficeApi,
} from "../../../../utils/postOfficeAPI/postOfficeAPI";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";
import styles from "./BecomePostOffice.module.css";
import LoadingSpinner from "../../../../containers/LoadingSpinner/LoadingSpinner";
import stmImage from "../../../../../public/6.jpg";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Make sure to import the Leaflet styles

const BecomePostOffice = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [postOfficeData, setPostOfficeData] = useState([]);
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

  // Update districts for "From"
  useEffect(() => {
    if (selectedFromCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      setLocationDistrictFrom(selectedCity ? selectedCity.districts : []);
      setSelectedFromDistrict(""); // Reset district when city changes
      setLocationWardFrom([]); // Reset wards when city changes
    }
  }, [selectedFromCity]);

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

  // Update districts for "To"
  useEffect(() => {
    if (selectedToCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      setLocationDistrictTo(selectedCity ? selectedCity.districts : []);
      setSelectedToDistrict(""); // Reset district when city changes
      setLocationWardTo([]); // Reset wards when city changes
    }
  }, [selectedToCity]);

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
    const fetchPostOffices = async () => {
      try {
        setLoading(true);
        const PostRes = await getPostOfficeApi();
        console.log("PostOffice:", PostRes);

        if (PostRes) {
          setPostOfficeData(PostRes); // Lưu dữ liệu nhận được
        } else {
          setPostOfficeData([]); // Nếu không có dữ liệu, set dữ liệu rỗng
        }

        // Kiểm tra xem email của người dùng đã có trong danh sách postoffice chưa
        const isAlreadyPost = PostRes.some(
          (post) => post.email === auth.user.email
        );
        setIsAlreadySubmitted(isAlreadyPost); // Cập nhật trạng thái
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error(
          "Lấy dữ liệu văn phòng bưu điện thất bại. Vui lòng thử lại!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPostOffices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      OfficeUserName: formData.get("OfficeUserName"),
      OfficeUserId: formData.get("OfficeUserId"),
      OfficeUserNumber: formData.get("OfficeUserNumber"),
      OfficeUserAddress: formData.get("OfficeUserAddress"),
      OfficeName: formData.get("OfficeName"),
      OfficeHotline: formData.get("OfficeHotline"),
      OfficeAddress: formData.get("OfficeAddress"),
      OfficeDistrict: formData.get("OfficeDistrict"),
      OfficeWard: formData.get("OfficeWard"),
      OfficeCity: formData.get("OfficeCity"),
    };

    // Log dữ liệu trước khi gửi
    console.log("Data to send:", data);

    try {
      const res = await createPostOfficeApi(
        data.OfficeUserName,
        data.OfficeUserId,
        data.OfficeUserNumber,
        data.OfficeUserAddress,
        data.OfficeName,
        data.OfficeHotline,
        data.OfficeAddress,
        data.OfficeDistrict,
        data.OfficeWard,
        data.OfficeCity
      );

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("PostOffice request sent!");
        form.reset(); // Xóa dữ liệu form sau khi submit
        setIsAlreadySubmitted(true); // Cập nhật trạng thái
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("You need to log in to fill out the form");
      navigate("/login");
    }
  };

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
            <div className={styles.formContent}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                  <div className={styles.postInfo}>
                    <div className={styles.titlegroup}>
                      <h1 className={styles.title}>Business information</h1>
                      <h1 className={styles.subtitle}>
                        Enter your business information manually
                      </h1>
                    </div>
                    <div className={styles.postInput}>
                      <p>1. Post Office User Name:</p>
                      <input
                        placeholder="OfficeUserName"
                        type="text"
                        id="OfficeUserName"
                        name="OfficeUserName"
                        required
                      />
                    </div>

                    <div className={styles.PhoneId}>
                      <div className={styles.PhoneIdInput}>
                        <p>2. Post Office User ID:</p>
                        <input
                          placeholder="OfficeUserId"
                          type="text"
                          id="OfficeUserId"
                          name="OfficeUserId"
                          required
                        />
                      </div>

                      <div className={styles.PhoneIdInput}>
                        <p>3. Post Office User Phone Number:</p>
                        <input
                          placeholder="OfficeUserNumber"
                          type="text"
                          id="OfficeUserNumber"
                          name="OfficeUserNumber"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.postInput}>
                      <p>4. Post Office User Address:</p>
                      <input
                        placeholder="OfficeUserAddress"
                        type="text"
                        id="OfficeUserAddress"
                        name="OfficeUserAddress"
                        required
                      />
                    </div>

                    <div className={styles.NameHotline}>
                      <div className={styles.NameHotlineInput}>
                        <p>5. Post Office Name:</p>
                        <input
                          placeholder="OfficeName"
                          type="text"
                          id="OfficeName"
                          name="OfficeName"
                          required
                        />
                      </div>

                      <div className={styles.NameHotlineInput}>
                        <p>6. Post Office Hotline:</p>
                        <input
                          placeholder="OfficeHotline"
                          type="text"
                          id="OfficeHotline"
                          name="OfficeHotline"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.postInput}>
                      <p>7. Post Office Address:</p>
                      <input
                        placeholder="OfficeAddress"
                        type="text"
                        id="OfficeAddress"
                        name="OfficeAddress"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.postInfoAddress}>
                    {/* From City */}
                    <div className={styles.postInput}>
                      <select
                        id="OfficeCity"
                        name="OfficeCity"
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
                    <div className={styles.postInput}>
                      <select
                        id="OfficeDistrict"
                        name="OfficeDistrict"
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
                    <div className={styles.postInput}>
                      <select id="OfficeWard" name="OfficeWard" required>
                        <option value="">Select Ward</option>
                        {locationWardFrom.map((ward, index) => (
                          <option key={index} value={ward.name}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nút Submit */}
                  <div className={styles.postSubmit}>
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </form>
              <div className={styles.mapContainer}>
                <MapContainer
                  center={[10.733605966511371, 106.69892820061779]}
                  zoom={13}
                  style={{ height: "700px", width: "600px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </MapContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BecomePostOffice;
