import React, { useState } from "react";
import styles from "./LoyaltyPoints.module.css"; // Create this CSS file for styling
import chestbox from "../Assets/Chestboxs.png";

const FAQs = [
  {
    question: "How do I earn TT Coins?",
    answer:
      "For every purchase you make through our app, you'll earn Trip Turbo coins. These coins can later be redeemed as per our policy, allowing you to enjoy additional savings on your future bookings.",
  },
  {
    question: "How can I redeem TT Coins?",
    answer:
      "You can redeem TT Coins during the checkout process on our app. Simply select the option to use your coins.",
  },
  {
    question: "When will I be able to redeem TT Coins?",
    answer: "You can start redeeming TT Coins after your first purchase.",
  },
];

const LoyaltyPoints = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeSection, setActiveSection] = useState("Loyalty Points");
  const [activeFAQ, setActiveFAQ] = useState(null);

  const handleTabClick = (section) => {
    setActiveSection(section);
  };

  const handleHistoryTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.loyaltyContainer}>
        <div className={styles.sidebar}>
          <h1 style={{ fontWeight: "bold", fontSize: "1.5em" }}>Hi, Raksha</h1>
          <p>raksha993@gmail.com</p>
          <div className={styles.card}>
            <h2>Loyalty points</h2>
            <hr className={styles.separator} />
            <div className={styles.coinDisplay}>0</div>
          </div>
          <div className="nav">
            <ul className={styles.navList}>
              <li
                onClick={() => handleTabClick("Loyalty Points")}
                className={`${
                  activeSection === "Loyalty Points" ? styles.activeTab : ""
                }`}
              >
                <span role="img" aria-label="coin">
                  💰
                </span>{" "}
                Loyalty Points
              </li>
              <li
                onClick={() => handleTabClick("Rewards")}
                className={`${
                  activeSection === "Rewards" ? styles.activeTab : ""
                }`}
              >
                <span role="img" aria-label="reward">
                  🏆
                </span>{" "}
                Rewards
              </li>
              <li
                onClick={() => handleTabClick("FAQs")}
                className={`${
                  activeSection === "FAQs" ? styles.activeTab : ""
                }`}
              >
                <span role="img" aria-label="faq">
                  ❓
                </span>{" "}
                FAQs
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.content}>
          {activeSection === "Loyalty Points" && (
            <>
              <h2>Loyalty Points</h2>
              <div className={styles.historyHeader}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "All" ? styles.activeTabs : ""
                  }`}
                  onClick={() => handleHistoryTabClick("All")}
                >
                  All
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Earned" ? styles.activeTabs : ""
                  }`}
                  onClick={() => handleHistoryTabClick("Earned")}
                >
                  Earned
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Redeemed" ? styles.activeTabs : ""
                  }`}
                  onClick={() => handleHistoryTabClick("Redeemed")}
                >
                  Redeemed
                </button>
              </div>
              <div className={styles.emptyState}>
                <img
                  className={styles.centeredImage}
                  src={chestbox}
                  alt="Empty State"
                />
                <p className={styles.centeredText}>
                  Start booking to earn the points
                </p>
              </div>
            </>
          )}
          {activeSection === "Rewards" && (
            <div className={styles.content}>
              <h2>Rewards</h2>
              <div className={styles.rewardItem}>
                <div>
                  <p>NPR 100 OFF on 100 off on Every Hotels</p>
                  <p>Valid for regular users</p>
                  <p>Worth 1000 Loyalty Points</p>
                </div>
                <button className={styles.redeemButton}>Redeem</button>
              </div>
              <div className={styles.rewardItem}>
                <div>
                  <p>NPR 100 OFF on 100 off on Every Hotels</p>
                  <p>Valid for regular users</p>
                  <p>Worth 1000 Loyalty Points</p>
                </div>
                <button className={styles.redeemButton}>Redeem</button>
              </div>
            </div>
          )}
          {activeSection === "FAQs" && (
            <div className={styles.content}>
              <h2>Frequently Asked Questions</h2>
              {FAQs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <div
                    onClick={() => toggleFAQ(index)}
                    className={styles.faqQuestion}
                  >
                    {faq.question}
                  </div>
                  {activeFAQ === index && (
                    <div className={styles.faqAnswer}>{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;
