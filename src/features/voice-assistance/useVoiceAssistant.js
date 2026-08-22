import { useState, useEffect, useRef, useCallback } from 'react';

export const useVoiceAssistant = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Determine support safely to avoid crashes in non-browser environments
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Track the current active utterance
  const utteranceRef = useRef(null);

  const stop = useCallback(() => {
    if (!isSupported) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clear state and reference
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [isSupported]);

  const speak = useCallback((text) => {
    if (!isSupported) return;

    // Ignore empty text requests
    if (!text || text.trim() === '') {
      return;
    }

    // Cancel any existing speech before starting a new one (Replace instead of Queue)
    window.speechSynthesis.cancel();

    // Create the new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Update our ref to the newest utterance
    utteranceRef.current = utterance;

    utterance.onstart = () => {
      // Only update state if this event belongs to the currently active utterance
      if (utteranceRef.current === utterance) {
        setIsSpeaking(true);
      }
    };

    utterance.onend = () => {
      // Only clear state if this event belongs to the currently active utterance
      if (utteranceRef.current === utterance) {
        setIsSpeaking(false);
        utteranceRef.current = null;
      }
    };

    utterance.onerror = () => {
      // Only clear state if this event belongs to the currently active utterance
      if (utteranceRef.current === utterance) {
        setIsSpeaking(false);
        utteranceRef.current = null;
      }
    };

    // Begin speaking
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
};
