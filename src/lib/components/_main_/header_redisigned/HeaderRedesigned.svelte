<script lang="ts">
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
  import SeoBox from "$lib/components/SEO-Box.svelte";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { viewportChangeV2 } from "$lib/utils/device";
  import {
    routeIdPageAuthors,
    routeIdPageCompetition,
    routeIdPageFixture,
    routeIdPageLeague,
    routeIdPagePlayer,
    routeIdPageTags,
  } from "$lib/constants/paths.js";
  import MobileHeaderRich from "./MobileHeaderRich.svelte";
  import Header from "./Header.svelte";
  import { page } from "$app/stores";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import MobileHeaderSmall from "./MobileHeaderSmall.svelte";
  import { scoresNavbarStore } from "./_store.js";
  import SportsNavigation from "./SportNavigation/SportsNavigation.svelte";
  import SportsNavigationStandart from "./SportNavigation/SportsNavigationStandart.svelte";

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

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "header",
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true];

  const simpleMobileHeaderRoutes = [routeIdPageFixture, routeIdPagePlayer, routeIdPageLeague, routeIdPageCompetition, routeIdPageTags, routeIdPageAuthors];

  $: isSimpleHeader = simpleMobileHeaderRoutes.includes($page.route.id || "");
  $: ({ windowWidth, currentPageRouteId, viewportType } = $sessionStore);
  $: [mobile, tablet] = viewportChangeV2(
    windowWidth,
    VIEWPORT_MOBILE_INIT[0],
    VIEWPORT_TABLET_INIT[0]
  );
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: ({ user } = $userBetarenaSettings);
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

  function avatarClick() {
    const openDropDown =
      !$scoresNavbarStore.globalState.has("UserDropdownActive");
    scoresNavbarStore.closeAllDropdowns();

    if (openDropDown) {
      scoresNavbarStore.updateData("globalStateAdd", "UserDropdownActive");
    }
  }

  // #endregion ➤ 🛠️ METHODS
</script>

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

<header class:mobile class:dark-mode={currentPageRouteId !== "AuthorsPage"}>
  {#if mobile || tablet}
    {#if !mobile || !isSimpleHeader}
      <MobileHeaderRich {mobile} {tablet} />
    {:else if mobile && isSimpleHeader}
      <MobileHeaderSmall {mobile} {tablet} on:avatarClick={avatarClick} />
    {/if}
  {:else}
    <Header on:avatarClick={avatarClick} />
  {/if}

  {#if currentPageRouteId === "Standard" && (!mobile || !isSimpleHeader)}
    <SportsNavigationStandart />
  {:else if currentPageRouteId !== "AuthorsPage" && user && viewportType === "desktop"}
    <SportsNavigation />
  {/if}

  {#if currentPageRouteId !== "AuthorsPage"}
    <div class="wave-wrapper" >
      {#if !user || viewportType !== "desktop"}
        <div class="sport-nav-placeholder" />
      {/if}
      <svg
        class="wave-bg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 463"
        fill="none"
      >
        <path
          d="M447 314.307C240 314.307 0 435.854 0 435.854L4.61216e-06 -32H1440V460.864C1440 460.864 1275.86 473.72 1088 436.354C885.365 396.051 654 314.307 447 314.307Z"
          fill="#292929"
        />
      </svg>
    </div>
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
  header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-color);
    border-bottom: var(--header-border);
    position: relative;

    .empty-nav {
      box-sizing: border-box;
      height: 64px;
      width: 100%;
      background: #292929;
      position: absolute;
      z-index: 0;
      bottom: 0;
    }

    &.mobile {
      border-bottom: none;
    }
  }
  .wave-wrapper {
    position: relative;
    width: 100%;
    z-index: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    transform: translateY(100%);

    .sport-nav-placeholder {
      height: 64px;
      width: 100%;
      background: #292929;
    }
    svg {
      width: 100%;
      height: auto;
    }
  }
</style>
