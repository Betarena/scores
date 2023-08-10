<!-- ===============
COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';

	import type { B_SEB_DT } from '@betarena/scores-lib/types/seo-block.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	export let
    B_SEB_DT: B_SEB_DT
  ;

  let
    noWidgetData: unknown = false
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div>

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={B_SEB_DT.title}
      NO_DATA_TITLE={"No SEO Block Available"}
      NO_DATA_DESC={"Sorry, at this time there is no SEO data available!"}
    />
	{/if}

  <!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={B_SEB_DT?.title}
    />

    <div
      id="seo-block-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      {@html B_SEB_DT.html}
    </div>

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	#seo-block-widget-container
  {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		overflow: hidden;
		padding: 20px;
	}
	:global(
    #seo-block-widget-container	h1,
    #seo-block-widget-container	h2,
    #seo-block-widget-container h3
  )
  {
		margin-top: 0;
	}
	:global(#seo-block-widget-container a)
  {
		color: #f5620f !important;
		width: fit-content !important;
		margin: 0;
		display: initial;
	}
	:global(#seo-block-widget-container p)
  {
		margin-bottom: 24px;
		color: #8c8c8c;
	}

	/*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 767px)
  {

		#seo-block-widget-container
    {
			min-width: 100%;
		}

	}

	@media only screen
  and (min-width: 1024px)
  {

		#seo-block-widget-container
    {
			min-width: 100%;
		}

	}

	/*
  =============
  🌒 DARK-THEME
  =============
  */

	:global(
    #seo-block-widget-container.dark-background-1	h1,
    #seo-block-widget-container.dark-background-1	h2,
    #seo-block-widget-container.dark-background-1	h3
  )
  {
		color: #ffffff !important;
	}

	:global(
    #seo-block-widget-container.dark-background-1	p
  )
  {
		color: #a8a8a8 !important;
	}

</style>
