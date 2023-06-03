<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->
<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
  
	import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_ABOUT: B_ABT_D;
	export let FIXTURE_ABOUT_TRANSLATION: B_ABT_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

	let noWidgetData: any = false;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  )
  {
    [
      tabletExclusive, 
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  )
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function () 
      {
				resizeAction();
			}
		);
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() => 
    {
      resizeAction();
      addEventListeners();
    }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div 
  id="widget-outer">

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData 
      WIDGET_TITLE={FIXTURE_ABOUT_TRANSLATION?.title}
      NO_DATA_TITLE={FIXTURE_ABOUT_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_ABOUT_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_ABOUT_TRANSLATION?.title}
    />

    <!-- 
    📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
    -->

    <div
      id="about-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
    >

      <!--
      RENDER SEO DATA 
      -->
      {@html FIXTURE_ABOUT?.seo_data}
    </div>

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* 
  widget-main
  */
	div#about-widget-container 
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		padding: 20px;
	}

	/* 
  widget injected HTML style override 
  */
	:global(#about-widget-container a) 
  {
		color: #f5620f !important;
		width: fit-content !important;
		margin: 0;
		display: initial;
	}
	:global(#about-widget-container section) 
  {
		padding: 0 !important;
		padding-bottom: 0 !important;
		min-height: fit-content;
	}
	:global(#about-widget-container section	div:first-child) 
  {
		border: 1px solid #e6e6e6;
		border-radius: 12px 12px 0 0 !important;
	}
	:global(#about-widget-container section > div) 
  {
		border: 1px solid #e6e6e6;
		padding: 20px;
	}
	:global(#about-widget-container section > div	> h4) 
  {
		margin: 0 !important;
		margin-bottom: 8px;
	}
	:global(#about-widget-container	section div.faq-body) 
  {
		border: none !important;
	}
	:global(#about-widget-container section hr) 
  {
		display: none;
	}
	:global(#about-widget-container section	div:last-child) 
  {
		border: 1px solid #e6e6e6;
		border-radius: 0 0 12px 12px !important;
	}
	:global(#about-widget-container h3) 
  {
		font-size: 20px;
	}
	:global(
    #about-widget-container	h4, 
    #about-widget-container p) 
  {
		font-size: 16px;
	}
	:global(#about-widget-container	section	div.faq-body) 
  {
		font-size: 14px;
	}
	:global(#about-widget-container	h1, 
    #about-widget-container	h2, 
    #about-widget-container	h3, 
    #about-widget-container h4) 
  {
		color: #292929 !important;
	}
	:global(#about-widget-container	p, 
    #about-widget-container	section	div.faq-body) 
  {
		color: #8c8c8c !important;
	}
	:global(#about-widget-container h3) 
  {
		margin: 20px 0 12px 0;
	}
	:global(#about-widget-container section > div)
  {
		border: 1px solid #e6e6e6 !important;
	}

	:global(#about-widget-container p) 
  {
		margin-bottom: 14px;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (min-width: 726px) 
  and (max-width: 1000px) 
  {
		#about-widget-container 
    {
			min-width: 100%;
		}
	}

	@media only screen 
  and (min-width: 726px) 
  {
	}

	@media only screen 
  and (min-width: 1000px) 
  {
    #about-widget-container 
    {
			min-width: 100%;
		}
	}

	@media only screen 
  and (min-width: 1160px) 
  {
		/* EMPTY */
	}

	/*
  =============
  DARK-THEME
  =============
  */

	:global(
    #about-widget-container.dark-background-1	h1, 
    #about-widget-container.dark-background-1	h2,
    #about-widget-container.dark-background-1 h3, 
    #about-widget-container.dark-background-1	h4)
  {
		color: #ffffff !important;
	}
	:global(#about-widget-container.dark-background-1	p, 
    #about-widget-container.dark-background-1	section	div.faq-body) 
  {
		color: #a8a8a8 !important;
	}
	:global(#about-widget-container.dark-background-1	section	> div) 
  {
		border: 1px solid #616161 !important;
	}
</style>
