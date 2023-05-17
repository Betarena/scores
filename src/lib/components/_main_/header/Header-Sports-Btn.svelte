<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

  import { createEventDispatcher } from 'svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  const dispatch = createEventDispatcher();

  export let sportNameDefault: string;
  export let sportTranslation: string;
  export let sportValue: string;
  export let selectedSport: string;
  
  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

	function clickAction
  (
  )
  {
    dispatch
    (
      'closeDropdown',
      {
        selectedSport: sportNameDefault
      }
    );
	}

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

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

<button
  class="
    sports-btn 
    row-space-out 
    cursor-not-allowed
  "
  on:click={() => clickAction()}
  class:selected-sports={selectedSport == sportNameDefault}
>

  <!-- 
  SPORT IMG + NAME
  -->
  <div
    class="row-space-out"
    style="width: fit-content;"
  >
    <img
      loading="lazy"
      class="m-r-5 soon-opacitiy"
      src={`/assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}.svg`}
      alt="${sportNameDefault}-img"
      width=20
      height=20
    />
    <p
      class="
        color-white 
        s-14 
        m-r-10 
        soon-opacitiy
      "
    >
      {sportTranslation}
    </p>
  </div>

  <!-- 
  SPORT VALUE (NUM/SOON)
  -->
  <p
    class="
      color-white 
      s-14 
      sport-counter-dark
      sport-counter
    "
  >
    {sportValue}
  </p>

</button>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  button.sports-btn 
  {
    /* s */
		background: var(--dark-theme-1);
		border: 1px solid var(--grey) !important;
		box-sizing: border-box;
		border-radius: 29px;
		width: 200px;
		height: 44px;
		padding: 8.5px 10px 8.5px 12.5px;
	}
  button.sports-btn.selected-sports 
  {
		border: 1px solid #f5620f !important;
	}
  button.sports-btn .sport-counter-dark 
  {
    /* s */
		background-color: var(--dark-theme);
		padding: 3px 8px;
		border-radius: 20px;
	}
  button.sports-btn:hover 
  {
    /* s */
		background: var(--dark-theme);
	}
	button.sports-btn:hover .sport-counter-dark 
  {
    /* s */
		background: var(--dark-theme-1);
	}

	.soon-opacitiy {
		opacity: 0.5;
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