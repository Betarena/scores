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
  export let type: "brand" | "gray" | "error" | "warning" | "sucess" = "brand";
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

<div class="featured-icon {size} {type}">
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
  }
</style>
