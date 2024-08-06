<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Notifications Section Layout                                                    │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

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

  import { page } from "$app/stores";

  import sessionStore from "$lib/store/session.js";
  import type { PageData } from ".svelte-kit/types/src/routes/notifications/$types.js";

  import SvelteSeo from "svelte-seo";
  import NotificationsHeader from "./NotificationsHeader.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import NotificationListItem from "./NotificationListItem.svelte";
  import Tag from "$lib/components/ui/Tag.svelte";
  import { fly } from "svelte/transition";
  import { elasticOut } from "svelte/easing";

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

  export let data: PageData;

  const /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = "notifications-layout";
  let selectedTab;
  let newNotifications = 0;
  $: notificationsList = notifications[selectedTab?.id] || new Map();
  setTimeout(() => {
    newNotifications = 10;
  }, 2500);
  const competitionsNotifications = [
    [
      1,
      {
        id: 1,
        text: "You have won {count} on the competition!",
        amount: 6,
        title: "Team England Will Win!",
        date: new Date(),
        isNew: true,
        status: "won",
      },
    ],
    [
      2,
      {
        id: 2,
        text: "You have won {count} on the competition!",
        amount: 6,
        title: "Team England Will Win!",
        date: new Date(),
        isNew: true,
        status: "won",
      },
    ],
    [
      3,
      {
        id: 3,
        text: "A new competition has started!",
        title: "Barcelona Will Win!",
        date: new Date(),
        isNew: false,
        status: "competition_started",
      },
    ],
    [
      4,
      {
        id: 4,
        text: "A new competition has started!",
        title: "Barcelona Will Win!",
        date: new Date(),
        isNew: false,
        status: "competition_started",
      },
    ],
  ];

  const notifications = {
    all: new Map([...competitionsNotifications]),
    competitions: new Map(competitionsNotifications),
    authors: new Map(),
    scores: new Map(),
  };

  $: ({ viewportType } = $sessionStore);
  const options = [
    { id: "all", label: "All" },
    { id: "scores", label: "Scores" },
    { id: "authors", label: "Authors" },
    { id: "competitions", label: "Competitions" },
  ];
  // #endregion ➤ 📌 VARIABLES
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

<section id={CNAME} class={viewportType}>
  <div class="main-content {viewportType}">
    <NotificationsHeader />
    <div class="content">
      <Tabbar
        data={options}
        style={viewportType === "mobile" ? "padding-inline: 16px" : ""}
        bind:selected={selectedTab}
        let:tab
        bottom_border={true}
        on:select
      >
        {tab.label} (10)
      </Tabbar>
    </div>
    <div class="list-wrapper">
      {#if newNotifications}
        <div
          class="new-notifications"
          in:fly={{ easing: elasticOut, y: -10, duration: 3000 }}
        >
          <Tag active={true}>+ {newNotifications} new</Tag>
        </div>
      {/if}
      {#each [...notificationsList] as [id, notification] (id)}
        <div class="list-item" class:active={notification.isNew}>
          <NotificationListItem {notification} />
        </div>
      {/each}
    </div>
  </div>
</section>

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
  :global {
    .mobile#header {
      --header-border: none;
    }
  }
  .mobile {
    padding-top: 3px;
  }
  section {
    background-color: var(--bg-color);
    width: 100%;
    height: 100%;
    &.mobile {
      padding-inline: 0;
    }
  }

  :global(.light-mode #notifications-layout) {
    --Background-bg-secondary_hover: var(--Background-bg-brand-primary);
  }
  .main-content {
    max-width: 824px;
    height: 100%;
    margin: auto;
    --text-size-2xl: 38px;
    --text-size-xl: 24px;
    --text-size-l: 20px;
    --text-size-m: 16px;
    --text-size-s: 14px;
    --text-size-xs: 12px;
    --text-button-size: var(--text-size-m);
    display: flex;
    flex-direction: column;

    .content {
      padding-top: var(--spacing-xl);
      overflow: hidden;
    }

    .list-wrapper {
      margin-top: 20px;
      flex-grow: 1;
      position: relative;

      .new-notifications {
        position: absolute;
        top: 0;
        right: 50%;
        transform: translate(50%, -50%);
        --text-button-size: 12px;
      }

      .list-item {
        width: 100%;
        padding: 11px var(--spacing-xl);
        border-bottom: 1px solid var(--Border-border-tertiary);
        cursor: pointer;

        &.active {
          background-color: var(--Background-bg-secondary);
          border-bottom: 1px solid var(--Border-border-secondary);
        }

        &:hover {
          border-bottom: 1px solid var(--Border-border-secondary);
          background-color: var(--Background-bg-secondary_hover);
        }
      }
    }

    &.mobile {
      padding: 0 !important;
      padding-bottom: 128px;
      width: 100%;
      gap: 8px;
      --text-size-2xl: 24px;
      --text-size-l: 16px;
      --text-size-m: 14px;
      --text-size-s: 12px;
      --text-size-xs: 10px;
    }
  }
</style>
