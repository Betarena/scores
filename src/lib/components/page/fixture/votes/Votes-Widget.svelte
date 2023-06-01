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
	import VotesLoader from './Votes-Loader.svelte';
	import VotesMain from './Votes-Main.svelte';
  
	import type { B_INC_D } from '@betarena/scores-lib/types/incidents.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_ST_D = $page.data?.FIXTURE_STATISTICS
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
		// [ℹ] [DEFAULT] [DISABLED] when ALL data PRE-LOADED (buffer)
		// const sleep = ms => new Promise(r => setTimeout(r, ms));
		// await sleep(3000);
    if (!$userBetarenaSettings.country_bookmaker) {
      return;
    }
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

		// [ℹ] execute GRAPH-QL request;
		const VARIABLES = {
			match_id: FIXTURE_INFO?.data?.id,
			fixture_id: FIXTURE_INFO?.data?.id
		};
		const response: BETARENA_HASURA_votes_query =
			await initGrapQLClient().request(
				HASURA_FIXTURE_VOTES_DATA_0,
				VARIABLES
			);

    SPORTBOOK_INFO = await get("/api/cache/tournaments/sportbook?geoPos="+userGeo) as Cache_Single_SportbookDetails_Data_Response;
    SPORTBOOK_DETAILS_LIST = await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo) as Cache_Single_SportbookDetails_Data_Response[];

		loaded = true;

		const responses_invalid =
			response == undefined ||
			SPORTBOOK_INFO == undefined ||
			SPORTBOOK_DETAILS_LIST == undefined;
      
		// [ℹ] data validation check [#1]
		if (responses_invalid) {
      dlog(`${VO_W_F_TAG} ❌ no data available!`, VO_W_F_TOG, VO_W_F_STY);
			no_widget_data = true;
			return;
		} else {
			no_widget_data = false;
		}

		// ~~~~~~~~~~~~~~~~
		// [ℹ] data pre-processing

		const HIST_FIXTURE_DATA =
			response.historic_fixtures[0];

		// [ℹ] data validation check [#2]
		const validation_check =
			response.widget_featured_match_votes
				.length == 0 &&
			FIXTURE_NO_VOTES_OPT.includes(
				HIST_FIXTURE_DATA?.status_j
			);
		no_widget_data =
			validation_check == true ? true : false;
		if (no_widget_data) {
			return;
		}

		SPORTBOOK_INFO = SPORTBOOK_INFO;
		SPORTBOOK_DETAILS_LIST =
    SPORTBOOK_DETAILS_LIST;
		SPORTBOOK_DETAILS_LIST.sort(
			(a, b) =>
				parseInt(a.position) -
				parseInt(b.position)
		);

		FIXTURE_VOTES_DATA = {
			time: undefined,
			match_votes: undefined,
			probabilities: undefined,
			_1x2: undefined
		};

		FIXTURE_VOTES_DATA.time =
			HIST_FIXTURE_DATA?.time;
		FIXTURE_VOTES_DATA.status =
			HIST_FIXTURE_DATA?.status_j;
		FIXTURE_VOTES_DATA.match_votes =
			response.widget_featured_match_votes[0];
		FIXTURE_VOTES_DATA.probabilities =
			HIST_FIXTURE_DATA?.probabilities;
		FIXTURE_VOTES_DATA._1x2 = undefined; // NOTE: populated from FIREBASE, if exist & "live"
		FIXTURE_VOTES_DATA._1x2 = {
			home: undefined,
			away: undefined,
			draw: undefined
		};
		FIXTURE_VOTES_DATA.away_team_logo =
			HIST_FIXTURE_DATA?.away_team_logo;
		FIXTURE_VOTES_DATA.home_team_logo =
			HIST_FIXTURE_DATA?.home_team_logo;

		getImageBgColor(
			SPORTBOOK_INFO?.image,
			imageVar
		);

		total_votes =
			FIXTURE_VOTES_DATA?.match_votes == undefined
				? 0
				: FIXTURE_VOTES_DATA?.match_votes
						?.vote_draw_x +
				  FIXTURE_VOTES_DATA?.match_votes
						?.vote_win_local +
				  FIXTURE_VOTES_DATA?.match_votes
						?.vote_win_visitor;

		// [ℹ] regardless of STATUS,
		// [ℹ] VOTE_DATA is shown until it is erased from "/odds"
		const fixture_time = HIST_FIXTURE_DATA?.time;
		const fixture_id = FIXTURE_INFO?.data?.id;
		const firebase_odds = await getOdds_2
    (
			fixture_time,
			fixture_id
		);
		if (firebase_odds.length != 0) {
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
  <!-- 
  widget-title 
  -->
  <h2>
    {WIDGET_TITLE}
  </h2>
</SeoBox>

<!-- [🐞] -->
<!-- <VotesLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <VotesLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <VotesMain 
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