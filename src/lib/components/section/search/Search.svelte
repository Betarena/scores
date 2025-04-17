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
  import { fade, fly, scale } from "svelte/transition";
  import { cubicOut, quadIn, quadOut } from "svelte/easing";
  import session from "$lib/store/session.js";
  import Input from "$lib/components/ui/Input.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import type { ITab } from "$lib/components/ui/types.js";
  import Button from "$lib/components/ui/Button.svelte";
  import { onMount, tick } from "svelte";
  import ArrowCirlcleBrokenRight from "$lib/components/ui/assets/arrow-cirlcle-broken-right.svelte";
  import { flip } from "svelte/animate";
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import { modalStore } from "$lib/store/modal.js";

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

  // #endregion ➤ 📌 VARIABLES

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
  $: search = "";
  $: ({ viewportType } = $session);
  $: searchHistory = [] as string[];
  $: isInputInFocus = false;

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

  async function inputBlur() {
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
      if (
        search &&
        !storageSet.find(
          (history) =>
            history.toLocaleLowerCase() === search.toLocaleLowerCase()
        )
      ) {
        const nextHistory = [search, ...storageSet];
        localStorage.setItem("searchHistory", JSON.stringify(nextHistory));
        searchHistory = [...nextHistory];
      }
    }, 100);
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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
      <button class="search-close" on:click={() => {$modalStore.show = false}}>
        <XClose />
      </button>
      <Input
        bind:node={inputNode}
        type="leading-text"
        bind:value={search}
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
        <Tabbar type="button_gray" size="sm" data={tabs} />
      </div>
      {:else}
        <div class="empty-tabbar"></div>
    {/if}
  </div>
  {#if search && isInputInFocus}
    <div
      class="search-suggestions"
      in:fade={{ duration: 400, easing: quadOut }}
    >
      {#each ["Sportstack", "Forecasts", "Predictions"] as item}
        <button class="suggest-item">
          <div class="suggestion-text">{item}</div>
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
        {#each searchHistory as text}
          <button
            class="recent-search-item"
            on:click={() => {
              search = text;
              inputNode?.focus();
              inputNode?.setSelectionRange(search.length, search.length);
              skipBlur = true;
            }}
          >
            {text}
          </button>
        {/each}
      </div>
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
      width: 100vw;
      height: 100vh;
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
        padding-top: 61px;
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
            color: var(--colors-base-white, #fff);

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
        flex-grow: 1;
        width: 100%;
        background: var(--colors-background-bg-main);
        padding-top: 16px;

        .search-message-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: var(--spacing-xs, 4px);
          align-self: stretch;

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
          padding: 16px;
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 16px;

          .search-title {
            color: var(--colors-base-white, #fff);

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
            color: var(--colors-base-white, #fff);

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
