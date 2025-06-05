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
  import {
    routeIdAuthorProfile,
    routeIdAuthorSubscribers,
    routeIdPageAuthors,
    routeIdPageCompetition,
    routeIdPageFixture,
    routeIdPageLeague,
    routeIdPagePlayer,
    routeIdPageProfile,
    routeIdPageProfileAuthorCreate,
    routeIdPageTags,
    routeIdSportstack,
    routeIdPageProfilePublication
  } from "$lib/constants/paths.js";
  import MobileHeaderRich from "./MobileHeaderRich.svelte";
  import Header from "./Header.svelte";
  import { page } from "$app/stores";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import MobileHeaderSmall from "./MobileHeaderSmall.svelte";
  import TabletWave from "./assets/wave-bg-tablet.svg";
  import DesktopWave from "./assets/wave-bg-desktop.svg";
  import MobileWave from "./assets/wave-bg-mobile.svg";
  import { goto } from "$app/navigation";
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


  const simpleMobileHeaderRoutes = [
    routeIdPageFixture,
    routeIdPagePlayer,
    routeIdPageLeague,
    routeIdPageCompetition,
    routeIdPageTags,
    routeIdPageProfile,
    routeIdPageProfileAuthorCreate,
    routeIdPageProfilePublication,
    routeIdPageAuthors,
    routeIdAuthorProfile,
    routeIdAuthorSubscribers,
    routeIdSportstack,
    routeIdPageAuthors,
  ];
  $: isInnerPage = simpleMobileHeaderRoutes.includes($page.route.id || "");
  $: ({ currentPageRouteId, viewportType, globalState } =
    $sessionStore);
  $: mobile = viewportType === "mobile";
  $: tablet = viewportType === "tablet";
  $: desktop = !mobile && !tablet;
  $: isPWA = globalState.has("IsPWA");
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: ({ user } = $userBetarenaSettings);
  $: isAuth = !!user;
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
    if (!isAuth) {
      signIn();
      return;
    }
    goto(`/u/dashboard/${$userBetarenaSettings.lang}`);
  }

  function signIn() {
    $sessionStore.currentActiveModal = "Auth_Modal";
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

<header
  id="header"
  class:sticky={$page.route.id === routeIdPageAuthors && isPWA && mobile}
  class:mobile
  class:dark-mode={currentPageRouteId !== "AuthorsPage"}
  style:border-bottom={$page.route.id === routeIdPageAuthors
    ? "none"
    : "var(--header-border)"}
>
  {#if !["ProfilePage","AuthorsPage", "Standard"].includes(currentPageRouteId || "")}
    <div class="wave-wrapper">
      <img
        id=""
        src={viewportType === "mobile"
          ? MobileWave
          : viewportType === "tablet"
          ? TabletWave
          : DesktopWave}
        alt="wave-bg"
        title=""
        class="wave-bg"
        loading="lazy"
      />
    </div>
  {/if}
  {#if mobile || tablet}
    {#if !isInnerPage}
      <MobileHeaderRich {mobile} {tablet} />
    {:else }
      <MobileHeaderSmall {mobile} {tablet} on:avatarClick={avatarClick} />
    {/if}
  {:else}
    <Header on:avatarClick={avatarClick} />
  {/if}

  {#if (currentPageRouteId === "Standard" || currentPageRouteId === "CompetitionPage") && (desktop || !isInnerPage)}
    <!-- <SportsNavigationStandart /> -->
  {:else if currentPageRouteId !== "AuthorsPage" && user && desktop}
    <!-- <SportsNavigation /> -->
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
    position: relative;

    &.sticky {
      position: sticky;
      top: 0;
      z-index: 2;
      width: 100%;
      background: initial;
    }

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
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;

    img {
      width: 100%;
      max-height: 450px;
      object-fit: cover;
    }
  }
</style>
