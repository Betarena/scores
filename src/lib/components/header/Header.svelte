<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';

	import { onMount } from "svelte"
	import { page } from '$app/stores'

	// ... header-component;
	import logo_full from './assets/betarena-logo-full.svg'
	import logo_mini from './assets/betarena-logo-mobile.svg'
	import menu_burger_bar from './assets/menu-burger.svg'

	// ... sub-header-component;
	import close from './assets/close.svg'
	import arrow_down from './assets/arrow-down.svg'
	import { fly } from 'svelte/transition';
	import { GET_WEBSITE_ALL_LANG_TRANSLATIONS } from '$lib/graphql/query'
	import { query } from "svelte-apollo";
	import type { 
		Header_Translation_Response, 
		Header_Translation } from '$lib/model/scores_header_translations'
	import { langSelect } from '$lib/store/lang-select'


    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * This function loads when all of the
     * rest of the components have loaded
     * and rendered, checking via JS the viewport
     * of the client device and changing between
     * appropiate components to display the correct
     * component, tailored to a specifc device.
    */
	let mobileExclusive: boolean = true
	let tabletExclusive: boolean = true
    let mobileNavToggleMenu: boolean = false

    onMount(async() => {
        var wInit = document.documentElement.clientWidth
		// TABLET - VIEW
        if (wInit > 768) {
            tabletExclusive = false
        } else {
            tabletExclusive = true
        }
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true
		} else {
			mobileExclusive = false
		}
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth
			// TABLET - VIEW
            if (w > 768) {
                tabletExclusive = false
            } else {
                tabletExclusive = true
            }
			// MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true
			} else {
				mobileExclusive = false
			}
        })
    })


	/**
	 * Description: & [REACTIVITY]
	 * Setup for GRAPHQL
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... obtain THIS Platforms Language Translations;
	*/
	let translations_response: any
	let TRANSLATIONS_DATA: Header_Translation_Response = undefined
	// ... trigger Query-Req-Res
	getTranslations()
	// ...
	async function getTranslations() {
		if (dev) console.debug('-- obtaining translations! --')
		translations_response = query(GET_WEBSITE_ALL_LANG_TRANSLATIONS)
	}
	// ... response listen - data;
	$: if ($translations_response != undefined) {
		if ($translations_response.data) {
			if (dev) console.debug('TRANSLATIONS_DATA', $translations_response.data)
			// ... assign the TRANSLATION DATA;
			TRANSLATIONS_DATA = $translations_response.data
			// ... check for the user-localStorage() data for TRANSLATION SELECTION;
			if (dev) console.debug('user-translation', $langSelect)
		}
	}

	/**
	 * Description
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... update the navigation page URL dynamically;
	*/
	// ... get the URL lang-value;
	$: if (dev) console.debug('page', $page.params)
	let url_Lang = $page.params.lang
	// ...
	if (browser) selectLanguage(url_Lang)
	// .. update the user selected `.localStorage()`
	function selectLanguage(lang: string) {
		// ...
		if (dev) console.debug('updating user translation to ->', lang)
		langSelect.setLang(lang)
		// ... update page URL
		goto(`/${lang}`)
	}
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<header class='column-space-center'>
	<!-- ... menu-burger-bar ... [CONDITIONAL] -->
	<div id='header-inner'
		class='row-space-start'>
		{#if tabletExclusive}
			<img
				id='burger-menu'
				src={menu_burger_bar} 
				alt='betarena-logo'
				width="24px" height="24px"
				on:click={() => mobileNavToggleMenu = true}
			/>
		{/if}
		
		{#if mobileExclusive}
			<!-- ... brand-logo-betarena-for-mobile-ONLY ... -->
			<div id='brand'>
				<a sveltekit:prefetch href='/'>
					<img 
						src={logo_mini} 
						alt='betarena-logo'
						width="103px" height="30px"
					/>
				</a>
			</div>
		{:else}
			<!-- ... brand-logo-betarena-for-desktop-ONLY ... -->
			<div id='brand'>
				<a sveltekit:prefetch href='/'>
					<img 
						src={logo_full} 
						alt='betarena-logo'
						width='142px' height='30px'
					/>
				</a>
			</div>
		{/if}
	</div>
</header>

<!-- ... side-bar [MOBILE + TABLET] -->
{#if (tabletExclusive || mobileExclusive)}
	{#if mobileNavToggleMenu}
		<nav
			class='column-start-grid'
			class:tablet-exclusive={mobileExclusive == false}
			in:fly={{ x: -200, duration: 500 }}
			out:fly={{ x: -200, duration: 500 }}
			>
			<div class='row-space-out'>
				<img 
					src={close} 
					alt='close-icon'
					width='24px' height='24px'
					on:click={() => mobileNavToggleMenu = false}
				/>
				<!-- ... language-change ... -->
				<div class='row-space-start'>
					{#if TRANSLATIONS_DATA != undefined}
						<select class='color-white m-r-10' 
							name="cars" 
							id="cars"
							bind:value={$langSelect}
							on:change={() => selectLanguage($langSelect)}
							>
							<!-- <option value="volvo">Volvo</option> -->
							{#each TRANSLATIONS_DATA.scores_header_translations as lang}
								<option value={ lang.lang }>{ lang.lang.toUpperCase() }</option>
							{/each}
						</select>
						<img 
							src={arrow_down} 
							alt='close-icon'
							width='24px' height='24px'
						/>
					{/if}
				</div>
			</div>
		</nav>
	{/if}
<!-- ... regular-nav-bar [DESKTOP] -->
{:else}
	<nav>
		<div class='row-space-out'>
			<!-- ... nav-links ... -->
			<div>
				
			</div>
			<!-- ... language-change ... -->
			<div class='row-space-start'>
				{#if TRANSLATIONS_DATA != undefined}
					<select class='color-white m-r-10' 
						name="cars" 
						id="cars"
						bind:value={$langSelect}
						on:change={() => selectLanguage($langSelect)}
						>
						<!-- <option value="volvo">Volvo</option> -->
						{#each TRANSLATIONS_DATA.scores_header_translations as lang}
							<option value={ lang.lang }>{ lang.lang.toUpperCase() }</option>
						{/each}
					</select>
					<img 
						src={arrow_down} 
						alt='close-icon'
						width='24px' height='24px'
					/>
				{/if}
			</div>
		</div>
	</nav>
{/if}


<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	header {
        background-color: #292929;
		height: 72px;
		padding: 14px 16px;
	}

	/* ... critical + essential */
	header #header-inner {
		max-width: 1378px;
	}

	#burger-menu {
		margin-right: 16.15px;
	}

	/* ... nav-bar-navigational-link ... */
	nav {
		background-color: #292929;
		height: 100vh;
		width: 100%;
		padding: 14px 16px;
		position: fixed;
		z-index: 1000;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
	nav.tablet-exclusive {
		width: 374px !important;
	}
	select {
		box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
		color: #000000;
		outline: none;
		width: fit-content;
		border-radius: 5px;
		border: none;
		padding: 5px 20px;
		cursor: pointer;
		transition: all ease 0.2s;
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [768px] */
    @media screen and (min-width: 768px) {
		header {
			padding: 14px 34px;
		} 
		
        #burger-menu {
			margin-right: 24px;
		}

		/* ... nav-bar-navigational-link ... */
		nav {
			background-color: #292929;
			height: 56px;
			width: 100%;
			padding: 6px 34px;
			position: relative;
		}
    }
</style>