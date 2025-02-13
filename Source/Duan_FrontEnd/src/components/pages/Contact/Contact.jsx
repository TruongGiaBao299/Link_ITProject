import React, { useEffect } from "react";
import styles from "./Contact.module.css";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icon issue in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const Contact = () => {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  const position = [10.732100048248101, 106.69930960985738]; // Tọa độ của BaShip

  return (
    <>
      <Header />
      <div className={styles.contactContainer}>
        <div className={styles.formSection}>
          <h2>
            Fill in the registration form below, BaShip will contact you to
            schedule a demo session soon.
          </h2>
          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message">Note</label>
              <textarea id="message" name="message" required></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              Get advice now!
            </button>
          </form>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.companyInfo}>
            <h2>BaShip offers the optimal solution for your order</h2>
            <p>Email: SupportBaShip@gmail.com</p>
            <p>Hotline: 086868686</p>
            <p>19 Nguyen Huu Tho, Tan Hung, District 7, Ho Chi Minh City</p>
            <div className={styles.mapContainer}>
              <MapContainer center={position} zoom={15} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                  <Popup>BaShip - 19 Nguyen Huu Tho, District 7, Ho Chi Minh City</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
