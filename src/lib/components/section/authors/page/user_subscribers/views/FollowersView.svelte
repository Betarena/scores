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
  import type { IBetarenaUser } from "$lib/types/types.user-settings.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import FollowersHeaderLoader from "./FollowersHeaderLoader.svelte";
  import SeoBox from "$lib/components/SEO-Box.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import type { IBetarenaUser } from "@betarena/scores-lib/types/_FIREBASE_.js";
  import { listenRealTimeUserUpdates } from "$lib/firebase/common.js";
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
  let reloading = false;
  let displayedData = {
    subscribers: new Map<string, IBetarenaUser>(),
    followers: new Map<string, IBetarenaUser>(),
    following: new Map<string, IBetarenaUser>(),
  };
  let rawData = {
    subscribers: [] as string[],
    followers: [] as string[],
    following: [] as string[],
  };
  let prevAuthorId = "";
  let profileLoading = false;
  let unsubscribe;

  $: userProfile = (
    user ? { ...user?.scores_user_data, uid: user?.firebase_user_data.uid } : {}
  ) as IBetarenaUser;

  $: selectedOption = ($page.params.type || "subscribers") as TSelectedOption;
  $: ({ globalState } = $session);
  $: ({ user } = $userSettings);
  $: isPWA = globalState.has("IsPWA");
  $: currentData = displayedData[selectedOption];
  $: noUsers = !currentData?.size;
  $: if (browser && prevAuthorId !== author?.uid) {
    prevAuthorId = author?.uid;
    displayedData = {
      subscribers: new Map(),
      followers: new Map(),
      following: new Map(),
    };

    rawData = {
      subscribers: (author?.subscribed_by || []).reverse(),
      followers: (author?.followed_by || []).reverse(),
      following: (author?.following?.authors ?? []).reverse(),
    };
    profileLoading = true;
    subscribeOnUserChanges(prevAuthorId);
    Promise.all([
      loadUsers("subscribers"),
      loadUsers("followers"),
      loadUsers("following"),
    ]).then(() => {
      profileLoading = false;
      scrollHandler();
    });
  }

  function subscribeOnUserChanges(uid) {
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = listenRealTimeUserUpdates(uid, (updates) => {
      if (!updates) return;
      const fb = (updates.followed_by || []).reverse();
      const sb = (updates.subscribed_by || []).reverse();
      if (fb.join("") !== rawData.followers.join("")) {
        rawData.followers = fb;
        loadUsers("followers", true);
      }
      if (sb.join("") !== rawData.subscribers.join("")) {
        rawData.subscribers = sb;
        loadUsers("subscribers", true);
      }
    });
  }

  async function loadUsers(type: TSelectedOption, reload: boolean = false) {
    const offset = reload ? 0 : displayedData[type]?.size || 0;
    const to = reload
      ? Math.ceil((displayedData[type]?.size || 1) / 10) * 10
      : Math.ceil((offset + 10) / 10) * 10;
    const userInList = rawData[type]?.includes(user?.firebase_user_data.uid);
    let ids = rawData[type].slice(offset, to);
    if (userInList)
      ids = ids.filter((id) => id !== user?.firebase_user_data.uid);
    reloading = true;
    loading = !reload;

    const res = (
      await BetarenaUserHelper.obtainPublicInformationTargetUsers({
        query: {},
        body: { user_uids: ids },
      })
    );
    if (!res || !res?.success) {
      reloading = false;
      loading = false;
      return;
    }
    const prevData = reload ? new Map() :  displayedData[type];
    let nextMap  = new Map<string, IBetarenaUser>();
    if (userInList) {
      nextMap.set(userProfile.uid, userProfile);
     }
     const prevProfiles = userInList ? [userProfile, ...prevData] : prevData;
     const users = res.success.data as IBetarenaUser[];
    nextMap = new Map([...nextMap, ...prevData]);
    users.forEach((u) => nextMap.set(u.uid, u));
    displayedData[type] = nextMap;

    displayedData = { ...displayedData };
    reloading = false;
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
<SeoBox>
  <h1>{author.name || author.username}</h1>
  <a href={`${$page.url.origin}/a/user/${author.usernamePermalink}`}>
    {author.usernamePermalink}
  </a>
  <a href={`${$page.url.origin}/a/user/${author.usernamePermalink}/subscribers`}>
    subscribers
  </a>
  <a href={`${$page.url.origin}/a/user/${author.usernamePermalink}/followers`}>
    followers
  </a>
  <a href={`${$page.url.origin}/a/user/${author.usernamePermalink}/following`}>
    following
  </a>
</SeoBox>
<svelte:window on:scroll={scrollHandler} />
<div class="wrapper" id={CNAME}>
  {#if profileLoading}
    <FollowersHeaderLoader />
  {:else}
    <FollowersHeader
      {author}
      selection={selectedOption}
      {translations}
      on:select={select}
    />
  {/if}

  {#if noUsers}
    <div class="no-articles">
      <div class="text">
        <TranslationText
          text={translations.no_users}
          fallback="No users at this moment"
        />
      </div>
      <!-- [TODO] Uncomment when creation logic is implemented -->
      <!-- {#if isOwner}
      <Button type="primary">Create new article</Button>
    {/if} -->
    </div>
  {:else}
    <FollowersList
      {translations}
      users={!profileLoading ? currentData : new Map()}
      loading={profileLoading || loading}
      emptyMessage="no {selectedOption} yet"
    />
    {#if !isPWA && currentData?.size < rawData[selectedOption]?.length && !profileLoading && !reloading && !loading}
      <div class="load-more">
        <Button type="outline" on:click={() => loadUsers(selectedOption)}>
          <TranslationText text={translations.view_more} fallback="View More" />
        </Button>
      </div>
    {/if}
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

    .no-articles {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      background: var(--bg-color);
      flex-grow: 1;
      padding-top: 80px;

      .text {
        color: var(--text-color);
        opacity: 0.8;
        max-width: 179px;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }
</style>
