<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports
  import { timeAgo } from "$lib/utils/dates.js";
  import CompetitonStarted from "./assets/CompetitonStarted.svelte";
  import WinIcon from "./assets/WinIcon.svelte";

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

  export let notification;
  $: ({ isNew = true, text, amount, title, date, status } = notification);
  $: textContent = text.split("{count}") || [];
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

<div class="notification">
  <div class="img">
    {#if status === "won"}
      <WinIcon />
    {:else}
      <CompetitonStarted />
    {/if}
  </div>
  <div class="content">
    <div class="text">
      {textContent[0]}
      {#if textContent.length > 1}
          <span class="amount">{amount} BTA</span>
          {textContent[1]}
      {/if}
    </div>
    <div class="title">{title}</div>
    <div class="time-ago">{timeAgo(date)}</div>
  </div>
  {#if isNew}
    <div class="new-icon" />
  {/if}
</div>

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
  .notification {
    display: flex;
    align-items: start;
    justify-content: flex-start;
    gap: var(--spacing-xl);

    .content {
      flex-grow: 1;
      color: var(--Text-text-secondary);

      /* Text sm/Regular */
      font-family: var(--Font-family-font-family-display);
      font-size: var(--Font-size-text-sm);
      font-style: normal;
      font-weight: 400;
      line-height: var(--Line-height-text-sm);

      .title, .amount {
        color: var(--Colors-Brand-Brand-5);

        /* Text sm/Semibold */
        font-family: var(--Font-family-font-family-display);
        font-size: var(--Font-size-text-sm);
        font-style: normal;
        font-weight: 600;
        line-height: var(--Line-height-text-sm);
      }

      .time-ago {
        color: var(--Text-text-tertiary, #9d9d9d);
        font-size: 10px;
        font-style: normal;
        margin-top: 4px;
        font-weight: 400;
        line-height: 14px;
      }
    }
    .new-icon {
      width: 10px;
      height: 10px;
      background-color: var(--Colors-Brand-Brand-5);
      border-radius: 50%;
    }
  }
</style>
