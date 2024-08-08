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
│ Scores Platform Header Lang Dropdown Component (Child)                           │
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
  import { fly } from "svelte/transition";

  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { dlog, NB_W_TAG } from "$lib/utils/debug.js";
  import { scoresNavbarStore } from "./_store.js";

  import arrowDown from "./assets/arrow-down.svg";
  import arrowUp from "./assets/arrow-up.svg";
  import arrowDownDark from "./assets/icon-arrow-down-dark.svg";
  import arrowUpDark from "./assets/icon-arrow-up-dark.svg";

  import { selectLanguage } from "$lib/utils/navigation.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";

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
     *  📣 Deifined `hover` timeout, that constitues a navigational `intent.
     */
    HOVER_TIMEOUT = 250;
  let /**
     * @description
     *  📣 Wether target dropdown menu is **active**.
     */
    isLangDropdown: boolean = false,
    /**
     * @description
     *  📣 Target `intent` language.
     */
    targetIntenLang: string | undefined = undefined,
    /**
     * @description
     *  📣 Target `timeout` intent.
     */
    timeoutIntent: NodeJS.Timeout;

  $: ({ serverLang, currentPageRouteId } = $sessionStore);
  $: ({ theme } = $userBetarenaSettings);
  $: ({ globalState: globalStateNavbar } = $scoresNavbarStore);

  $: translatioData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: isCustom = ["AuthorsPage", "NotificationsPage"].includes(currentPageRouteId || "");
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  - 📣 Advanced intent logic, applicable to desktop-only.
   *  - 📣 `Pre-loads` target page , for target `language` upon `intent`/`hover`.
   * @param { string | undefined } lang
   *  💠 **[required]** Target `hovered` language.
   * @return { void }
   */
  function detectIntentBuffer(lang: string | undefined): void {
    const /**
       * @description
       *  📣 Detect change in hover-over lang.
       */
      if_M_0: boolean = timeoutIntent != undefined && lang != targetIntenLang,
      /**
       * @description
       *  📣 First time set lang and timer.
       */
      if_M_E_0: boolean = lang != undefined && timeoutIntent == undefined;
    if (if_M_0) {
      // [🐞]
      dlog(`${NB_W_TAG[0]} clearning timer!`);

      clearTimeout(timeoutIntent);

      targetIntenLang = lang;

      if (lang == undefined) return;

      // [🐞]
      dlog(`${NB_W_TAG[0]} setting new timer!`);

      timeoutIntent = setTimeout(() => {
        // [🐞]
        dlog(`${NB_W_TAG[0]} intent triggered!`, true);
        $sessionStore.lang_intent = targetIntenLang;
      }, HOVER_TIMEOUT);
    } else if (if_M_E_0) {
      targetIntenLang = lang;
      timeoutIntent = setTimeout(() => {
        // [🐞]
        dlog(`${NB_W_TAG[0]} intent triggered!`, true);
        $sessionStore.lang_intent = targetIntenLang;
      }, HOVER_TIMEOUT);
    }

    return;
  }

  function handleClick() {
    const openDropDown = !$scoresNavbarStore.globalState.has("LangDropdownActive")
    scoresNavbarStore.closeAllDropdowns();

    if (openDropDown) {
      scoresNavbarStore.updateData("globalStateAdd", "LangDropdownActive");
    }
    return;
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

<div
  id="lang-container"
>
  <!--
  ╭─────
  │ > Selected Language
  ╰─────
  -->
  <div
    class="
    selected-language-btn
    row-space-out
    cursor-pointer
    "
    class:active-lang-select={globalStateNavbar.has("LangDropdownActive")}
    on:click|stopPropagation={handleClick}
  >
    <p
      class="
      s-14
      m-r-5
      uppercase
      "
      class:color-white={!isCustom|| theme == "Dark"}
      class:color-black-2= {isCustom &&
        theme == "Light"}
    >
      {serverLang}
    </p>

    <!--
    ╭─────
    │ > Arrow Down
    ╰─────
    -->
    <img
      loading="lazy"
      src={!isCustom|| theme == "Dark"
        ? !globalStateNavbar.has("LangDropdownActive")
          ? arrowDown
          : arrowUp
        : !globalStateNavbar.has("LangDropdownActive")
        ? arrowDownDark
        : arrowUpDark}
      alt={!isLangDropdown ? "arrowDown" : "arrowUp"}
      width="16"
      height="16"
    />
  </div>

  <!--
  ╭─────
  │ > Dropdown Menu
  ╰─────
  -->
  {#if globalStateNavbar.has("LangDropdownActive")}
    <div id="dropdown-menu" transition:fly>
      {#each translatioData?.langArray?.sort() ?? [] as lang}
        {#if lang.toUpperCase() != serverLang?.toUpperCase()}
          <div
            class="
            lang-select
            "
            on:click={() => {
              return selectLanguage(lang);
            }}
            on:keydown={() => {
              return selectLanguage(lang);
            }}
            on:mouseout={() => {
              return detectIntentBuffer(undefined);
            }}
            on:mouseover={() => {
              return detectIntentBuffer(lang);
            }}
            on:focus={() => {
              return detectIntentBuffer(lang);
            }}
          >
            <p
              class="
              color-white
              s-14
              uppercase
              "
            >
              {lang}
            </p>
          </div>
        {/if}
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
  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#lang-container {
    /* 📌 position */
    position: relative;
    margin-left: -17px;

    div.selected-language-btn {
      /* 🎨 style */
      color: #ffffff;
      outline: none;
      border: none;
      padding: 5px 12px;
      transform: translateX(12px);
      background-color: transparent;

      &:hover,
      &.active-lang-select {
        /* 🎨 style */
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }

    div#dropdown-menu {
      /* 📌 position */
      position: absolute;
      z-index: 5000;
      top: 100%;
      left: -20%;
      /* 🎨 style */
      width: 88px;
      margin-top: 5px;
      transform: translateX(12px);
      border-radius: 4px;
      background: var(--dark-theme);
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;

      .lang-select {
        /* 🎨 style */
        padding: 10px 0;
        text-align: center;
        background: var(--dark-theme-1);
        cursor: pointer;
        box-shadow: inset 0px -1px 0px #3c3c3c;

        &:hover {
          /* 🎨 style */
          background: var(--dark-theme);
          box-shadow: inset 0px -1px 0px #3c3c3c;
        }
      }
    }
  }
</style>
