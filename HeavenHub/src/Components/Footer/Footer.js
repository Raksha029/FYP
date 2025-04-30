import React from "react";
import { useTranslation } from 'react-i18next';
import styles from "./Footer.module.css";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className={styles.footer}>
      <p>{t('copyright')}</p>
      <nav>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          {t('facebook')}
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          {t('instagram')}
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          {t('twitter')}
        </a>
      </nav>
    </footer>
  );
};

export default Footer;