import React, { createContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';

// Create the context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme(); // Detect system theme
  const [theme, setTheme] = useState(colorScheme);

  useEffect(() => {
    setTheme(colorScheme); // Sync with system theme on mount
  }, [colorScheme]);

  // Toggle function to switch between light and dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
