<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { sessionStore } from "$lib/store/session.js";

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  export let navKey: string;
  export let navUrl: string;
  export let navTxt: string;
  export let soonTxt: string = '';
  export let isSoon: boolean = false;
  export let disableAnchor: boolean = false;
  export let tabletExclusive: boolean;
  export let mobileExclusive: boolean;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

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
  class="
    nav-box
    cursor-pointer
  "
  class:m-b-30={tabletExclusive || mobileExclusive}
  class:active={navKey == 'scores'}
  class:disable-anchor={disableAnchor}
  on:mouseover={() => $sessionStore.navBtnHover = navKey}
  on:mouseout={() => $sessionStore.navBtnHover = undefined}
>

  <a
    href={navUrl}
    target="_blank"
  >
    <p
      class="
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