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
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { createEventDispatcher, onMount } from "svelte";
  import ArrowDown from "./assets/arrow-down.svelte";
  import type {
    IPageAuthorTagData,
    IPageAuthorTranslationDataFinal,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { page } from "$app/stores";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import { post } from "$lib/api/utils.js";
  import { writable, type Writable } from "svelte/store";
  import { subscribeTagFollowersListen } from "$lib/graphql/graphql.common.js";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import userSettings from "$lib/store/user-settings.js";

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
  export let translations: IPageAuthorTranslationDataFinal;
  export let mobile = false;
  export let tablet = false;
  export let totalArticlesCount = 0;
  let filterValue = "en";
  let buttonsWidth: number;
  let tagStore: Writable<IPageAuthorTagData>;
  let titleHeight;
  const dispatch = createEventDispatcher<{ filter: string }>();

  $: dispatch("filter", filterValue);

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "<author⮕w⮕tags-content⮕header";
  $: options = [
    ...$page.data.B_NAV_T.langArray
      .map((lang) => ({
        id: lang,
        label: translations[lang] || lang,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
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

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

  $: ({user} = $userBetarenaSettings);
  $: isAuth = !!user;
  $: showDescription = !mobile && tag.description;
  $: followedTags = (($userBetarenaSettings.user?.scores_user_data as any)
    ?.following?.tags || []) as (string | number)[];
  $: isFollowed = followedTags.includes(tag?.id);

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * subscribes to tag folowers changes each time the tag is recreated
   * and unsubscribe from  previous subscription
   * WARNING:
   * triggered by changes in:
   * - `tag`
   */
  let subscribtion;
  $: if (tag && browser) subscribe(tag);
  function subscribe(tag: IPageAuthorTagData) {
    if (subscribtion) subscribtion.unsubscribe();
    tagStore = writable({ ...tag, followers: [...(tag.followers || [])] });
    subscribtion = subscribeTagFollowersListen($tagStore.id, tagStore);
  }
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

  function toggleDescription() {
    if (!mobile || !tag.description) return;
    showDescription = !showDescription;
  }

  async function follow() {
    if (!isAuth) {
      $sessionStore.currentActiveModal = "Auth_Modal";
      return;
    }
    userBetarenaSettings.updateData([
      ["user-following", { target: "tags", id: tag.id, follow: !isFollowed }],
    ]);
    await post("/api/data/author/tags", {
      tagId: tag.id,
      follow: !isFollowed,
    });
  }
  // #endregion ➤ 🛠️ METHODS

  onMount(() => {
    filterValue = userSettings.extract("lang") || "en";
    return () => subscribtion && subscribtion.unsubscribe();
  })
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

<div class="tags-header-wrapper" class:mobile class:expand={showDescription} style="--max-title-height: {titleHeight}px">
  <div class="header-buttons" bind:clientHeight={titleHeight} >
    <div class="tag-info-wrapper">
      <h1 on:click={toggleDescription} >
        {tag.name}
        {#if mobile && tag.description}
          <span class="arrow-down" class:opend={showDescription}>
            <ArrowDown />
          </span>
        {/if}
      </h1>
      <div class="tag-info">
        <span>
          {#key $tagStore?.followers?.length !== tag.followers?.length}
            <span in:fade={{ duration: 700 }}>
              {$tagStore?.followers?.length || 0}
            </span>
          {/key}

          <TranslationText
            key={`unknown`}
            text={translations.followers}
            fallback={"followers"}
          />
        </span>
        <div class="tag-info-splitter" />
        <span
          >{totalArticlesCount}
          <TranslationText
            key={`unknown`}
            text={translations.articles}
            fallback={"articles"}
          /></span
        >
      </div>
    </div>
    <div class="action-buttons" bind:clientWidth={buttonsWidth}>
      {#if !mobile}
        <SelectButton bind:value={filterValue} {options} let:currentValue>
          <div>
            <span>
              <TranslationText
                key={`unknown`}
                text={translations.subtitle}
                fallback={"Language"}
              /> :
            </span>
            <TranslationText
              key={`unknown`}
              text={translations[currentValue.id]}
              fallback={currentValue?.label}
            />
          </div>
        </SelectButton>
      {/if}

      <Button type={isFollowed ? "outline" : "primary"} on:click={follow}>
        <span>
          {#if !isFollowed}
            +
          {/if}
          <TranslationText
            key={`unknown`}
            text={isFollowed ? translations.following : translations.follow}
            fallback={isFollowed ? "Following" : "Follow"}
          />
        </span>
      </Button>
    </div>
  </div>
  {#if tag.description}
    <div
      class="header-description"
      style={!mobile && !tablet
        ? `width: calc(100% - ${buttonsWidth + 10}px)`
        : ""}
    >
      <span>{tag.description}</span>
    </div>
  {/if}
</div>

{#if mobile}
  <div class="mobile-selection">
    <SelectButton bind:value={filterValue} {options} let:currentValue>
      <div>
        <span>
          <TranslationText
            key={`unknown`}
            text={translations.subtitle}
            fallback={"Language"}
          /> :
        </span>
        <TranslationText
          key={`unknown`}
          text={translations[currentValue.id]}
          fallback={currentValue?.label}
        />
      </div>
    </SelectButton>
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
  .tags-header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--text-color-second);

    &.mobile {
      padding: 0 16px;
      max-height: var(--max-title-height);
      overflow: hidden;
      transition: max-height 1s ease-in-out;

      &.expand {
        max-height: 300px;
      }
      .tag-info-wrapper .tag-info {
        font-size: var(--text-size-s) !important;
      }
    }

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
          font-size: var(--text-size-2xl);
          margin: 0;
          font-style: normal;
          font-weight: 600;
          display: flex;
          gap: 4px;
          align-items: center;
          line-height: 142%;

          .arrow-down {
            transition: transform;
            transition-duration: 0.7s;
            width: 16px;
            display: flex;
            height: 16px;
            transform: rotate(360deg);
            &.opend {
              transform: rotate(180deg);
            }
          }
        }

        .tag-info {
          display: flex;
          gap: 5px;
          align-items: center;
          color: var(--text-color-second);
          font-family: Roboto;
          font-size: var(--text-size-xs);
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
        font-size: var(--text-size-m) !important;
        align-items: center;
      }
    }

    .header-description {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }
  .mobile-selection {
    margin-top: 32px;
    margin-bottom: 16px;
    padding: 0 16px;
  }
</style>
