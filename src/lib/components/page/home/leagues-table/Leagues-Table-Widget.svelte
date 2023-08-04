<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import { get } from '$lib/api/utils.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { IN_W_F_STY, IN_W_F_TAG, IN_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import LeaguesTableLoader from './Leagues-Table-Loader.svelte';
	import LeaguesTableMain from './Leagues-Table-Main.svelte';

	import type { B_LEGT_D, B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  let
    WIDGET_T_DATA: B_LEGT_T = $page.data?.LEAGUES_TABLE_SCORES_SEO_DATA,
    WIDGET_DATA: B_LEGT_D,
    NO_WIDGET_DATA: boolean = true
  ;

  $: WIDGET_T_DATA = $page.data?.LEAGUES_TABLE_SCORES_SEO_DATA;
  $: WIDGET_TITLE =
    WIDGET_T_DATA != undefined
      ? WIDGET_T_DATA?.translations?.title || 'Leagues Table'
      : 'Leagues Table'
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * [MAIN] [INIT]
   * @description
   * main widget data loader,
   * (and) try..catch (error) handler
   * (and) placeholder handler
   */
  async function widgetInit
  (
  ): Promise < B_LEGT_D >
  {
    if (!browser) return;

		// await sleep(3000);

    const response: B_LEGT_D = await get
    (
			`api/data/home/league-table?geoPos=${$userBetarenaSettings.country_bookmaker}`
		);

    WIDGET_DATA = response;

    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // [🐞]
      dlog
      (
        `${IN_W_F_TAG} ❌ no data available!`,
        IN_W_F_TOG,
        IN_W_F_STY
      );

			NO_WIDGET_DATA = true;

			return;
		}

    NO_WIDGET_DATA = false;

    return WIDGET_DATA
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<SeoBox>
  <h2>{WIDGET_T_DATA?.translations?.title}</h2>

  {#each WIDGET_T_DATA?.top_leagues_table_data ?? [] as item}
    <p>{item?.season_league_name}</p>

    {#each item?.season_league_teams ?? [] as itemL}
      <p>{itemL?.team_name}</p>
    {/each}

  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <LeaguesTableLoader /> -->

{#await widgetInit()}

  <LeaguesTableLoader />

{:then data}

  {#if !NO_WIDGET_DATA}
    <LeaguesTableMain
      B_LEGT_T={WIDGET_T_DATA}
      B_LEGT_D={WIDGET_DATA}
    />
  {/if}

{:catch error}
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

</style>