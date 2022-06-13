<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  // [ℹ] svelte-imports;
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from "$app/env";
  
	// [ℹ] external `exports` imports;
	import { getUserLocation } from "$lib/geoJs/init"
  import { get, post } from "$lib/api/utils";
	import { userBetarenaSettings } from '$lib/store/user-settings';

	// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
	import type { GeoJsResponse } from "$lib/models/geojs-types"
  import type { All_SportBook_Details_Data,
    Cache_Single_Lang_Featured_Betting_Site_Translation_Response, 
    Scores_Featured_Betting_Sites_Hasura } from "$lib/models/featured_betting_sites/firebase-real-db-interface";

	// [ℹ] external components import;
  import FeaturedBettingSitesWidgetContentLoading from "./_FeaturedBettingSitesWidget_ContentLoading.svelte";
  import FeaturedSiteRow from "./_FeaturedSiteRow.svelte";
  import GoldCup from "./assets/_GoldCup.svelte";
  import SilverCup from "./assets/_SilverCup.svelte";
  import BronzeCup from "./assets/_BronzeCup.svelte";

  // [ℹ] main component variables;
	export let FEATURED_BETTING_SITES_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Betting_Site_Translation_Response;
  export let FEATURED_BETTING_SITES_WIDGET_DATA: All_SportBook_Details_Data

  let staticViewRow: number;              // [ℹ] holds the `initial` number of featured sites to be displayed
  let limitViewRow: number;               // [ℹ] holds the actual, `total` limit of the list of featured sites
  let showMore: boolean = false;          // [ℹ] signals to other widget values that the lsit has expanded
  let displayShowMore: boolean = false;   // [ℹ] signal as to whether to display or not the `showMore` / `showLess` data container;
	let loaded: boolean = false;            // [ℹ] holds boolean for data loaded;
  let refresh: boolean = false;
	let refresh_data: any = undefined;

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Intializer of the Widget Function
   * ... Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
  */
  let trueLengthOfArray: number
  // [ℹ]
  async function widgetInit(): Promise < All_SportBook_Details_Data > {

    // [ℹ] get the USER-GEO-LOCATION
		let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] GET RESPONSE;
    // const response: All_SportBook_Details_Data = await get('api/featured_betting_sites/cache-data.json?geoPos='+userGeo)
    const response: All_SportBook_Details_Data = FEATURED_BETTING_SITES_WIDGET_DATA;

    // [ℹ] if response is null;
		if (response == null || response == undefined) {
			// [🐛] debug 
			if (dev) console.debug('NO FEATURED BETTING SITE!')
			// [ℹ] return null;
			return;
		}

    loaded = true;

    // [ℹ] intercept the length of array;
    trueLengthOfArray = response.data.length

    // [ℹ] return the FINAL Promise Value;
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

  // [ℹ] show-more / show-less;
  $: if (viewportDesktop) {
    if (trueLengthOfArray > 10) {
      displayShowMore = true;
      staticViewRow = 10;
      limitViewRow = 10;
    }
  } else {
    if (trueLengthOfArray > 5) {
      displayShowMore = true;
      staticViewRow = 5;
      limitViewRow = 5;
    }
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Toggling the Show/Hide of the
   * ... list of featured site for the website;
  */
  function toggleFullList() {
    // [ℹ] update the showMore Boolean
    showMore = !showMore;
    // [ℹ] check if the `limitViewRow` matches the `trueLengthOfArray`,
    if (limitViewRow == trueLengthOfArray) {
      // [ℹ] if so, revert back to the original number of list row items,
      limitViewRow = staticViewRow;
      return;
    }
    // [ℹ] otherwise, expand the list to the full length,
    limitViewRow = trueLengthOfArray;
  }

  let viewportDesktop: boolean;

  onMount(async () => {
    var wInit = document.documentElement.clientWidth;
    if (wInit > 767) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener("resize", function () {
      var w = document.documentElement.clientWidth;
      if (w > 767) {
        viewportDesktop = true;
      } else {
        viewportDesktop = false;
      }
    });
  });
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
      <p>{FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.widget_title}</p>
      <p>{FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.title}</p>
    </div>
  {/if}

  <!-- [ℹ] FEATURED BETTING SITES WIDGET
  -->
  {#if !refresh}

    {#await widgetInit()}
      <!-- [ℹ] promise is pending 
      -->
      <FeaturedBettingSitesWidgetContentLoading />

    {:then data}
    <!-- [ℹ] promise was fulfilled 
    -->

      <!-- [ℹ] wiget-title -->
      <p
        id='widget-title'
        class="s-20 m-b-10 color-black w-500"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.widget_title}
      </p>

      <!-- [ℹ] widget-component 
      -->
      <div 
        id="featured-list-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- [ℹ] top 3 featured sites | TABLET / DEKTOP VIEW ONLY 
        -->
        {#if viewportDesktop}
          <div 
            id="feature-rank-display" 
            in:fade>

            <!-- [ℹ] RANK 2 LOGO 
            -->
            <a
              target="_blank"
              rel="noreferrer"
              href={data.data[1].register_link}
              >
              <div 
                id="featured-rank" 
                style="margin-top: 20px;">

                <SilverCup imageURL={data.data[1].image} />

                <!-- [ℹ] Featured Image Details 
                -->
                <p 
                  class="x-large color-black"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}>
                  {data.data[1].title}
                </p>
                <p class="large color-grey">Rank {data.data[1].position}</p>
              </div>
            </a>

            <!-- [ℹ] RANK 1 LOGO 
            -->
            <a
              target="_blank"
              rel="noreferrer"
              href={data.data[0].register_link}
              >
              <div 
                id="featured-rank"
                style="margin-bottom: 20px;">

                <GoldCup imageURL={data.data[0].image} />

                <!-- [ℹ] Featured Image Details 
                -->
                <p 
                  class="x-large color-black"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}>
                  {data.data[0].title}
                </p>
                <p class="large color-grey">Rank {data.data[0].position}</p>
              </div>
            </a>

            <!-- [ℹ] RANK 3 
            -->
            <a
              target="_blank"
              rel="noreferrer"
              href={data.data[2].register_link}
              >

              <div 
                id="featured-rank" 
                style="margin-top: 20px;">

                <BronzeCup imageURL={data.data[2].image} />

                <!-- [ℹ] Featured Image Details 
                -->
                <p 
                  class="x-large color-black"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}>
                  {data.data[2].title}
                </p>
                <p 
                  class="large color-grey">
                  Rank {data.data[2].position}
                </p>

              </div>
            </a>

          </div>
        {/if}

        <!-- [ℹ] title-box of the `Feature Site` list -->
        <p 
          id="title-box"
          class="w-500 w-normal large">
          {FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.title}
        </p>

        <!-- [ℹ] display the first 5 rows on Mobile
        -->
        {#each data.data.slice(0, limitViewRow) as item}
          <FeaturedSiteRow 
            data={item} 
            {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} />
        {/each}

        <!-- [ℹ] show-more / show-less 
        -->
        {#if displayShowMore}
          <div>
            <p 
              id="show-more-box" 
              on:click={() => toggleFullList()}>
              {#if !showMore}
                {FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.show_more_less[1]}
              {:else}
                {FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.show_more_less[0]}
              {/if}
            </p>
          </div>
        {:else}
          <p 
            id="show-more-box" 
            style="padding: 5px; box-shadow: none;" 
          />
        {/if}

      </div>



    {:catch error}
      <!-- [ℹ] promise was rejected 
      -->
      {error}
    {/await}

  {/if}

</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>
  
  #seo-featured-betting-site-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  #featured-list-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
  }

  #title-box {
    padding: 24px 60px 20px 60px;
    text-align: center;
    white-space: nowrap;
    font-weight: 500;
  }

  #show-more-box {
    padding: 25px 130px;
    text-align: center;
    white-space: nowrap;
    color: var(--primary);
    box-shadow: inset 0px 1px 0px #ebebeb;
    cursor: pointer;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 767px) {
    #featured-rank {
			height: 257px;
			padding: 16px 39px;
			background: #F2F2F2;
			border-radius: 12px;
			justify-items: center;
			position: relative;
      text-align: center;
		}

		#feature-rank-display {
			display: grid;
			gap: 20px;
			grid-auto-flow: column;
			grid-template-columns: repeat(3, 1fr);
			justify-content: space-between;
			padding: 20px 20px 0 20px;
		}

    #featured-list-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {
    #featured-rank {
			padding: 16px 8px;
		}

		#feature-rank-display {
			gap: 15px;
		}

    #featured-list-container {
      min-width: 100%;
      /* max-width: 560px; */
    }
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

	.dark-background-1 p#show-more-box {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1 div#featured-rank {
		background-color: #616161;
	}

  .dark-background-1 p#title-box {
    color: #ffffff;
  }
</style>
