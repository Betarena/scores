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
	import VotesLoader from './Votes-Loader.svelte';
	import VotesMain from './Votes-Main.svelte';
  
	import type { B_INC_D } from '@betarena/scores-lib/types/incidents.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_VOT_D, B_VOT_T } from '@betarena/scores-lib/types/votes.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let FIXTURE_INFO: B_SAP_FP_D = $page.data?.FIXTURE_INFO;
  let WIDGET_S_DATA: B_VOT_D = $page.data?.B_VOT_D;
  let WIDGET_T_DATA: B_VOT_T = $page.data?.B_VOT_T;
  let WIDGET_DATA: B_VOT_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: FIXTURE_INFO = $page.data?.FIXTURE_INFO;
  $: WIDGET_S_DATA = $page.data?.B_VOT_D;
  $: WIDGET_T_DATA = $page.data?.B_VOT_T;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.widget_title || 'Statistics' : 'Statistics';

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
      {FIXTURE_INFO}
      FIXTURE_VOTES_DATA={WIDGET_DATA}
      B_VOT_T={WIDGET_T_DATA}
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