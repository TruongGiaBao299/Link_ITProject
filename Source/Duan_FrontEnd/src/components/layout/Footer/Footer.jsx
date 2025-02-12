import React from 'react';
import styles from './Footer.module.css';
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { IoSend } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.content}>
            <div className={styles.contact}>
                <img className={styles.img} src="logo2.png"></img>
                <p className={styles.companyName}>BaShip form codeBasic</p>
                <p>
                    <span className={styles.address}> <IoLocationSharp className={styles.icon1} />
                        HCMC: 19 Nguyen Huu Tho, Tan Hung, District 7, Ho Chi Minh City
                    </span>
                    <span className={styles.address}> <FaPhoneAlt className={styles.icon1} />
                        Hotline: 086868686
                    </span> 
                       
                    <span className={styles.address}> <IoMdMail className={styles.icon1}/>
                        SupportBaShip@gmail.com
                    </span>
                </p>
                
            </div>
            <div className={styles.social}>
                <p className={styles.connect}>Contact Us</p>
                <p className={styles.connectContent}>We will contact you as soon as possible.</p>
                <div className={styles.trackingInput}>
                    <input type="text" placeholder="Your mail" className={styles.inputField} />
                    <button className={styles.trackButton}><IoSend className={styles.icons} /></button>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;