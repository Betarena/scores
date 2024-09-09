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

  import NotificationsHeader from "./NotificationsHeader.svelte";
  import session from "$lib/store/session.js";
  import NotificationsConfigBlock from "./NotificationsConfigBlock.svelte";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/[[lang=lang]]/notifications/settings/$types.js";
  import type { INotificationsConfigSection } from "$lib/types/types.notifications.js";
  import userSettings from "$lib/store/user-settings.js";
  import { browser } from "$app/environment";

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
  $: ({ serverLang = "en" } = $session);
  $: ({notifications, tr} = data)
  $: translationsMap = tr?.[0];
  $: translations = translationsMap?.get(serverLang)?.translation;

  $: if (translations && notifications) {
    const settings = notifications?.user.settings;
    sections = [
      {
        title: translations?.general?.notifications_email || "Email",
        type: "mail",
        options: [
          {
            id: 1,
            label: translations?.message?.title["1"] || "",
            checked: settings?.data?.notification.mail["1"] ?? true,
          },
        ],
      },
      {
        title: translations?.general?.notifications_push || "Push",
        type: "push",
        options: [
          {
            id: 1,
            label: translations?.message?.title["1"] || "",
            checked: settings?.data?.notification.push["1"] ?? true,
          },
          // {
          //   id: 2,
          //   label: translations?.title["2"],
          //   checked: settings?.data?.notification.mail["2"],
          // },
        ],
      },
      {
        title: translations?.general?.notifications_general || "General",
        type: "general",
        options: [
          {
            id: 1,
            label: translations?.message?.title["1"] || "",
            checked: settings?.data?.notification.general["1"] ?? true,
          },
          // {
          //   id: 2,
          //   label: translations?.title["2"],
          //   checked: settings?.data?.notification.mail["2"],
          // },
        ],
      },
    ];
  }
  $: if (browser && sections) {
    const settingsMap = {};
    sections.forEach((section) => {
      settingsMap[section.type] = section;
    });
    userSettings.updateData([["user-notifications-settings",  {...settingsMap}]]);

  }
  const /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = "notifications-config";
  $: ({ viewportType } = $session);
  let sections: INotificationsConfigSection[] =  browser ? userSettings.extract('user-notification-settings') || [] : [];

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
    <NotificationsHeader {translations} config={true}>
      {translations?.general?.notifications_setting}
    </NotificationsHeader>
    <div class="config-blocks">
      {#each sections as section}
        <NotificationsConfigBlock {section}/>
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

      .config-blocks {
        padding-inline: 16px;
      }
    }
  }
</style>
