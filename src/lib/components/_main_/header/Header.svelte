<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import { db_firestore } from '$lib/firebase/init';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { NB_W_TAG, dlog, dlogv2 } from '$lib/utils/debug';
	import { generateUrlCompetitions, selectLanguage, spliceBalanceDoubleZero, toDecimalFix, viewport_change } from '$lib/utils/platform-functions';
	import { translationObject } from '$lib/utils/translation.js';
	import { initUser, logoutUser } from '$lib/utils/user.js';
	import { doc, updateDoc } from 'firebase/firestore';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import AuthWidget from '../auth/Auth_Widget.svelte';
  import HeaderCBookmakers from './Header-C-Bookmakers.svelte';
  import HeaderCLang from './Header-C-Lang.svelte';
  import HeaderCTheme from './Header-C-Theme.svelte';
  import HeaderCompetitionBtn from './Header-Competition-Btn.svelte';
  import HeaderNavBtn from './Header-Nav-Btn.svelte';
  import HeaderSportsBtn from './Header-Sports-Btn.svelte';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
  import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 560,
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 1160,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'global/w/navbar/main'
  ;

	let
    /** @description TODO: DOC: */
    isViewMobile: boolean = true,
    /** @description TODO: DOC: */
    isViewTablet: boolean = true,
    /** @description TODO: DOC: */
    B_NAV_T: B_NAV_T = $page.data?.B_NAV_T,
    /** @description TODO: DOC: */
    B_SAP_D3_CP_H: B_SAP_D3 = $page.data?.B_SAP_D3_CP_H,
    /** @description TODO: DOC: */
    arrow_down_fade: string,
    /** @description TODO: DOC: */
    arrow_down: string,
    /** @description TODO: DOC: */
    arrow_up_fade: string,
    /** @description TODO: DOC: */
    arrow_up: string,
    /** @description TODO: DOC: */
    logo_full: string,
    /** @description TODO: DOC: */
    logo_mini: string,
    /** @description TODO: DOC: */
    close: string,
    /** @description TODO: DOC: */
    menu_burger_bar: string,
    /** @description TODO: DOC: */
    profile_avatar: string,
    /** @description TODO: DOC: */
    mobileNavToggleMenu: boolean = false,
    /** @description TODO: DOC: */
	  isCurrencyDropdown: boolean = false,
    /** @description TODO: DOC: */
	  isOddsDropdown: boolean = false,
    /** @description TODO: DOC: */
	  isUserAuthDropdown: boolean = false,
    /** @description A `reactive` based `boolean` variable, indicating wether **current** route is of `competitions` section.  */
    isRouteCompetitions: boolean,
    /** @description A `reactive` based `boolean` variable, indicating wether **current** route is of `profile` section.  */
    isRouteProfile: boolean,
    /** @description TODO: DOC: */
    selectedSport: string = 'football',
    /** @description TODO: DOC: */
	  homepageURL: string,
    /** @description TODO: DOC: */
	  logoLink: string,
    /** @description TODO: DOC: */
    width: number = 0,
    /** @description TODO: DOC: */
    deepReactListenUserUid: string = $userBetarenaSettings?.user?.firebase_user_data?.uid ?? undefined;
  ;

  $: B_NAV_T = $page.data.B_NAV_T;
  $: B_SAP_D3_CP_H = $page.data.B_SAP_D3_CP_H;
  $: isRouteCompetitions = $page?.route?.id.includes('/[[lang=lang]]/[competitions=competitions]');
  $: isRouteProfile = $page?.route?.id == '/u/[view]/[lang=lang]';

  $: dropDownArea =
    isOddsDropdown
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

  $: deepReactListenUserUid = $userBetarenaSettings?.user?.firebase_user_data?.uid;
  $: deepReactListenUserLang = $userBetarenaSettings?.lang;
  $: deepReactListenUser = JSON.stringify($userBetarenaSettings?.user);
  $: deepReactListenNavBtnHover = JSON.stringify($sessionStore?.navBtnHover);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'methods' that are to be     ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. function (..)                                                 ◼️
  // ### 2. async function [..]                                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	/**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @summary
   * 🔹 HELPER
	 * @description
   * 📌 Closes all possible dropdowns opened on `this` widget.
   * @returns { void }
	 */
	function closeAllDropdowns
  (
  ): void
  {
		isOddsDropdown = false;
		isUserAuthDropdown = false;
    dropDownArea = false;
	}

	/**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
	 * @description
   *  📌 Reloads current page.
   * @returns { void }
	 */
	function reloadPage
  (
  ): void
  {
    // ### CHECK
    // ### for page to be already 'homepage', and therefore reload().
		if ($page.url.pathname == '/')
			window.location.reload();
    ;
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Calculate navigation triangle position.
   * @param { string } [mainActive]
   * @returns { void }
   */
  function calcNavTrianglePos
  (
    mainActive?: string
  ): void
  {
    const parentElem: HTMLElement = document.getElementById('navBox')
    const childElem: HTMLElement = document.getElementById($sessionStore.navBtnHover || mainActive);

    // ### CHECK
    // ### for missing DOM elements.
    const if_M_0: boolean =
      parentElem == undefined
      || childElem == undefined
    ;
    if (if_M_0) return;

    const parentPos: DOMRect = parentElem?.getBoundingClientRect();
    const childPos: DOMRect = childElem?.getBoundingClientRect();

    const relativePos =
    {
      top: (childPos.top - parentPos.top),
      right: (childPos.right - parentPos.right),
      bottom: (childPos.bottom - parentPos.bottom),
      left: (childPos.left - parentPos.left)
    };

    width = relativePos.left + (childPos.width/2) - 32 + 6;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
	 * @description
   *  📌 updates user's platform language preferrences, firebase services.
   * @returns { Promise < void > }
	 */
  async function update_select_lang
  (
  ): Promise < void >
  {

    if (!$userBetarenaSettings?.lang
      || $page.error
      || !$page.route.id
      || $userBetarenaSettings?.user == undefined)
    {
      return
    }

		const lang = $userBetarenaSettings?.lang;

    // [🐞]
		dlog
    (
      `${NB_W_TAG[0]} 🔵 Updating platform user lang ${lang}`
    );

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

    // [🐞]
		dlog
    (
      `${NB_W_TAG[0]} 🟢 User language has been updated`,
    );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _initial platform language_ has not been set,
   *  - (and) (2) `user` is **not** authenticated and/or is `anonymous`.
   * @abstract
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `$userBetarenaSettings.user`- **kicker** (via deepListen)
   */
  $: if_R_0 =
    browser
  ;
  $: if (if_R_0 && deepReactListenUser == undefined)
  {
    // ### [🐞]
    dlogv2
    (
      `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]} if_R_0`,
      [
        '📝 INFO: Non-authenticated user detected! Processing logic...',
        '❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.'
      ],
      true
    );

    userBetarenaSettings.setLang
    (
      sessionStore.getServerLang()
    );
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _initial platform language_ has not been set,
   *  - (and) (2) `user` **is** authenticated.
   * @abstract
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `$userBetarenaSettings.user`- **kicker** (via deepListen)
   */
  $: if_R_1 =
    browser
    && !isRouteProfile
  ;
  $: if (if_R_1 && deepReactListenUser != undefined)
  {
    // ### [🐞]
    dlogv2
    (
      `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]} if_R_1`,
      [
        '📝 INFO: Authenticated user detected! Processing logic...',
        '❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again.'
      ],
      true
    );

    if_R_1_Func();

    // ### NOTE:
    // ### Nested block method.
    function if_R_1_Func
    (
    ): void
    {
      let userlang: string = $userBetarenaSettings.user?.scores_user_data?.lang;
      selectLanguage
      (
        userlang,
        $page
      );
    }
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to **first** case when, the:
   *  - (1) `user` **is** authenticated.
   *  - ⚡️ Kickstarts setup for user privileges.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `$userBetarenaSettings`
   *  - `$userBetarenaSettings.user` - **kicker**
   *  - `deepReactListenUserUid`
   */
  $: if_R_2 =
    browser
    && $userBetarenaSettings?.user != undefined
  ;
  $: if (if_R_2)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]} if_R_2`,
      true
    );

    initUser
    (
      deepReactListenUserUid
    );
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - `user` changes selected platform language,
   *  and updates preferences.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `deepReactListenUserLang` - **kicker** (via deepListen)
   */
  $: if_R_3 =
    !$page.error
    && $page.route.id
    && $userBetarenaSettings?.user != undefined
  ;
  $: if (if_R_3 && deepReactListenUserLang != undefined)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]} if_R_3`,
      true
    );

    update_select_lang();
  }

  // ### TODO: DOC:
  $: if_R_4 =
    ($sessionStore.livescoreShowCalendar && isViewMobile)
    || $sessionStore.withdrawModal
  ;

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - navigation button hover changes.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `deepReactListenNavBtnHover` - **kicker** (via deepListen)
   */
  $: if (browser && deepReactListenNavBtnHover != undefined)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]} if_R_5`,
      true
    );

    calcNavTrianglePos();
  }
  else if (browser && deepReactListenNavBtnHover == undefined)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ ${NB_W_TAG[0]} if_R_6`,
      true
    );

    if (isRouteCompetitions)
      calcNavTrianglePos('competitions');
    else
      calcNavTrianglePos('scores');
    ;
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   * TODO: DOC:
  */
	onMount
  (
    async (
    ): Promise < void > =>
    {

      arrow_down_fade = (await import('./assets/arrow-down-fade.svg')).default;
      arrow_down = (await import('./assets/arrow-down.svg')).default;
      arrow_up_fade = (await import('./assets/arrow-up-fade.svg')).default;
      arrow_up = (await import('./assets/arrow-up.svg')).default;
      logo_full = (await import('./assets/betarena-logo-full.svg')).default;
      logo_mini = (await import('./assets/betarena-logo-mobile.svg')).default;
      close = (await import('./assets/close.svg')).default;
      menu_burger_bar = (await import('./assets/menu-burger.svg')).default;
      profile_avatar = (await import('./assets/profile-avatar.svg')).default;

      // cssVarChange();

      [
        isViewTablet,
        isViewMobile
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT,
        VIEWPORT_MOBILE_INIT
      );

      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            isViewTablet,
            isViewMobile
          ] =
          viewport_change
          (
            VIEWPORT_TABLET_INIT,
            VIEWPORT_MOBILE_INIT
          );
        }
      );

	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

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
  {#each B_NAV_T?.langArray || [] as item}
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
    href={B_NAV_T?.scores_header_translations?.section_links?.scores_url}>
    {B_NAV_T?.scores_header_translations?.section_links?.scores_title}
  </a>
  <a
    href={B_NAV_T?.scores_header_translations?.section_links?.competitions_url}>
    {B_NAV_T?.scores_header_translations?.section_links?.competitions_title}
  </a>
  <a
    href={B_NAV_T?.scores_header_translations?.section_links?.sports_content_url}>
    {B_NAV_T?.scores_header_translations?.section_links?.sports_content_title}
  </a>
</SeoBox>

<!--
IMPORTANT
-->
<AuthWidget />

<!--
NAVBAR MAIN
-->
<header
  data-testid="header"
  class=
  "
  column-space-center
  "
  class:user-active={isRouteProfile}
  class:update-z-index={if_R_4}
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
    id="header/top"
    data-testid="header-top"
    class=
    "
    row-space-out
    "
  >

    <!--
    1st COLUMN
    -->
    <div
      data-testid="header-top-1st-col"
      class="row-space-start"
      style="width: fit-content;"
    >
      <!--
      📱 MOBILE 💻 TABLET
      MENU BURGER
      -->
      {#if isViewTablet}
        <img
          id="burger-menu"
          data-testid="header-burger-menu"
          loading="lazy"
          src={menu_burger_bar}
          alt="menu_burger_bar"
          title="Open Side Navigation"
          width=24
          height=24
          on:click={() =>
            (mobileNavToggleMenu = true)}
        />
      {/if}

      <!--
      📱 MOBILE 💻 TABLET 🖥️ LAPTOP
      BETARENA BRAND LOGO
      -->
      <div
        id="brand"
        data-testid="header-brand-img"
        aria-label="brand-img"
        class=
        "
        cursor-pointer
        "
        on:click={() => reloadPage()}
      >
        <a
          href={homepageURL}
          title={logoLink}
        >
          <img
            loading="lazy"
            src={isViewMobile == true ? logo_mini : logo_full}
            alt="betarena_logo"
            width={isViewMobile == true ? 103 : 142}
            height=30
            class:m-r-40={!isViewMobile}
          />
        </a>
      </div>

      <!--
      🖥️ LAPTOP
      EXTERNAL BUTTONS / NAVIGATION
      -->
      {#if !isViewTablet}

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
            navUrl={B_NAV_T?.scores_header_translations?.section_links?.scores_url}
            navTxt={B_NAV_T?.scores_header_translations?.section_links?.scores_title || 'SCORES'}
            {isViewTablet}
            {isViewMobile}
          />

          <!--
          SCORES CONTENT
          -->
          <HeaderNavBtn
            navKey={'content'}
            navUrl={B_NAV_T?.scores_header_translations?.section_links?.sports_content_url}
            navTxt={B_NAV_T?.scores_header_translations?.section_links?.sports_content_title || 'SPORTS CONTENT'}
            {isViewTablet}
            {isViewMobile}
          />

          <!--
          COMPETITIONS
          -->
          <HeaderNavBtn
            navKey={'competitions'}
            navUrl={generateUrlCompetitions($sessionStore?.serverLang, B_SAP_D3_CP_H)}
            navTxt={B_NAV_T?.scores_header_translations?.section_links?.competitions_title || 'COMPETITIONS'}
            isNew={true}
            newTxt={'new'}
            {isViewTablet}
            {isViewMobile}
          />
          <!-- soonTxt={B_NAV_T?.scores_header_translations?.soon || 'soon'} -->

          <!--
          NAV TRIANGLE
          -->
          {#if !isRouteProfile}
            <div
              id="nav-triangle"
              style="left: {width}px;"
            />
          {/if}

        </div>

      {/if}

    </div>

    <!--
    2nd COLUMN
    -->
    <div
      data-testid="header-top-2nd-col"
      class="row-space-start"
      style="width: fit-content;"
    >

      <!--
      🖥️ LAPTOP
      -->
      {#if !isViewTablet}

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
              src='/assets/svg/currency/usd.svg'
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
        <HeaderCLang
          {dropDownArea}
          on:closeDropdown={() => dropDownArea = true}
        />

      {/if}

      <!--
      THEME SELECTION
      -->
      {#if !isViewMobile}
        <HeaderCTheme />
      {/if}

      <!--
      SIGN IN BUTTON
      -->
      {#if $userBetarenaSettings?.user == undefined}

        <button
          id="{CNAME}/sign-in-btn"
          data-testid="{CNAME}/sign-in-btn"
          class=
          "
          btn-hollow
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
            {B_NAV_T?.scores_header_translations?.sign_in || translationObject?.sign_in}
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
            id="user-profile-picture"
            data-testid="{CNAME}/user-avatar"
            loading="lazy"
            src={$userBetarenaSettings?.user?.scores_user_data?.profile_photo || profile_avatar}
            alt="profile_avatar"
            title="Profile Picture"
            on:click={() => (isUserAuthDropdown = !isUserAuthDropdown)}
            class=
            "
            cursor-pointer
            "
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
                  on:click={() => (isUserAuthDropdown = false)}
                >
                  <p
                    class="
                      color-white
                      s-14
                    "
                  >
                    {B_NAV_T?.scores_header_translations?.data?.profile || 'Profile'}
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
                on:click={() => logoutUser()}
              >
                <p
                  class="
                    color-white
                    s-14
                  "
                >
                  {B_NAV_T?.scores_header_translations?.data?.logout || 'Logout'}
                </p>
              </div>

            </div>

          {/if}

        </div>

      {/if}

    </div>

  </div>

  <div id='header/border/top-box' />
  <div id='header/border/bottom-box' />

  <!--
  BOTTOM NAVBAR
  -->
  <div
    id="header/bottom"
    class=
    "
    row-space-out
    "
  >

    <!--
    1st COLUMN - SCORES / COMPETITIONS
    -->
    <div
      class="
        row-space-out
      "
    >

      <!--
      SPORTS HORIZONTAL LIST - SCORES ONLY
      ----
      COMPETITIONS HORIZONTAL LIST - SCORES ONLY
      -->
      {#if !isRouteProfile}

        <div
          id="header/bottom/inner"
          class=
          "
          row-space-out
          m-r-10
          "
          style="width: fit-content;"
        >
          <div
            class=
            "
            row-space-out
            "
            style="width: fit-content;"
          >

            <!--
            FOOTBALL
            -->
            {#if !isRouteCompetitions}
              <HeaderSportsBtn
                sportNameDefault={'football'}
                sportTranslation={B_NAV_T?.scores_header_translations?.sports_v2?.['football']}
                sportValue={B_NAV_T?.scores_header_fixtures_information?.['football']}
                selectedSport={selectedSport}
                on:closeDropdown={(event) => selectedSport = event?.detail?.selectedSport}
              />
            {/if}

            <!--
            PREDICTOR
            -->
            {#if isRouteCompetitions}
              <HeaderCompetitionBtn
                competitionNameDefault={'predictor'}
                competitionTranslation={B_NAV_T?.competitions_category?.data?.predictor}
                navUrl={generateUrlCompetitions($sessionStore?.serverLang, B_SAP_D3_CP_H)}
              />
            {/if}

          </div>
        </div>

      {/if}

    </div>

    <!--
    2nd COLUMN - SCORES ONLY
    -->
    <div
      class=
      "
      row-space-start
      "
      style="width: fit-content;"
    >

      <!--
      💻 TABLET 🖥️ LAPTOP
      -->
      {#if !isViewMobile}

        <!--
        ODDS-TYPE CONTAINER
        NOTE: -> HIDDEN TEMPORARILY
        -->
        {#if false}
          <div
            id="odds-box"
            class=
            "
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
                {B_NAV_T?.scores_header_translations?.odds || translationObject?.odds_type}
              </p>

              <p
                class="
                  color-white
                  s-14
                  no-wrap
                "
              >
                {B_NAV_T?.scores_header_translations?.odds_type?.[0]}
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
                {#each B_NAV_T?.scores_header_translations?.odds_type || [] as odd}
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
        {#if !isRouteProfile && !isRouteCompetitions}
          <HeaderCBookmakers
            {isViewMobile}
            {isViewTablet}
          />
        {/if}

      {/if}

      <!--
      BETARENA TOKEN
      -->
      {#if $userBetarenaSettings?.user != undefined}

        <!--
        BETARENA TOKEN AMOUNT
        -->
        <a
          href="/u/transaction-history/{$userBetarenaSettings.lang}"
          title='View Transactions History'
        >
          <div
            id="balance-box"
            class=
            "
            dropdown-opt-box
            row-space-start
            "
          >

            <div>

              <!--
              📱 MOBILE
              Balance Title
              -->
              {#if !isViewMobile}
                <p
                  class=
                  "
                  color-grey
                  s-12
                  no-wrap
                  "
                >
                  {B_NAV_T?.scores_header_translations?.data?.balance ?? translationObject?.balance}
                </p>
              {/if}

              <p
                class=
                "
                color-white
                s-14
                no-wrap
                "
              >
                <!-- [🐞] -->
                <!-- {$userBetarenaSettings?.user?.scores_user_data?.main_balance} -->
                <!-- [🐞] -->
                <!-- {toDecimalFix($userBetarenaSettings?.user?.scores_user_data?.main_balance)} -->
                <!-- [🐞] -->
                <!-- {spliceBalanceDoubleZero(toDecimalFix($userBetarenaSettings?.user?.scores_user_data?.main_balance))} -->
                <span
                  class=
                  "
                  color-primary
                  w-500
                  m-r-5
                  "
                >
                  {spliceBalanceDoubleZero(toDecimalFix($userBetarenaSettings?.user?.scores_user_data?.main_balance)) ?? '0.00'} BTA
                </span>
                {#if isViewMobile}
                  <br/>
                {/if}
                (${spliceBalanceDoubleZero(toDecimalFix($userBetarenaSettings?.user?.scores_user_data?.main_balance)) ?? '0.00'})
              </p>
            </div>

          </div>
        </a>

        <!--
        BUY BETARENA TOKEN
        NOTE: -> HIDDEN TEMPORARILY
        -->
        {#if true}
          <a
            href="/u/deposit/{$userBetarenaSettings.lang}"
            title='Go to Deposit Page'
          >
            <button
              class=
              "
              btn-primary-v2
              "
              class:m-l-50={!isViewMobile}
              class:m-l-20={isViewMobile}
            >
              {B_NAV_T?.scores_header_translations?.data?.cta_buy ?? 'Buy BTA'}
            </button>
          </a>
        {/if}

      {/if}

    </div>

  </div>

  <!--
  📱 MOBILE + 💻 TABLET
  NAVBAR SLIDE SIDE
  -->
  {#if (isViewTablet || isViewMobile) && mobileNavToggleMenu}

    <nav
      data-testid="header-side-menu"
      class:tablet-exclusive={isViewMobile == false}
      in:fly={{ x: -200, duration: 500 }}
      out:fly={{ x: -200, duration: 500 }}
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
            data-testid="header-side-menu-close"
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
                  src='/assets/svg/currency/usd.svg'
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
            <HeaderCLang
              {dropDownArea}
              on:closeDropdown={() => dropDownArea = true}
            />

            <!--
            THEME SELECTION
            -->
            {#if isViewMobile}
              <HeaderCTheme />
            {/if}

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
          class:m-t-25={isViewTablet}
          class:m-t-45={isViewMobile}
        >

          <!--
          SCORES PLATFORM
          -->
          <HeaderNavBtn
            navKey={'scores'}
            navUrl={B_NAV_T?.scores_header_translations?.section_links?.scores_url}
            navTxt={B_NAV_T?.scores_header_translations?.section_links?.scores_title || 'SCORES'}
            {isViewTablet}
            {isViewMobile}
          />

          <!--
          SCORES CONTENT
          -->
          <HeaderNavBtn
            navKey={'content'}
            navUrl={B_NAV_T?.scores_header_translations?.section_links?.sports_content_url}
            navTxt={B_NAV_T?.scores_header_translations?.section_links?.sports_content_title || 'SPORTS CONTENT'}
            {isViewTablet}
            {isViewMobile}
          />

          <!--
          COMPETITIONS
          -->
          <HeaderNavBtn
            navKey={'competitions'}
            navUrl={generateUrlCompetitions($sessionStore?.serverLang, B_SAP_D3_CP_H)}
            navTxt={B_NAV_T?.scores_header_translations?.section_links?.competitions_title || 'COMPETITIONS'}
            isNew={true}
            newTxt={'new'}
            {isViewTablet}
            {isViewMobile}
          />

          {#if isViewMobile && !isRouteProfile && !isRouteCompetitions}

            <!--
            ODDS SECTION
            NOTE: -> HIDDEN TEMPORARILY
            -->
            {#if false}
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
                    {B_NAV_T?.scores_header_translations?.odds || translationObject?.odds_type}
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
                      {B_NAV_T?.scores_header_translations?.odds_type?.[0]}
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
                    {#each B_NAV_T?.scores_header_translations?.odds_type || [] as odd}

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
            {/if}

            <!--
            BOOKMAKERS SECTION
            -->
            <HeaderCBookmakers
              {isViewMobile}
              {isViewTablet}
            />

          {/if}

        </div>

      </div>

    </nav>

  {/if}

</header>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  #background-area-close
  {
    /* 📌 position */
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    /* 🎨 style */
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  #background-area-close-inner
  {
    /* 📌 position */
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    /* 🎨 style */
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
    /* 📌 position */
		z-index: 1000;
		position: relative;
    /* 🎨 style */
		background-color: #292929;
		height: 128px;
	}
	header div#header\/top,
	header div#header\/bottom
  {
    /* 📌 position */
		position: absolute;
    position: relative;
    /* 🎨 style */
		max-width: 1430px;
		width: inherit;
	}
	header div#header\/top
  {
    /* 📌 position */
		top: 0;
    /* 🎨 style */
		padding: 23px 16px;
		height: 64px !important;
	}
	header div#header\/bottom
  {
    /* 📌 position */
		bottom: 0;
    /* 🎨 style */
		padding: 10px 16px;
		height: 64px !important;
	}
	header div#header\/bottom\/inner::-webkit-scrollbar
  {
    /* 🎨 style */
		display: none;
	}
	header div#header\/bottom\/inner
  {
    /* 🎨 style */
		overflow-x: scroll;
		overflow-y: hidden;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
  header div#header\/border\/top-box,
  header div#header\/border\/bottom-box
  {
    /* 📌 position */
    position: absolute;
    /* 🎨 style */
    width: 100vw;
    border: 0.5px solid var(--dark-theme-1);
  }
  header div#header\/border\/top-box
  {
    /* 📌 position */
    bottom: 64px;
  }
  header div#header\/border\/bottom-box
  {
    /* 📌 position */
    bottom: 0;
  }

	#burger-menu
  {
		margin-right: 16.15px;
	}

	nav
  {
    /* 📌 position */
    position: absolute;
		z-index: 1000000000;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
    /* 🎨 style */
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
    /* 🎨 style */
		display: none;
	}
	nav.tablet-exclusive
  {
    /* 🎨 style */
		padding: 24px 34px;
		max-width: 374px !important;
	}

  div#navBox
  {
    /* 🎨 style */
    position: relative;
  }
  div#nav-triangle
  {
    /* 📌 position */
    position: absolute;
    bottom: -21px;
    /* 🎨 style */
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid var(--dark-theme-1);
    transition: all 0.25s ease-out;
  }

	img#user-profile-picture
  {
    /* 🎨 style */
		border-radius: 50%;
	}

	/*
	=> OPT-BOX
  */
	.dropdown-opt-box
  {
    /* 🎨 style */
		border-left: 1px solid #4b4b4b;
		height: 44px;
		padding: 0 16px;
		width: fit-content;
		cursor: pointer;
	}
  div#balance-box.dropdown-opt-box
  {
    /* 🎨 style */
    padding-right: 0;
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
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media screen
  and (max-width: 560px)
  {
    :root
    {
      --header-is-mobile: true;
    }
  }

	@media screen
  and (min-width: 768px)
  {
		header div#header\/top
    {
      /* 🎨 style */
			padding: 23px 34px;
		}
		header div#header\/bottom
    {
      /* 🎨 style */
			padding: 6px 34px;
		}

		#burger-menu
    {
      /* 🎨 style */
			margin-right: 24px;
		}
	}

	@media screen
  and (min-width: 1024px)
  {

		#odds-box
    {
			position: relative;
		}

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

		#odds-type-dropdown-menu .theme-opt-box
    {
			padding: 9.5px 16px;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			background: #4b4b4b;
			height: 40px;
		}

		#odds-type-dropdown-menu .theme-opt-box:hover	p
    {
			color: #f5620f;
		}

	}

</style>
