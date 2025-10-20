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

  import Change from "./Change.svelte";
  import TweenedNumber from "./TweenedNumber.svelte";

  // #endregion ➤ 📦 Package Imports
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
  export let text = "";
  export let number = 0;
  export let change = 6.2;
  export let menu = false;
  export let supportText = "";
  export let animation = false;

  // #endregion ➤ 📌 VARIABLES
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->
<div class="metric-chart-1">
  <div class="text-wrapper">
    <div class="title">
      {text}
      <!-- menu not implemented yet -->
      {#if menu}
        <!-- content here -->
      {/if}
    </div>
  </div>
  <div class="data-chart-wrapper">
    <div class="data-wrapper">
      <div class="number">
        <slot name="number">
          {#if animation}
            <TweenedNumber {number} fixNumber={2}/>
          {:else}
            {number}
          {/if}
        </slot>
      </div>
      <div class="change-wrapper">
        <Change {change} type="first" />
        {#if supportText}
          <span class="support-text">{supportText}</span>
        {/if}
      </div>
    </div>
    <!-- charts are not implemented yet -->
    <!-- <div class="chart-wrapper"></div> -->
  </div>
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .metric-chart-1 {
    display: flex;
    flex-direction: column;
    max-width: 343px;
    width: 100%;
    padding: var(--spacing-2xl, 20px);
    align-items: flex-start;
    gap: var(--spacing-2xl, 20px);
    border-radius: var(--radius-xl, 12px);

    border: 1px solid var(--colors-border-border-secondary, #ededed);
    background: var(--colors-background-bg-primary, #fff);

    /* Shadows/shadow-xs */
    box-shadow: 0 1px 2px 0
      var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05));

    .text-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-md, 8px);
      flex: 1 0 0;

      .title {
        color: var(--colors-text-text-primary-900, #000);
        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    .data-chart-wrapper {
      display: flex;
      align-items: flex-end;
      gap: var(--spacing-xl, 16px);
      align-self: stretch;

      .data-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-lg, 12px);
        flex: 1 0 0;

        .number {
          color: var(--colors-text-text-primary-900, #000);

          /* Display sm/Semibold */
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-sm, 30px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-sm, 38px); /* 126.667% */
        }

        .change-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-md, 8px);
          align-self: stretch;

          .support-text {
            overflow: hidden;
            color: var(--colors-text-text-tertiary-600, #6a6a6a);
            text-overflow: ellipsis;

            /* Text sm/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          }
        }
      }
    }
  }
</style>
