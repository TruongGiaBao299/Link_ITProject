import React, {useState} from "react";
import styles from "./Service.module.css";
import { GoArrowUpRight } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import deliveryImage from "../../../public/delivery.jpg"


const Service = () => {

    const [ activeAccordion, setActiveAccordion ] = useState(null);
    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const accordionData = [
        { title: 'Optimizing transportation plans', content: 'The platform automatically calculates and sets up daily dispatch plans, reducing distances and transportation costs with automatic dispatching.'},
        { title: 'Real-time monitoring', content: 'Managers can fully monitor route details through GPS integration. The system automatically warns when there are abnormalities related to route deviation, strange points or exceeding the expected time.'},
        { title: 'Vehicle and driver management', content: 'STM manages documents related to fuel, maintenance, and fleet repairs. It also manages time sheets and supports the calculation of salaries and surcharges for drivers.'},
    ]

    return (
        <>
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.contact}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>Baship Solution For Mass</h1>
                        <p className={styles.script}>For medium businesses to operate according to standard processes, easier and more economical.</p>
                        <div className={styles.contactInput}>
                            <button className={styles.contactButton}>Contact Us <GoArrowUpRight className={styles.iconsbutton} /></button>
                            <p className={styles.miniscript}>Unlimited free trial up to 30 days starting today.</p>
                        </div>
                    </div>
                </div>
                <div className={styles.imageDelivery}>
                    <img src={deliveryImage} alt="Shipping Container" className={styles.deliveryImage}/>
                </div>
            </main>
            <div className={styles.mainSummary}>
                <div className={styles.summary}>
                    <h2 className={styles.mainTitle}>SSM integrates three core logistics operation management solutions</h2>
                    <p className={styles.subTitle}>SSM is a multi-solution integrated software including order management, shipping and warehousing for medium businesses. Manage and automate logistics operations according to a standard process, with a variety of tactics suitable to the business models of many customers.</p>
                </div>
            </div>
            <div className={styles.overview}>
                <div className={styles.leftColumn}>
                    <h1 className={styles.title}>STM - Transport Management Solution</h1>
                    <div className={styles.accordion}>
                        {accordionData.map((item, index) => (
                            <div key={index} className={styles.accordionItem}>
                            <div
                              className={`${styles.accordionHeader} ${activeAccordion === index ? styles.active : ''}`}
                              onClick={() => toggleAccordion(index)}
                            >
                              {item.title}
                              <span className={styles.arrow}>{activeAccordion === index ? <FiMinus className={styles.overviewIcons} /> : <FiPlus className={styles.overviewIcons} /> }</span>
                            </div>
                            {activeAccordion === index && (
                              <div className={styles.accordionContent}>{item.content}</div>
                            )}
                          </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
        </>
    )
}

export default Service;