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

  import { page } from "$app/stores";
  import { routeIdNotifications } from "$lib/constants/paths.js";
    import { notifications } from "$lib/firebase/notifications.js";
  $: count = $notifications.length;
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

<a
  href="/notifications"
  class="notification-wrapper"
  class:active={$page.route.id === routeIdNotifications}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    class="bell-icon"
    style="position:relative;"
  >
    <g class="bell-body">
      <path
        d="M11.5275 4.7925V4.0275C11.5275 3.18417 10.8442 2.5 10 2.5V2.5C9.15587 2.5 8.47253 3.18417 8.47253 4.0275V4.7925"
        stroke="var(--text-color)"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.46921 8.48994V8.48994C5.46921 6.40411 7.16004 4.71411 9.24504 4.71411H10.7559C12.8417 4.71411 14.5317 6.40494 14.5317 8.48994V8.48994V10.8208C14.5317 11.2624 14.7075 11.6866 15.02 11.9991L15.5542 12.5333C15.8667 12.8458 16.0425 13.2699 16.0425 13.7116V13.7116C16.0425 14.5816 15.3375 15.2866 14.4675 15.2866H5.53337C4.66337 15.2866 3.95837 14.5816 3.95837 13.7116V13.7116C3.95837 13.2699 4.13421 12.8458 4.44671 12.5333L4.98087 11.9991C5.29337 11.6866 5.46921 11.2624 5.46921 10.8208V8.48994Z"
        stroke="var(--text-color)"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <path
      d="M8.09009 15.2867V15.5909C8.09009 16.6451 8.94509 17.5001 10.0001 17.5001V17.5001C11.0551 17.5001 11.9101 16.6451 11.9101 15.5901V15.2859"
      stroke="var(--text-color)"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="bell-clapper"
    />
  </svg>
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
    border-radius: var(--radius-xs);
    height: 28px;
    width: 28px;

    .bell-icon {
      transition: transform 0.3s ease;
    }

    .bell-clapper {
      transition: transform 0.3s ease;
      transform-origin: top center;
    }
    .bell-body {
      transform-origin: top center;
      transition: transform 0.3s ease;
    }

    &:hover {
      --text-color: var(--primary);
      background-color: var(--background-bg-primary_hover);

      .bell-clapper {
        animation: clapper-swing 0.7s ease-in-out;
      }
      .bell-body {
        animation: bell-swing 0.7s ease-in-out;
      }
    }
    &.active {
      --text-color: var(--primary);
    }
    .count {
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--background-bg-error-solid);
      color: var(--white);
      text-align: center;
      font-family: Roboto;
      font-size: 10px;
      font-style: normal;
      color: var(--text-text-white);
      text-align: center;
      font-family: Roboto;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%; /* 13px */
      font-weight: 500;
      line-height: 130%; /* 13px */
      display: flex;
      padding: var(--spacing-none, 0px) var(--spacing-xxs, 2px);
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      position: absolute;
      right: 1px;
      top: 1px;
      border-radius: 3px;
    }
  }

  @keyframes bell-swing {

    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(10deg);
    }
  }

  @keyframes clapper-swing {
    0%,
    100% {
      transform: rotate(0deg);
    }
    35% {
      transform: rotate(-8deg);
    }
    70% {
      transform: rotate(8deg);
    }
    85% {
      transform: rotate(-6deg);
    }
    95% {
      transform: rotate(2deg);
    }
  }
</style>
