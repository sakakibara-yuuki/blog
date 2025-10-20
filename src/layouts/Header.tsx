// --- Button
import { type ParentComponent, children } from 'solid-js';

const Button: ParentComponent<{ onClick?: () => void }> = (props) => {
  const safeChildren = children(() => props.children);
  return (
    <button onClick={props.onClick} >
      {safeChildren()}
    </button>
  )
}

// --- Header
import { createSignal } from 'solid-js';
import { Theme, ThemeProvider, useThemeContext } from '@components/ThemeContext';

export const Header = () => {

  const initTheme = useThemeContext()
  const [theme, setTheme] = createSignal<Theme>(initTheme);
  const toggleTheme = () => setTheme(theme() == Theme.dark ? Theme.light : Theme.dark)

  return (
    <div classList={{ "dark": theme() == Theme.dark, "light": theme() == Theme.light }}>
      <ThemeProvider theme={theme()}>
        <Button onClick={toggleTheme}>{theme()}</Button>
      </ThemeProvider>
    </div>
  )
}
