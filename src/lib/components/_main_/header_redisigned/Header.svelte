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
  import { logoutUser } from "$lib/utils/user";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import Button from "$lib/components/ui/Button.svelte";
  import { translationObject } from "$lib/utils/translation.js";
  import HeaderCLang from "./Header-C-Lang.svelte";
  import HeaderCTheme from "./Header-C-Theme.svelte";
  import AssetBetarenaLogoFull from "./assets/asset-betarena-logo-full.svelte";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import { scoresNavbarStore } from "./_store.js";
  import { fly } from "svelte/transition";
  import HeaderNavigation from "./HeaderNavigation.svelte";
  import { promiseUrlsPreload } from "$lib/utils/navigation.js";

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
  $: ({ globalState, serverLang } = $sessionStore);

  $: translationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: homepageURL = serverLang != "en" ? `/${serverLang}` : "/";
  $: logoLink =
    serverLang != "en" ? `${$page.url.origin}/${serverLang}` : $page.url.origin;
  $: ({ profile_photo } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: loadTranslations(serverLang);
  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "<section-scope>⮕<type|w|c>⮕<unique-tag-name>⮕main";

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
    $sessionStore.currentActiveModal = "Auth_Modal";
    return;
  }

  function avatarClick() {
    const openDropDown =
      !$scoresNavbarStore.globalState.has("UserDropdownActive");
    scoresNavbarStore.closeAllDropdowns();

    if (openDropDown) {
      scoresNavbarStore.updateData("globalStateAdd", "UserDropdownActive");
    }
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
<div class="wrapper">
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

  <div class="navigation-wrapper">
    <HeaderNavigation {translationData} />
  </div>

  <div class="actions">
    <HeaderCLang />
    <HeaderCTheme />
    {#if globalState.has("NotAuthenticated")}
      <Button type="outline" on:click={signIn}>
        <TranslationText
          key={"header-txt-unkown"}
          text={translationData?.scores_header_translations?.sign_in}
          fallback={translationObject.sign_in}
        />
      </Button>
    {:else}
      <div class="avatar-wrapper" on:click|stopPropagation>
        <Avatar src={profile_photo} size={40} on:click={avatarClick} />

        {#if $scoresNavbarStore.globalState.has("UserDropdownActive")}
          <div id="user-profile-dropdown" transition:fly>
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
                    text={translationData?.scores_header_translations?.data
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
                  text={translationData?.scores_header_translations?.data
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 44px;

    .brand-logo {
      margin-top: -7px;
    }

    .navigation-wrapper {
      display: flex;
      flex-grow: 1;
      justify-content: start;
      gap: 32px;
    }
    .actions {
      align-items: center;
      justify-content: flex-end;
      display: flex;
      justify-self: flex-end;
    }
    .avatar-wrapper {
      position: relative;
      cursor: pointer;

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

        .theme-opt-box {
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
    }
  }
</style>
