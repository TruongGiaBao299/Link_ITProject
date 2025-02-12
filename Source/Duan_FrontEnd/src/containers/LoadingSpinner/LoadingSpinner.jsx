import React from "react";
import styles from "./LoadingSpinner.module.css"; // Import CSS module

const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
