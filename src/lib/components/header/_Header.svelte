<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">
  
  /**
   * [ℹ] svelte-kit
  */
	import { getStores, navigating, page, session, updated } from '$app/stores';
	import { amp, browser, dev, mode, prerendering } from '$app/env';
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	// const { session } = getStores();

  /**
   * [ℹ] stroes
  */
	import { userBetarenaSettings } from '$lib/store/user-settings';

  /**
   * [ℹ] header-component
  */
	import logo_full from './assets/betarena-logo-full.svg';
	import logo_mini from './assets/betarena-logo-mobile.svg';
	import menu_burger_bar from './assets/menu-burger.svg';
	import icon_check from './assets/icon-check.svg';

  /**
   * [ℹ] sub-header-component
  */
	import close from './assets/close.svg';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_down_fade from './assets/arrow-down-fade.svg';
	import arrow_up from './assets/arrow-up.svg';
	import arrow_up_fade from './assets/arrow-up-fade.svg';
	import light_icon_theme from './assets/theme-light-icon.svg';
	import menu_sports_icon from './assets/menu_sports_icon.svg';

  /**
   * [ℹ] header-types
  */
  import type { Cache_Single_Lang_Header_Translation_Response } from "$lib/models/navbar/types";
	import type { GeoJsResponse } from '$lib/models/geojs-types';
	import { getUserLocation } from '$lib/geoJs/init';

  /**
   * [ℹ] export-values-expected
  */
	export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;

  /**
   * [ℹ] component variables;
  */
 
  let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;
	let mobileNavToggleMenu: boolean = false;
	let mobileExclusiveMoreSports: boolean = false;

  let dropdown_lang_visible: boolean = false;
	let dropdown_theme_visible: boolean = false;
	let dropdown_odds_type_visible: boolean = false;
	let dropdown_bookmakers_visible: boolean = false;
	let dropdown_more_sports_menu: boolean = false;

  let selected_sports: string = 'football';

  let server_side_language: string = 'en';
  let homepageURL: string
  let logoLink: string

  let hideSEO: boolean = false;
  let langSelected: boolean = false;

  /**
   * ~~~~~~~~~~~~~~
   * COMPONENT REACTIVIYY METHODS
   * ~~~~~~~~~~~~~~
  */

  onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// TABLET - VIEW
		if (wInit >= 1160) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// MOBILE - VIEW
		if (wInit < 560) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// TABLET - VIEW
			if (w >= 1160) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// MOBILE - VIEW
			if (w < 560) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});

  // [ℹ] IMPORTANT - LANG SELECTION [SERVER-SIDE-RENDER]
	$: if ($page.routeId != null &&
        !$page.error) {

    if (dev) console.log("Valid Platform Route!")

    if ($page.routeId.includes("[lang=lang]")) {
		  server_side_language = $page.params.lang;
      homepageURL = '/'
      logoLink = $page.url.origin + '/' + server_side_language
    }
    else {
      server_side_language = 'en';
      homepageURL = '/' + $page.params.lang
      logoLink = $page.url.origin
    }

	}
  else {
    server_side_language = 'en';
    homepageURL = '/'
    logoLink = $page.url.origin
  }

	$: if (browser) {

    hideSEO = true

		if (!langSelected) {
      langSelected = true;
      userBetarenaSettings.setLang(server_side_language);
			// selectLanguage(server_side_language);
		}

    setUserCountryBookmakerLocation();
	}

  /**
   * ~~~~~~~~~~~~~~
   * COMPONENT METHODS
   * ~~~~~~~~~~~~~~
  */

  /**
   * [ℹ] update the user selected Language `.localStorage()`
  */
	function selectLanguage(lang: string) {
    
    // [ℹ] get past instance of LANG;
    const pastLang: string = $userBetarenaSettings.lang == "en" ? "/" : "/" + $userBetarenaSettings.lang;

    // [ℹ] set the user-lang to corresponding value;
    userBetarenaSettings.setLang(lang);

    // [🐛] debug;
    if (dev) console.log("Inside Select Langauge!", $userBetarenaSettings.lang, lang, pastLang)

		// [ℹ] hide the LANG DROPDOWN box;
		dropdown_lang_visible = false;

    // [ℹ] update <html {lang} >
    document.documentElement.setAttribute('lang', lang);

    // [ℹ] simply ignore current route
    // [ℹ] & navigate to the homepage (lang)
    if ($page.error) {
      if (lang == 'en') {
        goto('/')
      } else {
        goto(`/${lang}`)
      }
      return;
    }

    // [ℹ] these routes handle the TRANSLATION REDIRECT ROUTE THEMSELVES;
    else if ($page.routeId == "[lang=lang]/[sport]/[country]/[league_name]" ||
        $page.routeId == "[sport]/[country]/[league_name]") {
      // [ℹ] and do-nothing
      return;
    }

    // [ℹ] otherwise, switch navigation for appropiate /<lang>

    // [ℹ] check for EN TRANSLATION;
    else if (lang == 'en' &&  
        pastLang != "/") {
      // prefetch(`/`); [? - maybe ?]

      // [ℹ] count number of slashes URL;
      var count = $page.url.pathname.split("/").length-1
      // [ℹ] replace path-name accordingly for "EN" - first occurance;
      const newURL: string = count == 1 ? $page.url.pathname.replace(pastLang, "/") : $page.url.pathname.replace(pastLang, "");
      // [🐛] debug;
      if (dev) console.log("NEW_URL: Inside EN", count, newURL)

      // [ℹ] update URL breadcrumb;
      // window.history.replaceState({}, "NewPage", newURL);
      goto(newURL, { replaceState: true });
    } 
    // [ℹ] otherwise, check for coming from "EN" (/) 
    // [ℹ] & update page URL with CORRECT TRANSLATION;
    else if (lang != 'en' && 
            pastLang == "/") {

      // [ℹ] count number of slashes URL;
      var countSlash = $page.url.pathname.split("/").length-1
      // [ℹ] replace path-name accordingly for "<lang>" - first occurance;
      const newURL: string = countSlash > 1 ? $page.url.pathname.replace(pastLang, `/${lang}/`) : $page.url.pathname.replace(pastLang, `/${lang}`);
      // [🐛] debug;
      if (dev) console.log(`NEW_URL: Inside V2 ${lang}`, countSlash, newURL)

      // [ℹ] update URL breadcrumb;
      // window.history.replaceState({}, "NewPage", newURL);
      goto(newURL, { replaceState: true });
    }
    // [ℹ] otherwise, check for coming from "[lang]" (/) 
    // [ℹ] & update page URL with CORRECT TRANSLATION;
    else if (lang != 'en' && 
            pastLang != "/") {
      
      // [ℹ] count number of slashes URL;
      var countSlash = $page.url.pathname.split("/").length-1
      // [ℹ] replace path-name accordingly for "<lang>" - first occurance;
      const newURL: string = $page.url.pathname.replace(pastLang, `/${lang}`);
      // [🐛] debug;
      if (dev) console.log(`NEW_URL: Inside V3 ${lang}`, countSlash, newURL)

      // [ℹ] update URL breadcrumb;
      // window.history.replaceState({}, "NewPage", newURL);
      goto(newURL, { replaceState: true });
    }

  }

  /**
   * [ℹ] udpate the user selected THEME `.localStorage()`
  */
	function selectedTheme(theme: string) {
		// [ℹ] hide the theme dropdown [OPTIONAL];
		// dropdown_theme_visible = false
		// [ℹ] update the THEME selection user settings
		userBetarenaSettings.setTheme(theme);
	}

  /**
   * [ℹ] update the user selected CountryBookmaker `.localStorage()`
  */
	function selectedCountryBookmakers(countryBookemaker: string) {
		// [ℹ] hide the countryBookmakers selection [OPTIONAL];
		// dropdown_bookmakers_visible = false
		// [ℹ] update the userCountryBookmakerSelection settings;
		userBetarenaSettings.setCountryBookmaker(countryBookemaker.toLocaleLowerCase())
	}

  /**
   * [ℹ] update the user selected Sport `.localStorage()`
  */
  // TODO:
  function selectedSport(sport: string) {
  }

  /**
   * [ℹ] get & set user location;
  */
	async function setUserCountryBookmakerLocation() {
		// [ℹ] get user GEO-LOCATION;
		const userGeoResponse: GeoJsResponse = await getUserLocation()
		let userGeo = userGeoResponse.country_code.toLowerCase()
		// [ℹ] store as session;
		// $session.geojs = userGeoResponse 
		userBetarenaSettings.setGeoJs(userGeoResponse)
		// [ℹ] VALIDATION: check that the `country-GEO` is available on the list;
		const result = HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries.find(function(item) { 
      return item[0].toString().toLowerCase() === userGeo.toString().toLowerCase() 
    });
		// [ℹ] declare;
		if (result) {
			selectedCountryBookmakers(userGeo)
		} else {
			selectedCountryBookmakers('en')
		}
	}

  /**
   * [ℹ] closes all dropdown boxes;
  */
	function closeAllDropdowns() {
		dropdown_lang_visible = false;
		dropdown_theme_visible = false;
		dropdown_odds_type_visible = false;
		dropdown_bookmakers_visible = false;
		dropdown_more_sports_menu = false;
	}

	/**
   * [ℹ] reload current page;
	*/
  function reloadPage() {
    if ($page.url.pathname.split("/").length-1 == 1) {
      window.location.reload();
    }
	}

