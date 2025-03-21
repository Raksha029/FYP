import React, { useState } from "react";
import Flag from "react-world-flags";
import styles from "./Language.module.css";

const Language = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: "NP",
    name: "Nepali",
  });

  const countryLanguageMap = [
    { code: "US", name: "English (US)" },
    { code: "GB", name: "English (UK)" },
    { code: "FR", name: "Français" },
    { code: "DE", name: "Deutsch" },
    { code: "ES", name: "Español" },
    { code: "IT", name: "Italiano" },
    { code: "PT", name: "Português" },
    { code: "NL", name: "Nederlands" },
    { code: "SE", name: "Svenska" },
    { code: "NO", name: "Norsk" },
    { code: "FI", name: "Suomi" },
    { code: "NP", name: "Nepali" },
    { code: "CN", name: "简体中文" },
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowModal(false);
  };

  return (
    <div className={styles.languageContainer}>
      <button
        className={styles.languageButton}
        onClick={() => setShowModal(true)}
      >
        <Flag
          code={selectedLanguage.code}
          height={20}
          width={30}
          className={styles.flagIcon}
        />
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Select your language</h2>
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
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Language;
