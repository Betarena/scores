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

  export let author: BetarenaUser;

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

  $:  link = $page.url.pathname + "/subscribers"

  let users = [];
  const BetarenaUsers = new Betarena_User_Class();

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // onMount(() => {});

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

  function followersClick() {
    goto($page.url.pathname + "/subscribers");
  }

  function follow() {
    action("user-following", !isFollowed);

  }

  function subscribe() {
    action("user-subscriptions", !isSubscribed)
  }

  async function action(type: "user-subscriptions" |  "user-following" , follow) {
    if (!isAuth) {
      $session.currentActiveModal = "Auth_Modal";
      return;
    }
    userSettings.updateData([
      [
        type,
        {target: "authors", id: uid, follow}
      ]
    ])
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

      <a href={link} class="follow-block">
        <div class="count">{follower_count}</div>
        <div class="follow-block-text">Followers</div>
      </a>
      <a  href={link} class="follow-block" >
        <div class="count">{authors_followings.length}</div>
        <div class="follow-block-text">Following</div>
      </a>
    </div>

    <div class="user-info">
      {#if name}
        <div class="name">{name}</div>
      {/if}
      <div class="nick">@{username}</div>
    </div>

    {#if about}
      <div class="user-description">
        {about}
      </div>
    {/if}
    <a href={link} class="followers" >
      <StackedAvatars src={[null, null, null]} size={24} />
      <div class="followers-names">
        Subscribed by
        {#each ["tigasdamassa", "tiagomartins"] as follower}
          <span class="username">
            {" "}
            {follower},
          </span>
        {/each}

        <span class="username"> and 12 others </span>
      </div>
    </a>
  </div>
  <div class="actions-wrapper">
    <div class="buttons-wrapper">
      {#if isOwner}
        <a href="/u/dashboard/{$userSettings.lang}" class="edit-button">
          <Button type="secondary" style="flex-grow: 1;">Edit my Profile</Button
          >
        </a>
      {:else}
        <Button
          type={isSubscribed ? "subtle" : "primary"}
          style="flex-grow: 1;"
          on:click={subscribe}
          >{isSubscribed ? "Unsubscribe" : "Subscribe"}</Button
        >
        <Button
          type={isFollowed ? "subtle" : "secondary"}
          style="flex-grow: 1;"
          on:click={follow}>{isFollowed ? "Unfollow" : "Follow"}</Button
        >
      {/if}
      <Button type="secondary" style="width: 40px; height: 40px; padding: 0">
        <ShareIcon />
      </Button>
    </div>

    <div class="sportstack">
      <div class="sportstack-info">
        <div
          class="sportstack-image"
          style="background: url('https://s3-alpha-sig.figma.com/img/ead9/422f/35e3b50c15d637cc9219c84e6578d300?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EmvyAFwy5cFn4kbaOCzPBmg2mcO6P7VUi~P0P46f86WYbq52HvxuxJgpqXFcOuXP-G5q5Lsv6jzPovh1Xt-aeEKnDtwgZoMG2TpTw41A5LJAAFFMbYcVwEAqBPWf4VT3SVc-hXB8u~dk7IT-Ntu77WBnXLTGKCZePMQykjBbrkS0NTiFhvHFIOAmbQ-HmlgIdvrJZxvVQR2f0Xe9g5qX2Tle37SNqA2EjlOaxzMbn4zw8MXcRkAOzATeOzao1GNdD3yUt~pHs6EDiRVLxf9xjKXYsYdUn~geDu12j7HP9CNuW9nC~CgzE6NeTQLFi0UjU3aQuYVsSDJTYAAg06hM-A__') lightgray -10.166px -9.798px / 143.179% 143.179% no-repeat;"
        />
        <div class="sportstack-name">
          <div class="name">Sports Best</div>
          <div class="owner">By Rogrigo Monteirasso</div>
        </div>
      </div>
      <div class="sportstack-description">
        Its a publication that the user can create, there are no limit on the
        number of Sportstack.
      </div>
    </div>
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

    &.mobile {
      gap: 20px;
      padding-inline: 16px;
      padding-top: 3px;
      flex-direction: column;

      .actions-wrapper {
        flex-direction: column;
        justify-content: space-between;
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
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        color: var(--text-color-second);
      }

      .followers {
        display: flex;
        gap: 8px;
        font-family: Inter;
        font-size: 10px;
        font-style: normal;
        line-height: 13px;
        margin-top: 4px;
        align-items: center;
        color: var(--text-color-second);
        cursor: pointer;

        .followers-names {
          max-width: 206px;
        }

        .username {
          font-weight: 500;
          color: var(--text-color);
        }
      }
    }

    .actions-wrapper {
      display: flex;

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

        &-image {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          object-fit: cover;
          background-image: url(src);
          background-repeat: no-repeat;
          background-size: cover;
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
          }
        }

        &-description {
          color: var(--text-color-second);
          font-family: Inter;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px; /* 150% */
        }
      }
    }
  }
</style>
