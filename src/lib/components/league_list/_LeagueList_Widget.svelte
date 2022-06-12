<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { dev } from "$app/env";
  import { onMount } from "svelte";

  import close from './assets/close.svg'
  import close_white from './assets/close-white.svg'
  import Africa from "./assets/_Africa.svelte";
  import Asia from "./assets/_Asia.svelte";
  import NorthCentralAmerica from "./assets/_North_Central_America.svelte";
  import SouthAmerica from "./assets/_South_America.svelte";
  import World from "./assets/_World.svelte";

  import NoResults from "./_NoResults.svelte";

  import { get } from "$lib/api/utils";
  import type { Cache_Single_Geo_LeagueList_Translation_Response, Cache_Single_Lang_LeagueList_Translation_Response } from "$lib/models/league_list/types";

  import { userBetarenaSettings } from "$lib/store/user-settings";

  // [ℹ] main component variables;
	export let LEAGUE_LIST_WIDGET_DATA_SEO: Cache_Single_Lang_LeagueList_Translation_Response;
  export let LEAGUE_LIST_WIDGET_DATA: Cache_Single_Geo_LeagueList_Translation_Response

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Intializer of the Widget Function
   * ... Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
  */
  let refresh: boolean = false;
  let loaded: boolean = false;
  let refresh_data: any = undefined;
  let league_list_data: Cache_Single_Geo_LeagueList_Translation_Response
  // [ℹ]
  async function widgetInit(): Promise < Cache_Single_Geo_LeagueList_Translation_Response > {

    // [ℹ] get the USER-GEO-LOCATION;
		let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] GET RESPONSE;
    // const response: Cache_Single_Geo_LeagueList_Translation_Response = await get('api/league_list/cache-data.json?geoPos='+userGeo)
    const response: Cache_Single_Geo_LeagueList_Translation_Response = LEAGUE_LIST_WIDGET_DATA

    // [ℹ] if response is null;
    if (response == null || response == undefined) {
      // [ℹ]
      if (dev) console.debug('NO FEATURED BETTING SITE!')
      // [ℹ] return null;
      return;
    }

    // [ℹ] intercept the league_list data;
    league_list_data = response

    loaded = true;

    // [ℹ] return the FINAL Promise Value;
    return response;
  }

  // [ℹ] change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
  $: refresh_data = $userBetarenaSettings.country_bookmaker;
  $: if (refresh_data) {
    // [ℹ] reset necessary variables;
    refresh = true
    loaded = false
    setTimeout(async() => {
        refresh = false
    }, 50)
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // USER ACTIONS METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  let leagueSearch: string = undefined;
  let selectedCountryLeague: string = undefined;

  let showFullLeagueList: boolean = false;
  let fullLeagueListDisplayNum: number = 4;

  let showFullCountryList: boolean = false;
  let fullCountryListDisplayNum: number = 4;

  function selectCountryLeague(targetCountry: string) {
      if (selectedCountryLeague === targetCountry) {
          selectedCountryLeague = undefined
          return;
      }
      // [ℹ] else;
      selectedCountryLeague = targetCountry
  }

  function toggleFullLeagueList() {
      showFullLeagueList = !showFullLeagueList
      if (fullLeagueListDisplayNum == 4) {
          fullLeagueListDisplayNum = 1000
      } else {
          fullLeagueListDisplayNum = 4
      }
  }

  function toggleFullCountryList() {
      showFullCountryList = !showFullCountryList
      if (fullCountryListDisplayNum == 4) {
          fullCountryListDisplayNum = 1000
      } else {
          fullCountryListDisplayNum = 4
      }
  }

  // [ℹ] change the `search-input-data` upon typing;
  let leagueSearchData = []
  let countrySearchData = []
  // [ℹ] listed to search-input text;
  $: if (leagueSearch != undefined && leagueSearch != '' && league_list_data) {
      // [ℹ] reset data;
      leagueSearchData = []
      countrySearchData = []
      // [ℹ] iterate for league-data;
      for (const item of league_list_data.all_leagues_list) {
          // [ℹ] identify the correct search league items;
          if (item.league_name.toString().toLowerCase().includes(leagueSearch.toString().toLowerCase()) || 
              item.country_name.toString().toLowerCase().includes(leagueSearch.toString().toLowerCase())) {
              // [ℹ] store the data;
              leagueSearchData.push(item)
          }
      }
      // [ℹ] iterate for country-data;
      for (const item of league_list_data.unique_county_list) {
          // [ℹ] identify the correct search country items;
          if (item.country_name.toString().toLowerCase().includes(leagueSearch.toString().toLowerCase())) {
              // [ℹ] store the data;
              countrySearchData.push(item)
          }
      }
  }

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES LISTENERS
	// ~~~~~~~~~~~~~~~~~~~~~

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
    if (wInit >= 1160) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener('resize', function () {
      var w = document.documentElement.clientWidth;
      if (w >= 1160) {
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

<!-- [ℹ] SEO-DATA-LOADED 
-->
{#if !loaded}
  <div 
    id="seo-league-list-box">
    <!-- [ℹ] translation-expressions 
    -->
    <p>{LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.widget_title}</p>
    <p>{LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.top_leagues}</p>
    <p>{LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.leagues_by_country}</p>
    <!-- [ℹ] all-leagues-expressions 
    -->
    {#each LEAGUE_LIST_WIDGET_DATA_SEO.all_leagues_list as league}
      <p>{league.league_name}</p>
    {/each}
    <!-- [ℹ] all-unique-country-expressions 
    -->
    {#each LEAGUE_LIST_WIDGET_DATA_SEO.unique_county_list as country}
      <p>{country.country_name}</p>
    {/each}
  </div>
{/if}

<!-- [ℹ] LEAGUE LIST WIDGET [DESKTOP-ONLY]
-->
{#if viewportDesktop}

    <!-- [ℹ] refresh status 
    -->
    {#if !refresh}

      <!-- [ℹ] promise is pending 
      -->
      {#await widgetInit()}
      <!-- [ℹ] promise was fulfilled 
      -->
      {:then data}

        <div>

          <!-- [ℹ] wiget-title
          -->
          <p
            id='widget-title'
            class="s-20 m-b-10 color-white w-500">
            {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.widget_title}
          </p>

          <!-- [ℹ] league-list-container 
          -->
          <div
            id='league-list'
            class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} >

              <!-- [ℹ] search-box 
              -->
              <div
                id='search-container'>

                <input 
                  type="text"
                  placeholder={LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.search_form}
                  bind:value={leagueSearch}
                  id='league-list-search'
                  class='m-b-20' 
                  style='margin: 0 20px 20px 20px;'
                  autocomplete="off" />

                <!-- [ℹ] erase-search-input 
                -->
                {#if leagueSearch != '' && leagueSearch != undefined}
                  {#if $userBetarenaSettings.theme == 'Dark'}
                    <img
                      id='close-btn-search'
                      class='cursor-pointer'
                      src={close_white}
                      alt=""
                      width="20px" height="20px" 
                      on:click={() => leagueSearch = ''} />
                  {:else}
                    <img
                      id='close-btn-search'
                      class='cursor-pointer'
                      src={close}
                      alt=""
                      width="20px" height="20px" 
                      on:click={() => leagueSearch = ''} />
                  {/if}
                {/if}
              </div>

              <!-- [ℹ] no-search-input-is-made 
              -->
              {#if leagueSearch == undefined || leagueSearch == ''}

                <!-- [ℹ] list-TOP-7-popular-rating-leagues [GEO-BASED] 
                -->
                <p
                  class='color-grey s-14 m-b-5'
                  style='padding: 0 20px;'>
                  {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.top_leagues}
                </p>

                <!-- [ℹ] list-grid 
                -->
                <div
                  id='popular-list-container'
                  class='m-b-20'>
                  <!-- [ℹ] for-loop-each-population 
                  -->
                  {#each data.top_geo_leagues as item}
                    <div
                      class='top-league-container row-space-start cursor-not-allowed'>
                      <img 
                        src={item.logo_path} 
                        alt={item.league_name.toString() + '-image'} 
                        width="20px" height="20px" 
                        class='m-r-15' />
                      <p class='s-14 w-500 color-black'>
                        {item.league_name}
                      </p>
                    </div>
                  {/each}
                </div>

                <!-- [ℹ] list-all-countries-based-leagues 
                -->
                <p
                  class='color-grey s-14 m-b-5'
                  style='padding: 0 20px;'>
                  {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.leagues_by_country}
                </p>

                <!-- [ℹ] list-grid 
                -->
                <div
                    id='countires-list-container'>
                    <!-- [ℹ] for-loop-each-population -->
                    {#each data.unique_county_list as item}
                        <!-- content here -->
                        <div
                            class='main-country-container'
                            class:selectedCountry={selectedCountryLeague === item.country_name}>
                            <!-- [ℹ] parent-country [SHOWN] -->
                            <div
                                class='country-league-container row-space-start'
                                on:click={() => selectCountryLeague(item.country_name)}>
                                <!-- [ℹ] check-if-continent-selected -->
                                {#if item.country_id.toString() === '147'}
                                    <!-- content here -->
                                    <div
                                        style='width: auto;'
                                        class='row-space-start m-r-15'>
                                        <Africa />
                                    </div>
                                {:else if item.country_id.toString() === '11240938'}
                                    <!-- content here -->
                                    <div
                                        style='width: auto;'
                                        class='row-space-start m-r-15'>
                                        <Asia />
                                    </div>
                                {:else if item.country_id.toString() === '24143344'}
                                    <!-- content here -->
                                    <div
                                        style='width: auto;'
                                        class='row-space-start m-r-15'>
                                        <NorthCentralAmerica />
                                    </div>
                                {:else if item.country_id.toString() === '11555657'}
                                    <!-- content here -->
                                    <div
                                        style='width: auto;'
                                        class='row-space-start m-r-15'>
                                        <SouthAmerica />
                                    </div>
                                {:else if item.country_id.toString() === '99474'}
                                    <!-- content here -->
                                    <div
                                        style='width: auto;'
                                        class='row-space-start m-r-15'>
                                        <World />
                                    </div>
                                {:else}
                                    <img 
                                        src={item.image_path} 
                                        alt=""
                                        title={item.country_name + '-image'} 
                                        width="20px" height="20px" 
                                        class='m-r-15' />
                                {/if}
                                <p class='s-14 w-500 color-black'>
                                    {item.country_name}
                                </p>
                            </div>
                            <!-- [ℹ] sub-category [DEFAULT HIDDEN] -->
                            {#each data.all_leagues_list as league}
                                {#if league.country_id.toString().toLowerCase() === item.country_id.toString().toLowerCase() 
                                    && selectedCountryLeague === item.country_name}
                                    <!-- content here -->
                                    <div
                                        class='country-league-sub-container row-space-start cursor-not-allowed'>
                                        <p class='s-14 w-500 color-black'>
                                            {league.league_name}
                                        </p>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/each}
                </div>

              <!-- [ℹ] no-results-to-show
              -->
              {:else if leagueSearchData.length === 0 &&
                countrySearchData.length === 0}

                <div
                  id='no-results-container'
                  class='column-space-center'>

                  <NoResults />
                  <p 
                    class='s-16 m-t-15 color-grey'>
                      {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.no_results}
                  </p>
                </div>
              
              <!-- [ℹ] show-results 
              -->
              {:else}
                <!-- [ℹ] search-display-data 
                -->
                  
                <!-- [ℹ] list-leagues-matching-search -->
                <p
                  class='search-title w-500 color-black s-14 m-b-5'
                  style='padding: 0 20px;'>
                  {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.competitions_results}
                </p>

                <!-- [ℹ] list-grid 
                -->
                <div
                  id='search-list-container'
                  class='m-b-12'>

                  <!-- [ℹ] for-loop-each-population 
                  -->
                  {#each leagueSearchData.slice(0, fullLeagueListDisplayNum) as item}
                    <div
                      class='top-league-container-search row-space-start cursor-not-allowed'>
                      <img 
                        src={item.logo_path} 
                        alt={item.league_name.toString() + '-image'} 
                        width="20px" height="20px" 
                        class='m-r-15' />
                      <div>
                        <p class='s-14 color-grey'>
                          {item.country_name}
                        </p>
                        <p class='s-14 w-500 color-black'>
                          {item.league_name}
                        </p>
                      </div>
                    </div>
                  {/each}

                </div>

                <!-- [ℹ] show-full-list 
                -->
                {#if leagueSearchData.length > 4}
                  <p 
                    class='s-14 w-500 color-primary cursor-pointer m-b-20'
                    on:click={() => toggleFullLeagueList()}
                    style='padding: 0 20px;'>
                    {#if !showFullLeagueList}
                      {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.full_list}
                    {:else}
                      {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.hide}
                    {/if}
                  </p>
                {/if}

                  <!-- [ℹ] list-countries-matching-search -->
                  <p
                    class='search-title w-500 color-black s-14 m-b-5'
                    style='padding: 0 20px;'>
                    {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.countries_results}
                  </p>

                  <!-- [ℹ] list-grid 
                  -->
                  <div
                    id='countires-list-container'>

                    <!-- [ℹ] for-loop-each-population 
                    -->
                    {#each countrySearchData.slice(0, fullCountryListDisplayNum) as item}
                        
                      <div
                        class='main-country-container'
                        class:selectedCountry={selectedCountryLeague === item.country_name}>

                          <!-- [ℹ] parent-country [SHOWN] 
                          -->
                          <div
                            class='country-league-container row-space-start'
                            on:click={() => selectCountryLeague(item.country_name)}>
                            <img 
                              src={item.image_path} 
                              alt=""
                              title={item.country_name + '-image'} 
                              width="20px" height="20px" 
                              class='m-r-15' />
                              <p 
                                class='s-14 w-500 color-black'>
                                  {item.country_name}
                              </p>
                          </div>

                          <!-- [ℹ] sub-category [DEFAULT HIDDEN] 
                          -->
                          {#each data.all_leagues_list as league}
                            {#if league.country_id.toString().toLowerCase() === item.country_id.toString().toLowerCase() &&
                              selectedCountryLeague === item.country_name}
                              <div
                                class='country-league-sub-container row-space-start cursor-not-allowed'>
                                <p 
                                  class='s-14 w-500 color-black'>
                                  {league.league_name}
                                </p>
                              </div>
                            {/if}
                          {/each}

                      </div>
                      
                    {/each}
                    
                  </div>

                  <!-- [ℹ] show-full-list 
                  -->
                  {#if countrySearchData.length > 4}
                    <p 
                      class='s-14 w-500 color-primary cursor-pointer m-b-20'
                      on:click={() => toggleFullCountryList()}
                      style='padding: 0 20px;'>
                      {#if !showFullCountryList}
                        {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.full_list}
                      {:else}
                        {LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.hide}
                      {/if}
                    </p>
                  {/if}

              {/if}

          </div>
                  
        </div>

      <!-- [ℹ] promise was rejected 
      -->
      {:catch error}
        {error}
      {/await}

    {/if}

{/if}


<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

    /* DESKTOP ONLY WIDGET */

    #seo-league-list-box {
        position: absolute;
        z-index: -100;
        top: -9999px;
        left: -9999px;
    }

    #league-list {
        display: grid;
        background: #ffffff;
        box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
        border-radius: 12px;
        min-width: 220px;
        width: 100%;
        max-width: 343px;
        padding-bottom: 4px;
        overflow: hidden;
        padding: 20px 0;
    }

    input#league-list-search {
        /* white theme/white */
        background: #FFFFFF;
        /* white theme/gray */
        border: 1px solid #CCCCCC;;
        box-sizing: border-box;
        border-radius: 8px;
        padding: 12px 52px 12px 52px;
        background-image: url('/assets/svg/league_list/search.svg');
        background-repeat: no-repeat;
        background-position: 20px 50%;
        background-size: 20px 20px;
        width: -webkit-fill-available;
        height: 44px;
        outline: none;
        font-size: 14px;
    } input#league-list-search:hover {
        border: 1px solid #8C8C8C;
    } input#league-list-search:focus {
        border: 1px solid #4B4B4B;
    } input#league-list-search[placeholder] {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #close-btn-search {
        position: absolute;
        z-index: 100;
        right: 40px;
        top: 12px;
    }

    #search-container {
        position: relative;
    }

    div#search-list-container .top-league-container-search {
        padding: 4px 20px;
    } div#search-list-container .top-league-container-search:hover {
        cursor: pointer;
    } div#search-list-container .top-league-container-search:hover p {
        color: #f5620f !important;
    }

    div#popular-list-container .top-league-container {
        padding: 12.5px 20px;
    } div#popular-list-container .top-league-container:hover {
        cursor: pointer;
    } div#popular-list-container .top-league-container:hover p {
        color: #f5620f !important;
    }

    div#popular-list-container .top-league-container img,
    div#countires-list-container .country-league-container img {
        object-fit: cover;
    }
    div#countires-list-container .country-league-container img {
        border-radius: 50%;
    }

    div.selectedCountry {
        background: #F2F2F2;
        border-radius: 8px;
        position: relative;
        padding: 1px;
        overflow: hidden;
    }

    div#countires-list-container .main-country-container {
        margin: 0 10px;
    } div#countires-list-container .country-league-container {
        padding: 12px 10px;
    } div#countires-list-container .selectedCountry .country-league-container {
        padding: 11px 9px;
    } div#countires-list-container .country-league-sub-container {
        padding: 9px 10px 10px 10px;
        background-color: white;
    } div#countires-list-container .country-league-sub-container:last-child {
        border-radius: 0 0 8px 8px;
    } div#countires-list-container .country-league-container:hover p,
      div#countires-list-container .country-league-sub-container:hover p {
        color: #f5620f !important;
    }

    div#countires-list-container .main-country-container:hover {
        cursor: pointer;
    }

    div#no-results-container {
        padding: 28px 0;
    }

    /* MEDIA QUERIES */
    @media screen and (max-width: 1440px) {

      input#league-list-search {
        padding: 12px 28px 12px 35px;
        background-position: 8px 50%;
      }

      img#close-btn-search {
        right: 28px;
      }
    }

    /* .............. 
    WIDGET DARK THEME 
    ................. */

    .dark-background-1 input#league-list-search {
        /* dark theme/bg */
        background-color: #4B4B4B !important;
        /* dark theme/light-gray */
        border: 1px solid #616161;
        color: white;
    } .dark-background-1 input#league-list-search:hover {
        border: 1px solid #737373;
    } .dark-background-1 input#league-list-search:focus {
        border: 1px solid #CCCCCC;
        background-image: url('/assets/svg/league_list/search-white.svg');
    }

    .dark-background-1 div#search-list-container .top-league-container-search p,
    .dark-background-1 div#popular-list-container .top-league-container p,
    .dark-background-1 div#countires-list-container .country-league-container p,
    .dark-background-1 div#countires-list-container .country-league-sub-container p {
        color: white;
    }

    .dark-background-1 div.selectedCountry {
        background: #616161 !important;
    }

    .dark-background-1 div#countires-list-container .country-league-sub-container {
        background-color: #4B4B4B;
    }

    .dark-background-1 p.search-title {
        color: white;
    }
</style>