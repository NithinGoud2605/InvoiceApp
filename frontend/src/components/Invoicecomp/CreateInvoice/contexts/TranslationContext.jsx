import React, { createContext, useContext } from 'react';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  // For simplicity, our translation function returns the key.
  const t = (key) => key;
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => useContext(TranslationContext);
