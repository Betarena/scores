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

  export let change: number | undefined;
  export let type: "first" | "second" | "third" = "third";

  $: positive = change === undefined || change >= 0;
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

<div class="change-wrapper {type}" class:negative={!positive}>
  {#if type === "first"}
    {#if positive}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 12.6667V3.33337M8 3.33337L3.33334 8.00004M8 3.33337L12.6667 8.00004"
          stroke="#17B26A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M7.99999 3.33337V12.6667M7.99999 12.6667L12.6667 8.00004M7.99999 12.6667L3.33333 8.00004"
          stroke="#F04438"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {/if}
  {:else if type === "second"}
    {#if positive}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M14.6667 4.66663L9.42091 9.91238C9.1569 10.1764 9.02489 10.3084 8.87267 10.3579C8.73878 10.4014 8.59455 10.4014 8.46065 10.3579C8.30843 10.3084 8.17643 10.1764 7.91241 9.91238L6.08757 8.08754C5.82356 7.82353 5.69156 7.69152 5.53934 7.64206C5.40544 7.59856 5.26121 7.59856 5.12732 7.64206C4.9751 7.69152 4.84309 7.82353 4.57908 8.08754L1.33333 11.3333M14.6667 4.66663H10M14.6667 4.66663V9.33329"
          stroke="#17B26A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M14.6667 11.3333L9.42092 6.08754C9.15691 5.82353 9.02491 5.69152 8.87269 5.64206C8.73879 5.59856 8.59456 5.59856 8.46067 5.64206C8.30845 5.69152 8.17644 5.82353 7.91243 6.08754L6.08759 7.91238C5.82358 8.17639 5.69157 8.3084 5.53936 8.35785C5.40546 8.40136 5.26123 8.40136 5.12733 8.35785C4.97511 8.3084 4.84311 8.17639 4.5791 7.91238L1.33334 4.66663M14.6667 11.3333H10M14.6667 11.3333V6.66663"
          stroke="#F04438"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {/if}
  {:else if type === "third"}
    {#if positive}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3.5 8.5L8.5 3.5M8.5 3.5H3.5M8.5 3.5V8.5"
          stroke="#17B26A"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3.5 3.5L8.5 8.5M8.5 8.5V3.5M8.5 8.5H3.5"
          stroke="#F04438"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {/if}
    <!-- content here -->
  {/if}
  <span class="text">
    {#if change}
      <TweenedNumber number={change} fixNumber={0} needsToFormat={false} />%
    {:else}
      -
    {/if}
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
  .change-wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xxs, 2px);
    color: var(--colors-text-text-success-primary-600, #079455);

    &.negative {
      color: var(--colors-text-text-error-primary-600, #d92d20);
    }

    &.first,
    &.second {
      height: 20px;
    }

    &.third {
      gap: var(--spacing-xs, 4px);
      padding: var(--spacing-xxs, 2px) var(--spacing-md, 8px)
        var(--spacing-xxs, 2px) var(--spacing-sm, 6px);
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--colors-border-border-primary, #d2d2d2);
      background: var(--colors-background-bg-primary, #fff);

      /* Shadows/shadow-xs */
      box-shadow: 0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05));

      .text {
        color: var(--colors-text-text-secondary-700, #525252);
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
</style>
