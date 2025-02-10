import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./TrackingFind.module.css";
import { MdOutlineDoubleArrow } from "react-icons/md";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {
  getOrderByEmailApi,
  getOrderByIdApi,
} from "../../utils/orderAPI/orderAPI";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TrackingFind = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [orders, setOrders] = useState([]); // All orders fetched from API
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      orderId: formData.get("orderId"),
    };

    try {
      const res = await getOrderByIdApi(data.orderId);
      if (res && res.data === null) {
        toast.error("Order not found");
        setOrderInfo(null);
      } else {
        setOrderInfo(res);
        toast.success("Order found successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
      toast.error("You need to login to find your order");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderByEmailApi();
        console.log("Order by email:", res);

        if (res && res.length > 0) {
          setOrders(res); // Store all orders
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.FindOrderContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.findtopcontent}>
          <div className={styles.findtitle}>Track your shipment</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.findOrderInputContainer}>
              <div className={styles.findOrderInput}>
                <input type="text" id="orderId" name="orderId" required />
              </div>
              <div className={styles.findOrderSubmit}>
                <button type="submit">Find</button>
              </div>
            </div>
          </form>
        </div>

        {isLoading && <LoadingSpinner />}

        <div className={styles.findbotcontent}>
          {!orderInfo ? (
            <div className={styles.emptyOrderBox}>
              <p>Chưa có thông tin đơn hàng</p>
            </div>
          ) : (
            <div className={styles.orderDetails}>
              <div className={styles.ordertitle}>
                <p>
                  <strong>Order ID:</strong> {orderInfo._id}
                </p>
                <p>
                  <strong>Status:</strong> {orderInfo.status}
                </p>
              </div>

              <div className={styles.orderaddress}>
                <div>
                  <p>
                    <strong>From Address:</strong> {orderInfo.fromAddress},{" "}
                    {orderInfo.fromDistrict}
                  </p>

                  {orderInfo.senderNumber}
                </div>
                <MdOutlineDoubleArrow className={styles.addressicon} />
                <div>
                  <p>
                    <strong>To Address:</strong> {orderInfo.toAddress},{" "}
                    {orderInfo.toDistrict}
                  </p>

                  {orderInfo.recipientNumber}
                </div>
              </div>

              <div className={styles.ordergroup}>
                <div className={styles.ordercontent}>
                  <p>
                    <strong>Price:</strong> {orderInfo.price}
                  </p>
                  <p>
                    <strong>Pick up time:</strong>{" "}
                    {new Date(orderInfo.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    <strong>Delivery Time:</strong>{" "}
                    {orderInfo.estimatedDeliveryTime}
                  </p>
                </div>

                {/* {orderInfo.timeline && orderInfo.timeline.length > 0 && (
                <div className={styles.timelinecontent}>
                  <h3>Order Timeline</h3>
                  <ul>
                    {orderInfo.timeline.map((entry) => (
                      <li key={entry._id}>
                        {new Date(
                          new Date(entry.timestamp).getTime() +
                            17 * 60 * 60 * 1000
                        ).toLocaleString()}
                        : <strong>{entry.status}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              </div>
            </div>
          )}
        </div>

        <div className={styles.map}>
          <MapContainer
            center={[10.7336, 106.6989]}
            zoom={13}
            style={{ height: "450px", width: "600px" }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.orderStats}>
          <div className={styles.statBox}>
            <p>
              <strong>Total Orders:</strong> {orders.length}
            </p>
          </div>
          <div className={styles.statBox}>
            <p>
              <strong>OnGoing Orders:</strong>{" "}
              {
                orders.filter(
                  (order) =>
                    order.status !== "shipped" && order.status !== "canceled"
                ).length
              }
            </p>
          </div>
          <div className={styles.statBox}>
            <p>
              <strong>Successfull Orders:</strong>{" "}
              {orders.filter((order) => order.status === "shipped").length}
            </p>
          </div>
          <div className={styles.statBox}>
            <p>
              <strong>Cancelled Orders:</strong>{" "}
              {orders.filter((order) => order.status === "canceled").length}
            </p>
          </div>
          <div className={styles.addshipment}>
            <div className={styles.addshipmenttitle}>Add new shipment</div>
            <div className={styles.addshipmentimg}>
              <img src="standing-6.png" alt="" />
            </div>
            <div className={styles.addshipmentbutton}>
              <button
                className={styles.addbutton}
                onClick={() => navigate("/guestcreateorder")}
              >
                Add
              </button>

              <button className={styles.detailsbutton}>See details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingFind;
