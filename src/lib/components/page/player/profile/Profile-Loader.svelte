<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { viewport_change } from "$lib/utils/platform-functions";
	import { onMount } from "svelte";
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

	import MobileLoaderBottom from "./loaders/mobile/Loader-Bottom.svelte";
	import MobileLoaderTop from "./loaders/mobile/Loader-Top.svelte";
	import LoaderStatBox_1 from "./loaders/shared/Loader-StatBox-1.svelte";
	import LoaderStatBox_2 from "./loaders/shared/Loader-StatBox-2.svelte";
	import TabletLoaderButton from "./loaders/tablet/Loader-Button.svelte";
	import TabletLoaderTop from "./loaders/tablet/Loader-Top.svelte";

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
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 650;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

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
  class="widget-component">

  <!-- 📱 MOBILE -->
  {#if mobileExclusive}

    <!-- 
    top main (#1) 
    -->
    <MobileLoaderTop />
    <!-- 
    row (#1) 
    -->
    <div
      class="
        row-space-start
        m-t-15
      ">
      <div
        class="statbox-loader">
        <LoaderStatBox_1 />
      </div>
      <div
        class="statbox-loader">
        <LoaderStatBox_1 />
      </div>
    </div>
    <!-- 
    row (#2) 
    -->
    <div
      class="
        row-space-start
        m-t-15
      ">
      <div
        class="statbox-loader">
        <LoaderStatBox_1 />
      </div>
      <div
        class="statbox-loader">
        <LoaderStatBox_2 />
      </div>
      <div
        class="statbox-loader">
        <LoaderStatBox_2 />
      </div>
    </div>
    <!-- 
    bottom btn 
    -->
    <div
      class="m-t-15">
      <MobileLoaderBottom />
    </div>

  <!-- 💻 TABLET -->
  {:else if !mobileExclusive && tabletExclusive}
    
    <div
      class="row-space-out">
      <TabletLoaderTop />
      <TabletLoaderButton />
    </div>
    <!-- 
    row (#2) 
    -->
    <div
      class="
        row-space-start
        m-t-15
      ">
      <div
        class="statbox-loader">
        <LoaderStatBox_1 />
      </div>
      <div
        class="statbox-loader">
        <LoaderStatBox_2 />
      </div>
      <div
        class="statbox-loader">
        <LoaderStatBox_2 />
      </div>
    </div>

  {:else}

    <div
      class="
        row-space-out
      ">
      <TabletLoaderTop />
      <div
        class="
          row-space-end
          width-auto
        ">
        <div
          class="
            row-space-start
            m-t-15
          ">
          <div
            class="statbox-loader">
            <LoaderStatBox_1 />
          </div>
          <div
            class="statbox-loader">
            <LoaderStatBox_2 />
          </div>
          <div
            class="statbox-loader">
            <LoaderStatBox_2 />
          </div>
        </div>
        <TabletLoaderButton />
      </div>
    </div>

  {/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  .widget-component {
    padding: 20px;
  }
  
  div.statbox-loader {
    padding: 0 20px;
    border-left: 1px solid var(--grey-shade);
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

  :global(.dark-background div.statbox-loader) {
    border-left: 1px solid var(--dark-theme-1-shade);
  }

</style>