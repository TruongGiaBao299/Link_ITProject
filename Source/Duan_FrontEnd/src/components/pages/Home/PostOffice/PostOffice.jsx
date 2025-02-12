import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./PostOffice.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { getPostOfficeApi } from "../../../../utils/postOfficeAPI/postOfficeAPI";
import { getDistance } from "geolib";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";
import LoadingSpinner from "../../../../containers/LoadingSpinner/LoadingSpinner";

// Hook để cập nhật vị trí và zoom bản đồ
const MapViewUpdater = ({ latitude, longitude }) => {
  const map = useMap();
  if (latitude && longitude) {
    map.flyTo([latitude, longitude], 16);
  }
  return null;
};

const PostOffice = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]); // Dữ liệu sau khi sắp xếp
  const [clickedLocation, setClickedLocation] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null); // Tọa độ người dùng
  const [searchQuery, setSearchQuery] = useState(""); // Query tìm kiếm
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc theo tên
  const mapCenter = [10.789608489359983, 106.63981979487258]; // Tọa độ mặc định

  const [location, setLocation] = useState([]);
  const [locationCity, setLocationCity] = useState([]); // Store list of city names
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [selectedFromCity, setSelectedFromCity] = useState(""); // Selected city for From
  const [selectedFromDistrict, setSelectedFromDistrict] = useState(""); // Selected district for From
  const [locationDistrictFrom, setLocationDistrictFrom] = useState([]); // Quận từ thành phố đã chọn

  // lấy api thành phố
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

  // lấy api district
  useEffect(() => {
    if (selectedFromCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      setLocationDistrictFrom(selectedCity ? selectedCity.districts : []);
    }
  }, [selectedFromCity]);

  // Lấy tọa độ người dùng
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Lỗi lấy vị trí người dùng:", error);
        toast.error("Không thể lấy vị trí của bạn. Vui lòng kiểm tra cài đặt.");
      }
    );
  }, []);

  // Lấy danh sách bưu cục từ API
  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi();
        if (res) {
          setData(res); // Lưu dữ liệu
          console.log("Post: ", res);
        } else {
          setData([]); // Nếu không có dữ liệu, set dữ liệu rỗng
        }
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error(
          "Lấy dữ liệu văn phòng bưu điện thất bại. Vui lòng thử lại!"
        );
      }
    };
    fetchPostOffices();
  }, []);

  // Sắp xếp các bưu cục theo khoảng cách từ người dùng
  useEffect(() => {
    if (userCoordinates && data.length > 0) {
      const sorted = [...data]
        .filter((office) => office.status === "active") // Chỉ sắp xếp các bưu cục "active"
        .map((office) => ({
          ...office,
          distance: getDistance(userCoordinates, {
            latitude: office.OfficeLatitude,
            longitude: office.OfficeLongitude,
          }),
        }))
        .sort((a, b) => a.distance - b.distance); // Sắp xếp theo khoảng cách tăng dần

      setSortedData(sorted); // Cập nhật dữ liệu đã sắp xếp
      setFilteredData(sorted); // Đảm bảo rằng dữ liệu đã lọc theo khoảng cách
    }
  }, [userCoordinates, data]);

  // Lọc bưu cục theo thành phố, quận và tên
  useEffect(() => {
    let filtered = sortedData;

    // Lọc theo thành phố
    if (selectedFromCity) {
      filtered = filtered.filter(
        (office) => office.OfficeCity === selectedFromCity
      );
    }

    // Lọc theo quận
    if (selectedFromDistrict) {
      filtered = filtered.filter(
        (office) => office.OfficeDistrict === selectedFromDistrict
      );
    }

    // Lọc theo tên bưu cục
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((office) =>
        office.OfficeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
  }, [searchQuery, sortedData, selectedFromCity, selectedFromDistrict]);

  const handleDivClick = (latitude, longitude) => {
    setClickedLocation({ latitude, longitude });
  };

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <div className={styles.infocontainer}>
      {/* Thanh tìm kiếm */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find PostOffice..."
          className={styles.searchInput}
        />

        <div className={styles.filtergroup}>
          {/* From City */}
          <div className={styles.FindOrderInput}>
            <select
              id="fromCity"
              name="fromCity"
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
          <div className={styles.FindOrderInput}>
            <select
              id="fromDistrict"
              name="fromDistrict"
              required
              value={selectedFromDistrict}
              onChange={(e) => setSelectedFromDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {locationDistrictFrom.map((district, index) => (
                <option key={index} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={styles.mapContainer}>
        <div className={styles.map}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Cập nhật vị trí bản đồ khi người dùng click */}
            {clickedLocation && (
              <MapViewUpdater
                latitude={clickedLocation.latitude}
                longitude={clickedLocation.longitude}
              />
            )}

            {filteredData.map((office, index) => (
              <Marker
                key={index}
                position={[office.OfficeLatitude, office.OfficeLongitude]}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>
                        <FaHome /> {office.OfficeName}
                      </strong>
                    </p>
                    <p>
                      <FaLocationDot /> {office.OfficeAddress},{" "}
                      {office.OfficeWard}, {office.OfficeDistrict},{" "}
                      {office.OfficeCity}
                    </p>
                    <p>
                      <FaPhoneAlt /> {office.OfficeHotline}
                    </p>
                    <p>Khoảng cách: {(office.distance / 1000).toFixed(2)} km</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className={styles.infocontent}>
          {filteredData.length === 0 ? (
            <p>Không có bưu cục nào phù hợp với yêu cầu của bạn.</p>
          ) : (
            filteredData.map((office, index) => (
              <div
                className={styles.infobox}
                key={index}
                onClick={() =>
                  handleDivClick(office.OfficeLatitude, office.OfficeLongitude)
                }
              >
                <p>
                  <FaHome /> {office.OfficeName}
                </p>
                <p>
                  <FaPhoneAlt /> {office.OfficeHotline}
                </p>
                <p>
                  <FaLocationDot /> {office.OfficeAddress}, {office.OfficeWard},{" "}
                  {office.OfficeDistrict}, {office.OfficeCity}
                </p>
                {userCoordinates && (
                  <p>Distance: {(office.distance / 1000).toFixed(2)} km</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostOffice;
