import { createSignal } from 'solid-js';
import { Theme, ThemeProvider, useThemeContext } from '@components/ThemeContext';
import { Button } from '@components/Button';

export const Header = () => {

  const initTheme = useThemeContext()
  const [theme, setTheme] = createSignal<Theme>(initTheme);
  const toggleTheme = () => setTheme(theme() == Theme.dark ? Theme.light : Theme.dark)

  return (
    <Button onClick={toggleTheme}>{theme()}</Button>
  )
}
