import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { createUserApi } from "../../../utils/userAPI/userAPI";
import logo from "../../../assets/Logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLockClosed, IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện password

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await createUserApi(data.name, data.email, data.password);
      if (res && res.data === null) {
        toast.error("Email has been registered!");
      } else {
        toast.success("Registered successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 1 }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftcontent}>
            <img src={logo} alt="Logo" />
            <p>
              Simplifying shipping, <br />
              one B at a time.
            </p>
          </div>
          <div className={styles.rightcontent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.titlecontent}>
                <h1 className={styles.title}>REGISTER</h1>
                <h1 className={styles.subtitle}>Create your new account</h1>
              </div>

              <div className={styles.line}></div>

              {/* Name Field */}
              <div className={styles.field}>
                <FaRegUserCircle className={styles.fieldlogo} />
                <input
                  placeholder="Name"
                  type="text"
                  id="name"
                  name="name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className={styles.field}>
                <MdOutlineEmail className={styles.fieldlogo} />
                <input
                  placeholder="Email"
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className={styles.field}>
                <IoLockClosed className={styles.fieldlogo} />
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                />
                {/* Nút show/hide password */}
                {/* <span
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOff className={styles.togglePassword} />
                  ) : (
                    <IoEye className={styles.togglePassword} />
                  )}
                </span> */}
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.button}>
                Submit
              </button>

              <div>
                <div className={styles.ortitle}>
                  <div className={styles.grayline}></div>
                  <p className={styles.linetitle}>or</p>
                  <div className={styles.grayline}></div>
                </div>

                <h1 className={styles.subtitle}>
                  Already have an account?{" "}
                  <span
                    className={styles.linksubtitle}
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </span>
                </h1>
              </div>

              <div className={styles.bottomtitle}>
                <p>BaShip</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
