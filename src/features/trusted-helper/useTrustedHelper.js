import { useContext } from 'react';
import { TrustedHelperContext } from './TrustedHelperContext';

export const useTrustedHelper = () => {
  const context = useContext(TrustedHelperContext);
  
  if (!context) {
    throw new Error('useTrustedHelper must be used within a TrustedHelperProvider');
  }
  
  return context;
};
