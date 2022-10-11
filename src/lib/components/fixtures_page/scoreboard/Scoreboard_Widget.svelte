<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup } from "$lib/utils/debug";

  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";

	import type { 
    REDIS_CACHE_SINGLE_scoreboard_data 
  } from "$lib/models/fixtures/scoreboard/types";

	import ScoreboardLoader from "./Scoreboard_Loader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
	import banner from './assets/banner.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

	export let FIXTURE_SCOREBOARD: REDIS_CACHE_SINGLE_scoreboard_data;

  let loaded:                   boolean = false;                // [ℹ] holds boolean for data loaded;
  let refresh:                  boolean = false;                // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:             any = undefined;                // [ℹ] refresh-data value speed;
  let no_widget_data:           any = false;                    // [ℹ] identifies the no_widget_data boolean;
  let currentSeason:            number = undefined;

  // [🐞]
  let diasbleDev:               boolean = false;
  let dev_console_tag:          string = "fixtures | scoreboard [DEV]";

  // [🐞]
  $: if (dev && diasbleDev) logDevGroup (`${dev_console_tag}`, `FIXTURE_SCOREBOARD: ${FIXTURE_SCOREBOARD}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  async function widget_init (
  ): Promise < REDIS_CACHE_SINGLE_scoreboard_data > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

    loaded = true;

		if (
      FIXTURE_SCOREBOARD == undefined
    ) {
      // [🐞]
      if (dev) logDevGroup ("league info #2 [DEV]", `❌ no data available!`)
      no_widget_data = true;
			return;
		}
    // [ℹ] otherwise, 
    // [ℹ] revert back
    else {
      no_widget_data = false;
    }

    return FIXTURE_SCOREBOARD;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let tabletView = 1000
  let mobileView = 725
  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// [ℹ] TABLET - VIEW
      if (w >= tabletView) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// [ℹ] MOBILE - VIEW
			if (w <= mobileView) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
  });

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data = $userBetarenaSettings.country_bookmaker;

  $: if (browser && refresh_data) {
    // [ℹ] reset necessary variables;
    refresh = true
    loaded = false
    no_widget_data = false
    // widget_init()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widget_init()
  })

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  <!-- {#if !loaded}
    <div 
      id="seo-widget-box">
      {@html LEAGUE_INFO_SEO_DATA?.data?.seo_content}
    </div>
  {/if} -->

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  <!-- {#if 
    no_widget_data && 
    loaded}

    <!-- [ℹ] title of the widget 
    - ->
    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {LEAGUE_INFO_SEO_DATA?.data?.translation?.league_info}
    </h2>

    <!-- [ℹ] no-widget-data-avaiable-placeholder container 
    - ->
    <div
      id='no-widget-box'
      class='column-space-center'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- [ℹ] no-visual-asset
      - ->
      {#if $userBetarenaSettings.theme == 'Dark'}
        <img 
          src={no_visual_dark} 
          alt="no_visual_dark"
          width="32px" height="32px"
          class='m-b-16'
        />
      {:else}
        <img 
          src={no_visual} 
          alt="no_visual"
          width="32px" height="32px"
          class='m-b-16'
        />
      {/if}
      
      <!-- [ℹ] container w/ text 
      - ->
      <div>
        <p 
          class='s-14 m-b-8 w-500'
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info_desc}
        </p>
      </div>
    </div>
  {/if} -->

  <!-- [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if 
    !no_widget_data &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker && 
    !diasbleDev}

    <ScoreboardLoader />

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <!-- <ScoreboardLoader /> -->
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <!-- 
      [ℹ] widget-component [DESKTOP] [TABLET] [MOBILE]
      -->

    <!-- 
    [ℹ] promise was rejected
    -->
    {:catch error}
      {error}
    {/await}

  {/if}

</div>

<!-- ===============
  COMPONENT STYLE
=================-->

<style>

  /* [ℹ] OTHER STYLE / CSS */

  /* NaN */

  /* [ℹ] SEO WIDGET DATA */
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  /* [ℹ] NO DATA WIDGET STYLE / CSS */

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
  }

  /*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] MOBILE FIRST
  */

  div#about-tour-widget-container.widget-no-data-height {
    height: 832px;
  }

  #about-tour-widget-container {
    padding: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    position: relative;
    padding: 20px;
  }

:global(#about-tour-widget-container a) {
    color: #F5620F !important;
    width: fit-content !important;
    margin: 0;
    display: initial;
  }

  :global(#about-tour-widget-container section) {
    padding: 0 !important;
    padding-bottom: 0 !important;
    min-height: fit-content;
  }
  :global(#about-tour-widget-container section div:first-child) {
    border: 1px solid #E6E6E6;
    border-radius: 12px 12px 0 0 !important;
  }
  :global(#about-tour-widget-container section > div) {
    border: 1px solid #E6E6E6;
    padding: 20px;
  }
  :global(#about-tour-widget-container section > div > h4) {
    margin: 0 !important;
    margin-bottom: 8px;
  }
  :global(#about-tour-widget-container section div.faq-body) {
    border: none !important;
  }
  :global(#about-tour-widget-container section hr) {
    display: none;
  }
  :global(#about-tour-widget-container section div:last-child) {
    border: 1px solid #E6E6E6;
    border-radius: 0 0 12px 12px !important;
  }

  :global(
    #about-tour-widget-container h3) {
      font-size: 20px;
  }
  :global(
    #about-tour-widget-container h4,
    #about-tour-widget-container p) {
      font-size: 16px;
  }
  :global(
    #about-tour-widget-container section div.faq-body) {
      font-size: 14px;
  }

  :global(
    #about-tour-widget-container h1,
    #about-tour-widget-container h2, 
    #about-tour-widget-container h3,
    #about-tour-widget-container h4) {
      color: #292929 !important;
  }
  :global(
    #about-tour-widget-container p,
    #about-tour-widget-container section div.faq-body) {
    color: #8C8C8C !important;
  }
  :global(
    #about-tour-widget-container h3) {
      margin: 20px 0 12px 0;
  }

  :global(
    #about-tour-widget-container section > div) {
    border: 1px solid #E6E6E6 !important;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #about-tour-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }

  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
    /* EMPTY */
  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

    #about-tour-widget-container {
      min-width: 100%;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  :global(
    #about-tour-widget-container.dark-background-1 h1,
    #about-tour-widget-container.dark-background-1 h2, 
    #about-tour-widget-container.dark-background-1 h3,
    #about-tour-widget-container.dark-background-1 h4) {
      color: #FFFFFF !important;
  }
  :global(
    #about-tour-widget-container.dark-background-1 p,
    #about-tour-widget-container.dark-background-1 section div.faq-body) {
    color: #A8A8A8 !important;
  }

  :global(
    #about-tour-widget-container.dark-background-1 section > div) {
    border: 1px solid #616161 !important;
  }


</style>
