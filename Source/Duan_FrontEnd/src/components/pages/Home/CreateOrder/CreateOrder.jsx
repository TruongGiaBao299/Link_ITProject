import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./CreateOrder.module.css";
import { createOrderApi } from "../../../../utils/orderAPI/orderAPI";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";
import LoadingSpinner from "../../../../containers/LoadingSpinner/LoadingSpinner";
import { IoIosClose } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [locationCity, setLocationCity] = useState([]); // Store list of city names
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      senderName: formData.get("senderName"),
      senderNumber: formData.get("senderNumber"),
      fromAddress: formData.get("fromAddress"),
      fromDistrict: formData.get("fromDistrict"),
      fromWard: formData.get("fromWard"),
      fromCity: formData.get("fromCity"),
      recipientName: formData.get("recipientName"),
      recipientNumber: formData.get("recipientNumber"),
      toAddress: formData.get("toAddress"),
      toDistrict: formData.get("toDistrict"),
      toWard: formData.get("toWard"),
      toCity: formData.get("toCity"),
      orderWeight: formData.get("orderWeight"),
      orderSize: formData.get("orderSize"),
      type: formData.get("type"),
      message: formData.get("message"),
    };

    try {
      const res = await createOrderApi(
        data.senderName,
        data.senderNumber,
        data.fromAddress,
        data.fromDistrict,
        data.fromWard,
        data.fromCity,
        data.recipientName,
        data.recipientNumber,
        data.toAddress,
        data.toDistrict,
        data.toWard,
        data.toCity,
        data.orderWeight,
        data.orderSize,
        data.type,
        data.message
      );

      console.log("Order Created: ", res);

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("Order created successfully!");
        form.reset(); // Reset form input
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("You need to login to fill out the form");
      navigate("/login");
    }
  };

  // useEffect(() => {
  //   if (isPopupOpen) {
  //     document.body.style.overflow = "hidden"; // Disable scrolling
  //   } else {
  //     document.body.style.overflow = "auto"; // Enable scrolling
  //   }
  // }, [isPopupOpen]);

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <>
      {/* <button
        className={styles.ToggleButton}
        onClick={() => setIsPopupOpen(!isPopupOpen)}
      >
        📦
      </button> */}

      {/* {isPopupOpen && (
        
      )} */}

      <div className={styles.CreateOrderContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.FormContainer}>
            <div className={styles.FormTopContainer}>
              <div className={styles.FormLeftContainer}>
                <p>1. Sender Infomation</p>
                <div className={styles.CreateOrderInput}>
                  <input
                    placeholder="Sender Name"
                    type="text"
                    id="senderName"
                    name="senderName"
                    required
                  />
                </div>

                <div className={styles.CreateOrderInput}>
                  <input
                    placeholder="Sender Number"
                    type="text"
                    id="senderNumber"
                    name="senderNumber"
                    required
                  />
                </div>

                {/* From City */}
                <div className={styles.CreateOrderInput}>
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
                <div className={styles.CreateOrderInput}>
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
                <div className={styles.CreateOrderInput}>
                  <select id="fromWard" name="fromWard" required>
                    <option value="">Select From Ward</option>
                    {locationWardFrom.map((ward, index) => (
                      <option key={index} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.CreateOrderInput}>
                  <input
                    placeholder="From Address"
                    type="text"
                    id="fromAddress"
                    name="fromAddress"
                    required
                  />
                </div>
              </div>

              <div className={styles.FormRightContainer}>
                <p>2. Recipient Infomation</p>
                <div className={styles.CreateOrderInput}>
                  <input
                    placeholder="Recipient Name"
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    required
                  />
                </div>

                <div className={styles.CreateOrderInput}>
                  <input
                    placeholder="Recipient Number"
                    type="text"
                    id="recipientNumber"
                    name="recipientNumber"
                    required
                  />
                </div>

                {/* To City */}
                <div className={styles.CreateOrderInput}>
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
                <div className={styles.CreateOrderInput}>
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
                <div className={styles.CreateOrderInput}>
                  <select id="toWard" name="toWard" required>
                    <option value="">Select To Ward</option>
                    {locationWardTo.map((ward, index) => (
                      <option key={index} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.CreateOrderInput}>
                  <input
                    placeholder="To Address"
                    type="text"
                    id="toAddress"
                    name="toAddress"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.FormBotContainer}>
              <div className={styles.CreateOrderInputBot}>
                <input
                  placeholder="Order Weight"
                  type="number"
                  id="orderWeight"
                  name="orderWeight"
                  required
                />
              </div>

              <div className={styles.CreateOrderInputBot}>
                <input
                  placeholder="Order Size"
                  type="number"
                  id="orderSize"
                  name="orderSize"
                  required
                />
              </div>

              <div className={styles.CreateOrderInputBot}>
                <input
                  placeholder="Type"
                  type="text"
                  id="type"
                  name="type"
                  required
                />
              </div>
            </div>

            <div className={styles.CreateOrderInput}>
              <textarea
                placeholder="Message"
                type="text"
                id="message"
                name="message"
                required
              />
            </div>
          </div>

          <div className={styles.CreateOrderGroup}>
            <div className={styles.CreateOrderCancel}>
              <button>Cancel</button>
            </div>
            <div className={styles.CreateOrderSubmit}>
              <button type="submit">Add</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateOrder;
