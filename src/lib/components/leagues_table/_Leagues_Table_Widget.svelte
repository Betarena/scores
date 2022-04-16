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
	// ... external components import;
  import LeagueTableWidgetContentLoader from "./_League_Table_Widget_ContentLoader.svelte";
  import LeagueTableTeamRow from "./_League_Table_Team_Row.svelte";
  import type { Leagues_Table_Cache_Ready, Leagues_Table_SEO_Cache_Ready } from "$lib/models/leagues_table/types";

  // ... key component assets;
  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import check_league from './assets/check-league.svg';
	import no_featured_match_visual from './assets/no_featured_match_visual.svg'
	import no_featured_match_visual_dark from './assets/no_featured_match_visual_dark.svg'

  // ... main component variables;
	export let LEAGUES_TABLE_SCORES_SEO_DATA: Leagues_Table_SEO_Cache_Ready;

	let loaded: boolean = false;            // ... holds boolean for data loaded;
  let refresh: boolean = false;           // ... refresh value speed of the WIDGET;
	let refresh_data: any = undefined;      // ... refresh-data value speed;
  let noLeaguesTable: any = false;        // ... identifies the noLeaguesTable boolean;
  let dropdownSelect: string = undefined  // ... selected TOP LEAGUE;
  let toggleDropdown: boolean = false;    // ... toggle Dropdown BOX accordingly;

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
   * ... ℹ Intializer of the Widget Function
   * ... ℹ Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
  */
  async function widgetInit(): Promise < Leagues_Table_Cache_Ready > {

    // ... ℹ get the USER-GEO-LOCATION;
		let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
    // ... 🐛 DEBUGGING;
    if (dev) console.debug('ℹ userGeo', userGeo)

    // ... ℹ GET RESPONSE;
		const response: Leagues_Table_Cache_Ready  = await post(`api/leagues_table/cache-data.json`, userGeo)
		// ... 🐛 DEBUGGING;
		if (dev) console.debug('ℹ widgetInit() leagues_table cache', response)

    // ... ℹ if response is null;
		if (response == null || response == undefined) {
			// ...
			if (dev) console.debug('❌ no leagues_table available!')
			// ... return null;
      noLeaguesTable = true;
      // ...
			return;
		}

    // ...
    loaded = true;

    // ... ℹ select 1st league/season
    dropdownSelect = response.top_leagues_table_data[0].season_league_id

    // ... ℹ return the FINAL Promise Value;
    return response;
  }

  // ... ℹ change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	// ...
	$: if (refresh_data) {
		// ... reset necessary variables;
		refresh = true
    setTimeout(async() => {
			refresh = false
      toggleDropdown = false
		}, 50)
	}

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... ℹ onMount() function that verifies that
   * ... ℹ the `viewport` width is of tablet size
   * ... ℹ or greater;
  */
  let viewportDesktop: boolean;
  // ...
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

  <!-- ... ℹ SEO-DATA-LOADED ... -->
  {#if !loaded}
    <!-- ... iterate over the data to find the correc language ... -->
    {#each LEAGUES_TABLE_SCORES_SEO_DATA.translations as WIDGET_SEO_TRANSLATION}
      <!-- ... obtain the correct widget translation ... -->
      {#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
        <!-- ... SEO-BOX ... -->
        <div id="seo-league-table-site-box">
          <h2>{WIDGET_SEO_TRANSLATION.title}</h2>
          <!-- ... list all of the seasons & leagues in the DB ... -->
          {#each LEAGUES_TABLE_SCORES_SEO_DATA.top_leagues_table_data as WIDGET_SEASON_LEAGUE}
            <p>{WIDGET_SEASON_LEAGUE.season_league_name}</p>
            <!-- ... list all of the seasons & leagues -> TEAMS in the DB ... -->
            {#each WIDGET_SEASON_LEAGUE.season_league_teams as WIDGET_TEAM_LEAGUE}
              <p>{WIDGET_TEAM_LEAGUE.team_name}</p>
            {/each}
          {/each}
        </div>
      {/if}
    {/each}
  {/if}

  <!-- ... ℹ NO BEST PLAYERS AVAILABLE PLACEHOLDER ...-->
  {#if noLeaguesTable && !loaded}
    <!-- ... title of the widget ... -->
    <!-- ... iterate over the data to find the correc language ... -->
    {#each LEAGUES_TABLE_SCORES_SEO_DATA.translations as WIDGET_SEO_TRANSLATION}
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
        <p class='s-16 m-b-8 w-500'> No Best Players Available </p>
        <p class='s-16 color-grey w-400'> Sorry, at this time there is no best players available! </p>
      </div>
    </div>
  {/if}

  <!-- ... ℹ promise is pending ... -->
  {#if !noLeaguesTable && !refresh}

    {#await widgetInit()}
      <LeagueTableWidgetContentLoader />
    <!-- ... promise was fulfilled
    -->
    {:then data}
      <!-- ... identify the correct translation via IF 
      -->
      {#each data.translations as WIDGET_TRANSLATION}
        {#if WIDGET_TRANSLATION.lang == server_side_language}

          <!-- ... wiget-title
            -->
          <h2
            id='widget-title'
            class="s-20 m-b-10 w-500 w-normal color-black-2"
            style="margin-top: 0;"
            class:color-white={$userBetarenaSettings.theme == 'Dark'}>
            {WIDGET_TRANSLATION.title}
          </h2>

          <!-- ... widget-component 
          -->
          <div 
            id="leagues-table-container"
            class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

            <!-- ... ℹ dropdown leagues select box 
            -->
            <div
              id="dropdown-leagues-container"
              on:click={() => toggleDropdown = !toggleDropdown}>
              <!-- ... ℹ main seleced 
              -->
              {#each data.top_leagues_table_data as season_league_data_obj}
                <!-- ... ℹ content here -->
                {#if dropdownSelect === season_league_data_obj.season_league_id}
                  <div
                    id="dropdown-box-select"
                    class="row-space-out">
                    <p 
                      class="s-14 w-500 color-black-2">
                      {season_league_data_obj.season_league_name}
                    </p>
                    {#if !toggleDropdown}
                      <img 
                        src={arrow_down} 
                        alt=""
                        width="20px" height="20px"/>
                    {:else}
                      <img 
                        src={arrow_up} 
                        alt=""
                        width="20px" height="20px"/>
                    {/if}
                  </div>
                {/if}
              {/each}
              <!-- ... ℹ show main TOP 7 LEAGUES / SEASONS 
              -->
              {#if toggleDropdown}
                <!-- ... ℹ content here 
                -->
                <div
                  id='more-top-leagues-list-container'
                  class='m-b-20'>
                  <!-- ... ℹ for-loop-each-population 
                  -->
                  {#each data.top_leagues_table_data as item}
                      <!-- ... ℹ content here 
                      -->
                      <div
                        class="row-space-out top-league-container ">
                        <!-- ... ℹ row-league-data;
                        -->
                        <div
                            class='row-space-start cursor-pointer'
                            on:click={() => dropdownSelect = item.season_league_id}>
                            <!-- ... ℹ vlaidate that THIS SEASON - LEAGUE is PRE-SELECTED
                            -->
                            <img 
                                src='' 
                                alt={item.season_league_name.toString() + '-image'} 
                                width="20px" height="20px" 
                                class='m-r-15' />
                            <p 
                              class='s-14 w-500 color-black-2'>
                                {item.season_league_name}
                            </p>
                        </div>
                        <!-- ... ℹ vlaidate that THIS SEASON - LEAGUE is PRE-SELECTED
                        -->
                        {#if item.season_league_id === dropdownSelect}
                          <img 
                            src={check_league} 
                            alt=""
                            width="20px" height="20px"/>
                        {/if}
                      </div>
                  {/each}
                </div>
              {/if}

            </div>

            <!-- ... ℹ display the TEAMS of THIS TARGET LEAGUE & SEASONS on DESKTOP & TABLET; 
            -->
            {#each data.top_leagues_table_data as season_league_data_obj}
                <!-- ... ℹ content here 
                -->
                {#if dropdownSelect === season_league_data_obj.season_league_id}
                  <!-- ... ℹ content here 
                  -->
                  <!-- ... DESKTOP ONLY ... 
                  -->
                  {#if viewportDesktop}
                    <!-- ... widget-brakdown-columns-section ... -->
                    <div
                      id='widget-title-row'
                      class="row-space-out"
                      style="width: auto;">
                      <p class="w-400 medium color-grey">
                        {season_league_data_obj.season_league_name}
                      </p>
                      <div
                        class="row-space-end">
                        <p 
                          class="w-400 medium color-grey"
                          style="margin-right: 37px;">
                          {WIDGET_TRANSLATION.games}
                        </p>
                        <p 
                          class="w-400 medium color-grey">
                          {WIDGET_TRANSLATION.points}
                        </p>
                      </div>
                    </div>
                  {/if}
                  <!-- ... ℹ populate data of LEAGUE TEAMS
                    -->
                  {#each season_league_data_obj.season_league_teams as season_league_team}
                    <LeagueTableTeamRow data={season_league_team} />
                  {/each}
                {/if}
            {/each}
            
          </div>

        {/if}
      {/each}
    <!-- ... promise was rejected
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
  
  #seo-league-table-site-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  #leagues-table-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    max-width: 383px;
    overflow: hidden;
  }

  div#widget-title-row {
    /* padding: 7px 18px 7px 40px; */
    margin: 16px 20px 4px 20px;
  } div#widget-title-row p {
    white-space: nowrap;
  }

  div#dropdown-leagues-container {
    position: relative;
    margin: 20px 20px 0px 20px;
  } div#dropdown-leagues-container div#dropdown-box-select {
    padding: 12px 20px 12px 20px;
    border: 1px solid #8C8C8C;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
  } div#dropdown-leagues-container div#more-top-leagues-list-container {
    position: absolute;
    top: 115%;
    width: 100%;
    /* background-color: #F2F2F2; */
    background-color: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    z-index: 10000;
    height: 302px;
    overflow-y: scroll;
  } div#dropdown-leagues-container div#more-top-leagues-list-container .top-league-container {
    padding: 12px 20px;
  }

  /* width */
  div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar {
    width: 4px;
  }
  /* track */
  div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar-track {
    background: #F2F2F2;
    border-radius: 12px;
    margin: 5px;
  }
  /* handle */
  div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar-thumb {
    background: #CCCCCC;
    border-radius: 12px;
  }
  /* handle on hover */
  /* div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  } */

  /* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #leagues-table-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #leagues-table-container {
      min-width: 100%;
      /* max-width: 560px; */
    }
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

  .dark-background-1 div#dropdown-leagues-container div#more-top-leagues-list-container {
    /* dark theme/dark-gray */
    background: #616161;
    /* shadow/black */
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
    border-radius: 4px;
  }

</style>
