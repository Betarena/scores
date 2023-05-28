<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
  import { platfrom_lang_ssr, sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import LineupsLoader from './Lineups-Loader.svelte';
	import LineupsMain from './Lineups-Main.svelte';
  
	import { LI_W_F_STY, LI_W_F_TAG, LI_W_F_TOG, dlog } from '$lib/utils/debug.js';
	import type { B_LIN_D, B_LIN_T } from '@betarena/scores-lib/types/lineups.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_LIN_D = $page.data?.FIXTURE_LINEUPS
  let WIDGET_T_DATA: B_LIN_T = $page.data?.FIXTURE_LINEUPS_TRANSLATION
  let WIDGET_DATA: B_LIN_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.FIXTURE_LINEUPS
  $: WIDGET_T_DATA = $page.data?.FIXTURE_LINEUPS_TRANSLATION
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'About The Player' : 'About The Player'

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
  ): Promise < B_LIN_D > 
  {
		await sleep(3000);
    
    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0) 
    {
      dlog(`${LI_W_F_TAG} ❌ no data available!`, LI_W_F_TOG, LI_W_F_STY);
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: serverSideLang = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  $: if (browser && serverSideLang)
  {
    widgetInit()
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

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
  <h2>{WIDGET_T_DATA?.title}</h2>
  <!--
  home-team 
  home full team (lineup) + (bench) 
  -->
  <p>{WIDGET_S_DATA?.home?.team_name}</p>
  {#each WIDGET_S_DATA?.home?.lineup || [] as player}
    <p>{player?.player_name}</p>
  {/each}
  {#each WIDGET_S_DATA?.home?.bench || [] as player}
    <p>{player?.player_name}</p>
  {/each}
  <!--
  away-team
  away full team (lineup) + (bench) 
  -->
  <p>{WIDGET_S_DATA?.away?.team_name}</p>
  {#each WIDGET_S_DATA?.away?.lineup || [] as player}
    <p>{player?.player_name}</p>
  {/each}
  {#each WIDGET_S_DATA?.away?.bench || [] as player}
    <p>{player?.player_name}</p>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <LineupsLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <LineupsLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <LineupsMain 
      FIXTURE_LINEUPS={WIDGET_DATA}
      FIXTURE_LINEUPS_TRANSLATION={WIDGET_T_DATA}
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