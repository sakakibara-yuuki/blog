import '@components/Theme.css';
import { type ParentComponent, children } from 'solid-js';
import { createContext, useContext } from 'solid-js';

export enum Theme {
  dark = "dark",
  light = "light"
}

export const ThemeContext = createContext<Theme>(Theme.dark)
export const useThemeContext =  () => useContext(ThemeContext)
export const ThemeProvider: ParentComponent<{ theme: Theme }> = (props) => {
  const safeChildren = children(() => props.children);

  return (
    <ThemeContext.Provider value={props.theme}>
      <div classList={{ "dark--theme": props.theme == Theme.dark, "light--theme": props.theme == Theme.light }}>
        {safeChildren()}
      </div>
    </ThemeContext.Provider>
  )
}
