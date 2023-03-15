<!-- ===================
COMPONENT JS - BASIC 
[TypeScript]
=================== -->
<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import {
		getUserLocation,
		getUserLocationFromIP
	} from '$lib/geo-js/init';
	import { dlog, dlogv2, NB_W_STY, NB_W_TAG, NB_W_TOG } from '$lib/utils/debug';
	import arrow_down_fade from './assets/arrow-down-fade.svg';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_up_fade from './assets/arrow-up-fade.svg';
	import arrow_up from './assets/arrow-up.svg';
	import logo_full from './assets/betarena-logo-full.svg';
	import logo_mini from './assets/betarena-logo-mobile.svg';
	import close from './assets/close.svg';
	import icon_check from './assets/icon-check.svg';
	import menu_burger_bar from './assets/menu-burger.svg';
	import menu_sports_icon from './assets/menu_sports_icon.svg';
	import profile_avatar from './assets/profile-avatar.svg';
	import light_icon_theme from './assets/theme-light-icon.svg';

	import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/_main_/navbar/types';
	import type { GeoJsResponse } from '$lib/types/geojs-types';

	import { db_firestore } from '$lib/firebase/init';
	import { sessionStore } from '$lib/store/session';
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
	import { doc, updateDoc } from 'firebase/firestore';
	import AuthWidget from '../auth/Auth_Widget.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;

	let mobileNavToggleMenu: boolean = false;
	let mobileExclusiveMoreSports: boolean = false;
	let dropdown_lang_visible: boolean = false;
	let dropdown_theme_visible: boolean = false;
	let dropdown_odds_type_visible: boolean = false;
	let dropdown_bookmakers_visible: boolean = false;
	let dropdown_more_sports_menu: boolean = false;
	let dropdown_user_auth: boolean = false;
	let selected_sports: string = 'football';
	let server_side_language: string = 'en';
	let homepageURL: string;
	let logoLink: string;
	let hideSEO: boolean = false;
	let langSelected: boolean = false;

  const OMIT_URLS: string[] = [
    '/[[lang=lang]]/[sport]/[country]/[league_name]',
    '/[[lang=lang]]/[sport]/[fixture=fixture]'
  ]

  const PROFILE_URL: string = '/u/[view]/[lang=lang]'

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 560;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~


  // Set a Cookie
  function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }

  $: if (browser && $userBetarenaSettings?.user != undefined) {
    let username = 'true';
    setCookie('betarenaCookieLoggedIn', username, 30);
  }

  $: server_side_language = platfrom_lang_ssr(
    $page.route.id,
    $page.error,
    $page.params.lang
  )
  $: homepageURL = 
    server_side_language != 'en'
      ? `/${$page.params.lang}`
      : `/`
  ;
  $: logoLink =
    server_side_language != 'en'
      ? `${$page.url.origin}/${server_side_language}`
      : $page.url.origin
  ;
  $: dlogv2(
    NB_W_TAG,
    [
      `server_side_language: ${server_side_language}`,
      `homepageURL: ${homepageURL}`,
      `logoLink: ${logoLink}`
    ],
    true,
    NB_W_STY
  )

	$: if (browser) {
		hideSEO = true;
		if (!langSelected && $userBetarenaSettings.user == undefined) {
      dlog(`${NB_W_TAG} 🔵 Setting (initial) language!`, NB_W_TOG, NB_W_STY)
			langSelected = true;
			userBetarenaSettings.setLang(
				server_side_language
			);
			// selectLanguage(server_side_language);
		}
		setUserCountryBookmakerLocation();
	}

  let intent_intent_lang: string | undefined = undefined;
  let timeout_intent: NodeJS.Timeout = undefined;
  const HOVER_TIMEOUT = 250;
  function detectIntentBuffer(lang: string): void {
    // [ℹ] detect a change in hover-over lang
    if (timeout_intent != undefined 
    && lang != intent_intent_lang) {
      // [ℹ] clear timer
      dlog(`${NB_W_TAG} clearning timer!`, true, NB_W_STY)
      clearTimeout(timeout_intent)
      intent_intent_lang = lang;
      // start new timer - if lang (target) not undefined
      if (lang == undefined) return
      dlog(`${NB_W_TAG} setting new timer!`, true, NB_W_STY)
      timeout_intent = setTimeout(() => {
        dlog(`${NB_W_TAG} intent triggered!`, true, NB_W_STY)
        $sessionStore.lang_intent = intent_intent_lang;
      }, HOVER_TIMEOUT)
    }
    // otherwise, first time set lang and timer
    else if (lang != undefined 
    && timeout_intent == undefined) {
      intent_intent_lang = lang
      timeout_intent = setTimeout(() => {
        dlog(`${NB_W_TAG} intent triggered!`, true, NB_W_STY)
        $sessionStore.lang_intent = intent_intent_lang;
      }, HOVER_TIMEOUT)
    }
  }

	/**
	 * @description update user selected lang on
	 * localStorage; including complex naviational structure;
	 * holds main platform navigation entry
   * @param {string} lang
	 */
	async function selectLanguage(
    lang: string
  ): Promise<void> {

    // [ℹ] validation (exit);
    if (server_side_language == lang) {
      return;
    }

		// [ℹ] get past instance of LANG;
		const pastLang: string =
      server_side_language == 'en'
				? '/'
				: `/${server_side_language}`
    ;
		// [ℹ] set the user-lang to corresponding value;
		userBetarenaSettings.setLang(lang);

    dlogv2(
      `${NB_W_TAG} selectLanguage()`,
      [
        `$userBetarenaSettings.lang: ${$userBetarenaSettings.lang}`,
        `server_side_language: ${server_side_language}`,
        `lang: ${lang}`,
        `pastLang: ${pastLang}`,
        `$page.route.id: ${$page.route.id}`
      ],
      true,
      NB_W_STY
    )

		// [ℹ] hide lang select dropdown box;
		dropdown_lang_visible = false;

		// [ℹ] update <html {lang} >
		if (lang === 'br') {
			document.documentElement.setAttribute(
				'lang',
				'pt-BR'
			);
		} else {
			document.documentElement.setAttribute(
				'lang',
				lang
			);
		}

		// [ℹ] onError, navigate back to homepage
		if ($page.error && !dev) {
			if (lang == 'en') {
        dlog(`${NB_W_TAG} -> EN`, true, NB_W_STY)
				await goto('/');
			} else {
        dlog(`${NB_W_TAG} -> ${lang}`, true, NB_W_STY)
				await goto(`/${lang}`);
			}
			return;
		}

		// [ℹ] on (special) routes, omit header-intervention;
    // [ℹ] these routes manage their own transaltions (complex);
		else if (OMIT_URLS.includes($page.route.id)) {
      dlog(`${NB_W_TAG} omitting route: ${$page.route.id}`, true, NB_W_STY)
			return;
		}

    // [ℹ] on profile page route, handle;
    else if (PROFILE_URL == $page.route.id) {
      const pastLangV2: string = pastLang == `/` ? `/en` : pastLang
      let tempUrl: string = $page.url.pathname+'/';
			const newURL: string = tempUrl.replace(`${pastLangV2}/`, `/${lang}`);
      dlog(`${NB_W_TAG} inside (PROFILE) ${lang}, pastLangV2: ${pastLangV2}; tempUrl: ${tempUrl}; newURL: ${newURL}`, true, NB_W_STY)
			await goto(newURL, { replaceState: true });
    }

		// [ℹ] otherwise,
		// [ℹ] switch navigation for appropiate /<lang>

		// [ℹ] check for EN TRANSLATION;
		else if (lang == 'en' && pastLang != '/') {

			// prefetch(`/`); [? - maybe ?] // NOTE:

			// [ℹ] count number of slashes URL;
			var count =	$page.url.pathname.split('/').length - 1;
			// [ℹ] replace path-name accordingly for "EN" - first occurance;
			const newURL: string =
				count == 1
					? $page.url.pathname.replace(pastLang, '/')
					: $page.url.pathname.replace(pastLang, '')
      ;
      dlog(`${NB_W_TAG} inside (EN) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`, true, NB_W_STY)

			// [ℹ] update URL breadcrumb;
			// window.history.replaceState({}, "NewPage", newURL);
			await goto(newURL, { replaceState: true });
		}
		// [ℹ] otherwise, check for coming from "EN" (/)
		// [ℹ] & update page URL with CORRECT TRANSLATION;
		else if (lang != 'en' && pastLang == '/') {
			// [ℹ] count number of slashes URL;
			var countSlash = $page.url.pathname.split('/').length - 1;
			// [ℹ] replace path-name accordingly for "<lang>" - first occurance;
			const newURL: string =
				countSlash > 1
					? $page.url.pathname.replace(pastLang, `/${lang}/`)
					: $page.url.pathname.replace(pastLang, `/${lang}`)
      ;
      dlog(`${NB_W_TAG} inside (V2) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`, true, NB_W_STY)

			// [ℹ] update URL breadcrumb;
			// window.history.replaceState({}, "NewPage", newURL);
			await goto(newURL, { replaceState: true });
		}
		// [ℹ] otherwise, check for coming from "[lang]" (/)
		// [ℹ] & update page URL with CORRECT TRANSLATION;
		else if (lang != 'en' && pastLang != '/') {
			// [ℹ] count number of slashes URL;
			var countSlash = $page.url.pathname.split('/').length - 1;
			// [ℹ] replace path-name accordingly for "<lang>" - first occurance;
			const newURL: string = $page.url.pathname.replace(pastLang, `/${lang}`);
      dlog(`${NB_W_TAG} inside (V3) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`, true, NB_W_STY)

			// [ℹ] update URL breadcrumb;
			// window.history.replaceState({}, "NewPage", newURL);
			await goto(newURL, { replaceState: true });
		}
	}

	/**
	 * @description updates user selected 
   * platfrom theme, on localStorage;
   * @param {string} theme
	 */
	function selectedTheme(
    theme: string
  ): void {
		// dropdown_theme_visible = false // FIXME: [OPTIONAL]
		userBetarenaSettings.setTheme(theme);
	}

	/**
	 * @description updates user selected 
   * country-bookmaker, on localStorage;
   * @param {string} theme
	 */
	function selectedCountryBookmakers(
		countryBookemaker: string
	): void {
		// dropdown_bookmakers_visible = false // FIXME: [OPTIONAL]
		// [ℹ] update the userCountryBookmakerSelection settings;
		userBetarenaSettings.setCountryBookmaker(
			countryBookemaker.toLocaleLowerCase()
		);
	}

	/**
	 * @description get & set user country location;
	 */
	async function setUserCountryBookmakerLocation(): Promise<void> {
		// [ℹ] assign pre-set country-code
		if ($userBetarenaSettings.country_bookmaker !== undefined) {
			return;
		}
		const userGeoResponse: GeoJsResponse = await getUserLocation();
    dlog(`${NB_W_TAG} ${userGeoResponse}`, true);

		let userGeo =
			userGeoResponse.country_code === undefined
				? null
				: userGeoResponse.country_code.toLowerCase(); // [?] maybe for dynamic-importing purposes ?

		if (userGeo !== null) {
			// [ℹ] store as session;
			userBetarenaSettings.setGeoJs(userGeoResponse);
			// [ℹ] VALIDATION: check that the `country-GEO` is available on the list;
			const result =
				HEADER_TRANSLATION_DATA.scores_header_translations.bookmakers_countries.find(
					function (item) {
						return (
							item[0].toString().toLowerCase() ===
							userGeo.toString().toLowerCase()
						);
					}
				);

			// [ℹ] declare;
			if (result) {
				selectedCountryBookmakers(userGeo);
			} else {
				selectedCountryBookmakers('en');
			}
		}
		// [ℹ] use default IP europe
		else {
			let userGeoResponse_V2: GeoJsResponse =
				await getUserLocationFromIP(
					'107.189.0.0'
				);
			let userGeo_v2 =
				userGeoResponse_V2.country_code.toLowerCase();

			userBetarenaSettings.setGeoJs(
				userGeoResponse_V2
			);

			// [ℹ] VALIDATION: check that the `country-GEO` is available on the list;
			const result =
				HEADER_TRANSLATION_DATA.scores_header_translations.bookmakers_countries.find(
					function (item) {
						return (
							item[0].toString().toLowerCase() ===
							userGeo_v2.toString().toLowerCase()
						);
					}
				);

			// [ℹ] declare;
			if (result) {
				selectedCountryBookmakers(userGeo_v2);
			} else {
				selectedCountryBookmakers('en');
			}
		}
	}

	/**
	 * @description simply closes all possible 
   * dropdowns open on the widget
   * @return void
	 */
	function closeAllDropdowns(): void {
		dropdown_lang_visible = false;
		dropdown_theme_visible = false;
		dropdown_odds_type_visible = false;
		dropdown_bookmakers_visible = false;
		dropdown_more_sports_menu = false;
		dropdown_user_auth = false;
	}

	/**
	 * @description simply reloads the current page
	 */
	function reloadPage(): void {
		if ($page.url.pathname.split('/').length - 1 == 1) {
			window.location.reload();
		}
	}

  let setUserLang = false;
  $: if ($userBetarenaSettings?.user != undefined 
    && !setUserLang 
    && PROFILE_URL != $page.route.id
  ) {
    setUserLang = true
    let userlang = $userBetarenaSettings.user?.scores_user_data?.lang
    dlog(`${NB_W_TAG} 🔵 User Detected! Setting Auth language! ${userlang}`, NB_W_TOG, NB_W_STY)
    selectLanguage(userlang)
  }

  // [ℹ] (archive) -> && PROFILE_URL == $page.route.id
  $: if ($userBetarenaSettings?.lang 
    && !$page.error
    && $page.route.id
    && $userBetarenaSettings?.user != undefined
    && setUserLang) {
    update_select_lang()
  }

  /**
	 * @description updates user's platform language preferrences
	 * firebase services;
   * @returns {Promise<void>}
	 */
  async function update_select_lang(): Promise<void> {
		const lang = $userBetarenaSettings?.lang;
		dlog(`${NB_W_TAG} 🔵 Updating platform user lang ${lang}`, true);
    // [ℹ] (update)from localStorage()
		userBetarenaSettings.updateLang(
			lang
		);
		// [ℹ] (update)from Firebase - Firestore
		const userRef = doc(
			db_firestore,
			'betarena_users',
			$userBetarenaSettings?.user
				?.firebase_user_data?.uid
		);
		await updateDoc(userRef, {
			lang: lang
		});
		dlog(`${NB_W_TAG} 🟢 User language has been updated`, true);
  }

  /**
	 * @description logout user; and additional ui changes
	 */
	async function logout(): Promise<void> {
    document.cookie = 'betarenaCookieLoggedIn' + '=; Max-Age=0'
    document.cookie = "betarenaCookieLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		dropdown_user_auth = false;
    await goto(`/${$userBetarenaSettings.lang == 'en' ? '' : $userBetarenaSettings.lang}`, { replaceState: true })
		userBetarenaSettings.signOutUser();
    setUserLang = false
	}

  // NOTE: ?
	// afterNavigate(async() => {
	//   await invalidateAll()
	// })

  // TODO:
	// function selectedSport(sport: string) {}
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<!-- 
[ℹ] area outside to close action (outer header)
-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if dropdown_lang_visible || dropdown_more_sports_menu || dropdown_theme_visible || dropdown_odds_type_visible || dropdown_bookmakers_visible || dropdown_user_auth}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<!--
[ℹ] extra-header-SEO-info
TODO:FIXME: not generating for each LANG
-->
{#if HEADER_TRANSLATION_DATA != undefined && !hideSEO}
	<!-- 
  [ℹ] main-homepage-link-in-all-avaialble-languages
  -->
	{#each HEADER_TRANSLATION_DATA.langArray as item}
		{#if item != 'en'}
			<!-- 
      [ℹ] content here
      -->
			<a
				
				href={$page.url.origin + '/' + item}
			>
				<p>{$page.url.origin + '/' + item}</p>
			</a>
		{:else}
			<!-- [ℹ] content here 
      -->
			<a
				
				href={$page.url.origin}
			>
				<p>{$page.url.origin}</p>
			</a>
		{/if}
	{/each}
{/if}

<!-- 
[ℹ] show/hide auth widget
-->
<AuthWidget />

<!-- 
[ℹ] main header INIT
-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<header 
  class="column-space-center"
  class:user-active={PROFILE_URL == $page.route.id}
  class:update-z-index={$sessionStore.livescoreShowCalendar && mobileExclusive}>
	<!-- 
  [ℹ] area outside to close action (inner header)
  -->
	{#if dropdown_lang_visible || dropdown_more_sports_menu || dropdown_theme_visible || dropdown_odds_type_visible || dropdown_bookmakers_visible || dropdown_user_auth}
		<div
			id="background-area-close-inner"
			on:click={() => closeAllDropdowns()}
		/>
	{/if}

	{#if HEADER_TRANSLATION_DATA != undefined}
		<!-- 
    [ℹ] header TOP NAVBAR section 
    -->
		<div 
      id="top-header" 
      class="row-space-out"
    >
			<!-- 
      [ℹ] 1st half of the header nav 
      -->
			<div
				class="row-space-start"
				style="width: fit-content;"
			>
				<!-- 
        [ℹ] menu-burger-bar 
        [ℹ] [TABLET] [MOBILE] 
        -->
				{#if tabletExclusive}
					<img
						id="burger-menu"
						src={menu_burger_bar}
						alt="betarena-logo"
						width="24px"
						height="24px"
						on:click={() =>
							(mobileNavToggleMenu = true)}
					/>
				{/if}

				<!-- 
        [ℹ] BETARENA LOGO [MOBILE ONLY]
        -->
				{#if mobileExclusive}
					<div
						id="brand"
						class="cursor-pointer"
						on:click={() => reloadPage()}
					>
						<a
							
							href={homepageURL}
							title={logoLink}
						>
							<img
								src={logo_mini}
								alt="betarena-logo"
								width="103px"
								height="30px"
							/>
						</a>
					</div>
					<!-- 
        [ℹ] BETARENA LOGO [DESKTOP ONLY] 
        -->
				{:else}
					<div
						id="brand"
						class="cursor-pointer"
						on:click={() => reloadPage()}
					>
						<a
							
							href={homepageURL}
							title={logoLink}
						>
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

				<!-- 
        [ℹ] LANGUAGE SELECTION [DESKTOP]
        -->
				{#if !tabletExclusive}
					<!-- 
          [ℹ] language-change-dropdown-select 
          -->
					<div id="lang-container" class="m-r-30">
						<!-- 
            [ℹ] INIT-selected-lang 
            -->
						<div
							id="selected-language-btn"
							class:active-lang-select={dropdown_lang_visible ==
								true}
							class="row-space-out"
							on:click={() =>
								(dropdown_lang_visible =
									!dropdown_lang_visible)}
						>
							<p
								class="
                  color-white 
                  s-14 
                  mr-5
                "
							>
								{server_side_language.toUpperCase()}
							</p>
							<!-- 
              [ℹ] arrow down [hidden-menu] 
              -->
							<img
								src={!dropdown_lang_visible
									? arrow_down
									: arrow_up}
								alt={!dropdown_lang_visible
									? 'arrow_down'
									: 'arrow_up'}
								width="16"
								height="16"
							/>
						</div>
						<!-- 
            [ℹ] INITIALLY-HIDDEN drop-down menu 
            -->
						{#if dropdown_lang_visible}
							<div
								id="dropdown-menu"
								transition:fly
							>
								{#each HEADER_TRANSLATION_DATA.langArray.sort() as lang}
									{#if lang.toUpperCase() != server_side_language.toUpperCase()}
										<div
											id="lang-select"
											on:click={() =>
												selectLanguage(lang)}
                      on:keydown={() =>
                        selectLanguage(lang)}
                      on:mouseout={() => 
                        detectIntentBuffer(undefined)}
                      on:mouseover={() =>
                         detectIntentBuffer(lang)}
                      on:focus={() => 
                        detectIntentBuffer(lang)}
										>
											<p
												class="
                          color-white 
                          s-14
                        "
											>
												{lang.toUpperCase()}
											</p>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				<!-- 
        [ℹ] NAV BUTTONS [TABLET] [DESKTOP]
        <-contents->
        [ℹ] latest news 
        [ℹ] betting-tips 
        <-conditional->
        -->
        {#if PROFILE_URL != $page.route.id}
          {#if !mobileExclusive}
            <!-- 
            [ℹ] latest news 
            -->
            <a
              rel="external"
              href={HEADER_TRANSLATION_DATA
                .scores_header_links.latest_news}
            >
              <button class="btn-main">
                <p
                  class="
                    color-white 
                    s-14
                  "
                >
                  {HEADER_TRANSLATION_DATA
                    .scores_header_translations
                    .content_platform_link}
                </p>
              </button>
            </a>

            <!-- 
            [ℹ] betting-tips 
            -->
            <a
              rel="external"
              href={HEADER_TRANSLATION_DATA
                .scores_header_links.betting_tips}
            >
              <button class="btn-main">
                <p
                  class="
                    color-white 
                    s-14
                  "
                >
                  {HEADER_TRANSLATION_DATA
                    .scores_header_translations
                    .betting_tips_link}
                </p>
              </button>
            </a>
          {/if}
        {/if}
			</div>

			<!-- 
      [ℹ] 2nd half of the header nav
      <-contents->
      [ℹ] theme-options box
      [ℹ] odds-type box
      [ℹ] bookmakers-type
      [ℹ] sign-in-btn 
      <-conditional->
      -->
			<div
				class="row-space-start"
				style="width: fit-content;"
			>
				{#if !tabletExclusive}
          <!-- 
          [ℹ] theme-options box
          -->
					<div
						id="theme-opt-container"
						class="
              dropdown-opt-box 
              row-space-start
              
            "
            class:m-r-10={PROFILE_URL == $page.route.id}
					>
						<!-- 
            [ℹ] name of the container-opt 
            -->
						<div
							class="m-r-10"
							on:click={() =>
								(dropdown_theme_visible =
									!dropdown_theme_visible)}
						>
							<p
								class="
                  color-grey 
                  s-12 
                  m-b-5
                "
							>
								{HEADER_TRANSLATION_DATA
									.scores_header_translations
									.theme}
							</p>
							<div class="row-space-start">
								<img
									class="m-r-5"
									src={light_icon_theme}
									alt="${HEADER_TRANSLATION_DATA
										.scores_header_translations
										.bookmakers_countries[0][1]}"
									width="16px"
									height="16px"
								/>
								{#each HEADER_TRANSLATION_DATA.scores_header_translations.theme_options as theme}
									{#if theme.includes($userBetarenaSettings.theme)}
										<p
											class="
                        color-white 
                        s-14
                      "
										>
											{theme[1]}
										</p>
									{/if}
								{/each}
							</div>
						</div>
						<!-- 
            [ℹ] arrow down [hidden-menu] 
            -->
						<img
							src={!dropdown_theme_visible
								? arrow_down_fade
								: arrow_up}
							alt={!dropdown_theme_visible
								? 'arrow_down_fade'
								: 'arrow_up'}
							width="16"
							height="16"
							on:click={() =>
								(dropdown_theme_visible =
									!dropdown_theme_visible)}
						/>
						<!-- 
            [ℹ] INIT-HIDDEN-dropdown-theme-select 
            -->
						{#if dropdown_theme_visible}
							<div
								id="theme-dropdown-menu"
								transition:fly
							>
								{#each HEADER_TRANSLATION_DATA.scores_header_translations.theme_options as theme}
									<div
										class="
                      theme-opt-box 
                      row-space-out
                    "
										on:click={() =>
											selectedTheme(theme[0])}
									>
										<p
											class="
                        color-white 
                        s-14
                      "
										>
											{theme[1]}
										</p>
										{#if theme.includes($userBetarenaSettings.theme)}
											<img
												src={icon_check}
												alt={theme[0]}
												width="16px"
												height="16px"
											/>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- 
          [ℹ] odds-type box
          -->
          {#if PROFILE_URL != $page.route.id}
            <div
              id="odds-type-container"
              class="
                cursor-not-allowed 
                dropdown-opt-box 
                row-space-start
              "
              on:click={() =>
                (dropdown_odds_type_visible =
                  !dropdown_odds_type_visible)}
            >
              <!-- 
              [ℹ] name of the container-opt 
              -->
              <div class="m-r-10">
                <p
                  class="
                    color-grey 
                    s-12 
                    m-b-5
                  "
                >
                  {HEADER_TRANSLATION_DATA
                    .scores_header_translations
                    .odds}
                </p>
                <p
                  class="
                    color-white 
                    s-14
                  "
                >
                  {HEADER_TRANSLATION_DATA
                    .scores_header_translations
                    .odds_type[0]}
                </p>
              </div>
              <!-- 
              [ℹ] arrow down [hidden-menu] 
              -->
              <img
                src={!dropdown_odds_type_visible
                  ? arrow_down_fade
                  : arrow_up}
                alt={!dropdown_odds_type_visible
                  ? 'arrow_down_fade'
                  : 'arrow_up'}
                width="16"
                height="16"
              />
              <!-- 
              [ℹ] INIT-HIDDEN-dropdown-odds-type 
              -->
              {#if dropdown_odds_type_visible}
                <!-- 
                [ℹ] dropdown-menu 
                -->
                <div
                  id="odds-type-dropdown-menu"
                  transition:fly
                >
                  {#each HEADER_TRANSLATION_DATA.scores_header_translations.odds_type as odd}
                    <div
                      class="theme-opt-box"
                      on:click={() =>
                        (dropdown_odds_type_visible = false)}
                    >
                      <p
                        class="
                          color-white 
                          s-14
                        "
                      >
                        {odd}
                      </p>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

					<!-- 
          [ℹ] bookmakers-type 
          -->
          {#if PROFILE_URL != $page.route.id}
            <div
              id="bookmakers-type-container"
              class="
                dropdown-opt-box 
                row-space-start 
                m-r-30
              "
              on:click={() =>
                (dropdown_bookmakers_visible =
                  !dropdown_bookmakers_visible)}
            >
              <!-- 
              [ℹ] name of the container-opt 
              -->
              <div class="m-r-10">
                <p
                  class="
                    color-grey 
                    s-12 
                    m-b-5
                  "
                >
                  {HEADER_TRANSLATION_DATA
                    .scores_header_translations
                    .bookmakers}
                </p>
                <div class="row-space-start">
                  {#if $userBetarenaSettings.country_bookmaker != undefined}
                    {#each HEADER_TRANSLATION_DATA.scores_header_translations.bookmakers_countries as country}
                      {#if country.includes($userBetarenaSettings.country_bookmaker
                          .toString()
                          .toUpperCase())}
                        <img
                          class="
                            country-flag 
                            m-r-5
                          "
                          src="https://betarena.com/images/flags/{country[0]}.svg"
                          alt={country[1]}
                          width="20px"
                          height="14px"
                        />
                        <p
                          class="
                            color-white 
                            s-14
                          "
                        >
                          {country[1]}
                        </p>
                      {/if}
                    {/each}
                  {/if}
                </div>
              </div>
              <!-- 
              [ℹ] arrow down [hidden-menu]
              -->
              <img
                src={!dropdown_bookmakers_visible
                  ? arrow_down_fade
                  : arrow_up}
                alt={!dropdown_bookmakers_visible
                  ? 'arrow_down_fade'
                  : 'arrow_up'}
                width="16"
                height="16"
              />
              <!-- 
              [ℹ] INIT-HIDDEN-dropdown-bookmakers-type 
              -->
              {#if dropdown_bookmakers_visible}
                <div
                  id="bookmakers-type-dropdown-menu"
                  transition:fly
                >
                  {#if $userBetarenaSettings.country_bookmaker != undefined}
                    {#each HEADER_TRANSLATION_DATA.scores_header_translations.bookmakers_countries as country}
                      <div
                        class="
                          theme-opt-box 
                          row-space-start
                        "
                        class:country-selected={country[0] ===
                          $userBetarenaSettings.country_bookmaker
                            .toString()
                            .toUpperCase()}
                        on:click={() =>
                          selectedCountryBookmakers(
                            country[0]
                          )}
                      >
                        <img
                          class="
                            country-flag
                            m-r-10
                          "
                          src="https://betarena.com/images/flags/{country[0]}.svg"
                          alt={country[1]}
                          width="20px"
                          height="14px"
                        />
                        <p
                          class="
                            color-white 
                            s-14
                          "
                        >
                          {country[1]}
                        </p>
                      </div>
                    {/each}
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
				{/if}

				<!--
        [ℹ] sign-in-btn 
        [ℹ] <conditional>
        -->
				{#if $userBetarenaSettings?.user == undefined}
					<button
						id="sign-in-btn"
						class="cursor-pointer"
						on:click={() =>
							($sessionStore.auth_show =
								!$sessionStore.auth_show)}
					>
						<p
							class="
              color-white
              s-14
            "
						>
							{HEADER_TRANSLATION_DATA
								.scores_header_translations
								.sign_in}
						</p>
					</button>
				{:else if $userBetarenaSettings?.user != undefined}
					<div
						id="user-profile-box"
						class="row-space-start"
					>
						<!--
            [ℹ] user wallet address
            [ℹ] <conditional>
            -->
						{#if $userBetarenaSettings?.user?.scores_user_data?.web3_wallet_addr != undefined}
							<p
								id="wallet-text"
								class="
                  color-white
                  w-500
                "
							>
								{$userBetarenaSettings?.user?.scores_user_data?.web3_wallet_addr.slice(
									0,
									5
								)}
								...
								{$userBetarenaSettings?.user?.scores_user_data?.web3_wallet_addr.slice(
									-5
								)}
							</p>
						{/if}
						<!--
            [ℹ] user avatar img
            -->
						<img
              id="user-profile-picture"
							src={$userBetarenaSettings?.user
                ?.scores_user_data?.profile_photo ||
                profile_avatar}
							alt="Profile Icon"
							title="Profile Avatar"
							on:click={() =>
								(dropdown_user_auth =
									!dropdown_user_auth)}
							class="cursor-pointer"
              width=44
              height=44
						/>
						<!-- 
            [ℹ] dropdown profile
            -->
						{#if dropdown_user_auth}
							<div id="user-profile-dropdown">
								<!--
                [ℹ] profile page button
                -->
								<a href="/u/dashboard/{$userBetarenaSettings.lang}">
									<div
										class="
                      theme-opt-box
                      cursor-pointer
                    "
                    style="width: 100%;"
										on:click={() =>
											(dropdown_odds_type_visible = false)}
									>
										<p
											class="
                        color-white 
                        s-14
                      "
										>
                      {HEADER_TRANSLATION_DATA?.scores_header_translations?.data?.profile || 'Profile'}
										</p>
									</div>
								</a>
								<!--
                [ℹ] logout page button
                -->
                <div
                  class="
                    theme-opt-box
                    cursor-pointer
                  "
                  on:click={() => logout()}
                >
                  <p
                    class="
                      color-white 
                      s-14
                    "
                  >
                    {HEADER_TRANSLATION_DATA?.scores_header_translations?.data?.logout || 'Logout'}
                  </p>
                </div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!--
    [ℹ] bottom NAV SPORTS navbar values
    <-conditional->
    -->
    {#if PROFILE_URL != $page.route.id}
      <div id="bottom-header" class="row-space-out">
        <!-- 
        [ℹ] sliding-container 
        FIXME: avoid using in-line styles
        -->
        <div
          id="bottom-header-inner"
          class="
            row-space-out 
            m-r-10
          "
          style="width: fit-content;"
        >
          <!-- 
          [ℹ] sports-btn values 
          FIXME: avoid using in-line styles
          -->
          <div
            class="row-space-out"
            style="width: fit-content;"
          >
            <!-- 
            [ℹ] show only first 7 sports
            -->
            {#each { length: 7 } as _, i}
              <!-- 
              [ℹ] check - if "sport" column exists
              [ℹ] meaning "data" exists
              -->
              {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[HEADER_TRANSLATION_DATA.scores_header_translations.sports[i][0]
                  .toString()
                  .toLowerCase()] != null}
                <!-- 
                [ℹ] check if "sport" == "Football"
                -->
                {#if HEADER_TRANSLATION_DATA.scores_header_translations.sports[i][0] == 'football'}
                  <a
                    
                    href={homepageURL}
                    title={logoLink}
                  >
                    <button
                      class="
                        sports-btn 
                        m-r-10
                      "
                      on:click={() =>
                        (selected_sports =
                          HEADER_TRANSLATION_DATA
                            .scores_header_translations
                            .sports[i][0])}
                      class:selected-sports={selected_sports ==
                        HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][0]}
                    >
                      <img
                        class="m-r-10"
                        src={`/assets/svg/sport-icon/${HEADER_TRANSLATION_DATA.scores_header_translations.sports[
                          i
                        ][0].toLocaleLowerCase()}.svg`}
                        alt="${HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][0]}-img"
                        width="20px"
                        height="20px"
                      />
                      <p
                        class="
                          color-white 
                          s-14 
                          m-r-10
                        "
                      >
                        {HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][1]}
                      </p>
                      <p
                        class="
                          color-white 
                          s-14 
                          sport-counter
                        "
                      >
                        {HEADER_TRANSLATION_DATA
                          .scores_header_fixtures_information[
                          HEADER_TRANSLATION_DATA.scores_header_translations.sports[
                            i
                          ][0]
                            .toString()
                            .toLowerCase()
                        ]}
                      </p>
                    </button>
                  </a>
                  <!-- 
                [ℹ] otherwise, standard sport display
                -->
                {:else}
                  <button
                    class="
                      sports-btn 
                      m-r-10
                    "
                    on:click={() =>
                      (selected_sports =
                        HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][0])}
                    class:selected-sports={selected_sports ==
                      HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .sports[i][0]}
                  >
                    <img
                      class="m-r-10"
                      src={`/assets/svg/sport-icon/${HEADER_TRANSLATION_DATA.scores_header_translations.sports[
                        i
                      ][0].toLocaleLowerCase()}.svg`}
                      alt="${HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .sports[i][0]}-img"
                      width="20px"
                      height="20px"
                    />
                    <p
                      class="
                        color-white 
                        s-14 
                        m-r-10
                      "
                    >
                      {HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .sports[i][1]}
                    </p>
                    <p
                      class="
                        color-white 
                        s-14 
                        sport-counter
                      "
                    >
                      {HEADER_TRANSLATION_DATA
                        .scores_header_fixtures_information[
                        HEADER_TRANSLATION_DATA.scores_header_translations.sports[
                          i
                        ][0]
                          .toString()
                          .toLowerCase()
                      ]}
                    </p>
                  </button>
                {/if}
                <!-- 
              [ℹ] otherwise, no-data exists
              [ℹ] and sport should show "soon"
              -->
              {:else}
                {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as sport}
                  {#if HEADER_TRANSLATION_DATA.scores_header_translations.sports[i][0]
                    .toString()
                    .toLowerCase() === sport[0]
                      .toString()
                      .toLowerCase()}
                    <button
                      class="
                        sports-btn 
                        m-r-10 
                        cursor-not-allowed
                      "
                      on:click={() =>
                        (selected_sports =
                          HEADER_TRANSLATION_DATA
                            .scores_header_translations
                            .sports[i][0])}
                      class:selected-sports={selected_sports ==
                        HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][0]}
                    >
                      <img
                        class="
                          m-r-10 
                          soon-opacitiy
                        "
                        src={`/assets/svg/sport-icon/${HEADER_TRANSLATION_DATA.scores_header_translations.sports[
                          i
                        ][0].toLocaleLowerCase()}.svg`}
                        alt="${HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][0]}-img"
                        width="20px"
                        height="20px"
                      />
                      <p
                        class="
                          color-white 
                          s-14 
                          m-r-10 
                          soon-opacitiy
                        "
                      >
                        {HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .sports[i][1]}
                      </p>
                      <p
                        class="
                          color-white 
                          s-14 
                          sport-counter
                        "
                      >
                        {sport[1]
                          .toString()
                          .toLowerCase()}
                      </p>
                    </button>
                  {/if}
                {/each}
              {/if}
            {/each}
          </div>
        </div>

        <!-- 
        [ℹ] "more sports" button box -->
        <div id="more-sports-menu-container">
          <!-- 
          [ℹ] menu-more-sports-btn-DESKTOP + TABLET -->
          {#if !mobileExclusive}
            <!-- 
            [ℹ] menu-sports-btn -->
            <button
              id="more-sports-menu"
              on:click={() =>
                (dropdown_more_sports_menu =
                  !dropdown_more_sports_menu)}
            >
              <img
                class="m-r-10"
                src={menu_sports_icon}
                alt="menu_btn"
                width="20px"
                height="20px"
              />
              <p
                class="
                  color-white 
                  s-14 
                  m-r-10
                "
              >
                {HEADER_TRANSLATION_DATA
                  .scores_header_translations
                  .more_sports}
              </p>
              <!-- 
              [ℹ] arrow down [hidden-menu] 
              -->
              <img
                src={!dropdown_more_sports_menu
                  ? arrow_down_fade
                  : arrow_up}
                alt={!dropdown_more_sports_menu
                  ? 'arrow_down_fade'
                  : 'arrow_up'}
                width="20"
                height="20"
              />
            </button>
            <!-- 
            [ℹ] menu-more-sports-btn-mobile -->
          {:else}
            <button
              id="more-sports-menu"
              on:click={() =>
                (mobileExclusiveMoreSports =
                  !mobileExclusiveMoreSports)}
            >
              <p
                class="
                  color-white 
                  s-14
                "
              >
                {HEADER_TRANSLATION_DATA
                  .scores_header_translations
                  .more_sports}
              </p>
            </button>
          {/if}

          <!-- 
          [ℹ] INIT-HIDDEN-dropdown-more-sports-menu -->
          {#if dropdown_more_sports_menu && !mobileExclusive}
            <div
              id="more-sports-dropdown-menu"
              transition:fly
            >
              {#each HEADER_TRANSLATION_DATA.scores_header_translations.sports as sport}
                <!-- 
                [ℹ] check - if sport is column -->
                {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0]
                    .toString()
                    .toLowerCase()] != null}
                  <button
                    class="
                      sports-btn 
                      row-space-out
                    "
                    on:click={() =>
                      (dropdown_more_sports_menu = false)}
                  >
                    <div
                      class="row-space-out"
                      style="width: fit-content;"
                    >
                      <img
                        class="m-r-5"
                        src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                        alt="${sport[0]}-img"
                        width="20px"
                        height="20px"
                      />
                      <p
                        class="
                          color-white 
                          s-14 
                          m-r-10
                        "
                      >
                        {sport[1]}
                      </p>
                    </div>
                    <p
                      class="
                        color-white 
                        s-14 
                        sport-counter-dark
                      "
                    >
                      {HEADER_TRANSLATION_DATA
                        .scores_header_fixtures_information[
                        sport[0].toString()
                      ]}
                    </p>
                  </button>
                {:else}
                  {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as _sport}
                    {#if sport[0]
                      .toString()
                      .toLowerCase() === _sport[0]
                        .toString()
                        .toLowerCase()}
                      <button
                        class="
                          sports-btn 
                          row-space-out 
                          cursor-not-allowed
                        "
                        on:click={() =>
                          (dropdown_more_sports_menu = false)}
                      >
                        <div
                          class="row-space-out"
                          style="width: fit-content;"
                        >
                          <img
                            class="m-r-5 soon-opacitiy"
                            src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                            alt="${sport[0]}-img"
                            width="20px"
                            height="20px"
                          />
                          <p
                            class="
                              color-white 
                              s-14 
                              m-r-10 
                              soon-opacitiy
                            "
                          >
                            {sport[1]}
                          </p>
                        </div>
                        <p
                          class="
                            color-white 
                            s-14 
                            sport-counter-dark
                          "
                        >
                          {_sport[1]
                            .toString()
                            .toLowerCase()}
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
    {/if}

		<!--
    [ℹ] navbar (side) 
    [ℹ] [MOBILE + TABLET]
    [ℹ] <conditional>
    -->
		{#if tabletExclusive || mobileExclusive}
			{#if mobileNavToggleMenu}
				<nav
					class:tablet-exclusive={mobileExclusive ==
						false}
					in:fly={{ x: -200, duration: 500 }}
					out:fly={{ x: -200, duration: 500 }}
				>
					<div>
						<!-- 
            [ℹ] top-action-row 
            -->
						<div class="row-space-out">
							<!-- 
              [ℹ] close-side-nav 
              -->
							<img
								src={close}
								alt="close-icon"
								width="24px"
								height="24px"
								on:click={() =>
									(mobileNavToggleMenu = false)}
							/>

							<div
								class="row-space-start"
								style="width: fit-content;"
							>
								<!-- 
                [ℹ] language-change-dropdown-select 
                -->
								<div
									id="lang-container"
									class:m-r-24={mobileExclusive}
								>
									<!-- 
                  [ℹ] INIT-selected-lang 
                  -->
									<div
										id="selected-language-btn"
										class:active-lang-select={dropdown_lang_visible ==
											true}
										class="row-space-out"
										on:click={() =>
											(dropdown_lang_visible =
												!dropdown_lang_visible)}
									>
										<p
											class="
                        color-white 
                        s-14 
                        mr-5
                      "
										>
											{server_side_language.toUpperCase()}
										</p>
										<!-- 
                    [ℹ] arrow down [hidden-menu] 
                    -->
										<img
											src={!dropdown_lang_visible
												? arrow_down
												: arrow_up}
											alt={!dropdown_lang_visible
												? 'arrow_down'
												: 'arrow_up'}
											width="16"
											height="16"
										/>
									</div>
									<!-- 
                  [ℹ] INIT-HIDDEN drop-down menu 
                  -->
									{#if dropdown_lang_visible}
										<div
											id="dropdown-menu"
											transition:fly
										>
											{#each HEADER_TRANSLATION_DATA.langArray.sort() as lang}
												{#if lang.toUpperCase() != server_side_language.toUpperCase()}
													<div
														id="lang-select"
														on:click={() =>
															selectLanguage(
																lang
															)}
													>
														<p
															class="color-white s-14"
														>
															{lang.toUpperCase()}
														</p>
													</div>
												{/if}
											{/each}
										</div>
									{/if}
								</div>

								<!-- 
                [ℹ] sign-in-btn 
                -->
								{#if mobileExclusive && PROFILE_URL != $page.route.id}
									<a
										rel="external"
										href={HEADER_TRANSLATION_DATA
											.scores_header_links
											.betting_tips}
									>
										<p
											class="
                        color-white 
                        s-14
                      "
										>
											{HEADER_TRANSLATION_DATA
												.scores_header_translations
												.betting_tips_link}
										</p>
									</a>
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
								<a
									
									href="/"
								>
									<p class="color-white s-14">
										{HEADER_TRANSLATION_DATA
											.scores_header_translations
											.homepage}
									</p>
								</a>
							</div>

              {#if PROFILE_URL != $page.route.id}
                <!-- [ℹ] link-based-redirects -->
                <!-- [ℹ] latest-news -->
                <div class="side-nav-row">
                  <a
                    rel="external"
                    href={HEADER_TRANSLATION_DATA
                      .scores_header_links
                      .latest_news}
                  >
                    <p class="color-white s-14">
                      {HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .content_platform_link}
                    </p>
                  </a>
                </div>

                <!-- [ℹ] betting-tips -->
                <div class="side-nav-row">
                  <a
                    rel="external"
                    href={HEADER_TRANSLATION_DATA
                      .scores_header_links
                      .betting_tips}
                  >
                    <p class="color-white s-14">
                      {HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .betting_tips_link}
                    </p>
                  </a>
                </div>
              {/if}

							<!-- [ℹ] theme-options -->
							<div
								class="side-nav-dropdown m-t-30 m-b-25"
							>
								<!-- [ℹ] name of the container-opt -->
								<div
									class="m-b-15"
									on:click={() =>
										(dropdown_theme_visible =
											!dropdown_theme_visible)}
								>
									<p
										class="color-grey s-12 m-b-5"
									>
										{HEADER_TRANSLATION_DATA
											.scores_header_translations
											.theme}
									</p>
									<div class="row-space-out">
										<div class="row-space-start">
											<img
												class="m-r-5"
												src={light_icon_theme}
												alt={HEADER_TRANSLATION_DATA
													.scores_header_translations
													.bookmakers_countries[0][1]}
												width="16px"
												height="16px"
											/>
											{#each HEADER_TRANSLATION_DATA.scores_header_translations.theme_options as theme}
												{#if theme.includes($userBetarenaSettings.theme)}
													<p
														class="color-white s-14"
													>
														{theme[1]}
													</p>
												{/if}
											{/each}
										</div>
										<!-- 
                    [ℹ] arrow down [hidden-menu] 
                    -->
										<img
											src={!dropdown_theme_visible
												? arrow_down_fade
												: arrow_up_fade}
											alt={!dropdown_theme_visible
												? 'arrow_down_fade'
												: 'arrow_up_fade'}
											width="16"
											height="16"
										/>
									</div>
								</div>
								<!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
								{#if dropdown_theme_visible}
									<div transition:fly>
										{#each HEADER_TRANSLATION_DATA.scores_header_translations.theme_options as theme}
											<div
												class="side-nav-dropdown-opt row-space-out"
												on:click={() =>
													selectedTheme(theme[0])}
											>
												<p
													class="color-white s-14"
												>
													{theme[1]}
												</p>
												{#if theme.includes($userBetarenaSettings.theme)}
													<img
														src={icon_check}
														alt={theme[0]}
														width="16px"
														height="16px"
													/>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- [ℹ] odds-type -->
              {#if PROFILE_URL != $page.route.id}
                <div
                  class="side-nav-dropdown m-b-25"
                  on:click={() =>
                    (dropdown_odds_type_visible =
                      !dropdown_odds_type_visible)}
                >
                  <!-- [ℹ] name of the container-opt -->
                  <div class="m-b-15">
                    <p
                      class="color-grey s-12 m-b-5"
                    >
                      {HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .odds}
                    </p>
                    <div class="row-space-out">
                      <p class="color-white s-14">
                        {HEADER_TRANSLATION_DATA
                          .scores_header_translations
                          .odds_type[0]}
                      </p>
                      <!-- 
                      [ℹ] arrow down [hidden-menu] 
                      -->
                      <img
                        src={!dropdown_odds_type_visible
                          ? arrow_down_fade
                          : arrow_up_fade}
                        alt={!dropdown_odds_type_visible
                          ? 'arrow_down_fade'
                          : 'arrow_up_fade'}
                        width="16"
                        height="16"
                      />
                    </div>
                  </div>
                  <!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
                  {#if dropdown_odds_type_visible}
                    <div transition:fly>
                      {#each HEADER_TRANSLATION_DATA.scores_header_translations.odds_type as odd}
                        <div
                          class="side-nav-dropdown-opt"
                          on:click={() =>
                            (dropdown_odds_type_visible = false)}
                        >
                          <p
                            class="color-white s-14"
                          >
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
                  on:click={() =>
                    (dropdown_bookmakers_visible =
                      !dropdown_bookmakers_visible)}
                >
                  <!-- [ℹ] name of the container-opt -->
                  <div class="m-b-15">
                    <p
                      class="color-grey s-12 m-b-5"
                    >
                      {HEADER_TRANSLATION_DATA
                        .scores_header_translations
                        .bookmakers}
                    </p>
                    <div class="row-space-out">
                      <div class="row-space-start">
                        {#if $userBetarenaSettings.country_bookmaker != undefined}
                          {#each HEADER_TRANSLATION_DATA.scores_header_translations.bookmakers_countries as country}
                            {#if country.includes($userBetarenaSettings.country_bookmaker
                                .toString()
                                .toUpperCase())}
                              <img
                                class="country-flag m-r-5"
                                src="https://betarena.com/images/flags/{country[0]}.svg"
                                alt={country[1]}
                                width="20px"
                                height="14px"
                              />
                              <p
                                class="color-white s-14"
                              >
                                {country[1]}
                              </p>
                            {/if}
                          {/each}
                        {/if}
                      </div>
                      <!-- 
                      [ℹ] arrow down [hidden-menu] 
                      -->
                      <img
                        src={!dropdown_bookmakers_visible
                          ? arrow_down_fade
                          : arrow_up_fade}
                        alt={!dropdown_bookmakers_visible
                          ? arrow_down_fade
                          : arrow_up_fade}
                        width="16"
                        height="16"
                      />
                    </div>
                  </div>
                  <!-- [ℹ] INIT-HIDDEN-dropdown-theme-select -->
                  {#if dropdown_bookmakers_visible}
                    <div transition:fly>
                      {#if $userBetarenaSettings.country_bookmaker != undefined}
                        {#each HEADER_TRANSLATION_DATA.scores_header_translations.bookmakers_countries as country}
                          <div
                            class="side-nav-dropdown-opt row-space-start"
                            on:click={() =>
                              selectedCountryBookmakers(
                                country[0]
                              )}
                          >
                            <div
                              class="row-space-start"
                            >
                              <img
                                class="country-flag m-r-10"
                                src="https://betarena.com/images/flags/${country[0]}.svg"
                                alt="${country[1]}"
                                width="20px"
                                height="14px"
                              />
                              <p
                                class="color-white s-14"
                              >
                                {country[1]}
                              </p>
                            </div>
                            {#if country.includes($userBetarenaSettings.country_bookmaker
                                .toString()
                                .toUpperCase())}
                              <img
                                src={icon_check}
                                alt={country[0]}
                                width="16px"
                                height="16px"
                              />
                            {/if}
                          </div>
                        {/each}
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}
							<!-- [ℹ] END OF SIDE-NAV-MENU -->
						</div>
					</div>
				</nav>
			{/if}
		{/if}

		<!-- 
    [ℹ] side-bar-[BOTTOM-SPORT-BAR] [MOBILE] 
    -->
    {#if PROFILE_URL != $page.route.id}
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
                  {HEADER_TRANSLATION_DATA
                    .scores_header_translations
                    .sports_list}
                </p>

                <!-- [ℹ] close-side-nav -->
                <img
                  src={close}
                  alt="close-icon"
                  width="24px"
                  height="24px"
                  on:click={() =>
                    (mobileExclusiveMoreSports = false)}
                />
              </div>

              <!-- [ℹ] sports-list-grid -->
              <div
                id="mobile-sports-grid"
                class="column-start-grid-start m-t-25"
              >
                {#each HEADER_TRANSLATION_DATA.scores_header_translations.sports as sport}
                  <!-- [ℹ] check - if sport is column -->
                  {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0]
                      .toString()
                      .toLowerCase()] != null}
                    <button
                      class="sports-btn row-space-out"
                    >
                      <div
                        class="row-space-out"
                        style="width: fit-content;"
                      >
                        <img
                          class="m-r-10"
                          src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                          alt="${sport[0]}-img"
                          width="20px"
                          height="20px"
                        />
                        <p
                          class="color-white s-14 m-r-10"
                        >
                          {sport[1]}
                        </p>
                      </div>
                      <p
                        class="color-white s-14 sport-counter"
                      >
                        {HEADER_TRANSLATION_DATA
                          .scores_header_fixtures_information[
                          sport[0]
                            .toString()
                            .toLowerCase()
                        ]}
                      </p>
                    </button>
                  {:else}
                    <!-- else content here -->
                    {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as _sport}
                      <!-- -->
                      {#if sport[0]
                        .toString()
                        .toLowerCase() === _sport[0]
                          .toString()
                          .toLowerCase()}
                        <button
                          class="sports-btn row-space-out"
                        >
                          <div
                            class="row-space-out"
                            style="width: fit-content;"
                          >
                            <img
                              class="m-r-10 soon-opacitiy"
                              src={`/assets/svg/sport-icon/${sport[0].toLocaleLowerCase()}.svg`}
                              alt="${sport[0]}-img"
                              width="20px"
                              height="20px"
                            />
                            <p
                              class="color-white s-14 m-r-10 soon-opacitiy"
                            >
                              {sport[1]}
                            </p>
                          </div>
                          <p
                            class="color-white s-14 sport-counter"
                          >
                            {_sport[1]
                              .toString()
                              .toLowerCase()}
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
	{/if}
</header>

<!-- ===================
COMPONENT STYLE
=================== -->
<style>

  /* #region */

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

  #background-area-close-inner {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  .update-z-index {
		z-index: unset;
  }

	header {
		background-color: #292929;
		height: 128px;
		position: relative;
		z-index: 1000;
	} header.user-active {
		height: 72px !important;
  }

	/* 
	top-header-betarena-brand & bottom-header 
  */
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
	bottom-header-sports-nav 
  */
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
	[MOBILE-ONLY] 
  */
	#burger-menu {
		margin-right: 16.15px;
	}

	/* [ℹ] 
	[MOBILE + TABLET] @ < 768px
	SIDE-NAV-BAR-navigational-link [ℹ] 
  */
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
	SIDE-NAV-BAR-more-menu-sports-navigational-container [ℹ] 
  */
	nav#mobile-exclusive-sports-menu {
		padding: 21px 16px;
	}
	nav#mobile-exclusive-sports-menu
		#mobile-sports-grid {
		gap: 12px;
	}
	nav#mobile-exclusive-sports-menu
		#mobile-sports-grid
		.sports-btn:hover {
		border: 1px solid #f5620f !important;
	}

	/*
	LANG SELECT CONTAINER 
  */
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
	more-sports-container-menu 
  */
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
	#more-sports-dropdown-menu
		.sports-btn:hover
		.sport-counter-dark {
		background: #4b4b4b;
	}

	/*
	=============
	BUTTONS 
	=============
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
  
	img#user-profile-picture {
		border-radius: 50%;
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
		background: linear-gradient(
			90deg,
			rgba(41, 41, 41, 0) 0%,
			#292929 100%
		);
		pointer-events: none;
	}

	/* 
	OPT-BOX 
  */
	.dropdown-opt-box {
		border-left: 1px solid #4b4b4b;
		height: 44px;
		padding: 0 16px;
		width: fit-content;
		cursor: pointer;
	}

	img.country-flag {
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.7) 0%,
			rgba(0, 0, 0, 0.3) 100%
		);
		background-blend-mode: overlay;
		border-radius: 2px;
	}

	/* 
  AUTH BOX 
  */
	div#user-profile-box {
		width: auto;
		position: relative;
	}
	div#user-profile-box div#user-profile-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		left: unset;
		margin-top: 5px;
		background: #292929;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		overflow: hidden;
		z-index: 2000;
		/* height: 80px; */
		width: 168px;
	}
	div#user-profile-box
		div#user-profile-dropdown
		div.theme-opt-box {
		padding: 9.5px 16px;
		box-shadow: inset 0px -1px 0px #3c3c3c;
		background: #4b4b4b;
		height: 40px;
	}
	div#user-profile-box
		div#user-profile-dropdown
		div.theme-opt-box:hover
		p {
		color: #f5620f;
	}
	div#user-profile-box p#wallet-text {
		margin-right: 14px;
	}

	/* 
  RESPONSIVE FOR TABLET (&+) [768px] 
  */
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
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] 
  */
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
		#odds-type-dropdown-menu
			.theme-opt-box:hover
			p {
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
		#bookmakers-type-dropdown-menu
			.theme-opt-box {
			height: 40px;
			padding: 13px 8px;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			background: #4b4b4b;
			position: relative;
		}
		#bookmakers-type-dropdown-menu
			.theme-opt-box:hover,
		#bookmakers-type-dropdown-menu
			.country-selected {
			background: #292929;
			border-radius: 4px;
		}
	}
</style>
