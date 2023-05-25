<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->
	
  import { page } from '$app/stores';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  import { onMount } from 'svelte';
  
	import WidgetTitle from '$lib/components/Widget-Title.svelte';

	import type { B_PSEO_D, B_PSEO_T } from '@betarena/scores-lib/types/player-seo.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PSEO_D

  let WIDGET_T_DATA: B_PSEO_T = $page.data?.B_PSEO_T

  $: WIDGET_T_DATA = $page.data?.B_PSEO_T
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'About The Player' : 'About The Player'

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1024;
	const MOBILE_VIEW = 475;
	const OTHER_VIEW = 1900;
  let tabletExclusive: boolean = false;
	let mobileExclusive: boolean = false;
  let largeDesktop: boolean = false;

	onMount
  (
    async () => 
    {
      [
        tabletExclusive, 
        mobileExclusive,
        largeDesktop
      ] = viewport_change
      (
        TABLET_VIEW, 
        MOBILE_VIEW,
        OTHER_VIEW
      );
      window.addEventListener
      (
        'resize',
        function () {
          [
            tabletExclusive, 
            mobileExclusive,
            largeDesktop
          ] =
          viewport_change
          (
            TABLET_VIEW,
            MOBILE_VIEW,
            OTHER_VIEW
          );
        }
      );
	  }
  );

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

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

<!-- 
[ℹ] example comment
-->
<div>

  <WidgetTitle
    {WIDGET_TITLE}
  />
  
  <div
    id="pseo-main"
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    {@html WIDGET_DATA?.seo?.[server_side_language]}

  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* o */
  div.widget-component 
  {
    overflow: unset;
    padding: 20px;
  }

  /* widget injected HTML style override */
	:global(#pseo-main a) 
  {
		color: #f5620f !important;
		width: fit-content !important;
		margin: 0;
		display: initial;
	}
	:global(#pseo-main section) 
  {
		padding: 0 !important;
		padding-bottom: 0 !important;
		min-height: fit-content;
	}
	:global(#pseo-main section div:first-child) 
  {
		border: 1px solid #e6e6e6;
		border-radius: 12px 12px 0 0 !important;
	}
	:global(#pseo-main section > div) 
  {
		border: 1px solid #e6e6e6;
		padding: 20px;
	}
	:global(#pseo-main section > div > h4) 
  {
		margin: 0 !important;
		margin-bottom: 8px;
	}
	:global(#pseo-main section div.faq-body) 
  {
		border: none !important;
	}
	:global(#pseo-main section hr) 
  {
		display: none;
	}
	:global(#pseo-main section div:last-child) 
  {
		border: 1px solid #e6e6e6;
		border-radius: 0 0 12px 12px !important;
	}
	:global(#pseo-main h3) 
  {
		font-size: 20px;
	}
	:global(#pseo-main h4, #pseo-main p) 
  {
		font-size: 16px;
	}
	:global(#pseo-main section div.faq-body) 
  {
		font-size: 14px;
	}
	:global(
    #pseo-main h1, 
    #pseo-main h2, 
    #pseo-main h3,
    #pseo-main h4) 
  {
		color: #292929 !important;
	}
	:global(#pseo-main p, 
    #pseo-main section div.faq-body
  ) {
		color: #8c8c8c !important;
	}
	:global(#pseo-main h3) 
  {
		margin: 20px 0 12px 0;
	}
	:global(#pseo-main section > div) 
  {
		border: 1px solid #e6e6e6 !important;
	}

	:global(#pseo-main p) 
  {
		margin-bottom: 14px;
	}

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 475px) 
  {
  }

  @media only screen 
    and (min-width: 768px) 
  {
  }

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) 
  {
  }

  /*
  =============
  DARK-THEME
  =============
  */

  :global(
    #pseo-main.dark-background-1	h1, 
    #pseo-main.dark-background-1 h2, 
    #pseo-main.dark-background-1 h3, 
    #pseo-main.dark-background-1	h4
  ) {
		color: #ffffff !important;
	}
	:global(#pseo-main.dark-background-1 p) {
		color: #a8a8a8 !important;
	}

</style>