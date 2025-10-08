<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
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

  export let group: { id: string; label: string }[] = [];
  export let selected;
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  function click(item) {
    selected = item;
  }

  // #endregion ➤ 🛠️ METHODS
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

<div class="button-group">
  {#each group as button}
    <div
      class="base-button"
      class:current={selected?.id === button.id}
      on:click={() => click(button)}
    >
      {button.label}
    </div>
  {/each}
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
  .button-group {
    display: inline-flex;
    align-items: flex-start;
    border: 1px solid var(--colors-border-border-primary, #d2d2d2);
    border-radius: var(--radius-md, 8px);
    /* Shadows/shadow-xs-skeuomorphic */
    box-shadow: 0 0 0 1px
        var(
          --colors-effects-shadows-shadow-skeumorphic-inner-border,
          rgba(10, 13, 18, 0.18)
        )
        inset,
      0 -2px 0 0 var(
          --colors-effects-shadows-shadow-skeumorphic-inner,
          rgba(10, 13, 18, 0.05)
        ) inset,
      0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05));

    .base-button {
      display: inline-flex;
      min-height: 40px;
      cursor: pointer;
      padding: var(--spacing-md, 8px) var(--spacing-xl, 16px);
      justify-content: center;
      align-items: center;
      gap: var(--spacing-sm, 6px);

      border-right: 1px solid var(--colors-border-border-primary, #d2d2d2);
      background: var(--colors-background-bg-primary, #fff);

      color: var(--colors-text-text-secondary-700, #525252);

      /* Text sm/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-sm, 14px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */

      &:hover {
        background: var(--colors-background-bg-primary_hover, #fbfbfb);
        color: var(--colors-text-text-secondary_hover, #3b3b3b);
      }
      &:focus,
      &:focus-within {
        box-shadow: 0 0 0 2px var(--colors-background-bg-primary, #fff),
          0 0 0 4px var(--colors-effects-focus-rings-focus-ring, #f5620f);
      }

      &.disabled {
        color: var(--colors-text-text-disabled, #727171);
      }

      &.current {
        background: var(--colors-background-bg-active, #fbfbfb);
        &:focus,
        &:focus-within {
          background: var(--colors-background-bg-active, #fbfbfb);
          color: var(--colors-text-text-secondary_hover, #3b3b3b);
          box-shadow: 0 0 0 2px var(--colors-background-bg-primary, #fff),
            0 0 0 4px var(--colors-effects-focus-rings-focus-ring, #f5620f);
        }

        &.disabled {
          background: var(--colors-background-bg-disabled_subtle, #fbfbfb);
        }
      }

      &:last-child {
        border-right: none;
        border-top-right-radius: var(--radius-md, 8px);
        border-bottom-right-radius: var(--radius-md, 8px);
      }
      &:first-child {
        border-top-left-radius: var(--radius-md, 8px);
        border-bottom-left-radius: var(--radius-md, 8px);
      }
    }
  }
</style>
