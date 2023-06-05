<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
  import { sessionStore } from '$lib/store/session.js';
  import { ST_W_F_STY, ST_W_F_TAG, ST_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import StandingsLoader from './Standings-Loader.svelte';
	import StandingsMain from './Standings-Main.svelte';

	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let FIXTURE_INFO: B_SAP_FP_D = $page.data?.FIXTURE_INFO;
  let WIDGET_S_DATA: B_STA_D = $page.data?.STANDINGS_DATA;
  let WIDGET_T_DATA: B_STA_T = $page.data?.STANDINGS_T;
  let WIDGET_DATA: B_STA_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: FIXTURE_INFO = $page.data?.FIXTURE_INFO;
  $: WIDGET_S_DATA = $page.data?.STANDINGS_DATA;
  $: WIDGET_T_DATA = $page.data?.STANDINGS_T;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.translations?.standings || 'Standings' : 'Standings';

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
  ): Promise < B_STA_D > 
  {
		await sleep(3000);
    
    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
      || WIDGET_DATA?.comp_typ != 'domestic'
    ;
		if (if_0) 
    {
      dlog(`${ST_W_F_TAG} ❌ no data available!`, ST_W_F_TOG, ST_W_F_STY);
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
  <!-- 
  stage standings (regular)
  -->
  {#if !WIDGET_S_DATA?.seasons?.[0]?.standings?.[0]?.group_based}
    {#each WIDGET_S_DATA.seasons[0].standings[0].total || [] as team}
      <p>{team?.team_name}</p>
    {/each}
  <!-- 
  stage standings (groups)
  -->
  {:else}
    {#each WIDGET_S_DATA?.seasons?.[0]?.standings?.[0]?.group_standings || [] as group}
      <p>{group?.group_name}</p>
      {#each group?.total || [] as team}
        <p>{team?.team_name}</p>
      {/each}
    {/each}
  {/if}
</SeoBox>

<!-- [🐞] -->
<!-- <StandingsLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <StandingsLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <StandingsMain 
      {FIXTURE_INFO}
      STANDINGS_DATA={WIDGET_DATA}
      STANDINGS_T={WIDGET_T_DATA}
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