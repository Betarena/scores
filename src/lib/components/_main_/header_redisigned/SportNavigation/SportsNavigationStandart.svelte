<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { sessionStore } from '$lib/store/session.js';
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
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { generateUrlCompetitions } from "$lib/utils/string.js";
  import HeaderCompetitionBtn from "../../header/Header-Competition-Btn.svelte";
  import Balance from "./Balance.svelte";
  import HeaderCBookmakers from "./Header-C-Bookmakers.svelte";
  import HeaderSportsBtn from "./SportsNavBtn.svelte";
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
  let /**
     * @description
     *  📣 Currently `selected sport`.
     */
    selectedSport = "football";

  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: ({ user } = $userBetarenaSettings);
  $: ({ viewportType, currentPageRouteId, serverLang = "en" } = $sessionStore);
  // #endregion ➤ 📌 VARIABLES $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
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

<div class="wrapper" id="header-sports-nav-standart">
  <div class="navigation-container" class:mobile={viewportType === "mobile"}>
    <div class="sport-options">
      <!-- [TODO] - Create Independet Component (join HeaderCompetitionBtn and HeaderSportsBtn) as they very simmilar + made layout with {#for} -->
      {#if currentPageRouteId === "CompetitionPage"}
        <HeaderCompetitionBtn
          competitionNameDefault={"predictor"}
          competitionTranslation={trsanslationData?.competitions_category?.data
            ?.predictor || ""}
          navUrl={generateUrlCompetitions(serverLang, $page.data.B_SAP_D3_CP_H)}
        />
      {:else}
        <HeaderSportsBtn
          sportNameDefault={"football"}
          sportTranslation={trsanslationData?.scores_header_translations
            ?.sports_v2?.football || ""}
          sportValue={trsanslationData?.scores_header_fixtures_information
            ?.football || ""}
          {selectedSport}
          on:closeDropdown={(event) => {
            return (selectedSport = event.detail?.selectedSport);
          }}
        />
      {/if}
    </div>
    {#if viewportType !== "mobile"}
      <div class="actions">
        {#if currentPageRouteId !== "CompetitionPage"}
           <HeaderCBookmakers />
        {/if}
        {#if user != undefined && viewportType === "desktop"}
          <Balance />
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
    z-index: 1;
    display: flex;
    height: 64px;
    width: 100%;
    border-top: 1px solid #4b4b4b;
    border-bottom: 1px solid #4b4b4b;
    background: #292929;

    .navigation-container {
      max-width: 1430px;
      display: flex;
      margin: auto;
      width: 100%;
      height: 100%;
      padding: 10px 34px;
      justify-content: space-between;

      .sport-options {
        padding: 10px 0;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .actions {
        display: flex;
        justify-self: end;
      }
      &.mobile {
        padding: 10px 16px;
      }
    }
  }
</style>
