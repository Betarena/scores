<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->
<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	// ... header-component
	import logo_full from './assets/betarena-logo-full.svg';
	import logo_mini from './assets/betarena-logo-mobile.svg';
	import menu_burger_bar from './assets/menu-burger.svg';
	import icon_check from './assets/icon-check.svg';

	// ... sub-header-component
	import close from './assets/close.svg';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_down_fade from './assets/arrow-down-fade.svg';
	import arrow_up from './assets/arrow-up.svg';
	import arrow_up_fade from './assets/arrow-up-fade.svg';
	import light_icon_theme from './assets/theme-light-icon.svg';
	import menu_sports_icon from './assets/menu_sports_icon.svg';

	import type { Header_Translation_Response, Header_Translation } from '$lib/model/scores_header_translations';
	import type { GeoJsResponse } from '$lib/model/geo-js-interface';
	import { getUserLocation } from '$lib/geoJs/init';

	export let HEADER_TRANSLATION_DATA: Header_Translation_Response;

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
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;
	let mobileNavToggleMenu: boolean = false;
	let mobileExclusiveMoreSports: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// TABLET - VIEW
			if (w > 768) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});

	// ... OTHER - drop-down menu-operators;
	let dropdown_lang_visible: boolean = false;
	let dropdown_theme_visible: boolean = false;
	let dropdown_odds_type_visible: boolean = false;
	let dropdown_bookmakers_visible: boolean = false;
	let dropdown_more_sports_menu: boolean = false;

	let top_nav_dropdown_is_selected: boolean = false;

	// ... CLOSE ALL DROPDOWNS METHOD;
	function closeAllDropdowns() {
		dropdown_lang_visible = false;
		dropdown_theme_visible = false;
		dropdown_odds_type_visible = false;
		dropdown_bookmakers_visible = false;
		dropdown_more_sports_menu = false;
	}

	// ... DECLARATIONS of STATE;
	let selected_sports: string = undefined;

	/**
	 * Description
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... update the navigation page URL dynamically;
	 */

	// ... DEBUGGING;
	$: if (dev) console.debug('-- $page.params --', $page.params);
	$: if (dev) console.debug('-- $page.params.lang --', $page.params.lang);
	// ... get the URL lang-value QUERY;
	let url_Lang = $page.params.lang;

	// ... immediately update the data with the lang;
	let server_side_language: string = 'en';
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}
	// ... DEBUGGING;
	$: if (dev) console.debug('-- server_side_language --', server_side_language);

	// ... wait for the `browser` client for the `localstroage`
	$: if (browser) {
		if (url_Lang != undefined) {
			selectLanguage(url_Lang);
		} else {
			selectLanguage('en');
		}
	}

	// ... immediately update the data with the countryBookemaker;
	$: if (browser) {
		if ($userBetarenaSettings.country_bookmaker == undefined) { 
			// ...
			setUserCountryBookmakerLocation();
		}
	}

	// ~~~~~~~~~~~~~~
	// COMPONENT METHODS
	// ~~~~~~~~~~~~~~
	
	// .. update the user selected language `.localStorage()`
	function selectLanguage(lang: string) {
		// ... DEV-DEBUGGING;
		if (dev) console.debug('updating user translation to ->', lang);
		// ... set the user-lang to corresponding value;
		userBetarenaSettings.setLang(lang);
		// ... hide the LANG DROPDOWN;
		dropdown_lang_visible = false;
		// ... check for EN TRANSLATION;
		if (lang == 'en') {
			goto(`/`);
			// ... otherwise, update page URL with CORRECT TRANSLATION;
		} else {
			goto(`/${lang}`);
		}
	}

	// ... udpate the user selected THEME `.localStorage()`
	function selectedTheme(theme: string) {
		// ... hide the theme dropdown [OPTIONAL];
		// dropdown_theme_visible = false
		// ... update the THEME selection user settings
		userBetarenaSettings.setTheme(theme);
	}

	// ... update the user selected CountryBookmaker `.localStorage()`
	function selectedCountryBookmakers(countryBookemaker: string) {
		// ... hide the countryBookmakers selection [OPTIONAL];
		// dropdown_bookmakers_visible = false
		// ... update the userCountryBookmakerSelection settings;
		userBetarenaSettings.setCountryBookmaker(countryBookemaker.toLocaleLowerCase())
	}

	// ... get user location method;
	async function setUserCountryBookmakerLocation() {
		// ... get user GEO-LOCATION;
		const userGeoResponse: GeoJsResponse = await getUserLocation()
		let userGeo = userGeoResponse.country_code.toLowerCase()
		// ... VALIDATION;
		// ... check that the `country-GEO` is available on the list;
		const result = HEADER_TRANSLATION_DATA.scores_header_translations_dev.find(function(item) { 
			return item.bookmakers_countries.find(function(item_2) { 
				return item_2[0].toString().toLowerCase() === userGeo.toString().toLowerCase() 
			});
		});
		// ... DEBUGGING;
		if (dev) console.debug('result', result)
		// ... declare;
		if (result) {
			selectedCountryBookmakers(userGeo)
		} else {
			selectedCountryBookmakers('en')
		}
	}
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<!-- ... area-outside-for-close-click-DESKTOP-menu -->
{#if dropdown_lang_visible || dropdown_more_sports_menu || dropdown_theme_visible || dropdown_odds_type_visible || dropdown_bookmakers_visible}
	<div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}

