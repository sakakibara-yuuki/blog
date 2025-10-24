import type { ParentComponent } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { Theme, theme } from '@store/theme';

export const ThemeProvider: ParentComponent = (props) => {

  const $theme = useStore(theme);

  return (
    <div classList={{
      'dark-theme': $theme() == Theme.dark,
      'light-theme': $theme() == Theme.light,
      'theme-container': true
    }}>
      {props.children}
    </div>
  )
}
