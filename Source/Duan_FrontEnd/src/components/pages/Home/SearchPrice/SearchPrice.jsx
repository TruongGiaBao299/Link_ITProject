import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./SearchPrice.module.css";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";
import { SearchPriceApi } from "../../../../utils/orderAPI/orderAPI";
import LoadingSpinner from "../../../../containers/LoadingSpinner/LoadingSpinner";
import stmImage from "../../../../../public/7.jpg";
import { FaArrowRight } from "react-icons/fa";

const SearchPrice = () => {
  const [orderInfo, setOrderInfo] = useState(null); // Store order information
  const navigate = useNavigate();
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
  const [showPopup, setShowPopup] = useState(false);

  // Fetch location data on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await getLocationAPI();
        const LocationCity = res.map((location) => location.name);

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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading
    const form = event.currentTarget; // Get form element
    const formData = new FormData(form);

    const data = {
      fromAddress: formData.get("fromAddress"),
      fromDistrict: formData.get("fromDistrict"),
      fromWard: formData.get("fromWard"),
      fromCity: formData.get("fromCity"),
      toAddress: formData.get("toAddress"),
      toDistrict: formData.get("toDistrict"),
      toWard: formData.get("toWard"),
      toCity: formData.get("toCity"),
      orderWeight: formData.get("orderWeight"),
      orderSize: formData.get("orderSize"),
      type: formData.get("type"),
    };

    try {
      setIsLoading(true); // Set loading to true when API is called
      const res = await SearchPriceApi(
        data.fromAddress,
        data.fromDistrict,
        data.fromWard,
        data.fromCity,
        data.toAddress,
        data.toDistrict,
        data.toWard,
        data.toCity,
        data.orderWeight,
        data.orderSize,
        data.type
      ); // Call the API with the form data

      console.log(res);

      if (res) {
        setOrderInfo(res);
        setShowPopup(true);

        toast.success("Order details retrieved successfully!");
      } else {
        toast.error("No order information found.");
        setOrderInfo(null); // Set to null if no data is found
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to retrieve order details. Please try again.");
      setOrderInfo(null); // Set to null in case of an error
    } finally {
      setIsLoading(false); // Mark loading as false once the API response is processed
    }
  };

  {
    isLoading && <LoadingSpinner />;
  }

  return (
      <div className={styles.formContent}>
        <form onSubmit={handleSubmit}>
          <div className={styles.Content}>
            <div className={styles.TopContainer}>
              {/* From City */}
              <div className={styles.TopLeftContainer}>
                <label className={styles.Label}>Sent from:</label>
                <div className={styles.SearchPriceInput}>
                  <input
                    placeholder="From Address"
                    type="text"
                    id="fromAddress"
                    name="fromAddress"
                    required
                  />
                </div>
                <div className={styles.SearchPriceInput}>
                  <select
                    id="fromCity"
                    name="fromCity"
                    required
                    value={selectedFromCity}
                    onChange={(e) => setSelectedFromCity(e.target.value)}
                  >
                    <option value="">Select From City</option>
                    {locationCity.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From District */}
                <div className={styles.SearchPriceInput}>
                  <select
                    id="fromDistrict"
                    name="fromDistrict"
                    required
                    value={selectedFromDistrict}
                    onChange={(e) => setSelectedFromDistrict(e.target.value)}
                  >
                    <option value="">Select From District</option>
                    {locationDistrictFrom.map((district, index) => (
                      <option key={index} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From Ward */}
                <div className={styles.SearchPriceInput}>
                  <select id="fromWard" name="fromWard" required>
                    <option value="">Select From Ward</option>
                    {locationWardFrom.map((ward, index) => (
                      <option key={index} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* To City */}
              <div className={styles.TopRightContainer}>
                <label className={styles.Label}>Get from:</label>
                <div className={styles.SearchPriceInput}>
                  <input
                    placeholder="To Address"
                    type="text"
                    id="toAddress"
                    name="toAddress"
                    required
                  />
                </div>
                <div className={styles.SearchPriceInput}>
                  <select
                    id="toCity"
                    name="toCity"
                    required
                    value={selectedToCity}
                    onChange={(e) => setSelectedToCity(e.target.value)}
                  >
                    <option value="">Select To City</option>
                    {locationCity.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To District */}
                <div className={styles.SearchPriceInput}>
                  <select
                    id="toDistrict"
                    name="toDistrict"
                    required
                    value={selectedToDistrict}
                    onChange={(e) => setSelectedToDistrict(e.target.value)}
                  >
                    <option value="">Select To District</option>
                    {locationDistrictTo.map((district, index) => (
                      <option key={index} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Ward */}
                <div className={styles.SearchPriceInput}>
                  <select id="toWard" name="toWard" required>
                    <option value="">Select To Ward</option>
                    {locationWardTo.map((ward, index) => (
                      <option key={index} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.BotContainer}>
              <div className={styles.SearchPriceInputBot}>
                <input
                  type="number"
                  id="orderWeight"
                  name="orderWeight"
                  step="0.1"
                  required
                  placeholder="Order Weight"
                />
              </div>

              <div className={styles.SearchPriceInputBot}>
                <input
                  type="number"
                  id="orderSize"
                  name="orderSize"
                  step="0.01"
                  required
                  placeholder="Order Size"
                />
              </div>

              <div className={styles.SearchPriceInputBot}>
                <input
                  type="text"
                  id="type"
                  name="type"
                  placeholder="Type"
                  required
                />
              </div>
            </div>

            <div className={styles.SearchPriceSubmit}>
              <button type="submit" disabled={isLoading}>
                Submit
              </button>
              <FaArrowRight />
            </div>
          </div>
        </form>

        {/* Display order info */}
        {showPopup && orderInfo ? (
          <div
            className={styles.popupOverlay}
            onClick={() => setShowPopup(false)}
          >
            <div
              className={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={() => setShowPopup(false)}
              >
                x
              </button>
              <h2>Order Information</h2>
              <p>
                <strong>Distance:</strong> {orderInfo.distance || "N/A"} km
              </p>
              <p>
                <strong>Price:</strong> {orderInfo.price || "N/A"} VND
              </p>
              <p>
                <strong>Estimated Delivery Time:</strong>{" "}
                {orderInfo.estimatedDeliveryTime || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>
  );
};

export default SearchPrice;
