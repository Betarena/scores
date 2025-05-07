<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { flip } from 'svelte/animate';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
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
  import { fade, fly } from "svelte/transition";
  import { cubicOut, quadIn, quadOut } from "svelte/easing";
  import session from "$lib/store/session.js";
  import Input from "$lib/components/ui/Input.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import type { ITab } from "$lib/components/ui/types.js";
  import Button from "$lib/components/ui/Button.svelte";
  import { onMount } from "svelte";
  import ArrowCirlcleBrokenRight from "$lib/components/ui/assets/arrow-cirlcle-broken-right.svelte";
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import { searchUsers } from "$lib/firebase/search.js";
  import Articles from "./Articles.svelte";
  import Users from "./Users.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import Authors from "./Authors.svelte";
  import search_store from "./search_store.js";
  import Highlights from "./Highlights.svelte";
  import { debounce } from "$lib/utils/fetch.js";
  import { beforeNavigate } from "$app/navigation";
  import SuggestingResults from "./SuggestingResults.svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]").slice(0, 5);
    skipMountSearch = true;
  });

  beforeNavigate(() => {
    $modalStore.show = false;
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

  const tabs: ITab[] = [
    {
      id: "highlights",
      label: "Highlights",
    },
    {
      id: "posts",
      label: "Posts",
    },
    {
      id: "users",
      label: "Users",
    },
    {
      id: "sportstacks",
      label: "Sportstacks",
    },
  ];
  let inputNode: null | HTMLInputElement | HTMLTextAreaElement = null;
  let skipBlur = false;
  let suggestions: any[] = [];
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
  $: search = $search_store.search;
  $: ({ viewportType } = $session);
  $: ({ user: ctx_user } = $userSettings);
  $: searchHistory = [] as string[];
  $: isInputInFocus = false;
  $: selectedTab = tabs[0];

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
      const storageHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      const storageSet: string[] = [...storageHistory];
      const searched_before = storageSet.find(
        (history) => history.toLocaleLowerCase() === search.toLocaleLowerCase()
      );
      if (searched_before) {
        storageSet.splice(storageSet.indexOf(searched_before), 1);
      }
      if (search) {
        const nextHistory = [search, ...storageSet];
        localStorage.setItem("searchHistory", JSON.stringify(nextHistory));
        searchHistory = [...nextHistory];
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
    const url = `/api/data/search.suggestions?search=${search}`;
    const res = await fetch(url);
    const r = await res.json();
    suggestions = r.suggestions;
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
    let url = `/api/data/search.authors?search=${search}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }
    const res = await fetch(url);
    // const r = await res.json();
    // authors = new Map(r.authors.map((author) => [author.id, author]));
    const r = await res.json();
    if (!page) {
      $search_store.sportstacks.data = new Map(
        r.authors.map((author) => [author.id, author])
      );
      $search_store.sportstacks.page = 0;
    } else {
      const newMap = new Map(
        r.authors.map((author) => [author.id, author])
      ) as Map<string, any>;
      $search_store.sportstacks.data = new Map([
        ...$search_store.sportstacks.data,
        ...newMap,
      ]);
      $search_store.sportstacks.page = page;
    }
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
    let url = `/api/data/search.tags?search=${search}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }

    const res = await fetch(url);
    const r = await res.json();
    if (!page) {
      $search_store.tags.data = new Map(r.tags.map((tag) => [tag.id, tag]));
      $search_store.tags.page = 0;
    } else {
      const newMap = new Map(r.tags.map((tag) => [tag.id, tag])) as Map<
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
    let url = `/api/data/search.articles?search=${search}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }

    const res = await fetch(url);
    // const r = await res.json();
    const r = await res.json();
    if (!page) {
      $search_store.articles.data = new Map(
        r.articles.map((article) => [
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
        r.articles.map((article) => [
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
    $search_store.articles.loading = false;
  }

  async function usersSearch({
    search,
    page,
    limit,
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
    const users_data = await searchUsers(search);
    if (!users_data) {
      return ($search_store.users = {
        data: new Map(),
        page: 0,
        loading: false,
        total: 0,
      });
    }
    const users_map = new Map(users_data.map((user) => [user.id, user]));
    users_map.delete(ctx_user?.firebase_user_data?.uid || "");
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

<div class="search-container {viewportType}">
  <div
    class="search-wrapper"
    in:fly={{ x: 0, y: -100, duration: 400, easing: quadOut }}
    out:fly={{ x: 0, y: -100, duration: 400, easing: quadIn }}
  >
    <div class="input-wrapper">
      <button
        class="search-close"
        on:click={() => {
          $modalStore.show = false;
        }}
      >
        <XClose />
      </button>
      <Input
        bind:node={inputNode}
        type="leading-text"
        bind:value={$search_store.search}
        placeholder="Search"
        on:focus={inputFocus}
        on:blur={inputBlur}
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
    <!-- content here -->
    {#if !isInputInFocus}
      <div class="tabbar">
        <Tabbar
          type="button_gray"
          size="sm"
          data={tabs}
          bind:selected={selectedTab}
        />
      </div>
    {:else}
      <div class="empty-tabbar" />
    {/if}
  </div>
  {#if search && isInputInFocus && suggestions.length}
    <div
      class="search-suggestions"
      in:fade={{ duration: 400, easing: quadOut }}
    >
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
    in:fly={{ x: 0, y: 500, duration: 400, easing: quadOut }}
    out:fly={{ x: 0, y: 500, duration: 400, easing: quadIn }}
  >
    {#if (!search && !isInputInFocus) || (isInputInFocus && !search && !searchHistory.length)}
      <div class="search-message-wrapper">
        <Button type="link-color" classname="light-mode">Search for</Button>
        <div class="message-text">posts, users and Sportstacks</div>
      </div>
    {:else if !search && isInputInFocus && searchHistory.length}
      <div class="search-history">
        <div class="search-title">Recent</div>
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
  <div
    class="search-bg"
    in:fade={{
      duration: viewportType !== "desktop" ? 400 : 0,
      easing: cubicOut,
    }}
  />
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
  .search-container {
    &.mobile,
    &.tablet {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
        background: var(--colors-background-bg-main);

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
        background: var(--colors-background-bg-main);
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
          background: var(--colors-background-bg-main);
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
          background: var(--colors-background-bg-main);
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
    }
  }
</style>
