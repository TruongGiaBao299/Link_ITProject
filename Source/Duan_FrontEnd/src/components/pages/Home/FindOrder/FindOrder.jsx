import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getOrderByIdApi } from "../../../../utils/orderAPI/orderAPI";
import styles from "./FindOrder.module.css";
import LoadingSpinner from "../../../../containers/LoadingSpinner/LoadingSpinner";
import { GoArrowUpRight } from "react-icons/go";
import containerImage from "../../../../../public/container.jpg";
import { MdOutlineDoubleArrow } from "react-icons/md";

const FindOrder = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Kiểm soát popup hiển thị
  const [isLoading, setIsLoading] = useState(false); // Track loading state
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
      } else {
        setOrderInfo(res);
        setShowPopup(true); // Hiển thị popup khi tìm thấy đơn hàng
        toast.success("Order found successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
      toast.error("You need login to find your order");
    } finally {
      setIsLoading(false); // Mark loading as complete
    }
  };

  {
    isLoading && <LoadingSpinner />;
  }

  return (
    <div className={styles.FindOrderContainer}>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Freight transportation with full insurance and{" "}
              <span className={styles.highlight}>real-time tracking</span>
            </h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.findOrderInputContainer}>
                <div className={styles.findOrderInput}>
                  <input
                    placeholder="Tracking Number"
                    type="text"
                    id="orderId"
                    name="orderId"
                    required
                  />
                </div>
                <div className={styles.findOrderSubmit}>
                  <button type="submit">
                    <GoArrowUpRight />
                  </button>
                </div>
              </div>
            </form>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>1.2 days</span>
                <span className={styles.statLabel}>Average delivery time</span>
              </div>
              <div className={styles.stat_center}>
                <span className={styles.statValue}>+2.3k</span>
                <span className={styles.statLabel}>
                  Orders up from last year
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>85%</span>
                <span className={styles.statLabel}>Return rate</span>
              </div>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <img
              src={containerImage}
              alt="Shipping Container"
              className={styles.containerImage}
            />
          </div>
        </main>
      </div>

      {/* Popup hiển thị thông tin đơn hàng */}
      {showPopup && orderInfo && (
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
            <div className={styles.contentpopup}>
              <div className={styles.ordertitle}>
                <p>
                  <strong>Order ID:</strong> {orderInfo._id}
                </p>
                <p>
                  <strong>Status:</strong> {orderInfo.status}
                </p>
              </div>
              <div className={styles.orderaddress}>
                <p>
                  <strong>From Address:</strong> {orderInfo.fromAddress},{" "}
                  {orderInfo.fromDistrict}, {orderInfo.fromWard},{" "}
                  {orderInfo.fromCity}
                </p>
                <MdOutlineDoubleArrow className={styles.addressicon} />
                <p>
                  <strong>To Address:</strong> {orderInfo.toAddress},{" "}
                  {orderInfo.toDistrict}, {orderInfo.toWard}, {orderInfo.toCity}
                </p>
              </div>
              <div className={styles.ordergroup}>
                <div className={styles.ordercontent}>
                  <p>
                    <strong>Sender Name:</strong> {orderInfo.senderName}
                  </p>
                  <p>
                    <strong>Sender Number:</strong> {orderInfo.senderNumber}
                  </p>

                  <p>
                    <strong>Recipient Name:</strong> {orderInfo.recipientName}
                  </p>
                  <p>
                    <strong>Recipient Number:</strong> {orderInfo.recipientNumber}
                  </p>
                  <p>
                    <strong>Order Weight:</strong> {orderInfo.orderWeight} kg, <strong>Order Size:</strong> {orderInfo.orderSize} m³, <strong>Type:</strong> {orderInfo.type}
                  </p>
                  <p>
                    <strong>Message:</strong> {orderInfo.message}
                  </p>
                  <p>
                    <strong>Price:</strong> {orderInfo.price}
                  </p>
                </div>
                <div className={styles.timelinecontent}>
                  {orderInfo.timeline && orderInfo.timeline.length > 0 && (
                    <div className={styles.timeline}>
                      <ul>
                        {orderInfo.timeline.map((entry, index) => (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindOrder;
