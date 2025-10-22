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
  import { createEventDispatcher } from "svelte";
  
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

  export let size: "sm" | "md" = "md";
  export let title = "";
  export let description = "";
  export let step: number = 1;
  export let checked = false;
  export let active = false;
  export let includeConnector = false;
  export let color: "success" | "brand" = "success";
  export let type: "step" | "circle" = "step"
  export let available = false;

  const dispatch = createEventDispatcher()
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

<div class="step-base {size}" class:active={active || checked} class:available on:click={() => dispatch("click")}>
  <div class="connecter-wrapper">
    <div class="check {color} {type}">
      {#if checked && !active}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
        >
          <path
            d="M9 1L3.5 6.5L1 4"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {:else if type === "step"}
        <div class="number">{step}</div>
      {:else}
          <div class="dot"></div>
      {/if}
    </div>
    <div class="connecter">
      {#if !includeConnector}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2"
          height="38"
          viewBox="0 0 2 38"
          fill="none"
        >
          <path
            d="M1 1L1 37"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="0.1 6"
          />
        </svg>
      {/if}
    </div>
  </div>
  <div class="text-wrapper">
    <div class="title">{title}</div>
    <div class="description">{description}</div>
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
  .step-base {
    display: flex;
    width: 344px;
    align-items: flex-start;
    opacity: 0.6;
    cursor: default;
    overflow: hidden;
    

    .connecter-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: stretch;
      stroke: var(--colors-border-border-primary, #d2d2d2);
      flex-shrink: 0;

      .check {
        display: flex;
        width: 24px;
        height: 24px;
        padding: 6px;
        justify-content: center;
        align-items: center;
        border-radius: 9999px;
        border: 1.5px solid var(--colors-border-border-brand_alt, #525252);

        &.circle {
          flex-shrink: 0;
          height: 32px;
          width: 32px ;
          background: var(--colors-background-bg-primary, #1F1F1F);
        }
        .number {
          color: var(--colors-text-text-disabled, #727171);
          text-align: center;

          /* Text sm/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background-color: var(--colors-foreground-fg-disabled_subtle, #6A6A6A);
        }
      }
    }

    .text-wrapper {
      display: flex;
      padding-top: var(--spacing-xxs, 2px);
      flex-direction: column;
      align-items: flex-start;
      flex: 1 0 0;

      .title {
        color: var(--colors-text-text-secondary-700, #525252);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
      .description {
        color: var(--colors-text-text-tertiary-600, #6a6a6a);

        /* Text md/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }

    &.available {
      opacity: 1;
      cursor: pointer;
        .check {
          border: 1px solid  var(--colors-text-text-tertiary-600, #6a6a6a);
          .number {
            color: var(--colors-text-text-tertiary-600, #6a6a6a);
          }
        }
        .text-wrapper {
          .title {
            color: var(--colors-text-text-secondary-700, #525252);
          }
          .description {
            color: var(--colors-text-text-tertiary-600, #6a6a6a);
          }
        }
    }

    &.active {
      // opacity: 1;
        .check {
          background: var(--bg);
          border: none;
          &.brand {
            background: var(--colors-background-bg-brand-solid, #f5620f);
          }
          &.success {
            background-color: var(--colors-background-bg-success-solid, #079455);
          }
          .number {
            color: var(--colors-text-text-white, #fff);
          }
        }
        .text-wrapper {
          .title {
            color: var(--colors-text-text-secondary-700, #525252);
          }
          .description {
            color: var(--colors-text-text-tertiary-600, #6a6a6a);
          }
        }
    }

    &.md {
      gap: var(--spacing-xl, 16px);
      .connecter-wrapper {
        padding-bottom: var(--spacing-md, 8px);
        gap: var(--spacing-md, 8px);

        .check {
          width: 32px;
          height: 32px;
          padding: 8px;

          svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            aspect-ratio: 1/1;
          }
        }
      }
      .text-wrapper {
        padding-top: var(--spacing-xs, 4px);

        .title {
          font-size: var(--font-size-text-md, 16px);
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
        .description {
          font-size: var(--font-size-text-md, 16px);
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
      }
    }

    &.sm {
      gap: var(--spacing-lg, 12px);

      .connecter-wrapper {
        padding-bottom: var(--spacing-sm, 6px);
        gap: var(--spacing-sm, 6px);

        .check {
          width: 24px;
          height: 24px;
          padding: 6px;

          svg {
            width: 8px;
            height: 5.5px;
            flex-shrink: 0;
          }
        }
      }

      .text-wrapper {
        padding-top: var(--spacing-xxs, 2px);

        .title {
          /* Text sm/Semibold */
          font-size: var(--font-size-text-sm, 14px);
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }

        .description {
          /* Text sm/Regular */
          font-size: var(--font-size-text-sm, 14px);
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
  }
</style>
