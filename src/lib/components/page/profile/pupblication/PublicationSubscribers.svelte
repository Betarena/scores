<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import type { IArticle } from "$lib/components/section/authors/common_ui/helpers.js";
  import ListUserItem from "$lib/components/section/authors/common_ui/users_list/ListUserItem.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import MetricItem4 from "$lib/components/ui/metrics/MetricItem4.svelte";
  import Pagination from "$lib/components/ui/Pagination.svelte";
  import PopupMenu from "$lib/components/ui/PopupMenu.svelte";
  import Table from "$lib/components/ui/table/Table.svelte";
  import ScrollDataWrapper from "$lib/components/ui/wrappers/ScrollDataWrapper.svelte";
  import session from "$lib/store/session.js";
  import type { Column, Row } from "$lib/types/types.table.js";
  import type {
    AuthorsAuthorsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { createEventDispatcher } from "svelte";
  import type { Writable } from "svelte/store";
  import { articleFilterStore } from "./editor/helpers.js";
  import FilterLines from "$lib/components/ui/assets/filter-lines.svelte";

  // #endregion ➤ 📦 Package Imports

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

  export let selectedSportstack: Writable<AuthorsAuthorsMain>;
  export let articles: Map<number, IArticle>;
  export let loadingArticles = false;
  export let showLoadButton;
  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;

  const dispatch = createEventDispatcher();

  let showSortBy = false;
  let activeStatistic: string = "";
  let node;
  let init_columns: Column[] = [
    { id: "subscribers", label: "Subscribers", grow: 5 },
    { id: "start_date", label: "Start Date", grow: 1 },
    { id: "rewards", label: "Rewards", grow: 1 },
  ];
  let rows: Row[] = Array.from({ length: 10 }, (_, i) => ({
    id: `${i}`,
    subscribers: `Subscriber ${i + 1}`,
    start_date: `Start Date ${i + 1}`,
    rewards: `${Math.floor(Math.random() * 1000)}`,
  }));

  let columns: Column[] = [];
  let statistic = [
    {
      id: "subscribers",
      text: "Total Subscribers",
      number: "188 BTA",
      change: 2.4,
    },
    {
      id: "revenue",
      text: "Total Revenue",
      number: "188 BTA",
      change: 2.4,
    },
  ];

  $: ({ viewportType } = $session);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $: if (viewportType === "mobile") {
    columns = [...init_columns].filter((col) => col.id !== "start_date");
    columns[0].grow = 2;
  } else {
    columns = init_columns;
    columns[0].grow = 5;
  }
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

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  function changeFilter(e) {
    if (typeof e.detail === "number") return;
    $articleFilterStore.status = e.detail.id;
  }
  function changeSort(
    e: CustomEvent<"sortTitle" | "sortPublishDate" | "sortEditedDate">,
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

  function handleSort(
    event: CustomEvent<{ column: string; direction: "asc" | "desc" }>,
  ) {
    const { column, direction } = event.detail;
    console.log(`Sorted by column: ${column}, direction: ${direction}`);
  }
  // #endregion ➤ 🛠️ METHODS
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
<div class="publication-subscribers {viewportType}" bind:this={node}>
  <div class="statistic">
    <ScrollDataWrapper data={statistic} let:item>
      <button
        class="metric-wrapper"
        class:active={item.id === activeStatistic}
        on:click={() => (activeStatistic = item.id)}
      >
        <MetricItem4 text={item.text} number={item.number} change={item.change}>
          <div class="bta" slot="number">
            {item.number} <span class="usd">$40</span>
          </div>
        </MetricItem4>
      </button>
    </ScrollDataWrapper>
  </div>
  <div class="header">
    <div class="search-wrapper">
      <Input type="leading-text" placeholder={"Search"} size="sm" height="40px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          stroke="currentColor"
          viewBox="0 0 17 17"
          fill="none"
          slot="leading-text"
        >
          <path
            d="M15.8333 15.8335L12.9167 12.9168M14.9999 7.91683C14.9999 11.8288 11.8286 15.0002 7.91659 15.0002C4.00457 15.0002 0.833252 11.8288 0.833252 7.91683C0.833252 4.00481 4.00457 0.833496 7.91659 0.833496C11.8286 0.833496 14.9999 4.00481 14.9999 7.91683Z"
            stroke="#6A6A6A"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Input>
    </div>
    <div class="sort-by">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="filter-button"
        on:click|stopPropagation={() => (showSortBy = !showSortBy)}
      >
        <Button type="secondary" size="md">
          <div class="filter-icon">
            <FilterLines />
            </div>
          <span>{translations?.sort_by || "Filters"}</span>
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
    <Table {columns} {rows} on:sort={handleSort} sortable={true}>
      <div class="cell" slot="cell" let:column let:value>
        {#if column.id === "subscribers"}
          <ListUserItem
            user={{ name: "Some", usernamePermalink: "some" }}
            includePermalink={true}
            action_button={false}
            translations={{}}
          />
        {/if}
        {#if column.id === "start_date"}
          <div>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        {/if}
        {#if column.id === "rewards"}
          <div class="rewards-cell" class:positive={value > 0}>
            {value > 0 ? `+ $${parseInt(value).toFixed(2)}` : `$${value}`}
          </div>
        {/if}
      </div>
    </Table>
    <Pagination totalPages={10} currentPage={1} />
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
  .publication-subscribers {
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-direction: column;
    max-width: 100%;
    gap: var(--spacing-3xl, 24px);
    overflow-x: hidden;
   
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

    .statistic {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      align-self: stretch;

      .metric-wrapper {
        padding: 0;
        background: none;
        width: 280px;
        flex-shrink: 0;

        &.active {
          :global(.metric-4) {
            border: 1px solid var(--Colors-Border-border-brand, #f5620f);
          }
        }
        .bta {
          color: var(--colors-text-text-primary-900, #fff);

          /* Display sm/Semibold */
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-sm, 30px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-sm, 38px); /* 126.667% */

          .usd {
            color: var(--colors-text-text-tertiary-600, #8c8c8c);

            /* Display xs/Semibold */
            font-family: var(--font-family-font-family-display, Roboto);
            font-size: var(--font-size-display-xs, 24px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-xs, 32px);
          }
        }
      }
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
      overflow-y: visible;

      .search-wrapper {
        flex-grow: 1;
      }

      .sort-by {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .filter-button {
          position: relative;
        }
        .filter-icon {
          width: 20px;
          height: 20px;
          color: var(--colors-foreground-fg-quaternary-400);
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
      max-width: 100%;
      width: 100%;
      flex-grow: 1;

      :global(.table-wrapper) {
        border: none;
      }

      .cell {
        :global(.list-item) {
          border-bottom: none;
          padding: 0;
        }
        .rewards-cell {
          &.positive {
            color: var(--colors-text-text-success-primary-600, #47cd89);
          }
        }
      }
    }

    &.tablet {
      .header {
        gap: var(--spacing-lg, 12px);
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
      .no-content {
        max-height: 368px;
      }
    }
  }
</style>
