<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // [ℹ] svelte-imports;
  import { dev } from '$app/environment';
// [ℹ] external `exports` imports;
  import { userBetarenaSettings } from '$lib/store/user-settings';
// [ℹ] key component assets;
	import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from "$lib/models/seo_block/types";
	import { logDevGroup } from "$lib/utils/debug";
	import no_featured_match_visual from './assets/no_featured_match_visual.svg';
	import no_featured_match_visual_dark from './assets/no_featured_match_visual_dark.svg';
	import SeoBlockContentLoader from "./_SEO_Block_ContentLoader.svelte";

  // [ℹ] main component variables;
	export let SEO_BLOCK_DATA: Cache_Single_Homepage_SEO_Block_Translation_Response;

	let loaded: boolean = false;            // [ℹ] holds boolean for data loaded;
  let refresh: boolean = false;
	let refresh_data: unknown = undefined;
  let noSEOBlockData: unknown = false;

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Intializer of the Widget Function
   * ... Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
  */
  async function widgetInit(): Promise < Cache_Single_Homepage_SEO_Block_Translation_Response > {

		const response: Cache_Single_Homepage_SEO_Block_Translation_Response  = SEO_BLOCK_DATA

    // [ℹ] ℹ if response is null;
		if (response == null || response == undefined) {
			// [🐛] debug
      if (dev) logDevGroup ("seo block [DEV]", `❌ no data available to email newsletter!`)
			// [ℹ] return null;
      noSEOBlockData = true;
			return;
		}

    loaded = true;

    // [ℹ] ℹ return the FINAL Promise Value;
    return response;
  }

  // [ℹ] change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	$: if (refresh_data) {
		// [ℹ] reset necessary variables;
		refresh = true
    setTimeout(async() => {
			refresh = false
		}, 50)
	}

</script>


<!-- ===============
    COMPONENT HTML 
==================== -->

<div>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <!-- [ℹ] SEO-BOX 
    -->
    <div id="seo-featured-betting-site-box">
      <h2>{SEO_BLOCK_DATA.title}</h2>
      {@html SEO_BLOCK_DATA.html}
    </div>
  {/if}

  <!-- [ℹ] NO BEST PLAYERS AVAILABLE PLACEHOLDER 
  -->
  {#if noSEOBlockData && !loaded}
    <!-- [ℹ] title of the widget 
    -->
    <h2 
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {SEO_BLOCK_DATA.title}
    </h2>

    <!-- [ℹ] no-matches-avaiable-placeholder container 
    -->
    <div 
      id='no-best-players-box'
      class='row-space-start'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      {#if $userBetarenaSettings.theme == 'Dark'}
        <img 
          src={no_featured_match_visual_dark} 
          alt="no-featured-match-visual_dark"
          width="80px" height="80px"
          class='m-r-20'
        />
      {:else}
        <img 
          src={no_featured_match_visual} 
          alt="no-featured-match-visual"
          width="80px" height="80px"
          class='m-r-20'
        />
      {/if}
      
      <!-- container w/ text -->
      <div>
        <p class='s-16 m-b-8 w-500'> No SEO Block Available </p>
        <p class='s-16 color-grey w-400'> Sorry, at this time there is no SEO data available! </p>
      </div>
    </div>
  {/if}

  <!-- [ℹ] promise is pending 
  -->
  {#if !noSEOBlockData && !refresh}

    {#await widgetInit()}
      <SeoBlockContentLoader />

    <!-- [ℹ] promise was fulfilled 
    -->
    {:then data}

      <!-- wiget-title -->
      <h2
        id='widget-title'
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {SEO_BLOCK_DATA.title}
      </h2>

      <!-- [ℹ] widget-component 
      -->
      <div 
        id="seo-block-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- render SEO-DATA -->
        {@html SEO_BLOCK_DATA.html}
        
      </div>

    <!-- [ℹ] promise was rejected 
    -->
    {:catch error}
      {error}
    {/await}

  {/if}

</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  #no-best-players-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
  }
  
  #seo-featured-betting-site-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  #seo-block-widget-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    overflow: hidden;
    padding: 20px;
  }
  :global(#seo-block-widget-container h1,
          #seo-block-widget-container h2,
          #seo-block-widget-container h3) {
    margin-top: 0;
  }
  :global(#seo-block-widget-container a) {
    color: #F5620F !important;
    width: fit-content !important;
    margin: 0;
    display: initial;
  }
  :global(#seo-block-widget-container p) {
    margin-bottom: 24px;
    color: #8C8C8C;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #seo-block-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #seo-block-widget-container {
      min-width: 100%;
      /* max-width: 560px; */
    }
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

  :global(
    #seo-block-widget-container.dark-background-1 h1,
    #seo-block-widget-container.dark-background-1 h2, 
    #seo-block-widget-container.dark-background-1 h3) {
      color: #FFFFFF !important;
  }
  :global(
    #seo-block-widget-container.dark-background-1 p) {
    color: #A8A8A8 !important;
  }

</style>
