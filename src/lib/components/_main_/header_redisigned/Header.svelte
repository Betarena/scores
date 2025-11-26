<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import AssetBetarenaLogoFull from './assets/asset-betarena-logo-full.svelte';
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
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    routeIdAuthorProfile,
    routeIdAuthorSubscribers,
    routeIdPageAuthors,
    routeIdPageTags,
    routeIdSearch,
    routeIdSportstack,
  } from "$lib/constants/paths.js";
  import session from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { promiseUrlsPreload } from "$lib/utils/navigation.js";
  import { translationObject } from "$lib/utils/translation.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import HeaderCLang from "./Header-C-Lang.svelte";
  import HeaderCTheme from "./Header-C-Theme.svelte";
  import HeaderSearch from "./HeaderSearch.svelte";
  import { scoresNavbarStore } from "./_store.js";
  import AssetBetarenaLogoFull from "./assets/asset-betarena-logo-full.svelte";
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

  $: translationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: ({ lang } = $userSettings);
  $: homepageURL = lang != "en" ? `/${lang}` : "/";
  $: logoLink =
    lang != "en" ? `${$page.url.origin}/${lang}` : $page.url.origin;
  $: ({ user } = $userBetarenaSettings);
  $: isAuth = !!user;
  $: ({ profile_photo } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: if(browser) loadTranslations(lang);
   $: ({viewportType} = $session)

  const pagesWihoutNav = [
    routeIdPageTags,
    routeIdPageAuthors,
    routeIdAuthorProfile,
    routeIdSportstack,
    routeIdAuthorSubscribers,
  ];
  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "header⮕web";

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

  function signIn() {
    $session.currentActiveModal = "Auth_Modal";
    return;
  }

  let prevLang;
  async function loadTranslations(lang: string | undefined) {
    if (!lang || prevLang === lang) return;
    prevLang = lang;
    const res = await promiseUrlsPreload(
      [`/api/data/main/navbar?lang=${lang}&decompress`],
      fetch
    );
    translationData = res[0];
    return res;
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<svelte:window
  on:click={() => {
    scoresNavbarStore.closeAllDropdowns();
  }}
/>
<div class="wrapper" id={CNAME}>
  <div
    id="brand"
    data-testid="header-brand-img"
    aria-label="brand-img"
    class="cursor-pointer brand-logo"
    on:click={() => {
      if ($page.url.pathname == "/") window.location.reload();
      return;
    }}
  >
    <a href={homepageURL} title={logoLink}>
      <AssetBetarenaLogoFull />
    </a>
  </div>
  {#if !pagesWihoutNav.includes($page.route.id || "")}
    <!-- <HeaderNavigation {translationData} /> -->
  {/if}

  <div class="actions">
    {#if viewportType === "desktop" && ![routeIdSearch, routeIdPageAuthors].includes( $page.route.id || "")}
       <HeaderSearch />
    {/if}
    <HeaderCLang />
    <HeaderCTheme />
    {#if !isAuth}
      <Button type="outline" on:click={signIn} style="padding: 11px 24px">
        <TranslationText
          key={"header-txt-unkown"}
          text={translationData?.scores_header_translations?.sign_in}
          fallback={translationObject.sign_in}
        />
      </Button>
    {:else}
      <a
        href="/u/dashboard/{$userBetarenaSettings.lang}"
        class="avatar-wrapper"
        on:click|stopPropagation
      >
        <Avatar src={profile_photo} size={44} isLoogedIn={isAuth} />
      </a>
    {/if}
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
  .wrapper {
    z-index: 2;
    display: flex;
    padding: 12px 34px;
    max-width: 1430px;
    margin: auto;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 44px;

    .actions {
      align-items: center;
      justify-content: flex-end;
      display: flex;
      justify-self: flex-end;
      gap: 24px;
    }
    .avatar-wrapper {
      position: relative;
      cursor: pointer;
    }
  }
</style>
