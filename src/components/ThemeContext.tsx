import '@components/Theme.css';
import { type ParentComponent, children, createSignal, type Accessor, createEffect } from 'solid-js';
import { createContext, useContext } from 'solid-js';

export enum Theme {
  dark = "dark",
  light = "light"
}

type ThemeContextType = [Accessor<Theme>, () => void]

export const ThemeContext = createContext<ThemeContextType>([() => Theme.dark, () => { }])


export const ThemeProvider: ParentComponent = (props) => {
  const safeChildren = children(() => props.children);
  const [theme, setTheme] = createSignal<Theme>(Theme.dark);
  const toggleTheme = () => {
    setTheme(prev => prev == Theme.dark ? Theme.light : Theme.dark)
  }

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', theme())
  })

  return (
    <ThemeContext.Provider value={[theme, toggleTheme]}>
      <div classList={{ "dark--theme": theme() == Theme.dark, "light--theme": theme() == Theme.light }}>
        {safeChildren()}
      </div>
    </ThemeContext.Provider>
  )
}


export const useThemeContext = () => useContext(ThemeContext)
