import { useTheme, THEMES } from '../../context/ThemeContext';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AppearanceSection = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-section">
      <h3 className="settings-section__title">Appearance</h3>
      <div className="settings-section__body">
        <p className="settings-section__label">Theme</p>
        <div className="theme-picker">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-card${theme === t.id ? ' theme-card--active' : ''}`}
              onClick={() => setTheme(t.id)}
              type="button"
              aria-pressed={theme === t.id}
              title={t.label}
            >
              <div className="theme-card__swatch">
                {t.colors.map((color, i) => (
                  <span key={i} className="theme-card__dot" style={{ background: color }} />
                ))}
              </div>
              <span className="theme-card__label">{t.label}</span>
              {theme === t.id && (
                <span className="theme-card__check">
                  <CheckIcon />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
