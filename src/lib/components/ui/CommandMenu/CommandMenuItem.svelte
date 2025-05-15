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

  export let textType = "default";
  export let text = "";
  export let supportingText = "";

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
<div class="item-wrapper">
  <div class="content">
    {#if $$slots}
      <div class="icon">
        <slot />
      </div>
    {/if}
    <div class="text-content">
      <span class="main-text">
        {text}
      </span>
      <span class="support-text">
        {supportingText}
      </span>
    </div>
  </div>
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
  .item-wrapper {
    display: flex;
    padding: var(--spacing-xxs, 2px) var(--spacing-md, 8px);
    align-items: center;
    gap: var(--spacing-md, 8px);
    cursor: pointer;
    width: 100%;

    .content {
      display: flex;
      padding: var(--spacing-md, 8px) var(--spacing-md, 8px)
        var(--spacing-md, 8px) 10px;
      align-items: center;
      gap: var(--spacing-md, 8px);
      flex: 1 0 0;

      border-radius: var(--radius-md, 8px);

      &:hover {
        background: var(--colors-background-bg-primary_hover, #fbfbfb);
      }
      .icon {
        color: var(--colors-foreground-fg-quaternary-500);
      }
      .text-content {
        display: flex;
        align-items: baseline;
        gap: var(--spacing-md, 8px);
        flex: 1 0 0;

        .main-text {
          color: var(--colors-text-text-primary, #313131);

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }

        .support-text {
          color: var(--colors-text-text-tertiary-600, #6a6a6a);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
  }
</style>
