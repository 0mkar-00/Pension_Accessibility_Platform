import { useAccessibility } from '../../features/accessibility/useAccessibility';
import { useVoiceAssistant } from '../../features/voice-assistance/useVoiceAssistant';
import './AccessibilitySetup.css';

const AccessibilitySetup = () => {
  
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
  } = useAccessibility();

  const {
  speak,
  stop,
  isSpeaking,
  isSupported,
} = useVoiceAssistant();

const accessibilityContent = `
  Accessibility Preferences.
  Make the application comfortable for you.
  Choose the settings that make reading and using this application easier.
  Text size. Choose a text size that is comfortable for you to read.
  High contrast. Increase the contrast between text, backgrounds, and controls.
  Reduced motion. Reduce animations and motion effects throughout the application.
`;

  return (
    <main className="accessibility-setup">
      <div className="accessibility-setup__container">
        {isSupported && (
  <div className="accessibility-setup__voice">
    <button
      type="button"
      className="accessibility-setup__listen"
      onClick={() => {
        if (isSpeaking) {
          stop();
        } else {
          speak(accessibilityContent);
        }
      }}
      aria-pressed={isSpeaking}
      aria-label={
        isSpeaking
          ? 'Stop reading accessibility instructions'
          : 'Listen to accessibility instructions'
      }
    >
      {isSpeaking ? 'Stop' : 'Listen'}
    </button>
  </div>
)}
        <header className="accessibility-setup__header">
          <p className="accessibility-setup__eyebrow">
            Accessibility Preferences
          </p>

          <h1>Make the application comfortable for you</h1>

          <p>
            Choose the settings that make reading and using this application
            easier. You can change these preferences at any time.
          </p>
        </header>

        <section className="accessibility-card" aria-labelledby="font-size-heading">
          <fieldset>
            <legend id="font-size-heading">Text size</legend>

            <p className="accessibility-card__description">
              Choose a text size that is comfortable for you to read.
            </p>

            <div className="accessibility-options">
              <label
                className={`accessibility-option ${
                  fontSize === 'normal' ? 'accessibility-option--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="fontSize"
                  value="normal"
                  checked={fontSize === 'normal'}
                  onChange={() => setFontSize('normal')}
                />
                <span>
                  <strong>Normal</strong>
                  <small>Standard text size</small>
                </span>
              </label>

              <label
                className={`accessibility-option ${
                  fontSize === 'large' ? 'accessibility-option--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="fontSize"
                  value="large"
                  checked={fontSize === 'large'}
                  onChange={() => setFontSize('large')}
                />
                <span>
                  <strong>Large</strong>
                  <small>Larger and easier-to-read text</small>
                </span>
              </label>

              <label
                className={`accessibility-option ${
                  fontSize === 'extra-large'
                    ? 'accessibility-option--selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="fontSize"
                  value="extra-large"
                  checked={fontSize === 'extra-large'}
                  onChange={() => setFontSize('extra-large')}
                />
                <span>
                  <strong>Extra Large</strong>
                  <small>Maximum text size</small>
                </span>
              </label>
            </div>
          </fieldset>
        </section>

        <section
          className="accessibility-card"
          aria-labelledby="contrast-heading"
        >
          <fieldset>
            <legend id="contrast-heading">High contrast</legend>

            <p className="accessibility-card__description">
              Increase the contrast between text, backgrounds, and controls.
            </p>

            <div className="accessibility-options accessibility-options--two">
              <label
                className={`accessibility-option ${
                  highContrast
                    ? 'accessibility-option--selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="highContrast"
                  checked={highContrast}
                  onChange={() => setHighContrast(true)}
                />
                <span>
                  <strong>On</strong>
                  <small>Use high contrast</small>
                </span>
              </label>

              <label
                className={`accessibility-option ${
                  !highContrast
                    ? 'accessibility-option--selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="highContrast"
                  checked={!highContrast}
                  onChange={() => setHighContrast(false)}
                />
                <span>
                  <strong>Off</strong>
                  <small>Use standard contrast</small>
                </span>
              </label>
            </div>
          </fieldset>
        </section>

        <section
          className="accessibility-card"
          aria-labelledby="motion-heading"
        >
          <fieldset>
            <legend id="motion-heading">Reduced motion</legend>

            <p className="accessibility-card__description">
              Reduce animations and motion effects throughout the application.
            </p>

            <div className="accessibility-options accessibility-options--two">
              <label
                className={`accessibility-option ${
                  reducedMotion
                    ? 'accessibility-option--selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="reducedMotion"
                  checked={reducedMotion}
                  onChange={() => setReducedMotion(true)}
                />
                <span>
                  <strong>On</strong>
                  <small>Reduce motion</small>
                </span>
              </label>

              <label
                className={`accessibility-option ${
                  !reducedMotion
                    ? 'accessibility-option--selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="reducedMotion"
                  checked={!reducedMotion}
                  onChange={() => setReducedMotion(false)}
                />
                <span>
                  <strong>Off</strong>
                  <small>Keep standard motion</small>
                </span>
              </label>
            </div>
          </fieldset>
        </section>

        <div className="accessibility-setup__notice" role="status">
          Your accessibility preferences are saved automatically.
        </div>
      </div>
    </main>
  );
};

export default AccessibilitySetup;