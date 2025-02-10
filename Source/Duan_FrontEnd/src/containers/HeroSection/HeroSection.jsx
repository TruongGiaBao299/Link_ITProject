import React from "react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.hero_content}>
          <div className={styles.hero_left}> {/* Left side container */}
            <h1>Global Shipping Solutions</h1>
          </div>
          <div className={styles.hero_right}> {/* Right side container */}
            <p>
            Elevate your logistics with our Efficient Dispatch
            Services-swift, seamless, and cost-effective, exceeding
            expectations.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.exploreButton}>Explore now</button>
              <button className={styles.talkButton}>Let's talk It</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;