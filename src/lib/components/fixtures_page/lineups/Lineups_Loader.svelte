<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from '$app/environment';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import MobileLoaderTeamSelRow from "./loaders/mobile/Loader_Team_Sel_Row.svelte";
	import MobileLoaderPitchVector from "./loaders/mobile/Loader_Pitch_Vector.svelte";
	import MobileLoaderTeamRow from "./loaders/mobile/Loader_Team_Row.svelte";

	import TabletLoaderPitchVector from "./loaders/tablet/Loader_Pitch_Vector.svelte";
	import TabletLoaderTeamRowLeft from "./loaders/tablet/Loader_Team_Row_Left.svelte";
	import TabletLoaderTeamRowRight from "./loaders/tablet/Loader_Team_Row_Right.svelte";

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
  id="fixture-lineups-loader"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

  <!-- 
  [ℹ] [MOBILE]
  -->
  {#if mobileExclusive}

    <MobileLoaderTeamSelRow />
    <MobileLoaderPitchVector />

    <div
      id="loader-player-box">
      <div
        class="loader-player-row">
        <MobileLoaderTeamRow />
      </div>
      {#each {length: 3} as _,i}
        <div
          class="loader-player-row">
          <MobileLoaderTeamRow />
        </div>
      {/each}
    </div>
    
  <!-- 
  [ℹ] [DESKTOP] [TABLET]
  -->
  {:else}

    <TabletLoaderPitchVector />

    <div
      class="row-space-out">

      <!-- 
      [ℹ] left box -->
      <div
        id="loader-player-box">
        <div
          class="
            loader-player-row
            row-space-start
          ">
          <TabletLoaderTeamRowLeft />
        </div>
        {#each {length: 3} as _,i}
          <div
            class="
              loader-player-row
              row-space-start
            ">
            <TabletLoaderTeamRowLeft />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] right box -->
      <div
        id="loader-player-box">
        <div
          class="
            loader-player-row
            row-space-end
          ">
          <TabletLoaderTeamRowRight />
        </div>
        {#each {length: 3} as _,i}
          <div
            class="
              loader-player-row
              row-space-end
            ">
            <TabletLoaderTeamRowRight />
          </div>
        {/each}
      </div>

    </div>

  {/if}
  
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  div#fixture-lineups-loader {
    background-color: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    width: 100%;
		min-width: 100%;
    overflow: hidden;
    border-radius: 12px;
    /* dynamic */
    padding: 20px;
	}

  /* plyaer row box */
  div#fixture-lineups-loader div#loader-player-box div.loader-player-row:first-child {
    border-bottom: 1px solid #E6E6E6;
    padding: 15px 0;
    margin-bottom: 8px;
  } div#fixture-lineups-loader div#loader-player-box div.loader-player-row {
    padding: 8px 0;
  } div#fixture-lineups-loader div#loader-player-box div.loader-player-row:last-child {
    padding: 8px 0 0 0;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {
    /* EMPTY */
  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1001px)  {

    /* plyaer row box */
    div#fixture-lineups-loader div#loader-player-box {
      width: 100%;
    }
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#fixture-lineups-loader.dark-background-1 div#loader-player-box div.loader-player-row:first-child {
    border-bottom: 1px solid #616161;
  }

</style>
