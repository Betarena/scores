<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import sessionStore from "$lib/store/session.js";
  import { generateUrlCompetitions } from "$lib/utils/string.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
    import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";

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

  export let backgroundColor = "#4b4b4bcc",
    color = "white";
  $: ({ globalState, serverLang = "en" } = $sessionStore);
  $: homepageURL = serverLang != "en" ? `/${serverLang}` : "/";
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;

  // #endregion ➤ 📌 VARIABLES

  function backBtnClick(): void {
    if (globalState.has("IsPWA")) return window.history.back();
    const [preferedPage] = $userBetarenaSettings.user?.scores_user_data
      ?.buttons_order || ["scores"];
    let url: string;
    switch (preferedPage) {
      case "competitions":
        url = generateUrlCompetitions(
          serverLang,
          $page.data.B_SAP_D3_CP_H
        );
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
  style="background-color: {backgroundColor};"
  on:click={backBtnClick}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <path
      d="M12.7763 7.44531L9.2207 11.0009L12.7763 14.5564"
      stroke={color}
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
