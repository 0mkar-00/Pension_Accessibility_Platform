import { useContext } from 'react';
import { PensionContext } from './PensionContext.js';

export const usePension = () => {
  const context = useContext(PensionContext);
  if (!context) {
    throw new Error('usePension must be used within a PensionProvider');
  }
  return context;
};
