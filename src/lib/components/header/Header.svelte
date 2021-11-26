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
	import arrow_up from './assets/arrow-up.svg'
	import { fade, fly } from 'svelte/transition';
	import { GET_WEBSITE_ALL_LANG_TRANSLATIONS } from '$lib/graphql/query'
	import { initGrapQLClient } from '$lib/graphql/init_graphQL'
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

	// ... OTHER - drop-down menu-operators;
	let dropdown_lang_visible: boolean = false
	let dropdown_theme_visible: boolean = false
	let dropdown_odds_type_visible: boolean = false
	let dropdown_bookmakers_visible: boolean = false
	$: if (dev) console.debug('dropdown_lang_visible', dropdown_lang_visible)


	/**
	 * Description: & [REACTIVITY]
	 * Setup for GRAPHQL
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... obtain THIS Platforms Language Translations;
	*/
	// let TRANSLATION_DATA: Header_Translation = undefined
	async function getTranslations(): Promise < Header_Translation_Response > {
		// ...
		if (dev) console.debug('-- obtaining translations! --')
		const response = await initGrapQLClient().request(GET_WEBSITE_ALL_LANG_TRANSLATIONS)
		// ...
		if (dev) console.debug('-- translations_response --', response)
		// ... intercept the correct translation
		// ...
		return response
	}
	// ... TRIGGER Query-Req-Res
	let translation_promise = getTranslations()

	/**
	 * Description
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... update the navigation page URL dynamically;
	*/
	// ...
	$: if (dev) console.debug('page', $page.params)
	// ... get the URL lang-value;
	let url_Lang = $page.params.lang
	if (browser && url_Lang != undefined) selectLanguage(url_Lang)
	// .. update the user selected `.localStorage()`
	function selectLanguage(lang: string) {
		// ...
		if (dev) console.debug('updating user translation to ->', lang)
		langSelect.setLang(lang)
		// ...
		dropdown_lang_visible = false
		// ... update page URL
		goto(`/${lang}`)
	}
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<header in:fade class='column-space-center'>
	{#await translation_promise}
		<!-- ... promise is pending ... -->

	{:then TRANSLATIONS_DATA}
		<!-- ... identify the correct translation via IF -->
		{#each TRANSLATIONS_DATA.scores_header_translations as lang_obj}
			{#if lang_obj.lang == $langSelect}
				<!-- ... inner header - cross platform ... -->
				<div in:fade={{ duration: 500 }} out:fade id='header-inner'class='row-space-out'>
					<!-- ... 1st half of the header nav ... -->
					<div class='row-space-start' style='width: fit-content;'>
						<!-- ... menu-burger-bar ... [CONDITIONAL - ONLY TABLET & MOBILE] -->
						{#if tabletExclusive}
							<img
								id='burger-menu'
								src={menu_burger_bar} 
								alt='betarena-logo'
								width="24px" height="24px"
								on:click={() => mobileNavToggleMenu = true}
							/>
						{/if}

						<!-- ... BETARENA LOGO ... -->
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
						<!-- ... BETARENA LOGO [DESKTOP ONLY] ... -->
						{:else}
							<!-- ... brand-logo-betarena-for-desktop-ONLY ... -->
							<div id='brand'>
								<a sveltekit:prefetch href='/'>
									<img 
										class='m-r-30'
										src={logo_full} 
										alt='betarena-logo'
										width='142px' height='30px'
									/>
								</a>
							</div>
						{/if}

						{#if !tabletExclusive}
							<!-- ... language-change-dropdown-select ... -->
							<div id='lang-container' class='m-r-30'>
								<!-- ... INIT-selected-lang ... -->
								<div id='selected-language-btn' 
									class:active-lang-select={dropdown_lang_visible == true}
									class='row-space-out'
									on:click={() => dropdown_lang_visible = !dropdown_lang_visible}
									>
									<p class='color-white s-14 mr-5'>
										{ $langSelect.toUpperCase() }
									</p>
									<!-- ... arrow down [hidden-menu] ... -->
									{#if !dropdown_lang_visible}
										<img 
											src={arrow_down} 
											alt='arrow_down'
											width="16px" height="16px"
										/>
									{:else}
										<img 
											src={arrow_up} 
											alt='arrow_up'
											width="16px" height="16px"
										/>
									{/if}
										
								</div>
								<!-- ... INIT-HIDDEN drop-down menu ... -->
								{#if dropdown_lang_visible}
									<div id='dropdown-menu'
										transition:fly
										>
										{#each TRANSLATIONS_DATA.scores_header_translations as lang}
											<div id='lang-select'
												on:click={() => selectLanguage(lang.lang)}
												>
												<p class='color-white s-14'>
													{ lang.lang.toUpperCase() }
												</p>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/if}

						{#if !mobileExclusive}
							<!-- ... latest news ... -->
							<button class='btn-main'>
								<p class='color-white s-14'> 
									{ lang_obj.content_platform_link } 
								</p>
							</button>

							<!-- ... betting-tips ... -->
							<button class='btn-main'>
								<p class='color-white s-14'> 
									{ lang_obj.betting_tips_link } 
								</p>
							</button>
						{/if}
						
					</div>
					
					<!-- ... 2nd half of the header nav ... -->
					<div class='row-space-start' style='width: fit-content;'>
						{#if !tabletExclusive}
							<!-- ... theme-options ... -->
							<div class="dropdown-opt-box row-space-start"
								on:click={() => dropdown_theme_visible = !dropdown_theme_visible}
								>
								<div class='m-r-10'>
									<p class='color-grey s-12'>
										{ lang_obj.theme }
									</p>
									<p class='color-white s-14'>
										{ lang_obj.theme_options[0] }
									</p>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_theme_visible}
									<img 
										src={arrow_down} 
										alt='arrow_down'
										width="16px" height="16px"
									/>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="16px" height="16px"
									/>
								{/if}
							</div>

							<!-- ... odds-type ... -->
							<div class="dropdown-opt-box row-space-start"
								on:click={() => dropdown_odds_type_visible = !dropdown_odds_type_visible}
								>
								<div class='m-r-10'>
									<p class='color-grey s-12'>
										{ lang_obj.odds }
									</p>
									<p class='color-white s-14'>
										{ lang_obj.odds_type[0] }
									</p>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_odds_type_visible}
									<img 
										src={arrow_down} 
										alt='arrow_down'
										width="16px" height="16px"
									/>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="16px" height="16px"
									/>
								{/if}
							</div>

							<!-- ... bookmakers-type ... -->
							<div class="dropdown-opt-box row-space-start m-r-30"
								on:click={() => dropdown_bookmakers_visible = !dropdown_bookmakers_visible}
								>
								<div class='m-r-10'>
									<p class='color-grey s-12'>
										{ lang_obj.bookmakers }
									</p>
									<p class='color-white s-14'>
										{ lang_obj.bookmakers_countries[0] }
									</p>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_bookmakers_visible}
									<img 
										src={arrow_down} 
										alt='arrow_down'
										width="16px" height="16px"
									/>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="16px" height="16px"
									/>
								{/if}
							</div>
						{/if}

						{#if !mobileExclusive}
							<!-- ... sign-in-btn ... -->
							<button id='sign-in-btn'>
								<p class="color-white s-14">
									{ lang_obj.sign_in }
								</p>
							</button>
						{/if}

						{#if mobileExclusive}
							<!-- ... betting-tips ... -->
							<button class='btn-main'>
								<p class='color-white s-14'> 
									{ lang_obj.betting_tips_link } 
								</p>
							</button>
						{/if}

					</div>
				</div>

				<!-- ... side-bar [MOBILE + TABLET] -->
				{#if (tabletExclusive || mobileExclusive)}
					{#if mobileNavToggleMenu}
						<nav
							class:tablet-exclusive={mobileExclusive == false}
							in:fly={{ x: -200, duration: 500 }}
							out:fly={{ x: -200, duration: 500 }}
							>
							<div>
								<!-- ... top-action-row -->
								<div class='row-space-out'>
									<!-- ... close-side-nav ... -->
									<img 
										src={close} 
										alt='close-icon'
										width='24px' height='24px'
										on:click={() => mobileNavToggleMenu = false}
									/>
									
									<div class='row-space-start' style='width: fit-content;'>
										<!-- ... language-change-dropdown-select ... -->
										<div id='lang-container' class:m-r-24={mobileExclusive} >
											<!-- ... INIT-selected-lang ... -->
											<div id='selected-language-btn' 
												class:active-lang-select={dropdown_lang_visible == true}
												class='row-space-out'
												on:click={() => dropdown_lang_visible = !dropdown_lang_visible}
												>
												<p class='color-white s-14 mr-5'>
													{ $langSelect.toUpperCase() }
												</p>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_lang_visible}
													<img 
														src={arrow_down} 
														alt='arrow_down'
														width="16px" height="16px"
													/>
												{:else}
													<img 
														src={arrow_up} 
														alt='arrow_up'
														width="16px" height="16px"
													/>
												{/if}
													
											</div>
											<!-- ... INIT-HIDDEN drop-down menu ... -->
											{#if dropdown_lang_visible}
												<div id='dropdown-menu'
													transition:fly
													>
													{#each TRANSLATIONS_DATA.scores_header_translations as lang}
														<div id='lang-select'
															on:click={() => selectLanguage(lang.lang)}
															>
															<p class='color-white s-14'>
																{ lang.lang.toUpperCase() }
															</p>
														</div>
													{/each}
												</div>
											{/if}
										</div>

										<!-- ... sign-in-btn ... -->
										{#if mobileExclusive}
											<button id='sign-in-btn'>
												<p class="color-white s-14">
													{ lang_obj.sign_in }
												</p>
											</button>
										{/if}
									</div>
								</div>
								
								<!-- ... menu-nav-action-row-START -->
								<div class='column-start-grid'
									class:m-t-25={tabletExclusive}
									class:m-t-15={mobileExclusive}
									>
									<div class='side-nav-row'>
										<p class="color-white s-14">
											Homepage
										</p>
									</div>
									<div class='side-nav-row'>
										<p class="color-white s-14">
											{ lang_obj.content_platform_link }
										</p>
									</div>
									<div class='side-nav-row'>
										<p class="color-white s-14">
											{ lang_obj.betting_tips_link }
										</p>
									</div>
								</div>

							</div>
						</nav>
					{/if}
				{/if}
			{/if}
		{/each}
	
	{:catch error}
		<!-- promise was rejected -->

	{/await}
</header>

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
		position: absolute;
    	padding: inherit;
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
		padding: 24px 34px;
		max-width: 374px !important;
	}
	nav .side-nav-row {
		padding: 12px 0;
	}

	/* 
	LANG SELECT CONTAINER */
	#lang-container {
		position: relative;
	} #selected-language-btn {
		color: #ffffff;
		outline: none;
		width: 62px;
		border: none;
		cursor: pointer;
		padding: 5px 12px;
		background-color: transparent;
	} #selected-language-btn:hover, 
	  #selected-language-btn.active-lang-select {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	} #dropdown-menu {
		position: absolute;
		top: 100%;
		width: 88px;
		left: -20%;
		margin-top: 5px;
		border-radius: 4px;
		background: #292929;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		overflow: hidden;
		z-index: 1000;
	} #lang-select {
		padding: 10px 0;
		text-align: center;
		background: #4B4B4B;
		cursor: pointer;
		box-shadow: inset 0px -1px 0px #3C3C3C;
	} #lang-select:hover {
		background: #292929;
		box-shadow: inset 0px -1px 0px #3C3C3C;
	}

	/*
	=============
	BUTTONS 
	*/
	button.btn-main {
		padding: 11px 20px;
		background: transparent;
		border-radius: 29px;
	} button.btn-main:hover {
		background: #4B4B4B;
		border-radius: 29px;
	}

	button#sign-in-btn {
		padding: 12px 26px;
		background: transparent;
		border: 1px solid #FFFFFF !important;
		box-sizing: border-box;
		border-radius: 8px;
	} button#sign-in-btn:hover {
		border: 1px solid #F5620F !important;
	} button#sign-in-btn:hover p {
		color: #F5620F;
	}

	/* 
	OPT-BOX */
	.dropdown-opt-box {
		border-left: 1px solid #4B4B4B;
		height: 44px;
		padding: 0 16px;
		width: fit-content;
		cursor: pointer;
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [768px] */
    @media screen and (min-width: 768px) {
		header {
			padding: 14px 34px;
		} 

		header #header-inner {
		position: absolute;
    	padding: inherit;
	}
		
        #burger-menu {
			margin-right: 24px;
		}
    }
</style>