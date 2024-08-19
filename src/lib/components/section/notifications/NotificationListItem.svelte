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
  $: ({ isNew = true, body, title, date, status } = notification);
  $: match =  body.match(/\d+\sBTA/);
  $: amount = match ? match[0] : "";
  $: textContent = amount ? body.split(amount) : [body];
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
    <div class="body">
      {textContent[0]}
      {#if textContent.length > 1}
        <span class="amount">{amount}</span>
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

      .body {
        color: var(--text-text-tertiary, #e6e6e6);
        /* body sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-body-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-body-sm, 20px)
      }

      .title,
      .amount {
        color: var(--colors-brand-5);

        /* body sm/Semibold */
        font-family: var(--font-family-font-family-display);
        font-size: var(--font-size-body-sm);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-body-sm);
      }

      .time-ago {
        color: var(--body-body-tertiary, #9d9d9d);
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
      background-color: var(--colors-brand-5);
      border-radius: 50%;
    }
  }
</style>
