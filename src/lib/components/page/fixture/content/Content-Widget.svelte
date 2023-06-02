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
	import ContentLoader from './Content-Loader.svelte';
	import ContentMain from './Content-Main.svelte';

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
      dlog(`${CO_W_F_TAG} ❌ no data available!`, CO_W_F_TOG, CO_W_F_STY);
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
  [ℹ] widget-title -->
  <h2>
    {FIXTURE_CONTENT_TRANSLATION?.news_and_views}
  </h2>
  <!-- 
    [ℹ] widget-contents list -->
  {#each FIXTURE_CONTENT as item}
    <a href={item.link}>{item.link}</a>
    <h3>{item.title}</h3>
    <p>{item.excerpt}</p>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <ContentLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <ContentLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <ContentMain 
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