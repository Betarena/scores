<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from "$app/stores";
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import { fly } from "svelte/transition";

	import sessionStore from "$lib/store/session.js";
	import { dlog, NB_W_TAG } from "$lib/utils/debug.js";
	import { selectLanguage } from "$lib/utils/platform-functions.js";

  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    /** @description TODO: DOC: */
    dropDownArea: boolean
  ;

  const
    /** @description TODO: DOC: */
    HOVER_TIMEOUT = 250,
    /** @description TODO: DOC: */
    dispatch: EventDispatcher<any> = createEventDispatcher()
  ;

  let
    /** @description TODO: DOC: */
    B_NAV_T: B_NAV_T = $page.data.B_NAV_T,
    /** @description TODO: DOC: */
    isLangDropdown: boolean = false,
    /** @description TODO: DOC: */
    intent_intent_lang: string | undefined = undefined,
    /** @description TODO: DOC: */
    timeout_intent: NodeJS.Timeout = undefined
  ;

  $: B_NAV_T = $page.data.B_NAV_T;

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
        `${NB_W_TAG[0]} clearning timer!`,
      );

      // ➫ NOTE:
      // ➫ Clear timer.
      clearTimeout(timeout_intent);

      intent_intent_lang = lang;

      if (lang == undefined) return;

      // [🐞]
      dlog
      (
        `${NB_W_TAG[0]} setting new timer!`
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
            `${NB_W_TAG[0]} intent triggered!`,
            true
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
            `${NB_W_TAG[0]} intent triggered!`,
            true
          );
          $sessionStore.lang_intent = intent_intent_lang;
        },
        HOVER_TIMEOUT
      )
    }
  }

  /**
   * @description
   * TODO: DOC:
   */
	function clickAction
  (
  ): void
  {
    isLangDropdown = !isLangDropdown;

    // ### CHECK
    // ### for language dropdown action.
    if (!isLangDropdown) return;

    dispatch
    (
      'closeDropdown'
    );

    return;
	}

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  $: if (!dropDownArea) isLangDropdown = false;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
    class:active-lang-select={isLangDropdown}
    on:click={() =>	clickAction()}
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
      alt={!isLangDropdown ? 'arrow_down' : 'arrow_up'}
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
            on:click={() =>	selectLanguage(lang, $page)}
            on:keydown={() => selectLanguage(lang, $page)}
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
    /* 📌 position */
		position: relative;
	}

	div.selected-language-btn
  {
    /* 🎨 style */
		color: #ffffff;
		outline: none;
		border: none;
		padding: 5px 12px;
		background-color: transparent;
	}
	div#lang-container div.selected-language-btn:hover,
	div#lang-container div.selected-language-btn.active-lang-select
  {
    /* 🎨 style */
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}

	#dropdown-menu
  {
    /* 📌 position */
		position: absolute;
		z-index: 5000;
		top: 100%;
		left: -20%;
    /* 🎨 style */
		width: 88px;
		margin-top: 5px;
		border-radius: 4px;
		background: #292929;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}
	#lang-select
  {
    /* 🎨 style */
		padding: 10px 0;
		text-align: center;
		background: #4b4b4b;
		cursor: pointer;
		box-shadow: inset 0px -1px 0px #3c3c3c;
	}
	#lang-select:hover
  {
    /* 🎨 style */
		background: #292929;
		box-shadow: inset 0px -1px 0px #3c3c3c;
	}

</style>