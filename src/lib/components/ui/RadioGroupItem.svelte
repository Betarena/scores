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

  import Checkbox from "./Checkbox.svelte";

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
  export let selected = false;
  export let disabled = false;
  export let size: "sm" = "sm";

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
<div class="radio-group-item {size}" class:selected class:disabled on:click={() => (selected = !selected)} tabindex="0">
  <div class="content">
    <slot>
        <slot name="icon"></slot>
        <slot name="content"></slot>
    </slot>
  </div>
  <Checkbox bind:checked={selected} />
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
  .radio-group-item {
    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--colors-border-border-secondary, #ededed);
    background: var(--colors-background-bg-primary, #fff);

    display: flex;
    align-items: flex-start;
    &.selected {
      border: 2px solid var(--colors-border-border-brand, #f5620f);
    }
    &.disabled {
      border: 1px solid var(--colors-border-border-disabled_subtle, #ededed);
      background: var(--colors-background-bg-disabled_subtle, #fbfbfb);
      pointer-events: none;
    }

    &:hover {
      background: var(--colors-background-bg-primary, #fff);
    }
    &:focus,
    &:focus-within {
      box-shadow: 0 0 0 2px var(--colors-background-bg-primary, #fff),
        0 0 0 4px var(--colors-effects-focus-rings-focus-ring, #f5620f);
    }

    .content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      flex: 1 0 0;
    }

    &.sm {
      gap: var(--spacing-xs, 4px);
      max-width: 343px;
      width: 100%;
      padding: var(--spacing-xl, 16px);
    }

    
  }
</style>
