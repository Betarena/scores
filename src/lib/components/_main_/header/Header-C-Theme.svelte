<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from "$app/stores";

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { ROUTE_ID_PROFILE } from "$lib/utils/user.js";

	import icon_dark_mode from './assets/moon-fill.svg';
	import icon_light_mode from './assets/sun-fill.svg';

  // #endregion ➤ 📦 Package Imports

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="component/theme/main"
  class=
  "
    row-space-start
    m-r-30
    cursor-pointer
  "
  on:click={() => userBetarenaSettings.updateData('theme')}
  class:m-r-10={ROUTE_ID_PROFILE == $page.route.id}
  class:row-space-end={$userBetarenaSettings.theme == 'Dark'}
>

  <img
    loading="lazy"
    src={$userBetarenaSettings.theme == 'Dark' ? icon_light_mode : icon_dark_mode}
    alt={$userBetarenaSettings.theme == 'Dark' ? 'icon_light_mode' : 'icon_dark_mode'}
    title={$userBetarenaSettings.theme == 'Dark' ? 'Enable Light Mode' : 'Enable Dark Mode'}
    width=16
    height=16
    class:light={$userBetarenaSettings.theme == 'Dark'}
  />

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#component\/theme\/main
  {
    height: 24px;
    width: 44px;
    /* 🎨 style */
    background: var(--dark-theme-1);
    border-radius: 24px;
  }
  div#component\/theme\/main > img
  {
    width: 20px;
    margin: 2px;
    height: 20px;
    /* 🎨 style */
    padding: 4.5px;
    border-radius: 50%;
    background-color: var(--dark-theme);
  }
  div#component\/theme\/main > img.light
  {
    /* 🎨 style */
    background-color: var(--white);
  }

</style>