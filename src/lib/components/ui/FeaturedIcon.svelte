<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  export let size: "sm" | "md" | "lg" | "xl" = "md";
  export let color: "brand" | "gray" | "error" | "warning" | "sucess" = "brand";
  export let type: "modern" | "light" = "light";
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

<div class="featured-icon {size} {color} {type}">
  <slot />
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
  .featured-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: var(--radius-full, 9999px);

    &.sm {
      width: 32px;
      height: 32px;
      padding: 8px;
      :global(svg) {
        width: 16px;
        height: 16px;
      }
    }

    &.md {
      width: 40px;
      height: 40px;
      padding: 10px;
      :global(svg) {
        width: 20px;
        height: 20px;
      }
    }
    &.lg {
      width: 48px;
      height: 48px;
      padding: 12px;
      :global(svg) {
        width: 24px;
        height: 24px;
      }
    }
    &.xl {
      width: 56px;
      height: 56px;
      padding: 14px;
      :global(svg) {
        width: 28px;
        height: 28px;
      }
    }

    &.brand {
      background: var(--colors-background-bg-brand-secondary, #feece2);
      :global(path) {
        stroke: var(
          --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-brand
        ) !important;
      }
    }

    &.gray {
      background: var(--colors-background-bg-tertiary, #f7f7f7);
      :global(path) {
        stroke: var(
          --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-gray
        ) !important;
      }
    }

    &.error {
      background: var(--colors-background-bg-error-secondary, #fee4e2);
      :global(path) {
        stroke: var(
          --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-error
        ) !important;
      }
    }
    &.warning {
      background: var(--colors-background-bg-warning-secondary, #fef0c7);
      :global(path) {
        stroke: var(
          --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-warning
        ) !important;
      }
    }
    &.sucess {
      background: var(--colors-background-bg-success-secondary, #dcfae6);
      :global(path) {
        stroke: var(
          --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-success
        ) !important;
      }
    }

    &.modern {
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--colors-border-border-primary, #d2d2d2);
      background: var(--colors-background-bg-primary, #fff);
      color: var(--colors-foreground-fg-secondary-700);
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
      :global(path) {
        stroke: var(--colors-foreground-fg-secondary-700);
      }

      &.gray {
        border: 1px solid var(--colors-border-border-primary, #d2d2d2);
        background: var(--colors-background-bg-primary, #fff);
      }

      &.brand {
        color: var(--colors-foreground-fg-white, #ffffff) !important;
        border: 2px solid
          var(
            --gradient-skeuemorphic-gradient-border,
            rgba(255, 255, 255, 0.12)
          );
        background: var(--colors-background-bg-brand-solid, #f5620f);

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

        :global(path) {
          stroke: var(--colors-foreground-fg-white, #ffffff)
        }
      }
    }
  }
</style>
