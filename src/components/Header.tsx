import lightsvg from '@assets/light.svg?url';
import darksvg from '@assets/dark.svg?url';
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
        <Switch>
          <Match when={$theme() == Theme.dark}>
            <Button onClick={toggleTheme}><img src={lightsvg} alt="Switch to light theme" /></Button>
          </Match>
          <Match when={$theme() == Theme.light}>
            <Button onClick={toggleTheme}><img src={darksvg} alt="Switch to dark theme" /></Button>
          </Match>
        </Switch>
        <Button onClick={toggleTheme}>menu</Button>
      </nav>
    </header>
  )
}
