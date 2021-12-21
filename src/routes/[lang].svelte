<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading `featured_match` data;
=================
-->
<script lang="ts" context="module">
	
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch }) {
		// ... DEBUGGING;
		if (dev) console.debug('-- obtaining translations! --');
		// ... GET RESPONSE;
		const response = await fetch('/api/featured-match-seo.json', {
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
	import { amp, browser, dev, mode, prerendering } from '$app/env';

	import SvelteSeo from 'svelte-seo';
	import FeaturedMatchWidget from '$lib/components/featured_match/_FeaturedMatch_Widget.svelte';

	export let FEATURED_MATCH_WIDGET_DATA_SEO;

	// ...
	// export let lang: string
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- adding SEO title and meta-tags to the /basket page -->
<SvelteSeo
	title="Betarena"
	description="Betarena"
	keywords="Betarena, 
        scores platform"
	noindex={false}
	nofollow={false}
	canonical="https://www.betarena.com/"
	twitter={{
		site: '@username',
		title: 'Betarena',
		description: 'Betarena',
		image: 'https://www.example.com/images/cover.jpg',
		imageAlt: 'Alt text for the card!'
	}}
	openGraph={{
		title: 'Betarena',
		description: 'Betarena',
		url: 'https://www.betarena.com/',
		type: 'website',
		images: [
			{
				url: 'https://www.example.com/images/og-image.jpg',
				width: 850,
				height: 650,
				alt: 'Og Image Alt'
			}
		]
	}}
	jsonLd={{
		'@type': 'Article',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': 'https://example.com/article'
		},
		headline: 'Article headline',
		image: [
			'https://example.com/photos/1x1/photo.jpg',
			'https://example.com/photos/4x3/photo.jpg',
			'https://example.com/photos/16x9/photo.jpg'
		],
		datePublished: '2020-08-03T17:31:37Z',
		dateModified: '2020-08-20T09:31:37Z',
		author: {
			'@type': 'Person',
			name: 'John Doe'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Google',
			logo: {
				'@type': 'ImageObject',
				url: 'https://example.com/logo.jpg'
			}
		}
	}}
/>

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
