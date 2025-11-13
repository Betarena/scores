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
  export let type: "light" | "gradient" | "modern" = "light";
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    class="bg"
  >
    <circle
      cx="24"
      cy="24"
      r="23.5"
      fill="var(--component-colors-utility-brand-utility-brand-50, #FEF5F0)"
      stroke="var(--component-colors-utility-brand-utility-brand-200, #FCD5BF)"
    />
  </svg>
  <div class="gradient-bg" />
  <!-- <div class="mask" /> -->

  <div class="icon-wrapper {size}">
    <slot />
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
  .featured-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    position: relative;
    border-radius: var(--radius-full, 9999px);

    .bg {
      position: absolute;
      z-index: 0;
      display: none;
    }
    .icon-wrapper {
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      width: 100%;
      height: 100%;
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
    }

    &.gradient {
      .bg {
        -webkit-mask-image: linear-gradient(
          180deg,
          #000 0%,
          rgba(0, 0, 0, 0) 100%
        );
        mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%);
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        display: block;
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: var(--radius-full, 9999px);
        background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%);
        z-index: 0;
      }
      &.sm {
        .icon-wrapper {
          width: 24px;
          height: 24px;
          padding: 0;
          :global(svg) {
            width: 16px;
            height: 16px;
          }
        }
      }

      &.md {
        .icon-wrapper {
          width: 28px;
          height: 28px;
          padding: 0;
          :global(svg) {
            width: 16px;
            height: 16px;
          }
        }
      }
      &.lg {
        .icon-wrapper {
          width: 32px;
          height: 32px;
          padding: 0;
          :global(svg) {
            width: 20px;
            height: 20px;
          }
        }
      }
      &.xl {
        .icon-wrapper {
          width: 36px;
          height: 36px;
          padding: 0;
          :global(svg) {
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    &.brand {
      .bg {
        :global(path) {
          fill: var(--component-colors-utility-brand-utility-brand-50, #fef5f0);
          stroke: var(
            --component-colors-utility-brand-utility-brand-200,
            #fcd5bf
          );
        }
      }
      .icon-wrapper {
        background: var(--colors-background-bg-brand-secondary, #feece2);
        :global(path) {
          stroke: var(
            --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-brand
          ) !important;
        }
      }
    }

    &.gray {
      .bg {
        :global(path) {
          fill: var(--component-colors-utility-gray-utility-gray-50, #fbfbfb);
          stroke: var(
            --component-colors-utility-gray-utility-gray-200,
            #ededed
          );
        }
      }
      .icon-wrapper {
        background: var(--colors-background-bg-tertiary, #f7f7f7);
        :global(path) {
          stroke: var(
            --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-gray
          ) !important;
        }
      }

      &.modern .icon-wrapper {
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
          stroke: var(--colors-foreground-fg-secondary-700) !important;
        }
      }
    }

    &.error {
      .bg {
        :global(path) {
          fill: var(--component-colors-utility-error-utility-error-50, #fef3f2);
          stroke: var(
            --component-colors-utility-error-utility-error-200,
            #fecdca
          );
        }
      }
      .icon-wrapper {
        background: var(--colors-background-bg-error-secondary, #fee4e2);
        :global(path) {
          stroke: var(
            --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-error
          ) !important;
        }
      }
    }
    &.warning {
      .bg {
        :global(path) {
          fill: var(
            --component-colors-utility-warning-utility-warning-50,
            #fffaeb
          );
          stroke-width: 1px;
          stroke: var(
            --component-colors-utility-warning-utility-warning-200,
            #fedf89
          );
        }
      }
      .icon-wrapper {
        background: var(--colors-background-bg-warning-secondary, #fef0c7);
        :global(path) {
          stroke: var(
            --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-warning
          ) !important;
        }
      }
    }
    &.success {
      .bg {
        :global(path) {
          fill: var(
            --component-colors-utility-success-utility-success-50,
            #ecfdf3
          );
          stroke-width: 1px;
          stroke: var(
            --component-colors-utility-success-utility-success-200,
            #abefc6
          );
        }
      }
      .icon-wrapper {
        background: var(--colors-background-bg-success-secondary, #dcfae6);
        :global(path) {
          stroke: var(
            --component-colors-components-icons-featured-icons-light-featured-icon-light-fg-success
          ) !important;
        }
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
