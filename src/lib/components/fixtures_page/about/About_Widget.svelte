<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { ABOUT_FW_DEBUG_STYLE, ABOUT_FW_DEBUG_TAG, ABOUT_FW_DEBUG_TOGGLE, dlog } from '$lib/utils/debug';
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import type {
		REDIS_CACHE_SINGLE_about_data,
		REDIS_CACHE_SINGLE_about_translation
	} from '$lib/models/fixtures/about/types';

	import AboutLoader from './About_Loader.svelte';

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let FIXTURE_ABOUT: REDIS_CACHE_SINGLE_about_data;
	export let FIXTURE_ABOUT_TRANSLATION: REDIS_CACHE_SINGLE_about_translation;

	let loaded: boolean = false; // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
	let refresh: boolean = false; // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data: any = undefined; // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
	let no_widget_data: any = false; // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;
	let show_placeholder: boolean = true; // [ℹ] IMPORTANT [override] placeholder for "no-widget-data"

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	// [ℹ] MAIN
	// [ℹ] Not In Use
	async function widget_init(): Promise<REDIS_CACHE_SINGLE_about_data> {
		// [ℹ] get response [lang] [data] [obtained from preload()]
		const sleep = (ms) =>
			new Promise((r) => setTimeout(r, ms));
		await sleep(3000);

		loaded = true;

		// [ℹ] data validation check
		if (FIXTURE_ABOUT == undefined) {
      dlog(`${ABOUT_FW_DEBUG_TAG} ❌ no data available!`, ABOUT_FW_DEBUG_TOGGLE, ABOUT_FW_DEBUG_STYLE);
			no_widget_data = true;
			return;
		}
		// [ℹ] otherwise, no data
		else {
			no_widget_data = false;
		}

		FIXTURE_ABOUT = FIXTURE_ABOUT;

		return FIXTURE_ABOUT;
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let tabletView = 1000;
	let mobileView = 725;
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				// [ℹ] TABLET - VIEW
				if (w >= tabletView) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// [ℹ] MOBILE - VIEW
				if (w <= mobileView) {
					mobileExclusive = true;
				} else {
					mobileExclusive = false;
				}
			}
		);
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE METHODS
	// [! CRITICAL !]
	// ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data =
		$userBetarenaSettings.country_bookmaker;

	$: if (browser && refresh_data) {
		// [ℹ] reset necessary variables;
		refresh = true;
		loaded = false;
		no_widget_data = false;
		// widget_init()
		setTimeout(async () => {
			refresh = false;
		}, 100);
	}

	afterNavigate(async () => {
		widget_init();
	});
