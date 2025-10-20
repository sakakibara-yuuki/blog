import { Button } from '@components/Button';
import { useStore } from '@nanostores/solid';
import { Theme, theme } from '@store/theme';

export const Header = () => {

  const $theme = useStore(theme);

  const toggleTheme = () => {
    theme.set($theme() == Theme.dark ? Theme.light : Theme.dark);
  }

  return (
    <Button onClick={toggleTheme}>{$theme()}</Button>
  )
}
