<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { onMount } from "svelte";

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

	import { viewport_change } from "$lib/utils/platform-functions.js";

  import PseoLoaderFaqRow from "./loaders/shared/PSEO-Loader-FAQ-Row.svelte";
  import PseoLoaderRow from "./loaders/shared/PSEO-Loader_Row.svelte";

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
  id="player-seo-loader"
  class="widget-component">

  {#each { length: 8 } as _, i}
    <div class="m-b-25">
      <PseoLoaderRow />
    </div>
  {/each}

  <div id="faq-section">
    {#each { length: 5 } as _, i}
      <div class="faq-row row-space-out">
        <PseoLoaderFaqRow />
        <div
          class="row-space-end"
          style="width: 100%;"
        >
          <img
            src="/assets/svg/chevron-down.svg"
            alt="default alt text"
            width="20px"
            height="20px"
          />
        </div>
      </div>
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

  /* FAQ | Section */
  #player-seo-loader div#faq-section div.faq-row:first-child 
  {
		border: 1px solid var(--grey-color);
		border-radius: 12px 12px 0 0 !important;
	}
	#player-seo-loader div#faq-section div.faq-row:last-child 
  {
		border: 1px solid var(--grey-color);
		border-radius: 0 0 12px 12px !important;
	}
	#player-seo-loader div#faq-section div.faq-row 
  {
		border: 1px solid var(--grey-color);
		padding: 20px;
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

  :global(#player-seo-loader.dark-background div#faq-section div.faq-row)
  {
		border: 1px solid var(--dark-theme-1-shade) !important;
	}

</style>