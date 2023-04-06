<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { get } from '$lib/api/utils';
	import { viewport_change } from '$lib/utils/platform-functions';
	import type { B_PPRO_D } from '@betarena/scores-lib/types/player-profile';
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import SeoBox from '$lib/components/SEO-Box.svelte';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import ProfileLoader from './Profile-Loader.svelte';
	import ProfileMain from './Profile-Main.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  $: PAGE_DATA = $page.data?.PAGE_DATA

  // let WIDGET_S_DATA: any = $page.data?.LIVESCORES_V2_SEO
  // $: WIDGET_S_DATA = $page.data?.LIVESCORES_V2_SEO

  let WIDGET_DATA: B_PPRO_D
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)
  
  console.log($page.data)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(
    // empty
  ): Promise < B_PPRO_D > {
    // [ℹ] get widget data (from cache)
    WIDGET_DATA = await get(`/api/hasura/player/profile/?player_id=${PAGE_DATA?.data?.player_id}`) as B_PPRO_D;
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
  player name
  -->
  <h1>
    {PAGE_DATA?.data?.player_name}
  </h1>
</SeoBox>

<!-- <ProfileLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <ProfileLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  <ProfileMain 
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