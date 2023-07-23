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
  import { IN_W_F_STY, IN_W_F_TAG, IN_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import FeatMatchLoader from './FeatMatch-Loader.svelte';
  import FeatMatchMain from './FeatMatch-Main.svelte';

	import type { B_FEATM_D, B_FEATM_S, B_FEATM_T } from '@betarena/scores-lib/types/feat-match.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_FEATM_S = $page.data?.B_FEATM_S;
  let WIDGET_T_DATA: B_FEATM_T = $page.data?.B_FEATM_T;
  let WIDGET_DATA: B_FEATM_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  // $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.B_FEATM_S;
  $: WIDGET_T_DATA = $page.data?.B_FEATM_T;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'Incidents' : 'Incidents'

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
  ): Promise < B_FEATM_D >
  {
		await sleep(3000);

    const response: B_FEATM_D = await get
    (
			'api/data/home/feat-match?geoPos=' +
      $userBetarenaSettings.country_bookmaker
		);

    WIDGET_DATA = response

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0)
    {
      dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
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
  <!--
  widget-title
  -->
  <h2>
    {WIDGET_TITLE}
  </h2>
  <!--
  team-names
  -->
  <p>{WIDGET_S_DATA?.home_team_name}</p>
  <p>{WIDGET_S_DATA?.away_team_name}</p>
  <!--
  LINKS
  -->
  <a
    href={WIDGET_S_DATA?.league_url}>
    <p>
      {WIDGET_S_DATA?.league_name}
    </p>
  </a>
  <a
    href={WIDGET_S_DATA?.fixture_url}>
    <p>
      {WIDGET_S_DATA?.home_team_name}
      vs.
      {WIDGET_S_DATA?.away_team_name}
    </p>
  </a>
  {#each WIDGET_S_DATA?.player_urls || [] as player}
    <a
      href={player?.url}>
      <p>
        {player?.common_name}
      </p>
    </a>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <FeaturedMatchContentLoading /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <FeatMatchLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <FeatMatchMain
      B_FEATM_D={WIDGET_DATA}
      B_FEATB_T={WIDGET_T_DATA}
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