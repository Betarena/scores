<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @migbash                                                      │
│ ➤ Maintainer(s) // @migbash                                                      │
│ ➤ Created on    // April 18th, 2023                                              │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module)
│ |: Player Breadcrumbs Widget Entry Point
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

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

	import sessionStore from '$lib/store/session.js';
	import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

	import BreadcrumbSingle from './Breadcrumb-Single.svelte';

	import type { B_SAP_D1, B_SAP_D3, B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/v8/preload.scores.js';

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

  let
    /**
     * @description
     * 📝
     */
    isDataMissing = false,
    /**
     * @description
     * 📝 Map for Breadcrumbs,
     * |: key - string - breadcrumb name,
     * |: value - string - breadcrumb link;
     * @example
     * |: mapBreadcrump.set('sport', '/football');
     * |: mapBreadcrump.set('country', '/england');
     * |: mapBreadcrump.set('league', '/premier-league');
     * |: mapBreadcrump.set('player', '/player-name');
     * |: mapBreadcrump.set('team', '/team-name');
     */
    mapBreadcrump = new Map<string, string>(),
  ;

  $: widgetPageData = $page.data.PAGE_DATA as B_SAP_PP_D | null | undefined;
  $: objCountryTranslation = $page.data.B_SAP_D1 as B_SAP_D1 | null | undefined;
  $: objSportTranslation = $page.data.B_SAP_D3 as B_SAP_D3 | null | undefined;
  $: objPlayerSeo = $page.data.PAGE_SEO as B_SAP_PP_T | null | undefined;
  $: ({ serverLang } = $sessionStore);
  $: strLangPrefix
    = serverLang == 'en'
      ? '/'
      : `/${serverLang}/`
  ;
  $: country = objCountryTranslation?.translations?.[serverLang ?? 'en'];
  $: strBreadcrumbPlayer = objPlayerSeo?.main_data?.title
    .replace(/{name}/g, widgetPageData?.data?.player_name ?? '')
    .replace(/{team}/g, widgetPageData?.data?.team_name ?? '')
  ;

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
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📝
   * @returns { void }
   */
  function helperGenerateUrl
  (
  ) : void
  {
    if (widgetPageData?.alternate_data_2 != undefined)
    {
      const
        /**
         * @description
         */
        listLeagueUrlStr
          = widgetPageData.alternate_data_2[serverLang ?? 'en']
            .split
            (
              '/'
            )
            // ╭─────
            // │ NOTE:
            // │ |: remove {lang} string from URL;
            // ╰─────
            .filter
            (
              a =>
              {
                return a.length != 2
              }
            )
      ;

      mapBreadcrump.set('sport', `${strLangPrefix}${listLeagueUrlStr[0]}`);
      mapBreadcrump.set('country', `${strLangPrefix}${listLeagueUrlStr[0]}/${listLeagueUrlStr[1]}`);
      mapBreadcrump.set('league', `${strLangPrefix}${listLeagueUrlStr[0]}/${listLeagueUrlStr[1]}/${listLeagueUrlStr[2]}`);

      isDataMissing = false;
    }
    else
    {
      const
        /**
         * @description
         */
        strSportTranslation = mutateStringToPermalink(objSportTranslation?.[serverLang ?? 'en'] ?? ''),
        /**
         * @description
         */
        strCountryTranslation = mutateStringToPermalink(objCountryTranslation?.translations?.[serverLang ?? 'en'] ?? '')
      ;

      mapBreadcrump.set('sport', `${strLangPrefix}${strSportTranslation}`);
      mapBreadcrump.set('country', `${strLangPrefix}${strSportTranslation}/${strCountryTranslation}`);
      mapBreadcrump.set('league', `${strLangPrefix}`);

      isDataMissing = true;
    }
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

  $: if (browser && serverLang) helperGenerateUrl();

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
│ ➤ BreadCrumb Component for Player Page
╰─────
-->
<div
  id="fpp-breadcrumb"
  class=
  "
  row-space-start
  m-b-20
  "
>
  <!--
  ╭─────
  │ ➤ SPORT
  ╰─────
  -->
  <BreadcrumbSingle
    href={mapBreadcrump.get('sport')}
    name={objPlayerSeo?.football}
  />
  <!--
  ╭─────
  │ ➤ COUNTRY
  ╰─────
  -->
  <BreadcrumbSingle
    href={mapBreadcrump.get('country')}
    name={country}
  />
  <!--
  ╭─────
  │ ➤ LEAGUE NAME
  ╰─────
  -->
  {#if !isDataMissing}
    <BreadcrumbSingle
      href={mapBreadcrump.get('league')}
      name={widgetPageData?.data?.league_name}
    />
  {/if}
  <!--
  ╭─────
  │ ➤ PLAYER NAME & TEAM NAME
  ╰─────
  -->
  <BreadcrumbSingle
    name={`${strBreadcrumbPlayer}`}
    end={true}
    disable={true}
  />
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

  #fpp-breadcrumb
  {
    overflow: hidden;
  }

</style>
