<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { dev } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { fly } from "svelte/transition";

	import sessionStore from "$lib/store/session.js";
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { NB_W_STY, NB_W_TAG, dlog, dlogv2 } from "$lib/utils/debug.js";
	import { ROUTE_ID_PROFILE } from "$lib/utils/user.js";

  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    OMIT_URLS: string[] =
    [
      '/[[lang=lang]]/[sport]/[country]/[league_name]',
      '/[[lang=lang]]/[sport]/[fixture=fixture]',
      '/[[lang=lang]]/[player=player]/[...player_fill]'
    ],
    HOVER_TIMEOUT = 250
  ;

  let
    B_NAV_T: B_NAV_T = $page.data.HEADER_TRANSLATION_DATA,
    isLangDropdown: boolean = false,
    intent_intent_lang: string | undefined = undefined,
    timeout_intent: NodeJS.Timeout = undefined
  ;

  $: B_NAV_T = $page.data.HEADER_TRANSLATION_DATA;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🔹 HELPER
   *
   * @description
   * 📌 Advanced intent logic, applicable to desktop-only.
   * `Pre-loads` target page , for target `language`
   * upon `intent`/`hover`.
   *
   * @param
   * { string } lang - Target new `hovered` language.
  */
  function detectIntentBuffer
  (
    lang: string
  ): void
  {
    // ➫ CHECK
    // ➫ Detect change in hover-over lang.
    const if_M_0: boolean =
      timeout_intent != undefined
      && lang != intent_intent_lang
    ;

    // ➫ CHECK
    // ➫ First time set lang and timer.
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

      // ➫ NOTE:
      // ➫ Clear timer.
      clearTimeout(timeout_intent);

      intent_intent_lang = lang;

      if (lang == undefined) return;

      // [🐞]
      dlog
      (
        `${NB_W_TAG} setting new timer!`,
        true,
        NB_W_STY
      );

      // ➫ NOTE:
      // ➫ Start new timer.
      timeout_intent = setTimeout
      (
        () =>
        {
          // [🐞]
          dlog
          (
            `${NB_W_TAG} intent triggered!`,
            true,
            NB_W_STY
          );
          $sessionStore.lang_intent = intent_intent_lang;
        },
        HOVER_TIMEOUT
      );
    }
    else if (if_M_E_0)
    {
      intent_intent_lang = lang
      timeout_intent = setTimeout
      (
        () =>
        {
          // [🐞]
          dlog
          (
            `${NB_W_TAG} intent triggered!`,
            true,
            NB_W_STY
          );
          $sessionStore.lang_intent = intent_intent_lang;
        },
        HOVER_TIMEOUT
      )
    }
  }

  /**
   * @summary
   * 📌 MAIN | IMPORTANT
   *
	 * @description
   * 📌 Updates `user` language platform selection.
   *
   * ⚡️ Manages platform main navigation,
   * for some of the section routes.
   *
   * @param
   * { string } lang - Target new `selected` language.
	 */
	async function selectLanguage
  (
    lang: string
  ): Promise < void >
  {
    if ($sessionStore?.serverLang == lang) return;

    // ➫ NOTE:
		// ➫ Past/previous lang option.
		const pastLang: string =
      $sessionStore?.serverLang == 'en'
				? '/'
				: `/${$sessionStore?.serverLang}`
    ;

    userBetarenaSettings.setLang
    (
      lang
    );

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

    // ➫ NOTE:
		// ➫ Update <html {lang}> in DOCTYPE.
    let tempLang: string = lang;
    if (lang === 'br') tempLang = 'pt-BR';
    document.documentElement.setAttribute
    (
      'lang',
      tempLang
    );

    // ➫ CHECK
    // ➫ on error', navigate back to homepage;
    const if_M_0: boolean =
      $page.error
      && !dev
    ;
		if (if_M_0)
    {
      const targetUrl: string =
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

    // ➫ CHECK
		// ➫ Omit 'special' routes cases, as these routes
    // ➫ manage their own navigation/translation switch.
    const if_M_1: boolean =
      OMIT_URLS.includes($page.route.id)
    ;
    if (if_M_1)
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

    // ➫ CHECK
    // ➫ On profile page route, handle.
    else if (ROUTE_ID_PROFILE == $page.route.id)
    {

      const pastLangV2: string =
        pastLang == `/`
          ? `/en`
          : pastLang
      ;

      let tempUrl: string = `${$page.url.pathname}/`;

			const newURL: string = tempUrl
      ?.replace
      (
        `${pastLangV2}/`,
        `/${lang}`
      );

      // [🐞]
      dlog
      (
        `${NB_W_TAG} inside (PROFILE) ${lang},
        pastLangV2: ${pastLangV2}; tempUrl: ${tempUrl}; newURL: ${newURL}`,
        true,
        NB_W_STY
      );

			await goto
      (
        newURL,
        {
          replaceState: true
        }
      );

    }

    // ➫ NOTE:
    // ➫ Otherwise, continue navigation switch.
    // ➫ NOTE:

		// ➫ CHECK
    // ➫ for 'EN' naviagtion.
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
		// ➫ CHECK
		// ➫ for 'incoming (past)' from an 'EN (/)' route.
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
		// ➫ CHECK
		// ➫ for 'incoming (past)' from an 'non-EN (/)' route.
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

  // #endregion ➤ 🛠️ METHODS

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="lang-container"
  class=
  "
  m-r-16
  "
>

  <!--
  SELECTED LANG
  -->
  <div
    class=
    "
    selected-language-btn
    row-space-out
    cursor-pointer
    "
    class:active-lang-select={isLangDropdown == true}
    on:click={() =>	(isLangDropdown = !isLangDropdown)}
  >

    <p
      class=
      "
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
      width=16
      height=16
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
      {#each B_NAV_T?.langArray.sort() as lang}

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
              class=
              "
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

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

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

</style>