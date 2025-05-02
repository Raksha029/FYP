import React, { useState } from "react";
import { FaHome, FaEye, FaBullseye, FaShieldAlt, FaUsers } from "react-icons/fa";
import styles from "./About.module.css";
import raksha from "../Assets/Kim.jpg";
import raksha1 from "../Assets/kim1.jpg";
import raksha2 from "../Assets/kim2.jpg";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("about");

  const menuItems = [
    { id: "about", icon: <FaHome />, text: t('aboutMenu.aboutHeavenHub') },
    { id: "vision", icon: <FaEye />, text: t('aboutMenu.vision') },
    { id: "mission", icon: <FaBullseye />, text: t('aboutMenu.mission') },
    { id: "policies", icon: <FaShieldAlt />, text: t('aboutMenu.policies') },
    { id: "team", icon: <FaUsers />, text: t('aboutMenu.team') },
  ];


  const renderContent = () => {
    switch (activeSection) {
      case "vision":
        return (
          <div className={styles.contentSection}>
           <h2>{t('aboutContent.visionTitle')}</h2>
            <div className={styles.descriptionContainer}>
            <p>{t('aboutContent.visionText')}</p>
            </div>
          </div>
        );
      case "mission":
        return (
          <div className={styles.contentSection}>
            <h2>{t('aboutContent.missionTitle')}</h2>
            <div className={styles.descriptionContainer}>
            <p>{t('aboutContent.missionText')}</p>
            </div>
          </div>
        );
      case "policies":
        return (
          <div className={styles.contentSection}>
           <h2>{t('aboutContent.policiesTitle')}</h2>
           <p>{t('aboutContent.policiesText')}</p>
            <ul className={styles.policyList}>
              <li>
                <strong>{t('policies.cancellation.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.cancellation.free')}</li>
                  <li>{t('policies.cancellation.charges')}</li>
                  <li>{t('policies.cancellation.noShow')}</li>
                  <li>{t('policies.cancellation.special')}</li>
                </ul>
              </li>

              <li>
                <strong>{t('policies.booking.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.booking.secure')}</li>
                  <li>{t('policies.booking.payment')}</li>
                  <li>{t('policies.booking.guarantee')}</li>
                  <li>{t('policies.booking.transparent')}</li>
                </ul>
              </li>

              <li>
                <strong>{t('policies.checkInOut.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.checkInOut.checkIn')}</li>
                  <li>{t('policies.checkInOut.checkOut')}</li>
                  <li>{t('policies.checkInOut.early')}</li>
                  <li>{t('policies.checkInOut.id')}</li>
                </ul>
              </li>

              <li>
                <strong>{t('policies.privacy.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.privacy.protection')}</li>
                  <li>{t('policies.privacy.encryption')}</li>
                  <li>{t('policies.privacy.sharing')}</li>
                  <li>{t('policies.privacy.audits')}</li>
                </ul>
              </li>

              <li>
                <strong>{t('policies.bestPrice.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.bestPrice.match')}</li>
                  <li>{t('policies.bestPrice.claims')}</li>
                  <li>{t('policies.bestPrice.conditions')}</li>
                  <li>{t('policies.bestPrice.rates')}</li>
                </ul>
              </li>

              <li>
                <strong>{t('policies.support.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.support.available')}</li>
                  <li>{t('policies.support.channels')}</li>
                  <li>{t('policies.support.emergency')}</li>
                  <li>{t('policies.support.multilingual')}</li>
                </ul>
              </li>

              <li>
                <strong>{t('policies.special.title')}</strong>
                <ul className={styles.subPolicyList}>
                  <li>{t('policies.special.availability')}</li>
                  <li>{t('policies.special.notification')}</li>
                  <li>{t('policies.special.accessibility')}</li>
                  <li>{t('policies.special.charges')}</li>
                </ul>
              </li>
            </ul>
          </div>
        );
      case "team":
        return (
          <div className={styles.contentSection}>
            <h2>{t('aboutContent.teamTitle')}</h2>
            <div className={styles.teamGrid}>
              <div className={styles.teamCard}>
                <img
                  src={raksha}
                  alt="Team Member"
                  className={styles.teamImage}
                />
                <div className={styles.teamInfo}>
                <h3>{t('team.member1.name')}</h3>
                <p className={styles.role}>{t('team.member1.role')}</p>
                <p className={styles.contact}>{t('team.labels.email')} {t('team.member1.email')}</p>
                <p className={styles.contact}>{t('team.labels.phone')} {t('team.member1.phone')}</p>
                </div>
              </div>

              <div className={styles.teamCard}>
                <img
                  src={raksha1}
                  alt="Team Member"
                  className={styles.teamImage}
                />
                <div className={styles.teamInfo}>
                <h3>{t('team.member2.name')}</h3>
                <p className={styles.role}>{t('team.member2.role')}</p>
                <p className={styles.contact}>{t('team.labels.email')} {t('team.member2.email')}</p>
                <p className={styles.contact}>{t('team.labels.phone')} {t('team.member2.phone')}</p>
                </div>
              </div>

              <div className={styles.teamCard}>
                <img
                  src={raksha2}
                  alt="Team Member"
                  className={styles.teamImage}
                />
                <div className={styles.teamInfo}>
                <h3>{t('team.member3.name')}</h3>
                <p className={styles.role}>{t('team.member3.role')}</p>
                <p className={styles.contact}>{t('team.labels.email')} {t('team.member3.email')}</p>
                <p className={styles.contact}>{t('team.labels.phone')} {t('team.member3.phone')}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.contentSection}>
            <h2>{t('aboutContent.aboutTitle')}</h2>
            <div className={styles.descriptionContainer}>
              <p>{t('aboutContent.aboutText')}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={activeSection === item.id ? styles.active : ""}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                {item.text}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.mainContent}>{renderContent()}</div>
    </div>
  );
};

export default About;
