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
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";

  const options = [
    {
      id: 3,
      label: "All",
    },
    {
      id: 1,
      label: "Published",
    },
    {
      id: 2,
      label: "Unpunlished",
    },
  ];

  $: ({ viewportType } = $session);
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

<div class="publication-articles {viewportType}">
  {#if viewportType === "mobile"}
    <div class="buttons-header">
      <a href="u/author/article/create/{$userSettings.lang}">
        <Button type="primary" full={true}>+ New article</Button>
      </a>
    </div>
  {/if}
  <div class="header">
    <div class="dropdown-input">
      <DropDownInput {options} value={options[1]} />

      {#if viewportType === "tablet"}
        <a href="u/author/article/create/{$userSettings.lang}">
          <Button type="primary" full={true}>+ New article</Button>
        </a>
      {/if}
    </div>
    <a class="view-all">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Sort by</span>
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
  .publication-articles {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl, 20px);

    .buttons-header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
      a {
        width: 100%;
      }
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

      .dropdown-input {
        flex-grow: 1;
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

    &.tablet {
      .header {
        gap: var(--spacing-lg, 12px);
        .dropdown-input {
          display: flex;
          flex-grow: 1;
          gap: var(--spacing-lg, 12px);
          :global(.field) {
            flex-grow: 1;
          }
        }
        .view-all {
          flex-grow: 1;
        }
      }
    }

    &.desktop {
      .header {
        .dropdown-input {
          flex-grow: 0;
          width: 160px;
        }
        .view-all {
          flex-grow: 1;
        }
      }
    }
  }
</style>
