import React, { useState } from "react";
import { updatePasswordApi } from "../../utils/userAPI/userAPI";
import { toast } from "react-toastify";
import styles from "./UpdatePassword.module.css";

const UpdatePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill all information");
      return;
    }

    try {
      const response = await updatePasswordApi(oldPassword, newPassword);
      toast.success("Update Password Success");
      setOldPassword("");
      setNewPassword("");
      onClose();
    } catch (error) {
      toast.error("Fail to Update Password");
    }
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <form onSubmit={handleUpdatePassword}>
          <h2>Update Password</h2>
          <div className={styles.inputpopup}>
            <label>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputpopup}>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.submitpopup}>
            <button type="submit">Confirm</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
