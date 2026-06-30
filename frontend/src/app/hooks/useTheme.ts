import { useEffect } from 'react';

export function useTheme() {
  const theme = 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    // No-op
  };

  return { theme, toggleTheme };
}
