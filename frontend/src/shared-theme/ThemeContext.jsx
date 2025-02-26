// src/shared-theme/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

/**
 * Provides "mode" and "toggleTheme" to children.
 * Persists the mode in localStorage so it survives refresh.
 */
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    // On load, get "themeMode" from localStorage if available
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    // Whenever mode changes, store in localStorage
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
