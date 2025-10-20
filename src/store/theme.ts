import { atom } from 'nanostores';

export enum Theme {
  dark = "dark",
  light = "light"
}

export const theme = atom(Theme.dark);
