<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Lock from "$lib/components/ui/assets/lock.svelte";
  export let permalink = "";
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
<div class="url-info-wrapper">
  <div class="icon">
    <Lock color="var(--colors-foreground-fg-brand-primary)" />
  </div>
  <span class="text">
    https://scores.betarena.com/sportstack/{permalink}
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
  .url-info-wrapper {
    display: flex;
    padding: var(--spacing-md, 8px) var(--spacing-xl, 16px);
    align-items: center;
    align-self: stretch;
    border-radius: var(--radius-xl, 12px);
    background: var(--colors-background-bg-secondary, #313131);
    display: flex;
    align-items: center;
    gap: var(--spacing-xl, 16px);

    .icon {
      flex-shrink: 0;

      :global(svg) {
        width: 24px;
        height: 24px;
      }
    }

    .text {
      color: var(--colors-text-text-quaternary-500, #727171);
      flex: 1 0 0;
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 400;
      white-space: normal;
      word-break: break-all;
      overflow-wrap: anywhere;
      line-height: var(--line-height-text-md, 24px); /* 150% */
    }
  }
</style>
