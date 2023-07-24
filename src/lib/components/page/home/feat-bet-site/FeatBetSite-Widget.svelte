<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import FeatBetSiteLoader from './FeatBetSite-Loader.svelte';
	import FeatBetSiteMain from './FeatBetSite-Main.svelte';

	import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  // let WIDGET_S_DATA: B_ST_D = $page.data?.FIXTURE_STATISTICS
  let WIDGET_T_DATA: B_FEATB_T = $page.data?.FEATURED_BETTING_SITES_WIDGET_DATA_SEO
  // let WIDGET_DATA: B_ST_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  // $: PAGE_DATA = $page.data?.PAGE_DATA
  // $: WIDGET_S_DATA = $page.data?.FIXTURE_STATISTICS
  $: WIDGET_T_DATA = $page.data?.FEATURED_BETTING_SITES_WIDGET_DATA_SEO
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.translations?.widget_title || 'Featured Betting Site' : 'Featured Betting Site'

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
  <div>
		<h2>
			{WIDGET_T_DATA?.translations?.widget_title}
		</h2>
		<p>
			{WIDGET_T_DATA?.translations?.title}
		</p>
	</div>
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
  <FeatBetSiteLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  <FeatBetSiteMain
    B_FEATB_T={WIDGET_T_DATA}
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