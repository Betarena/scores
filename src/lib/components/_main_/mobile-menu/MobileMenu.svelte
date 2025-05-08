<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @izobov                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Platform Mobile Menu                                                           │
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
  import { flip } from "svelte/animate";
  import { fade, scale } from "svelte/transition";

  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { dndzone, dragHandle } from "svelte-dnd-action";

  import DocumentsIcon from "./assets/documentsicon.svelte";
  import UserIcon from "./assets/usericon.svelte";
  import Dragicon from "./assets/dragicon.svelte";

  import type { SvelteComponent } from "svelte";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import {
    routeIdContent,
  } from "$lib/constants/paths.js";
  import Sheets from "./assets/sheets.svelte";
  import Search from "./assets/search.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import SearchModal from "$lib/components/section/search/Search.svelte";

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

  /**
   * @description
   *  📣 Component `Interface`.
   */
  interface INavBtnData {
    id: string;
    url?: string | undefined;
    icon: typeof SvelteComponent;
    type: "link" | "button";
    label?: string;
    dragable?: boolean;
    route?: string;
  }

  export let mobile, tablet;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = "global/w/mobile-menu";

  let showPopup = false;

  $: ({ serverLang } = $sessionStore);
  $: ({ profile_photo, buttons_order, lang } = {
    ...$userBetarenaSettings.user?.scores_user_data,
  });
  $: ({ user } = $userBetarenaSettings);
  $: isAuth = !!user;
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: navButtonOrderList = [
    // {
    //   id: "scores",
    //   icon: StatisticIcon,
    //   type: "link",
    //   url: `${serverLang != "en" ? `/${serverLang}` : ""}/scores`,
    //   label:
    //     trsanslationData?.scores_header_translations?.section_links
    //       ?.scores_title ?? "SCORES",
    //   route: routeIdScores,
    // },
    {
      id: "content",
      icon: DocumentsIcon,
      type: "link",
      url: "/",
      label:
        trsanslationData?.scores_header_translations?.section_links
          ?.sports_content_title ?? "SPORTS CONTENT",
      route: routeIdContent,
    },
    // {
    //   id: "competitions",
    //   icon: CupIcon,
    //   url: generateUrlCompetitions(
    //     $sessionStore.serverLang!,
    //     $page.data.B_SAP_D3_CP_H
    //   ),
    //   type: "link",
    //   label:
    //     trsanslationData?.scores_header_translations?.section_links
    //       ?.competitions_title ?? "COMPETITIONS",
    //   route: routeIdPageCompetitionLobby,
    // },
    {
      id: "search",
      icon: Search,
      type: "link",
      url: `/search`,
      label: "Search",
      route: null,
    },
    {
      id: "bta",
      icon: Sheets,
      url: `/u/author/${lang}`,
      type: "link",
      label: "BTA",
      route: null,
    },
  ] as INavBtnData[];

  $: if (buttons_order && !dragStart) {
    const orderMap = new Map(buttons_order.map((id, index) => [id, index]));
    navButtonOrderList = [...navButtonOrderList].sort((a, b) => {
        const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
        const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
        return (indexA as number) - (indexB as number);
    });
  }

  // // #endregion ➤ 📌 VARIABLES

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

  function buttonClick(id: string, e?: MouseEvent) {
    switch (id) {
      case "bta":
      case "profile":
        if (!isAuth) {
          $sessionStore.currentActiveModal = "Auth_Modal";
          e?.preventDefault();
        }
        break;
      case "more":
        showPopup = !showPopup;
        break;
      default:
        break;
    }
  }

  function transformDraggedElement(draggedElement: HTMLElement) {
    draggedElement.style.background = "var(--mobile-menu-bg-popup)";
    draggedElement.style.backdropFilter = "blur(10px)";
    draggedElement.style.setProperty("--icon-color", "var(--text-color)");
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
{#if showPopup}
  <div
    class="popup-modal"
    in:fade
    out:fade
    on:click|preventDefault={() => (showPopup = false)}
  />
{/if}
<div id={CNAME} class="mobile-menu" class:mobile class:tablet>
  <div class="blured-container" />
  {#each [...navButtonOrderList] as { id, url, icon, type, route } (id)}
    {#if type === "link" && url}
      {@const active = $page.route.id === route || $page.url.pathname.includes(url)}
      <a href={url} class="item" on:click={(e) => buttonClick(id, e)} class:active aria-label="link to {id}">
        <svelte:component this={icon} type={active ? "solid" : "outline"} />
      </a>
    {:else}
      <div class="item" on:click={() => buttonClick(id)}>
        <svelte:component this={icon}  />
      </div>
    {/if}
  {/each}
  <div class="item" on:click={() => buttonClick("profile")}>
    {#if !isAuth}
      <UserIcon />
    {:else}
      <a href="/u/dashboard/{$userBetarenaSettings.lang}">
        {#if profile_photo}
          <Avatar src={profile_photo} size={25} />
        {:else}
          <UserIcon />
        {/if}
      </a>
    {/if}
  </div>
  <!-- <div
    class="item"
    style="margin-top: 1px;"
    class:rotate={showPopup}
    class:active={showPopup}
    on:click={(e) => buttonClick("more")}
  >
    <MenuSquareDotsIcon type={showPopup ? "solid" : "outline"} />
  </div> -->

  {#if showPopup}
    <div class="popup" in:scale out:scale>
      <div class="blured-container" />
      <div
        class="popup-list"
        use:dndzone={{
          items: navButtonOrderList,
          flipDurationMs: 300,
          dropTargetClasses: ["drag-item"],
          morphDisabled: true,
          transformDraggedElement,
        }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
      >
        {#each navButtonOrderList as { icon, label, id, url } (id)}
          <div
            class="list-item"
            style="gap: 10px; outline:none"
            animate:flip={{ duration: 300 }}
          >
            <a href={url} class="mobile-dnd-list-item" style="
              gap: 10px;
            flex-grow: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: start;

            ">
              <div style="width: 24px;">
                <svelte:component this={icon} />
              </div>
              <span class="label" style="flex-grow: 1;">{label}</span>
            </a>
            <div
              use:dragHandle
              aria-label="drag-handle for {label}"
              class="drag-icon"
              style="width: 24px;"
            >
              <Dragicon />
            </div>
          </div>
        {/each}
      </div>
    </div>
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
  .popup-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4000;
  }
  .mobile-menu {
    display: flex;
    position: fixed;
    bottom: 40px;
    height: 56px;
    width: auto;
    max-width: 95%;
    color: var(--text-color);
    box-shadow: var(--box-shadow);
    left: 50%;
    transform: translateX(-50%);
    border-radius: 56px;
    z-index: 4000;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    padding: 16px 30px;
    background-color: var(--mobile-menu-bg-color);

    &.mobile {
      bottom: 24px;
    }

    .blured-container {
      border-radius: 56px;
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
    }

    :global(svg) {
      width: 24px !important;
      transition: all 0.5s ease-in-out;
    }

    .item {
      flex-shrink: 0;
      display: flex;

      &.active {
        --icon-color: var(--text-color);
        --icon-contrast-color: var(--bg-color-second);
      }

      &.rotate {
        :global(svg) {
          transform: rotate(180deg);
        }
      }
    }

    .popup {
      width: 300px;
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translate(-50%, -100%);
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      --icon-color: var(--text-color);
      background-color: var(--mobile-menu-bg-popup);

      .blured-container {
        border-radius: 8px;
      }

      .popup-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        outline: none !important;

        :global(svg) {
          width: 24px !important;
        }
        .list-item {
          display: flex;
          align-items: center;
          justify-content: start;
          width: 100%;
          z-index: 1000;
          padding: 8px 12px;
          gap: 10px;

          .mobile-dnd-list-item {
            gap: 10px;
            flex-grow: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: start;
          }
          .drag-item {
            width: 24px;
          }
          svg {
            width: 24px !important;
          }
          :global(svg) {
            width: 24px !important;
          }
          .label {
            flex-grow: 1;
          }
        }
      }
    }
  }
</style>
