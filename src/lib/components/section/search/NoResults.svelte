<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { page } from "$app/stores";

  $: ({ search_translations } = $page.data);
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
<div class="no-results">
  <span class="highlighted-text">
    {search_translations.no_results || "No Results"}</span
  >
  <span>{search_translations.try_other_search_term ||  "try other search term" }</span>
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
  .no-results {
    color: var(--colors-text-text-tertiary-600, #6a6a6a);
    /* Text md/Regular */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-md, 16px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-height-text-md, 24px); /* 150% */

    display: flex;
    justify-content: center;
    padding-block: 16px;
    gap: 4px;
    background: transparent;

    .highlighted-text {
      color: var(--colors-brand-500);
    }

    &.mobile {
      background: var(--colors-background-bg-secondary);
    }
  }
</style>
