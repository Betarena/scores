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

  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import sessionStore from "$lib/store/session.js";
  import { generateUrlCompetitions } from "$lib/utils/string.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import { createEventDispatcher } from "svelte";

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

  export let backgroundColor = "",
    color = "",
    custom_handler = false,
    mode: "back" | "home" = "home";

  const dispatch = createEventDispatcher();
  $: ({ globalState, serverLang = "en" } = $sessionStore);
  $: homepageURL = serverLang != "en" ? `/${serverLang}` : "/";
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;

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

  function backBtnClick(): void {
    if (custom_handler) {
      dispatch("click");
      return;
    }
    if (globalState.has("IsPWA") || mode === "back")
      return window.history.back();
    const [preferedPage] = $userBetarenaSettings.user?.scores_user_data
      ?.buttons_order || ["scores"];
    let url: string;
    switch (preferedPage) {
      case "competitions":
        url = generateUrlCompetitions(serverLang, $page.data.B_SAP_D3_CP_H);
        break;
      case "content":
        url =
          trsanslationData?.scores_header_translations?.section_links
            ?.sports_content_url || "/";
        break;
      case "scores":
      default:
        url = homepageURL;
        break;
    }

    goto(url);
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

<button
  class="back-button-wrapper"
  aria-label="Back"
  style={backgroundColor ? ` background-color: ${backgroundColor};` : ""}
  on:click={backBtnClick}
>
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.77832 8.55448L1.22277 4.99892L4.77832 1.44336"
      stroke={color ? color : "var(--text-color)"}
      stroke-width="1.33333"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</button>

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
  :global(.light-mode) {
    .back-button-wrapper {
      background-color: rgba(230, 230, 230, 0.8);
    }
  }
  :global(.dark-mode) {
    .back-button-wrapper {
      background-color: #4b4b4bcc;
    }
  }
  .back-button-wrapper {
    display: flex;
    height: 32px;
    width: 32px;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background-color: #4b4b4bcc;
    cursor: pointer;
  }
</style>
