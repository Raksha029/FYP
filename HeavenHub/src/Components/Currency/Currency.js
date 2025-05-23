import React, { useState } from "react";
import styles from "./Currency.module.css";
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const Currency = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const currencies = [
    { code: "NPR", name: t('nepaleseRupee'), symbol: "₨", rate: 1 },
    { code: "USD", name: t('usDollar'), symbol: "$", rate: 0.0075 }
  ];

  const handleCurrencySelect = (newCurrency) => {
    setCurrency({
      ...newCurrency,
      name: newCurrency.code === "NPR" ? t('nepaleseRupee') : t('usDollar')
    });
    setShowModal(false);
  };

  return (
    <div className={styles.currencyContainer}>
      <button
        className={styles.currencyButton}
        onClick={() => setShowModal(true)}
      >
        <span className={styles.currencySymbol}>{currency.symbol}</span>
        <span className={styles.currencyCode}>{currency.code}</span>
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{t('selectCurrency')}</h2>
            <div className={styles.currencyList}>
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  className={styles.currencyItem}
                  onClick={() => handleCurrencySelect(curr)}
                >
                  <span className={styles.currencySymbol}>{curr.symbol}</span>
                  <span>{curr.name} ({curr.code})</span>
                  <span className={styles.rate}>
                    1 {curr.code} = {curr.code === 'NPR' ? '1 NPR' : '133.33 NPR'}
                  </span>
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

export default Currency;