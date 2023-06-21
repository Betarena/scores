<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import { sessionStore } from '$lib/store/session.js';
  import { VO_W_F_STY, VO_W_F_TAG, VO_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import LeagueInfoMain from './LeagueInfo-Main.svelte';

	import type { B_LEG_D } from '@betarena/scores-lib/types/league-info.js';
	import LeagueInfoLoader from './LeagueInfo-Loader.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let WIDGET_S_DATA: B_LEG_D = $page.data.LEAGUE_INFO_DATA;
  // let WIDGET_T_DATA: B_FO_T = $page.data?.FIXTURES_ODDS_T;
  let WIDGET_DATA: B_LEG_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: WIDGET_T_DATA = $page.data?.FIXTURES_ODDS_T;
  // $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.matches || 'Matches' : 'Matches';

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
  ): Promise < B_LEG_D >
  {
		await sleep(3000);

    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0)
    {
      dlog(`${VO_W_F_TAG} ❌ no data available!`, VO_W_F_TOG, VO_W_F_STY);
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
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
  <h1>{WIDGET_S_DATA.data.name}</h1>
  <p>{WIDGET_S_DATA.data.country}</p>
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
  <LeagueInfoLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <LeagueInfoMain
      LEAGUE_INFO_SEO_DATA={WIDGET_DATA}
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