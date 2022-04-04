<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // ... svelte-imports;
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from "$app/env";
	// ... external `exports` imports;
  import { post } from "$lib/api/utils";
	import { userBetarenaSettings } from '$lib/store/user-settings';

  // ... key component assets;
	import no_featured_match_visual from './assets/no_featured_match_visual.svg'
	import no_featured_match_visual_dark from './assets/no_featured_match_visual_dark.svg'
  import type { Hasura_Complete_Pages_SEO } from "$lib/models/page_seo/types";
  import SeoBlockContentLoader from "./_SEO_Block_ContentLoader.svelte";

  // ... main component variables;
	export let SEO_BLOCK_DATA: Hasura_Complete_Pages_SEO;

	let loaded: boolean = false;            // ... holds boolean for data loaded;
  let refresh: boolean = false;
	let refresh_data: any = undefined;
  let noSEOBlockData: any = false;

  // ... widget-language-declaration;
	let server_side_language: string = 'en';
	// ... language-translation-declaration;
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Intializer of the Widget Function
   * ... Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
  */
  // ...
  async function widgetInit(): Promise < Hasura_Complete_Pages_SEO > {

		const response: Hasura_Complete_Pages_SEO  = SEO_BLOCK_DATA
		// ... 🐛 DEBUGGING;
		if (dev) console.debug('ℹ widgetInit() best goalscorers cache', response)

    // ... ℹ if response is null;
		if (response == null || response == undefined) {
			// ...
			if (dev) console.debug('❌ no goal scoreres available!')
			// ... return null;
      noSEOBlockData = true;
      // ...
			return;
		}

    // ...
    loaded = true;

    // ... ℹ return the FINAL Promise Value;
    return response;
  }

  // ... change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	// ...
	$: if (refresh_data) {
		// ... reset necessary variables;
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

  <!-- ... ℹ SEO-DATA-LOADED ... -->
  {#if !loaded}
    <!-- ... iterate over the data to find the correc language ... -->
    {#each SEO_BLOCK_DATA.scores_seo_block_homepage_dev as WIDGET_SEO_TRANSLATION}
      <!-- ... obtain the correct widget translation ... -->
      {#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
        <!-- ... SEO-BOX ... -->
        <div id="seo-featured-betting-site-box">
          <h2>{WIDGET_SEO_TRANSLATION.title}</h2>
          {@html WIDGET_SEO_TRANSLATION.html}
        </div>
      {/if}
    {/each}
  {/if}

  <!-- ... ℹ NO BEST PLAYERS AVAILABLE PLACEHOLDER ...-->
  {#if noSEOBlockData && !loaded}
    <!-- ... title of the widget ... -->
    <!-- ... iterate over the data to find the correc language ... -->
    {#each SEO_BLOCK_DATA.scores_seo_block_homepage_dev as WIDGET_SEO_TRANSLATION}
      <!-- ... obtain the correct widget translation ... -->
      {#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
        <!-- ... wiget-title ... -->
        <h2 
          class="s-20 m-b-10 color-black-2"
          style="margin-top: 0;"
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {WIDGET_SEO_TRANSLATION.title}
        </h2>
      {/if}
    {/each}

    <!-- ... no-matches-avaiable-placeholder container ...  -->
    <div 
      id='no-best-players-box'
      class='row-space-start'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>
      <!-- ... no-matches-visual ... -->
      {#if $userBetarenaSettings.theme == 'Dark'}
        <!-- content here -->
        <img 
          src={no_featured_match_visual_dark} 
          alt="no-featured-match-visual_dark"
          width="80px" height="80px"
          class='m-r-20'
        />
      {:else}
        <!-- else content here -->
        <img 
          src={no_featured_match_visual} 
          alt="no-featured-match-visual"
          width="80px" height="80px"
          class='m-r-20'
        />
      {/if}
      
      <!-- ... container w/ text ... -->
      <div>
        <p class='s-16 m-b-8 w-500'> No SEO Block Available </p>
        <p class='s-16 color-grey w-400'> Sorry, at this time there is no SEO data available! </p>
      </div>
    </div>
  {/if}

  <!-- ... ℹ promise is pending ... -->
  {#if !noSEOBlockData && !refresh}

    {#await widgetInit()}
      <SeoBlockContentLoader />
    <!-- ... promise was fulfilled ... -->
    {:then data}

      <!-- ... identify the correct translation via IF -->
        {#each data.scores_seo_block_homepage_dev as WIDGET_TRANSLATION}
          {#if WIDGET_TRANSLATION.lang == server_side_language}

            <!-- ... wiget-title ... -->
            <h2
              id='widget-title'
              class="s-20 m-b-10 w-500 w-normal color-black-2"
              style="margin-top: 0;"
              class:color-white={$userBetarenaSettings.theme == 'Dark'}>
              {WIDGET_TRANSLATION.title}
            </h2>

            <!-- ... widget-component ... -->
            <div 
              id="seo-block-widget-container"
              class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

              <!-- ... render SEO-DATA ... -->
              {@html WIDGET_TRANSLATION.html}
             
            </div>

          {/if}
        {/each}

    <!-- ... promise was rejected ... -->
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
    max-width: 383px;
    overflow: hidden;
    padding: 20px;
  }
  :global(#seo-block-widget-container h2,
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
    #seo-block-widget-container.dark-background-1 h2, 
    #seo-block-widget-container.dark-background-1 h3) {
      color: #FFFFFF !important;
  }
  :global(
    #seo-block-widget-container.dark-background-1 p) {
    color: #A8A8A8 !important;
  }

</style>
