import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  { id: 'ocean',    label: 'Ocean',    colors: ['#3B82F6', '#8B5CF6', '#040C1A'] },
  { id: 'charcoal', label: 'Charcoal', colors: ['#00ADB5', '#393E46', '#222831'] },
  { id: 'aurora',   label: 'Aurora',   colors: ['#8B5CF6', '#EC4899', '#0D0621'] },
  { id: 'forest',   label: 'Forest',   colors: ['#10B981', '#059669', '#061412'] },
  { id: 'ivory',    label: 'Ivory',    colors: ['#2563EB', '#7C3AED', '#F8FAFF'] },
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('rc-theme') || 'ocean';
    // Set synchronously to avoid flash of wrong theme
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rc-theme', theme);
  }, [theme]);

  const setTheme = (id) => {
    if (THEMES.some((t) => t.id === id)) setThemeState(id);
  };

  const cycleTheme = () => {
    setThemeState((t) => {
      const idx = THEMES.findIndex((x) => x.id === t);
      return THEMES[(idx + 1) % THEMES.length].id;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
