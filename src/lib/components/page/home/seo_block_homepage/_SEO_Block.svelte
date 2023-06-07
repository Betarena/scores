<!-- ===============
  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">

	import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from '$lib/models/home/seo_block/types';

	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog, SEO_W_H_STY, SEO_W_H_TAG, SEO_W_H_TOG } from '$lib/utils/debug';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import SeoBlockContentLoader from './_SEO_Block_ContentLoader.svelte';
  
	export let SEO_BLOCK_DATA: Cache_Single_Homepage_SEO_Block_Translation_Response;

	let loaded: boolean = false; // [ℹ] holds boolean for data loaded;
	let refresh: boolean = false;
	let refresh_data: unknown = undefined;
	let noSEOBlockData: unknown = false;

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... Intializer of the Widget Function
	 */
	async function widgetInit(): Promise<Cache_Single_Homepage_SEO_Block_Translation_Response> {
		const response: Cache_Single_Homepage_SEO_Block_Translation_Response =
			SEO_BLOCK_DATA;

		// [ℹ] ℹ if response is null;
		if (response == undefined) {
      dlog(`${SEO_W_H_TAG} ❌ no data available!`, SEO_W_H_TOG, SEO_W_H_STY);
			noSEOBlockData = true;
			return;
		}

		loaded = true;

		// [ℹ] ℹ return the FINAL Promise Value;
		return response;
	}

	// [ℹ] change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data =
		$userBetarenaSettings.country_bookmaker;
	$: if (refresh_data) {
		// [ℹ] reset necessary variables;
		refresh = true;
		setTimeout(async () => {
			refresh = false;
		}, 50);
	}
</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

<SeoBox>
  <!-- used, 
	{#if !loaded}
  -->
  <div>
    <h2>{SEO_BLOCK_DATA.title}</h2>
    {@html SEO_BLOCK_DATA.html}
  </div>
</SeoBox>

<div>

	<!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER 
  -->
	{#if noSEOBlockData && !loaded}
    <WidgetNoData 
      WIDGET_TITLE={SEO_BLOCK_DATA.title}
      NO_DATA_TITLE={"No SEO Block Available"}
      NO_DATA_DESC={"Sorry, at this time there is no SEO data available!"}
    />
	{/if}

	<!-- [ℹ] promise is pending 
  -->
	{#if !noSEOBlockData && !refresh}
		{#await widgetInit()}
			<SeoBlockContentLoader />

    <!-- 
    [ℹ] promise was fulfilled 
    -->
		{:then data}

      <WidgetTitle
        WIDGET_TITLE={SEO_BLOCK_DATA?.title}
      />

			<!-- 
      [ℹ] widget-component 
      -->
			<div
				id="seo-block-widget-container"
				class:dark-background-1={$userBetarenaSettings.theme ==
					'Dark'}
			>
				<!-- render SEO-DATA -->
				{@html SEO_BLOCK_DATA.html}
			</div>

			<!-- 
      [ℹ] promise was rejected 
      -->
		{:catch error}
			{error}
		{/await}
	{/if}
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>

	#seo-block-widget-container {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		overflow: hidden;
		padding: 20px;
	}
	:global(#seo-block-widget-container
			h1, #seo-block-widget-container
			h2, #seo-block-widget-container h3) {
		margin-top: 0;
	}
	:global(#seo-block-widget-container a) {
		color: #f5620f !important;
		width: fit-content !important;
		margin: 0;
		display: initial;
	}
	:global(#seo-block-widget-container p) {
		margin-bottom: 24px;
		color: #8c8c8c;
	}

	/* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
	@media only screen and (min-width: 767px) {
		#seo-block-widget-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/* 
  DESKTOP RESPONSIVNESS */
	@media only screen and (min-width: 1024px) {
		#seo-block-widget-container {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/* .............. 
	WIDGET DARK THEME 
	................. */

	:global(#seo-block-widget-container.dark-background-1
			h1, #seo-block-widget-container.dark-background-1
			h2, #seo-block-widget-container.dark-background-1
			h3) {
		color: #ffffff !important;
	}
	:global(#seo-block-widget-container.dark-background-1
			p) {
		color: #a8a8a8 !important;
	}
</style>
