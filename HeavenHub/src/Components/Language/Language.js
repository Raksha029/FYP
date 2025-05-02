import React, { useState } from "react";
import Flag from "react-world-flags";
import styles from "./Language.module.css";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

const Language = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const countryLanguageMap = [
    { code: "US", name: "English", lng: "en" },
    { code: "NP", name: "नेपाली", lng: "ne" }
  ];

  const handleLanguageSelect = (language) => {
    changeLanguage(language.lng);
    localStorage.setItem('language', language.lng); // Save language preference
    setShowModal(false);
  };

  const currentFlag = countryLanguageMap.find(lang => lang.lng === currentLanguage) || countryLanguageMap[0];

  return (
    <div className={styles.languageContainer}>
      <button
        className={styles.languageButton}
        onClick={() => setShowModal(true)}
      >
        <Flag
          code={currentFlag.code}
          height={20}
          width={30}
          className={styles.flagIcon}
        />
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{t('selectLanguage')}</h2>
            <div className={styles.languageList}>
              {countryLanguageMap.map((language) => (
                <button
                  key={language.code}
                  className={styles.languageItem}
                  onClick={() => handleLanguageSelect(language)}
                >
                  <Flag
                    code={language.code}
                    height={20}
                    width={30}
                    className={styles.flagIcon}
                  />
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Language;