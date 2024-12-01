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
      | "terlary-gray"
      | "tertiary"
      | "subtle" = "primary";

  export let submit = false;
  export let size: "lg" | "md" | "sm" | "xl" | "xxl" = "lg";
  export let destructive = false;
  export let icon_leading = false;

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
{#if href}
  <a
    {href}
    class="button {type} {classname} {size}"
    class:full
    class:disabled
    class:icon_leading
    {...$$restProps}
    type={submit ? "submit" : "button"}
    class:hover
    class:destructive
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
  </a>
{:else}
  <button
    class="button {type} {classname} {size}"
    class:full
    class:disabled
    class:icon_leading
    {...$$restProps}
    type={submit ? "submit" : "button"}
    class:hover
    class:destructive
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

    /* Text sm/Medium */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-style: normal;
    font-weight: 500;
    line-height: var(--line-height-text-sm, 20px); /* 142.857% */

    border-radius: var(--radius-md, 8px);

    &.lg {
      padding: 10px calc(var(--spacing-xl, 16px) + var(--spacing-xxs, 2px));
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--line-height-text-md, 24px); /* 150% */
      &.icon_leading {
        padding: var(--spacing-lg, 12px);
      }
    }

    &.md {
      padding: 10px 14px;
      padding: 10px calc(14px + var(--spacing-xxs, 2px));
      &.icon_leading {
        padding: 10px;
      }
    }

    &.sm {
      padding: var(--spacing-md, 8px)
        calc(var(--spacing-lg, 12px) + var(--spacing-xxs, 2px));
      &.icon_leading {
        padding: var(--spacing-md, 8px);
      }
    }

    &.xl {
      padding: var(--spacing-lg, 12px) calc(20px + var(--spacing-xxs, 2px));
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--line-height-text-md, 24px);
      &.icon_leading {
        padding: var(--font-size-text-sm, 14px);
      }
    }

    &.xxl {
      padding: var(--spacing-xl, 16px) calc(22px + var(--spacing-xxs, 2px));
      &.icon_leading {
        padding: var(--spacing-xl, 16px);
      }
    }
  }

  .full {
    width: 100%;
  }

  .primary {
    background: var(
      --component-colors-components-buttons-primary-button-primary-bg,
      #f5620f
    );

    /* Shadows/shadow-xs */
    box-shadow: 0px 1px 2px 0px
      var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));

    color: var(
      --component-colors-components-buttons-primary-button-primary-fg,
      #fff
    );

    &.hover {
      background: var(
        --component-colors-components-иuttons-зrimary-button-primary-bg_hover,
        #f7813f
      );
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));
    }

    &.disabled {
      border: 1px solid var(--colors-border-border-disabled_subtle, #ededed);
      background: var(--colors-background-bg-disabled, #f7f7f7);
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));
      cursor: not-allowed;
      color: var(--colors-foreground-fg-disabled, #8c8c8c);
    }

    &.destructive {
      background: var(
        --component-colors-components-buttons-primary-error-button-primary-error-bg,
        #ff3c3c
      );
      color: var(--colors-foreground-fg-white, #fff);

      &:hover,
      &.hover {
        background: var(
          --component-colors-components-buttons-primary-error-button-primary-error-bg_hover,
          #ea2b2b
        );
        color: var(--colors-foreground-fg-white, #fff);
      }
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

    &.destructive {
      border-radius: var(--radius-md, 8px);
      border: 1px solid
        var(
          --component-colors-components-buttons-secondary-error-button-secondary-error-border,
          #fda29b
        );
      background: var(
        --component-colors-components-buttons-secondary-error-button-secondary-error-bg,
        #fff
      );
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-rffects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));

      color: var(
        --component-colors-components-buttons-secondary-error-button-secondary-error-fg,
        #ff3c3c
      );

      &.hover {
        border: 1px solid
          var(
            --component-colors-components-buttons-secondary-error-button-secondary-error-border_hover,
            #fda29b
          );
        background: var(
          --component-colors-components-buttons-secondary-error-button-secondary-error-bg_hover,
          #fef3f2
        );
        color: var(
          --component-colors-components-buttons-secondary-error-button-secondary-error-fg_hover,
          #ea2b2b
        );
      }
    }
  }
  .secondary-gray {
    color: var(
      --component-colors-components-buttons-secondary-button-secondary-fg,
      #525252
    );
    box-sizing: border-box;

    border: 1px solid
      var(
        --component-colors-components-buttons-secondary-button-secondary-border,
        #d2d2d2
      ) !important;
    background: var(
      --component-colors-components-buttons-secondary-button-secondary-bg,
      #fff
    );
    /* Shadows/shadow-xs */
    box-shadow: 0px 1px 2px 0px
      var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));

    &.hover {
      color: var(
        --component-colors-components-buttons-secondary-button-secondary-fg_hover,
        #3b3b3b
      );

      border: 1px solid
        var(
          --component-colors-components-buttons-secondary-button-secondary-border_hover,
          #d2d2d2
        );
      background: var(
        --component-colors-components-buttons-secondary-button-secondary-bg_hover,
        #fbfbfb
      );
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));
    }

    &.disabled {
      background: var(--colors-background-bg-primary, #fff);
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));
    }
    &.sm {
      padding-block: calc(var(--spacing-md, 8px) - 1px);
    }
  }

  .terlary-gray {
    background: inherit;
    color: var(
      --component-colors-components-buttons-tertiary-button-tertiary-fg,
      #6a6a6a
    );
    :global(path) {
      stroke: var(
        --component-colors-components-buttons-tertiary-button-tertiary-fg,
        #6a6a6a
      );
    }

    &:hover,
    &.hover {
      background: var(
        --component-colors-components-buttons-tertiary-button-tertiary-bg_hover,
        #fbfbfb
      );
      color: var(
        --component-colors-components-buttons-tertiary-button-tertiary-fg_hover,
        #525252
      );
      :global(path) {
        stroke: var(
          --component-colors-components-buttons-tertiary-button-tertiary-fg_hover,
          #525252
        );
      }
    }
  }
  .tertiary {
    background: inherit;
    color: var(
      --component-colors-components-buttons-tertiary-color-button-tertiary-color-fg,
      #f5620f
    );
    &:hover,
    &.hover {
      background: var(
        --component-colors-components-buttons-tertiary-color-button-tertiary-color-bg_hover,
        #fef5f0
      );
      color: var(
        --component-colors-components-buttons-tertiary-color-button-tertiary-color-fg_hover,
        #d4550c
      );
    }
    &.destructive {
      color: var(
        --component-colors-components-buttons-tertiary-error-button-tertiary-error-fg,
        #ff3c3c
      );

      &:hover,
      &.hover {
        background: var(
          --component-colors-components-buttons-tertiary-error-button-tertiary-error-bg_hover,
          #fef3f2
        );
        color: var(
          --component-colors-components-buttons-tertiary-error-button-tertiary-error-fg_hover,
          #ea2b2b
        );
      }
    }
  }
</style>
