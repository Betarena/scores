<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import sessionStore from "$lib/store/session.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    navKey: string,
    navUrl: string,
    navTxt: string,
    isProfilePage: boolean,
    soonTxt: string = '',
    isSoon: boolean = false,
    disableAnchor: boolean = false,
    isViewTablet: boolean,
    isViewMobile: boolean
  ;

  // #endregion ➤ 📌 VARIABLES

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
  class:active={navKey == 'scores' && !isProfilePage}
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