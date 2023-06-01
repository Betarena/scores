<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
  import { sessionStore } from '$lib/store/session.js';
  import { STS_W_F_STY, STS_W_F_TAG, STS_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	  
	import type { B_INC_D } from '@betarena/scores-lib/types/incidents.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';
	import Head2HeadLoader from './Head2Head-Loader.svelte';
	import Head2HeadMain from './Head2Head-Main.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let PAGE_DATA: B_SAP_PP_D = ./Head2Head-Stats-Box.svelte
  let WIDGET_S_DATA: B_ST./Head2Head-Loader.svelteATISTICS
  let WIDGET_T_DATA: B_ST_T = $page.data?.FIXTURE_STATISTICS_TRANSLATION
  let WIDGET_DATA: B_ST_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.FIXTURE_STATISTICS
  $: WIDGET_T_DATA = $page.data?.FIXTURE_STATISTICS_TRANSLATION
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'Statistics' : 'Statistics'

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

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
  ): Promise < B_INC_D > 
  {
		await sleep(3000);
    
    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0) 
    {
      dlog(`${STS_W_F_TAG} ❌ no data available!`, STS_W_F_TOG, STS_W_F_STY);
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  async function widget_init(): Promise<void> 
  {

    if (!$userBetarenaSettings.country_bookmaker) {
      return;
    }
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    SPORTBOOK_INFO = await get("/api/cache/tournaments/sportbook?geoPos="+userGeo) as Cache_Single_SportbookDetails_Data_Response;
    SPORTBOOK_DETAILS_LIST = await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo) as Cache_Single_SportbookDetails_Data_Response[];

    loaded = true;
    const responses_invalid =
      FIXTURE_H2H == undefined 
      || FIXTURE_H2H?.teams_data == undefined 
      || FIXTURE_H2H?.teams_data == undefined 
      || FIXTURE_H2H?.teams_data == undefined
      || SPORTBOOK_INFO == undefined 
      || SPORTBOOK_DETAILS_LIST == undefined
    ;
    // [ℹ] data validation check [#1]
    if (responses_invalid) {
      dlog(`${H2H_W_F_TAG} ❌ no data available!`, H2H_W_F_TOG, H2H_W_F_STY);
      no_widget_data = true;
      return;
    } else {
      no_widget_data = false;
    }

    // ----------------
    // [ℹ] data pre-processing
    // ----------------

    SPORTBOOK_DETAILS_LIST.sort(
      (a, b) =>
        parseInt(a.position) -
        parseInt(b.position)
    );

    // [ℹ] calcuate (%) of 5 matches
    if (
      FIXTURE_H2H?.teams_data.find(
        ({ team_name }) =>
          team_name ==
          FIXTURE_INFO?.data?.home_team_name
      ).team_id >
      FIXTURE_H2H?.teams_data.find(
        ({ team_name }) =>
          team_name ==
          FIXTURE_INFO?.data?.away_team_name
      ).team_id
    ) {
      team1Percent =
        (FIXTURE_H2H?.data?.wins_draws?.team_2 /
          5) *
        100;
      team2Percent =
        (FIXTURE_H2H?.data?.wins_draws?.team_1 /
          5) *
        100;
    } else {
      team1Percent =
        (FIXTURE_H2H?.data?.wins_draws?.team_1 /
          5) *
        100;
      team2Percent =
        (FIXTURE_H2H?.data?.wins_draws?.team_2 /
          5) *
        100;
    }

    FIXTURE_PROB_DATA = {};

    // [ℹ] regardless of STATUS,
    // [ℹ] VOTE_DATA is shown until it is erased from "/odds"
    const fixture_time = FIXTURE_INFO.data.fixture_time;
    const fixture_id = FIXTURE_INFO?.data?.id;
    const firebase_odds = await getOdds_2
    (
      fixture_time,
      fixture_id
    );
    if (firebase_odds && firebase_odds?.length != 0) {
      check_fixture_odds_inject(firebase_odds);
    }

    return;
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description 
   * listens to target "language" change;
  */
  $: if_R_0 =
    browser 
    && $sessionStore?.serverLang != undefined
  ;
  $: if (if_R_0)
  {
    widgetInit()
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<SeoBox>
  {#if FIXTURE_H2H != undefined}
    <!-- 
    [ℹ] team-names
    -->
    {#each FIXTURE_H2H?.teams_data as item}
      <p>{item?.team_name}</p>
    {/each}
    <!-- 
    [ℹ] league-names [from-fixtures]
    -->
    {#each FIXTURE_H2H?.data?.last_5_data as item}
      <p>{item?.league?.data?.name}</p>
    {/each}
  {/if}
</SeoBox>

<!-- [🐞] -->
<!-- <Head2HeadLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <Head2HeadLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <Head2HeadMain 
      FIXTURE_STATISTICS={WIDGET_DATA}
      FIXTURE_STATISTICS_TRANSLATION={WIDGET_T_DATA}
    />
  {/if}
{:catch error}
  <!-- 
  promise was rejected 
  -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
  }

  /*
  =============
  DARK-THEME
  =============
  */

</style>