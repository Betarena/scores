<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
  import { get } from '$lib/api/utils';
  import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import SeoLoader from './Seo-Loader.svelte';
	import SeoMain from './Seo-Main.svelte';
  
	import { browser } from '$app/environment';
	import type { B_PSEO_D, B_PSEO_T } from '@betarena/scores-lib/types/player-seo.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_PSEO_D = $page.data?.B_PSEO_D
  let WIDGET_T_DATA: B_PSEO_T = $page.data?.B_PSEO_T
  let WIDGET_DATA: B_PSEO_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.B_PTEAM_D
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'About The Player' : 'About The Player'

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit
  (
  ): Promise < B_PSEO_D > 
  {
    
    WIDGET_DATA = await get
    (
      `/api/data/players/seo/?player_id=${PAGE_DATA?.data?.player_id}&lang=${serverSideLang}`
    ) as B_PSEO_D;

    const if_0 =
      WIDGET_DATA == undefined
      || WIDGET_DATA?.seo?.[serverSideLang] == undefined
    ;
		if (if_0) 
    {
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

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

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
  <h2>
    {WIDGET_TITLE}
  </h2>
  <div>
    {@html WIDGET_S_DATA?.seo?.[serverSideLang]}
  </div>
</SeoBox>

<!-- [🐞] -->
<!-- <SeoLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <SeoLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <SeoMain 
      {WIDGET_DATA}
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