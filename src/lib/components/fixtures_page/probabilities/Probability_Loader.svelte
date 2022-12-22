<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  import { onMount } from "svelte";

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import MobileLoaderMainStd from "./loaders/mobile/Loader_Main_Std.svelte";
	import MobileLoaderProbBtn from "./loaders/mobile/Loader_Prob_Btn.svelte";
	import LoaderBetSite from "./loaders/tablet/Loader_Bet_Site.svelte";
	import LoaderProbBtn from "./loaders/tablet/Loader_Prob_Btn.svelte";
	import LoaderTeamBox from "./loaders/tablet/Loader_Team_Box.svelte";

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// ... TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// ... MOBILE - VIEW
		if (wInit < 768) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// ... TABLET - VIEW
			if (w > 768) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// ... MOBILE - VIEW
			if (w < 768) {
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

<div>
  <!-- 
  [ℹ] widget-component -->
  <div 
    id="fixture-prob-loader"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

    <!-- 
    [ℹ] [MOBILE]
    -->
    {#if mobileExclusive}

      <div
        id="featured-box-txt"
        class="text-center">
        <LoaderBetSite />
      </div>

      <!-- 
      [ℹ] team-box head
      -->
      <div
        id="team-box"
        class="
          row-space-out
        ">
        {#each {length: 3} as _,i}
          <div>
            <MobileLoaderMainStd />
            <MobileLoaderProbBtn />
            <MobileLoaderMainStd />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] probability head
      -->
      <div
        id="row-prob-head"
        class="
          row-space-out
        ">
        {#each {length: 3} as _,i}
          <div>
            <MobileLoaderMainStd />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] probability row
      -->
      {#each {length: 5} as _,i}
        <div
          class="
            row-space-out
            row-prob
          ">
          <div>
            <MobileLoaderMainStd />
          </div>
          <div>
            <MobileLoaderProbBtn />
          </div>
          <div>
            <MobileLoaderProbBtn />
          </div>
        </div>
      {/each}

    {/if}

    <!-- 
    [ℹ] [DESKTOP] [TABLET]
    -->
    {#if !mobileExclusive}

      <div
        id="featured-box-txt"
        class="text-center">
        <LoaderBetSite />
      </div>

      <!-- 
      [ℹ] team-box head
      -->
      <div
        id="team-box"
        class="
          row-space-out
        ">
        {#each {length: 3} as _,i}
          <div>
            <LoaderTeamBox />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] probability head
      -->
      <div
        id="row-prob-head"
        class="
          row-space-out
        ">
        {#each {length: 3} as _,i}
          <div>
            <LoaderBetSite />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] probability row
      -->
      {#each {length: 5} as _,i}
        <div
          class="
            row-space-out
            row-prob
          ">
          <div>
            <LoaderBetSite />
          </div>
          <div>
            <LoaderProbBtn />
          </div>
          <div>
            <LoaderProbBtn />
          </div>
        </div>
      {/each}

    {/if}

  </div>
</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  #fixture-prob-loader {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    overflow: hidden;
    padding: 20px; 
    width: 100%;
    min-width: -webkit-fill-available;
    margin-top: 40px;
    position: relative;
  }

  /* top-loader box */
  div#featured-box-txt {
    margin-bottom: 23px;
  }

  /* team-loader box */
  div#team-box {
    padding-bottom: 12px;
    border-bottom: 1px #E6E6E6 solid;
  } div#team-box div {
    margin-right: 7px;
  } div#team-box div:last-child {
    margin-right: 0;
  }

  /* row-prob-loader [head] box */
  div#row-prob-head {
    margin-top: 17px;
    margin-bottom: 12px;
  } div#row-prob-head div {
    width: 100%;
    margin-right: 8px;
  } div#row-prob-head div:last-child {
    margin-right: 0;
  }

  /* row-prob-loader [row] box */
  div.row-prob {
    margin-bottom: 12px;
  } div.row-prob div {
    width: 100%;
    margin-right: 8px;
  } div.row-prob div:last-child {
    margin-right: 0;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  TABLET RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #fixture-prob-loader {
      min-width: 100%;
      /* max-width: 700px; */
    }

    #fixture-prob-loader div#team-box {
      width: -webkit-fill-available;
      /* padding: 0 40px 12px 40px; */
      border-bottom: 1px #E6E6E6 solid;
    }

    /* row-prob-loader [head] box */
    div#row-prob-head {
      margin-top: 17px;
      margin-bottom: 12px;
    } div#row-prob-head div {
      width: 100%;
      text-align: center;
      margin-right: 8px;
    } div#row-prob-head div:first-child {
      text-align: start;
    } div#row-prob-head div:last-child {
      margin-right: 0;
    }

    /* row-prob-loader [row] box */
    div.row-prob {
      margin-bottom: 12px;
    } div.row-prob div {
      width: 100%;
      margin-right: 8px;
    } div.row-prob div:last-child {
      margin-right: 0;
    } div.row-prob div.prob-box-btn div:first-child {
      margin-right: 24px;
    } :global(div.row-prob div svg) {
      width: 100%;
    } :global(div.row-prob div:first-child svg) {
      width: auto;
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #fixture-prob-loader {
      min-width: 100%;
      /* max-width: 560px; */
    }
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#fixture-prob-loader.dark-background-1 div#team-box {
    border-bottom: 1px #616161 solid;
  }

</style>
