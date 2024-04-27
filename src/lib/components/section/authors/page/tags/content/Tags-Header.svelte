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

  import Button from "$lib/components/ui/Button.svelte";
  import SelectButton from "$lib/components/ui/SelectButton.svelte";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { createEventDispatcher } from "svelte";
  import arrowDown from "./assets/arrow-down.svg";
  import type { IPageAuthorTagData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { page } from "$app/stores";

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

  // #endregion ➤ 📦 Package Imports
  export let tag: IPageAuthorTagData;
  export let mobile = false;
  export let totalArticlesCount = 0;
  let filterValue = "all";

  const dispatch = createEventDispatcher<{ filter: string }>();

  $: dispatch("filter", filterValue);

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "<author⮕w⮕tags-content⮕header";
  $: options = [
    { id: "all", label: "All" },
    ...$page.data.B_NAV_T.langArray.map((lang) => ({ id: lang, label: lang })),
  ];

  // #endregion ➤ 📌 VARIABLES

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * showDescription - controls visability in mobile
   *
   * WARNING:
   * triggered by changes in:
   * - `showDescription` - mobile && tag.description
   */

  $: ({ globalState } = $sessionStore);
  $: showDescription = !mobile && tag.description;
  $: followedTags = (($userBetarenaSettings.user?.scores_user_data as any)?.following?.tags || []) as (string | number)[];
  $: isFollowed  = followedTags.includes(tag.id);

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

  function follow() {
    if (globalState.has("NotAuthenticated")) {
      $sessionStore.currentActiveModal = "Auth_Modal";
      return;
    }
    userBetarenaSettings.updateData([["user-following", {target: "tags", id: tag.id, follow: !isFollowed}]]);

  }

  function toggleDescription() {
    if (!mobile || !tag.description) return;
    showDescription = !showDescription;
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

<div class="tags-header-wrapper">
  <div class="header-buttons">
    <div class="tag-info-wrapper">
      <h1 on:click={toggleDescription}>
        {tag.name}
        {#if mobile && tag.description}
          <img
            id=""
            class:opend={showDescription}
            src={arrowDown}
            alt="arrow-down"
            title=""
            loading="lazy"
          />
        {/if}
      </h1>
      <div class="tag-info">
        <span>{tag.followers?.length || 0} followers</span>
        <div class="tag-info-splitter" />
        <span>{totalArticlesCount} articles</span>
      </div>
    </div>
    <div class="action-buttons">
      {#if !mobile}
        <SelectButton bind:value={filterValue} {options} let:currentValue>
          Language: {currentValue?.label}
        </SelectButton>
      {/if}

      <Button type={isFollowed ? "outline": "primary"} on:click={follow}>{isFollowed ?  "Following" : "+ Follow"}</Button>
    </div>
  </div>
  {#if showDescription && tag.description}
    <div class="header-description">
      <span>{tag.description}</span>
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
  .tags-header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--text-color-second);

    .header-buttons {
      width: 100%;
      display: flex;
      justify-content: space-between;
      display: flex;
      align-items: center;
      align-self: stretch;

      .tag-info-wrapper {
        display: flex;
        flex-direction: column;

        h1 {
          color: var(--text-color);
          font-family: Inter;
          font-size: 38px;
          margin: 0;
          font-style: normal;
          font-weight: 600;
          display: flex;
          gap: 4px;
          align-items: center;
          line-height: 54px; /* 142.105% */

          img {
            transition: transform;
            transition-duration: 0.7s;
            width: 16px;
            height: 16px;
            transform: rotate(360deg) translateY(25%);
            &.opend {
              transform: rotate(180deg);
            }
            path {
              stroke: var(--text-color);
            }
          }
        }

        .tag-info {
          display: flex;
          gap: 5px;
          align-items: center;
          color: var(--text-color-second);
          font-family: Roboto;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px; /* 150% */

          &-splitter {
            width: 2px;
            height: 2px;
            background-color: var(--text-color-second);
            border-radius: 100%;
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 24px;
        align-items: center;
      }
    }

    .header-description {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }
</style>
