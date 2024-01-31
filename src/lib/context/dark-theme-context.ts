import { ThemeName } from "$lib/constants";
import { get, readable, type Readable } from "svelte/store";
import userBetarenaSettings from "$lib/store/user-settings.js";

const defaultTheme = ThemeName.Dark;
const isDarkPredicate = (theme: ThemeName) => theme === ThemeName.Dark;

const theme = get(userBetarenaSettings)?.theme || defaultTheme;
const initialValue = isDarkPredicate(theme);

const storeReadable = readable<boolean>(initialValue, (set) =>
  userBetarenaSettings.subscribe((x) => {
    const currentValue = get(storeReadable);
    const newValue = isDarkPredicate(x?.theme);
    if (newValue !== currentValue) {
      set(newValue);
    }
  })
);

export const setDarkThemeContext = (isDark: boolean): Readable<boolean> => {
  const currentTheme = get(userBetarenaSettings)?.theme;
  const currentValue = isDarkPredicate(currentTheme);
  if(currentValue !== isDark) {
    userBetarenaSettings.updateData("theme"); 
  }
  return storeReadable;
}

export const getDarkThemeContext = (): Readable<boolean> => storeReadable;
