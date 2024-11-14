<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import type { IArticle } from "$lib/components/section/authors/page/helpers.js";
  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { AuthorsAuthorsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { createEventDispatcher } from "svelte";
  import PublicationArticleArticleLoader from "./PublicationArticleArticleLoader.svelte";
    import PublicationArticleArticle from "./PublicationArticleArticle.svelte";
    import EyeOffIcon from "$lib/components/ui/assets/eye-off-icon.svelte";
  export let selectedSportstack: AuthorsAuthorsMain;
  export let articles: Map<number, IArticle>;
  export let loadingArticles = false;
  $: ({ viewportType } = $session);

  const dispatch = createEventDispatcher();

  function viewAll() {
    dispatch("changeView", { view: "articles" });
  }
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

<div class="publication-home {viewportType}">
  {#if viewportType !== "desktop"}
    <div class="buttons-header">
      <div class="button-wrapper">
        <a href="/a/sportstack/{selectedSportstack?.permalink}">
          <Button type="secondary-gray">View sportstack</Button>
        </a>
      </div>
      <a
        href="/u/author/article/create/{$userSettings.lang}?sportstack={selectedSportstack?.permalink}"
      >
        <Button full={true} type="primary">+ New article</Button>
      </a>
    </div>
  {/if}
  <div class="header">
    <h3>Recent articles</h3>
    <a class="view-all" on:click={viewAll}>
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
  <div class="content">
    {#if loadingArticles}
      {#each Array(10) as _item}
        <PublicationArticleArticleLoader />
      {/each}
    {:else if articles.size}
      {#each [...articles.entries()] as [key, article] (key)}
        <PublicationArticleArticle
          {article}
          on:deleteArticle
        />
      {/each}
    {:else if !loadingArticles}
      <div class="no-content">
        <EyeOffIcon />
        <p>No articles available, start creating content today!</p>
      </div>
    {/if}
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
      a,
      :global(.button),
      .button-wrapper {
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
        cursor: pointer;
        border-radius: 8px;

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
        &:hover {
          background: var(
            --component-colors-components-buttons-tertiary-button-tertiary-bg_hover,
            #fbfbfb
          );
          span {
            color: var(
              --component-colors-components-buttons-tertiary-button-tertiary-fg_hover,
              #525252
            );
            path {
              stroke: var(
                --component-colors-components-buttons-tertiary-button-tertiary-fg_hover,
                #525252
              );
            }
          }
        }
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xl, 16px);
      max-width: 100%;
      width: 100%;
      flex-grow: 1;

      .no-content {
        height: 100%;
        width: 100%;
        display: flex;
        gap: 45px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        :global(svg) {
          width: 32px;
          height: 32px;
        }
        p {
          margin: 0;
          color: var(--colors-text-text-quaternary-500, #8c8c8c);
          text-align: center;

          /* Text md/Regular */
          font-family: Roboto;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 21px */
        }
      }
    }


    &.tablet {
      .buttons-header {
        gap: var(--spacing-2xl, 20px);
      }
      .header {
        h3 {
          /* Text lg/Semibold */
          font-size: var(--font-size-text-lg, 18px);
          line-height: var(--line-height-text-lg, 28px); /* 155.556% */
        }
      }
      .no-content {
        :global(svg) {
          width: 48px;
          height: 48px;
        }
      }
    }

    &.desktop {
      .header {
        h3 {
          /* Text lg/Semibold */
          font-size: var(--font-size-text-lg, 18px);
          line-height: var(--line-height-text-lg, 28px); /* 155.556% */
        }
      }
      .no-content {
        max-height: 368px;
      }
    }
  }
</style>
