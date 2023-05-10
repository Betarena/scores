<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

  import PstatLoaderLeftTBoxRow from "./PSTAT-Loader-Left-T-Box-Row.svelte";
  import PstatLoaderRatingGrid from "./PSTAT-Loader-RatingGrid.svelte";
  import PstatLoaderTtRightOvalBox from "./PSTAT-Loader-TT-RightOvalBox.svelte";
  import PstatLoaderTeamBox from "./PSTAT-Loader-TeamBox.svelte";

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

<!-- 
Avg. Rating
Fixtures Icons
Fixtures Grid Ratings
-->
<div
  class="
    m-b-25
  ">
  <div
    class="
      m-b-16
      row-space-out
    "
  >
    <PstatLoaderLeftTBoxRow />
    <PstatLoaderTtRightOvalBox />
  </div>
  <div
    class="
      row-space-out
      m-b-15
    ">
    {#each { length: 5 } as _, i}
      <PstatLoaderTeamBox/>
    {/each}
  </div>
  <PstatLoaderRatingGrid/>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

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