/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

export const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const validFontSizes = ['normal', 'large', 'extra-large'];

  const [fontSize, setRawFontSize] = useState(() => {
    const saved = localStorage.getItem('accessibility_fontSize');
    return validFontSizes.includes(saved) ? saved : 'normal';
  });

  const setFontSize = (size) => {
    if (validFontSizes.includes(size)) {
      setRawFontSize(size);
    }
  };

  const [highContrast, setRawHighContrast] = useState(() => {
    try {
      const saved = localStorage.getItem('accessibility_highContrast');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const setHighContrast = (val) => {
    setRawHighContrast(prev => Boolean(typeof val === 'function' ? val(prev) : val));
  };

  const [reducedMotion, setRawReducedMotion] = useState(() => {
    try {
      const saved = localStorage.getItem('accessibility_reducedMotion');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const setReducedMotion = (val) => {
    setRawReducedMotion(prev => Boolean(typeof val === 'function' ? val(prev) : val));
  };

  useEffect(() => {
    const root = document.documentElement;

    // Font Size
    root.setAttribute('data-font-size', fontSize);
    localStorage.setItem('accessibility_fontSize', fontSize);

    // High Contrast
    if (highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }
    localStorage.setItem('accessibility_highContrast', JSON.stringify(highContrast));

    // Reduced Motion
    if (reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }
    localStorage.setItem('accessibility_reducedMotion', JSON.stringify(reducedMotion));

  }, [fontSize, highContrast, reducedMotion]);

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