<!-- ... header-for-the-page ... -->
<header class="column-space-center">
	{#if HEADER_TRANSLATION_DATA != undefined}
		<!-- ... identify the correct translation via IF -->
		{#each HEADER_TRANSLATION_DATA.scores_header_translations_dev as lang_obj}
			{#if lang_obj.lang == server_side_language}
				<!-- ... header TOP NAVBAR section ... -->
				<div id="top-header" class="row-space-out">
					<!-- ... 1st half of the header nav ... -->
					<div class="row-space-start" style="width: fit-content;">
						<!-- ... menu-burger-bar ... [CONDITIONAL - ONLY TABLET & MOBILE] -->
						{#if tabletExclusive}
							<img
								id="burger-menu"
								src={menu_burger_bar}
								alt="betarena-logo"
								width="24px"
								height="24px"
								on:click={() => (mobileNavToggleMenu = true)}
							/>
						{/if}

						<!-- ... BETARENA LOGO ... -->
						{#if mobileExclusive}
							<!-- ... brand-logo-betarena-for-mobile-ONLY ... -->
							<div id="brand">
								<a sveltekit:prefetch href="/">
									<img src={logo_mini} alt="betarena-logo" width="103px" height="30px" />
								</a>
							</div>
							<!-- ... BETARENA LOGO [DESKTOP ONLY] ... -->
						{:else}
							<!-- ... brand-logo-betarena-for-desktop-ONLY ... -->
							<div id="brand">
								<a sveltekit:prefetch href="/">
									<img
										class="m-r-30"
										src={logo_full}
										alt="betarena-logo"
										width="142px"
										height="30px"
									/>
								</a>
							</div>
						{/if}

						<!-- ... LANGUAGE SELECTION ... -->
						{#if !tabletExclusive}
							<!-- ... language-change-dropdown-select ... -->
							<div id="lang-container" class="m-r-30">
								<!-- ... INIT-selected-lang ... -->
								<div
									id="selected-language-btn"
									class:active-lang-select={dropdown_lang_visible == true}
									class="row-space-out"
									on:click={() => (dropdown_lang_visible = !dropdown_lang_visible)}
								>
									<p class="color-white s-14 mr-5">
										{server_side_language.toUpperCase()}
									</p>
									<!-- ... arrow down [hidden-menu] ... -->
									{#if !dropdown_lang_visible}
										<img src={arrow_down} alt="arrow_down" width="16px" height="16px" />
									{:else}
										<img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
									{/if}
								</div>
								<!-- ... INIT-HIDDEN drop-down menu ... -->
								{#if dropdown_lang_visible}
									<div id="dropdown-menu" transition:fly>
										{#each HEADER_TRANSLATION_DATA.scores_header_translations_dev as lang}
											<div id="lang-select" on:click={() => selectLanguage(lang.lang)}>
												<p class="color-white s-14">
													{lang.lang.toUpperCase()}
												</p>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/if}

						<!-- ... NAV BUTTONS ... -->
						{#if !mobileExclusive}
							{#each HEADER_TRANSLATION_DATA.scores_header_links_dev as lang_link}
								{#if lang_link.lang == server_side_language}
									<!-- ... latest news ... -->
									<a rel="external" href={lang_link.latest_news}>
										<button class="btn-main">
											<p class="color-white s-14">
												{lang_obj.content_platform_link}
											</p>
										</button>
									</a>

									<!-- ... betting-tips ... -->
									<a rel="external" href={lang_link.betting_tips}>
										<button class="btn-main">
											<p class="color-white s-14">
												{lang_obj.betting_tips_link}
											</p>
										</button>
									</a>
								{/if}
							{/each}
						{/if}
					</div>

					<!-- ... 2nd half of the header nav ... -->
					<div class="row-space-start" style="width: fit-content;">
						{#if !tabletExclusive}
							<!-- ... theme-options ... -->
							<div id="theme-opt-container" class="dropdown-opt-box row-space-start">
								<!-- ... name of the container-opt ... -->
								<div
									class="m-r-10"
									on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
								>
									<p class="color-grey s-12 m-b-5">
										{lang_obj.theme}
									</p>
									<div class="row-space-start">
										<img
											class="m-r-5"
											src={light_icon_theme}
											alt="${lang_obj.bookmakers_countries[0][1]}"
											width="16px"
											height="16px"
										/>
										{#each lang_obj.theme_options as theme}
											{#if theme.includes($userBetarenaSettings.theme)}
												<p class="color-white s-14">
													{theme[1]}
												</p>
											{/if}
										{/each}
									</div>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_theme_visible}
									<img
										src={arrow_down_fade}
										alt="arrow_down_fade"
										width="16px"
										height="16px"
										on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
									/>
								{:else}
									<img
										src={arrow_up}
										alt="arrow_up"
										width="16px"
										height="16px"
										on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
									/>
								{/if}
								<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
								{#if dropdown_theme_visible}
									<div id="theme-dropdown-menu" transition:fly>
										{#each lang_obj.theme_options as theme}
											<div
												class="theme-opt-box row-space-out"
												on:click={() => selectedTheme(theme[0])}
											>
												<p class="color-white s-14">
													{theme[1]}
												</p>
												{#if theme.includes($userBetarenaSettings.theme)}
													<img src={icon_check} alt={theme[0]} width="16px" height="16px" />
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- ... odds-type ... -->
							<div
								id="odds-type-container"
								class="dropdown-opt-box row-space-start"
								on:click={() => (dropdown_odds_type_visible = !dropdown_odds_type_visible)}
							>
								<!-- ... name of the container-opt ... -->
								<div class="m-r-10">
									<p class="color-grey s-12 m-b-5">
										{lang_obj.odds}
									</p>
									<p class="color-white s-14">
										{lang_obj.odds_type[0]}
									</p>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_odds_type_visible}
									<img src={arrow_down_fade} alt="arrow_down_fade" width="16px" height="16px" />
								{:else}
									<img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
								{/if}
								<!-- ... INIT-HIDDEN-dropdown-odds-type ... -->
								{#if dropdown_odds_type_visible}
									<!-- ... dropdown-menu ... -->
									<div id="odds-type-dropdown-menu" transition:fly>
										{#each lang_obj.odds_type as odd}
											<div
												class="theme-opt-box"
												on:click={() => (dropdown_odds_type_visible = false)}
											>
												<p class="color-white s-14">
													{odd}
												</p>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- ... bookmakers-type ... -->
							<div
								id="bookmakers-type-container"
								class="dropdown-opt-box row-space-start m-r-30"
								on:click={() => (dropdown_bookmakers_visible = !dropdown_bookmakers_visible)}
							>
								<!-- ... name of the container-opt ... -->
								<div class="m-r-10">
									<p class="color-grey s-12 m-b-5">
										{lang_obj.bookmakers}
									</p>
									<div class="row-space-start">
										{#if $userBetarenaSettings.country_bookmaker != undefined}
											{#each lang_obj.bookmakers_countries as country}
												{#if country.includes($userBetarenaSettings.country_bookmaker.toString().toUpperCase())}
													<img
														class="country-flag m-r-5"
														src="https://betarena.com/images/flags/{country[0]}.svg"
														alt="{country[1]}"
														width="20px"
														height="14px"
													/>
													<p class="color-white s-14">
														{country[1]}
													</p>
												{/if}
											{/each}
										{/if}
									</div>
								</div>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_bookmakers_visible}
									<img src={arrow_down_fade} alt="arrow_down_fade" width="16px" height="16px" />
								{:else}
									<img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
								{/if}
								<!-- ... INIT-HIDDEN-dropdown-bookmakers-type ... -->
								{#if dropdown_bookmakers_visible}
									<div id="bookmakers-type-dropdown-menu" transition:fly>
										{#if $userBetarenaSettings.country_bookmaker != undefined}
											{#each lang_obj.bookmakers_countries as country}
												<div
													class="theme-opt-box row-space-start"
													class:country-selected={country[0] === $userBetarenaSettings.country_bookmaker.toString().toUpperCase()}
													on:click={() => selectedCountryBookmakers(country[0])}
												>
													<img
														class="country-flag m-r-10"
														src="https://betarena.com/images/flags/{country[0]}.svg"
														alt="{country[1]}"
														width="20px"
														height="14px"
													/>
													<p class="color-white s-14">
														{country[1]}
													</p>
												</div>
											{/each}
										{/if}
									</div>
								{/if}
							</div>
						{/if}

						{#if !mobileExclusive}
							<!-- ... sign-in-btn ... -->
							<button id="sign-in-btn">
								<p class="color-white s-14">
									{lang_obj.sign_in}
								</p>
							</button>
						{/if}

						{#if mobileExclusive}
							{#each HEADER_TRANSLATION_DATA.scores_header_links_dev as lang_link}
								{#if lang_link.lang == server_side_language}
									<a rel="external" href={lang_link.betting_tips}>
										<!-- ... betting-tips ... -->
										<p class="color-white s-14">
											{lang_obj.betting_tips_link}
										</p>
									</a>
								{/if}
							{/each}
						{/if}
					</div>
				</div>

				<!-- ... bottom-SPORTS-navbar-values ... -->
				<div id="bottom-header" class="row-space-out">
					<!-- ... sliding-container ... -->
					<div id="bottom-header-inner" class="row-space-out m-r-10" style="width: fit-content;">
						<!-- ... sports-btn values ... -->
						<div class="row-space-out" style="width: fit-content;">
							{#each { length: 7 } as _, i}
								<button
									class="sports-btn m-r-10"
									on:click={() => (selected_sports = lang_obj.sports[i][0])}
									class:selected-sports={selected_sports == lang_obj.sports[i][0]}
								>
									<img
										class="m-r-10"
										src={`/assets/svg/sport-icon/${lang_obj.sports[i][0].toLocaleLowerCase()}.svg`}
										alt="${lang_obj.sports[i][0]}-img"
										width="20px"
										height="20px"
									/>
									<p class="color-white s-14 m-r-10">
										{lang_obj.sports[i][1]}
									</p>
									<p class="color-white s-14 sport-counter">123</p>
								</button>
							{/each}
						</div>
					</div>

					<!-- ... more sports button container menu ... -->
					<div id="more-sports-menu-container">
						<!-- ... menu-more-sports-btn-DESKTOP + TABLET -->
						{#if !mobileExclusive}
							<!-- ... menu-sports-btn ... -->
							<button
								id="more-sports-menu"
								on:click={() => (dropdown_more_sports_menu = !dropdown_more_sports_menu)}
							>
								<img
									class="m-r-10"
									src={menu_sports_icon}
									alt="menu_btn"
									width="20px"
									height="20px"
								/>
								<p class="color-white s-14 m-r-10">
									{lang_obj.more_sports}
								</p>
								<!-- ... arrow down [hidden-menu] ... -->
								{#if !dropdown_more_sports_menu}
									<img src={arrow_down_fade} alt="arrow_down_fade" width="20px" height="20px" />
								{:else}
									<img src={arrow_up} alt="arrow_up" width="20px" height="20px" />
								{/if}
							</button>
							<!-- ... menu-more-sports-btn-mobile -->
						{:else}
							<!-- ... menu-sports-btn ... -->
							<button
								id="more-sports-menu"
								on:click={() => (mobileExclusiveMoreSports = !mobileExclusiveMoreSports)}
							>
								<p class="color-white s-14">
									{lang_obj.more_sports}
								</p>
							</button>
						{/if}
						<!-- ... INIT-HIDDEN-dropdown-more-sports-menu ... -->
						{#if dropdown_more_sports_menu && !mobileExclusive}
							<div id="more-sports-dropdown-menu" transition:fly>
								{#each lang_obj.sports as sport}
									<button
										class="sports-btn row-space-out"
										on:click={() => (dropdown_more_sports_menu = false)}
									>
										<div class="row-space-out" style="width: fit-content;">
											<img
												class="m-r-5"
												src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
												alt="${sport[0]}-img"
												width="20px"
												height="20px"
											/>
											<p class="color-white s-14 m-r-10">
												{sport[1]}
											</p>
										</div>
										<p class="color-white s-14 sport-counter-dark">123</p>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- ... side-bar-[TOP-NAV-BAR] [MOBILE + TABLET] -->
				{#if tabletExclusive || mobileExclusive}
					{#if mobileNavToggleMenu}
						<nav
							class:tablet-exclusive={mobileExclusive == false}
							in:fly={{ x: -200, duration: 500 }}
							out:fly={{ x: -200, duration: 500 }}
						>
							<div>
								<!-- ... top-action-row -->
								<div class="row-space-out">
									<!-- ... close-side-nav ... -->
									<img
										src={close}
										alt="close-icon"
										width="24px"
										height="24px"
										on:click={() => (mobileNavToggleMenu = false)}
									/>

									<div class="row-space-start" style="width: fit-content;">
										<!-- ... language-change-dropdown-select ... -->
										<div id="lang-container" class:m-r-24={mobileExclusive}>
											<!-- ... INIT-selected-lang ... -->
											<div
												id="selected-language-btn"
												class:active-lang-select={dropdown_lang_visible == true}
												class="row-space-out"
												on:click={() => (dropdown_lang_visible = !dropdown_lang_visible)}
											>
												<p class="color-white s-14 mr-5">
													{server_side_language.toUpperCase()}
												</p>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_lang_visible}
													<img src={arrow_down} alt="arrow_down" width="16px" height="16px" />
												{:else}
													<img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
												{/if}
											</div>
											<!-- ... INIT-HIDDEN drop-down menu ... -->
											{#if dropdown_lang_visible}
												<div id="dropdown-menu" transition:fly>
													{#each HEADER_TRANSLATION_DATA.scores_header_translations_dev as lang}
														<div id="lang-select" on:click={() => selectLanguage(lang.lang)}>
															<p class="color-white s-14">
																{lang.lang.toUpperCase()}
															</p>
														</div>
													{/each}
												</div>
											{/if}
										</div>

										<!-- ... sign-in-btn ... -->
										{#if mobileExclusive}
											<button id="sign-in-btn">
												<p class="color-white s-14">
													{lang_obj.sign_in}
												</p>
											</button>
										{/if}
									</div>
								</div>

								<!-- ... menu-nav-action-row-START -->
								<div
									class="column-start-grid-start"
									class:m-t-25={tabletExclusive}
									class:m-t-15={mobileExclusive}
								>
									<!-- ... homepage ... -->
									<div class="side-nav-row">
										<a sveltekit:prefetch href='/'>
											<p class="color-white s-14">
												{lang_obj.homepage}
											</p>
										</a>
									</div>

									<!-- ... link-based-redirects ... -->
									{#each HEADER_TRANSLATION_DATA.scores_header_links_dev as lang_link}
										{#if lang_link.lang == server_side_language}
											<!-- ... latest-news ... -->
											<div class="side-nav-row">
												<a rel="external" href={lang_link.latest_news}>
													<p class="color-white s-14">
														{lang_obj.content_platform_link}
													</p>
												</a>
											</div>

											<!-- ... betting-tips ... -->
											<div class="side-nav-row">
												<a rel="external" href={lang_link.betting_tips}>
													<p class="color-white s-14">
														{lang_obj.betting_tips_link}
													</p>
												</a>
											</div>
										{/if}
									{/each}

									<!-- ... theme-options ... -->
									<div class="side-nav-dropdown m-t-30 m-b-25">
										<!-- ... name of the container-opt ... -->
										<div
											class="m-b-15"
											on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
										>
											<p class="color-grey s-12 m-b-5">
												{lang_obj.theme}
											</p>
											<div class="row-space-out">
												<div class="row-space-start">
													<img
														class="m-r-5"
														src={light_icon_theme}
														alt={lang_obj.bookmakers_countries[0][1]}
														width="16px"
														height="16px"
													/>
													{#each lang_obj.theme_options as theme}
														{#if theme.includes($userBetarenaSettings.theme)}
															<p class="color-white s-14">
																{theme[1]}
															</p>
														{/if}
													{/each}
												</div>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_theme_visible}
													<img
														src={arrow_down_fade}
														alt="arrow_down_fade"
														width="16px"
														height="16px"
													/>
												{:else}
													<img src={arrow_up_fade} alt="arrow_up_fade" width="16px" height="16px" />
												{/if}
											</div>
										</div>
										<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
										{#if dropdown_theme_visible}
											<div transition:fly>
												{#each lang_obj.theme_options as theme}
													<div
														class="side-nav-dropdown-opt row-space-out"
														on:click={() => selectedTheme(theme[0])}
													>
														<p class="color-white s-14">
															{theme[1]}
														</p>
														{#if theme.includes($userBetarenaSettings.theme)}
															<img src={icon_check} alt={theme[0]} width="16px" height="16px" />
														{/if}
													</div>
												{/each}
											</div>
										{/if}
									</div>

									<!-- ... odds-type ... -->
									<div
										class="side-nav-dropdown m-b-25"
										on:click={() => (dropdown_odds_type_visible = !dropdown_odds_type_visible)}
									>
										<!-- ... name of the container-opt ... -->
										<div class="m-b-15">
											<p class="color-grey s-12 m-b-5">
												{lang_obj.odds}
											</p>
											<div class="row-space-out">
												<p class="color-white s-14">
													{lang_obj.odds_type[0]}
												</p>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_odds_type_visible}
													<img
														src={arrow_down_fade}
														alt="arrow_down_fade"
														width="16px"
														height="16px"
													/>
												{:else}
													<img src={arrow_up_fade} alt="arrow_up_fade" width="16px" height="16px" />
												{/if}
											</div>
										</div>
										<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
										{#if dropdown_odds_type_visible}
											<div transition:fly>
												{#each lang_obj.odds_type as odd}
													<div
														class="side-nav-dropdown-opt"
														on:click={() => (dropdown_odds_type_visible = false)}
													>
														<p class="color-white s-14">
															{odd}
														</p>
													</div>
												{/each}
											</div>
										{/if}
									</div>

									<!-- ... bookmakers-type ... -->
									<div
										class="side-nav-dropdown m-b-25"
										on:click={() => (dropdown_bookmakers_visible = !dropdown_bookmakers_visible)}
									>
										<!-- ... name of the container-opt ... -->
										<div class="m-b-15">
											<p class="color-grey s-12 m-b-5">
												{lang_obj.bookmakers}
											</p>
											<div class="row-space-out">
												<div class="row-space-start">
													{#if $userBetarenaSettings.country_bookmaker != undefined}
														{#each lang_obj.bookmakers_countries as country}
															{#if country.includes($userBetarenaSettings.country_bookmaker.toString().toUpperCase())}
																<img
																	class="country-flag m-r-5"
																	src="https://betarena.com/images/flags/{country[0]}.svg"
																	alt="{country[1]}"
																	width="20px"
																	height="14px"
																/>
																<p class="color-white s-14">
																	{country[1]}
																</p>
															{/if}
														{/each}
													{/if}
												</div>
												<!-- ... arrow down [hidden-menu] ... -->
												{#if !dropdown_bookmakers_visible}
													<img
														src={arrow_down_fade}
														alt="arrow_down_fade"
														width="16px"
														height="16px"
													/>
												{:else}
													<img src={arrow_up_fade} alt="arrow_up_fade" width="16px" height="16px" />
												{/if}
											</div>
										</div>
										<!-- ... INIT-HIDDEN-dropdown-theme-select ... -->
										{#if dropdown_bookmakers_visible}
											<div transition:fly>
												{#if $userBetarenaSettings.country_bookmaker != undefined}
													{#each lang_obj.bookmakers_countries as country}
														<div
															class="side-nav-dropdown-opt row-space-start"
															on:click={() => selectedCountryBookmakers(country[0])}
														>
															<div
																class='row-space-start'>
																<img
																	class="country-flag m-r-10"
																	src="https://betarena.com/images/flags/${country[0]}.svg"
																	alt="${country[1]}"
																	width="20px"
																	height="14px"
																/>
																<p class="color-white s-14">
																	{country[1]}
																</p>
															</div>
															{#if country.includes($userBetarenaSettings.country_bookmaker.toString().toUpperCase())}
																<img src={icon_check} alt={country[0]} width="16px" height="16px" />
															{/if}
														</div>
													{/each}
												{/if}
											</div>
										{/if}
									</div>
									<!-- ... END OF SIDE-NAV-MENU ... -->
								</div>
							</div>
						</nav>
					{/if}
				{/if}

				<!-- ... side-bar-[BOTTOM-SPORT-BAR] [MOBILE] -->
				{#if mobileExclusive}
					{#if mobileExclusiveMoreSports}
						<nav
							id="mobile-exclusive-sports-menu"
							in:fly={{ x: 200, duration: 500 }}
							out:fly={{ x: 200, duration: 500 }}
						>
							<div>
								<!-- ... top-action-row -->
								<div class="row-space-out">
									<!-- .. title ... -->
									<p class="s-20 color-white">
										{lang_obj.sports_list}
									</p>

									<!-- ... close-side-nav ... -->
									<img
										src={close}
										alt="close-icon"
										width="24px"
										height="24px"
										on:click={() => (mobileExclusiveMoreSports = false)}
									/>
								</div>

								<!-- ... sports-list-grid ... -->
								<div id="mobile-sports-grid" class="column-start-grid-start m-t-25">
									{#each lang_obj.sports as sport}
										<button class="sports-btn row-space-out">
											<div class="row-space-out" style="width: fit-content;">
												<img
													class="m-r-10"
													src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
													alt="${sport[0]}-img"
													width="20px"
													height="20px"
												/>
												<p class="color-white s-14 m-r-10">
													{sport[1]}
												</p>
											</div>
											<p class="color-white s-14 sport-counter">123</p>
										</button>
									{/each}
								</div>
							</div>
						</nav>
					{/if}
				{/if}
			{/if}
		{/each}
	{/if}
</header>

<!-- ===================
	COMPONENT STYLE
	[MOBILE FIRST]
=================== -->
<style>
	header {
		background-color: #292929;
		height: 128px;
		position: relative;
		z-index: 1000;
	}

	/* 
	top-header-betarena-brand & bottom-header */
	header #top-header,
	header #bottom-header {
		max-width: 1430px;
		position: absolute;
		width: inherit;
	}

	header #top-header {
		padding: 23px 16px;
		height: 72px !important;
		top: 0;
	}

	/* 
	bottom-header-sports-nav */
	header #bottom-header {
		padding: 6px 16px;
		height: 56px !important;
		bottom: 0;
	}
	header #bottom-header-inner::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	header #bottom-header-inner {
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
	}
	nav .side-nav-row:hover p {
		color: #f5620f;
	}
	nav .side-nav-dropdown {
		width: 100%;
		box-shadow: inset 0px -1px 0px #616161;
	}
	nav .side-nav-dropdown-opt {
		width: 100%;
		padding: 9.5px 0;
	}
	nav .side-nav-dropdown-opt p {
		font-weight: 400;
	}

	/* ...
	[MOBILE ONLY] @ < 425px
	SIDE-NAV-BAR-more-menu-sports-navigational-container ... */
	nav#mobile-exclusive-sports-menu {
		padding: 21px 16px;
	}
	nav#mobile-exclusive-sports-menu #mobile-sports-grid {
		gap: 12px;
	}
	nav#mobile-exclusive-sports-menu #mobile-sports-grid .sports-btn:hover {
		border: 1px solid #f5620f !important;
	}

	/*
	LANG SELECT CONTAINER */
	#lang-container {
		position: relative;
	}
	#selected-language-btn {
		color: #ffffff;
		outline: none;
		width: 62px;
		border: none;
		cursor: pointer;
		padding: 5px 12px;
		background-color: transparent;
	}
	#selected-language-btn:hover,
	#selected-language-btn.active-lang-select {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}
	#dropdown-menu {
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
	}
	#lang-select {
		padding: 10px 0;
		text-align: center;
		background: #4b4b4b;
		cursor: pointer;
		box-shadow: inset 0px -1px 0px #3c3c3c;
	}
	#lang-select:hover {
		background: #292929;
		box-shadow: inset 0px -1px 0px #3c3c3c;
	}

	/*
	more-sports-container-menu */
	#more-sports-menu-container {
		position: relative;
	}
	#more-sports-dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0%;
		margin-top: 5px;
		background: #4b4b4b;
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
	}
	#more-sports-dropdown-menu .sports-btn {
		background: #4b4b4b;
		border: 1px solid #8c8c8c !important;
		box-sizing: border-box;
		border-radius: 29px;
		width: 200px;
		height: 44px;
		padding: 8.5px 10px 8.5px 12.5px;
	}
	#more-sports-dropdown-menu .sport-counter-dark {
		background-color: #292929;
		padding: 3px 8px;
		border-radius: 20px;
	}
	#more-sports-dropdown-menu .sports-btn:hover {
		background: #292929;
	}
	#more-sports-dropdown-menu .sports-btn:hover .sport-counter-dark {
		background: #4b4b4b;
	}

	/*
	=============
	BUTTONS 
	*/
	button.btn-main {
		padding: 11px 20px;
		background: transparent;
		border-radius: 29px;
	}
	button.btn-main:hover {
		background: #4b4b4b;
		border-radius: 29px;
	}

	button#sign-in-btn {
		width: 95px;
		height: 44px;
		padding: 12px 26px;
		background: transparent;
		border: 1px solid #ffffff !important;
		box-sizing: border-box;
		border-radius: 8px;
	}
	button#sign-in-btn:hover {
		border: 1px solid #f5620f !important;
	}
	button#sign-in-btn:hover p {
		color: #f5620f;
	}

	button.sports-btn {
		padding: 10.5px 10px 9.5px 16px;
		background: #292929;
		border: 1px solid #4b4b4b !important;
		box-sizing: border-box;
		border-radius: 29px;
		height: 44px;
	}
	button.sports-btn.selected-sports {
		border: 1px solid #f5620f !important;
	}
	button.sports-btn .sport-counter {
		padding: 3px 8px;
		background: #4b4b4b;
		border-radius: 20px;
	}

	button#more-sports-menu {
		padding: 12.5px 16px;
		background: transparent;
		border: 1px solid #4b4b4b !important;
		box-sizing: border-box;
		border-radius: 29px;
		height: 44px;
		position: relative;
	}
	button#more-sports-menu:hover {
		border: 1px solid #ffffff !important;
	}
	button#more-sports-menu::after {
		content: '';
		position: absolute;
		right: 108%;
		height: 44px;
		width: 120px;
		background: linear-gradient(90deg, rgba(41, 41, 41, 0) 0%, #292929 100%);
		pointer-events: none;
	}

	/* 
	OPT-BOX */
	.dropdown-opt-box {
		border-left: 1px solid #4b4b4b;
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
			padding: 23px 34px;
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
			border: 1px solid #ffffff !important;
		}

		/*
		theme-options-container */
		#theme-opt-container,
		#odds-type-container {
			position: relative;
		}
		#theme-dropdown-menu,
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
		}
		#theme-dropdown-menu .theme-opt-box,
		#odds-type-dropdown-menu .theme-opt-box {
			padding: 9.5px 16px;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			background: #4b4b4b;
			height: 40px;
		}
		#theme-dropdown-menu .theme-opt-box:hover p,
		#odds-type-dropdown-menu .theme-opt-box:hover p {
			color: #f5620f;
		}

		/* 
		bookmakers-options-container */
		#bookmakers-type-container {
			position: relative;
		}
		#bookmakers-type-dropdown-menu {
			position: absolute;
			top: 100%;
			right: 0%;
			margin-top: 5px;
			background: #4b4b4b;
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
		}
		#bookmakers-type-dropdown-menu .theme-opt-box {
			height: 40px;
			padding: 13px 8px;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			background: #4b4b4b;
			position: relative;
		}
		#bookmakers-type-dropdown-menu .theme-opt-box:hover,
		#bookmakers-type-dropdown-menu .country-selected {
			background: #292929;
			border-radius: 4px;
		}

		#background-area-close {
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			height: 100%;
			width: 100%;
			z-index: 1000;
		}
	}
</style>
