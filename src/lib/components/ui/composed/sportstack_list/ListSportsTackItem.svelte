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
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import SportstackAvatar from "../../SportstackAvatar.svelte";
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

  export let user: any, translations: IPageAuthorTranslationDataFinal;
  export let size: number | string = 40;
  export let action_button = true;
  export let includeAbout = false;

  $: ({ viewportType } = $session);
  $: ({ user: ctx } = $userSettings);
  $: ({ username, name, avatar, about } = user.data);
  $: ({ permalink, id, uid } = user);
  $: isAuth = !!ctx;
  $: isFollow = !!(
    ctx?.scores_user_data?.subscriptions?.sportstacks || []
  ).includes(id);

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

  function handleClick() {
    if (!isAuth) {
      $session.currentActiveModal = "Auth_Modal";
      return;
    }
    userSettings.updateData([
      ["user-subscriptions", { target: "sportstacks", id, follow: !isFollow }],
    ]);
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

<div class="list-item {viewportType}">
  <a href="/a/sportstack/{permalink}" class="user-info">
    <div class="avatar-wrapper">
      <SportstackAvatar {size} src={avatar} />
    </div>
    <div class="name-wrapp">
      <div class="user-name">{name || username}</div>
      {#if includeAbout}
        <div class="user-about">{about}</div>
      {/if}
    </div>
  </a>
  {#if uid!== ctx?.firebase_user_data?.uid && action_button}
    <Button
      disabled={!user.actionButton}
      type={isFollow ? "secondary" : "primary"}
      style="padding:10px 16px; font-size: 14px; height:{size === 'lg'
        ? '36px'
        : '32px'}; min-width: 72px "
      on:click={handleClick}
    >
      <TranslationText
        text={translations[isFollow ? "following" : "follow"]}
        fallback={isFollow ? "Following" : "Follow"}
      />
    </Button>
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
  .list-item {
    display: flex;
    padding-block: 16px;
    border-bottom: var(--header-border);
    justify-content: space-between;
    gap: 20px;
    align-items: start;

    .user-info {
      display: flex;
      justify-content: start;
      flex-grow: 1;
      align-items: start;
      gap: 12px;
      color: var(--text-color);
      font-family: Roboto;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
      .avatar-wrapper {
        flex-shrink: 0;
      }

      &:hover {
        color: var(--primary);
      }

      .name-wrapp {
        display: flex;
        flex-direction: column;

        .user-name {
          line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
        }
        .user-about {
            color: var(--colors-text-text-tertiary-600, #8c8c8c);
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-xs, 12px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-xs, 18px); /* 150% */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
      }
    }

    &.mobile {
      padding: 16px;
      padding-block: 8px;
      border-bottom: none;
    }
  }
</style>
