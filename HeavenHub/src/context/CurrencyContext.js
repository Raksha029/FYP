import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    return savedCurrency ? JSON.parse(savedCurrency) : {
      code: "NPR",
      name: "Nepalese Rupee",
      symbol: "₨",
      rate: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  }, [currency]);

  const convertPrice = (amount) => {
    const rates = {
      NPR: 1,
      USD: 0.0075,
    };
    
    const convertedAmount = amount * rates[currency.code];
    return currency.code === 'NPR' 
      ? Math.round(convertedAmount).toString()
      : convertedAmount.toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};