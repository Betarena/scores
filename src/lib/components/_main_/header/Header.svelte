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
│ Scores Platform Header                                                           │
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
  import { onMount } from "svelte";
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
  import { routeIdContent, routeIdPageTags } from "$lib/constants/paths.js";
  import HeaderCBookmakers from "./Header-C-Bookmakers.svelte";
  import HeaderCLang from "./Header-C-Lang.svelte";
  import HeaderCTheme from "./Header-C-Theme.svelte";
  import HeaderCompetitionBtn from "./Header-Competition-Btn.svelte";
  import HeaderNavBtn from "./Header-Nav-Btn.svelte";
  import HeaderSportsBtn from "./Header-Sports-Btn.svelte";

  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import type { B_SAP_D3 } from "@betarena/scores-lib/types/seo-pages.js";
  import BuyBtaButton from "$lib/components/shared/BuyBta/Buy-BTA-Button.svelte";

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
    url: string | undefined;
    navTxt: string;
    isNew: boolean;
    newTxt: string;
  }

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = "global/w/navbar/main",
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true],
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport: boolean = true;
  let /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map<IDynamicAssetMap, any>(),
    /**
     * @description
     *  📣 Target `animation` width tracking variable.
     */
    width = 0,
    /**
     * @description
     *  📣 Currently `selected sport`.
     */
    selectedSport = "football";
  $: ({
    error,
    route: { id: pageRouteId },
  } = $page);
  $: ({
    windowWidth,
    currentPageRouteId,
    serverLang,
    navBtnHover,
    globalState,
  } = $sessionStore);
  $: ({ lang, theme, user } = $userBetarenaSettings);
  $: ({
    web3_wallet_addr,
    profile_photo,
    main_balance,
    lang: userLang,
  } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: ({ globalState: globalStateNavbar } = $scoresNavbarStore);

  $: [VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1]] = viewportChangeV2(
    windowWidth,
    VIEWPORT_MOBILE_INIT[0],
    VIEWPORT_TABLET_INIT[0]
  );
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: B_SAP_D3_CP_H = $page.data.B_SAP_D3_CP_H as B_SAP_D3 | null | undefined;

  $: homepageURL = serverLang != "en" ? `/${serverLang}` : "/";
  $: logoLink =
    serverLang != "en" ? `${$page.url.origin}/${serverLang}` : $page.url.origin;
  /**
   * @description
   *  📣 Target navigation `button` data list.
   */
  $: navButtonOrderList = [
    // {
    //   key: "scores",
    //   url: `${serverLang != "en" ? `/${serverLang}` : ""}/scores`,
    //   navTxt:
    //     trsanslationData?.scores_header_translations?.section_links
    //       ?.scores_title ?? "SCORES",
    //   isNew: false,
    //   newTxt: "New",
    // },
    {
      key: "content",
      url: trsanslationData?.scores_header_translations?.section_links
        ?.sports_content_url,
      navTxt:
        trsanslationData?.scores_header_translations?.section_links
          ?.sports_content_title ?? "SPORTS CONTENT",
      isNew: false,
      newTxt: "New",
    },
    {
      key: "competitions",
      url: generateUrlCompetitions(
        $sessionStore.serverLang!,
        $page.data.B_SAP_D3_CP_H
      ),
      navTxt:
        trsanslationData?.scores_header_translations?.section_links
          ?.competitions_title ?? "COMPETITIONS",
      isNew: true,
      newTxt: "New",
    },
  ] as INavBtnData[];

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

  /**
   * @author
   *  @izobov
   * @summary
   *  [🐞]
   * @description
   *  📣 Back ButtonClick
   * @return { void }
   */

  function backBtnClick(): void {
    if (globalState.has("IsPWA")) return window.history.back();
    const [preferedPage] = $userBetarenaSettings.user?.scores_user_data
      ?.buttons_order || ["scores"];
    let url: string;
    switch (preferedPage) {
      case "competitions":
        url = generateUrlCompetitions(
          $sessionStore.serverLang,
          $page.data.B_SAP_D3_CP_H
        );
        break;
      case "content":
        url =
          trsanslationData?.scores_header_translations?.section_links
            ?.sports_content_url;
        break;
      case "scores":
      default:
        url = homepageURL;
        break;
    }

    goto(url);
    return;
  }
  /**
   * @author
   *  @migbash
   * @summary
   *  [🐞]
   * @description
   *  📣 Debug Helper
   * @param { string } reactDebug
   *  💠 Target log to display.
   * @return { void }
   */
  function _DEBUG_(
    reactDebug:
      | "Option0"
      | "Option1"
      | "Option2"
      | "Option3"
      | "Option4"
      | "Option5"
  ): void {
    const prefix: string = `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]}`;
    // [🐞]
    if (reactDebug == "Option0")
      dlogv2(
        `${prefix} if_R_X`,
        [
          "📝 INFO: Authentication logic processing...",
          "❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.",
        ],
        true
      );
    else if (reactDebug == "Option1")
      dlogv2(
        `${prefix} if_R_0`,
        [
          "📝 INFO: Non-authenticated user detected! Processing logic...",
          "❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.",
        ],
        true
      );
    else if (reactDebug == "Option2")
      dlogv2(
        `${prefix} if_R_1`,
        [
          "📝 INFO: Authenticated user detected! Processing logic...",
          "❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.",
        ],
        true
      );
    else if (reactDebug == "Option3") dlog(`${prefix} if_R_2`, true);
    else if (reactDebug == "Option4") dlog(`${prefix} if_R_3`, true);
    else dlog(`${prefix} if_R_5 ${lang}`, true);

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Calcualte navigation triangle position.
   * @param { string } [mainActive]
   *  💠 [optional] Currently **active/selected** navigation.
   * @return { void }
   */
  function calcNavTrianglePos(mainActive?: string): void {
    const parentElem = document.getElementById("navBox"),
      childElem = document.getElementById(
        $sessionStore.navBtnHover || mainActive
      );
    if (parentElem == undefined || childElem == undefined) return;

    const parentPos: DOMRect = parentElem.getBoundingClientRect(),
      childPos: DOMRect = childElem.getBoundingClientRect(),
      relativePos = {
        top: childPos.top - parentPos.top,
        right: childPos.right - parentPos.right,
        bottom: childPos.bottom - parentPos.bottom,
        left: childPos.left - parentPos.left,
      };
    width = relativePos.left + childPos.width / 2 - 32 + 6;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

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

  // ╭─────
  // │ > 🔥 Navbar Z-Index Override
  // │ NOTE:
  // │ > [x0] Kicker(s)
  // ╰─────
  $: if_R_4 =
    ($sessionStore.livescoreShowCalendar && VIEWPORT_MOBILE_INIT[1]) ||
    $sessionStore.showUserguide1 ||
    $sessionStore.currentActiveModal;
  $: if (if_R_4) $scoresNavbarStore.globalState.add("UpdateZIndex");
  else if (globalStateNavbar.has("UpdateZIndex"))
    setTimeout(() => {
      $scoresNavbarStore.globalState.delete("UpdateZIndex");
    }, 750);
  // ╭─────
  // │ > 🔥 Trigger Navigation Triangle Position Re-Calculation.
  // │ IMPORTANT
  // │ > [x3] Kicker(s)
  // ╰─────
  $: if (browser && navBtnHover != undefined && serverLang) {
    _DEBUG_("Option5");
    calcNavTrianglePos();
  } else if (browser && navBtnHover == undefined && serverLang) {
    _DEBUG_("Option5");
    setTimeout(() => {
      if (currentPageRouteId == "CompetitionPage")
        calcNavTrianglePos("competitions");
      else calcNavTrianglePos("scores");
    }, 250);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(async (): Promise<void> => {
    if (useDynamicImport) {
      dynamicAssetMap.set(
        "arrow_down_fade",
        (await import("./assets/arrow-down-fade.svg")).default
      );
      dynamicAssetMap.set(
        "arrow_down",
        (await import("./assets/arrow-down.svg")).default
      );
      dynamicAssetMap.set(
        "arrow_up_fade",
        (await import("./assets/arrow-up-fade.svg")).default
      );
      dynamicAssetMap.set(
        "arrow_up",
        (await import("./assets/arrow-up.svg")).default
      );
      dynamicAssetMap.set(
        "logo_full",
        (await import("./assets/betarena-logo-full.svg")).default
      );
      dynamicAssetMap.set(
        "logo_mini",
        (await import("./assets/betarena-logo-mobile.svg")).default
      );
      dynamicAssetMap.set(
        "logoAuthor",
        (await import("./assets/asset-betarena-logo-full.svg")).default
      );
      dynamicAssetMap.set(
        "logoAuthorDark",
        (await import("./assets/asset-betarena-logo-full-dark.svg")).default
      );
      dynamicAssetMap.set(
        "iconArrowLeftDark",
        (await import("./assets/icon-arrow-left-dark.svg")).default
      );
      dynamicAssetMap.set(
        "iconArrowLeftLight",
        (await import("./assets/icon-arrow-left-light.svg")).default
      );
      dynamicAssetMap.set(
        "close",
        (await import("./assets/close.svg")).default
      );
      dynamicAssetMap.set(
        "menu_burger_bar",
        (await import("./assets/menu-burger.svg")).default
      );
      dynamicAssetMap.set(
        "profile_avatar",
        (await import("./assets/profile-avatar.svg")).default
      );

      dynamicAssetMap = dynamicAssetMap;
    }

    return;
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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

<!--
╭─────
│ > Navbar Close Dropdown Area
╰─────
-->
{#if globalStateNavbar.has("BackdropActive")}
  <div
    id="background-area-close"
    on:click={() => {
      scoresNavbarStore.closeAllDropdowns();
      return;
    }}
  />
{/if}

<SeoBox>
  <!--
  ╭─────
  │ > homepage links
  ╰─────
  -->
  {#each trsanslationData?.langArray || [] as item}
    {#if item != "en"}
      <a href={$page.url.origin + "/" + item}>
        {$page.url.origin + "/" + item}
      </a>
    {:else}
      <a href={$page.url.origin}>
        {$page.url.origin}
      </a>
    {/if}
  {/each}

  <!--
  ╭─────
  │ > other urls
  ╰─────
  -->
  <a
    href={trsanslationData?.scores_header_translations?.section_links
      ?.scores_url}
  >
    {trsanslationData?.scores_header_translations?.section_links?.scores_title}
  </a>
  <a
    href={trsanslationData?.scores_header_translations?.section_links
      ?.competitions_url}
  >
    {trsanslationData?.scores_header_translations?.section_links
      ?.competitions_title}
  </a>
  <a
    href={trsanslationData?.scores_header_translations?.section_links
      ?.sports_content_url}
  >
    {trsanslationData?.scores_header_translations?.section_links
      ?.sports_content_title}
  </a>
</SeoBox>

<!--
╭─────
│ > Navbar Component
╰─────
-->
<header
  data-testid="header"
  class="
  column-space-center
  "
  class:update-z-index={globalStateNavbar.has("UpdateZIndex")}
  class:user-active={currentPageRouteId == "ProfilePage"}
  class:page-authors={currentPageRouteId == "AuthorsPage"}
  class:dark-mode={theme == "Dark"}
>
  <!--
  ╭─────
  │ > Close Dropdown Area
  ╰─────
  -->
  {#if globalStateNavbar.has("BackdropActive")}
    <div
      id="background-area-close"
      on:click={() => {
        scoresNavbarStore.closeAllDropdowns();
        return;
      }}
    />
  {/if}

  <!--
  ╭─────
  │ > Top Navbar
  ╰─────
  -->
  <div
    id="header/top"
    data-testid="header-top"
    class="
    row-space-out
    "
  >
    <!--
    ╭─────
    │ > 1st Column
    ╰─────
    -->
    <div
      data-testid="header-top-1st-col"
      class="row-space-start"
      style="width: fit-content;"
    >
      <!--
      ╭─────
      │ > Menu Burger :|: 📱 MOBILE 💻 TABLET
      ╰─────
      -->
      {#if VIEWPORT_TABLET_INIT[1] && currentPageRouteId != "AuthorsPage"}
        <img
          id="burger-menu"
          data-testid="header-burger-menu"
          loading="lazy"
          src={dynamicAssetMap.get("menu_burger_bar")}
          alt="menu_burger_bar"
          title="Open Side Navigation"
          width="24"
          height="24"
          on:click={() => {
            scoresNavbarStore.updateData(
              "globalStateAdd",
              "MobileNavToggleMenuActive"
            );
            return;
          }}
        />
      {/if}

      <!--
      ╭─────
      │ > Brand Logo :|: 📱 MOBILE 💻 TABLET 🖥️ LAPTOP
      ╰─────
      -->
      {#if VIEWPORT_MOBILE_INIT[1] && currentPageRouteId == "AuthorsPage"}
        <div id="authorsBackBtn" on:click={backBtnClick}>
          <img
            id=""
            src={theme == "Dark"
              ? dynamicAssetMap.get("iconArrowLeftDark")
              : dynamicAssetMap.get("iconArrowLeftLight")}
            alt="authorsBackBtn"
            title="authorsBackBtn"
            loading="lazy"
          />
        </div>
      {:else}
        <div
          id="brand"
          data-testid="header-brand-img"
          aria-label="brand-img"
          class="
          cursor-pointer
          "
          on:click={() => {
            if ($page.url.pathname == "/") window.location.reload();
            return;
          }}
        >
          <a href={homepageURL} title={logoLink}>
            <img
              loading="lazy"
              src={currentPageRouteId != "AuthorsPage"
                ? VIEWPORT_MOBILE_INIT[1]
                  ? dynamicAssetMap.get("logo_mini")
                  : dynamicAssetMap.get("logo_full")
                : theme == "Dark"
                ? dynamicAssetMap.get("logoAuthorDark")
                : dynamicAssetMap.get("logoAuthor")}
              alt="betarena_logo"
              width={VIEWPORT_MOBILE_INIT[1] ? 103 : 142}
              height="30"
              class:m-r-40={!VIEWPORT_MOBILE_INIT[1]}
            />
          </a>
        </div>
      {/if}

      <!--
      ╭─────
      │ > External Button / Navigation :|: 📱 MOBILE 💻 TABLET
      ╰─────
      -->
      {#if !VIEWPORT_TABLET_INIT[1] && currentPageRouteId != "AuthorsPage"}
        <div
          id="navBox"
          class="
          row-space-start
          "
        >
          <!--
          ╭─────
          │ > Target Platform Navigation(s)
          ╰─────
          -->
          {#each navButtonOrderList as item}
            <HeaderNavBtn
              navKey={item.key}
              navUrl={item.url}
              navTxt={item.navTxt}
              isNew={item.isNew}
              newTxt={item.newTxt}
              {VIEWPORT_TABLET_INIT}
              {VIEWPORT_MOBILE_INIT}
            />
          {/each}

          <!--
          ╭─────
          │ > Navigation Triangle
          ╰─────
          -->
          {#if currentPageRouteId != "ProfilePage"}
            <div
              id="nav-triangle"
              style="
              left: {width}px;
              "
            />
          {/if}
        </div>
      {/if}
    </div>

    <!--
    ╭─────
    │ > 2nd Column
    ╰─────
    -->
    <div
      data-testid="header-top-2nd-col"
      class="
      row-space-start
      "
      style="
      width: fit-content;
      "
    >
      <!--
      ╭─────
      │ > 🖥️ LAPTOP
      ╰─────
      -->
      {#if !VIEWPORT_TABLET_INIT[1]}
        <!--
        ╭─────
        │ > Currency Selection
        ╰─────
        -->
        {#if currentPageRouteId != "AuthorsPage"}
          <div
            id="currency-box"
            class="
            m-r-16
            "
          >
            <!--
            ╭─────
            │ > Selected Currency
            ╰─────
            -->
            <div
              class="
              selected-language-btn
              row-space-start
              "
            >
              <!--
              ╭─────
              │ > Currency Icon
              ╰─────
              -->
              <img
                loading="lazy"
                src="/assets/svg/currency/usd.svg"
                alt="usd-icon"
                width="16"
                height="16"
                class="
                m-r-6
                "
              />
              <!--
              ╭─────
              │ > Currency Text
              ╰─────
              -->
              <p
                class="
                color-white
                s-14
                "
              >
                USD
              </p>
              <!--
              ╭─────
              │ > Arrow Down [HIDDEN]
              ╰─────
              -->
              {#if false}
                <img
                  loading="lazy"
                  src={!widgetState.has("CurrencyDropdownActive")
                    ? dynamicAssetMap.get("arrow_down")
                    : dynamicAssetMap.get("arrow_up")}
                  alt={!widgetState.has("CurrencyDropdownActive")
                    ? "arrow_down"
                    : "arrow_up"}
                  width="16"
                  height="16"
                />
              {/if}
            </div>
          </div>
        {/if}

        <!--
        ╭─────
        │ > [child.component] Language Selection
        ╰─────
        -->
        <HeaderCLang />
      {/if}

      <!--
      ╭─────
      │ > [child.component] Theme Selection
      ╰─────
      -->
      {#if !VIEWPORT_MOBILE_INIT[1]}
        <HeaderCTheme />
      {/if}

      <!--
      ╭─────
      │ > Sign-In (button)
      ╰─────
      -->
      {#if globalState.has("NotAuthenticated")}
        <button
          id="{CNAME}/sign-in-btn"
          data-testid="{CNAME}/sign-in-btn"
          class="
          btn-hollow
            v6
          cursor-pointer
          "
          class:v5d={currentPageRouteId == "AuthorsPage"}
          on:click={() => {
            $sessionStore.currentActiveModal = "Auth_Modal";
            return;
          }}
        >
          <p
            class="
            color-white
            s-14
            "
          >
            <TranslationText
              key={"header-txt-unkown"}
              text={trsanslationData?.scores_header_translations?.sign_in}
              fallback={translationObject.sign_in}
            />
          </p>
        </button>
      {:else}
        <div
          id="user-profile-box"
          class="
          row-space-start
          "
        >
          <!--
          ╭─────
          │ > User Wallet
          ╰─────
          -->
          {#if web3_wallet_addr != undefined}
            <p
              id="wallet-text"
              class="
              {currentPageRouteId == 'AuthorsPage'
                ? theme == 'Dark'
                  ? 'color-white'
                  : 'color-black-2'
                : 'color-white'}
              w-500
              "
            >
              {web3_wallet_addr.slice(0, 5)}
              ...
              {web3_wallet_addr.slice(-5)}
            </p>
          {/if}

          <!--
          ╭─────
          │ > User Avatar
          ╰─────
          -->
          {#if !VIEWPORT_MOBILE_INIT[1] || ![routeIdPageTags, routeIdContent].includes(pageRouteId || "")}
            <img
              id="user-profile-picture"
              data-testid="{CNAME}/user-avatar"
              loading="lazy"
              src={profile_photo ?? dynamicAssetMap.get("profile_avatar")}
              alt="profile_avatar"
              title="Profile Picture"
              on:click={() => {
                scoresNavbarStore.updateData(
                  "globalStateAdd",
                  "UserDropdownActive"
                );
                return;
              }}
              class="
            cursor-pointer
            "
              width="44"
              height="44"
            />
          {/if}

          <!--
          ╭─────
          │ > Profile Dropdown
          ╰─────
          -->
          {#if globalStateNavbar.has("UserDropdownActive")}
            <div id="user-profile-dropdown">
              <!--
              ╭─────
              │ > Profile Navigation Button
              ╰─────
              -->
              <a href="/u/dashboard/{$userBetarenaSettings.lang}">
                <div
                  class="
                  theme-opt-box
                  cursor-pointer
                  "
                  style="width: 100%;"
                  on:click={() => {
                    scoresNavbarStore.closeAllDropdowns();
                    return;
                  }}
                >
                  <p
                    class="
                    color-white
                    s-14
                    "
                  >
                    <TranslationText
                      key={"header-txt-unkown"}
                      text={trsanslationData?.scores_header_translations?.data
                        ?.profile}
                      fallback={"Profile"}
                    />
                  </p>
                </div>
              </a>

              <!--
              ╭─────
              │ > Profile Logout
              ╰─────
              -->
              <div
                class="
                theme-opt-box
                cursor-pointer
                "
                on:click={() => {
                  logoutUser();
                  return;
                }}
              >
                <p
                  class="
                  color-white
                  s-14
                  "
                >
                  <TranslationText
                    key={"header-txt-unkown"}
                    text={trsanslationData?.scores_header_translations?.data
                      ?.logout}
                    fallback={"Logout"}
                  />
                </p>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!--
  ╭─────
  │ > Divider
  ╰─────
  -->
  {#if currentPageRouteId != "AuthorsPage"}
    <div id="header/border/top-box" />
    <div id="header/border/bottom-box" />
  {/if}

  <!--
  ╭─────
  │ > Bottom Navbar
  ╰─────
  -->
  {#if currentPageRouteId != "AuthorsPage"}
    <div
      id="header/bottom"
      class="
      row-space-out
      "
    >
      <!--
      ╭─────
      │ > 1st Column
      ╰─────
      -->
      <div
        class="
        row-space-out
        "
      >
        {#if currentPageRouteId == "Standard"}
          <!--
          ╭─────
          │ > Sports Horizontal List (scores only)
          │ > Competition Horizontal List (competition only)
          ╰─────
          -->
          <div
            id="header/bottom/inner"
            class="
            row-space-out
            m-r-10
            "
            style="width: fit-content;"
          >
            <div
              class="
              row-space-out
              "
              style="width: fit-content;"
            >
              <!--
              ╭─────
              │ > Football
              ╰─────
              -->
              {#if currentPageRouteId != "CompetitionPage"}
                <HeaderSportsBtn
                  sportNameDefault={"football"}
                  sportTranslation={trsanslationData?.scores_header_translations
                    ?.sports_v2?.football}
                  sportValue={trsanslationData
                    ?.scores_header_fixtures_information?.football}
                  {selectedSport}
                  on:closeDropdown={(event) => {
                    return (selectedSport = event.detail?.selectedSport);
                  }}
                />
              {/if}

              <!--
              ╭─────
              │ > Predictor
              ╰─────
              -->
              {#if currentPageRouteId == "CompetitionPage"}
                <HeaderCompetitionBtn
                  competitionNameDefault={"predictor"}
                  competitionTranslation={trsanslationData
                    ?.competitions_category?.data?.predictor}
                  navUrl={generateUrlCompetitions(
                    $sessionStore.serverLang,
                    $page.data.B_SAP_D3_CP_H
                  )}
                />
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <!--
      ╭─────
      │ > 2nd Column (scores only)
      ╰─────
      -->
      <div
        class="
        row-space-start
        "
        style="width: fit-content;"
      >
        <!--
        💻 TABLET 🖥️ LAPTOP
        -->
        {#if !VIEWPORT_MOBILE_INIT[1] && currentPageRouteId == "Standard"}
          <!--
          ╭─────
          │ > Bookmakers Container
          ╰─────
          -->
          <HeaderCBookmakers {VIEWPORT_TABLET_INIT} {VIEWPORT_MOBILE_INIT} />
        {/if}

        <!--
        ╭─────
        │ > Betarena Token
        ╰─────
        -->
        {#if user != undefined}
          <a
            href="/u/transaction-history/{$userBetarenaSettings.lang}"
            title="View Transactions History"
          >
            <div
              id="balance-box"
              class="
              dropdown-opt-box
              row-space-start
              "
            >
              <div>
                <!--
                📱 MOBILE
                Balance Title
                -->
                {#if !VIEWPORT_MOBILE_INIT[1]}
                  <p
                    class="
                    color-grey
                    s-12
                    no-wrap
                    "
                  >
                    {trsanslationData?.scores_header_translations?.data
                      ?.balance ?? translationObject.balance}
                  </p>
                {/if}

                <p
                  class="
                  color-white
                  s-14
                  no-wrap
                  "
                >
                  <span
                    class="
                    color-primary
                    w-500
                    m-r-5
                    "
                  >
                    {spliceBalanceDoubleZero(toDecimalFix(main_balance)) ??
                      "0.00"} BTA
                  </span>
                  {#if VIEWPORT_MOBILE_INIT[1]}
                    <br />
                  {/if}
                  (${spliceBalanceDoubleZero(toDecimalFix(main_balance)) ??
                    "0.00"})
                </p>
              </div>
            </div>
          </a>

          <!--
          ╭─────
          │ > But Betarena Token (navigation)
          ╰─────
          -->
          {#if true}
            <div
              class:m-l-50={!VIEWPORT_MOBILE_INIT[1]}
              class:m-l-20={VIEWPORT_MOBILE_INIT[1]}
            >
              <BuyBtaButton popup={true} />
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  <!--
  ╭─────
  │ > Navbar Slide :|: 📱 MOBILE + 💻 TABLET
  ╰─────
  -->
  {#if (VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1]) && globalStateNavbar.has("MobileNavToggleMenuActive")}
    <nav
      data-testid="header-side-menu"
      class:tablet-exclusive={!VIEWPORT_MOBILE_INIT[1]}
      in:fly={{ x: -200, duration: 500 }}
      out:fly={{ x: -200, duration: 500 }}
    >
      <!--
      ╭─────
      │ > Header (INNER) close dropdown area
      ╰─────
      -->
      {#if globalStateNavbar.has("UserDropdownActive")}
        <div
          id="background-area-close"
          on:click={() => {
            scoresNavbarStore.closeAllDropdowns();
            return;
          }}
        />
      {/if}

      <div>
        <!--
        ╭─────
        │ > Top Row
        ╰─────
        -->
        <div
          class="
          row-space-out
          "
        >
          <!--
          ╭─────
          │ > Close icon
          ╰─────
          -->
          <img
            data-testid="header-side-menu-close"
            loading="lazy"
            src={dynamicAssetMap.get("close")}
            alt="close-icon"
            width="24"
            height="24"
            on:click={() => {
              scoresNavbarStore.closeAllDropdowns();
              return;
            }}
          />

          <!--
          ╭─────
          │ > Main Platform Options
          │ > TODO: add the currency, lang, theme box-options as component [?]
          ╰─────
          -->
          <div
            class="
            row-space-end
            width-auto
            "
          >
            <!--
            ╭─────
            │ > Currency selection (hidden)
            ╰─────
            -->
            <div
              id="currency-box"
              class="
              m-r-16
              "
            >
              <!--
              ╭─────
              │ > Selected Currency
              ╰─────
              -->
              <div
                class="
                selected-language-btn
                row-space-start
                "
                class:active-lang-select={globalStateNavbar.has(
                  "CurrencyDropdownActive"
                )}
              >
                <!--
                ╭─────
                │ > Currency Icon
                ╰─────
                -->
                <img
                  loading="lazy"
                  src="/assets/svg/currency/usd.svg"
                  alt="usd-icon"
                  width="16"
                  height="16"
                  class="
                  m-r-6
                  "
                />

                <!--
                ╭─────
                │ > Currency text (hidden)
                ╰─────
                -->
                <p
                  class="
                  color-white
                  s-14
                  "
                >
                  USD
                </p>

                <!--
                ╭─────
                │ > Arrow down (hidden)
                ╰─────
                -->
                {#if false}
                  <img
                    loading="lazy"
                    src={!widgetState.has("CurrencyDropdownActive")
                      ? dynamicAssetMap.get("arrow_down")
                      : dynamicAssetMap.get("arrow_up")}
                    alt={!widgetState.has("CurrencyDropdownActive")
                      ? "arrow_down"
                      : "arrow_up"}
                    width="16"
                    height="16"
                  />
                {/if}
              </div>
            </div>

            <!--
            ╭─────
            │ > Language Selection
            ╰─────
            -->
            <HeaderCLang />

            <!--
            ╭─────
            │ > Theme Selection
            ╰─────
            -->
            {#if VIEWPORT_MOBILE_INIT[1]}
              <HeaderCTheme />
            {/if}
          </div>
        </div>

        <!--
        ╭─────
        │ > Menu Options Box
        ╰─────
        -->
        <div
          class="
          column-start-grid-start
          "
          class:m-t-25={VIEWPORT_TABLET_INIT[1]}
          class:m-t-45={VIEWPORT_MOBILE_INIT[1]}
        >
          <!--
          ╭─────
          │ > Target Platform Navigation(s)
          ╰─────
          -->
          {#each navButtonOrderList as item}
            <HeaderNavBtn
              navKey={item.key}
              navUrl={item.url}
              navTxt={item.navTxt}
              isNew={item.isNew}
              newTxt={item.newTxt}
              {VIEWPORT_TABLET_INIT}
              {VIEWPORT_MOBILE_INIT}
            />
          {/each}

          {#if VIEWPORT_MOBILE_INIT[1] && !currentPageRouteId}
            <!--
            ╭─────
            │ > Bookmakers Section
            ╰─────
            -->
            <HeaderCBookmakers {VIEWPORT_TABLET_INIT} {VIEWPORT_MOBILE_INIT} />
          {/if}
        </div>
      </div>
    </nav>
  {/if}
</header>

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
  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  #background-area-close {
    /* 📌 position */
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    /* 🎨 style */
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  header {
    /* 📌 position */
    z-index: 1000;
    position: relative;
    /* 🎨 style */
    background-color: var(--dark-theme);
    height: 128px;

    &.page-authors {
      /* 🎨 style */
      height: unset;
      background-color: unset;
    }

    &.update-z-index {
      z-index: unset;
    }

    @mixin headerBox {
      /* 📌 position */
      position: absolute;
      position: relative;
      /* 🎨 style */
      max-width: 1430px;
      width: inherit;
    }

    div#header\/top {
      /* 📌 position */
      top: 0;
      /* 🎨 style */
      padding: 23px 16px;
      height: 64px !important;
      @include headerBox;

      #burger-menu {
        margin-right: 16.15px;
      }

      div#authorsBackBtn {
        /* 🎨 style */
        border-radius: 50%;
        background-color: #e6e6e6cc;
        width: 32px;
        height: 32px;
        position: relative;

        img {
          /* 📌 position */
          position: absolute;
          margin: auto;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
        }
      }

      div#navBox {
        /* 🎨 style */
        position: relative;

        div#nav-triangle {
          /* 📌 position */
          position: absolute;
          bottom: -21px;
          /* 🎨 style */
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 12px solid var(--dark-theme-1);
          transition: all 0.25s ease-out;
        }
      }

      div#user-profile-box {
        /* 📌 position */
        position: relative;
        /* 🎨 style */
        width: auto;

        div#user-profile-dropdown {
          /* 📌 position */
          position: absolute;
          top: 100%;
          right: 0;
          left: unset;
          z-index: 2000;
          /* 🎨 style */
          margin-top: 5px;
          background: #292929;
          box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          overflow: hidden;
          width: 168px;

          div.theme-opt-box {
            padding: 9.5px 16px;
            box-shadow: inset 0px -1px 0px #3c3c3c;
            background: #4b4b4b;
            height: 40px;

            &:hover {
              /* 🎨 style */
              background: var(--dark-theme);
              box-shadow: inset 0px -1px 0px #3c3c3c;
            }
          }
        }

        img#user-profile-picture {
          /* 🎨 style */
          border-radius: 50%;
        }

        p#wallet-text {
          margin-right: 14px;
        }
      }
    }

    div#header\/bottom {
      /* 📌 position */
      bottom: 0;
      /* 🎨 style */
      padding: 10px 16px;
      height: 64px !important;
      @include headerBox;

      div#header\/bottom\/inner {
        /* 🎨 style */
        overflow-x: scroll;
        overflow-y: hidden;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          /* 🎨 style */
          display: none;
        }
      }

      div#balance-box {
        /* 🎨 style */
        padding-right: 0;
        border-left: 1px solid #4b4b4b;
        height: 44px;
        padding: 0 16px;
        width: fit-content;
        cursor: pointer;
      }
    }

    @mixin headerDivider {
      /* 📌 position */
      position: absolute;
      /* 🎨 style */
      width: 100%;
      border: 0.5px solid var(--dark-theme-1);
    }

    div#header\/border\/top-box {
      /* 📌 position */
      bottom: 64px;
      @include headerDivider;
    }

    div#header\/border\/bottom-box {
      /* 📌 position */
      bottom: 0;
      @include headerDivider;
    }

    nav {
      /* 📌 position */
      position: absolute;
      z-index: 1000000000;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      /* 🎨 style */
      background-color: #292929;
      height: 100vh;
      width: 100%;
      padding: 14px 16px;
      overflow-y: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        /* 🎨 style */
        display: none;
      }

      &.tablet-exclusive {
        /* 🎨 style */
        padding: 24px 34px;
        max-width: 374px !important;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media screen and (max-width: 560px) {
    :root {
      --header-is-mobile: true;
    }
  }

  @media screen and (min-width: 768px) {
    header {
      div#header\/top {
        /* 🎨 style */
        padding: 23px 34px;

        #burger-menu {
          /* 🎨 style */
          margin-right: 24px;
        }
      }

      div#header\/bottom {
        /* 🎨 style */
        padding: 6px 34px;
      }
    }
  }

  @media screen and (min-width: 1024px) {
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  header.dark-mode {
    div#header\/top {
      div#authorsBackBtn {
        /* 🎨 style */
        background-color: #4b4b4bcc;
      }
    }
  }
</style>
