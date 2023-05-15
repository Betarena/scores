<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { onMount } from "svelte";

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

	import { viewport_change } from "$lib/utils/platform-functions.js";

	import PteamLoaderDeskPitchVector from "./loaders/desktop/PTEAM-Loader-Desk-Pitch-Vector.svelte";
	import PteamLoaderMobPitchVector from "./loaders/mobile/PTEAM-Loader-Mob-Pitch-Vector.svelte";
	import PteamLoaderStat from "./loaders/shared/PTEAM-Loader-Stat.svelte";
	import PteamLoaderTeam from "./loaders/shared/PTEAM-Loader-Team.svelte";
	import PteamLoaderTabPitchVector from "./loaders/tablet/PTEAM-Loader-Tab-Pitch-Vector.svelte";

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

  const TABLET_VIEW = 1024;
	const MOBILE_VIEW = 475;
  let tabletExclusive: boolean = false;
	let mobileExclusive: boolean = false;

	onMount
  (
    async () => 
    {
      [
        tabletExclusive, 
        mobileExclusive,
      ] = viewport_change
      (
        TABLET_VIEW, 
        MOBILE_VIEW
      );
      window.addEventListener
      (
        'resize',
        function () {
          [
            tabletExclusive, 
            mobileExclusive
          ] =
          viewport_change
          (
            TABLET_VIEW,
            MOBILE_VIEW
          );
        }
      );
	  }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="player-fixture-loader"
  class="widget-component">

  {#if mobileExclusive && tabletExclusive}
    <PteamLoaderMobPitchVector />
  {/if}

  {#if !mobileExclusive && tabletExclusive}
    <PteamLoaderTabPitchVector />
  {/if}

  {#if !mobileExclusive && !tabletExclusive}
    <PteamLoaderDeskPitchVector />
  {/if}

  <div
    class="
      row-space-start
    "
    class:m-t-20={!mobileExclusive}
    class:column-start-grid-start={mobileExclusive}
  >
    <div
      class="
        m-r-40
      "
      class:m-t-20={mobileExclusive}
      class:m-b-20={mobileExclusive}
    >
      <PteamLoaderTeam />
    </div>
    <div
      class="
        row-space-start
      ">
      <div
        class="
          m-r-12
          pteam-box-stat
        "
        class:m-r-40={mobileExclusive}
      >
        <PteamLoaderStat />
      </div>
      <div
        class="
          pteam-box-stat
        "
      >
        <PteamLoaderStat />
      </div>
    </div>
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

  div.pteam-box-stat
  {
    border-left: 1px solid var(--grey-color);
    padding-left: 16px;
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

  :global(.dark-background div.pteam-box-stat)
  {
    border-color: var(--dark-theme-1-shade);
  }

</style>