<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
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

<div class="publication-home">
  <div class="buttons-header">
    <Button type="secondary-gray">VIew sportstack</Button>
    <Button type="primary">+ New article</Button>
  </div>
  <div class="header">
    <h3>Recent articles</h3>
    <a class="view-all">
      <span>View all</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M7.5 15L12.5 10L7.5 5"
          stroke="#8C8C8C"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </div>
  <div class="content" />
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
  .publication-home {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl, 20px);

    .buttons-header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
      :global(.button) {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 0;
        width: 100%;
      }
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;

      h3 {
        margin: 0;
        color: var(--colors-text-text-primary, #fbfbfb);
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1 0 0;
        align-self: stretch;

        /* Display xs/Semibold */
        font-family: var(--font-family-font-family-display, Roboto);
        font-size: var(--font-size-display-xs, 24px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-display-xs, 32px); /* 133.333% */
      }

      .view-all {
        display: flex;
        padding: 10px var(--spacing-xl, 16px);
        justify-content: flex-end;
        align-items: center;
        gap: var(--spacing-sm, 6px);

        span {
          color: var(
            --component-colors-components-buttons-tertiary-button-tertiary-fg,
            #8c8c8c
          );

          /* Text md/Medium */
          font-family: var(--Font-family-font-family-body, Roboto);
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--Line-height-text-md, 24px); /* 150% */
        }

        path {
          stroke: var(
            --component-colors-components-buttons-tertiary-button-tertiary-fg
          );
        }
      }
    }
  }
</style>
