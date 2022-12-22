<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import DesktopLoaderBottom from "./loaders/desktop/Loader_Bottom.svelte";
	import DesktopLoaderMiddle from "./loaders/desktop/Loader_Middle.svelte";
	import DesktopLoaderTeam from "./loaders/desktop/Loader_Team.svelte";
	import DesktopLoaderTop from "./loaders/desktop/Loader_Top.svelte";

  import MobileLoaderBottom from "./loaders/mobile/Loader_Bottom.svelte";
  import MobileLoaderMiddle from "./loaders/mobile/Loader_Middle.svelte";
  import MobileLoaderTeam from "./loaders/mobile/Loader_Team.svelte";
  import MobileLoaderTop from "./loaders/mobile/Loader_Top.svelte";

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// [ℹ] TABLET - VIEW
			if (w > 768) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// [ℹ] MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});
</script>


<!-- ===============
    COMPONENT HTML 
==================== -->

<div
  id="fixture-scoreboard-loader"
  class="column-space-center"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

  <!-- 
  [ℹ] [DESKTOP] [TABLET]
  -->
  {#if !mobileExclusive}
    <div
      id="fixture-scoreboard-top-box"
      class="column-space-center">

      <div>
        <DesktopLoaderTop />
      </div>

      <div
        class="row-space-out">
        <div
          class="m-r-10">
          <DesktopLoaderTeam />
        </div>
        <div>
          <DesktopLoaderMiddle />
        </div>
        <div
          class="m-l-10">
          <DesktopLoaderTeam />
        </div>
      </div>
    </div>

    <div
      id="fixture-scoreboard-bottom-box">
      <DesktopLoaderBottom />
    </div>
  <!-- 
  [ℹ] [MOBILE]
  -->
  {:else}
    <div
      id="fixture-scoreboard-top-box"
      class="column-space-center">

      <div>
        <MobileLoaderTop />
      </div>

      <div
        class="row-space-out">
        <div
          class="m-r-10">
          <MobileLoaderTeam />
        </div>
        <div>
          <MobileLoaderMiddle />
        </div>
        <div
          class="m-l-10">
          <MobileLoaderTeam />
        </div>
      </div>
    </div>

    <div
      id="fixture-scoreboard-bottom-box">
      <MobileLoaderBottom />
    </div>
  {/if}
  
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  div#fixture-scoreboard-loader {
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    width: 100%;
		min-width: 100%;
    overflow: hidden;
    border-radius: 12px;
	}

  div#fixture-scoreboard-top-box {
    background: #4B4B4B;
    padding: 20px 20px 50px 20px;
  }

  div#fixture-scoreboard-bottom-box {
    background: #FFFFFF;
    width: 100%;
    text-align: center;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    div#fixture-scoreboard-top-box {
      padding: 20px 50px 45px 50px;
    }

  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1001px)  {

    div#fixture-scoreboard-top-box {
      padding: 20px 70px 45px 70px;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#fixture-scoreboard-loader.dark-background-1 div#fixture-scoreboard-bottom-box {
    background: #4B4B4B !important;
  }

</style>
