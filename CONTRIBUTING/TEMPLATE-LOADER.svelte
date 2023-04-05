<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

  //#region ➤ Svelte/SvelteKit Imports
  // IMPORTS GO HERE
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // IMPORTS GO HERE
  //#endregion ➤ Project Custom Imports

  //#region ➤ Types Imports
  // IMPORTS GO HERE
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // IMPORTS GO HERE
  //#endregion ➤ Assets Imports

	import LivescoresTopRow from './Livescores_Top_Row.svelte';
	import LoaderRow from './loaders/Loader_Row.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

  LoaderRow

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  class="widget-component">
  <LivescoresTopRow 
    numOfFixtures={0}
    numOfFixturesLive={0}
  />
  <div>
    {#each { length: 10 } as _, i}
      <div
        class="
          livescores-fixture-row-loader
        "
      >
        <LoaderRow />
      </div>
    {/each}
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  :global(div.livescores-fixture-row-loader) {
    border-top: 1px solid var(--grey-color);
    padding-top: 20px;
    padding-bottom: 10px;
    padding: 20px;
    text-align: center;
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen and (min-width: 768px) {
		.widget-component {
			margin-top: 40px;
		}
	}

  /*
  =============
  DARK-THEME
  =============
  */

  :global(.dark-background div.livescores-fixture-row-loader) {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

</style>