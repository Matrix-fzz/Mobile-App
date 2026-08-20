// context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from '@/constants/colors'; // استيراد جميع الثيمات

// إنشاء الـ Context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // الحالة الأولية هي 'coffee' أو أي ثيم افتراضي
  const [themeName, setThemeName] = useState('coffee'); 

  // فاش التطبيق كيبدا، كنحاولو نجيبو الثيم المحفوظ
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && THEMES[savedTheme]) {
        setThemeName(savedTheme);
      }
    };
    loadTheme();
  }, []);

  // دالة لتغيير الثيم وحفظه
  const selectTheme = async (name) => {
    if (THEMES[name]) {
      setThemeName(name);
      await AsyncStorage.setItem('theme', name);
    }
  };
  
  // الحصول على كائن الألوان الكامل للثيم الحالي
  const currentTheme = THEMES[themeName];

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeName, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};