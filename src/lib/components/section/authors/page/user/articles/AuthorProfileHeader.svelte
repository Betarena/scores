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

  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import StackedAvatars from "$lib/components/ui/StackedAvatars.svelte";
  import session from "$lib/store/session.js";
  import { createEventDispatcher, onMount } from "svelte";
  import type { BetarenaUser } from "$lib/types/types.user-settings.js";
  import userSettings from "$lib/store/user-settings.js";
  import { Betarena_User_Class } from "@betarena/scores-lib/dist/classes/class.betarena-user.js";
  import ShareIcon from "./assets/share-icon.svelte";
  import { page } from "$app/stores";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import { browser } from "$app/environment";
  import type { IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import type { IBetarenaUser } from "@betarena/scores-lib/types/_FIREBASE_.js";
  import { userNameToUrlString } from "../../../common_ui/helpers.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";

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
    highlited_sportstack:
      | (IPageAuthorAuthorData & { owner: IBetarenaUser })
      | undefined;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author-profile⮕header";

  const dispatch = createEventDispatcher();

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
  $: follower_count = followed_by.length;
  $: ({ viewportType } = $session);

  $: isOwner = uid === $userSettings.user?.firebase_user_data?.uid;
  $: ({ user } = $userSettings);

  $: isFollowed =
    user?.scores_user_data?.following?.authors?.includes(uid) || false;
  $: isSubscribed =
    user?.scores_user_data?.subscriptions?.authors?.includes(uid) || false;
  $: isAuth = !!user;

  $: link = $page.url.pathname + "/subscribers";
  $: if (browser) getSubscribers(subscribed_by);

  const BetarenaUsers = new Betarena_User_Class();
  let subscribers: BetarenaUser[] = [];

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

  async function action(type: "user-subscriptions" | "user-following", follow) {
    if (!isAuth) {
      $session.currentActiveModal = "Auth_Modal";
      return;
    }
    userSettings.updateData([[type, { target: "authors", id: uid, follow }]]);
  }

  async function getSubscribers(subscribers_arr = []) {
    subscribers = [];
    if (!subscribers_arr.length) return;
    const ids = subscribers_arr.slice(0, 3);
    const users = await BetarenaUsers.obtainPublicInformationTargetUsers(ids);
    subscribers = [...users] as BetarenaUser[];
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

<div
  class="user-header-wrapper"
  id={CNAME}
  class:mobile={viewportType === "mobile"}
>
  <div class="user-block">
    <div class="social-info">
      <Avatar size={64} src={profile_photo} />

      <div class="following-info">
        <a href={link} class="follow-block">
          <div class="count">{follower_count}</div>
          <div class="follow-block-text">
            <TranslationText
              text={translations.followers}
              fallback="Followers"
            />
          </div>
        </a>
        <a href={link} class="follow-block">
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
    {#if subscribers.length}
      <a href={link} class="followers">
        <StackedAvatars
          src={subscribers.map((u) => u.profile_photo || "")}
          size={viewportType === "desktop" ? 30 : 24}
        />
        <div class="followers-names">
          <TranslationText
            text={translations.subscribed_by}
            fallback="Subscribed by"
          />
          {#each subscribers as follower, index}
            <a
              class="username"
              on:click|stopPropagation
              href="/a/user/{userNameToUrlString(follower.username)}"
            >
              <span>
                {" "}
                {`${follower.username}${
                  index < subscribers.length - 1 ? "," : ""
                }`}
              </span>
            </a>
          {/each}
          {#if subscribed_by.length > 3}
            <span class="username">
              and {subscribed_by.length - 3} others
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
            {isFollowed ? "Unfollow" : "Follow"}
          {/if}
        </Button>
      {/if}
      <Button type="secondary" style="width: 40px; height: 40px; padding: 0">
        <ShareIcon />
      </Button>
    </div>
    {#if highlited_sportstack}
      <a
        class="sportstack"
        href="/a/sportstack/{userNameToUrlString(
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
              href="/a/user/{userNameToUrlString(
                highlited_sportstack.owner.username
              )}"
            >
              <TranslationText text={translations.by} fallback="By" />
              {highlited_sportstack.owner.username}
            </a>
          </div>
        </div>
        <div class="sportstack-description">
          {highlited_sportstack.data?.about}
        </div>
      </a>
    {:else}
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
    background-color: var(--bg-color);
    --text-button-size: 14px;

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
    }

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
              color: var(--text-color-second);
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
          color: var(--text-color-second);
          font-size: 12px;
        }
      }

      .user-description {
        font-family: Roboto;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        color: var(--text-color-second);
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
          }
          .owner {
            color: var(--text-color-second);
            font-family: Inter;
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
          color: var(--text-color-second);
          font-family: Roboto;
          font-size: var(--text-size-s);
          font-style: normal;
          font-weight: 400;
          line-height: 18px; /* 150% */
        }
      }
    }
  }
</style>
