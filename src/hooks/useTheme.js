import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
