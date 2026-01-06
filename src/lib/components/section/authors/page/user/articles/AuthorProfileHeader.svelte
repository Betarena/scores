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

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';

  import { BetarenaUserHelper, listenRealTimeUserUpdates } from '$lib/firebase/common.js';
  import session from '$lib/store/session.js';
  import userSettings from '$lib/store/user-settings.js';
  import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ShareButton from '$lib/components/ui/ShareButton.svelte';
  import SportstackAvatar from '$lib/components/ui/SportstackAvatar.svelte';
  import StackedAvatars from '$lib/components/ui/StackedAvatars.svelte';

  import type { BetarenaUser } from '$lib/types/types.user-settings.js';
  import type { IBetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
  import type { IPageAuthorAuthorData } from '@betarena/scores-lib/types/v8/preload.authors.js';
  import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';

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

  export let author: BetarenaUser,
    translations: IPageAuthorTranslationDataFinal,
    subscribers_profiles: BetarenaUser[],
    highlited_sportstack:
      | (IPageAuthorAuthorData & { owner: IBetarenaUser })
      | undefined;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author-profile⮕header";
  let unsubscribe;

  $: ({
    name,
    uid,
    profile_photo,
    username,
    about,
    following,
    followed_by = [],
    subscribed_by = [],
  } = author);
  $: authors_followings = following?.authors || [];
  $: follower_count = followed_by?.length;
  $: ({ viewportType } = $session);

  $: isOwner = uid === $userSettings.user?.firebase_user_data?.uid;
  $: ({ user } = $userSettings);

  $: isFollowed =
  user?.scores_user_data?.following?.authors?.includes(uid) || false;
  $: isSubscribed =
  user?.scores_user_data?.subscriptions?.authors?.includes(uid) || false;
  $: sortSubscribers(subscribers_profiles);
  $: isAuth = !!user;

  $: if (browser && uid) subscribeOnUserChanges(uid);

  // #endregion ➤ 📌 VARIABLES

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
    action("user-following", !isFollowed);
  }

  function subscribe() {
    action("user-subscriptions", !isSubscribed);
  }

  function getLink(type: "subscribers" | "followers" | "following") {
    return $page.url.pathname + `/${type}`;
  }

  function sortSubscribers(arr) {
    if(!isSubscribed) return
    const subscribers = arr.filter(u => u.uid !== user?.firebase_user_data.uid);
    subscribers_profiles = [{...user?.scores_user_data, uid: user?.firebase_user_data.uid}, ...(subscribers.length > 2 ? subscribers.slice(0, 2) : subscribers)];

  }

  function subscribeOnUserChanges(uid) {
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = listenRealTimeUserUpdates(uid, (updates) => {
      if(!updates) return;
      followed_by = updates.followed_by || [];
      const subscribers_ids = updates.subscribed_by?.slice(-3) || [];
      isSubscribed = updates.subscribed_by?.includes(user?.firebase_user_data.uid) || false;
      if (subscribed_by.slice(-3).join() !== subscribers_ids.join()) {
        getSubscribersProfiles(subscribers_ids);
        subscribed_by = updates.subscribed_by || [];
      }
      subscribed_by = updates.subscribed_by || [];
    });
  }

  async function action(type: "user-subscriptions" | "user-following", follow) {
    if (!isAuth) {
      $session.currentActiveModal = "Auth_Modal";
      return;
    }
    userSettings.updateData([[type, { target: "authors", id: uid, follow }]]);
  }

  async function getSubscribersProfiles(ids) {
    const res = (await BetarenaUserHelper.obtainPublicInformationTargetUsers({query: {}, body: {user_uids: ids}})).success;
    if (res) {
      subscribers_profiles = [...res.data] as BetarenaUser[];

    }
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
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

<div
  class="user-header-wrapper"
  id={CNAME}
  class:mobile={viewportType === "mobile"}
>
  <div class="user-block">
    <div class="social-info">
      <Avatar size={64} src={profile_photo} />

      <div class="following-info">
        <a href={getLink("followers")} class="follow-block">
          <div class="count">{follower_count}</div>
          <div class="follow-block-text">
            <TranslationText
              text={translations.followers}
              fallback="Followers"
            />
          </div>
        </a>
        <a href={getLink("following")} class="follow-block">
          <div class="count">{authors_followings.length}</div>
          <div class="follow-block-text">
            <TranslationText
              text={translations.following}
              fallback="Following"
            />
          </div>
        </a>
      </div>
    </div>

    <div class="user-info">
      <div class="name" style="visibility: {name ? 'unset' : 'hidden'}">
        {name || "name"}
      </div>
      <div class="nick">@{username}</div>
    </div>
    {#if about}
      <div class="user-description">
        {about}
      </div>
    {/if}
    {#if subscribers_profiles.length}
      <a href={getLink("subscribers")} class="followers">
        <StackedAvatars
          src={subscribers_profiles.map((u) => u.profile_photo || "")}
          size={viewportType === "desktop" ? 29 : 24}
        />
        <div class="followers-names">
          <span class="subscribed_by">
            <TranslationText
              text={translations.subscribed_by}
              fallback="Subscribed by"
            />
          </span>
          {#each subscribers_profiles as follower, index}
            <a
              class="username"
              on:click|stopPropagation
              href="/a/user/{mutateStringToPermalink(follower.usernamePermalink)}"
            >
              <span>
                {" "}
                {`${follower.username}${
                  index < subscribers_profiles.length - 1 ? "," : ""
                }`}
              </span>
            </a>
          {/each}
          {#if subscribed_by?.length > 3}
            <span class="username">
              and {subscribed_by?.length - 3} others
            </span>
          {/if}
        </div>
      </a>
    {/if}
  </div>
  <div class="actions-wrapper">
    <div class="buttons-wrapper">
      {#if isOwner}
        <a href="/u/settings/{$userSettings.lang}" class="edit-button">
          <Button type="secondary" style="flex-grow: 1;">
            <TranslationText
              text={translations.edit_my_profile}
              fallback="Edit my Profile"
            />
          </Button>
        </a>
      {:else}
        <Button
          type={isSubscribed ? "subtle" : "primary"}
          style="flex-grow: 1;"
          on:click={subscribe}
        >
          {#if isSubscribed}
            <TranslationText
              text={translations.subscribed}
              fallback="Subscribed"
            />
          {:else}
            <TranslationText
              text={translations.subscribe}
              fallback="Subscribe"
            />
          {/if}
        </Button>
        <Button
          type={isFollowed ? "subtle" : "secondary"}
          style="flex-grow: 1;"
          on:click={follow}
        >
          {#if isFollowed}
            <TranslationText
              text={translations.following}
              fallback="Following"
            />
          {:else}
            <TranslationText text={translations.follow} fallback="Follow" />
          {/if}
        </Button>
      {/if}
      {#if viewportType !== "desktop"}
         <ShareButton shareText={$page.data.seoTemplate?.main_data?.description} />
      {/if}
    </div>
    {#if highlited_sportstack}
      <a
        class="sportstack"
        href="/a/sportstack/{mutateStringToPermalink(
          highlited_sportstack.data?.username
        )}"
      >
        <div class="sportstack-info">
          <SportstackAvatar
            size={48}
            src={highlited_sportstack.data?.avatar || ""}
          />
          <div class="sportstack-name">
            <div class="name">{highlited_sportstack.data?.username}</div>
            <a
              class="owner"
              href="/a/user/{mutateStringToPermalink(
                highlited_sportstack.owner.usernamePermalink
              )}"
            >
              <TranslationText text={translations.by} fallback="By" />
              <span class="sportstack-owner-name">
                 {highlited_sportstack.owner.username}

              </span>
            </a>
          </div>
        </div>
        <div class="sportstack-description">
          {highlited_sportstack.data?.about}
        </div>
      </a>
    {:else if viewportType !== "mobile"}
      <div />
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
  .user-header-wrapper {
    display: flex;
    width: 100%;
    gap: 60px;
    justify-content: space-between;
    padding-bottom: 12px;
    background-color: var(--colors-background-bg-primary);
    --text-button-size: 14px;

    .user-block {
      flex-direction: column;
      gap: 12px;
      display: flex;

      .social-info {
        display: flex;
        gap: 40px;

        .following-info {
          display: flex;
          justify-content: center;
          gap: 32px;

          .follow-block {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            cursor: pointer;

            .count {
              color: var(--text-color);
              font-weight: 600;
              font-size: 16px;
            }
            &-text {
              color: #8c8c8c;
              opacity: 0.8;
              font-size: 10px;
            }
          }
        }
      }

      .user-info {
        display: flex;
        flex-direction: column;

        .name {
          color: var(--text-color);
          font-family: Roboto;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          line-height: 28px; /* 140% */
        }
        .nick {
          color: #8c8c8c;
          font-size: 12px;
        }
      }

      .user-description {
        font-family: Roboto;
        font-size: var(--text-size-s);
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        color: var(--text-color);
        opacity: 0.8;
        margin-bottom: 2px;
      }

      .followers {
        display: flex;
        gap: 8px;
        font-family: Roboto;
        font-size: var(--text-size-xs);
        line-height: calc(var(--text-size-xs) + 3px);
        font-style: normal;
        line-height: 13px;
        margin-top: 4px;
        margin-top: auto;
        align-items: center;
        color: var(--text-color-second);
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;

        .followers-names {
          max-width: 206px;
        }
        .subscribed_by {
          color: var(--text-color);
          opacity: 0.8;
        }

        .username {
          font-weight: 500;
          display: inline;
          color: var(--text-color);
          &:hover {
            text-decoration: underline !important;
          }
          &::before {
            content: " ";
          }
        }
      }
    }

    .actions-wrapper {
      display: flex;
      max-width: 345px;
      width: 100%;
      gap: 24px;
      flex-shrink: 0;
      flex-direction: column-reverse;
      justify-content: space-between;

      .buttons-wrapper {
        display: flex;
        gap: 8px;
        width: 100%;

        .edit-button {
          flex-grow: 1;
        }
      }

      .sportstack {
        padding: 16px;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-color-second);
        border-radius: 8px;
        gap: 12px;
        max-width: 345px;
        width: 100%;
        cursor: pointer;

        &:hover {
          background-color: rgba(var(--bg-color-second-rgb-consts), 0.7);
        }

        &-info {
          gap: 12px;
          display: flex;
          align-items: center;
        }

        &-name {
          display: flex;
          flex-direction: column;

          .name {
            font-family: Roboto;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            color: var(--text-color);

            &:hover {
              color: var(--primary);
            }
          }
          .owner {
            color: var(--text-color);
            font-family: var(--font-family-font-family-body, Roboto);
            opacity: 0.8;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
            &:hover {
              text-decoration: underline !important;
            }
          }
        }

        &-description {
          color: var(--text-color);
          font-family: Roboto;
          font-size: var(--text-size-s);
          font-style: normal;
          opacity: 0.8;
          font-weight: 400;
          line-height: 18px; /* 150% */
        }
      }
      .sportstack-owner-name {
        &::before {
          content: "\00a0";
        }
      }
    }


    &.tablet {
      .user-description {
        font-size: 12px;
        line-height: 18px;
        margin-top: 0;
        margin-bottom: 4px;
      }
    }

    &.mobile {
      gap: 20px;
      padding-inline: 16px;
      padding-top: 3px;
      flex-direction: column;

      .actions-wrapper {
        flex-direction: column;
        justify-content: space-between;
        max-width: unset;
        width: 100%;
        .sportstack {
          max-width: unset;
        }
      }

      .user-description {
        line-height: 18px;
        margin-top: 0;
        margin-bottom: 0px;
      }
    }
  }
</style>
