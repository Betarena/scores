<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { page } from "$app/stores";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { generateUrlCompetitions } from "$lib/utils/string.js";
  import HeaderNavBtn from "./Header-Nav-Btn.svelte";
  import {
    routeIdContent,
    routeIdPageCompetitionLobby,
    routeIdPagePlayer,
    routeIdPageSport,
    routeIdScores,
  } from "$lib/constants/paths.js";
  import CustomizationIcon from "./assets/CustomizationIcon.svelte";
  import DotsIcon from "./assets/dots-icon.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";

  interface INavBtnData {
    key: string[];
    url: string | undefined;
    navTxt: string;
    isNew: boolean;
    newTxt: string;
    id: string;
  }

  export let /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true],
    translationData;

  let dragDisabled = true;

  $: ({ buttons_order } = {
    ...$userBetarenaSettings.user?.scores_user_data,
  });
  $: ({user} = $userBetarenaSettings);
  $: isAuth = !!user;
  $: ({ serverLang } = $sessionStore);
  $: navButtonOrderList = [
    {
      id: "scores",
      key: [routeIdScores, routeIdPageSport, routeIdPagePlayer],
      url: `${serverLang !== "en" ? `/${serverLang}` : ""}/scores`,
      navTxt:
        translationData?.scores_header_translations?.section_links
          ?.scores_title ?? "SCORES",
      isNew: false,
    },
    {
      id: "content",
      key: [routeIdContent],
      url: translationData?.scores_header_translations?.section_links
        ?.sports_content_url,
      navTxt:
        translationData?.scores_header_translations?.section_links
          ?.sports_content_title ?? "SPORTS CONTENT",
      isNew: false,
      newTxt: "New",
    },
    // {
    //   id: "competitions",
    //   key:[routeIdPageCompetitionLobby],
    //   url: generateUrlCompetitions(serverLang!, $page.data.B_SAP_D3_CP_H),
    //   navTxt:
    //     translationData?.scores_header_translations?.section_links
    //       ?.competitions_title ?? "COMPETITIONS",
    //   isNew: false,
    //   newTxt: "New",
    // },
  ] as INavBtnData[];

  $: if (buttons_order && !dragStart) {
    navButtonOrderList = buttons_order?.map((id) =>
      navButtonOrderList.find((btn) => btn.id === id)
    ).filter(bt => bt);
  }

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
  let initialOrder;
  let dragStart = false;
  function handleDndConsider(e) {
    dragStart = true;
    if (!initialOrder) {
      initialOrder = navButtonOrderList;
    }
    navButtonOrderList = e.detail.items;
  }
  function handleDndFinalize(e) {
    navButtonOrderList = e.detail.items;
    if (!isAuth) {
      $sessionStore.currentActiveModal = "Auth_Modal";
      navButtonOrderList = initialOrder;
      dragStart = false;
      return;
    }
    userBetarenaSettings.updateData([
      ["user-buttons-order", navButtonOrderList.map(({ id }) => id)],
    ]);
    dragStart = false;
  }
  function transformDraggedElement(draggedElement: HTMLElement) {
    draggedElement.style.outline = "none !important";
    draggedElement.setAttribute("nav-dragged", "true");
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<div class="navigation-wrapper">
  <div
    class="nav-buttons-wrapper"
    style="outline: none !important;"
    use:dndzone={{
      items: navButtonOrderList,
      flipDurationMs: 300,
      dropTargetClasses: ["drop-zone"],
      dragDisabled,
      transformDraggedElement,
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each navButtonOrderList as { key, url, navTxt, isNew, newTxt, id } (id)}
      <div class="nav-button color-grey" animate:flip={{ duration: 300 }}>
        <HeaderNavBtn
          navKey={key}
          navUrl={url}
          {navTxt}
          {isNew}
          {newTxt}
          {VIEWPORT_TABLET_INIT}
          {VIEWPORT_MOBILE_INIT}
        />
        {#if !dragDisabled}
          <div class="dots-icon">
            <DotsIcon />
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div
    class="custom-icon"
    class:active={!dragDisabled}
    on:click={() => {
      dragDisabled = !dragDisabled;
    }}
  >
    <CustomizationIcon />
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

  .drop-zone {
    border: none;
    outline: none !important;
  }
  .navigation-wrapper {
    display: flex;
    flex-grow: 1;
    justify-content: start;
    gap: 32px;
    align-items: center;

    .nav-buttons-wrapper {
      display: flex;
      gap: 32px;
      justify-content: start;
      align-items: center;
      outline: none !important;

      &:focus-visible {
        outline: none !important;
      }
    }
    .nav-button {
      display: flex;
      gap: 8px;
      align-items: center;
      position: relative;

      .dots-icon {
        position: absolute;
        right: -25px;
        top: 45%;
        height: 25px;
        transform: translateY(-50%);
      }
    }

    .custom-icon {
      margin-top: 0px;
      cursor: pointer;
      --outline-color: #8c8c8c;
      --icon-dot-color: #8c8c8c;
      --icon-fill: "none";
      height: 24px;
      margin-top: -4px;

      &.active {
        --icon-fill: var(--text-color);
        --icon-dot-color: var(--bg-color);
        --outline-color: "none";
      }
    }
  }
</style>
