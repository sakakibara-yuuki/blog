import { createSignal } from 'solid-js';
import { type ParentComponent, children } from 'solid-js';
import { createContext, useContext } from 'solid-js';


const Button: ParentComponent<{ onClick?: () => void }> = (props) => {
  const safeChildren = children(() => props.children);
  return (
    <button onClick={props.onClick} >
      {safeChildren()}
    </button>
  )
}

enum Theme {
  dark = "dark",
  light = "light",
  system = "system",
}

export const ThemeContext = createContext<Theme>(Theme.dark)

export const ThemeProvider: ParentComponent = (props) => {

  const theme = useContext(ThemeContext)

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export const Header = () => {

  const [theme, setTheme] = createSignal<Theme>(Theme.dark);

  return (
    <div>
      <Button onClick={() => setTheme(theme() == Theme.dark ? Theme.light : Theme.dark)}>{theme()}</Button>
    </div>
  )
}
