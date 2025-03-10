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
│ |: Player Fixtures Widget Entry Point
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

  import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import FixturesLoader from './Fixtures-Loader.svelte';
	import FixturesMain from './Fixtures-Main.svelte';

  import { browser } from '$app/environment';
  import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
  import type { B_PFIX_D, PFIX_C_Fixture, PFIX_C_League } from '@betarena/scores-lib/types/player-fixtures';
  import type { B_SAP_PP_D } from '@betarena/scores-lib/types/v8/preload.scores.js';

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

  $: widgetDataMain = $page.data.PAGE_DATA as B_SAP_PP_D | null | undefined;
  $: widgetDataSeo = $page.data.B_PFIX_D as B_PFIX_D | null | undefined;
  $: widgetDataTranslation = $page.data.B_PFIX_T as B_PFIX_T | null | undefined;
  $: WIDGET_TITLE = widgetDataTranslation?.fixtures ?? 'Fixtures';
  $: ({ serverLang } = $sessionStore);

  const
    /**
     * @description
     * 📣 map of past fixtures
    */
    mapFixture = new Map(Object.entries(widgetDataSeo?.data?.past_fixtures?? [])) as Map <string, PFIX_C_Fixture[]>,
    /**
     * @description
     * 📣 map of leagues
    */
    mapLeague = new Map(Object.entries(widgetDataSeo?.data?.leagues ?? [])) as unknown as Map <string, PFIX_C_League>
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
   *  🟩 MAIN
   * @description
   *  📣 main widget data loader
   *  - ⚡️ (and) try..catch (error) handler
   *  - ⚡️ (and) placeholder handler
   * @returns { Promise < void > }
   */
  async function widgetInit
  (
  ): Promise < B_PFIX_D >
  {
    // IMPORTANT
    if (!browser) return;

    return widgetDataSeo;
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

<SeoBox>
  <h2>
    {WIDGET_TITLE}
  </h2>
  <!--
  ╭─────
  │ ➤ Fixture Links
  ╰─────
  -->
  {#each [...mapFixture.entries()] as [, fixtures]}
    {#each fixtures as item}
      {#if item.urls && serverLang}
        <a href={item.urls[serverLang]}>
          {item.urls[serverLang]}
        </a>
      {/if}
    {/each}
  {/each}
  <!--
  ╭─────
  │ ➤ League Links
  ╰─────
  -->
  {#if mapLeague.size != 0}
    {#each [...mapLeague.entries()] as [, league]}
      {#if league.urls && serverLang}
      <a href='https://scores.betarena.com/{league.urls[serverLang]}'>
        {`https://scores.betarena.com/${league.urls[serverLang]}`}
      </a>
      {/if}
    {/each}
  {/if}
</SeoBox>

<!-- [🐞] -->
<!-- <FixturesLoader /> -->

{#await widgetInit()}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <FixturesLoader />
{:then widgetData}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is fulfilled                                          │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <FixturesMain
    WIDGET_DATA={widgetData}
  />
{:catch error}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is rejected                                           │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <WidgetNoData
    WIDGET_TITLE={'TESTING'}
    NO_DATA_TITLE={'TESTING'}
    NO_DATA_DESC={'TESTING'}
    version={2}
  />
{/await}
