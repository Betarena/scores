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
	import { getUserLocation } from "$lib/geoJs/init"
  import { post } from "$lib/api/utils";
	import { userBetarenaSettings } from '$lib/store/user-settings';
	// ... DECLARING TYPESCRIPT-TYPES imports;
	import type { GeoJsResponse } from "$lib/model/geo-js-interface"
  import type { All_SportBook_Details_Data, Scores_Featured_Betting_Sites_Hasura } from "$lib/model/featured_betting_sites/firebase-real-db-interface";
	// ... external components import;
  import FeaturedBettingSitesWidgetContentLoading from "./_FeaturedBettingSitesWidget_ContentLoading.svelte";
  import FeaturedSiteRow from "./_FeaturedSiteRow.svelte";
  import GoldCup from "./assets/_GoldCup.svelte";
  import SilverCup from "./assets/_SilverCup.svelte";
  import BronzeCup from "./assets/_BronzeCup.svelte";

  // ... main component variables;
	export let FEATURED_BETTING_SITES_WIDGET_DATA_SEO: Scores_Featured_Betting_Sites_Hasura;

  let staticViewRow: number;              // ... holds the `initial` number of featured sites to be displayed
  let limitViewRow: number;               // ... holds the actual, `total` limit of the list of featured sites
  let showMore: boolean = false;          // ... signals to other widget values that the lsit has expanded
  let displayShowMore: boolean = false;   // ... signal as to whether to display or not the `showMore` / `showLess` data container;
	let loaded: boolean = false;            // ... holds boolean for data loaded;
  let refresh: boolean = false;
	let refresh_data: any = undefined;

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
  let trueLengthOfArray: number
  // ...
  async function widgetInit(): Promise < All_SportBook_Details_Data > {

    // ... get the USER-GEO-LOCATION
		let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
    // ... DEBUGGING;
    if (dev) console.debug('userGeo', userGeo)

    // ... GET RESPONSE;
		const response: All_SportBook_Details_Data  = await post(`api/featured_betting_sites/cache-data.json`, userGeo)
		// ... DEBUGGING;
		if (dev) console.debug('-- get_FeaturedMatchData() response --', response)

    // ... if response is null;
		if (response == null || response == undefined) {
			// ...
			if (dev) console.debug('NO FEATURED BETTING SITE!')
			// ... return null;
			return;
		}

    // ...
    loaded = true;

    // ... intercept the length of array;
    trueLengthOfArray = response.data.length

    // ... return the FINAL Promise Value;
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

  // ... show-more / show-less;
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
    // ... update the showMore Boolean
    showMore = !showMore;
    // ... check if the `limitViewRow` matches the `trueLengthOfArray`,
    if (limitViewRow == trueLengthOfArray) {
      // ... if so, revert back to the original number of list row items,
      limitViewRow = staticViewRow;
      return;
    }
    // ... otherwise, expand the list to the full length,
    limitViewRow = trueLengthOfArray;
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... onMount() function that verifies that
   * ... the `viewport` width is of tablet size
   * ... or greater;
  */
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

  <!-- ... SEO-DATA-LOADED ... -->
  {#if !loaded}
    <!-- ... iterate over the data to find the correc language ... -->
    {#each FEATURED_BETTING_SITES_WIDGET_DATA_SEO.scores_featured_betting_sites_translations_dev as WIDGET_SEO_TRANSLATION}
      <!-- ... obtain the correct widget translation ... -->
      {#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
        <!-- ... SEO-BOX ... -->
        <div id="seo-featured-betting-site-box">
          <p>{WIDGET_SEO_TRANSLATION.translations.widget_title}</p>
          <p>{WIDGET_SEO_TRANSLATION.translations.title}</p>
        </div>
      {/if}
    {/each}
  {/if}

  <!-- ... promise is pending ... -->
  {#if !refresh}

    {#await widgetInit()}
      <FeaturedBettingSitesWidgetContentLoading />
    <!-- ... promise was fulfilled ... -->
    {:then data}

      <!-- ... identify the correct translation via IF -->
        {#each data.translations as WIDGET_TRANSLATION}
          {#if WIDGET_TRANSLATION.lang == server_side_language}

            <!-- ... wiget-title ... -->
            <p
              id='widget-title'
              class="s-20 m-b-10 color-black w-500 w-normal"
              class:color-white={$userBetarenaSettings.theme == 'Dark'}>
              {WIDGET_TRANSLATION.translations.widget_title}
            </p>

            <!-- ... widget-component ... -->
            <div 
              id="featured-list-container"
              class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

              <!-- ... top 3 featured sites | TABLET / DEKTOP VIEW ONLY ... -->
              {#if viewportDesktop}
                <div id="feature-rank-display" in:fade>

                  <!-- ... RANK 2 LOGO ... -->
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={data.data[1].register_link}
                    >
                    <div 
                      id="featured-rank" 
                      style="margin-top: 20px;">

                      <SilverCup imageURL={data.data[1].image} />

                      <!-- ... Featured Image Details ... -->
                      <p 
                        class="x-large color-black"
                        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
                        {data.data[1].title}
                      </p>
                      <p class="large color-grey">Rank {data.data[1].position}</p>
                    </div>
                  </a>

                  <!-- ... RANK 1 LOGO ... -->
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={data.data[0].register_link}
                    >
                    <div 
                      id="featured-rank"
                      style="margin-bottom: 20px;">

                      <GoldCup imageURL={data.data[0].image} />

                      <!-- ... Featured Image Details ... -->
                      <p 
                        class="x-large color-black"
                        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
                        {data.data[0].title}
                      </p>
                      <p class="large color-grey">Rank {data.data[0].position}</p>
                    </div>
                  </a>

                  <!-- ... RANK 3 ... -->
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={data.data[2].register_link}
                    >

                    <div 
                      id="featured-rank" 
                      style="margin-top: 20px;">

                      <BronzeCup imageURL={data.data[2].image} />

                      <!-- ... Featured Image Details ... -->
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

              <!-- ... title-box of the `Feature Site` list ... -->
              <p 
                id="title-box"
                class="w-500 w-normal large">
                {WIDGET_TRANSLATION.translations.title}
              </p>

              <!-- ... display the first 5 rows on Mobile; ... -->
              {#each data.data.slice(0, limitViewRow) as item}
                  <FeaturedSiteRow 
                    data={item} 
                    {WIDGET_TRANSLATION} />
              {/each}

              <!-- ... show-more / show-less ... -->
              {#if displayShowMore}
                <div>
                  <p 
                    id="show-more-box" 
                    on:click={() => toggleFullList()}>
                    {#if !showMore}
                      {WIDGET_TRANSLATION.translations.show_more_less[1]}
                    {:else}
                      {WIDGET_TRANSLATION.translations.show_more_less[0]}
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
    max-width: 383px;
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
