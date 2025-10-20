import { useThemeContext } from '@components/ThemeContext';
import { Button } from '@components/Button';

export const Header = () => {
  const [theme, toggleTheme] = useThemeContext();

  return (
    <Button onClick={toggleTheme}>{theme()}</Button>
  )
}
