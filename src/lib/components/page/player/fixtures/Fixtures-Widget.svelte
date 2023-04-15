<!-- 
====================
This is an example .svelte
component file, to give guidance on
the structure that is employed across the project
and how it should be layed-out.
====================
<COPY-THIS-FILE-INTO-YOUR-NEXT-COMPONENT>
====================
<❗️ REMOVE (THIS) COMMENT IN PRODUCTION>
-->

<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

  //#region ➤ Svelte/SvelteKit Imports
  // <-imports-go-here->
	import { page } from '$app/stores';
	import { get } from '$lib/api/utils';
	import SeoBox from '$lib/components/SEO-Box.svelte';
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
	import type { B_PFIX_D, PFIX_C_Fixture, PFIX_C_League } from '@betarena/scores-lib/types/player-fixtures';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import { onMount } from 'svelte';
	import FixturesLoader from './Fixtures-Loader.svelte';
	import FixturesMain from './Fixtures-Main.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  $: PAGE_DATA = $page.data?.PAGE_DATA

  // let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  // $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA

  let WIDGET_S_DATA: B_PFIX_D = $page.data?.B_PFIX_D
  $: WIDGET_S_DATA = $page.data?.B_PFIX_D

  const fixtureMap: Map <string, PFIX_C_Fixture[]> = new Map(Object.entries(WIDGET_S_DATA?.data?.past_fixtures)) as Map <string, PFIX_C_Fixture[]>;
  const leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(WIDGET_S_DATA?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;


  let WIDGET_DATA: B_PFIX_D
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(
    // empty
  ): Promise < B_PFIX_D > {
    // [ℹ] get widget data (from cache)
    WIDGET_DATA = await get(`/api/data/players/fixtures/?player_id=${PAGE_DATA?.data?.player_id}&limit=10&offset=0`) as B_PFIX_D;
    const VALID_RESPONSE =
      WIDGET_DATA == undefined
    ;
		// [ℹ] validation [#1]
		if (VALID_RESPONSE) {
      // dlog(`${LV2_W_H_TAG[0]} ❌ no data available!`);
			NO_WIDGET_DATA = true;
			return;
		}
    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

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
  [] Fixture Links
  -->
  {#if fixtureMap.size != 0}
    {#each [...fixtureMap.entries()] as [, fixtures]}
      {#each fixtures as item}
        <a href={item?.urls[server_side_language]}>{item?.urls[server_side_language]}</a>
      {/each}
    {/each}
  {/if}
  <!-- 
  [] League Links
  -->
  {#if leagueMap.size != 0}
    {#each [...leagueMap.entries()] as [key, league]}
      <a href='https://scores.betarena.com/{league?.urls[server_side_language]}'>
        {`https://scores.betarena.com/${league?.urls[server_side_language]}`}
      </a>
    {/each}
  {/if}
</SeoBox>

<!-- <FixturesLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <FixturesLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  <FixturesMain 
    {WIDGET_DATA}
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