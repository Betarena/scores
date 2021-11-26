<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';

    import { langSelect } from '$lib/store/lang-select'

	import Footer from '$lib/components/footer/Footer.svelte'
	import Header from '$lib/components/header/Header.svelte'

	import '../app.css'
    
    // ... kickstart the .localStorage();
    if (browser) {
		langSelect.useLocalStorage()
    }
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<Header />

<main>
	<slot />
</main>

<Footer />

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	main {
        /* 
        so nothing exceeds the main-page-boundries */
        position: relative;
        z-index: 0;
        margin: 0 auto;
        width: 100%;
        overflow: hidden;
        /* 
        make sure the initial page height is always full-device-height as a minumim */
        /* min-height: 100vh; */
    }
</style>
