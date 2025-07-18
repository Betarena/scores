<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│
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
  import { fade, fly } from "svelte/transition";
  import { cubicOut, quadIn, quadOut } from "svelte/easing";
  import session from "$lib/store/session.js";
  import Input from "$lib/components/ui/Input.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { onMount } from "svelte";
  import ArrowCirlcleBrokenRight from "$lib/components/ui/assets/arrow-cirlcle-broken-right.svelte";
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import Articles from "./Articles.svelte";
  import Users from "./Users.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import Authors from "./Authors.svelte";
  import search_store from "$lib/store/search_store.js";
  import Highlights from "./Highlights.svelte";
  import SuggestingResults from "./SuggestingResults.svelte";
  import { preloadData } from "$app/navigation";
  import history_store from "$lib/store/history.js";
  import { page } from "$app/stores";
  import { debounce } from "$lib/utils/miscellenous.js";
  import { get } from "$lib/api/utils.js";
  import type { ITab } from "$lib/types.js";
  import type { ISearchSuggestion } from "$lib/types/types.search.js";
  import { Betarena_User_Class } from "@betarena/scores-lib/dist/classes/class.betarena-user.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // DESCRIPTION:
  // In mobile and tablet views, search should be performed only based on user input.
  // When navigating back to the search page, previous search results must already be loaded.
  // For desktop, the search functionality should be expanded compared to the header search,
  // making it appropriate to perform a repeated search (to find tags and articles).
  onMount(() => {
    skipMountSearch = $session.viewportType !== "desktop";
    const prevPage = $history_store.at(-1) || "/";
    preloadData(prevPage);
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  let inputNode: null | HTMLInputElement | HTMLTextAreaElement = null;
  let skipBlur = false;
  let suggestions: ISearchSuggestion[] = [];
  let skipMountSearch = true;

  const viewMap = {
    posts: Articles,
    users: Users,
    sportstacks: Authors,
    highlights: Highlights,
  };

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
  $: ({ search } = $search_store);
  $: ({ viewportType } = $session);
  $: ({ user: ctx_user, theme } = $userSettings);
  $: searchHistory = ($userSettings.searchHistory || []).slice(0, 5);
  $: isInputInFocus = false;
  $: selectedTab = tabs[0];

  $: ({ search_translations, translations = {} } = $page.data);

  $: tabs = [
    {
      id: "highlights",
      label: search_translations.highlights || "Highlights",
    },
    {
      id: "posts",
      label: translations.posts || "Posts",
    },
    {
      id: "users",
      label: search_translations.users || "Users",
    },
    {
      id: "sportstacks",
      label: search_translations.sportstacks || "Sportstacks",
    },
  ] as ITab[];

  const debouncedSearch = debounce(doSearch, 500);
  $: debouncedSearch(search);
  $: getSuggestions(search);

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

  function inputFocus() {
    isInputInFocus = true;
  }

  function inputBlur() {
    setTimeout(() => {
      if (skipBlur) {
        skipBlur = false;
        return;
      }
      isInputInFocus = false;
      const storageHistory = $userSettings.searchHistory || [];
      const storageSet: string[] = [...storageHistory];
      const searched_before = storageSet.find(
        (history) => history.toLocaleLowerCase() === search.toLocaleLowerCase()
      );
      if (searched_before) {
        storageSet.splice(storageSet.indexOf(searched_before), 1);
      }
      if (search) {
        const nextHistory = [search, ...storageSet];
        userSettings.updateData([["search_history", nextHistory]]);
      }
    }, 100);
  }

  function doSearch(value: string) {
    if (skipMountSearch) {
      skipMountSearch = false;
      return;
    }
    usersSearch({ search: value, page: 0 });
    authorSearch({ search: value, page: 0 });
    tagsSearch({ search: value, page: 0 });
    articlesSearch({ search: value, page: 0 });
  }

  function changeTab(e: CustomEvent) {
    const tabId = e.detail.id;
    const tab = tabs.find((tab) => tab.id === tabId);
    if (!tab) {
      return;
    }
    selectedTab = tab;
  }

  async function getSuggestions(text: string) {
    const url = `/api/data/search.suggestions?search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const r = await res.json();
    let filtered = r?.suggestions.filter(
      (sug: ISearchSuggestion) => sug.suggestion !== search
    ) || [];
    if (filtered.length > 4) {
      filtered = filtered.slice(0, 4);
    }
   suggestions = [{suggestion: search, source: "input"}, ...filtered];
  }

  async function suggestClick(suggest: string) {
    const url = `/api/data/search.suggestions`;
    $search_store.search = suggest;
    inputBlur();
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ suggest }),
    });
  }

  async function authorSearch({
    search,
    page,
    limit,
  }: {
    search: string;
    page?: number;
    limit?: number;
  }) {
    if (!search) {
      $search_store.sportstacks = {
        data: new Map(),
        page: 0,
        loading: false,
        total: 0,
      };
      return;
    }
    if (!page) {
      $search_store.sportstacks.data = new Map();
    }
    $search_store.sportstacks.loading = true;
    let url = `/api/data/search.authors?search=${encodeURIComponent(search)}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }
    const res =  await get<{data: any[], next_page_count: number}>(url);

    if (!page) {
      $search_store.sportstacks.data = new Map(
        (res?.data || []).map((author) => [author.id, author])
      );
      $search_store.sportstacks.page = 0;
    } else {
      const newMap = new Map(
        (res?.data || []).map((author) => [author.id, author])
      ) as Map<string, any>;
      $search_store.sportstacks.data = new Map([
        ...$search_store.sportstacks.data,
        ...newMap,
      ]);
      $search_store.sportstacks.page = page;
    }
    $search_store.sportstacks.next_page_count = res?.next_page_count;
    $search_store.sportstacks.loading = false;
  }

  async function tagsSearch({
    search,
    page,
    limit,
  }: {
    search: string;
    page?: number;
    limit?: number;
  }) {
    if (!search) {
      $search_store.tags = {
        data: new Map(),
        page: 0,
        loading: false,
        total: 0,
      };
      return;
    }
    if (!page) {
      $search_store.tags.data = new Map();
    }
    $search_store.tags.loading = true;
    let url = `/api/data/search.tags?search=${encodeURIComponent(search)}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }

    const res = await get<{tags: any[], next_page_count: number}>(url)
    if (!page) {
      $search_store.tags.data = new Map((res?.tags || []).map((tag) => [tag.id, tag]));
      $search_store.tags.page = 0;
    } else {
      const newMap = new Map((res?.tags || []).map((tag) => [tag.id, tag])) as Map<
        number,
        any
      >;
      $search_store.tags.data = new Map([
        ...$search_store.tags.data,
        ...newMap,
      ]);
      $search_store.tags.page = page;
    }
    $search_store.tags.loading = false;
  }

  async function articlesSearch({
    search,
    page,
    limit,
  }: {
    search: string;
    page?: number;
    limit?: number;
  }) {
    if (!search) {
      $search_store.articles = {
        data: new Map(),
        page: 0,
        loading: false,
        total: 0,
      };
      return;
    }
    if (!page) {
      $search_store.articles.data = new Map();
    }
    $search_store.articles.loading = true;
    let url = `/api/data/search.articles?search=${encodeURIComponent(search)}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }

    const res = await get<{data: any[], next_page_count: number}>(url);
    if (!page) {
      $search_store.articles.data = new Map(
        (res?.data || []).map((article) => [
          article.id,
          {
            ...article,
            author: article.authors__authors__id__nested,
          },
        ])
      );
      $search_store.articles.page = 0;
    } else {
      const newMap = new Map(
        (res?.data || []).map((article) => [
          article.id,
          {
            ...article,
            author: article.authors__authors__id__nested,
          },
        ])
      ) as Map<string, any>;
      $search_store.articles.data = new Map([
        ...$search_store.articles.data,
        ...newMap,
      ]);
      $search_store.articles.page = page;
    }
    $search_store.articles.next_page_count = res?.next_page_count;
    $search_store.articles.loading = false;
  }

  async function usersSearch({
    search,
    page,
  }: {
    search: string;
    page?: number;
    limit?: number;
  }) {
    if (!search) {
      $search_store.users.data = new Map();
      $search_store.users.page = 0;
      return;
    }
    if (!page) {
      $search_store.users.data = new Map();
    }
    $search_store.users.loading = true;
    const users_data = await new Betarena_User_Class().getUsersByFuzzySearch
    (
      {
        query:
        {
          searchTerm: search,
        },
        body: {}
      }
    )
    if (!users_data) {
      return ($search_store.users = {
        data: new Map(),
        page: 0,
        loading: false,
        total: 0,
      });
    }
    const users_map = new Map(users_data.success.data.listUsers.map((user) => [user.username, user]));
    users_map.delete(ctx_user?.scores_user_data?.username || "");
    $search_store.users.data = users_map;
    $search_store.users.page = 0;
    $search_store.users.loading = false;
    $search_store.users.total = users_data.length;
  }

  function loadMore(e: CustomEvent) {
    const { page, type } = e.detail;
    switch (type) {
      case "users":
        usersSearch({ search, page });
        break;
      case "sportstacks":
        authorSearch({ search, page });
        break;
      case "articles":
        articlesSearch({ search, page });
        break;
      case "tags":
        tagsSearch({ search, page });
        break;
    }
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
{#if translations}
  <div class="search-container {viewportType} {theme}">
    <div
      class="search-wrapper"
      in:fly={{
        x: 0,
        y: -100,
        duration: viewportType !== "desktop" ? 600 : 0,
        easing: quadOut,
      }}
      out:fly={{
        x: 0,
        y: -150,
        duration: viewportType !== "desktop" ? 600 : 0,
        easing: quadOut,
      }}
    >
      <div class="input-wrapper">
        <button
          class="search-close"
          on:click={() => {
            history.back();
          }}
        >
          <XClose />
        </button>
        <Input
          bind:node={inputNode}
          type="leading-text"
          bind:value={$search_store.search}
          placeholder={search_translations.search || "Search"}
          on:focus={inputFocus}
          on:blur={inputBlur}
          height="40px"
        >
          <svg
            slot="leading-text"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
              stroke="currentColor"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Input>
      </div>
      {#if !isInputInFocus && search}
        <div class="tabbar">
          <Tabbar
            type="button_gray"
            size="sm"
            fullWidth={viewportType !== "mobile"}
            data={tabs}
            on:select={(e) => (selectedTab = e.detail)}
            selected={selectedTab}
          />
        </div>
      {:else}
        <div class="empty-tabbar" />
      {/if}
    </div>
    {#if search && isInputInFocus && suggestions.length}
      <div class="search-suggestions">
        {#each suggestions as suggest}
          <button
            class="suggest-item"
            on:click={() => suggestClick(suggest.suggestion)}
          >
            <div class="suggestion-text">{suggest.suggestion}</div>
            <div class="suggest-icon">
              <ArrowCirlcleBrokenRight />
            </div>
          </button>
        {/each}
      </div>
    {/if}
    <div
      class="search-results"
      in:fly={{
        x: 0,
        y: 750,
        duration: viewportType !== "desktop" ? 600 : 0,
        easing: quadOut,
      }}
      out:fly={{
        x: 0,
        y: 750,
        duration: viewportType !== "desktop" ? 600 : 0,
        easing: quadOut,
      }}
    >
      {#if !search && !searchHistory.length}
        <div class="search-message-wrapper">
          <Button type="link-color" classname="light-mode"
            >{search_translations.search_for || "Search for"}</Button
          >
          <div class="message-text">
            {search_translations.posts_users_sportstacks ||
              "posts, users and Sportstacks"}
          </div>
        </div>
      {:else if !search && searchHistory.length}
        <div class="search-history">
          <div class="search-title">
            {search_translations.recent || "Recent"}
          </div>
          {#each searchHistory.slice(0, 10) as text}
            <button
              class="recent-search-item"
              on:click={() => {
                $search_store.search = text;
              }}
            >
              {text}
            </button>
          {/each}
        </div>
      {/if}
      {#if search && isInputInFocus}
        <SuggestingResults />
      {/if}
      {#if search && viewMap[selectedTab.id] && !isInputInFocus}
        <svelte:component
          this={viewMap[selectedTab.id]}
          on:changeTab={changeTab}
          on:loadMore={loadMore}
        />
      {/if}
    </div>
    {#if viewportType === "mobile"}
      <div
        class="search-bg"
        in:fade={{
          duration: 200,
          easing: cubicOut,
        }}
      />
    {/if}
  </div>
{/if}

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
  .search-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 4001;
    .search-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--layout-bg-color);
      z-index: -1;
    }

    .search-wrapper {
      width: 100%;
      padding-inline: 15px;
      padding-top: 20px;
      background: var(--colors-background-bg-secondary);

      .input-wrapper {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 14px;
        .search-close {
          background: none;
          padding: 0;
        }
        :global(.field) {
          width: 100%;
        }
      }
      .tabbar {
        padding-block: 20px;
      }
      .empty-tabbar {
        height: 20px;
      }
    }
    .search-suggestions {
      display: flex;
      padding: 16px;
      gap: 16px;
      background: var(--colors-background-bg-secondary);
      flex-direction: column;
      width: 100%;
      .suggest-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: none;
        .suggestion-text {
          color: var(--text-color);

          /* Text md/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
        .suggest-icon {
          color: var(--colors-brand-500);
        }
      }
    }
    .search-results {
      width: 100%;
      flex-grow: 1;
      overflow: hidden;

      .search-message-wrapper {
        background: var(--colors-background-bg-secondary);
        overflow-y: auto;
        flex-grow: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: var(--spacing-xs, 4px);
        align-self: stretch;
        padding-top: 16px;

        .message-text {
          color: var(--colors-text-text-tertiary-600, #6a6a6a);

          /* Text md/Regular */
          font-family: var(--Font-family-font-family-body, Roboto);
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--Line-height-text-md, 24px); /* 150% */
        }
      }
      .search-history {
        background: var(--colors-background-bg-secondary);
        overflow-y: auto;
        flex-grow: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 16px;

        .search-title {
          color: var(--text-color);

          /* Text lg/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-lg, 18px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-lg, 28px); /* 155.556% */
        }
        .recent-search-item {
          background: none;
          padding: 0;
          display: flex;
          justify-content: start;
          color: var(--text-color);

          /* Text md/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-md, 24px); /* 150% */

          &:hover {
            color: var(
              --component-colors-components-buttons-tertiary-color-button-tertiary-color-fg_hover,
              #d4550c
            );
          }
        }
      }
    }
    :global(.list-item) {
      border-bottom: 0;
    }

    &.desktop,
    &.tablet {
      position: relative;
      flex-grow: 1;
      height: 100%;
      z-index: 0;
      background-color: unset;
      max-width: 832px;
      gap: 21px;
      background: transparent;

      &.Dark {
        :global(.input-wrapper:not(.focus)) {
          border: 1px solid transparent;
        }
      }
      .tabbar {
        padding-block: 0;
        margin-top: 21px;
      }
      .search-wrapper {
        padding: 0;
        background: transparent;
      }
      .search-suggestions,
      .search-history {
        padding: 0;
        background: transparent;
        gap: 21px;
        .suggestion-text,
        .recent-search-item {
          /* Text lg/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-lg, 18px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-lg, 28px); /* 155.556% */
        }
        .search-title {
          /* Text xl/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-xl, 20px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-xl, 30px); /* 150% */
        }
      }
      .empty-tabbar {
        height: 0;
      }
    }
    &.tablet {
      padding: 26px 34px;
      padding-top: 32px;
      padding-bottom: 0 !important;
      margin: 0 !important;
      width: 100%;
      max-width: 100%;
    }
  }
</style>
