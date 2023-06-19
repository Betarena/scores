<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

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
  class="
    nav-box
    cursor-pointer
  "
  class:m-b-30={tabletExclusive || mobileExclusive}
  class:active={navKey == 'scores'}
  class:disable-anchor={disableAnchor}
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

  {#if !tabletExclusive}
    <div class="nav-triangle" />
  {/if}

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
  div.nav-box div.nav-triangle
  {
    /* p */
    position: absolute;
    bottom: -21px;
    right: 55%;
    /* s */
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid var(--dark-theme-1);
    opacity: 0;
  }
  div.nav-box.active p
  {
    /* s */
    color: var(--primary) !important;
  }
  div.nav-box.active div.nav-triangle
  {
    /* s */
    opacity: 1;
  }
  div.nav-box:hover a p
  {
    /* s */
    color: var(--primary) !important;
  }
  div.nav-box:hover div.nav-triangle
  {
    opacity: 1;
  }

  .pill
  {
    /* s */
    background-color: var(--dark-theme-1);
		padding: 3px 8px;
		border-radius: 20px;
    height: 24px;
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