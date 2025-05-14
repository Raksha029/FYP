import React, { useState } from "react";
import styles from "./Currency.module.css";

const Currency = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "USD",
    name: "US Dollar",
    symbol: "$",
  });

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
  ];

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setShowModal(false);
  };

  return (
    <div>
      <button
        className={styles.currencyButton}
        onClick={() => setShowModal(true)}
      >
        {selectedCurrency.code} ({selectedCurrency.symbol})
      </button>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Select your currency</h2>
            <div className={styles.currencyList}>
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  className={styles.currencyItem}
                  onClick={() => handleCurrencySelect(currency)}
                >
                  {currency.name} ({currency.code})
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

export default Currency;
