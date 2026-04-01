import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const themes = {
  dark: {
    key: 'dark',
    name: 'Koyu (Neo-Cyber)',
    background: '#0d0d0d',
    surface: '#141414',
    surfaceContainerLow: '#1c1c1c',
    surfaceContainer: '#262626',
    surfaceContainerHigh: '#333333',
    onSurface: '#e6e6e6',
    onSurfaceVariant: '#a3a3a3',
    primary: '#00cc33',
    onPrimary: '#002609',
    primaryContainer: '#00ff40', // Ana Vurgu (Yeşil)
    onPrimaryContainer: '#001a07',
    outline: '#4d4d4d',
    outlineVariant: '#333333',
    textSecondary: '#8c8c8c'
  },
  light: {
    key: 'light',
    name: 'Aydınlık (Minimal)',
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceContainerLow: '#e8e8e8',
    surfaceContainer: '#dcdcdc',
    surfaceContainerHigh: '#d0d0d0',
    onSurface: '#1a1a1a',
    onSurfaceVariant: '#4d4d4d',
    primary: '#000000',
    onPrimary: '#ffffff',
    primaryContainer: '#000000', // Ana Vurgu (Siyah)
    onPrimaryContainer: '#ffffff',
    outline: '#cccccc',
    outlineVariant: '#e0e0e0',
    textSecondary: '#666666'
  },
  purple: {
    key: 'purple',
    name: 'Mor (Neon Siber)',
    background: '#0A0014', // Çok koyu mor arka plan
    surface: '#15002C',
    surfaceContainerLow: '#1F0042',
    surfaceContainer: '#2C005D',
    surfaceContainerHigh: '#3D0082',
    onSurface: '#EBD4FF',
    onSurfaceVariant: '#C38FFF',
    primary: '#B445FF',
    onPrimary: '#2B004D',
    primaryContainer: '#D580FF', // Ana Vurgu (Açık Mor)
    onPrimaryContainer: '#3C0066',
    outline: '#5D2B8A',
    outlineVariant: '#401A66',
    textSecondary: '#A975D1'
  },
  orange: {
    key: 'orange',
    name: 'Turuncu (Hacker)',
    background: '#140A00',
    surface: '#2C1500',
    surfaceContainerLow: '#422000',
    surfaceContainer: '#5D2E00',
    surfaceContainerHigh: '#824000',
    onSurface: '#FFEBD4',
    onSurfaceVariant: '#FFC38F',
    primary: '#FF8A00',
    onPrimary: '#4D2400',
    primaryContainer: '#FFB366', // Ana Vurgu (Turuncu)
    onPrimaryContainer: '#663000',
    outline: '#8A522B',
    outlineVariant: '#663B1A',
    textSecondary: '#D19A75'
  },
  red: {
    key: 'red',
    name: 'Kırmızı (Neo-Blood)',
    background: '#0A0000',
    surface: '#1A0000',
    surfaceContainerLow: '#2A0000',
    surfaceContainer: '#3D0000',
    surfaceContainerHigh: '#5D0000',
    onSurface: '#FFEBEB',
    onSurfaceVariant: '#FFABAB',
    primary: '#FF0000',
    onPrimary: '#2B0000',
    primaryContainer: '#FF4D4D',
    onPrimaryContainer: '#3D0000',
    outline: '#8A2B2B',
    outlineVariant: '#661A1A',
    textSecondary: '#D17575'
  }
};

const ThemeContext = createContext({
  theme: themes.dark,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(themes.dark);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@carbon_theme');
        if (savedTheme && themes[savedTheme]) {
          setThemeState(themes[savedTheme]);
        }
      } catch (error) {
        console.error("Theme loading error", error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (themeKey) => {
    if (themes[themeKey]) {
      setThemeState(themes[themeKey]);
      try {
        await AsyncStorage.setItem('@carbon_theme', themeKey);
      } catch (error) {
        console.error("Theme saving error", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