</script>


<!-- ===================
	COMPONENT HTML
=================== -->


<!-- [ℹ] area-outside-for-close-click-DESKTOP-menu 
-->
{#if dropdown_lang_visible || 
     dropdown_more_sports_menu || 
     dropdown_theme_visible || 
     dropdown_odds_type_visible || 
     dropdown_bookmakers_visible }
	<div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}


<!-- [ℹ] extra-header-SEO-info 
  TODO: not generating for each LANG
-->
{#if HEADER_TRANSLATION_DATA != undefined &&
     !hideSEO}
  <!-- [ℹ] main-homepage-link-in-all-avaialble-languages
  -->
  {#if HEADER_TRANSLATION_DATA.scores_header_translations_dev.lang != 'en'}
    <!-- [ℹ] content here
    -->
    <a
      sveltekit:prefetch
      href={$page.url.origin + '/' + HEADER_TRANSLATION_DATA.scores_header_translations_dev.lang}>
      <p>{$page.url.origin + '/' + HEADER_TRANSLATION_DATA.scores_header_translations_dev.lang}</p>
    </a>
  {:else}
    <!-- [ℹ] content here 
    -->
    <a
      sveltekit:prefetch
      href={$page.url.origin}>
      <p>{$page.url.origin}</p>
    </a>
  {/if}
{/if}


<!-- [ℹ] header-for-the-page 
-->
<header class="column-space-center">
  {#if HEADER_TRANSLATION_DATA != undefined}

    <!-- [ℹ] identify the correct translation via
    -->
    
    <!-- [ℹ] header TOP NAVBAR section -->
    <div id="top-header" class="row-space-out">
      <!-- [ℹ] 1st half of the header nav -->
      <div class="row-space-start" style="width: fit-content;">
        <!-- [ℹ] menu-burger-bar [ℹ] [CONDITIONAL - ONLY TABLET & MOBILE] -->
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

        <!-- [ℹ] BETARENA LOGO -->
        {#if mobileExclusive}
          <!-- [ℹ] brand-logo-betarena-for-mobile-ONLY -->
          <div id="brand" on:click={() => reloadPage() }>
            <a sveltekit:prefetch href={homepageURL} title={logoLink}>
              <img src={logo_mini} alt="betarena-logo" width="103px" height="30px" />
            </a>
          </div>
          <!-- [ℹ] BETARENA LOGO [DESKTOP ONLY] -->
        {:else}
          <!-- [ℹ] brand-logo-betarena-for-desktop-ONLY -->
          <div id="brand" on:click={() => reloadPage() }>
            <a sveltekit:prefetch href={homepageURL} title={logoLink}>
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

        <!-- [ℹ] LANGUAGE SELECTION -->
        {#if !tabletExclusive}
          <!-- [ℹ] language-change-dropdown-select -->
          <div id="lang-container" class="m-r-30">
            <!-- [ℹ] INIT-selected-lang -->
            <div
              id="selected-language-btn"
              class:active-lang-select={dropdown_lang_visible == true}
              class="row-space-out"
              on:click={() => (dropdown_lang_visible = !dropdown_lang_visible)}
            >
              <p class="color-white s-14 mr-5">
                {server_side_language.toUpperCase()}
              </p>
              <!-- [ℹ] arrow down [hidden-menu] -->
              {#if !dropdown_lang_visible}
                <img src={arrow_down} alt="arrow_down" width="16px" height="16px" />
              {:else}
                <img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
              {/if}
            </div>
            <!-- [ℹ] INIT-HIDDEN drop-down menu -->
            {#if dropdown_lang_visible}
              <div id="dropdown-menu" transition:fly>
                {#each HEADER_TRANSLATION_DATA.langArray as lang}
                  <div id="lang-select" on:click={() => selectLanguage(lang)}>
                    <p class="color-white s-14">
                      {lang.toUpperCase()}
                    </p>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        <!-- [ℹ] NAV BUTTONS -->
        {#if !mobileExclusive}
          <!-- [ℹ] latest news -->
          <a rel="external" href={HEADER_TRANSLATION_DATA.scores_header_links_dev.latest_news}>
            <button class="btn-main">
              <p class="color-white s-14">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.content_platform_link}
              </p>
            </button>
          </a>

          <!-- [ℹ] betting-tips -->
          <a rel="external" href={HEADER_TRANSLATION_DATA.scores_header_links_dev.betting_tips}>
            <button class="btn-main">
              <p class="color-white s-14">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.betting_tips_link}
              </p>
            </button>
          </a>
        {/if}
      </div>

      <!-- [ℹ] 2nd half of the header nav -->
      <div class="row-space-start" style="width: fit-content;">
        {#if !tabletExclusive}
          <!-- [ℹ] theme-options -->
          <div id="theme-opt-container" class="dropdown-opt-box row-space-start">
            <!-- [ℹ] name of the container-opt -->
            <div
              class="m-r-10"
              on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
            >
              <p class="color-grey s-12 m-b-5">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.theme}
              </p>
              <div class="row-space-start">
                <img
                  class="m-r-5"
                  src={light_icon_theme}
                  alt="${HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries[0][1]}"
                  width="16px"
                  height="16px"
                />
                {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.theme_options as theme}
                  {#if theme.includes($userBetarenaSettings.theme)}
                    <p class="color-white s-14">
                      {theme[1]}
                    </p>
                  {/if}
                {/each}
              </div>
            </div>
            <!-- [ℹ] arrow down [hidden-menu] -->
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
            <!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
            {#if dropdown_theme_visible}
              <div id="theme-dropdown-menu" transition:fly>
                {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.theme_options as theme}
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

          <!-- [ℹ] odds-type -->
          <div
            id="odds-type-container"
            class="cursor-not-allowed dropdown-opt-box row-space-start"
            on:click={() => (dropdown_odds_type_visible = !dropdown_odds_type_visible)}
          >
            <!-- [ℹ] name of the container-opt -->
            <div class="m-r-10">
              <p class="color-grey s-12 m-b-5">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.odds}
              </p>
              <p class="color-white s-14">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.odds_type[0]}
              </p>
            </div>
            <!-- [ℹ] arrow down [hidden-menu] -->
            {#if !dropdown_odds_type_visible}
              <img src={arrow_down_fade} alt="arrow_down_fade" width="16px" height="16px" />
            {:else}
              <img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
            {/if}
            <!-- [ℹ] INIT-HIDDEN-dropdown-odds-type -->
            {#if dropdown_odds_type_visible}
              <!-- [ℹ] dropdown-menu -->
              <div id="odds-type-dropdown-menu" transition:fly>
                {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.odds_type as odd}
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

          <!-- [ℹ] bookmakers-type -->
          <div
            id="bookmakers-type-container"
            class="dropdown-opt-box row-space-start m-r-30"
            on:click={() => (dropdown_bookmakers_visible = !dropdown_bookmakers_visible)}
          >
            <!-- [ℹ] name of the container-opt -->
            <div class="m-r-10">
              <p class="color-grey s-12 m-b-5">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers}
              </p>
              <div class="row-space-start">
                {#if $userBetarenaSettings.country_bookmaker != undefined}
                  {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries as country}
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
            <!-- [ℹ] arrow down [hidden-menu] -->
            {#if !dropdown_bookmakers_visible}
              <img src={arrow_down_fade} alt="arrow_down_fade" width="16px" height="16px" />
            {:else}
              <img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
            {/if}
            <!-- [ℹ] INIT-HIDDEN-dropdown-bookmakers-type -->
            {#if dropdown_bookmakers_visible}
              <div id="bookmakers-type-dropdown-menu" transition:fly>
                {#if $userBetarenaSettings.country_bookmaker != undefined}
                  {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries as country}
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
          <!-- [ℹ] sign-in-btn -->
          <button 
            id="sign-in-btn"
            class="cursor-not-allowed">
            <p class="color-white s-14">
              {HEADER_TRANSLATION_DATA.scores_header_translations_dev.sign_in}
            </p>
          </button>
        {/if}

        {#if mobileExclusive}
          <a rel="external" href={HEADER_TRANSLATION_DATA.scores_header_links_dev.betting_tips}>
            <!-- [ℹ] betting-tips -->
            <p class="color-white s-14">
              {HEADER_TRANSLATION_DATA.scores_header_translations_dev.betting_tips_link}
            </p>
          </a>
        {/if}
      </div>
    </div>

    <!-- [ℹ] bottom-SPORTS-navbar-values -->
    <div 
      id="bottom-header" 
      class="row-space-out">
      <!-- [ℹ] sliding-container -->
      <div 
        id="bottom-header-inner" 
        class="row-space-out m-r-10" 
        style="width: fit-content;">
        <!-- [ℹ] sports-btn values -->
        <div 
          class="row-space-out" 
          style="width: fit-content;">

          <!-- -->
          {#each { length: 7 } as _, i}
            <!-- [ℹ] check - if sport is column -->
            {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0].toString().toLowerCase()] != null}
              <!-- content here -->
              <button
                class="sports-btn m-r-10"
                on:click={() => (selected_sports = HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0])}
                class:selected-sports={selected_sports == HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0]} >
                <img
                  class="m-r-10"
                  src={`/assets/svg/sport-icon/${HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0].toLocaleLowerCase()}.svg`}
                  alt="${HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0]}-img"
                  width="20px"
                  height="20px" />

                <p 
                  class="color-white s-14 m-r-10">
                  {HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][1]}
                </p>

                <p 
                  class="color-white s-14 sport-counter">
                  {HEADER_TRANSLATION_DATA.scores_header_fixtures_information[HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0].toString().toLowerCase()]}
                </p>
              </button>
            {:else}
              <!-- else content here -->
              {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as sport}
                <!-- content here -->
                {#if HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0].toString().toLowerCase() === sport[0].toString().toLowerCase()}
                  <!-- content here -->
                  <button
                    class="sports-btn m-r-10 cursor-not-allowed"
                    on:click={() => (selected_sports = HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0])}
                    class:selected-sports={selected_sports == HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0]} >
                    <img
                      class="m-r-10 soon-opacitiy"
                      src={`/assets/svg/sport-icon/${HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0].toLocaleLowerCase()}.svg`}
                      alt="${HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][0]}-img"
                      width="20px"
                      height="20px"
                    />

                    <p 
                      class="color-white s-14 m-r-10 soon-opacitiy">
                      {HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports[i][1]}
                    </p>

                    <p 
                      class="color-white s-14 sport-counter">
                      {sport[1].toString().toLowerCase()}
                    </p>
                  </button>
                {/if}
              {/each}
            {/if}
          {/each}
        </div>
      </div>

      <!-- [ℹ] more sports button container menu -->
      <div 
        id="more-sports-menu-container">
        <!-- [ℹ] menu-more-sports-btn-DESKTOP + TABLET -->
        {#if !mobileExclusive}
          <!-- [ℹ] menu-sports-btn -->
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
              {HEADER_TRANSLATION_DATA.scores_header_translations_dev.more_sports}
            </p>
            <!-- [ℹ] arrow down [hidden-menu] -->
            {#if !dropdown_more_sports_menu}
              <img src={arrow_down_fade} alt="arrow_down_fade" width="20px" height="20px" />
            {:else}
              <img src={arrow_up} alt="arrow_up" width="20px" height="20px" />
            {/if}
          </button>
          <!-- [ℹ] menu-more-sports-btn-mobile -->
        {:else}
          <!-- [ℹ] menu-sports-btn -->
          <button
            id="more-sports-menu"
            on:click={() => (mobileExclusiveMoreSports = !mobileExclusiveMoreSports)}
          >
            <p class="color-white s-14">
              {HEADER_TRANSLATION_DATA.scores_header_translations_dev.more_sports}
            </p>
          </button>
        {/if}
        
        <!-- [ℹ] INIT-HIDDEN-dropdown-more-sports-menu -->
        {#if dropdown_more_sports_menu && !mobileExclusive}
          <!-- -->
          <div 
            id="more-sports-dropdown-menu" 
            transition:fly >
            <!-- -->
            {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports as sport}
              
              <!-- [ℹ] check - if sport is column -->
              {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0].toString().toLowerCase()] != null}
                <button
                  class="sports-btn row-space-out"
                  on:click={() => (dropdown_more_sports_menu = false)} >
                  <!-- -->
                  <div 
                    class="row-space-out" 
                    style="width: fit-content;">
                    <!-- -->
                    <img
                      class="m-r-5"
                      src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                      alt="${sport[0]}-img"
                      width="20px"
                      height="20px"
                    />
                    <p 
                      class="color-white s-14 m-r-10">
                      {sport[1]}
                    </p>
                  </div>
                  <!-- content here -->
                  <p 
                    class="color-white s-14 sport-counter-dark">
                    {HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0].toString()]}
                  </p>
                </button>

              {:else}
                <!-- else content here -->
                {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as _sport}
                  <!-- content here -->
                  {#if sport[0].toString().toLowerCase() === _sport[0].toString().toLowerCase()}
                    <!-- content here -->
                    <button
                      class="sports-btn row-space-out cursor-not-allowed"
                      on:click={() => (dropdown_more_sports_menu = false)} >
                      <!-- -->
                      <div 
                        class="row-space-out" 
                        style="width: fit-content;">
                        <!-- -->
                        <img
                          class="m-r-5 soon-opacitiy"
                          src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                          alt="${sport[0]}-img"
                          width="20px" height="20px"
                        />
                        <p 
                          class="color-white s-14 m-r-10 soon-opacitiy">
                          {sport[1]}
                        </p>
                      </div>
                      <p 
                        class="color-white s-14 sport-counter-dark">
                        {_sport[1].toString().toLowerCase()}
                      </p>
                    </button>
                  {/if}
                {/each}
              {/if}

            {/each}
          </div>
        {/if}
      </div>

    </div>

    <!-- [ℹ] side-bar-[TOP-NAV-BAR] [MOBILE + TABLET] -->
    {#if tabletExclusive || mobileExclusive}
      {#if mobileNavToggleMenu}
        <nav
          class:tablet-exclusive={mobileExclusive == false}
          in:fly={{ x: -200, duration: 500 }}
          out:fly={{ x: -200, duration: 500 }}
        >
          <div>
            <!-- [ℹ] top-action-row -->
            <div class="row-space-out">
              <!-- [ℹ] close-side-nav -->
              <img
                src={close}
                alt="close-icon"
                width="24px"
                height="24px"
                on:click={() => (mobileNavToggleMenu = false)}
              />

              <div class="row-space-start" style="width: fit-content;">
                <!-- [ℹ] language-change-dropdown-select -->
                <div id="lang-container" class:m-r-24={mobileExclusive}>
                  <!-- [ℹ] INIT-selected-lang -->
                  <div
                    id="selected-language-btn"
                    class:active-lang-select={dropdown_lang_visible == true}
                    class="row-space-out"
                    on:click={() => (dropdown_lang_visible = !dropdown_lang_visible)}
                  >
                    <p class="color-white s-14 mr-5">
                      {server_side_language.toUpperCase()}
                    </p>
                    <!-- [ℹ] arrow down [hidden-menu] -->
                    {#if !dropdown_lang_visible}
                      <img src={arrow_down} alt="arrow_down" width="16px" height="16px" />
                    {:else}
                      <img src={arrow_up} alt="arrow_up" width="16px" height="16px" />
                    {/if}
                  </div>
                  <!-- [ℹ] INIT-HIDDEN drop-down menu -->
                  {#if dropdown_lang_visible}
                    <div id="dropdown-menu" transition:fly>
                      {#each HEADER_TRANSLATION_DATA.langArray as lang}
                        <div id="lang-select" on:click={() => selectLanguage(lang)}>
                          <p class="color-white s-14">
                            {lang.toUpperCase()}
                          </p>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>

                <!-- [ℹ] sign-in-btn -->
                {#if mobileExclusive}
                  <button id="sign-in-btn">
                    <p class="color-white s-14">
                      {HEADER_TRANSLATION_DATA.scores_header_translations_dev.sign_in}
                    </p>
                  </button>
                {/if}
              </div>
            </div>

            <!-- [ℹ] menu-nav-action-row-START -->
            <div
              class="column-start-grid-start"
              class:m-t-25={tabletExclusive}
              class:m-t-15={mobileExclusive}
            >
              <!-- [ℹ] homepage -->
              <div class="side-nav-row">
                <a sveltekit:prefetch href='/'>
                  <p class="color-white s-14">
                    {HEADER_TRANSLATION_DATA.scores_header_translations_dev.homepage}
                  </p>
                </a>
              </div>

              <!-- [ℹ] link-based-redirects -->
              <!-- [ℹ] latest-news -->
              <div class="side-nav-row">
                <a rel="external" href={HEADER_TRANSLATION_DATA.scores_header_links_dev.latest_news}>
                  <p class="color-white s-14">
                    {HEADER_TRANSLATION_DATA.scores_header_translations_dev.content_platform_link}
                  </p>
                </a>
              </div>

              <!-- [ℹ] betting-tips -->
              <div class="side-nav-row">
                <a rel="external" href={HEADER_TRANSLATION_DATA.scores_header_links_dev.betting_tips}>
                  <p class="color-white s-14">
                    {HEADER_TRANSLATION_DATA.scores_header_translations_dev.betting_tips_link}
                  </p>
                </a>
              </div>

              <!-- [ℹ] theme-options -->
              <div class="side-nav-dropdown m-t-30 m-b-25">
                <!-- [ℹ] name of the container-opt -->
                <div
                  class="m-b-15"
                  on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
                >
                  <p class="color-grey s-12 m-b-5">
                    {HEADER_TRANSLATION_DATA.scores_header_translations_dev.theme}
                  </p>
                  <div class="row-space-out">
                    <div class="row-space-start">
                      <img
                        class="m-r-5"
                        src={light_icon_theme}
                        alt={HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries[0][1]}
                        width="16px"
                        height="16px"
                      />
                      {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.theme_options as theme}
                        {#if theme.includes($userBetarenaSettings.theme)}
                          <p class="color-white s-14">
                            {theme[1]}
                          </p>
                        {/if}
                      {/each}
                    </div>
                    <!-- [ℹ] arrow down [hidden-menu] -->
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
                <!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
                {#if dropdown_theme_visible}
                  <div transition:fly>
                    {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.theme_options as theme}
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

              <!-- [ℹ] odds-type -->
              <div
                class="side-nav-dropdown m-b-25"
                on:click={() => (dropdown_odds_type_visible = !dropdown_odds_type_visible)}
              >
                <!-- [ℹ] name of the container-opt -->
                <div class="m-b-15">
                  <p class="color-grey s-12 m-b-5">
                    {HEADER_TRANSLATION_DATA.scores_header_translations_dev.odds}
                  </p>
                  <div class="row-space-out">
                    <p class="color-white s-14">
                      {HEADER_TRANSLATION_DATA.scores_header_translations_dev.odds_type[0]}
                    </p>
                    <!-- [ℹ] arrow down [hidden-menu] -->
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
                <!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
                {#if dropdown_odds_type_visible}
                  <div transition:fly>
                    {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.odds_type as odd}
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

              <!-- [ℹ] bookmakers-type -->
              <div
                class="side-nav-dropdown m-b-25"
                on:click={() => (dropdown_bookmakers_visible = !dropdown_bookmakers_visible)}
              >
                <!-- [ℹ] name of the container-opt -->
                <div class="m-b-15">
                  <p class="color-grey s-12 m-b-5">
                    {HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers}
                  </p>
                  <div class="row-space-out">
                    <div class="row-space-start">
                      {#if $userBetarenaSettings.country_bookmaker != undefined}
                        {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries as country}
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
                    <!-- [ℹ] arrow down [hidden-menu] -->
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
                <!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
                {#if dropdown_bookmakers_visible}
                  <div transition:fly>
                    {#if $userBetarenaSettings.country_bookmaker != undefined}
                      {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.bookmakers_countries as country}
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
              <!-- [ℹ] END OF SIDE-NAV-MENU -->
            </div>
          </div>
        </nav>
      {/if}
    {/if}

    <!-- [ℹ] side-bar-[BOTTOM-SPORT-BAR] [MOBILE] -->
    {#if mobileExclusive}
      {#if mobileExclusiveMoreSports}
        <nav
          id="mobile-exclusive-sports-menu"
          in:fly={{ x: 200, duration: 500 }}
          out:fly={{ x: 200, duration: 500 }}
        >
          <div>

            <!-- [ℹ] top-action-row -->
            <div class="row-space-out">
              <!-- .. title -->
              <p class="s-20 color-white">
                {HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports_list}
              </p>

              <!-- [ℹ] close-side-nav -->
              <img
                src={close}
                alt="close-icon"
                width="24px"
                height="24px"
                on:click={() => (mobileExclusiveMoreSports = false)}
              />
            </div>

            <!-- [ℹ] sports-list-grid -->
            <div 
              id="mobile-sports-grid" 
              class="column-start-grid-start m-t-25">
              {#each HEADER_TRANSLATION_DATA.scores_header_translations_dev.sports as sport}
                <!-- [ℹ] check - if sport is column -->
                {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0].toString().toLowerCase()] != null}
                  <button 
                    class="sports-btn row-space-out">
                    <div 
                      class="row-space-out" 
                      style="width: fit-content;">
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
                    <p class="color-white s-14 sport-counter">
                      {HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0].toString().toLowerCase()]}
                    </p>
                  </button>
                {:else}
                  <!-- else content here -->
                  {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as _sport}
                    <!-- -->
                    {#if sport[0].toString().toLowerCase() === _sport[0].toString().toLowerCase()}
                      <button 
                        class="sports-btn row-space-out">
                        <div 
                          class="row-space-out" 
                          style="width: fit-content;">
                          <img
                            class="m-r-10 soon-opacitiy"
                            src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                            alt="${sport[0]}-img"
                            width="20px"
                            height="20px"
                          />
                          <p 
                            class="color-white s-14 m-r-10 soon-opacitiy">
                            {sport[1]}
                          </p>
                        </div>
                        <p 
                          class="color-white s-14 sport-counter">
                          {_sport[1].toString().toLowerCase()}
                        </p>
                      </button>
                    {/if}
                  {/each}
                {/if}
              {/each}
            </div>

          </div>
        </nav>
      {/if}
    {/if}

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

	/* [ℹ] 
	[MOBILE + TABLET] @ < 768px
	SIDE-NAV-BAR-navigational-link [ℹ] */
	nav {
		background-color: #292929;
		height: 100vh;
		width: 100%;
		padding: 14px 16px;
    position: absolute;
    z-index: 1000000000;
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

	/* [ℹ]
	[MOBILE ONLY] @ < 425px
	SIDE-NAV-BAR-more-menu-sports-navigational-container [ℹ] */
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

  .soon-opacitiy {
    opacity: 0.5;
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

		button.sports-btn > div > p {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 85px;
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