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
	import arrow_down_fade from './assets/arrow-down-fade.svg'
	import arrow_up from './assets/arrow-up.svg'
	import arrow_up_fade from './assets/arrow-up-fade.svg'
	import light_icon_theme from './assets/theme-light-icon.svg'
	import menu_sports_icon from './assets/menu_sports_icon.svg'

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
	let dropdown_more_sports_menu: boolean = false

	// ... DECLARATIONS of STATE;
	let selected_sports: string = undefined;

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
	$: if (dev) console.debug('-- page --', $page.params)
	// ... get the URL lang-value;
	let url_Lang = $page.params.lang
	if (browser && url_Lang != undefined) {
		selectLanguage(url_Lang)
	}
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
				<!-- ... header TOP NAVBAR section ... -->
				<div id='top-header'
					class='row-space-out'
					in:fade={{ duration: 500 }} out:fade 
				>
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
							<div id='theme-opt-container'
								class="dropdown-opt-box row-space-start"
								on:click={() => dropdown_theme_visible = !dropdown_theme_visible}
								>
								<!-- ... name of the container-opt ... -->
								<div class='m-r-10'>
									<p class='color-grey s-12 m-b-5'>
										{ lang_obj.theme }
									</p>
									<div class='row-space-start'>
										<img 
											class="m-r-5"
											src={light_icon_theme}
											alt="${lang_obj.bookmakers_countries[0][1]}"
											width="16px" height="16px"
										/>
										<p class='color-white s-14'>
											{ lang_obj.theme_options[0] }
										</p>
									</div>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_theme_visible}
									<img 
										src={arrow_down_fade} 
										alt='arrow_down_fade'
										width="16px" height="16px"
									/>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="16px" height="16px"
									/>
								{/if}
								<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
								{#if dropdown_theme_visible}
									<div id='theme-dropdown-menu'
										transition:fly
										>
										{#each lang_obj.theme_options as theme}
											<div class='theme-opt-box'
												on:click={() => dropdown_theme_visible = false}
												>
												<p class='color-white s-14'>
													{ theme }
												</p>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- ... odds-type ... -->
							<div id='odds-type-container'
								class="dropdown-opt-box row-space-start"
								on:click={() => dropdown_odds_type_visible = !dropdown_odds_type_visible}
								>
								<!-- ... name of the container-opt ... -->
								<div class='m-r-10'>
									<p class='color-grey s-12 m-b-5'>
										{ lang_obj.odds }
									</p>
									<p class='color-white s-14'>
										{ lang_obj.odds_type[0] }
									</p>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_odds_type_visible}
									<img 
										src={arrow_down_fade} 
										alt='arrow_down_fade'
										width="16px" height="16px"
									/>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="16px" height="16px"
									/>
								{/if}
								<!-- ... INIT-HIDDEN-dropdown-odds-type ... -->
								{#if dropdown_odds_type_visible}
									<div id='odds-type-dropdown-menu'
										transition:fly
										>
										{#each lang_obj.odds_type as odd}
											<div class='theme-opt-box'
												on:click={() => dropdown_odds_type_visible = false}
												>
												<p class='color-white s-14'>
													{ odd }
												</p>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- ... bookmakers-type ... -->
							<div id='bookmakers-type-container' 
								class="dropdown-opt-box row-space-start m-r-30"
								on:click={() => dropdown_bookmakers_visible = !dropdown_bookmakers_visible}
								>
								<!-- ... name of the container-opt ... -->
								<div class='m-r-10'>
									<p class='color-grey s-12 m-b-5'>
										{ lang_obj.bookmakers }
									</p>
									<div class='row-space-start'>
										<img 
											class='country-flag m-r-5'
											src="https://betarena.com/images/flags/${lang_obj.bookmakers_countries[0][0]}.svg"
											alt="${lang_obj.bookmakers_countries[0][1]}"
											width="20px" height="14px"
										/>
										<p class='color-white s-14'>
											{ lang_obj.bookmakers_countries[0][1] }
										</p>
									</div>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_bookmakers_visible}
									<img 
										src={arrow_down_fade} 
										alt='arrow_down_fade'
										width="16px" height="16px"
									/>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="16px" height="16px"
									/>
								{/if}
								<!-- ... INIT-HIDDEN-dropdown-bookmakers-type ... -->
								{#if dropdown_bookmakers_visible}
									<div id='bookmakers-type-dropdown-menu'
										transition:fly
										>
										{#each lang_obj.bookmakers_countries as country}
											<div class='theme-opt-box row-space-start' 
												on:click={() => dropdown_bookmakers_visible = false}
												>
												<img 
													class='country-flag m-r-10'
													src="https://betarena.com/images/flags/${country[0]}.svg"
													alt="${country[1]}"
													width="20px" height="14px"
												/>
												<p class='color-white s-14'>
													{ country[1] }
												</p>
											</div>
										{/each}
									</div>
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

				<!-- ... bottom-SPORTS-navbar-values ... -->
				<div id='bottom-header'
					class='row-space-out'
					in:fade={{ duration: 500 }} out:fade 
				>
					<div id='bottom-header-inner' 
						class='row-space-out' 
						style="width: fit-content;"
						>
						<!-- ... sports-btn values ... -->
						<div class='row-space-out' style="width: fit-content;">
							{#each {length: 7} as _, i}
								<button class='sports-btn m-r-10'
									on:click={() => selected_sports = lang_obj.sports[i]}
									class:selected-sports={selected_sports == lang_obj.sports[i]}>
									<img 
										class="m-r-10"
										src="" 
										alt=""
										width="20px" height="20px"
									>
									<p class='color-white s-14 m-r-10'> 
										{ lang_obj.sports[i] }
									</p>
									<p class='color-white s-14 sport-counter'> 
										123
									</p>
								</button>
							{/each}
						</div>
						
						<!-- ... more sports button container -->
						<div id='more-sports-menu-container'>
							<!-- ... menu-sports-btn ... -->
							<button id='more-sports-menu'
								on:click={() => dropdown_more_sports_menu = !dropdown_more_sports_menu}>
								<img 
									class="m-r-10"
									src={ menu_sports_icon }
									alt='menu_btn'
									width="20px" height="20px"
								>
								<p class='color-white s-14 m-r-10'> 
									{ lang_obj.more_sports }
								</p>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_more_sports_menu}
									<img 
										src={arrow_down_fade} 
										alt='arrow_down_fade'
										width="20px" height="20px"
									>
								{:else}
									<img 
										src={arrow_up} 
										alt='arrow_up'
										width="20px" height="20px"
									/>
								{/if}
							</button>
							<!-- ... INIT-HIDDEN-dropdown-more-sports-menu ... -->
							{#if dropdown_more_sports_menu}
								<div id='more-sports-dropdown-menu'
									transition:fly
									>
									{#each lang_obj.sports as sport}
										<button class='sports-btn row-space-out'
											on:click={() => dropdown_more_sports_menu = false}
											>
											<div class='row-space-out' style='width: fit-content;'>
												<img 
													class="m-r-5"
													src="" 
													alt=""
													width="20px" height="20px"
												>
												<p class='color-white s-14 m-r-10'> 
													{ sport }
												</p>
											</div>
											<p class='color-white s-14 sport-counter-dark'> 
												123
											</p>
										</button>
									{/each}
								</div>
							{/if}
						</div>

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
								<div class='column-start-grid-start'
									class:m-t-25={tabletExclusive}
									class:m-t-15={mobileExclusive}
									>
									<!-- ... homepage ... -->
									<div class='side-nav-row'>
										<p class="color-white s-14">
											{ lang_obj.homepage }
										</p>
									</div>

									<!-- ... latest-news ... -->
									<div class='side-nav-row'>
										<p class="color-white s-14">
											{ lang_obj.content_platform_link }
										</p>
									</div>

									<!-- ... betting-tips ... -->
									<div class='side-nav-row'>
										<p class="color-white s-14">
											{ lang_obj.betting_tips_link }
										</p>
									</div>

									<!-- ... theme-options ... -->
									<div class='side-nav-dropdown m-t-30 m-b-25'
										on:click={() => dropdown_theme_visible = !dropdown_theme_visible}
										>
										<!-- ... name of the container-opt ... -->
										<div class="m-b-15">
											<p class='color-grey s-12 m-b-5'>
												{ lang_obj.theme }
											</p>
											<div class='row-space-out'>
												<div class='row-space-start'>
													<img 
														class="m-r-5"
														src={light_icon_theme}
														alt="${lang_obj.bookmakers_countries[0][1]}"
														width="16px" height="16px"
													/>
													<p class='color-white s-14'>
														{ lang_obj.theme_options[0] }
													</p>
												</div>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_theme_visible}
													<img 
														src={arrow_down_fade} 
														alt='arrow_down_fade'
														width="16px" height="16px"
													/>
												{:else}
													<img 
														src={arrow_up_fade} 
														alt='arrow_up_fade'
														width="16px" height="16px"
													/>
												{/if}
											</div>

										</div>
										<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
										{#if dropdown_theme_visible}
											<div transition:fly
												>
												{#each lang_obj.theme_options as theme}
													<div class='side-nav-dropdown-opt'
														on:click={() => dropdown_theme_visible = false}
														>
														<p class='color-white s-14'>
															{ theme }
														</p>
													</div>
												{/each}
											</div>
										{/if}
									</div>

									<!-- ... odds-type ... -->
									<div class='side-nav-dropdown m-b-25'
										on:click={() => dropdown_odds_type_visible = !dropdown_odds_type_visible}
										>
										<!-- ... name of the container-opt ... -->
										<div class="m-b-15">
											<p class='color-grey s-12 m-b-5'>
												{ lang_obj.odds }
											</p>
											<div class='row-space-out'>
												<p class='color-white s-14'>
													{ lang_obj.odds_type[0] }
												</p>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_odds_type_visible}
													<img 
														src={arrow_down_fade} 
														alt='arrow_down_fade'
														width="16px" height="16px"
													/>
												{:else}
													<img 
														src={arrow_up_fade} 
														alt='arrow_up_fade'
														width="16px" height="16px"
													/>
												{/if}
											</div>

										</div>
										<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
										{#if dropdown_odds_type_visible}
											<div transition:fly
												>
												{#each lang_obj.odds_type as odd}
													<div class='side-nav-dropdown-opt'
														on:click={() => dropdown_odds_type_visible = false}
														>
														<p class='color-white s-14'>
															{ odd }
														</p>
													</div>
												{/each}
											</div>
										{/if}
									</div>

									<!-- ... bookmakers-type ... -->
									<div class='side-nav-dropdown m-b-25'
										on:click={() => dropdown_bookmakers_visible = !dropdown_bookmakers_visible}
										>
										<!-- ... name of the container-opt ... -->
										<div class="m-b-15">
											<p class='color-grey s-12 m-b-5'>
												{ lang_obj.bookmakers }
											</p>
											<div class='row-space-out'>
												<div class='row-space-start'>
													<img 
														class='country-flag m-r-5'
														src="https://betarena.com/images/flags/${lang_obj.bookmakers_countries[0][0]}.svg"
														alt="${lang_obj.bookmakers_countries[0][1]}"
														width="20px" height="14px"
													/>
													<p class='color-white s-14'>
														{ lang_obj.bookmakers_countries[0][1] }
													</p>
												</div>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_bookmakers_visible}
													<img 
														src={arrow_down_fade} 
														alt='arrow_down_fade'
														width="16px" height="16px"
													/>
												{:else}
													<img 
														src={arrow_up_fade} 
														alt='arrow_up_fade'
														width="16px" height="16px"
													/>
												{/if}
											</div>

										</div>
										<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
										{#if dropdown_bookmakers_visible}
											<div transition:fly
												>
												{#each lang_obj.bookmakers_countries as country}
													<div class='side-nav-dropdown-opt row-space-start' 
														on:click={() => dropdown_bookmakers_visible = false}
														>
														<img 
															class='country-flag m-r-10'
															src="https://betarena.com/images/flags/${country[0]}.svg"
															alt="${country[1]}"
															width="20px" height="14px"
														/>
														<p class='color-white s-14'>
															{ country[1] }
														</p>
													</div>
												{/each}
											</div>
										{/if}
									</div>
									<!-- ... END OF SIDE-NAV-MENU ... -->
								</div>
							</div>
						</nav>
					{/if}
				{/if}
			{/if}
		{/each}
	
	{:catch error}
		<!-- promise was rejected -->
		<p>{error}</p>

	{/await}
</header>

<!-- ===================
	COMPONENT STYLE
	[MOBILE FIRST]
=================== -->

<style>
	header {
        background-color: #292929;
		padding: 0 16px;
		height: 128px;
		position: relative;
	}

	/* 
	top-header-betarena-brand & bottom-header */
	header #top-header,
	header #bottom-header {
		max-width: 1378px;
		position: absolute;
		width: inherit;
	}

	/* 
	 */
	header #top-header {
		padding: 24px 16px;
		height: 72px !important;
		top: 0;
	} 

	/* 
	bottom-header-sports-nav */
	header #bottom-header {
		padding: 6px 16px;
		height: 56px !important;
		bottom: 0;
		overflow: hidden;
	} header #bottom-header-inner::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	} header #bottom-header-inner {
		/* width: 100%; */
		overflow-x: scroll;
		overflow-y: hidden;
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	/* 
	[MOBILE-ONLY] */
	#burger-menu {
		margin-right: 16.15px;
	}

	/* ... 
	[MOBILE + TABLET] @ < 768px
	SIDE-NAV-BAR-navigational-link ... */
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
		overflow-y: scroll;
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	nav::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	nav.tablet-exclusive {
		padding: 24px 34px;
		max-width: 374px !important;
	}
	nav .side-nav-row {
		width: 100%;
		padding: 12px 0;
	} nav .side-nav-row:hover p {
		color: #F5620F;
	}
	nav .side-nav-dropdown {
		width: 100%;
		box-shadow: inset 0px -1px 0px #616161;
	}
	nav .side-nav-dropdown-opt {
		width: 100%;
		padding: 9.5px 0;
	} nav .side-nav-dropdown-opt p {
		font-weight: 400;
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
	more-sports-container-menu */
	#more-sports-menu-container {
		position: relative;
	} #more-sports-dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0%;
		margin-top: 5px;
		background: #4B4B4B;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		overflow: hidden;
		z-index: 2000;
		/* height: 244px; */
		width: 656px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12px;
		padding: 16px;
		justify-items: start;
	} #more-sports-dropdown-menu .sports-btn {
		background: #4B4B4B;
		border: 1px solid #8C8C8C !important;
		box-sizing: border-box;
		border-radius: 29px;
		width: 200px;
		height: 44px;
		padding: 8.5px 10px 8.5px 12.5px;
	} #more-sports-dropdown-menu .sport-counter-dark {
		background-color: #292929;
		padding: 3px 8px;
		border-radius: 20px;
	} #more-sports-dropdown-menu .sports-btn:hover {
		background: #292929;
	} #more-sports-dropdown-menu .sports-btn:hover .sport-counter-dark {
		background: #4B4B4B;
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

	button.sports-btn {
		padding: 10.5px 10px 9.5px 16px;
		background: #292929;
		border: 1px solid #4B4B4B !important;
		box-sizing: border-box;
		border-radius: 29px;
		height: 44px;
	} button.sports-btn.selected-sports {
		border: 1px solid #F5620F !important;
	} button.sports-btn .sport-counter {
		padding: 3px 8px;
		background: #4B4B4B;
		border-radius: 20px;
	}

	button#more-sports-menu {
		padding: 12.5px 16px;
		background: transparent;
		border: 1px solid #4B4B4B !important;
		box-sizing: border-box;
		border-radius: 29px;
	} button#more-sports-menu:hover {
		border: 1px solid #FFFFFF !important;
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

	img.country-flag {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
		background-blend-mode: overlay;
		border-radius: 2px;
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [768px] */
    @media screen and (min-width: 768px) {
		
		header #top-header {
			padding: 14px 34
			px;
		} 
		header #bottom-header {
			padding: 6px 34px;
		}

        #burger-menu {
			margin-right: 24px;
		}
    }

	/* 
    RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
    @media screen and (min-width: 1024px) {

		/* 
		desktop hover effects */
		button.sports-btn:hover {
			border: 1px solid #FFFFFF !important;
		}

		/*
		theme-options-container */
		#theme-opt-container,
		#odds-type-container {
			position: relative;
		} #theme-dropdown-menu,
		  #odds-type-dropdown-menu {
			position: absolute;
			top: 100%;
			left: 0%;
			margin-top: 5px;
			background: #292929;
			box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
			border-radius: 4px;
			overflow: hidden;
			z-index: 2000;
			/* height: 80px; */
			width: 168px;
		} #theme-dropdown-menu .theme-opt-box,
		  #odds-type-dropdown-menu .theme-opt-box {
			padding: 9.5px 16px;
			box-shadow: inset 0px -1px 0px #3C3C3C;
			background: #4B4B4B;
			height: 40px;
		} #theme-dropdown-menu .theme-opt-box:hover p,
		  #odds-type-dropdown-menu .theme-opt-box:hover p {
			color: #F5620F;
		}

		/* 
		bookmakers-options-container */
		#bookmakers-type-container {
			position: relative;
		} #bookmakers-type-dropdown-menu {
			position: absolute;
			top: 100%;
			right: 0%;
			margin-top: 5px;
			background: #4B4B4B;
			box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
			border-radius: 8px;
			overflow: hidden;
			z-index: 2000;
			height: 320px;
			width: 620px;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 5px 20px;
			padding: 8px 12px;
		} #bookmakers-type-dropdown-menu .theme-opt-box {
			height: 40px;
			padding: 13px 8px;
			box-shadow: inset 0px -1px 0px #3C3C3C;
			background: #4B4B4B;
			position: relative;
		} #bookmakers-type-dropdown-menu .theme-opt-box:hover {
			background: #292929;
			border-radius: 4px;
		}

	}


</style>