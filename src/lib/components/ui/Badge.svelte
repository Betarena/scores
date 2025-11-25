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

  export let size: "sm" | "md" | "lg" | "xl" | "xxl" = "md";
  export let color:
    | "gray"
    | "error"
    | "brand"
    | "success"
    | "warning"
    | "orange"
    | undefined = "gray";
  export let active: boolean = false;
  export let link = "";
  export let hover = true;

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

{#if link}
  <a
    href={link}
    class="badge {size} {color}"
    class:active
    class:hover={hover}
    {...$$restProps}
    on:click={() => dispatch("click")}
  >
    <slot name="icon" />
    <slot />
  </a>
{:else}
  <div
    class="badge {size} {color}"
    class:active
    class:hover={hover}
    {...$$restProps}
    on:click={() => dispatch("click")}
  >
    <slot name="icon" />
    <slot />
  </div>
{/if}

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
  .badge {
    color: var(--component-colors-utility-gray-utility-gray-700, #d2d2d2);
    text-align: center;
    display: flex;
    padding: var(--spacing-xxs, 2px) var(--spacing-md, 8px);
    align-items: center;

    border-radius: var(--radius-full, 9999px);
    border: 1px solid
      var(--component-colors-utility-gray-utility-gray-200, #525252);
    background: var(--component-colors-utility-gray-utility-gray-50, #313131);

    /* Text xs/Regular */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-xs, 12px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-height-text-xs, 18px); /* 150% */

    &.sm {
      padding: var(--spacing-xxs, 2px) var(--spacing-md, 8px);
      font-size: var(--font-size-text-xs, 12px);
      line-height: var(--line-height-text-xs, 18px); /* 142.857% */
    }
    &.md {
      padding: var(--spacing-xxs, 2px) 10px;
      font-size: var(--font-size-text-sm, 14px);
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */
    }
    &.lg {
      padding: var(--spacing-xs, 4px) var(--spacing-lg, 12px);
      font-size: var(--font-size-text-sm, 14px);
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */
    }
    &.xl {
      display: inline-flex;
      padding: var(--spacing-sm, 6px) 14px;

      /* Text sm/Regular */
      font-size: var(--font-size-text-sm, 14px);
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */
    }

    &.xxl {
      padding: var(--spacing-md, 8px) var(--spacing-xl, 16px);

      /* Text md/Regular */
      font-size: var(--font-size-text-md, 16px);
      line-height: var(--line-height-text-md, 24px); /* 150% */
    }

    &.brand {
      border: 1px solid
        var(--component-colors-utility-brand-utility-brand-200, #fcd5c0);
      color: var(--component-colors-utility-brand-utility-brand-700, #ae460b);

      background: var(
        --component-colors-utility-brand-utility-brand-50,
        #fef5f0
      );

      &.active, &.hover:hover {
        border: 1px solid
          var(--component-colors-utility-brand-utility-brand-500, #ae460b);
        color: var(--colors-text-text-white, #fff);

        background: var(
          --component-colors-utility-brand-utility-brand-500,
          #fef5f0
        );
      }
      &.hover {
        cursor: pointer;
      }
    }

    &.gray {
      border: 1px solid
        var(--component-colors-utility-gray-utility-gray-200, #ededed);
      background: var(--component-colors-utility-gray-utility-gray-50, #fbfbfb);
      color: var(--component-colors-utility-gray-utility-gray-700, #525252);

      &.active, &.hover:hover {
        border: 1px solid
          var(--component-colors-utility-gray-utility-gray-200, #ededed);
        background: var(
          --component-colors-utility-gray-utility-gray-200,
          #ededed
        );
        color: var(--component-colors-utility-gray-utility-gray-800, #3b3b3b);
      }
      &.hover {
        cursor: pointer;
      }
    }

    &.success {
      color: var(
        --component-colors-utility-success-utility-success-700,
        #067647
      );
      border: 1px solid
        var(--component-colors-utility-success-utility-success-200, #abefc6);
      background: var(
        --component-colors-utility-success-utility-success-50,
        #ecfdf3
      );
    }
    &.warning {
      color: var(
        --component-colors-utility-warning-utility-warning-700,
        #b54708
      );
      border: 1px solid
        var(--component-colors-utility-warning-utility-warning-200, #fedf89);
      background: var(
        --component-colors-utility-warning-utility-warning-50,
        #fffaeb
      );
    }
    &.orange {
      color: var(--component-colors-utility-orange-utility-orange-700, #b93815);
      border: 1px solid
        var(--component-colors-utility-orange-utility-orange-200, #f9dbaf);
      background: var(
        --component-colors-utility-orange-utility-orange-50,
        #fef6ee
      );
    }
  }
  a.badge {
    &.gray:hover {
      border: 1px solid
        var(--component-colors-utility-gray-utility-gray-200, #ededed);
      background: var(
        --component-colors-utility-gray-utility-gray-200,
        #ededed
      );
      color: var(--component-colors-utility-gray-utility-gray-800, #3b3b3b);
    }
    &.brand:hover {
      border: 1px solid
        var(--component-colors-utility-brand-utility-brand-500, #ae460b);
      color: var(--colors-text-text-white, #fff);

      background: var(
        --component-colors-utility-brand-utility-brand-500,
        #fef5f0
      );
    }
  }
</style>
