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
  import SpinnerLoader from "$lib/components/ui/assets/spinner-loader.svelte"

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
  export let blank = false;

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
      | "button-brand"
      | "link-color"
      | "link-gray"
      | "subtle" = "primary";

  export let submit = false;
  export let size: "lg" | "md" | "sm" | "xl" | "xxl" = "lg";
  export let destructive = false;
  export let icon_leading = false;
  export let loading = false;

  loading = true
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
    class:loading
    class:icon_leading
    {...$$restProps}
    type={submit ? "submit" : "button"}
    target={blank ? "_blank" : "_self"}
    class:hover
    class:destructive
    on:mouseenter={() => {
      return (hover = true);
    }}
    on:mouseleave={() => {
      return (hover = false);
    }}
    on:touchend={() => {
      return (hover = false);
    }}
    on:mouseup={() => {
      return (hover = false);
    }}
    on:click={() => {
      if (disabled || loading) return;
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
    class:loading
    {...$$restProps}
    type={submit ? "submit" : "button"}
    class:hover
    class:destructive
    on:mouseenter={() => {
      return (hover = true);
    }}
    on:mouseleave={() => {
      return (hover = false);
    }}
    on:touchend={() => {
      return (hover = false);
    }}
    on:mouseup={() => {
      return (hover = false);
    }}
    on:click={() => {
      if (disabled || loading) return;
      dispatch("click");
      hover = false;
    }}
  >
    {#if loading}
      <div class="loading-icon">
        <SpinnerLoader />
      </div>
    {/if}
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
      height: 44px;
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
        height: 40px;
        width: 40px;
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
    color: var(--colors-text-text-white, #fff);
    background: var(--colors-background-bg-brand-solid, #f5620f);
    border: 2px solid
      var(--gradient-skeuemorphic-gradient-border, rgba(255, 255, 255, 0.12)) !important;
    box-shadow: 0 0 0 1px
        var(
          --colors-effects-shadows-shadow-skeumorphic-inner-border,
          rgba(12, 14, 18, 0.18)
        )
        inset,
      0 -2px 0 0 var(
          --colors-effects-shadows-shadow-skeumorphic-inner,
          rgba(12, 14, 18, 0.05)
        ) inset,
      0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
    &.hover {
      background: var(--colors-background-bg-brand-solid_hover, #f5620f);
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

    &.loading {
      border-radius: var(--radius-md, 8px);
      cursor: not-allowed;
      border: 2px solid
        var(--gradient-skeuemorphic-gradient-border, rgba(255, 255, 255, 0.12));

      background: var(--colors-background-bg-brand-solid_hover, #ae460b);

      /* Shadows/shadow-xs-skeuomorphic */
      box-shadow: 0 0 0 1px
          var(
            --colors-effects-shadows-shadow-skeumorphic-inner-border,
            rgba(12, 14, 18, 0.18)
          )
          inset,
        0 -2px 0 0 var(
            --colors-effects-shadows-shadow-skeumorphic-inner,
            rgba(12, 14, 18, 0.05)
          ) inset,
        0 1px 2px 0
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

      .loading-icon {
        color: var(--component-colors-components-buttons-button-primary-icon);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transform-origin: center;
        animation: spin 1s linear infinite;

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
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
    border: 1px solid var(--colors-border-border-primary, #525252) !important;
    background: var(--colors-background-bg-primary, #1f1f1f);
    /* Shadows/shadow-xs-skeuomorphic */
    box-shadow: 0px 0px 0px 1px
        var(
          --colors-effects-shadows-shadow-skeumorphic-inner-border,
          rgba(12, 14, 18, 0.18)
        )
        inset,
      0px -2px 0px 0px var(
          --colors-effects-shadows-shadow-skeumorphic-inner,
          rgba(12, 14, 18, 0.05)
        ) inset,
      0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
    color: var(--colors-text-text-secondary-700, #fbfbfb);

    &.hover {
      color: var(--colors-text-text-secondary_hover, #d2d2d2);

      border: 1px solid var(--colors-border-border-primary, #525252) !important;
      background: var(--colors-background-bg-primary_hover, #3b3b3b);

      box-shadow: 0px 0px 0px 1px
          var(
            --colors-effects-shadows-shadow-skeumorphic-inner-border,
            rgba(12, 14, 18, 0.18)
          )
          inset,
        0px -2px 0px 0px var(
            --colors-effects-shadows-shadow-skeumorphic-inner,
            rgba(12, 14, 18, 0.05)
          ) inset,
        0px 1px 2px 0px
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
    }

    &.destructive {
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--colors-border-border-error_subtle, #fda29b) !important;
      background: var(--colors-background-bg-primary, #fff);
      /* Shadows/shadow-xs */
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

      color: var(--colors-text-text-error-primary-600, #d92d20);

      &.hover {
        border-radius: var(--radius-md, 8px);
        border: 1px solid var(--colors-border-border-error_subtle, #fda29b) !important;
        background: var(--colors-background-bg-error-primary, #fef3f2);

        color: var(--colors-text-text-error-primary_hover, #b42318);
      }

      &:focus,
      &:focus-within {
        border-radius: var(--radius-md, 8px);
        border: 1px solid var(--colors-border-border-error_subtle, #fda29b) !important;
        background: var(--colors-background-bg-primary, #fff);

        /* Focus rings/focus-ring-error-shadow-xs-skeuomorphic */
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
            var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05)),
          0 0 0 2px var(--colors-background-bg-primary, #fff),
          0 0 0 4px var(--colors-effects-focus-rings-focus-ring-error, #f04438);
      }
    }

    &.disabled {
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--colors-border-border-disabled_subtle, #ededed);
      background: var(--colors-background-bg-primary, #fff);

      /* Shadows/shadow-xs */
      box-shadow: 0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(31, 31, 31, 0.05));

      color: var(--colors-foreground-fg-disabled, #8c8c8c);
    }

    &:focus,
    &:focus-within {
      box-shadow: 0 0 0 1px
          var(
            --colors-effects-shadows-shadow-skeumorphic-inner-border,
            rgba(12, 14, 18, 0.18)
          )
          inset,
        0 -2px 0 0 var(
            --colors-effects-shadows-shadow-skeumorphic-inner,
            rgba(12, 14, 18, 0.05)
          ) inset,
        0 1px 2px 0
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0)),
        0 0 0 2px var(--colors-background-bg-primary, #1f1f1f),
        0 0 0 4px var(--colors-effects-focus-rings-focus-ring, #f5620f);
    }
  }
  .secondary-gray {
    color: var(
      --component-colors-components-buttons-secondary-button-secondary-fg,
      #525252
    );
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
    box-sizing: border-box !important;
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
  .link-color {
    padding: 0 !important;
    background: inherit;
    color: var(
      --component-colors-components-buttons-tertiary-color-button-tertiary-color-fg,
      #f5620f
    );

    &:hover,
    &.hover {
      color: var(
        --component-colors-components-buttons-tertiary-color-button-tertiary-color-fg_hover,
        #d4550c
      );
    }
  }

  .link-gray {
    padding: 0 !important;
    cursor: pointer;
    background: inherit;
    color: var(--colors-text-text-tertiary-600, #8c8c8c);
    &:hover,
    &.hover {
      color: var(--colors-text-text-tertiary_hover, #d2d2d2);
      text-decoration: underline;
    }
  }

  .button-brand {
    background: inherit;

    color: var(--colors-text-text-quaternary-500);

    &.selected {
      background: var(--colors-background-bg-brand-primary_alt);
      color: var(--colors-brand-500);
    }

    &:hover,
    &.hover {
      background: var(--colors-background-bg-brand-primary_alt);
      color: #d4550c !important;
    }

    &:focus {
      box-shadow: 0px 0px 0px 2px var(--colors-background-bg-primary),
        0px 0px 0px 4px var(--colors-effects-focus-rings-focus-ring);
    }
  }
</style>
