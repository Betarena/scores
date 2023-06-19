<!-- ===================
COMPONENT JS - BASIC
[TypeScript]
=================== -->

<script lang="ts">

  // #region ➤ [MAIN] Package Imports
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
	import { viewport_change } from '$lib/utils/platform-functions';
	import { translationObject } from '$lib/utils/translation.js';
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
	import darkModeVector from './assets/moon-fill.svg';
	import profile_avatar from './assets/profile-avatar.svg';
	import lightModeVector from './assets/sun-fill.svg';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import AuthWidget from '../auth/Auth_Widget.svelte';
  import HeaderSportsBtn from './Header-Sports-Btn.svelte';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
  import HeaderNavBtn from './Header-Nav-Btn.svelte';

  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

	export let WIDGET_T_DATA: B_NAV_T;

  const OMIT_URLS: string[] =
  [
    '/[[lang=lang]]/[sport]/[country]/[league_name]',
    '/[[lang=lang]]/[sport]/[fixture=fixture]',
    '/[[lang=lang]]/[player=player]/[...player_fill]'
  ]
  const PROFILE_URL: string = '/u/[view]/[lang=lang]'
  const HOVER_TIMEOUT = 250;

  const MOBILE_VIEW = 560;
	const TABLET_VIEW = 1160;

	let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	let mobileNavToggleMenu: boolean = false;
	let isLangDropdown: boolean = false;
	let isCurrencyDropdown: boolean = false;
	let isOddsDropdown: boolean = false;
	let isBookmakersDropdown: boolean = false;
	let isUserAuthDropdown: boolean = false;
  let selectedSport: string = 'football';
	let homepageURL: string;
	let logoLink: string;
	let langSelected: boolean = false;
  let setUserLang: boolean = false;
  let intent_intent_lang: string | undefined = undefined;
  let timeout_intent: NodeJS.Timeout = undefined;
  let width: number = 0;

  //#endregion ➤ [VARIABLES]

  // #region ➤ [MAIN-METHODS]

  /**
   * @summary
   * [HELPER]
   * @description
   * ➨ advanced intent (desktop only) function,
   * with the aim of pre-loading target page language
   * switch/navigations from the available list
   * of platform languages, upon hovers;
  */
  function detectIntentBuffer
  (
    lang: string
  ): void
  {
    // CHECK: detect a change in hover-over lang
    const if_M_0: boolean =
      timeout_intent != undefined
      && lang != intent_intent_lang
    ;
    const if_M_E_0: boolean =
      lang != undefined
      && timeout_intent == undefined
    ;
    if (if_M_0)
    {
      // [🐞]
      dlog
      (
        `${NB_W_TAG} clearning timer!`,
        true,
        NB_W_STY
      );

      // clear timer
      clearTimeout(timeout_intent);
      intent_intent_lang = lang;

      if (lang == undefined) return;

      // start new timer;
      // [🐞]
      dlog
      (
        `${NB_W_TAG} setting new timer!`,
        true,
        NB_W_STY
      );

      timeout_intent = setTimeout
      (
        () =>
        {
          dlog(`${NB_W_TAG} intent triggered!`, true, NB_W_STY)
          $sessionStore.lang_intent = intent_intent_lang;
        },
        HOVER_TIMEOUT
      );
    }
    // CHECK: First time set lang and timer
    else if (if_M_E_0)
    {
      intent_intent_lang = lang
      timeout_intent = setTimeout
      (
        () =>
        {
          dlog(`${NB_W_TAG} intent triggered!`, true, NB_W_STY)
          $sessionStore.lang_intent = intent_intent_lang;
        },
        HOVER_TIMEOUT
      )
    }
  }

	/**
   * @summary
   * [HELPER]
	 * @description
   * ➨ updates user selected platfrom theme, on localStorage;
   * @returns
   * void
	 */
	function selectedTheme
  (
  ): void
  {
    const newTheme: string =
      $userBetarenaSettings.theme == 'Dark'
        ? 'Ligth'
        : 'Dark'
    ;
		userBetarenaSettings.setTheme
    (
      newTheme
    );
	}

	/**
   * @summary
   * [HELPER]
	 * @description
   * ➨ simply closes all possible dropdowns open on the widget;
   * @returns
   * void
	 */
	function closeAllDropdowns
  (
  ): void
  {
		isLangDropdown = false;
		isOddsDropdown = false;
		isBookmakersDropdown = false;
		isUserAuthDropdown = false;
	}

	/**
   * @summary
   * [HELPER]
	 * @description
   * ➨ simply reloads the current page;
   * @returns
   * void
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

  function calcNavTrianglePos
  (
    mainActive?: string
  ): void
  {
    const parentPos: DOMRect = document.getElementById('navBox').getBoundingClientRect();

    const if_M_0: boolean =
      document.getElementById($sessionStore.navBtnHover || mainActive) == undefined
    ;
    if (if_M_0) return;

    const childPos: DOMRect  = document.getElementById($sessionStore.navBtnHover || mainActive).getBoundingClientRect();
    const relativePos =
    {
      top: (childPos.top - parentPos.top),
      right: (childPos.right - parentPos.right),
      bottom: (childPos.bottom - parentPos.bottom),
      left: (childPos.left - parentPos.left)
    };

    width = relativePos.left + (childPos.width/2) - 32;
  }

  /**
   * @summary
   * [HELPER]
	 * @description
   * ➨ updates user's platform language preferrences, firebase services;
   * @returns
   * {Promise<void>}
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
   * @summary
   * IMPORTANT
   * [MAIN]
	 * @description
   * ➨ update user selected lang on localStorage; including complex naviational structure;
	 * ➨ holds main platform navigation entry
   * @param
   * {string} lang
	 */
	async function selectLanguage
  (
    lang: string
  ): Promise < void >
  {

    if ($sessionStore?.serverLang == lang) return;

		// past instance of LANG;
		const pastLang: string =
      $sessionStore?.serverLang == 'en'
				? '/'
				: `/${$sessionStore?.serverLang}`
    ;

    userBetarenaSettings.setLang(lang);

    // [🐞]
    dlogv2
    (
      `${NB_W_TAG} selectLanguage()`,
      [
        `$userBetarenaSettings.lang: ${$userBetarenaSettings.lang}`,
        `$sessionStore?.serverLang: ${$sessionStore?.serverLang}`,
        `lang: ${lang}`,
        `pastLang: ${pastLang}`,
        `$page.route.id: ${$page.route.id}`
      ],
      true,
      NB_W_STY
    );

		isLangDropdown = false;

		// update <html {lang}>
    let tempLang: string = lang;
    if (lang === 'br') tempLang = 'pt-BR';
    document.documentElement.setAttribute
    (
      'lang',
      tempLang
    );

    // (exit) on-error, navigate back to homepage;
    const if_M_0: boolean =
      $page.error
      && !dev
    ;
		if (if_M_0)
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
   * @summary
   * [MAIN]
	 * @description
   * ➨ logout user;
   * ➨ respective ui changes;
   * ➨ delete cookies;
   * @returns
   * void
	 */
	async function logout
  (
  ): Promise < void >
  {
    document.cookie = 'betarenaCookieLoggedIn' + '=; Max-Age=0'
    document.cookie = "betarenaCookieLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		isUserAuthDropdown = false;
    await goto(`/${$userBetarenaSettings.lang == 'en' ? '' : $userBetarenaSettings.lang}`, { replaceState: true })
		userBetarenaSettings.signOutUser();
    setUserLang = false
	}

  // #endregion ➤ [METHODS]

  // #region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary [REACTIVE]
   * @description
   * listens to when user (localStorage) not-exists, and initial language has not been set;
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
      $sessionStore?.serverLang
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
    WIDGET_T_DATA?.scores_header_fixtures_information
  )
  {
    $sessionStore.fixturesTodayNum = parseInt(WIDGET_T_DATA?.scores_header_fixtures_information?.football)
  }

  $: dropDownArea =
    isLangDropdown
    || isOddsDropdown
    || isBookmakersDropdown
    || isUserAuthDropdown
  ;

  $: homepageURL =
    $sessionStore?.serverLang != 'en'
      ? `/${$page.params.lang}`
      : `/`
  ;

  $: logoLink =
    $sessionStore?.serverLang != 'en'
      ? `${$page.url.origin}/${$sessionStore?.serverLang}`
      : $page.url.origin
  ;

  $: if (browser && $sessionStore.navBtnHover)
  {
    calcNavTrianglePos();
  }
  $: if (browser && $sessionStore.navBtnHover == undefined)
  {
    calcNavTrianglePos('scores');
  }

  $: dlogv2
  (
    NB_W_TAG,
    [
      `$sessionStore?.serverLang: ${$sessionStore?.serverLang}`,
      `homepageURL: ${homepageURL}`,
      `logoLink: ${logoLink}`
    ],
    NB_W_TOG,
    NB_W_STY
  )

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

	onMount
  (
    async () =>
    {
      [
        tabletExclusive,
        mobileExclusive
      ] = viewport_change
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

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
HEADER (OUTER) CLOSE DROPDOWNS AREA
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
  HOMEPAGE LINKS
  -->
  {#each WIDGET_T_DATA?.langArray || [] as item}
    {#if item != 'en'}
      <a href={$page.url.origin + '/' + item}>
        {$page.url.origin + '/' + item}
      </a>
    {:else}
      <a href={$page.url.origin}>
        {$page.url.origin}
      </a>
    {/if}
  {/each}
  <!--
  OTHER URLS
  -->
  <a
    href={WIDGET_T_DATA?.scores_header_translations?.section_links?.scores_url}>
    {WIDGET_T_DATA?.scores_header_translations?.section_links?.scores_title}
  </a>
  <a
    href={WIDGET_T_DATA?.scores_header_translations?.section_links?.competitions_url}>
    {WIDGET_T_DATA?.scores_header_translations?.section_links?.competitions_title}
  </a>
  <a
    href={WIDGET_T_DATA?.scores_header_translations?.section_links?.sports_content_url}>
    {WIDGET_T_DATA?.scores_header_translations?.section_links?.sports_content_title}
  </a>
</SeoBox>

<AuthWidget />

<!--
NAVBAR MAIN
-->
<header
  class=
  "
    column-space-center
  "
  class:user-active={PROFILE_URL == $page.route.id}
  class:update-z-index={$sessionStore.livescoreShowCalendar && mobileExclusive}
>

	<!--
  HEADER (INNER) CLOSE DROPDOWNS AREA
  -->
	{#if dropDownArea}
		<div
			id="background-area-close-inner"
			on:click={() => closeAllDropdowns()}
		/>
	{/if}

  <!--
  TOP NAVBAR
  -->
  <div
    id="top-header"
    class="row-space-out"
  >

    <!--
    1st COLUMN
    -->
    <div
      class="row-space-start"
      style="width: fit-content;"
    >
      <!--
      📱 MOBILE 💻 TABLET
      MENU BURGER
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
      BETARENA BRAND LOGO
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
            class:m-r-40={!mobileExclusive}
          />
        </a>
      </div>

      <!--
      💻 TABLET 🖥️ LAPTOP
      EXTERNAL BUTTONS
      -->
      {#if !mobileExclusive}

        <div
          id='navBox'
          class=
          "
            row-space-start
          "
        >
          <!--
          SCORES PLATFORM
          -->
          <HeaderNavBtn
            navKey={'scores'}
            navUrl={WIDGET_T_DATA?.scores_header_translations?.section_links?.scores_url}
            navTxt={WIDGET_T_DATA?.scores_header_translations?.section_links?.scores_title || 'SCORES'}
            {tabletExclusive}
            {mobileExclusive}
          />

          <!--
          SCORES CONTENT
          -->
          <HeaderNavBtn
            navKey={'content'}
            navUrl={WIDGET_T_DATA?.scores_header_translations?.section_links?.sports_content_url}
            navTxt={WIDGET_T_DATA?.scores_header_translations?.section_links?.sports_content_title || 'SPORTS CONTENT'}
            {tabletExclusive}
            {mobileExclusive}
          />

          <!--
          COMPETITIONS
          -->
          <HeaderNavBtn
            navKey={'competitions'}
            navUrl={WIDGET_T_DATA?.scores_header_translations?.section_links?.competitions_url}
            navTxt={WIDGET_T_DATA?.scores_header_translations?.section_links?.competitions_title || 'COMPETITIONS'}
            soonTxt={WIDGET_T_DATA?.scores_header_translations?.soon || 'soon'}
            isSoon={true}
            disableAnchor={true}
            {tabletExclusive}
            {mobileExclusive}
          />

          <div
            id="nav-triangle"
            style="left: {width}px;"
          />
        </div>

      {/if}

    </div>

    <!--
    2nd COLUMN
    -->
    <div
      class="row-space-start"
      style="width: fit-content;"
    >

      <!--
      🖥️ LAPTOP
      -->
      {#if !tabletExclusive}

        <!--
        CURRENCY SELECTION
        NOTE: -> HIDDEN TEMPORARILY
        -->
        <div
          id="currency-box"
          class="m-r-16"
        >

          <!--
          SELECTED CURRENCY
          -->
          <div
            class="
              selected-language-btn
              row-space-start
            "
            class:active-lang-select={isCurrencyDropdown == true}
            on:click={() =>	(isCurrencyDropdown = !isCurrencyDropdown)}
          >

            <!--
            CURRENCY ICON
            -->
            <img
              loading="lazy"
              src='./assets/svg/currency/usd.svg'
              alt='usd-icon'
              width="16"
              height="16"
              class="
                m-r-6
              "
            />

            <!--
            CURRENCY TEXT
            -->
            <p
              class="
                color-white
                s-14
              "
            >
              USD
            </p>

            <!--
            ARROW DOWN
            NOTE: -> HIDDEN TEMPORARILY
            -->
            {#if false}
              <img
                loading="lazy"
                src={!isCurrencyDropdown ? arrow_down : arrow_up}
                alt={!isCurrencyDropdown	? 'arrow_down' : 'arrow_up'}
                width="16"
                height="16"
              />
            {/if}

          </div>

        </div>

        <!--
        LANGUAGE SELECTION
        -->
        <div
          id="lang-container"
          class="m-r-16"
        >

          <!--
          SELECTED LANG
          -->
          <div
            class="
              selected-language-btn
              row-space-out
              cursor-pointer
            "
            class:active-lang-select={isLangDropdown == true}
            on:click={() =>	(isLangDropdown = !isLangDropdown)}
          >
            <p
              class="
                color-white
                s-14
                m-r-5
              "
            >
              {$sessionStore?.serverLang?.toUpperCase()}
            </p>

            <!--
            ARROW DOWN
            -->
            <img
              loading="lazy"
              src={!isLangDropdown ? arrow_down : arrow_up}
              alt={!isLangDropdown	? 'arrow_down' : 'arrow_up'}
              width="16"
              height="16"
            />
          </div>

          <!--
          DROPDOWN (LANG)
          -->
          {#if isLangDropdown}
            <div
              id="dropdown-menu"
              transition:fly
            >
              {#each WIDGET_T_DATA.langArray.sort() as lang}
                {#if lang.toUpperCase() != $sessionStore?.serverLang?.toUpperCase()}
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

        <!--
        THEME SELECTION
        -->
        <div
          id="theme-opt-container"
          class="
            row-space-start
            m-r-30
            cursor-pointer
          "
          on:click={() => selectedTheme()}
          class:m-r-10={PROFILE_URL == $page.route.id}
          class:row-space-end={$userBetarenaSettings.theme == 'Dark'}
        >

          <img
            loading="lazy"
            src={$userBetarenaSettings.theme == 'Dark' ? lightModeVector : darkModeVector}
            alt={$userBetarenaSettings.theme == 'Dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
            width=16
            height=16
            class:light={$userBetarenaSettings.theme == 'Dark'}
          />

        </div>

      {/if}

      <!--
      SIGN IN BUTTON
      -->
      {#if $userBetarenaSettings?.user == undefined}
        <button
          id="sign-in-btn"
          class="
            cursor-pointer
          "
          on:click={() => ($sessionStore.auth_show = !$sessionStore.auth_show)}
        >
          <p
            class="
              color-white
              s-14
            "
          >
            {WIDGET_T_DATA?.scores_header_translations?.sign_in || translationObject?.sign_in}
          </p>
        </button>
      {:else}

        <div
          id="user-profile-box"
          class="row-space-start"
        >

          <!--
          USER WALLET
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
          USER AVATAR
          -->
          <img
            loading="lazy"
            id="user-profile-picture"
            src={$userBetarenaSettings?.user?.scores_user_data?.profile_photo || profile_avatar}
            alt="Profile Icon"
            title="Profile Avatar"
            on:click={() => (isUserAuthDropdown = !isUserAuthDropdown)}
            class="cursor-pointer"
            width=44
            height=44
          />

          <!--
          PROFILE DROPDOWN
          -->
          {#if isUserAuthDropdown}

            <div
              id="user-profile-dropdown"
            >

              <!--
              PROFILE BUTTON
              -->
              <a
                href="/u/dashboard/{$userBetarenaSettings.lang}"
              >
                <div
                  class="
                    theme-opt-box
                    cursor-pointer
                  "
                  style="width: 100%;"
                  on:click={() => (isOddsDropdown = false)}
                >
                  <p
                    class="
                      color-white
                      s-14
                    "
                  >
                    {WIDGET_T_DATA?.scores_header_translations?.data?.profile || 'Profile'}
                  </p>
                </div>
              </a>

              <!--
              LOGOUT
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
                  {WIDGET_T_DATA?.scores_header_translations?.data?.logout || 'Logout'}
                </p>
              </div>

            </div>

          {/if}

        </div>

      {/if}

    </div>

  </div>

  <div id='top-border' />
  <div id='bottom-border' />

  <!--
  BOTTOM NAVBAR
  -->
  <div
    id="bottom-header"
    class="row-space-out"
  >

    <!--
    1st COLUMN
    -->
    <div
      class="
        row-space-out
      "
    >

      <!--
      SPORTS HORIZONTAL LIST
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

          <!--
          FOOTBALL
          -->
          <HeaderSportsBtn
            sportNameDefault={'Football'}
            sportTranslation={WIDGET_T_DATA?.scores_header_translations?.sports_v2?.['football']}
            sportValue={WIDGET_T_DATA?.scores_header_fixtures_information?.['football']}
            selectedSport={selectedSport}
            on:closeDropdown={(event) => selectedSport = event?.detail?.selectedSport}
          />

        </div>
      </div>

    </div>

    <!--
    2nd COLUMN
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
        ODDS-TYPE CONTAINER
        NOTE: -> HIDDEN TEMPORARILY
        -->
        {#if false}
          <div
            id="odds-box"
            class="
              cursor-not-allowed
              dropdown-opt-box
              row-space-start
            "
            on:click={() => (isOddsDropdown = !isOddsDropdown)}
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
                  no-wrap
                "
              >
                {WIDGET_T_DATA?.scores_header_translations?.odds || translationObject?.odds_type}
              </p>

              <p
                class="
                  color-white
                  s-14
                  no-wrap
                "
              >
                {WIDGET_T_DATA?.scores_header_translations?.odds_type?.[0]}
              </p>

            </div>

            <!--
            ARROW DOWN
            -->
            <img
              loading="lazy"
              src={!isOddsDropdown ? arrow_down_fade : arrow_up}
              alt={!isOddsDropdown ? 'arrow_down_fade' : 'arrow_up'}
              width=16
              height=16
            />

            <!--
            DROPDOWN MENU (ODDS-TYPE)
            -->
            {#if isOddsDropdown}
              <div
                id="odds-type-dropdown-menu"
                transition:fly
              >
                {#each WIDGET_T_DATA?.scores_header_translations?.odds_type || [] as odd}
                  <div
                    class="theme-opt-box"
                    on:click={() => (isOddsDropdown = false)}
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
        BOOKMAKERS CONTAINER
        -->
        <div
          id="bookmaker-box"
          class=
          "
            dropdown-opt-box
            row-space-start
          "
          on:click={() => (isBookmakersDropdown = !isBookmakersDropdown)}
          class:not-last={$userBetarenaSettings?.user != undefined}
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
                no-wrap
              "
            >
              {WIDGET_T_DATA?.scores_header_translations?.bookmakers}
            </p>
            <div class="row-space-start">
              {#if $userBetarenaSettings.country_bookmaker != undefined}
                {#each WIDGET_T_DATA?.scores_header_translations?.bookmakers_countries || [] as country}
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
          ARROW DOWN
          -->
          <img
            loading="lazy"
            src={!isBookmakersDropdown ? arrow_down_fade : arrow_up}
            alt={!isBookmakersDropdown ? 'arrow_down_fade' : 'arrow_up'}
            width=16
            height=16
          />

          <!--
          DROPDOWN MENU (THEME)
          -->
          {#if isBookmakersDropdown}
            <div
              id="bookmakers-type-dropdown-menu"
              transition:fly
            >
              {#if $userBetarenaSettings.country_bookmaker != undefined}
                {#each WIDGET_T_DATA?.scores_header_translations?.bookmakers_countries || [] as country}
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

        <!--
        BETARENA TOKEN
        -->
        {#if $userBetarenaSettings?.user != undefined}

          <!--
          BETARENA TOKEN AMOUNT
          -->
          <div
            class=
            "
              dropdown-opt-box
              m-r-10
              row-space-start
            "
          >

            <div>
              <p
                class="
                  color-grey
                  s-12
                  no-wrap
                "
              >
                {translationObject?.balance}
              </p>

              <p
                class="
                  color-white
                  s-14
                  no-wrap
                "
              >
                <span
                  class=
                  "
                    color-primary
                    w-500
                    m-r-5
                  "
                >
                  0.00 BTA
                </span>
                ($0.00)
              </p>
            </div>

          </div>

          <!--
          BUY BETARENA TOKEN
          NOTE: -> HIDDEN TEMPORARILY
          -->
          {#if false}
            <button
              class=
              "
                btn-primary-v2
                m-l-50
              "
            >
              Buy BTA
            </button>
          {/if}

        {/if}

      {/if}

    </div>

  </div>

  <!--
  📱 MOBILE 💻 TABLET
  NAVBAR SIDE/SLIDE
  FIXME: very large chunk 400+ lines of repeating code;
  -->
  {#if (tabletExclusive || mobileExclusive) && mobileNavToggleMenu}
    <nav
      class:tablet-exclusive={mobileExclusive == false}
      in:fly={{ x: -200, duration: 500 }}
      out:fly={{ x: -200, duration: 500 }}
    >

      <div>

        <!--
        TOP ROW
        -->
        <div
          class=
          "
            row-space-out
          "
        >

          <!--
          CLOSE SIDE-NAV
          -->
          <img
            loading="lazy"
            src={close}
            alt="close-icon"
            width=24
            height=24
            on:click={() => (mobileNavToggleMenu = false)}
          />

          <!--
          MAIN PLATFORM OPTIONS
          TODO: add the currency, lang, theme box-options as component [?]
          -->
          <div
            class=
            "
              row-space-end
              width-auto
            "
          >

            <!--
            CURRENCY SELECTION
            NOTE: -> HIDDEN TEMPORARILY
            -->
            <div
            id="currency-box"
            class="m-r-16"
            >

              <!--
              SELECTED CURRENCY
              -->
              <div
                class="
                  selected-language-btn
                  row-space-start
                "
                class:active-lang-select={isCurrencyDropdown == true}
                on:click={() =>	(isCurrencyDropdown = !isCurrencyDropdown)}
              >

                <!--
                CURRENCY ICON
                -->
                <img
                  loading="lazy"
                  src='./assets/svg/currency/usd.svg'
                  alt='usd-icon'
                  width="16"
                  height="16"
                  class="
                    m-r-6
                  "
                />

                <!--
                CURRENCY TEXT
                -->
                <p
                  class="
                    color-white
                    s-14
                  "
                >
                  USD
                </p>

                <!--
                ARROW DOWN
                NOTE: -> HIDDEN TEMPORARILY
                -->
                {#if false}
                  <img
                    loading="lazy"
                    src={!isCurrencyDropdown ? arrow_down : arrow_up}
                    alt={!isCurrencyDropdown	? 'arrow_down' : 'arrow_up'}
                    width="16"
                    height="16"
                  />
                {/if}

              </div>

            </div>

            <!--
            LANGUAGE SELECTION
            -->
            <div
              id="lang-container"
              class="m-r-16"
            >

              <!--
              SELECTED LANG
              -->
              <div
                class="
                  selected-language-btn
                  row-space-out
                  cursor-pointer
                "
                class:active-lang-select={isLangDropdown == true}
                on:click={() =>	(isLangDropdown = !isLangDropdown)}
              >
                <p
                  class="
                    color-white
                    s-14
                    m-r-5
                  "
                >
                  {$sessionStore?.serverLang?.toUpperCase()}
                </p>

                <!--
                ARROW DOWN
                -->
                <img
                  loading="lazy"
                  src={!isLangDropdown ? arrow_down : arrow_up}
                  alt={!isLangDropdown	? 'arrow_down' : 'arrow_up'}
                  width="16"
                  height="16"
                />
              </div>

              <!--
              DROPDOWN (LANG)
              -->
              {#if isLangDropdown}
                <div
                  id="dropdown-menu"
                  transition:fly
                >
                  {#each WIDGET_T_DATA.langArray.sort() as lang}
                    {#if lang.toUpperCase() != $sessionStore?.serverLang?.toUpperCase()}
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

            <!--
            THEME SELECTION
            -->
            <div
              id="theme-opt-container"
              class="
                row-space-start
                m-r-30
                cursor-pointer
              "
              on:click={() => selectedTheme()}
              class:m-r-10={PROFILE_URL == $page.route.id}
              class:row-space-end={$userBetarenaSettings.theme == 'Dark'}
            >

              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? lightModeVector : darkModeVector}
                alt={$userBetarenaSettings.theme == 'Dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
                width=16
                height=16
                class:light={$userBetarenaSettings.theme == 'Dark'}
              />

            </div>

          </div>

        </div>

        <!--
        MENU OPTIONS BOX
        -->
        <div
          class=
          "
            column-start-grid-start
          "
          class:m-t-25={tabletExclusive}
          class:m-t-45={mobileExclusive}
        >

          <!--
          SCORES PLATFORM
          -->
          <HeaderNavBtn
            navKey={'scores'}
            navUrl={WIDGET_T_DATA?.scores_header_translations?.section_links?.scores_url}
            navTxt={WIDGET_T_DATA?.scores_header_translations?.section_links?.scores_title || 'SCORES'}
            {tabletExclusive}
            {mobileExclusive}
          />

          <!--
          SCORES CONTENT
          -->
          <HeaderNavBtn
            navKey={'content'}
            navUrl={WIDGET_T_DATA?.scores_header_translations?.section_links?.sports_content_url}
            navTxt={WIDGET_T_DATA?.scores_header_translations?.section_links?.sports_content_title || 'SPORTS CONTENT'}
            {tabletExclusive}
            {mobileExclusive}
          />

          <!--
          COMPETITIONS
          -->
          <HeaderNavBtn
            navKey={'competitions'}
            navUrl={WIDGET_T_DATA?.scores_header_translations?.section_links?.competitions_url}
            navTxt={WIDGET_T_DATA?.scores_header_translations?.section_links?.competitions_title || 'COMPETITIONS'}
            soonTxt={WIDGET_T_DATA?.scores_header_translations?.soon || 'soon'}
            isSoon={true}
            disableAnchor={true}
            {tabletExclusive}
            {mobileExclusive}
          />

          {#if PROFILE_URL != $page.route.id}

            <!--
            ODDS SECTION
            -->
            <div
              class="side-nav-dropdown m-b-25"
              on:click={() =>
                (isOddsDropdown =
                  !isOddsDropdown)}
            >

              <!--
              SELECTED / TOGGLE BOX
              -->
              <div
                class=
                "
                  m-b-15
                "
              >

                <p
                  class=
                  "
                    color-grey
                    s-12
                    m-b-5
                  "
                >
                  {WIDGET_T_DATA?.scores_header_translations?.odds || translationObject?.odds_type}
                </p>

                <div
                  class=
                  "
                    row-space-out
                  "
                >

                  <p
                    class=
                    "
                      color-white
                      s-14
                    "
                  >
                    {WIDGET_T_DATA?.scores_header_translations?.odds_type?.[0]}
                  </p>

                  <!--
                  ARROW DOWN
                  -->
                  <img
                    loading="lazy"
                    src={!isOddsDropdown ? arrow_down_fade : arrow_up_fade}
                    alt={!isOddsDropdown ? 'arrow_down_fade' : 'arrow_up_fade'}
                    width=16
                    height=16
                  />
                </div>
              </div>

              <!--
              DROWDOWN
              -->
              {#if isOddsDropdown}
                <div
                  transition:fly
                >
                  {#each WIDGET_T_DATA?.scores_header_translations?.odds_type || [] as odd}

                    <div
                      class=
                      "
                        side-nav-dropdown-opt
                      "
                      on:click={() => (isOddsDropdown = false)}
                    >

                      <p
                        class=
                        "
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
            BOOKMAKERS SECTION
            -->
            <div
              class=
              "
                side-nav-dropdown
                m-b-25
              "
              on:click={() => (isBookmakersDropdown = !isBookmakersDropdown)}
            >

              <div
                class=
                "
                  m-b-15
                "
              >

                <p
                  class=
                  "
                    color-grey
                    s-12
                    m-b-5
                  "
                >
                  {WIDGET_T_DATA?.scores_header_translations?.bookmakers || translationObject?.bookmakers}
                </p>

                <div
                  class=
                  "
                    row-space-out
                  "
                >

                  <div
                    class=
                    "
                      row-space-start
                    "
                  >
                    {#each WIDGET_T_DATA?.scores_header_translations?.bookmakers_countries || [] as country}
                      {#if country?.includes($userBetarenaSettings?.country_bookmaker?.toUpperCase())}

                        <img
                          loading="lazy"
                          class=
                          "
                            country-flag
                            m-r-5
                          "
                          src="https://betarena.com/images/flags/{country?.[0]}.svg"
                          alt={country?.[1]}
                          width=20
                          height=14
                        />

                        <p
                          class=
                          "
                            color-white
                            s-14
                          "
                        >
                          {country?.[1]}
                        </p>

                      {/if}
                    {/each}
                  </div>

                  <!--
                  ARROW DOWN
                  -->
                  <img
                    loading="lazy"
                    src={!isBookmakersDropdown ? arrow_down_fade : arrow_up_fade}
                    alt={!isBookmakersDropdown ? arrow_down_fade : arrow_up_fade}
                    width=16
                    height=16
                  />

                </div>

              </div>

              <!--
              DROPDOWN
              -->
              {#if isBookmakersDropdown}
                <div
                  transition:fly
                >
                  {#each WIDGET_T_DATA?.scores_header_translations?.bookmakers_countries || [] as country}
                    <div
                      class=
                      "
                        side-nav-dropdown-opt
                        row-space-start
                      "
                      on:click={() => userBetarenaSettings.setCountryBookmaker(country?.[0].toLocaleLowerCase())}
                    >

                      <div
                        class=
                        "
                          row-space-start
                        "
                      >

                        <img
                          loading="lazy"
                          class=
                          "
                            country-flag
                            m-r-10
                          "
                          src="https://betarena.com/images/flags/${country?.[0]}.svg"
                          alt="${country?.[1]}"
                          width=20
                          height=14
                        />

                        <p
                          class=
                          "
                            color-white
                            s-14
                          "
                        >
                          {country?.[1]}
                        </p>

                      </div>

                      {#if country?.includes($userBetarenaSettings?.country_bookmaker)}
                        <img
                          loading="lazy"
                          src={icon_check}
                          alt={country?.[0]}
                          width=16
                          height=16
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}

            </div>

          {/if}

        </div>

      </div>

    </nav>
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

  /*
  => NAVBAR (MAIN)
  */
	header
  {
    /* p */
		z-index: 1000;
		position: relative;
    /* s */
		background-color: #292929;
		height: 128px;
	}
	header #top-header,
	header #bottom-header
  {
    /* p */
		position: absolute;
    position: relative;
    /* s */
		max-width: 1430px;
		width: inherit;
	}
	header #top-header
  {
    /* p */
		top: 0;
    /* s */
		padding: 23px 16px;
		height: 64px !important;
	}
	header #bottom-header
  {
    /* p */
		bottom: 0;
    /* s */
		padding: 10px 16px;
		height: 64px !important;
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
  header div#top-border
  {
    /* p */
    position: absolute;
    bottom: 64px;
    /* s */
    width: 100vw;
    border: 0.5px solid var(--dark-theme-1);
  }
  header div#bottom-border
  {
    /* p */
    position: absolute;
    bottom: 0;
    /* s */
    width: 100vw;
    border: 0.5px solid var(--dark-theme-1);
  }

	#burger-menu
  {
		margin-right: 16.15px;
	}

  /*
  => 📱 MOBILE | 💻 TABLET
  => Sliding-side Navigation;
  */
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

  div#navBox
  {
    /* s */
    position: relative;
  }
  div#nav-triangle
  {
    /* p */
    position: absolute;
    bottom: -21px;
    /* s */
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid var(--dark-theme-1);
    transition: all 0.25s ease-out;
  }

  /*
  => LANG / CURRENCY SHARED
  */

  div#currency-box,
	div#lang-container
  {
		position: relative;
	}

	div.selected-language-btn
  {
    /* s */
		color: #ffffff;
		outline: none;
		border: none;
		padding: 5px 12px;
		background-color: transparent;
	}
	div#lang-container div.selected-language-btn:hover,
	div#lang-container div.selected-language-btn.active-lang-select
  {
    /* s */
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}

	#dropdown-menu
  {
    /* p */
		position: absolute;
		z-index: 1000;
		top: 100%;
		left: -20%;
    /* s */
		width: 88px;
		margin-top: 5px;
		border-radius: 4px;
		background: #292929;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		overflow: hidden;
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

	/*
	=============
	BUTTONS
	=============
	*/

	button#sign-in-btn
  {
    /* s */
		width: 95px;
		height: 44px;
		padding: 12px 26px;
		background: transparent;
		border: 1px solid #ffffff !important;
		box-sizing: border-box;
		border-radius: 8px;
	}
	button#sign-in-btn:hover
  {
    /* s */
		border: 1px solid #f5620f !important;
	}
	button#sign-in-btn:hover p
  {
    /* s */
		color: #f5620f;
	}

	img#user-profile-picture
  {
    /* s */
		border-radius: 50%;
	}

	/*
	=> OPT-BOX
  */
	.dropdown-opt-box
  {
    /* s */
		border-left: 1px solid #4b4b4b;
		height: 44px;
		padding: 0 16px;
		width: fit-content;
		cursor: pointer;
	}

	img.country-flag
  {
		background: linear-gradient
    (
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
  => THEME BOX
  */
  div#theme-opt-container
  {
    /* s */
    width: 44px;
    height: 24px;
    background: var(--dark-theme-1);
    border-radius: 24px;
  }
  div#theme-opt-container > img
  {
    /* s */
    margin: 2px;
    padding: 4.5px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background-color: var(--dark-theme);
  }
  div#theme-opt-container > img.light
  {
    /* s */
    background-color: var(--white);
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
	}

	@media screen
  and (min-width: 1024px)
  {

		#theme-opt-container,
		#odds-box
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

		div#bookmaker-box
    {
      /* p */
			position: relative;
      /* s */
      padding: 0 0 0 16px;
		}
    div#bookmaker-box.not-last
    {
      padding: 0 16px 0 16px;
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
