<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let /**
     * @description
     *  📣 button state
     */
    active = false;

  export let /**
     * @description
     *  📣 button size
     */
    size: "sm" | "md" | "lg" | "" = "";

  /**
   * @description
   *  📣 dispatch for click event
   */
  const dispatch = createEventDispatcher();

  // #endregion ➤ 📌 VARIABLES
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

<div
  class="tag-pill {size}"
  {...$$restProps}
  class:active
  on:click={() => dispatch("click")}
>
  <span class="w-400 color-black-2 no-wrap">
    <slot />
  </span>
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
  .tag-pill {
    padding: 3px 12px;
    width: max-content;
    border-radius: 100px;
    color: var(--text-color);
    background-color: var(--tag-bg);

    font-size: var(--text-button-size);
    transition: all;
    transition-duration: 0.4s;
    cursor: pointer;

    &.sm {
      font-size: 12px;
      padding: var(--spacing-xxs) var(--spacing-md);
    }

    &.md {
      padding: 3px 10px;
      font-size: 14px;
    }

    &.lg {
      padding: var(--spacing-xs, 4px) var(--spacing-lg, 12px);
      font-size: 14px;
    }

    &:hover,
    &.active {
      /* 🎨 style */
      background-color: var(--primary) !important;

      span {
        /* 🎨 style */
        color: var(--white) !important;
      }
    }

    &.active:hover {
      background-color: var(--primary-fade) !important;
    }
  }
</style>
