<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { page } from "$app/stores";

    import close from './assets/close.svg'
    import close_white from './assets/close-white.svg'
    import Africa from "./assets/_Africa.svelte";
    import Asia from "./assets/_Asia.svelte";
    import NorthCentralAmerica from "./assets/_North_Central_America.svelte";
    import SouthAmerica from "./assets/_South_America.svelte";
    import World from "./assets/_World.svelte";

    import NoResults from "./_NoResults.svelte";

    import { post } from "$lib/api/utils";
    import type { League_List_Cache_Ready, League_List_Cache_SEO_Ready } from "$lib/model/league_list/types";

    import { userBetarenaSettings } from "$lib/store/user-settings";

    // ... main component variables;
	export let LEAGUE_LIST_WIDGET_DATA_SEO: League_List_Cache_SEO_Ready;

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
    let refresh: boolean = false;
    let loaded: boolean = false;
	let refresh_data: any = undefined;
    let league_list_data: League_List_Cache_Ready
    // ...
    async function widgetInit(): Promise < League_List_Cache_Ready > {

        // ... get the USER-GEO-LOCATION
        let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
        // ... DEBUGGING;
        if (dev) console.debug('userGeo', userGeo)

        // ... GET RESPONSE;
        const response: League_List_Cache_Ready  = await post(`api/league_list/cache-data.json`, userGeo)
        // ... DEBUGGING;
        if (dev) console.debug('-- get_FeaturedMatchData() response --', response)

        // ... if response is null;
        if (response == null || response == undefined) {
            // ...
            if (dev) console.debug('NO FEATURED BETTING SITE!')
            // ... return null;
            return;
        }

        // ... intercept the league_list data;
        league_list_data = response

        // ...
		loaded = true;

        // ... return the FINAL Promise Value;
        return response;
    }

    // ... change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
    $: refresh_data = $userBetarenaSettings.country_bookmaker;
    // ...
    $: if (refresh_data) {
        // ... reset necessary variables;
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
    // ...
    let showFullLeagueList: boolean = false;
    let fullLeagueListDisplayNum: number = 4;
    // ...
    let showFullCountryList: boolean = false;
    let fullCountryListDisplayNum: number = 4;

    function selectCountryLeague(targetCountry: string) {
        if (selectedCountryLeague === targetCountry) {
            selectedCountryLeague = undefined
            return;
        }
        // ... else;
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

    // ... change the `search-input-data` upon typing;
    let leagueSearchData = []
    let countrySearchData = []
    // ... listed to search-input text;
    $: if (leagueSearch != undefined && leagueSearch != '' && league_list_data) {
        // ... reset data;
        leagueSearchData = []
        countrySearchData = []
        // ... iterate for league-data;
        for (const item of league_list_data.all_leagues_list) {
            // ... identify the correct search league items;
            if (item.league_name.toString().toLowerCase().includes(leagueSearch.toString().toLowerCase()) || 
                item.country_name.toString().toLowerCase().includes(leagueSearch.toString().toLowerCase())) {
                // ... store the data;
                leagueSearchData.push(item)
            }
        }
        // ... iterate for country-data;
        for (const item of league_list_data.unique_county_list) {
            // ... identify the correct search country items;
            if (item.country_name.toString().toLowerCase().includes(leagueSearch.toString().toLowerCase())) {
                // ... store the data;
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
        if (wInit >= 1440) {
            viewportDesktop = true;
        } else {
            viewportDesktop = false;
        }
        window.addEventListener('resize', function () {
            var w = document.documentElement.clientWidth;
            if (w >= 1440) {
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

<!-- ... SEO-DATA-LOADED ... -->
{#if !loaded}
    <div 
        id="seo-league-list-box">
        <!-- ... iterate over the data to find the correc language ... -->
        {#each LEAGUE_LIST_WIDGET_DATA_SEO.translations as WIDGET_SEO}
            <!-- ... obtain the correct widget translation ... -->
            {#if WIDGET_SEO.lang == server_side_language}
                <!-- ... translation-expressions ... -->
                <p>{WIDGET_SEO.translations.widget_title}</p>
                <p>{WIDGET_SEO.translations.top_leagues}</p>
                <p>{WIDGET_SEO.translations.leagues_by_country}</p>
            {/if}
        {/each}
        <!-- ... all-leagues-expressions ... -->
        {#each LEAGUE_LIST_WIDGET_DATA_SEO.all_leagues_list as league}
            <!-- content here -->
            <p>{league.league_name}</p>
        {/each}
        <!-- ... all-unique-country-expressions ... -->
        {#each LEAGUE_LIST_WIDGET_DATA_SEO.unique_county_list as country}
            <!-- content here -->
            <p>{country.country_name}</p>
        {/each}
    </div>
{/if}

<!-- ... desktop-ONLY ... -->
{#if viewportDesktop}

    <!-- ... refresh status ... -->
    {#if !refresh}
        <!-- ... promise is pending ... -->
        {#await widgetInit()}
        <!-- ... promise was fulfilled ... -->
        {:then data}
            <div>

                <!-- ... identify the correct translation via IF -->
                {#each data.translations as WIDGET_TRANSLATION}
                    {#if WIDGET_TRANSLATION.lang == server_side_language}

                        <!-- ... wiget-title ... -->
                        <p
                            id='widget-title'
                            class="s-20 m-b-10 color-white w-500 w-normal">
                            {WIDGET_TRANSLATION.translations.widget_title}
                        </p>

                        <!-- ... league-list-container ... -->
                        <div
                            id='league-list'
                            class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} >

                            <!-- ... search-box ... -->
                            <div
                                id='search-container'>

                                <input 
                                    type="text"
                                    placeholder={WIDGET_TRANSLATION.translations.search_form}
                                    bind:value={leagueSearch}
                                    id='league-list-search'
                                    class='m-b-20' 
                                    style='margin: 0 20px 20px 20px;'
                                    autocomplete="off" />

                                <!-- ... erase-search-input ... -->
                                {#if leagueSearch != '' && leagueSearch != undefined}
                                    {#if $userBetarenaSettings.theme == 'Dark'}
                                        <!-- content here -->
                                        <img
                                            id='close-btn-search'
                                            class='cursor-pointer'
                                            src={close_white}
                                            alt=""
                                            width="20px" height="20px" 
                                            on:click={() => leagueSearch = ''} />
                                    {:else}
                                        <!-- content here -->
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


                            <!-- ... no-search-input-is-made ... -->
                            {#if leagueSearch == undefined || leagueSearch == ''}
                                <!-- content here -->

                                <!-- ... list-TOP-7-popular-rating-leagues [GEO-BASED] ... -->
                                <p
                                    class='color-grey s-14 m-b-5'
                                    style='padding: 0 20px;'>
                                    {WIDGET_TRANSLATION.translations.top_leagues}
                                </p>
                                <!-- ... list-grid ... -->
                                <div
                                    id='popular-list-container'
                                    class='m-b-20'>
                                    <!-- ... for-loop-each-population ... -->
                                    {#each data.top_geo_leagues as item}
                                        <!-- content here -->
                                        <div
                                            class='top-league-container row-space-start'>
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

                                <!-- ... list-all-countries-based-leagues ... -->
                                <p
                                    class='color-grey s-14 m-b-5'
                                    style='padding: 0 20px;'>
                                    {WIDGET_TRANSLATION.translations.leagues_by_country}
                                </p>
                                <!-- ... list-grid ... -->
                                <div
                                    id='countires-list-container'>
                                    <!-- ... for-loop-each-population ... -->
                                    {#each data.unique_county_list as item}
                                        <!-- content here -->
                                        <div
                                            class='main-country-container'
                                            class:selectedCountry={selectedCountryLeague === item.country_name}>
                                            <!-- ... parent-country [SHOWN] ... -->
                                            <div
                                                class='country-league-container row-space-start'
                                                on:click={() => selectCountryLeague(item.country_name)}>
                                                <!-- ... check-if-continent-selected ... -->
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
                                            <!-- ... sub-category [DEFAULT HIDDEN] ... -->
                                            {#each data.all_leagues_list as league}
                                                {#if league.country_id.toString().toLowerCase() === item.country_id.toString().toLowerCase() 
                                                    && selectedCountryLeague === item.country_name}
                                                    <!-- content here -->
                                                    <div
                                                        class='country-league-sub-container row-space-start'>
                                                        <p class='s-14 w-500 color-black'>
                                                            {league.league_name}
                                                        </p>
                                                    </div>
                                                {/if}
                                            {/each}
                                        </div>
                                    {/each}
                                </div>

                            <!-- ... no-results-to-show ... -->
                            {:else if leagueSearchData.length === 0 
                                && countrySearchData.length === 0}

                                <div
                                    id='no-results-container'
                                    class='column-space-center'>

                                    <NoResults />
                                    <p 
                                        class='s-16 m-t-15 color-grey'>
                                        {WIDGET_TRANSLATION.translations.no_results}
                                    </p>
                                </div>
                            
                            <!-- ... show-results ... -->
                            {:else}
                                <!-- ... search-display-data ... -->
                                
                                <!-- ... list-leagues-matching-search ... -->
                                <p
                                    class='search-title w-500 color-black s-14 m-b-5'
                                    style='padding: 0 20px;'>
                                    {WIDGET_TRANSLATION.translations.competitions_results}
                                </p>
                                <!-- ... list-grid ... -->
                                <div
                                    id='search-list-container'
                                    class='m-b-12'>
                                    <!-- ... for-loop-each-population ... -->
                                    {#each leagueSearchData.slice(0, fullLeagueListDisplayNum) as item}
                                        <!-- content here -->
                                        <div
                                            class='top-league-container-search row-space-start'>
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
                                <!-- ... show-full-list ... -->
                                {#if leagueSearchData.length > 4}
                                    <p 
                                        class='s-14 w-500 color-primary cursor-pointer m-b-20'
                                        on:click={() => toggleFullLeagueList()}
                                        style='padding: 0 20px;'>
                                            {#if !showFullLeagueList}
                                                <!-- content here -->
                                                {WIDGET_TRANSLATION.translations.full_list}
                                            {:else}
                                                {WIDGET_TRANSLATION.translations.hide}
                                            {/if}
                                    </p>
                                {/if}

                                <!-- ... list-countries-matching-search -->
                                <p
                                    class='search-title w-500 color-black s-14 m-b-5'
                                    style='padding: 0 20px;'>
                                    {WIDGET_TRANSLATION.translations.countries_results}
                                </p>
                                <!-- ... list-grid ... -->
                                <div
                                    id='countires-list-container'>
                                    <!-- ... for-loop-each-population ... -->
                                    {#each countrySearchData.slice(0, fullCountryListDisplayNum) as item}
                                        <!-- content here -->
                                        <div
                                            class='main-country-container'
                                            class:selectedCountry={selectedCountryLeague === item.country_name}>
                                            <!-- ... parent-country [SHOWN] ... -->
                                            <div
                                                class='country-league-container row-space-start'
                                                on:click={() => selectCountryLeague(item.country_name)}>
                                                <img 
                                                    src={item.image_path} 
                                                    alt=""
                                                    title={item.country_name + '-image'} 
                                                    width="20px" height="20px" 
                                                    class='m-r-15' />
                                                <p class='s-14 w-500 color-black'>
                                                    {item.country_name}
                                                </p>
                                            </div>
                                            <!-- ... sub-category [DEFAULT HIDDEN] ... -->
                                            {#each data.all_leagues_list as league}
                                                {#if league.country_id.toString().toLowerCase() === item.country_id.toString().toLowerCase() 
                                                    && selectedCountryLeague === item.country_name}
                                                    <!-- content here -->
                                                    <div
                                                        class='country-league-sub-container row-space-start'>
                                                        <p class='s-14 w-500 color-black'>
                                                            {league.league_name}
                                                        </p>
                                                    </div>
                                                {/if}
                                            {/each}
                                        </div>
                                    {/each}
                                </div>
                                <!-- ... show-full-list ... -->
                                {#if countrySearchData.length > 4}
                                    <p 
                                        class='s-14 w-500 color-primary cursor-pointer m-b-20'
                                        on:click={() => toggleFullCountryList()}
                                        style='padding: 0 20px;'>
                                        <!-- content here -->
                                        {#if !showFullCountryList}
                                            <!-- content here -->
                                            {WIDGET_TRANSLATION.translations.full_list}
                                        {:else}
                                            {WIDGET_TRANSLATION.translations.hide}
                                        {/if}
                                    </p>
                                {/if}

                            {/if}

                        </div>
                    
                    {/if}
                {/each}

            </div>
        <!-- ... promise was rejected ... -->
        {:catch error}
            {error}
        {/await}
    {/if}

{/if}


<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

    #seo-league-list-box {
        position: absolute;
        z-index: -100;
        top: -9999px;
        left: -9999px;
    }

    #league-list {
        display: grid;
        background: #ffffff;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        min-width: 100%;
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