<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { H2H_W_F_STY, H2H_W_F_TAG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import Head2HeadLoader from './Head2Head-Loader.svelte';
	import Head2HeadMain from './Head2Head-Main.svelte';

	import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
	import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
	import type { B_INC_D } from '@betarena/scores-lib/types/incidents.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let FIXTURE_INFO: B_SAP_FP_D = $page.data?.FIXTURE_INFO;
  let WIDGET_S_DATA: B_H2H_D = $page.data?.FIXTURE_H2H;
  let WIDGET_T_DATA: B_H2H_T = $page.data?.FIXTURE_H2H_TRANSLATION;
  let WIDGET_DATA: B_H2H_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

	let FIXTURES_ODDS_T: B_FO_T = $page.data?.FIXTURES_ODDS_T;

  $: FIXTURE_INFO = $page.data?.FIXTURE_INFO
  $: WIDGET_S_DATA = $page.data?.FIXTURE_H2H;
  $: WIDGET_T_DATA = $page.data?.FIXTURE_H2H_TRANSLATION;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.widget_title || 'Statistics' : 'Statistics'

  $: FIXTURES_ODDS_T = $page.data?.FIXTURES_ODDS_T

  $: deepReactListenPageChange = JSON.stringify($page?.url?.pathname);
  $: deepReactListenLangChng = JSON.stringify($sessionStore?.serverLang);

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
		// await sleep(3000);

    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
      || WIDGET_DATA?.teams_map == undefined
    ;
		if (if_0)
    {
      dlog(`${H2H_W_F_TAG} ❌ no data available!`, true, H2H_W_F_STY);
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
  ;
  $: if (if_R_0 && (deepReactListenLangChng || deepReactListenPageChange))
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
  [ℹ] team-names
  -->
  {#each WIDGET_S_DATA?.teams_data || [] as item}
    <p>{item?.team_name}</p>
  {/each}
  <!--
  [ℹ] league-names [from-fixtures]
  -->
  {#each WIDGET_S_DATA?.data?.last_5_data || [] as item}
    <p>{item?.league?.data?.name}</p>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <Head2HeadLoader /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <Head2HeadLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <Head2HeadMain
      FIXTURE_H2H={WIDGET_DATA}
      FIXTURE_H2H_TRANSLATION={WIDGET_T_DATA}
      {FIXTURE_INFO}
      {FIXTURES_ODDS_T}
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