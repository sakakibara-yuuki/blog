import "./Header.css"
import { Button } from '@components/Button';
import { useStore } from '@nanostores/solid';
import { Theme, theme } from '@store/theme';

export const Header = () => {

  const $theme = useStore(theme);

  const toggleTheme = () => {
    theme.set($theme() == Theme.dark ? Theme.light : Theme.dark);
  }

  return (
    <header>
      <div class="icon">
        This is good icon
      </div>
      <div class="search">
        good search bar
      </div>
      <nav>
        <div class="button__theme">
          <Button onClick={toggleTheme}>{$theme()}</Button>
        </div>
        <div class="button__menu">
          <Button onClick={toggleTheme}>{$theme()}</Button>
        </div>
      </nav>
    </header>
  )
}
