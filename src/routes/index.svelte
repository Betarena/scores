<!-- ===================
	COMPONENT JS - MODULE 
    [TypeScript Written]
=================== -->

<script context="module" lang="ts">
	// ...
	export const prerender = true;
</script>

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';

	// ...
	import header_bg from '$lib/header-background.svg'
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- adding SEO title and meta-tags to the /basket page -->
<svelte:head>
    <!--
    ~~~~~~~~~~~~
    Primary Meta Tags;
    https://metatags.io/ -->
    <title> Betarena </title>
    <meta name="title" content="Betarena">
    <meta name="description" content="Betarena">
    <meta name="keywords" content="Betarena, 
        scores platform, 
        ">
    <meta name="author" content="Miguel Bacharov">
    <!-- 
    ~~~~~~~~~~~~
    Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<link-goes-here>">
    <meta property="og:title" content="Betarena">
    <meta property="og:description" content="Betarena">
	<meta property="og:image" content="<link-goes-here>">
    <!--
    ~~~~~~~~~~~~
    Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="<link-goes-here>">
    <meta property="twitter:title" content="Betarena">
    <meta property="twitter:description" content="Betarena">
	<meta property="twitter:image" content="<link-goes-here>">
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<div id='background-image' />

<section>
	
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	#background-image {
        background-image: url(/src/lib/header-background.svg);
        background-repeat: no-repeat;
        background-size: cover;
        background-origin: border-box;
        background-position: bottom;
        height: 495px;
	}
	
	section {
		
	}
</style>
