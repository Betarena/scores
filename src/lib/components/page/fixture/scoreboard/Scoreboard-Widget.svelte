<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { STS_W_F_STY, STS_W_F_TAG, STS_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import ScoreboardLoader from './Scoreboard-Loader.svelte';
	import ScoreboardMain from './Scoreboard-Main.svelte';

	import type { B_CONT_D } from '@betarena/scores-lib/types/content.js';
	import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
	import type { B_INC_D } from '@betarena/scores-lib/types/incidents.js';
	import type { B_FS_D, B_FS_T } from '@betarena/scores-lib/types/scoreboard.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let FIXTURE_INFO: B_SAP_FP_D = $page.data?.FIXTURE_INFO;
  let WIDGET_S_DATA: B_FS_D = $page.data?.FIXTURE_SCOREBOARD;
  let WIDGET_T_DATA: B_FS_T = $page.data?.FIXTURE_SCOREBOARD_TRANSLATION;
  let WIDGET_DATA: B_FS_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)
	let FIXTURE_CONTENT: B_CONT_D[] = $page.data?.FIXTURE_CONTENT;
	let FIXTURES_ODDS_T: B_FO_T = $page.data?.FIXTURES_ODDS_T;

  $: FIXTURE_INFO = $page.data?.FIXTURE_INFO
  $: WIDGET_S_DATA = $page.data?.FIXTURE_SCOREBOARD
  $: WIDGET_T_DATA = $page.data?.FIXTURE_SCOREBOARD_TRANSLATION
  $: FIXTURE_CONTENT = $page.data?.FIXTURE_CONTENT
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
		await sleep(3000);

    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0)
    {
      dlog(`${STS_W_F_TAG} ❌ no data available!`, STS_W_F_TOG, STS_W_F_STY);
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  //#endregion ➤ [METHODS]

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
  <p>{WIDGET_S_DATA?.away_team_name}</p>
  <p>{WIDGET_S_DATA?.home_team_name}</p>
  <a href={$page.url.href}>
    {$page.url.href}
  </a>
</SeoBox>

<!-- [🐞] -->
<!-- <ScoreboardLoader /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <ScoreboardLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <ScoreboardMain
      FIXTURE_SCOREBOARD={WIDGET_DATA}
      FIXTURE_SCOREBOARD_TRANSLATION={WIDGET_T_DATA}
      {FIXTURE_CONTENT}
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