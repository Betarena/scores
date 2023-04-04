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

	import LoaderRow2 from "./loaders/shared/Loader-Row-2.svelte";
	import LoaderRow from "./loaders/shared/Loader-Row.svelte";
	import LoaderTopButton from "./loaders/shared/Loader-Top-Button.svelte";
	import LoaderTop from "./loaders/shared/Loader-Top.svelte";

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

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="player-fixture-loader"
  class="widget-component">
  <LoaderTopButton />
  <div>
    {#each { length: 4 } as _, i}
      <div
        class="
          loader-box
        ">
        <LoaderTop />
      </div>
      {#each { length: 3 } as _, i}
        <div
          class="
            m-b-12
            row-space-start
          ">
          <div
            class="
              m-r-15
            ">
            <LoaderRow />
          </div>
          <div
            class="fixture-row">
            <LoaderRow2 />
          </div>
        </div>
      {/each}
    {/each}
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  .widget-component {
    padding: 20px;
  }

  .loader-box {
    margin: 22px 0;
  }

  div#player-fixture-loader .fixture-row {
    width: 100%;
  } :global(div#player-fixture-loader .fixture-row svg) {
    width: 100%;
  }

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