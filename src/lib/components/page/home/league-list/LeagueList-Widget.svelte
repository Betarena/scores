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
  import LeagueListLoader from './LeagueList-Loader.svelte';
  import LeagueListMain from './LeagueList-Main.svelte';

	import type { B_LEGL_D, B_LEGL_T } from '@betarena/scores-lib/types/league-list.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  // let WIDGET_S_DATA: B_FEATM_S = $page.data?.B_FEATM_S;
  let WIDGET_T_DATA: B_LEGL_T = $page.data?.LEAGUE_LIST_WIDGET_DATA_SEO;
  let WIDGET_DATA: B_LEGL_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  // $: PAGE_DATA = $page.data?.PAGE_DATA
  // $: WIDGET_S_DATA = $page.data?.B_FEATM_S;
  $: WIDGET_T_DATA = $page.data?.LEAGUE_LIST_WIDGET_DATA_SEO;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.translations?.widget_title || 'League List' : 'League List';

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
  ): Promise < B_LEGL_D >
  {
		await sleep(3000);

    const response: B_LEGL_D = await get
    (
			`api/data/home/league-list?geoPos=${$userBetarenaSettings.country_bookmaker}`
		);

    WIDGET_DATA = response

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

  <h2>{WIDGET_TITLE}</h2>
  <p>{WIDGET_T_DATA?.translations?.top_leagues}</p>
  <p>{WIDGET_T_DATA?.translations?.leagues_by_country}</p>

  <!--
  LEAGUES FROM ALL GEO-POSITIONS
  -->
  {#each WIDGET_T_DATA?.all_leagues_list ?? [] as league}
    <a
      href={league?.urls?.[WIDGET_T_DATA?.lang]}
    >
      {league?.league_name}
    </a>
  {/each}

  <!--
  COUNTRY ALL UNQIUE
  -->
  {#each WIDGET_T_DATA?.unique_county_list ?? [] as country}
    <p>{country?.country_name}</p>
  {/each}

</SeoBox>

<!-- [🐞] -->
<!-- <LeagueListLoader /> -->

<!--
MAIN WIDGET LOGIC
-->
{#await widgetInit()}

  <LeagueListLoader />

{:then data}

  {#if !NO_WIDGET_DATA}

    <LeagueListMain
      B_LEGL_D={WIDGET_DATA}
      B_LEGL_T={WIDGET_T_DATA}
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