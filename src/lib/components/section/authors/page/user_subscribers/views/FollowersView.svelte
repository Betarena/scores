<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📌 VARIABLES

  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session.js";
  import { Betarena_User_Class } from "@betarena/scores-lib/dist/classes/class.betarena-user.js";
  import FollowersHeader from "./FollowersHeader.svelte";
  import FollowersList from "../../../common_ui/users_list/UsersList.svelte";
  import type { BetarenaUser } from "$lib/types/types.user-settings.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
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

  export let author, translations: IPageAuthorTranslationDataFinal;

  type TSelectedOption = "subscribers" | "followers" | "following";
  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author⮕followers";

  const BetarenaUserHelper = new Betarena_User_Class();
  let loading = false;
  let displayedData = {
    subscribers: [] as BetarenaUser[],
    followers: [] as BetarenaUser[],
    following: [] as BetarenaUser[],
  };
  let rawData = {
    subscribers: [] as string[],
    followers: [] as string[],
    following: [] as string[],
  };
  let prevAuthorId = "";

  $: selectedOption = $page.params.type || "subscribers";
  $: ({ globalState } = $session);
  $: isPWA = globalState.has("IsPWA");
  $: currentData = displayedData[selectedOption];

  $: if (browser && prevAuthorId !== author?.uid) {
    prevAuthorId = author?.uid;
    displayedData = {
      subscribers: [],
      followers: [],
      following: [],
    };

    rawData = {
      subscribers: author?.subscribed_by || [],
      followers: author?.followed_by || [],
      following: author?.following.authors || [],
    };

    loadUsers("subscribers").then(scrollHandler);
    loadUsers("followers").then(scrollHandler);
    loadUsers("following").then(scrollHandler);
  }

  async function loadUsers(type: TSelectedOption) {
    const offset = displayedData[type]?.length || 0;
    const ids = rawData[type].slice(offset, offset + 10);

    if (!ids.length) return;
    loading = true;

    const users = (await BetarenaUserHelper.obtainPublicInformationTargetUsers(
      ids,
      false
    )) as BetarenaUser[];
    displayedData[type].push(...users);
    displayedData = { ...displayedData };
    loading = false;
  }

  function select(e) {
    selectedOption = e.detail.id;
    const paths = $page.url.href.split("/");
    if (selectedOption === paths[paths.length - 1]) return;
    paths[paths.length - 1] = selectedOption;
    goto(`${paths.join("/")}`, {
      replaceState: true,
      invalidateAll: false,
      noScroll: true,
      keepFocus: true,
    });
  }

  // #endregion ➤ 📌 VARIABLES

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Custom handler for scroll logic.
   * @return { void }
   */
  function scrollHandler(): void {
    if (!isPWA) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5)
      loadUsers(selectedOption);
    return;
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
<svelte:window on:scroll={scrollHandler} />
<div class="wrapper" id={CNAME}>
  <FollowersHeader
    {author}
    selection={selectedOption}
    {translations}
    on:select={select}
  />
  <FollowersList
    {translations}
    users={currentData}
    {loading}
    emptyMessage="no {selectedOption} yet"
  />
  {#if !isPWA && currentData?.length < rawData[selectedOption]?.length}
    <div class="load-more">
      <Button type="outline" on:click={() => loadUsers(selectedOption)}>
        <TranslationText text={translations.view_more} fallback="View More" />
      </Button>
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
  .wrapper {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color);

    .load-more {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }
  }
</style>
