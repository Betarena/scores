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

  export let width: number | string = 200,
    height: number | string = 50,
    href = "";

  export let /**
     * @description
     *  button styles: primary | outline
     */ // eslint-disable-next-line no-unused-vars
    type: "primary" | "outline" = "primary";

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

<button class="button {type}" { ...$$restProps} on:click={() => dispatch("click")}>
  <slot />
</button>

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
  .button {
    display: flex;
    padding: 9px 20px;
    align-items: center;
    gap: 8px;
    font-size: var(--text-button-size);
    border-radius: 8px;
    text-align: center;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
    cursor: pointer;
  }

  .primary {
    background: var(--primary, #f5620f);
    color: var(--white-day, #fff);

    /* shadow/orange */
    box-shadow: 0px 3px 8px 0px rgba(212, 84, 12, 0.32);

    &:hover {
      background: var(--primary-fade, #f5620f);
    }
  }

  .outline {
    color: var(--text-color);
    background: transparent;
    border: 1px solid var(--text-color) !important;
    transition: all;
    transition-duration: 0.6s;

    &:hover {
      border: 1px solid var(--primary) !important;
      color: var(--primary);
    }
  }
</style>
