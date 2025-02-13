import React from 'react';
import styles from './About.module.css';
import { FaBox } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";
import { LuContainer } from "react-icons/lu";


const About = () => {
  const services = [
    {
      icon: <FaBox />,
      title: 'Delivery',
      description: 'Fast, guaranteed delivery and good prices with tailored service tailored to you.',
    },
    {
      icon: <FaTruck />,
      title: 'BaTruck',
      description: 'A variety of transportation options for large and bulky items.',
    },
    {
      icon: <FaShoppingBasket />,
      title: 'BaMart',
      description: 'Everyday shopping is simple and convenient. Whatever you need, we deliver to your home.',
    },
    {
      icon: <LuContainer />,
      title: 'BaSupply',
      description: 'Providing wholesale sources quickly and securely at extremely competitive prices.',
    },
  ];

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <p className={styles.sub}>Why Choose Us?</p>
        <h2 className={styles.mainTitle}>Unleashing The Power Of Seamless Logistics</h2>
        <p className={styles.subTitle}>We unleash the power of cutting-edge technology and operational excellence to optimize every facet of your supply chain, ensuring a journey marked by efficiency, reliability, and unparalleled performance.</p>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div className={styles.serviceItem} key={index}>
              <div className={styles.serviceIcon}>{service.icon}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;