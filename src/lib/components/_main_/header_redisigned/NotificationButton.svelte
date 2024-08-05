<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
    import { scale } from "svelte/transition";
  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import NotifiicationsIcon from "./assets/NotifiicationsIcon.svelte";
  let count = 0;
  setTimeout(() => {
    count = 18
  }, 2500)
  // #endregion ➤ 📦 Package Imports
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<a href="/notifications" class="notification-wrapper">
  <NotifiicationsIcon />
  {#if count}
    <div class="count" in:scale>{count}</div>
  {/if}
</a>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .notification-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      --text-color: var(--primary);
    }
    .count {
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--primary);
      color: var(--white);
      text-align: center;
      font-family: Roboto;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%; /* 13px */
      display: flex;
      padding: var(--spacing-none, 0px) var(--spacing-xxs, 2px);
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      position: absolute;
      right: -5px;
      top: -3px;
      border-radius: 3px;
    }
  }
</style>
