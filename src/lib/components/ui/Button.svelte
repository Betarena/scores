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
    classname: string = "",
    full = false,
    href = "";
  export let disabled = false;

  export let /**
     * @description
     *  button styles: primary | outline
     */ // eslint-disable-next-line no-unused-vars
    type:
      | "primary"
      | "outline"
      | "secondary"
      | "secondary-gray"
      | "primary-outline"
      | "subtle" = "primary";

    export let submit = false;

  const dispatch = createEventDispatcher();
  let hover = false;
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

<button
  class="button {type} {classname}"
  class:full
  class:disabled
  {...$$restProps}
  type={submit ? "submit" : "button"}
  class:hover
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
  on:touchend={() => (hover = false)}
  on:mouseup={() => (hover = false)}
  on:click={() => {
    if (disabled) return;
    dispatch("click");
    hover = false;
  }}
>
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

  .full {
    width: 100%;
  }

  .primary {
    background: var(--primary, #f5620f);
    color: var(--white-day, #fff);
    border: 1px solid var(--primary) !important;

    /* shadow/orange */
    box-shadow: 0px 3px 8px 0px rgba(212, 84, 12, 0.32);

    &.hover {
      background: var(--primary-fade, #f5620f);
      border: 1px solid var(--primary-fade) !important;
    }

    &.disabled {
      background: var(--primary-fade, #f5620f);
      border: 1px solid var(--primary-fade) !important;
      cursor: not-allowed;
    }
  }
  .subtle {
    background: unset;
    border: 1px solid var(--button-secondary-bg) !important;
    color: var(--text-color);

    &.hover {
      color: var(--text-color-second-dark);
    }
  }

  .primary-outline {
    border: 1px solid var(--primary-fade, #f5620f) !important;
    color: var(--primary);
    background-color: unset;

    &.hover {
      border: 1px solid var(--text-color) !important;
      color: var(--text-color);
    }
  }

  .outline {
    color: var(--text-color);
    background: transparent;
    border: 1px solid var(--text-color) !important;
    transition: all;
    transition-duration: 0.2s;

    &.hover {
      border: 1px solid var(--primary) !important;
      color: var(--primary);
    }
  }

  .secondary {
    background-color: var(--button-secondary-bg);
    color: var(--text-color);

    &.hover {
      background: var(--primary, #f5620f);
      color: var(--white-day, #fff);
    }
  }
  .secondary-gray {
    background-color: var(--button-secondary-bg2);
    border: 1px solid var(--button-secondary-border) !important;
    color: var(--button-secondary-fg);

    &.hover {
      background-color: var(--button-secondary-bg);
      color: var(--text-color);
    }
  }
</style>
