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

  import Input from "$lib/components/ui/Input.svelte";
  import { searchUsers } from "$lib/firebase/search.js";
  import search_store from "$lib/store/search_store.js";
  import userSettings from "$lib/store/user-settings.js";
  import { debounce } from "$lib/utils/miscellenous.js";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import CommandMenuItem from "$lib/components/ui/CommandMenu/CommandMenuItem.svelte";
  import type { IBetarenaUser } from "@betarena/scores-lib/types/firebase/firestore.js";
  import UsersList from "$lib/components/section/authors/common_ui/users_list/UsersList.svelte";
  import SportsTackList from "$lib/components/ui/composed/sportstack_list/SportsTackList.svelte";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import Button from "$lib/components/ui/Button.svelte";

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

  const debouncedSearch = debounce(doSearch, 500);
  let suggestions: any[] = [];
  let skipMountSearch = true;
  $: ({ search_translations, translations } = $page.data);
  $: ({ user: ctx_user, theme } = $userSettings);
  $: search = $search_store.search;
  $: searchHistory = [] as string[];
  $: isInputInFocus = false;
  $: users = ($search_store.users.data || new Map()) as Map<
    string,
    IBetarenaUser
  >;
  $: sportstacks = $search_store.sportstacks.data || new Map();
  $: firstThreeUsers = new Map(Array.from(users.entries()).slice(0, 3));
  $: firstThreeSportstacks = new Map(
    Array.from(sportstacks.entries()).slice(0, 3)
  );

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

  $: debouncedSearch(search);
  $: getSuggestions(search);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    searchHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    ).slice(0, 5);
    skipMountSearch = true;
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
    }, 200);
  }

  function doSearch(value: string) {
    if (skipMountSearch) {
      skipMountSearch = false;
      return;
    }
    usersSearch({ search: value, page: 0 });
    authorSearch({ search: value, page: 0 });
  }

  async function getSuggestions(text: string) {
    const url = `/api/data/search.suggestions?search=${search}`;
    const res = await fetch(url);
    const r = await res.json();
    suggestions = r.suggestions;
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

    const r = await res.json();
    if (!page) {
      $search_store.sportstacks.data = new Map(
        r.data.map((author) => [author.id, author])
      );
      $search_store.sportstacks.page = 0;
    } else {
      const newMap = new Map(
        r.data.map((author) => [author.id, author])
      ) as Map<string, any>;
      $search_store.sportstacks.data = new Map([
        ...$search_store.sportstacks.data,
        ...newMap,
      ]);
      $search_store.sportstacks.page = page;
    }
    $search_store.sportstacks.next_page_count = r.next_page_count;
    $search_store.sportstacks.loading = false;
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
    const users_data = await searchUsers(search);
    if (!users_data) {
      return ($search_store.users = {
        data: new Map(),
        page: 0,
        loading: false,
        total: 0,
      });
    }
    const users_map = new Map(users_data.map((user) => [user.uid, user]));
    users_map.delete(ctx_user?.firebase_user_data?.uid || "");
    $search_store.users.data = users_map;
    $search_store.users.page = 0;
    $search_store.users.loading = false;
    $search_store.users.total = users_data.length;
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

<div class="search-wrapper {theme}">
  <Input
    height="40px"
    type="leading-text"
    placeholder={search_translations.search || "Search"}
    bind:value={$search_store.search}
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
  {#if isInputInFocus}
    <div class="popup">
      {#if isInputInFocus && !search}
        <div class="section">
          <div class="recent-title">
            {search_translations.recent || "Recent"}
          </div>
          {#each searchHistory.slice(0, 10) as text}
            <a href="/search" on:click={() => ($search_store.search = text)}>
              <CommandMenuItem {text} />
            </a>
          {/each}
        </div>
      {/if}
      {#if search && isInputInFocus && suggestions.length}
        <div class="section">
          {#each suggestions as { suggestion }}
            <a
              href="/search"
              on:click={() => ($search_store.search = suggestion)}
            >
              <CommandMenuItem text={suggestion} />
            </a>
          {/each}
        </div>
      {/if}
      {#if search && (users.size || sportstacks.size || $search_store.users.loading || $search_store.sportstacks.loading)}
        <div class="section">
          {#if users.size || $search_store.users.loading}
            {#each [...firstThreeUsers] as [uid, user] (uid)}
              <a href="/a/user/{user.usernamePermalink}">
                <CommandMenuItem
                  text={user.name || user.username || ""}
                  supportingText="@{user.usernameLower ||
                    user.usernamePermalink}"
                >
                  <Avatar
                    src={user.profile_photo}
                    alt={user.username || ""}
                    size="xs"
                  />
                </CommandMenuItem>
              </a>
            {/each}
          {/if}
          {#if sportstacks.size || $search_store.sportstacks.loading}
            {#each [...firstThreeSportstacks] as [uid, sportstack] (uid)}
              <a href="/a/sportstack/{sportstack.permalink}">
                <CommandMenuItem
                  text={sportstack.data.username || ""}
                  supportingText="@{sportstack.permalink}"
                >
                  <SportstackAvatar src={sportstack.data.avatar} size="xs" />
                </CommandMenuItem>
              </a>
            {/each}
          {/if}
        </div>
      {/if}
      {#if (search && (users.size || sportstacks.size) && !($search_store.users.loading || $search_store.sportstacks.loading)) || (search && suggestions.length)}
        <div class="section button-wrapper">
          <Button
            size="md"
            type="secondary-gray"
            classname="light-mode"
            href="/search">+ {translations.view_more || "View more"}</Button
          >
        </div>
      {/if}
    </div>
  {/if}
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
  .search-wrapper {
    position: relative;
    width: 295px;
    height: 40px;
    margin-right: -5px;
    &:global(.input-wrapper) {
      height: 40px !important;
    }
    &:global(.Dark .input-wrapper:not(.focus)) {
      border: 1px solid transparent;
    }
    :global(.input-wrapper.focus) {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }

    .popup {
      position: absolute;
      top: 40px;
      border-bottom-left-radius: var(--radius-xl, 12px);
      border-bottom-right-radius: var(--radius-xl, 12px);
      background: var(--colors-background-bg-primary, #1f1f1f);
      /* Shadows/shadow-xl */
      box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
        0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));
      width: 100%;

      .section {
        display: flex;
        padding: var(--spacing-xl, 16px) 0px;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xxs, 2px);
        align-self: stretch;
        border-bottom: 1px solid var(--colors-border-border-secondary, #3b3b3b);

        a {
          width: 100%;
        }

        .recent-title {
          color: var(--text-color);
          padding: calc(var(--spacing-xxs, 2px) + 10px)
            calc(var(--spacing-md, 8px) + var(--spacing-md, 8px));
          /* Text lg/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-lg, 18px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-lg, 28px); /* 155.556% */
        }

        &.button-wrapper {
          border-bottom: none;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
