<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading `featured_match` data;
=================
-->
<script lang="ts" context="module">
	
	let base_url = 'https://betarena-scores-platform.herokuapp.com/';
	if (dev) base_url = 'http://192.168.0.10:3000/';

	/** @type {import('@sveltejs/kit').Load} */
	export async function load() {
		// ... DEBUGGING;
		if (dev) console.debug('-- obtaining translations! --');
		// ... GET RESPONSE;
		const response = await fetch(base_url + 'api/featured-match-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		// ... DEBUGGING;
		if (dev) console.debug('-- preloaded_translations_response_qty --', response);
		// ... return, RESPONSE DATA;
		if (response) {
			return {
				props: {
					FEATURED_MATCH_WIDGET_DATA_SEO: response
				}
			};
		}
		// ... otherwise, ERROR;
		return {
			status: response.status,
			error: new Error(`/ page-preloading-error`)
		};
	}
</script>

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->
<script lang="ts">
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import { amp, browser, dev, mode, prerendering } from '$app/env';

	// ... import `variables` and values;
	import { userBetarenaSettings } from '$lib/store/user-settings';

	// ... import sub-components;
	import SvelteSeo from 'svelte-seo';
	import FeaturedMatchWidget from '$lib/components/featured_match/_FeaturedMatch_Widget.svelte';

	// ... PAGE PRE-LOADED DATA;
	export let FEATURED_MATCH_WIDGET_DATA_SEO;

	// ... redirecting the users to the correct translation page [THAT IS NOT EN]
	$: if (dev) console.debug('$userBetarenaSettings', $userBetarenaSettings);
	// ...
	if (browser && $userBetarenaSettings != undefined && $userBetarenaSettings.lang != 'en') {
		redirect();
	}
	// ...
	async function redirect() {
		await goto(`/${$userBetarenaSettings.lang}`);
	}
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- ... adding SEO-META-TAGS for PAGE ... -->

<!-- ===================
	COMPONENT HTML
=================== -->

<section id="home-page">
	<!-- ... 1st ROW ... -->
	<div />

	<!-- ... 2nd ROW ... -->
	<div />

	<!-- ... 3rd ROW ... -->
	<FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} />
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	section#home-page {
		display: grid;
		max-width: 1430px;
		grid-template-columns: 1fr;
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [768px] */
	@media only screen and (min-width: 768px) {
		section#home-page {
			grid-template-columns: 1fr;
		}
	}

	/* 
    RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1024px) {
		section#home-page {
			gap: 20px;
			grid-template-columns: minmax(auto, 328px) minmax(auto, 502px) minmax(auto, 502px);
		}
	}
</style>
