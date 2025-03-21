import React, { useState } from "react";
import styles from "./About.module.css";
import jeevan from "../Assets/Kim.jpg";
import jeevan1 from "../Assets/kim1.jpg";
import jeevan2 from "../Assets/kim2.jpg";

const About = () => {
  const [activeSection, setActiveSection] = useState("about");

  const renderContent = () => {
    switch (activeSection) {
      case "vision":
        return (
          <div className={styles.contentSection}>
            <h2>Our Vision</h2>
            <p>
              At HeavenHub, our vision is to revolutionize the way travelers
              discover and book accommodations. We aim to create a seamless,
              intuitive, and rewarding experience that connects guests with the
              perfect stay—whether for leisure or business. By leveraging
              innovation and customer-centric solutions, we strive to make
              travel planning effortless, reliable, and enjoyable for everyone.
            </p>
          </div>
        );
      case "mission":
        return (
          <div className={styles.contentSection}>
            <h2>Our Mission</h2>
            <p>
              Our mission at HeavenHub is to simplify and enhance the hotel
              booking experience by offering a user-friendly platform that
              connects travelers with the best accommodations. We are committed
              to providing seamless navigation, secure transactions, and
              personalized recommendations to ensure every stay is memorable.
              Through innovation, transparency, and exceptional customer
              service, we aim to make booking hotels easy, affordable, and
              rewarding for all
            </p>
          </div>
        );
      // ... existing code ...

      case "policies":
        return (
          <div className={styles.contentSection}>
            <h2>Our Policies</h2>
            <p>
              At HeavenHub, we maintain strict policies to ensure a transparent,
              secure, and satisfactory experience for all our users.
            </p>
            <ul className={styles.policyList}>
              <li>
                <strong>Cancellation Policy:</strong>
                <ul className={styles.subPolicyList}>
                  <li>Free cancellation up to 24 hours before check-in</li>
                  <li>
                    Cancellations within 24 hours of check-in may incur charges
                  </li>
                  <li>No-shows will be charged the first night's stay</li>
                  <li>Special rates may have different cancellation terms</li>
                </ul>
              </li>

              <li>
                <strong>Booking & Payment Policy:</strong>
                <ul className={styles.subPolicyList}>
                  <li>Secure payment gateway for all transactions</li>
                  <li>
                    Multiple payment options accepted (Credit Cards, PayPal,
                    etc.)
                  </li>
                  <li>Price guarantee on all confirmed bookings</li>
                  <li>Transparent pricing with no hidden fees</li>
                </ul>
              </li>

              <li>
                <strong>Check-in & Check-out Policy:</strong>
                <ul className={styles.subPolicyList}>
                  <li>Standard check-in time: 2:00 PM</li>
                  <li>Standard check-out time: 11:00 AM</li>
                  <li>
                    Early check-in and late check-out subject to availability
                  </li>
                  <li>Valid ID required at check-in</li>
                </ul>
              </li>

              <li>
                <strong>Privacy & Security Policy:</strong>
                <ul className={styles.subPolicyList}>
                  <li>Strict data protection measures</li>
                  <li>Secure encryption for all personal information</li>
                  <li>No sharing of customer data with third parties</li>
                  <li>Regular security audits and updates</li>
                </ul>
              </li>

              <li>
                <strong>Best Price Guarantee:</strong>
                <ul className={styles.subPolicyList}>
                  <li>We match any lower price found online</li>
                  <li>
                    Price matching claims must be submitted within 24 hours of
                    booking
                  </li>
                  <li>Comparable room type and conditions must apply</li>
                  <li>Valid only for publicly available rates</li>
                </ul>
              </li>

              <li>
                <strong>Customer Support Policy:</strong>
                <ul className={styles.subPolicyList}>
                  <li>24/7 customer support available</li>
                  <li>Multiple support channels (phone, email, chat)</li>
                  <li>Dedicated support for emergency situations</li>
                  <li>Multilingual support team</li>
                </ul>
              </li>

              <li>
                <strong>Special Requests Policy:</strong>
                <ul className={styles.subPolicyList}>
                  <li>Special requests subject to availability</li>
                  <li>Early notification recommended for special needs</li>
                  <li>Accessibility requirements handled with priority</li>
                  <li>Additional charges may apply for certain requests</li>
                </ul>
              </li>
            </ul>
          </div>
        );

      // ... rest of your code ...
      case "team":
        return (
          <div className={styles.contentSection}>
            <h2>Our Team Members</h2>
            <div className={styles.teamGrid}>
              <div className={styles.teamCard}>
                <img
                  src={jeevan}
                  alt="Team Member"
                  className={styles.teamImage}
                />
                <div className={styles.teamInfo}>
                  <h3>John Doe</h3>
                  <p className={styles.role}>CEO & Founder</p>
                  <p className={styles.contact}>Email: john@HeavenHub.com</p>
                  <p className={styles.contact}>Phone: (123) 456-7890</p>
                </div>
              </div>

              <div className={styles.teamCard}>
                <img
                  src={jeevan1}
                  alt="Team Member"
                  className={styles.teamImage}
                />
                <div className={styles.teamInfo}>
                  <h3>Jane Smith</h3>
                  <p className={styles.role}>Operations Manager</p>
                  <p className={styles.contact}>Email: jane@HeavenHub.com</p>
                  <p className={styles.contact}>Phone: (123) 456-7891</p>
                </div>
              </div>

              <div className={styles.teamCard}>
                <img
                  src={jeevan2}
                  alt="Team Member"
                  className={styles.teamImage}
                />
                <div className={styles.teamInfo}>
                  <h3>Mike Johnson</h3>
                  <p className={styles.role}>Customer Relations</p>
                  <p className={styles.contact}>Email: mike@HeavenHub.com</p>
                  <p className={styles.contact}>Phone: (123) 456-7892</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.contentSection}>
            <h2>About HeavenHub</h2>
            <p>
              At HeavenHub, we maintain a strict policy of transparency,
              security, and customer satisfaction. We ensure that all hotels
              listed on our platform provide accurate details, fair pricing, and
              quality service. Our secure payment system protects user
              transactions, and we safeguard personal information through
              advanced security protocols. We support fair business practices,
              ensuring that both travelers and hoteliers have a smooth and
              trustworthy experience. Cancellations, refunds, and booking
              modifications are handled with clarity and fairness. Our
              commitment to reliability and integrity makes HeavenHub a platform
              travelers can trust for safe and convenient hotel bookings
              worldwide. Here are our key policies.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <nav>
          <ul>
            <li
              className={activeSection === "about" ? styles.active : ""}
              onClick={() => setActiveSection("about")}
            >
              About HeavenHub
            </li>
            <li
              className={activeSection === "vision" ? styles.active : ""}
              onClick={() => setActiveSection("vision")}
            >
              Our Vision
            </li>
            <li
              className={activeSection === "mission" ? styles.active : ""}
              onClick={() => setActiveSection("mission")}
            >
              Our Mission
            </li>
            <li
              className={activeSection === "policies" ? styles.active : ""}
              onClick={() => setActiveSection("policies")}
            >
              Our Policies
            </li>
            <li
              className={activeSection === "team" ? styles.active : ""}
              onClick={() => setActiveSection("team")}
            >
              Our Team Members
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.mainContent}>{renderContent()}</div>
    </div>
  );
};

export default About;
