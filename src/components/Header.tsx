import "./Header.css"
import { Button } from '@components/Button';
import { Search } from  '@components/Search';
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
        some icon
      </div>
      <Search />
      <nav>
        <Button onClick={toggleTheme}>{$theme()}</Button>
        <Button onClick={toggleTheme}>menu</Button>
      </nav>
    </header>
  )
}
