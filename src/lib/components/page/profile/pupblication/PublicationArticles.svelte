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
  import type {
    AuthorsAuthorsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import PublicationArticleArticle from "./PublicationArticleArticle.svelte";
  import type { IArticle } from "$lib/components/section/authors/common_ui/helpers.js";
  import PublicationArticleArticleLoader from "./PublicationArticleArticleLoader.svelte";
  import EyeOffIcon from "$lib/components/ui/assets/eye-off-icon.svelte";
  import PopupMenu from "$lib/components/ui/PopupMenu.svelte";
  import { articleFilterStore } from "./editor/helpers.js";
  import { createEventDispatcher } from "svelte";
  import type { Writable } from "svelte/store";

  export let selectedSportstack: Writable<AuthorsAuthorsMain>;
  export let articles: Map<number, IArticle>;
  export let loadingArticles = false;
  export let showLoadButton;
  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;

  let showSortBy = false;
  let node;
  $: options = [
    {
      id: "all",
      label: translations?.all || "All",
    },
    {
      id: "published",
      label: translations?.published || "Published",
    },
    {
      id: "draft",
      label: translations?.drafts || "Drafts",
    },
  ];

  $: sortOptions = [
    {
      id: "sortTitle",
      label: translations?.title || "Title",
    },
    {
      id: "sortPublishDate",
      label: translations?.published_date || "Published date",
    },
    {
      id: "sortEditedDate",
      label: translations?.last_edited || "Last edited",
    },
  ];
  const dispatch = createEventDispatcher();

  $: ({ viewportType } = $session);
  function changeFilter(e) {
    if (typeof e.detail === "number") return;
    $articleFilterStore.status = e.detail.id;
  }
  function changeSort(
    e: CustomEvent<"sortTitle" | "sortPublishDate" | "sortEditedDate">
  ) {
    if (typeof e.detail === "number") return;
    $articleFilterStore.sortBy = e.detail;
  }

  function handleScroll() {
    if (viewportType === "desktop" || !node) return;
    const rect = node.getBoundingClientRect();
    if (window.scrollY > rect.bottom - 10) {
      dispatch("loadMore");
    }
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

<svelte:window on:scroll={handleScroll} />
<div class="publication-articles {viewportType}" bind:this={node}>
  {#if viewportType === "mobile"}
    <div class="buttons-header">
      <a
        href="/u/author/article/create/{$userSettings.lang}?sportstack={$selectedSportstack?.permalink}"
      >
        <Button type="primary" full={true}
          >+ {translations?.new_article || "New article"}</Button
        >
      </a>
    </div>
  {/if}
  <div class="header">
    <div class="dropdown-input">
      <DropDownInput
        on:change={changeFilter}
        {options}
        value={options.find(({ id }) => id == $articleFilterStore.status)}
      />

      {#if viewportType === "tablet"}
        <a href="/u/author/article/create/{$userSettings.lang}">
          <Button type="primary" full={true}
            >+ {translations?.new_article || "New article"}</Button
          >
        </a>
      {/if}
    </div>
    <div
      class="sort-by"
      on:click|stopPropagation={() => (showSortBy = !showSortBy)}
    >
      <div class="sort-button">
        <Button type="terlary-gray">
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
          <span>{translations?.sort_byt || "Sort by"}</span>
        </Button>
        <PopupMenu
          options={sortOptions}
          bind:show={showSortBy}
          on:click={changeSort}
        />
      </div>
    </div>
  </div>
  <div class="content">
    {#if articles.size}
      {#each [...articles.entries()] as [key, article] (key)}
        <PublicationArticleArticle {translations} {article} on:deleteArticle />
      {/each}
    {:else if !loadingArticles}
      <div class="no-content">
        <EyeOffIcon />
        <p>
          {translations?.no_articles_available ||
            "No articles available, start creating content today!"}
        </p>
      </div>
    {/if}
    {#if loadingArticles}
      {#each Array(10) as _item}
        <PublicationArticleArticleLoader />
      {/each}
    {/if}
    {#if showLoadButton && viewportType === "desktop"}
      <div class="load-more">
        <Button type="outline" on:click={() => dispatch("loadMore")}
          >{translations?.view_more || "Load more"}</Button
        >
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
  .publication-articles {
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-direction: column;
    max-width: 100%;
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

      .sort-by {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .sort-button {
          position: relative;
        }

        span {
          /* Text md/Medium */
          font-family: var(--Font-family-font-family-body, Roboto);
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--Line-height-text-md, 24px); /* 150% */
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

      .load-more {
        width: 100%;
        display: flex;
        justify-content: center;
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
        .sort-by {
          flex-grow: 1;
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
        .dropdown-input {
          flex-grow: 0;
          width: 160px;
        }
        .sort-by {
          flex-grow: 1;
        }
      }
      .no-content {
        max-height: 368px;
      }
    }
  }
</style>
