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

  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { SvelteComponent, onMount } from "svelte";
  import { fly } from "svelte/transition";

  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { NB_W_TAG, dlog, dlogv2 } from "$lib/utils/debug";
  import { toDecimalFix } from "$lib/utils/string.js";
  import { viewportChangeV2 } from "$lib/utils/device";
  import { translationObject } from "$lib/utils/translation.js";
  import { logoutUser } from "$lib/utils/user";
  import { scoresNavbarStore } from "./_store.js";
  import {
    generateUrlCompetitions,
    spliceBalanceDoubleZero,
  } from "$lib/utils/string";

  import SeoBox from "$lib/components/SEO-Box.svelte";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import { routeIdPageTags } from "$lib/constants/paths.js";
  // import HeaderCBookmakers from "./Header-C-Bookmakers.svelte";
  // import HeaderCLang from "./Header-C-Lang.svelte";
  // import HeaderCTheme from "./Header-C-Theme.svelte";
  // import HeaderCompetitionBtn from "./Header-Competition-Btn.svelte";
  // import HeaderNavBtn from "./Header-Nav-Btn.svelte";
  // import HeaderSportsBtn from "./Header-Sports-Btn.svelte";

  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import type { B_SAP_D3 } from "@betarena/scores-lib/types/seo-pages.js";
  import StatisticIcon from "./assets/statisticicon.svelte";
  import DocumentsIcon from "./assets/documentsicon.svelte";
  import CupIcon from "./assets/cupicon.svelte";
  import UserIcon from "./assets/usericon.svelte";
  import MenuSquareDotsIcon from "./assets/menusquaredotsicon.svelte";
  import Dragicon from "./assets/dragicon.svelte";
    import { doc } from "firebase/firestore";

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
   *  📣 Component `Type`.
   */
  type IDynamicAssetMap =
    | "arrow_down_fade"
    | "arrow_down"
    | "arrow_up_fade"
    | "arrow_up"
    | "logo_full"
    | "logo_mini"
    | "close"
    | "menu_burger_bar"
    | "profile_avatar"
    | "logoAuthor"
    | "logoAuthorDark"
    | "iconArrowDownDark"
    | "iconArrowLeftDark"
    | "iconArrowLeftLight";

  /**
   * @description
   *  📣 Component `Interface`.
   */
  interface INavBtnData {
    key: "scores" | "content" | "competitions";
    url?: string | undefined;
    icon: typeof SvelteComponent;
    type: "link" | "button";
    label?: string;
    dragable?: boolean;
  }

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = "global/w/mobile-menu";
    let showPopup = true;
  // let
  //   /**
  //    * @description
  //    *  📣 Holds target `component(s)` of dynamic nature.
  //    */
  //   dynamicAssetMap = new Map < IDynamicAssetMap, any >(),
  //   /**
  //    * @description
  //    *  📣 Target `animation` width tracking variable.
  //    */
  //   width = 0,
  //   /**
  //    * @description
  //    *  📣 Currently `selected sport`.
  //    */
  //   selectedSport = 'football'
  // ;

  // $: ({ error, route: { id: pageRouteId } } = $page);
  // $: console.log('pageRouteId', pageRouteId);
  // $: ({ windowWidth, currentPageRouteId, serverLang, navBtnHover, globalState } = $sessionStore);
  // $: ({ lang, theme, user } = $userBetarenaSettings);
  // $: ({ web3_wallet_addr, profile_photo, main_balance, lang: userLang } = { ...$userBetarenaSettings.user?.scores_user_data });
  // $: ({ globalState: globalStateNavbar } = $scoresNavbarStore);

  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  // $: B_SAP_D3_CP_H = $page.data.B_SAP_D3_CP_H as B_SAP_D3 | null | undefined;

  // $: homepageURL
  //   = serverLang != 'en'
  //     ? `/${serverLang}`
  //     : '/'
  // ;
  // $: logoLink
  //   = serverLang != 'en'
  //     ? `${$page.url.origin}/${serverLang}`
  //     : $page.url.origin
  // ;
  // /**
  //  * @description
  //  *  📣 Target navigation `button` data list.
  //  */
  $: console.log("Translation Data", trsanslationData);
  $: navButtonOrderList = [
    {
      key: "scores",
      icon: StatisticIcon,
      type: "link",
      url: trsanslationData?.scores_header_translations?.section_links
        ?.scores_url,
      label:
        trsanslationData?.scores_header_translations?.section_links
          ?.scores_title ?? "SCORES",
      dragable: true,
    },
    {
      key: "content",
      icon: DocumentsIcon,
      type: "link",
      url: trsanslationData?.scores_header_translations?.section_links
        ?.sports_content_url,
      label:
        trsanslationData?.scores_header_translations?.section_links
          ?.sports_content_title ?? "SPORTS CONTENT",
      dragable: true,
    },
    {
      key: "competitions",
      icon: CupIcon,
      url: generateUrlCompetitions(
        $sessionStore.serverLang!,
        $page.data.B_SAP_D3_CP_H
      ),
      type: "link",
      label:
        trsanslationData?.scores_header_translations?.section_links
          ?.competitions_title ?? "COMPETITIONS",
      dragable: true,
    },
    {
      key: "user",
      icon: UserIcon,
      type: "button",
    },
    {
      key: "more",
      icon: MenuSquareDotsIcon,
      type: "button",
    },
  ] as INavBtnData[];
  $: dargList = navButtonOrderList.filter((item) => item.dragable);

  // // #endregion ➤ 📌 VARIABLES

  // // #region ➤ 🛠️ METHODS

  // // ╭────────────────────────────────────────────────────────────────────────╮
  // // │ NOTE:                                                                  │
  // // │ Please add inside 'this' region the 'methods' that are to be           │
  // // │ and are expected to be used by 'this' .svelte file / component.        │
  // // │ IMPORTANT                                                              │
  // // │ Please, structure the imports as follows:                              │
  // // │ 1. function (..)                                                       │
  // // │ 2. async function (..)                                                 │
  // // ╰────────────────────────────────────────────────────────────────────────╯

  // /**
  //  * @author
  //  *  @migbash
  //  * @summary
  //  *  [🐞]
  //  * @description
  //  *  📣 Debug Helper
  //  * @param { string } reactDebug
  //  *  💠 Target log to display.
  //  * @return { void }
  //  */
  // function _DEBUG_
  // (
  //   reactDebug: 'Option0' | 'Option1' | 'Option2' | 'Option3' | 'Option4' | 'Option5'
  // ): void
  // {
  //   const
  //     prefix: string = `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]}`
  //   ;

  //   // [🐞]
  //   if (reactDebug == 'Option0')
  //     dlogv2
  //     (
  //       `${prefix} if_R_X`,
  //       [
  //         '📝 INFO: Authentication logic processing...',
  //         '❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.'
  //       ],
  //       true
  //     );
  //   else if (reactDebug == 'Option1')
  //     dlogv2
  //     (
  //       `${prefix} if_R_0`,
  //       [
  //         '📝 INFO: Non-authenticated user detected! Processing logic...',
  //         '❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.'
  //       ],
  //       true
  //     );
  //   else if (reactDebug == 'Option2')
  //     dlogv2
  //     (
  //       `${prefix} if_R_1`,
  //       [
  //         '📝 INFO: Authenticated user detected! Processing logic...',
  //         '❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.'
  //       ],
  //       true
  //     );
  //   else if (reactDebug == 'Option3')
  //     dlog
  //     (
  //       `${prefix} if_R_2`,
  //       true
  //     );
  //   else if (reactDebug == 'Option4')
  //     dlog
  //     (
  //       `${prefix} if_R_3`,
  //       true
  //     );
  //   else
  //     dlog
  //     (
  //       `${prefix} if_R_5 ${lang}`,
  //       true
  //     );

  //   return;
  // }

  // /**
  //  * @author
  //  *  @migbash
  //  * @summary
  //  *  🟦 HELPER
  //  * @description
  //  *  📣 Calcualte navigation triangle position.
  //  * @param { string } [mainActive]
  //  *  💠 [optional] Currently **active/selected** navigation.
  //  * @return { void }
  //  */
  // function calcNavTrianglePos
  // (
  //   mainActive?: string
  // ): void
  // {
  //   const
  //     parentElem = document.getElementById('navBox'),
  //     childElem = document.getElementById($sessionStore.navBtnHover || mainActive)
  //   ;

  //   if (parentElem == undefined || childElem == undefined) return;

  //   const
  //     parentPos: DOMRect = parentElem.getBoundingClientRect(),
  //     childPos: DOMRect = childElem.getBoundingClientRect(),
  //     relativePos = {
  //       top: (childPos.top - parentPos.top),
  //       right: (childPos.right - parentPos.right),
  //       bottom: (childPos.bottom - parentPos.bottom),
  //       left: (childPos.left - parentPos.left)
  //     }
  //   ;

  //   width = relativePos.left + (childPos.width/2) - 32 + 6;

  //   return;
  // }


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
  <div class="popup-modal"/>
{/if}
<div id={CNAME} class="mobile-menu">
  <div class="blured-container" />
  {#each navButtonOrderList as { key, url, icon, type } (key)}
    {#if type === "link" && url}
      <a href={url} class="item">
        <svelte:component this={icon} />
      </a>
    {:else}
      <div class="item">
        <svelte:component this={icon} />
      </div>
    {/if}
  {/each}

  {#if showPopup}
     <!-- content here -->

  <div class="popup">
    <div class="blured-container"></div>
    {#each dargList as item (item.key)}
      <div class="list-item" id={`mobile-menu-drag-${item.key}`}>
        <svelte:component this={item.icon} />
        <span class="label">{item.label}</span>
        <div class="drag-icon">
          <Dragicon />
        </div>
      </div>
    {/each}
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
    z-index: 1000;
  }
  .mobile-menu {
    display: flex;
    position: fixed;
    bottom: 24px;
    height: 56px;
    width: 340px;
    max-width: 95%;
    color: var(--text-color);
    box-shadow: var(--box-shadow);
    left: 50%;
    transform: translateX(-50%);
    border-radius: 56px;
    z-index: 1000;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    padding: 16px 30px;
    // background-color: var(--mobile-menu-bg-color);
    // backdrop-filter: blur(10px);

    .blured-container {
      border-radius: 56px;
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--mobile-menu-bg-color);
      backdrop-filter: blur(10px);
    }

    svg {
      width: 24px !important;
    }

    .item {
      flex-shrink: 0;
    }

    .popup {
      width: 300px;
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translate(-50%, -100%);
      display: flex;
      flex-direction: column;
      padding: 12px;
      gap: 16px;
      border-radius: 8px;
      // background-color: var(--mobile-menu-bg-popup);

      .blured-container {
        border-radius: 8px;
      }

      :global(svg) {
        width: 24px !important;
      }
      .list-item {
        display: flex;
        align-items: center;
        justify-content: start;
        width: 100%;
        z-index: 1000;
        gap: 10px;
        .label {
          flex-grow: 1;
        }
      }
    }
  }
</style>
