/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, languageData } from './languageData';

export const LanguageContext = createContext(null);

const STORAGE_KEY = 'app_language';

const safeGetStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const safeSetStorage = (val) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, val);
  } catch {
    // Ignore storage errors safely to prevent crashes
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setRawLanguage] = useState(() => {
    const saved = safeGetStorage();
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((lang) => {
    const validLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
    setRawLanguage(validLang);
  }, []);

  useEffect(() => {
    safeSetStorage(language);
  }, [language]);

  const translate = useCallback((key) => {
    const currentDict = languageData[language];
    const defaultDict = languageData[DEFAULT_LANGUAGE];
    
    // Attempt lookup in current language
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    
    // Fallback to English (DEFAULT_LANGUAGE)
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    
    // Fallback to returning the key itself
    return key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    translate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
