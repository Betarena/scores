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
	import { onMount } from 'svelte';
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // <-imports-go-here->
	import { viewport_change } from '$lib/utils/platform-functions';
  // 
	import { get } from '$lib/api/utils';
  //#endregion ➤ Project Custom Imports

  //#region ➤ [PLUGIN] Firebase Imports
  // <-imports-go-here->
  //#endregion ➤ [PLUGIN] Firebase Imports

  //#region ➤ Types Imports
  // <-imports-go-here->
	import type { B_PFIX_D } from '@betarena/scores-lib/types/player-fixtures';
//#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // <-imports-go-here->
  // import profile_avatar from './assets/profile-avatar.svg';
  //#endregion ➤ Assets Imports

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import FixturesLoader from './Fixtures-Loader.svelte';
	import FixturesMain from './Fixtures-Main.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  // $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA

  // let WIDGET_S_DATA: any = $page.data?.LIVESCORES_V2_SEO
  // $: WIDGET_S_DATA = $page.data?.LIVESCORES_V2_SEO

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
    WIDGET_DATA = await get(`/api/hasura/player/fixtures/?player_id=580&limit=10&offset=0`) as B_PFIX_D;
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

  /* #region ❌ [NOT WORKING] w/ regions */
  div#example {
    color: var(--dark-theme);
  } div#example > div#target {
  }
  /* #endregion ❌ [NOT WORKING] w/ regions */

  div#example {
    color: var(--dark-theme);
  } div#example > div#target {
  }

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