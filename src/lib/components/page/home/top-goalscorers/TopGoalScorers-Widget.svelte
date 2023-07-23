<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import { get } from '$lib/api/utils.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import TopGoalScorersLoader from './TopGoalScorers-Loader.svelte';
	import TopGoalScorersMain from './TopGoalScorers-Main.svelte';

	import type { B_TGOL_D, B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_TGOL_S = $page.data?.B_TGOL_S;
  let WIDGET_T_DATA: B_TGOL_T = $page.data?.B_TGOL_T;
  let WIDGET_DATA: B_TGOL_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  // $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.B_TGOL_S;
  $: WIDGET_T_DATA = $page.data?.B_TGOL_T;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.widget_translations?.best_goal_scorers || 'Best Goalscorers' : 'Best Goalscorers'

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
  ): Promise < void >
  {
		await sleep(3000);

    const response: B_TGOL_D = await get
    (
			'api/data/home/top-goalscorers?geoPos=' +
      $userBetarenaSettings.country_bookmaker
		);

    WIDGET_DATA = response

    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
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
  <h2>
    {WIDGET_TITLE}
  </h2>
  <p>
    {
      WIDGET_T_DATA
      ?.widget_translations
      ?.goals
    }
  </p>
  <p>
    {
      WIDGET_T_DATA
      ?.widget_translations
      ?.odds
    }
  </p>
  <p>
    {
      WIDGET_T_DATA
      ?.widget_translations
      ?.player
    }
  </p>
  <p>
    {
      WIDGET_T_DATA
      ?.widget_translations
      ?.show_more_players
    }
  </p>
  <!--
  LIST PLAYERS
  -->
  {#each WIDGET_S_DATA?.players || [] as player}
    <a href={player?.url}>
      <p>{player?.common_name}</p>
    </a>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <FeatBetSiteLoader /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <TopGoalScorersLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  <TopGoalScorersMain
    B_TGOL_D={WIDGET_DATA}
    B_TGOL_T={WIDGET_T_DATA}
  />
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