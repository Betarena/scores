<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  import { onMount } from "svelte";

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import LoaderOddsBoxL from "./loaders/tablet/Loader_Odds_Box_L.svelte";
	import LoaderOddsBoxR from "./loaders/tablet/Loader_Odds_Box_R.svelte";
	import LoaderPastFixture from "./loaders/tablet/Loader_Past_Fixture.svelte";
	import LoaderTopProgressBar from "./loaders/tablet/Loader_Top_Progress_Bar.svelte";
	import LoaderTopStatsBox from "./loaders/tablet/Loader_Top_Stats_Box.svelte";
	import LoaderTopWidgetTeamInfo from "./loaders/tablet/Loader_Top_Widget_Team_Info.svelte";
	import TopWidgetText from "./loaders/tablet/Loader_Top_Widget_Text.svelte";

	import MobileLoaderPastFixture from "./loaders/mobile/Loader_Past_Fixture.svelte";
	import MobileLoaderProgressBarBox_L from "./loaders/mobile/Loader_Progress_Bar_Box_L.svelte";
	import MobileLoaderProgressBarBox_R from "./loaders/mobile/Loader_Progress_Bar_Box_R.svelte";
	import MobileLoaderTeamIcon from "./loaders/mobile/Loader_Team_Icon.svelte";

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		if (wInit < 768) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			if (w > 768) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
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
  [ℹ] widget-component 
  -->
  <div 
    id="fixture-prob-loader"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

    <!-- 
    [ℹ] [MOBILE]
    -->
    {#if mobileExclusive}

      <TopWidgetText />

      <div
        class="row-space-out">
        <MobileLoaderTeamIcon />
        <LoaderTopStatsBox />
        <MobileLoaderTeamIcon />
      </div>

      <div
        class="row-space-out">
        <MobileLoaderProgressBarBox_L />
        <MobileLoaderProgressBarBox_R />
      </div>

      <!-- 
      [ℹ] fixture bet-stats info
      -->
      <div
        id="grid-bet-stats">
        {#each {length: 6} as i,_}
          <div
            class="
              row-space-out
              fixture-info-box
            ">
            <LoaderOddsBoxL />
            <LoaderOddsBoxR />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] fixture past-fixtures
      -->
      {#each {length: 5} as item}
        <div
          class="
            row-space-out
            fixture-past-box
          ">
          <MobileLoaderPastFixture />
        </div>
      {/each}

    {/if}

    <!-- 
    [ℹ] [DESKTOP] [TABLET]
    -->
    {#if !mobileExclusive}

      <TopWidgetText />
      
      <div
        class="row-space-out">
        <LoaderTopWidgetTeamInfo />
        <LoaderTopStatsBox />
        <LoaderTopWidgetTeamInfo />
      </div>

      <div
        class="row-space-out">
        <LoaderTopProgressBar />
        <LoaderTopProgressBar />
      </div>

      <!-- 
      [ℹ] fixture bet-stats info
      -->
      <div
        id="grid-bet-stats">
        {#each {length: 6} as i,_}
          <div
            class="
              row-space-out
              fixture-info-box
            ">
            <LoaderOddsBoxL />
            <LoaderOddsBoxR />
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] fixture past-fixtures
      -->
      {#each {length: 5} as item}
        <div
          class="
            row-space-out
            fixture-past-box
          ">
          <LoaderPastFixture />
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

  /* fixture bet info */
  div#grid-bet-stats {
    margin-top: 20px;
  }
  div.fixture-info-box {
    border-bottom: 1px solid #E6E6E6;
    padding: 12px 0;
  }

  div.fixture-past-box:last-child {
    border: none !important;
  } div.fixture-past-box {
    border-bottom: 1px solid #E6E6E6;
    padding: 16px 0;
    justify-content: center;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  [TABLET] && [DESKTOP] RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #fixture-prob-loader {
      min-width: 100%;
      /* max-width: 700px; */
    }

    div#grid-bet-stats {
      position: relative;
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: 1fr 1fr;
    }
    div.fixture-info-box {
      border: 1px solid #E6E6E6;
      border-radius: 8px;
      padding: 12px 20px;
    }

    div.fixture-past-box {
      padding: 24px 0;
      justify-content: unset;
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
