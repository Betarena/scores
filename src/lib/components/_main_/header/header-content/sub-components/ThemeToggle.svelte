<script lang="ts">
  // #region ➤ 📦 Package Imports
  import iconDarkMode from "$lib/components/_main_/header/assets/moon-fill.svg";
  import iconLightMode from "$lib/components/_main_/header/assets/sun-fill.svg";
  import {
    getDarkThemeContext,
    setDarkThemeContext,
  } from "$lib/context/dark-theme-context";

  // #endregion ➤ 📦 Package Imports

  let isDark = getDarkThemeContext();
  $: src = $isDark ? iconDarkMode : iconLightMode;
  $: alt = $isDark ? "icon_dark_mode" : "icon_light_mode";
  $: title = $isDark ? "Enable Light Mode" : "Enable Dark Mode";

  const toggleTheme = () => {
    setDarkThemeContext(!$isDark);
  };
</script>

<button class="cursor-pointer theme-toggle-component" on:click={toggleTheme}>
  <img
    loading="lazy"
    {src}
    {alt}
    {title}
    width="16px"
    height="16px"
    class:light={!$isDark}
  />
</button>

<style lang="scss">
  .theme-toggle-component {
    height: 24px;
    width: 44px;
    /* 🎨 style */
    background: var(--dark-theme-1);
    border-radius: 24px;
    flex-direction: column;
    justify-content: center;
    padding: 0 2px;
    img {
      width: 20px;
      height: 20px;
      /* 🎨 style */
      padding: 4.5px;
      border-radius: 50%;
      background-color: var(--dark-theme);
      align-self: flex-start;
      &.light {
        /* 🎨 style */
        background-color: var(--white);
        align-self: flex-end;
      }
    }
  }
</style>
