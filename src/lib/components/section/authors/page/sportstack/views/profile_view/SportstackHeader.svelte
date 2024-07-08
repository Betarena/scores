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
  import ShareIcon from "../assets/share-icon.svelte";
  import type { BetarenaUser } from "$lib/types/types.user-settings.js";
  import userSettings from "$lib/store/user-settings.js";
  import SportsTackImg from "$lib/components/section/authors/common_ui/SportsTackImg.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";

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

  export let name;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "user-profile⮕header";

  const dispatch = createEventDispatcher();

  $: ({ viewportType } = $session);

  $: isFollowed = false;
  $: isAuth = !!sportstack;
  const options = [
    { id: "posts", label: "Posts" },
    { id: "people", label: "People" },
  ];

  const sportstack = {
    about: "Previsioni e analisi sul tennis",
    avatar:
      "https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fauthors%2Favatars%2Fbetarena_tennis_avatar.svg?alt=media&token=1aa86e49-07e8-42a3-bbee-7ad2900de3f4",
    badges: [1],
    location: "Rome",
    username: "Betarena Tennis IT",
    creation_date: "2023-12-18T14:43:54.035431+00:00",
  };

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {});

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

  async function follow() {
    if (!isAuth) {
      $session.currentActiveModal = "Auth_Modal";
      return;
    }
    userSettings.updateData([
      ["user-following", { target: "authors", id: "", follow: !isFollowed }],
    ]);

    // await updateFollowed("", []);
  }

  function followersClick() {
    dispatch("changeMode");
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

<div class="sportstack-header-wrapper {viewportType}" id={CNAME}>
  <div class="sportstack-main-info {viewportType}">
    <div class="sportstack-block">
      <div class="sportstack-info">
        <SportsTackImg src={sportstack.avatar} />
        <div class="name">{sportstack.username}</div>
      </div>

      <div class="sportstack-description">
        {sportstack.about}
      </div>
    </div>
    <div class="actions-wrapper">
      <div class="buttons-wrapper">
        <Button type="primary" style="flex-grow: 1;">Subscribe</Button>
        <Button type="secondary" style="width: 40px; height: 40px; padding: 0">
          <ShareIcon />
        </Button>
      </div>
    </div>
  </div>
  <Tabbar
    on:select={followersClick}
    height={12}
    data={options}
    style="gap: 24px; font-size: var(--text-size-m)"
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
  .sportstack-header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: var(--bg-color);
    width: 100%;

    &.mobile {
      padding-inline: 16px;
      padding-top: 3px;
    }

    .sportstack-main-info {
      display: flex;
      gap: 60px;
      justify-content: space-between;

      &.mobile {
        gap: 20px;

        flex-direction: column;

        .actions-wrapper {
          flex-direction: column;
          justify-content: space-between;
          .sportstack {
            max-width: unset;
          }
        }

        .sportstack-block {
          align-items: center;

          .sportstack-info {
            flex-direction: column;
            gap: 16px;
          }
        }
      }

      .sportstack-block {
        flex-direction: column;
        gap: 12px;
        justify-content: center;
        display: flex;

        .social-info {
          display: flex;
          gap: 40px;

          .follow-block {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
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

        .sportstack-info {
          display: flex;
          align-items: center;
          gap: 24px;

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

        .sportstack-description {
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
        }
      }
    }
  }
</style>
