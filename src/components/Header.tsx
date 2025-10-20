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

// -export const ThemeProvider: ParentComponent = (props) => {
// -  const safeChildren = children(() => props.children);
// -  const [theme, setTheme] = createSignal<Theme>(Theme.dark);
// -  const toggleTheme = () => {
// -    setTheme(prev => prev == Theme.dark ? Theme.light : Theme.dark)
// -  }
// -
// -  createEffect(() => {
// -    document.documentElement.setAttribute('data-theme', theme())
// -  })
// -
// -  return (
// -    <ThemeContext.Provider value={[theme, toggleTheme]}>
// -      <div classList={{ "dark--theme": theme() == Theme.dark, "light--theme": theme() >
// -        {safeChildren()}
// -      </div>
// -    </ThemeContext.Provider>
// -  )
// -}
//
