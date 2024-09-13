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

  import sessionStore from "$lib/store/session.js";
  import { newNotifications as notificationsStore, notReadNotifications } from "$lib/firebase/notifications.js";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/[[lang=lang]]/notifications/$types.js";

  import NotificationsHeader from "./NotificationsHeader.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import NotificationListItem from "./NotificationListItem.svelte";
  import Tag from "$lib/components/ui/Tag.svelte";
  import { fade, fly } from "svelte/transition";
  import { elasticOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import NoNotifications from "./assets/NoNotifications.svelte";
  import NotificationListItemLoader from "./NotificationListItemLoader.svelte";
  import session from "$lib/store/session.js";
  import type { INotificationMessage } from "$lib/types/types.notifications.js";
  import { get } from "$lib/api/utils.js";
  import userSettings from "$lib/store/user-settings.js";

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
  let loading = false;
  let notifications = {
    all: [] as INotificationMessage[],
    competitions: [] as INotificationMessage[],
    // authors: new Map(),
    // scores: new Map(),
  };
  $: newNotifications = $notificationsStore.length;
  $: notificationsList = (notifications[selectedTab?.id] ||
    []) as INotificationMessage[];
  $: ({ serverLang = "en" } = $session);
  $: ({ tr, notifications: n } = data || {});
  $: translationsMap = tr?.[0];
  $: translations = translationsMap?.get(serverLang)?.translation;
  $: templates = translations?.message?.message;
  $: messages = n?.user?.messages;
  $: ({ viewportType } = $sessionStore);


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

  $: options = [
    { id: "all", label: translations?.general?.all || "All" },
    // { id: "scores", label: "Scores" },
    // { id: "authors", label: "Authors" },
    { id: "competitions", label: translations?.general?.competitions || "Competitions" },
  ];

  $: if (templates && messages) {
    initMessages(messages);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
  function read(notifiaction) {
    fetch(`/api/notifications?messageId=${notifiaction.id}`, {
      method: "PUT",
    });
    notifiaction.is_read = true;
    notifications = { ...notifications };
  }

  function initMessages(messages) {
    const all: INotificationMessage[] = [];
    const competitions: INotificationMessage[] = [];
    messages.forEach((m) => {
      const message = { ...m, template: templates?.[m.template_id as number] };
      all.push(message);
      competitions.push(message);
    });
    notifications = { all, competitions };
    if (selectedTab?.id) {
      notificationsList = notifications[
        selectedTab?.id
      ] as INotificationMessage[];
    }
  }

  async function addNotifications() {
    loading = true;
    const res = await get<PageData["notifications"]>(
      `/api/notifications?uid=${userSettings.extract("uid")}`
    );

    initMessages((res as PageData["notifications"]).user.messages);
    notificationsStore.set([]);
    loading = false;
  }

  async function readAll() {
    await addNotifications();
    const not_readed = notifications.all.filter((n) => !n.is_read);
    fetch(
      `/api/notifications?messageIds=${not_readed.map((n) => n.id).join(",")}`,
      {
        method: "PUT",
      }
    );
    not_readed.forEach((n: any) => (n.is_read = true));
    notReadNotifications.set([]);
    notifications = { ...notifications };
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

<section id={CNAME} class={viewportType}>
  <div class="main-content {viewportType}">
    <NotificationsHeader on:readAll={readAll} {translations}>
      {translations?.general?.notifications || "Notifications"}
    </NotificationsHeader>
    <div class="tabbar">
      <Tabbar
        data={options}
        style={viewportType === "mobile" ? "padding-inline: 16px" : ""}
        bind:selected={selectedTab}
        let:tab
        translations={{
          all: translations?.general?.all || "",
          competitions: translations?.general?.competitions || "",
        }}
        bottom_border={true}
        on:select
      >
        {tab.label} ({notifications[tab.id]?.length || 0})
      </Tabbar>
    </div>
    <div class="list-wrapper">
      {#if newNotifications}
        <div
          class="new-notifications"
          in:fly={{ easing: elasticOut, y: -10, duration: 3000 }}
        >
          <Tag size="md" active={true} on:click={addNotifications}
            >+ {newNotifications} new</Tag
          >
        </div>
      {/if}
      {#if !notificationsList.length && !loading}
        <div class="no-notifications">
          <div class="no-notification-content">
            <NoNotifications />
            <div class="no-notifications-text">
              <div class="title">There are no notifications</div>
              <div class="text">
                There are no notifications at this point. <br /> You can try refreshing
                the page.
              </div>
            </div>
          </div>
        </div>
      {:else}
        {#if loading}
          {#each Array($notificationsStore.length) as _item}
            <div class="list-item loader">
              <NotificationListItemLoader />
            </div>
          {/each}
        {/if}
        {#each notificationsList as notification (notification.id)}
          <div
            class="list-item"
            in:fade={{ delay: 200, duration: 500 }}
            animate:flip={{ duration: 800 }}
            class:active={!notification.is_read}
            on:click={() => read(notification)}
          >
            <NotificationListItem {notification} />
          </div>
        {/each}
      {/if}
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

  :global(.light-mode #notifications-layout .list-wrapper) {
    --background-bg-secondary_hover: var(--background-bg-brand-primary);
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

    .tabbar {
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
        z-index: 100;
        transform: translate(50%, -50%);
        --text-button-size: 12px;
      }

      .no-notifications {
        display: flex;
        padding-top: var(--spacing-10xl);
        flex-direction: column;
        align-items: center;
        flex: 1 0 0;
        align-self: stretch;

        .no-notification-content {
          display: flex;
          width: 273.578px;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xl);

          .no-notifications-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-lg);

            .title {
              color: var(--text-text-primary);
              text-align: center;
              /* Text-lg/Medium */
              font-family: Roboto;
              font-size: 18px;
              font-style: normal;
              font-weight: 500;
              line-height: 22px; /* 122.222% */
            }
            .text {
              color: var(--text-text-tertiary);
              text-align: center;
              /* Text-sm/Regular */
              font-family: Roboto;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 130%; /* 18.2px */
            }
          }
        }
      }

      .list-item {
        width: 100%;
        padding: 11px var(--spacing-xl);
        border-bottom: 1px solid var(--border-border-tertiary);
        cursor: pointer;

        &.active {
          background-color: var(--background-bg-secondary);
          border-bottom: 1px solid var(--border-border-secondary);
        }

        &:not(.loader):hover {
          border-bottom: 1px solid var(--border-border-secondary);
          background-color: var(--background-bg-secondary_hover);
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

      .no-notifications {
        display: flex;
        padding-top: var(--spacing-8xl);
        flex-direction: column;
        align-items: center;
        flex: 1 0 0;
        align-self: stretch;
      }
    }

    &.tablet {
      .no-notifications {
        display: flex;
        padding-top: var(--spacing-9xl);
        flex-direction: column;
        align-items: center;
        flex: 1 0 0;
        align-self: stretch;
      }
    }
  }
</style>
