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

  import { get } from '$lib/api/utils';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import TeamLoader from './Team-Loader.svelte';
	import TeamMain from './Team-Main.svelte';

	import type { B_PTEAM_D, B_PTEAM_T } from '@betarena/scores-lib/types/player-team.js';
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

  $: PAGE_DATA = $page.data.PAGE_DATA as B_SAP_PP_D | null | undefined;
  $: WIDGET_S_DATA = $page.data.B_PTEAM_D as B_PTEAM_D | null | undefined;
  $: WIDGET_T_DATA = $page.data.B_PTEAM_T as B_PTEAM_T | null | undefined;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA.widget_title || 'Current Team' : 'Current Team'

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
  ): Promise < B_PTEAM_D >
  {
    // IMPORTANT
    if (!browser) return;

    return await get
    (
      `/api/data/players/team/?player_id=${PAGE_DATA?.data?.player_id}`
    )!;
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
  <p>
    {WIDGET_S_DATA?.data?.team_name}
  </p>
</SeoBox>

<!-- [🐞] -->
<!-- <TeamLoader /> -->

{#await widgetInit()}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <TeamLoader />
{:then widgetData}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is fulfilled                                          │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <TeamMain
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
