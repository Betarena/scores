<!-- ===================
COMPONENT JS - BASIC 
[TypeScript]
=================== -->
<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import { db_firestore } from '$lib/firebase/init';
	import { setCookie } from '$lib/store/cookie.js';
	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { NB_W_STY, NB_W_TAG, NB_W_TOG, dlog, dlogv2 } from '$lib/utils/debug';
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
	import { doc, updateDoc } from 'firebase/firestore';

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

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import AuthWidget from '../auth/Auth_Widget.svelte';
  import HeaderSportsBtn from './Header-Sports-Btn.svelte';

	import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/_main_/navbar/types';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;

  const OMIT_URLS: string[] = 
  [
    '/[[lang=lang]]/[sport]/[country]/[league_name]',
    '/[[lang=lang]]/[sport]/[fixture=fixture]',
    '/[[lang=lang]]/[player=player]/[...player_fill]'
  ]
  const PROFILE_URL: string = '/u/[view]/[lang=lang]'
  const HOVER_TIMEOUT = 250;

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
	let langSelected: boolean = false;
  let setUserLang = false;
  let intent_intent_lang: string | undefined = undefined;
  let timeout_intent: NodeJS.Timeout = undefined;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const MOBILE_VIEW = 560;
	const TABLET_VIEW = 1160;
	let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount
  (
    async () => 
    {
      [
        tabletExclusive, 
        mobileExclusive
      ] =viewport_change
      (
        TABLET_VIEW, 
        MOBILE_VIEW
      );
      window.addEventListener
      (
        'resize',
        function () 
        {
          [
            tabletExclusive, 
            mobileExclusive
          ] =
          viewport_change
          (
            TABLET_VIEW,
            MOBILE_VIEW
          );
        }
      );
	  }
  );

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

  $: server_side_language = platfrom_lang_ssr
  (
    $page.route.id,
    $page.error,
    $page.params.lang
  );

  /**
   * 
  */
  function detectIntentBuffer
  (
    lang: string
  ): void 
  {
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
	async function selectLanguage
  (
    lang: string
  ): Promise < void > 
  {

    if (server_side_language == lang) return; 

		// past instance of LANG;
		const pastLang: string =
      server_side_language == 'en'
				? '/'
				: `/${server_side_language}`
    ;

    userBetarenaSettings.setLang(lang);

    // [🐞]
    dlogv2
    (
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
    );

		dropdown_lang_visible = false;

		// update <html {lang}>
    let tempLang: string = lang;
    if (lang === 'br') tempLang = 'pt-BR';
    document.documentElement.setAttribute
    (
      'lang',
      tempLang
    );

    // (exit) on-error, navigate back to homepage;
    const if_0 =
      $page.error 
      && !dev
    ;
		if (if_0)
    {
      const targetUrl =
        lang == 'en'
          ? `/`
          : `/${lang}`
      ;

      // [🐞]
      dlog
      (
        `${NB_W_TAG} -> ${lang}`,
         true,
          NB_W_STY
      );

      await goto
      (
        targetUrl
      );

      return;
		}

		// on (special) routes, omit (this method) intervention;
    // these routes manage their own transaltions (complex);
    const if_1 = 
      OMIT_URLS.includes($page.route.id)
    ;
    if (if_1)
    {
      // [🐞]
      dlog
      (
        `${NB_W_TAG} omitting route: ${$page.route.id}`, 
        true, 
        NB_W_STY
      );
			return;
		}
    
    // [ℹ] on profile page route, handle;
    else if (PROFILE_URL == $page.route.id) 
    {
      const pastLangV2: string = pastLang == `/` ? `/en` : pastLang
      let tempUrl: string = $page.url.pathname+'/';
			const newURL: string = tempUrl.replace(`${pastLangV2}/`, `/${lang}`);
      dlog(`${NB_W_TAG} inside (PROFILE) ${lang}, pastLangV2: ${pastLangV2}; tempUrl: ${tempUrl}; newURL: ${newURL}`, true, NB_W_STY)
			await goto(newURL, { replaceState: true });
    }

		// [ℹ] otherwise,
		// [ℹ] switch navigation for appropiate /<lang>

		// [ℹ] check for EN TRANSLATION;
		else if (lang == 'en' && pastLang != '/') 
    {

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
		else if (lang != 'en' && pastLang == '/') 
    {
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
		else if (lang != 'en' && pastLang != '/') 
    {
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
   * @summary [HELPER]
	 * @description updates user selected 
   * platfrom theme, on localStorage;
   * @param {string} theme
   * @returns void
	 */
	function selectedTheme
  (
    theme: string
  ): void 
  {
		// dropdown_theme_visible = false // FIXME: [OPTIONAL]
		userBetarenaSettings.setTheme(theme);
	}

	/**
   * @summary [HELPER]
	 * @description simply closes all possible 
   * dropdowns open on the widget
   * @returns void
	 */
	function closeAllDropdowns
  (
  ): void 
  {
		dropdown_lang_visible = false;
		dropdown_theme_visible = false;
		dropdown_odds_type_visible = false;
		dropdown_bookmakers_visible = false;
		dropdown_more_sports_menu = false;
		dropdown_user_auth = false;
	}

	/**
   * @summary [HELPER]
	 * @description simply reloads the current page;
   * @returns void
	 */
	function reloadPage
  (
  ): void 
  {
		if ($page.url.pathname.split('/').length - 1 == 1) 
    {
			window.location.reload();
		}
	}

  /**
	 * @description updates user's platform language preferrences
	 * firebase services;
   * @returns {Promise<void>}
	 */
  async function update_select_lang
  (
  ): Promise < void > 
  {

    if (!$userBetarenaSettings?.lang 
      || $page.error
      || !$page.route.id
      || $userBetarenaSettings?.user == undefined
      || !setUserLang) {
      return
    }

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
   * @summary [MAIN]
	 * @description logout user; 
   * and additional ui changes;
   * delete cookies;
   * @returns NaN
	 */
	async function logout
  (
  ): Promise < void > 
  { 
    document.cookie = 'betarenaCookieLoggedIn' + '=; Max-Age=0'
    document.cookie = "betarenaCookieLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		dropdown_user_auth = false;
    await goto(`/${$userBetarenaSettings.lang == 'en' ? '' : $userBetarenaSettings.lang}`, { replaceState: true })
		userBetarenaSettings.signOutUser();
    setUserLang = false
	}

  //#endregion ➤ [METHODS]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary [REACTIVE]
   * @description listens to when
   * user (localStorage) not-exists,
   * and initial language has not been set;
  */
  $: if 
  ( 
    browser
    && !langSelected 
    && $userBetarenaSettings.user == undefined
  ) 
  {
    dlog
    (
      `${NB_W_TAG} 🔵 Setting (initial) language!`,
      NB_W_TOG,
      NB_W_STY
    );
    langSelected = true;
    userBetarenaSettings.setLang
    (
      server_side_language
    );
	}

  /**
   * @summary [REACTIVE]
   * @description listens to when
   * user (localStorage) exists,
   * and initial language for (logged-in)
   * user set account has not been set yet;
  */
  $: if 
  (
    $userBetarenaSettings?.user != undefined 
    && !setUserLang 
    && PROFILE_URL != $page.route.id
  ) 
  {
    setUserLang = true
    let userlang = $userBetarenaSettings.user?.scores_user_data?.lang
    dlog(`${NB_W_TAG} 🔵 User Detected! Setting Auth language! ${userlang}`, NB_W_TOG, NB_W_STY)
    selectLanguage
    (
      userlang
    )
  }

  /**
   * @summary [REACTIVE]
   * @description (browser) listens to when
   * user (localStorage) exists, sets cookie;
  */
  $: if 
  (
    browser 
    && $userBetarenaSettings?.user != undefined
  ) 
  {
    let username = 'true';
    setCookie
    (
      'betarenaCookieLoggedIn', 
      username, 
      30
    );
  }

  // [ℹ] (archive) -> && PROFILE_URL == $page.route.id
  $: if 
  (
    $userBetarenaSettings?.lang 
    && !$page.error
    && $page.route.id
    && $userBetarenaSettings?.user != undefined
    && setUserLang
  ) 
  {
    update_select_lang()
  }

  /**
   * @summary [REACTIVE]
   * @description sets (number) of
   * fixtrues today, as MAIN default
   * data point;
  */
  $: if 
  (
    HEADER_TRANSLATION_DATA?.scores_header_fixtures_information
  ) 
  {
    $sessionStore.fixturesTodayNum = parseInt(HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.football)
  }

  $: dropDownArea =
    dropdown_lang_visible 
    || dropdown_more_sports_menu 
    || dropdown_theme_visible 
    || dropdown_odds_type_visible 
    || dropdown_bookmakers_visible 
    || dropdown_user_auth
  ;

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

  $: dlogv2
  (
    NB_W_TAG,
    [
      `server_side_language: ${server_side_language}`,
      `homepageURL: ${homepageURL}`,
      `logoLink: ${logoLink}`
    ],
    NB_W_TOG,
    NB_W_STY
  )

  //#endregion ➤ [REACTIVIY] [METHODS]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] HEADER (OUTER) CLOSE DROPDOWNS AREA
-->
{#if dropDownArea}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<!--
SEO DATA
TODO: FIXME: 
 => not generating for each LANG
-->
<SeoBox>
  <!-- 
  [ℹ] HOMEPAGE LINKS
  -->
  {#each HEADER_TRANSLATION_DATA?.langArray || [] as item}
    {#if item != 'en'}
      <a
        href={$page.url.origin + '/' + item}
      >
        <p>{$page.url.origin + '/' + item}</p>
      </a>
    {:else}
      <a
        href={$page.url.origin}
      >
        <p>{$page.url.origin}</p>
      </a>
    {/if}
  {/each}
</SeoBox>

<AuthWidget />

<!-- 
NAVBAR MAIN
-->
<header 
  class="column-space-center"
  class:user-active={PROFILE_URL == $page.route.id}
  class:update-z-index={$sessionStore.livescoreShowCalendar && mobileExclusive}>

	<!--
  [ℹ] HEADER (INNER) CLOSE DROPDOWNS AREA
  -->
	{#if dropDownArea}
		<div
			id="background-area-close-inner"
			on:click={() => closeAllDropdowns()}
		/>
	{/if}

  <!-- 
  [ℹ] NAVBAR
  -->
	{#if HEADER_TRANSLATION_DATA != undefined}

    <!-- 
    TOP NAVBAR
    -->
		<div
      id="top-header" 
      class="row-space-out"
    >

			<!-- 
      [ℹ] 1st COLUMN
      -->
			<div
				class="row-space-start"
				style="width: fit-content;"
			>
				<!--
        📱 MOBILE 💻 TABLET
        [ℹ] MENU BURGER
        -->
				{#if tabletExclusive}
					<img
            loading="lazy"
						id="burger-menu"
						src={menu_burger_bar}
						alt="betarena-logo"
						width=24
						height=24
						on:click={() =>
							(mobileNavToggleMenu = true)}
					/>
				{/if}

				<!--
        📱 MOBILE 💻 TABLET
        [ℹ] BETARENA BRAND LOGO
        -->
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
              loading="lazy"
              src={mobileExclusive == true ? logo_mini : logo_full}
              alt="betarena-logo"
              width={mobileExclusive == true ? 103 : 142}
              height=30
              class:m-r-30={!mobileExclusive}
            />
          </a>
        </div>

				<!-- 
        🖥️ LAPTOP
        [ℹ] LANGUAGE SELECTION
        -->
				{#if !tabletExclusive}
					<div
            id="lang-container" 
            class="m-r-30"
          >

						<!-- 
            [ℹ] SELECTED LANG
            -->
						<div
							id="selected-language-btn"
							class:active-lang-select={dropdown_lang_visible == true}
							class="row-space-out"
							on:click={() =>	(dropdown_lang_visible = !dropdown_lang_visible)}
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
              ARROW DOWN
              -->
							<img
                loading="lazy"
								src={!dropdown_lang_visible ? arrow_down : arrow_up}
								alt={!dropdown_lang_visible	? 'arrow_down' : 'arrow_up'}
								width="16"
								height="16"
							/>
						</div>

						<!-- 
            [ℹ] DROPDOWN (LANG)
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
											on:click={() =>	selectLanguage(lang)}
                      on:keydown={() => selectLanguage(lang)}
                      on:mouseout={() => detectIntentBuffer(undefined)}
                      on:mouseover={() => detectIntentBuffer(lang)}
                      on:focus={() => detectIntentBuffer(lang)}
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
        💻 TABLET 🖥️ LAPTOP
        EXTERNAL BUTTONS
        -->
        {#if PROFILE_URL != $page.route.id}
          {#if !mobileExclusive}

            <!-- 
            LATEST NEWS
            -->
            <a
              rel="external"
              href={HEADER_TRANSLATION_DATA?.scores_header_links?.latest_news}
            >
              <button 
                class="btn-main">
                <p
                  class="
                    color-white 
                    s-14
                  "
                >
                  {HEADER_TRANSLATION_DATA?.scores_header_translations?.content_platform_link}
                </p>
              </button>
            </a>

            <!-- 
            BETTING TIPS
            -->
            <a
              rel="external"
              href={HEADER_TRANSLATION_DATA?.scores_header_links?.betting_tips}
            >
              <button 
                class="btn-main"
              >
                <p
                  class="
                    color-white 
                    s-14
                  "
                >
                  {HEADER_TRANSLATION_DATA?.scores_header_translations?.betting_tips_link}
                </p>
              </button>
            </a>

          {/if}
        {/if}
			</div>

			<!-- 
      [ℹ] 2nd COLUMN
      -->
			<div
				class="row-space-start"
				style="width: fit-content;"
			>
        <!-- 
        💻 TABLET
        -->
				{#if !tabletExclusive}

          <!-- 
          [ℹ] THEME CONTAINER
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
            SELECTED THEME BOX
            -->
						<div
							class="m-r-10"
							on:click={() =>	(dropdown_theme_visible =	!dropdown_theme_visible)}
						>
							<p
								class="
                  color-grey 
                  s-12 
                  m-b-5
                "
							>
								{HEADER_TRANSLATION_DATA?.scores_header_translations?.theme}
							</p>
							<div 
                class="row-space-start"
              >
								<img
                  loading="lazy"
									class="m-r-5"
									src={light_icon_theme}
									alt={HEADER_TRANSLATION_DATA?.scores_header_translations?.bookmakers_countries?.[0]?.[1]}
									width=16
									height=16
								/>
								{#each HEADER_TRANSLATION_DATA?.scores_header_translations?.theme_options || [] as theme}
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
            [ℹ] ARROW DOWN
            -->
						<img
              loading="lazy"
							src={!dropdown_theme_visible ? arrow_down_fade : arrow_up}
							alt={!dropdown_theme_visible ? 'arrow_down_fade' : 'arrow_up'}
							width="16"
							height="16"
							on:click={() =>	(dropdown_theme_visible =	!dropdown_theme_visible)}
						/>

						<!-- 
            [ℹ] DROPDOWN MENU (THEME)
            -->
						{#if dropdown_theme_visible}
							<div
								id="theme-dropdown-menu"
								transition:fly
							>
								{#each HEADER_TRANSLATION_DATA?.scores_header_translations?.theme_options || [] as theme}
									<div
										class="
                      theme-opt-box 
                      row-space-out
                    "
										on:click={() => selectedTheme(theme[0])}
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
                        loading="lazy"
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
				
          {#if PROFILE_URL != $page.route.id}
            <!-- 
            [ℹ] ODDS-TYPE CONTAINER
            -->
            <div
              id="odds-type-container"
              class="
                cursor-not-allowed 
                dropdown-opt-box 
                row-space-start
              "
              on:click={() => (dropdown_odds_type_visible = !dropdown_odds_type_visible)}
            >

              <!-- 
              SELECTED ODDS-TYPE BOX
              -->
              <div 
                class="m-r-10"
              >
                <p
                  class="
                    color-grey 
                    s-12 
                    m-b-5
                  "
                >
                  {HEADER_TRANSLATION_DATA?.scores_header_translations?.odds}
                </p>
                <p
                  class="
                    color-white 
                    s-14
                  "
                >
                  {HEADER_TRANSLATION_DATA?.scores_header_translations?.odds_type?.[0]}
                </p>
              </div>
              
              <!-- 
              [ℹ] ARROW DOWN
              -->
              <img
                loading="lazy"
                src={!dropdown_odds_type_visible ? arrow_down_fade : arrow_up}
                alt={!dropdown_odds_type_visible ? 'arrow_down_fade' : 'arrow_up'}
                width=16
                height=16
              />

              <!-- 
              [ℹ] DROPDOWN MENU (ODDS-TYPE)
              -->
              {#if dropdown_odds_type_visible}
                <div
                  id="odds-type-dropdown-menu"
                  transition:fly
                >
                  {#each HEADER_TRANSLATION_DATA?.scores_header_translations?.odds_type || [] as odd}
                    <div
                      class="theme-opt-box"
                      on:click={() => (dropdown_odds_type_visible = false)}
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

            <!-- 
            [ℹ] BOOKEMAKERS CONTAINER
            -->
            <div
              id="bookmakers-type-container"
              class="
                dropdown-opt-box 
                row-space-start 
                m-r-30
              "
              on:click={() => (dropdown_bookmakers_visible = !dropdown_bookmakers_visible)}
            >

              <!-- 
              SELECTED BOOKMAKERS BOX
              -->
              <div 
                class="m-r-10"
              >
                <p
                  class="
                    color-grey 
                    s-12 
                    m-b-5
                  "
                >
                  {HEADER_TRANSLATION_DATA?.scores_header_translations?.bookmakers}
                </p>
                <div class="row-space-start">
                  {#if $userBetarenaSettings.country_bookmaker != undefined}
                    {#each HEADER_TRANSLATION_DATA?.scores_header_translations?.bookmakers_countries || [] as country}
                      {#if country.includes($userBetarenaSettings?.country_bookmaker?.toUpperCase())}
                        <img
                          loading="lazy"
                          class="
                            country-flag 
                            m-r-5
                          "
                          src="https://betarena.com/images/flags/{country[0]}.svg"
                          alt={country[1]}
                          width=20
                          height=14
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
              [ℹ] ARROW DOWN
              -->
              <img
                loading="lazy"
                src={!dropdown_bookmakers_visible ? arrow_down_fade : arrow_up}
                alt={!dropdown_bookmakers_visible ? 'arrow_down_fade' : 'arrow_up'}
                width=16
                height=16
              />

              <!-- 
              [ℹ] DROPDOWN MENU (THEME)
              -->
              {#if dropdown_bookmakers_visible}
                <div
                  id="bookmakers-type-dropdown-menu"
                  transition:fly
                >
                  {#if $userBetarenaSettings.country_bookmaker != undefined}
                    {#each HEADER_TRANSLATION_DATA?.scores_header_translations?.bookmakers_countries || [] as country}
                      <div
                        class="
                          theme-opt-box 
                          row-space-start
                        "
                        class:country-selected={country[0] === $userBetarenaSettings.country_bookmaker.toUpperCase()}
                        on:click={() => userBetarenaSettings.setCountryBookmaker(country?.[0].toLocaleLowerCase())}
                      >
                        <img
                          loading="lazy"
                          class="
                            country-flag
                            m-r-10
                          "
                          src="https://betarena.com/images/flags/{country[0]}.svg"
                          alt={country[1]}
                          width=20
                          height=14
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
              loading="lazy"
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
    BOTTOM NAVBAR
    -->
    {#if PROFILE_URL != $page.route.id}
      <div 
        id="bottom-header" 
        class="row-space-out"
      >

        <!-- 
        SPORTS SLIDE CONTAINER
        -->
        <div
          id="bottom-header-inner"
          class="
            row-space-out 
            m-r-10
          "
          style="width: fit-content;"
        >
          <div
            class="row-space-out"
            style="width: fit-content;"
          >
            {#each { length: 7 } as _, i}
              {#if HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.[HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0]?.toString()?.toLowerCase()] != null}
                {#if HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0] == 'football'}
                  <a
                    href={homepageURL}
                    title={logoLink}
                  >
                    <HeaderSportsBtn
                      sportNameDefault={HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0]}
                      sportTranslation={HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[1]}
                      sportValue={HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.[HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0]?.toString()]}
                      selectedSport={selected_sports}
                      on:closeDropdown={(event) => selected_sports = event.detail.selectedSport}
                    />
                  </a>
                {:else}
                  <HeaderSportsBtn
                    sportNameDefault={HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0]}
                    sportTranslation={HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[1]}
                    sportValue={HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.[HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0]?.toString()]}
                    selectedSport={selected_sports}
                    on:closeDropdown={(event) => selected_sports = event.detail.selectedSport}
                  />
                {/if}
              <!-- 
              "SOON" TYPE
              -->
              {:else}
                {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as sport}
                  {#if HEADER_TRANSLATION_DATA.scores_header_translations.sports[i][0].toString().toLowerCase() === sport[0].toString().toLowerCase()}
                    <HeaderSportsBtn
                      sportNameDefault={HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[0]}
                      sportTranslation={HEADER_TRANSLATION_DATA?.scores_header_translations?.sports?.[i]?.[1]}
                      sportValue={sport[1].toString()}
                      selectedSport={selected_sports}
                      on:closeDropdown={(event) => selected_sports = event.detail.selectedSport}
                    />
                  {/if}
                {/each}
              {/if}
            {/each}
          </div>
        </div>

        <!-- 
        MORE SPORTS BOX
        -->
        <div 
          id="more-sports-menu-container"
        >
          <!--
          💻 TABLET 🖥️ LAPTOP
          MORE SPORT BUTTON
          -->
          {#if !mobileExclusive}
            <button
              id="more-sports-menu"
              on:click={() => (dropdown_more_sports_menu = !dropdown_more_sports_menu)}
            >

              <img
                loading="lazy"
                src={menu_sports_icon}
                alt="menu_btn"
                width=20
                height=20
                class="m-r-10"
              />
              <p
                class="
                  color-white 
                  s-14 
                  m-r-10
                "
              >
                {HEADER_TRANSLATION_DATA?.scores_header_translations?.more_sports}
              </p>

              <!-- 
              [ℹ] ARROW DOWN
              -->
              <img
                loading="lazy"
                src={!dropdown_more_sports_menu ? arrow_down_fade : arrow_up}
                alt={!dropdown_more_sports_menu ? 'arrow_down_fade' : 'arrow_up'}
                width=20
                height=20
              />
            </button>

          <!--
          📱 MOBILE
          MORE SPORT BUTTON
          -->
          {:else}
            <button
              id="more-sports-menu"
              on:click={() => (mobileExclusiveMoreSports = !mobileExclusiveMoreSports)}
            >
              <p
                class="
                  color-white 
                  s-14
                "
              >
                {HEADER_TRANSLATION_DATA?.scores_header_translations?.more_sports}
              </p>
            </button>
          {/if}

          <!--
          💻 TABLET 🖥️ LAPTOP
          SPORTS DROPDOWN
          -->
          {#if dropdown_more_sports_menu && !mobileExclusive}
            <div
              id="more-sports-dropdown-menu"
              transition:fly
            >
              {#each HEADER_TRANSLATION_DATA?.scores_header_translations?.sports || [] as sport}
                {#if HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.[sport[0]?.toString()?.toLowerCase()] != null}
                  <HeaderSportsBtn
                    sportNameDefault={sport?.[0]}
                    sportTranslation={sport?.[1]}
                    sportValue={HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.[sport[0]?.toString()]}
                    selectedSport={selected_sports}
                    on:closeDropdown={() => dropdown_more_sports_menu = false}
                  />
                {:else}
                  {#each HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.other_sports || [] as _sport}
                    {#if sport?.[0]?.toString()?.toLowerCase() === _sport?.[0]?.toString()?.toLowerCase()}
                      <HeaderSportsBtn
                        sportNameDefault={sport?.[0]}
                        sportTranslation={sport?.[1]}
                        sportValue={_sport?.[1]}
                        selectedSport={selected_sports}
                        on:closeDropdown={() => dropdown_more_sports_menu = false}
                      />
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
    📱 MOBILE 💻 TABLET
    NAVBAR SIDE/SLIDE
    FIXME: very large chunk 400+ lines of repeating code;
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
                loading="lazy"
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
                      loading="lazy"
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
                        loading="lazy"
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
                      loading="lazy"
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
                            loading="lazy"
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
                        loading="lazy"
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
                                loading="lazy"
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
                        loading="lazy"
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
                            on:click={() => userBetarenaSettings.setCountryBookmaker(country?.[0].toLocaleLowerCase())}
                          >
                            <div
                              class="row-space-start"
                            >
                              <img
                                loading="lazy"
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
                                loading="lazy"
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
    📱 MOBILE
    NAVBAR (MORE SPORTS) SIDE/SLIDE
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

              <div
                class="row-space-out"
              >
                <p 
                  class="
                    s-20 
                    color-white
                  "
                >
                  {HEADER_TRANSLATION_DATA.scores_header_translations.sports_list}
                </p>
                <img
                  loading="lazy"
                  src={close}
                  alt="close-icon"
                  width=24
                  height=24
                  on:click={() => (mobileExclusiveMoreSports = false)}
                />
              </div>

              <!-- 
              SPORT LIST GRID
              -->
              <div
                id="mobile-sports-grid"
                class="
                  column-start-grid-start 
                  m-t-25
                "
              >
                {#each HEADER_TRANSLATION_DATA.scores_header_translations.sports as sport}
                  {#if HEADER_TRANSLATION_DATA.scores_header_fixtures_information[sport[0].toString().toLowerCase()] != null}
                    <HeaderSportsBtn
                      sportNameDefault={sport?.[0]}
                      sportTranslation={sport?.[1]}
                      sportValue={HEADER_TRANSLATION_DATA?.scores_header_fixtures_information?.[sport[0]?.toString()]}
                      selectedSport={selected_sports}
                      on:closeDropdown={() => dropdown_more_sports_menu = false}
                    />
                  {:else}
                    {#each HEADER_TRANSLATION_DATA.scores_header_fixtures_information.other_sports as _sport}
                      {#if sport[0].toString().toLowerCase() === _sport[0].toString().toLowerCase()}
                        <HeaderSportsBtn
                          sportNameDefault={sport?.[0]}
                          sportTranslation={sport?.[1]}
                          sportValue={_sport?.[1]}
                          selectedSport={selected_sports}
                          on:closeDropdown={() => dropdown_more_sports_menu = false}
                        />
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

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  #background-area-close 
  {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  #background-area-close-inner 
  {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  .update-z-index 
  {
		z-index: unset;
  }

	header 
  {
		background-color: #292929;
		height: 128px;
		position: relative;
		z-index: 1000;
	} 
  header.user-active 
  {
		height: 72px !important;
  }

	header #top-header,
	header #bottom-header 
  {
		max-width: 1430px;
		position: absolute;
		width: inherit;
	}

	header #top-header 
  {
		padding: 23px 16px;
		height: 72px !important;
		top: 0;
	}

	header #bottom-header 
  {
		padding: 6px 16px;
		height: 56px !important;
		bottom: 0;
	}
	header #bottom-header-inner::-webkit-scrollbar 
  {
		display: none;
	}
	header #bottom-header-inner 
  {
		overflow-x: scroll;
		overflow-y: hidden;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	
	#burger-menu 
  {
		margin-right: 16.15px;
	}

	nav 
  {
    /* p */
    position: absolute;
		z-index: 1000000000;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
    /* s */
		background-color: #292929;
		height: 100vh;
		width: 100%;
		padding: 14px 16px;
		overflow-y: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	nav::-webkit-scrollbar 
  {
		display: none;
	}
	nav.tablet-exclusive
  {
		padding: 24px 34px;
		max-width: 374px !important;
	}
	nav .side-nav-row
  {
		width: 100%;
		padding: 12px 0;
	}
	nav .side-nav-row:hover p
  {
		color: #f5620f;
	}
	nav .side-nav-dropdown
  {
		width: 100%;
		box-shadow: inset 0px -1px 0px #616161;
	}
	nav .side-nav-dropdown-opt
  {
		width: 100%;
		padding: 9.5px 0;
	}
	nav .side-nav-dropdown-opt p
  {
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
	nav#mobile-exclusive-sports-menu #mobile-sports-grid .sports-btn:hover {
		border: 1px solid #f5620f !important;
	}

	/*
	=> LANG BOX 
  */
	#lang-container
  {
		position: relative;
	}
	#selected-language-btn
  {
		color: #ffffff;
		outline: none;
		width: 62px;
		border: none;
		cursor: pointer;
		padding: 5px 12px;
		background-color: transparent;
	}
	#selected-language-btn:hover,
	#selected-language-btn.active-lang-select
  {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}
	#dropdown-menu
  {
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
	#lang-select
  {
		padding: 10px 0;
		text-align: center;
		background: #4b4b4b;
		cursor: pointer;
		box-shadow: inset 0px -1px 0px #3c3c3c;
	}
	#lang-select:hover
  {
		background: #292929;
		box-shadow: inset 0px -1px 0px #3c3c3c;
	}

	#more-sports-menu-container 
  {
		position: relative;
	}
	#more-sports-dropdown-menu 
  {
    /* p */
		position: absolute;
		top: 100%;
		right: 0%;
		z-index: 2000;
    /* s */
		margin-top: 5px;
		background: #4b4b4b;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		overflow: hidden;
		width: 656px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12px;
		padding: 16px;
		justify-items: start;
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
	=> OPT-BOX 
  */
	.dropdown-opt-box 
  {
		border-left: 1px solid #4b4b4b;
		height: 44px;
		padding: 0 16px;
		width: fit-content;
		cursor: pointer;
	}

	img.country-flag 
  {
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.7) 0%,
			rgba(0, 0, 0, 0.3) 100%
		);
		background-blend-mode: overlay;
		border-radius: 2px;
	}

	/*
  => AUTH BOX 
  */
	div#user-profile-box
  {
		width: auto;
		position: relative;
	}
	div#user-profile-box div#user-profile-dropdown
  {
    /* p */
		position: absolute;
		top: 100%;
		right: 0;
		left: unset;
		z-index: 2000;
    /* s */
		margin-top: 5px;
		background: #292929;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		overflow: hidden;
		width: 168px;
	}
	div#user-profile-box div#user-profile-dropdown div.theme-opt-box
  {
		padding: 9.5px 16px;
		box-shadow: inset 0px -1px 0px #3c3c3c;
		background: #4b4b4b;
		height: 40px;
	}
	div#user-profile-box div#user-profile-dropdown div.theme-opt-box:hover p
  {
		color: #f5620f;
	}
	div#user-profile-box p#wallet-text 
  {
		margin-right: 14px;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

	@media screen 
    and (min-width: 768px) 
  {
		header #top-header
    {
			padding: 23px 34px;
		}
		header #bottom-header
    {
			padding: 6px 34px;
		}

		#burger-menu
    {
			margin-right: 24px;
		}

		button.sports-btn > div > p
    {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 85px;
		}
	}

	@media screen 
    and (min-width: 1024px) 
  {
		button.sports-btn:hover
    {
			border: 1px solid #ffffff !important;
		}

		#theme-opt-container,
		#odds-type-container
    {
			position: relative;
		}

		#theme-dropdown-menu,
		#odds-type-dropdown-menu
    {
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
		#odds-type-dropdown-menu .theme-opt-box
    {
			padding: 9.5px 16px;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			background: #4b4b4b;
			height: 40px;
		}

		#theme-dropdown-menu .theme-opt-box:hover p,
		#odds-type-dropdown-menu .theme-opt-box:hover	p
    {
			color: #f5620f;
		}

		#bookmakers-type-container
    {
			position: relative;
		}

		#bookmakers-type-dropdown-menu
    {
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

		#bookmakers-type-dropdown-menu .theme-opt-box
    {
			height: 40px;
			padding: 13px 8px;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			background: #4b4b4b;
			position: relative;
		}

		#bookmakers-type-dropdown-menu .theme-opt-box:hover,
		#bookmakers-type-dropdown-menu .country-selected
    {
			background: #292929;
			border-radius: 4px;
		}

	}

</style>
