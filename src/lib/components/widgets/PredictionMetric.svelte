<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import session from "$lib/store/session";

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

  export let number: string | number = 0;
  export let coefficient: string | number = 0;
  export let probability = "0%";
  export let type: "normal" | "green" = "normal";

  $: ({viewportType} = $session)
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
<div class="metric-wrapper {type} {viewportType}">
  <div class="heading-number">
    <div class="number-badge">
      <div class="number-change">
        <div class="number">{number}</div>
        <div class="change">{coefficient}</div>
      </div>
    </div>
    <div class="probability">{probability}</div>
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
  .metric-wrapper {
    display: flex;
    width: 90px;
    height: 90px;
    flex-grow: 1;
    max-width: 122px;
    height: auto;
    flex-shrink: 0;
    padding: var(--spacing-2xl, 20px) var(--spacing-xl, 16px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-xl, 16px);

    border-radius: var(--radius-xl, 12px);
    border: 2px solid var(--colors-border-border-disabled, #525252);
    background: var(--colors-background-bg-primary, #1f1f1f);

    /* Shadows/shadow-xs */
    box-shadow: 0 1px 2px 0
      var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
    .heading-number {
      display: flex;
      width: 66px;
      height: 61px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      .number-badge {
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 12px var(--spacing-xl, 16px);
        align-self: stretch;
        flex-wrap: wrap;

        .number-change {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: var(--spacing-xs, 4px);
          .number {
            width: 28px;
            height: 30px;
            color: var(--colors-text-text-primary-900, #fff);
            text-align: center;

            /* Display xs/Semibold */
            font-family: var(--font-family-font-family-display, Roboto);
            font-size: var(--font-size-display-xs, 24px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-xs, 32px); /* 133.333% */
          }
          .change {
            color: var(--colors-text-text-success-primary-600, #47cd89);
            text-align: center;

            /* Text sm/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          }
        }
      }
      .probability {
        align-self: stretch;
        display: flex;
        min-width: 28px;
        justify-content: center;
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        text-align: center;

        /* Text xs/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-xs, 12px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-xs, 18px); /* 150% */
      }
    }

    &.green {
      border-radius: var(--radius-xl, 12px);
      border: 2px solid var(--colors-border-border-brand, #f7813f);
      background: var(--colors-background-bg-success-primary, #053321);

      /* Shadows/shadow-xs */
      box-shadow: 0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
    }
    &.mobile {
      height: 90px;
    }
  }
</style>
