<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

  import PstatBLoaderRatingGrid from "./loaders/PSTAT-BLoader-RatingGrid.svelte";
  import PstatLoaderLeftMBoxRow from "./loaders/PSTAT-Loader-Left-M-Box-Row.svelte";
  import PstatLoaderLeftTBoxRow from "./loaders/PSTAT-Loader-Left-T-Box-Row.svelte";
  import PstatLoaderLeftMainBox from "./loaders/PSTAT-Loader-LeftMainBox.svelte";
  import PstatLoaderRightMBoxRow from "./loaders/PSTAT-Loader-Right-M-Box-Row.svelte";
  import PstatLoaderRightTBoxRow from "./loaders/PSTAT-Loader-Right-T-Box-Row.svelte";
  import PstatLoaderRightMainBox from "./loaders/PSTAT-Loader-RightMainBox.svelte";

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
  <!-- 
  Top Main Loader Row
  -->
  <div
    class="
      row-space-out
      m-b-20
    ">
    <div
      class="
        m-r-16
      "
    >
      <PstatLoaderLeftMainBox />
    </div>
    <PstatLoaderRightMainBox />
  </div>
  <!-- 
  Avg. Rating
  Fixtures Icons
  Fixtures Grid Ratings
  -->
  <div
    class="
      m-b-25
    ">
    <PstatBLoaderRatingGrid/>
  </div>
  <!-- 
  Rows loaders
  -->
  <div>
    {#each { length: 6 } as _, i}
      <div
        class="
          loader-box
          m-t-15
          m-b-16
          row-space-out
        "
        style="
          border-top: 1px solid #E6E6E6;
          padding-top: 14px;
        "
      >
        <PstatLoaderLeftTBoxRow />
        <PstatLoaderRightTBoxRow />
      </div>
      {#each { length: 4 } as _, i}
        <div
          class="
            m-b-16
            row-space-out
          "
        >
          <PstatLoaderLeftMBoxRow />
          <PstatLoaderRightMBoxRow />
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