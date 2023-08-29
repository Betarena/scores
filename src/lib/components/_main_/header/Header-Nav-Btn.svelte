<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from "$app/stores";

	import sessionStore from "$lib/store/session.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    /** @description TODO: DOC: */
    navKey: string,
    /** @description TODO: DOC: */
    navUrl: string,
    /** @description TODO: DOC: */
    navTxt: string,
    /** @description Translation of target 'soon' text */
    soonTxt: string = '',
    /** @description Wether target navigation is not yet available and should contain a warning `soon` */
    isSoon: boolean = false,
    /** @description TODO: DOC: */
    disableAnchor: boolean = false,
    /** @description TODO: DOC: */
    isViewTablet: boolean,
    /** @description TODO: DOC: */
    isViewMobile: boolean
  ;

  let
    /** @description TODO: DOC: */
    isProfilePage: boolean,
    /** @description TODO: DOC: */
    isRouteCompetitions: boolean
  ;

  $: isRouteCompetitions = $page?.route?.id.includes('/[[lang=lang]]/[competitions=competitions]');
  $: isProfilePage = $page?.route?.id == '/u/[view]/[lang=lang]';

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
  */
  $: if_R_0 =
    navKey == 'scores' && !isRouteCompetitions && !isProfilePage
    || navKey == 'competitions' && isRouteCompetitions && !isProfilePage
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id={navKey}
  class=
  "
  nav-box
  cursor-pointer
  "
  class:m-b-30={isViewTablet || isViewMobile}
  class:active={if_R_0}
  class:disable-anchor={disableAnchor}
  on:mouseover={() => $sessionStore.navBtnHover = navKey}
  on:mouseout={() => $sessionStore.navBtnHover = undefined}
>

  <a
    href={navUrl}
    target={navKey == 'content' ? '_blank' : '_self'}
  >
    <p
      class=
      "
      color-grey
      s-14
      w-500
      m-r-32
      uppercase
      no-wrap
      "
    >
      {navTxt}

      {#if isSoon}
        <span
          class=
          "
          color-white
          s-12
          m-l-10
          pill
          lowercase
          "
        >
          {soonTxt}
        </span>
      {/if}

    </p>
  </a>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div.nav-box
  {
    /* p */
    position: relative;
  }
  div.nav-box.active p
  {
    /* s */
    color: var(--primary) !important;
  }
  div.nav-box:hover a p
  {
    /* s */
    color: var(--white) !important;
  }

  .pill
  {
    /* s */
    height: 24px;
		padding: 3px 8px;
    background-color: var(--dark-theme-1);
		border-radius: 20px;
  }

  /*
  =============
  RESPONSIVNESS
  =============
  */

  /*
  =============
  DARK-THEME
  =============
  */

</style>