</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div id="widget-outer">
	<!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
	<!-- {#if !loaded} -->
	<div id="seo-widget-box">
		<!-- 
      [ℹ] widget-title -->
		<h2>{FIXTURE_ABOUT_TRANSLATION?.title}</h2>
		<!-- 
      [ℹ] & complete text block -->
		<p>{FIXTURE_ABOUT?.seo_data}</p>
	</div>
	<!-- {/if} -->

	<!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
	{#if no_widget_data && loaded && show_placeholder}
		<h2
			class="s-20 m-b-10 w-500 color-black-2"
			style="margin-top: 0px;"
			class:color-white={$userBetarenaSettings.theme ==
				'Dark'}
		>
			{FIXTURE_ABOUT_TRANSLATION?.title}
		</h2>

		<!-- [ℹ] no-widget-data-avaiable-placeholder container 
    -->
		<div
			id="no-widget-box"
			class="column-space-center"
			class:dark-background-1={$userBetarenaSettings.theme ==
				'Dark'}
		>
			<!-- 
      [ℹ] no-visual-asset
      -->
			{#if $userBetarenaSettings.theme == 'Dark'}
				<img
					src={no_visual_dark}
					alt="no_visual_dark"
					width="32px"
					height="32px"
					class="m-b-16"
				/>
			{:else}
				<img
					src={no_visual}
					alt="no_visual"
					width="32px"
					height="32px"
					class="m-b-16"
				/>
			{/if}

			<!-- 
      [ℹ] container w/ text 
      -->
			<div>
				<p
					class="s-14 m-b-8 w-500"
					class:color-white={$userBetarenaSettings.theme ==
						'Dark'}
				>
					{FIXTURE_ABOUT_TRANSLATION?.no_info}
				</p>
				<p class="s-14 color-grey w-400">
					{FIXTURE_ABOUT_TRANSLATION?.no_info_desc}
				</p>
			</div>
		</div>
	{/if}

	<!-- 
  [ℹ] MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}
		<!-- <AboutLoader /> -->

		<!-- 
    [ℹ] promise is pending 
    -->
		{#await widget_init()}
			<AboutLoader />
			<!-- 
    [ℹ] promise was fulfilled
    -->
		{:then data}
			<h2
				class="s-20 m-b-10 w-500 color-black-2"
				style="margin-top: 0px;"
				class:color-white={$userBetarenaSettings.theme ==
					'Dark'}
			>
				{FIXTURE_ABOUT_TRANSLATION?.title}
			</h2>

			<div
				id="about-widget-container"
				class:dark-background-1={$userBetarenaSettings.theme ==
					'Dark'}
			>
				<!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] (minimal) cross-platform design change
        -->

				<!--
        [ℹ] render SEO-DATA -->
				{@html FIXTURE_ABOUT?.seo_data}
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
=================-->
<style>
	/* [ℹ] OTHER STYLE / CSS */

	/* EMPTY */

	/* [ℹ] SEO WIDGET DATA */

	#seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

	/* [ℹ] NO DATA WIDGET STYLE / CSS */

	#no-widget-box {
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		text-align: center;
	}

	/*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] NOTE: [MOBILE-FIRST]
  */

	/* widget-main */
	div#about-widget-container {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		padding: 20px;
	}

	/* widget injected HTML style override */
	:global(#about-widget-container a) {
		color: #f5620f !important;
		width: fit-content !important;
		margin: 0;
		display: initial;
	}
	:global(#about-widget-container section) {
		padding: 0 !important;
		padding-bottom: 0 !important;
		min-height: fit-content;
	}
	:global(#about-widget-container
			section
			div:first-child) {
		border: 1px solid #e6e6e6;
		border-radius: 12px 12px 0 0 !important;
	}
	:global(#about-widget-container section > div) {
		border: 1px solid #e6e6e6;
		padding: 20px;
	}
	:global(#about-widget-container
			section
			> div
			> h4) {
		margin: 0 !important;
		margin-bottom: 8px;
	}
	:global(#about-widget-container
			section
			div.faq-body) {
		border: none !important;
	}
	:global(#about-widget-container section hr) {
		display: none;
	}
	:global(#about-widget-container
			section
			div:last-child) {
		border: 1px solid #e6e6e6;
		border-radius: 0 0 12px 12px !important;
	}
	:global(#about-widget-container h3) {
		font-size: 20px;
	}
	:global(#about-widget-container
			h4, #about-widget-container p) {
		font-size: 16px;
	}
	:global(#about-widget-container
			section
			div.faq-body) {
		font-size: 14px;
	}
	:global(#about-widget-container
			h1, #about-widget-container
			h2, #about-widget-container
			h3, #about-widget-container h4) {
		color: #292929 !important;
	}
	:global(#about-widget-container
			p, #about-widget-container
			section
			div.faq-body) {
		color: #8c8c8c !important;
	}
	:global(#about-widget-container h3) {
		margin: 20px 0 12px 0;
	}
	:global(#about-widget-container section > div) {
		border: 1px solid #e6e6e6 !important;
	}

	:global(#about-widget-container p) {
		margin-bottom: 14px;
	}

	/* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) and (max-width: 1000px) {
		#about-widget-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) {
	}

	/* 
  DESKTOP [M-L] RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1000px) {
		#about-widget-container {
			min-width: 100%;
		}
	}

	/* 
  DESKTOP [L] RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1160px) {
		/* EMPTY */
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	:global(#about-widget-container.dark-background-1
			h1, #about-widget-container.dark-background-1
			h2, #about-widget-container.dark-background-1
			h3, #about-widget-container.dark-background-1
			h4) {
		color: #ffffff !important;
	}
	:global(#about-widget-container.dark-background-1
			p, #about-widget-container.dark-background-1
			section
			div.faq-body) {
		color: #a8a8a8 !important;
	}
	:global(#about-widget-container.dark-background-1
			section
			> div) {
		border: 1px solid #616161 !important;
	}
</style>
