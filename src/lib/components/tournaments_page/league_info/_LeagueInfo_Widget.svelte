<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // [ℹ] svelte-imports;
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from "$app/env";

  import { userBetarenaSettings } from "$lib/store/user-settings";
  import { get } from "$lib/api/utils";
  import { getImageBgColor } from "$lib/utils/color_thief";

  import type { 
    Cache_Single_SportbookDetails_Data_Response, 
    Cache_Single_Tournaments_League_Info_Data_Response } from "$lib/models/tournaments/types";

  import LeagueInfoWidgetContentLoader from "./_LeagueInfo_Widget_ContentLoader.svelte";

  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import team from './assets/team.svg';
  import team_w from './assets/team-white.svg';
	import no_featured_match_visual from './assets/no_featured_match_visual.svg'
	import no_featured_match_visual_dark from './assets/no_featured_match_visual_dark.svg'

  let loaded: boolean = false;                  // [ℹ] holds boolean for data loaded;
  let refresh: boolean = false;                 // [ℹ] refresh value speed of the WIDGET;
	let refresh_data: any = undefined;            // [ℹ] refresh-data value speed;
  let noLeagueInfoBool: any = false;            // [ℹ] identifies the noLeagueInfoBool boolean;
  let dropdownSeasonSelect: any = undefined     // [ℹ] selected TOP LEAGUE;
  let toggleDropdown: boolean = false;          // [ℹ] toggle Dropdown BOX accordingly;

  let datePercentageDiff: number = 0;           // [ℹ] the (%) difference progress of season
  let dateDateStartDisplay: string;
  let dateDateEndDisplay: string;

  let selectedOpt = 0;

  let imageVar: string = '--league-info-bookmaker-bg-';

	export let LEAGUE_INFO_SEO_DATA: Cache_Single_Tournaments_League_Info_Data_Response;

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(): Promise < Cache_Single_Tournaments_League_Info_Data_Response > {

    // [ℹ] get the TARGET-LEAGUE-INFO;
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] get response [lang] [obtained from preload()]
    // [ℹ] get response [geo]
		const response: Cache_Single_SportbookDetails_Data_Response = await get("/api/tournaments/cache-data.json?geoPos="+userGeo)

    // await new Promise(resolve => setTimeout(resolve, 5000000000));
    // const response: Cache_Single_Geo_Leagues_Table_Translation_Response = LEAGUES_TABLE_SCORES_DATA;

    // [ℹ] display NO DATA PLACEHOLDER
		if (response == null || response == undefined) {
      if (dev) console.debug('❌ no leagues_table available!')
      noLeagueInfoBool = true;
			return;
		}
    // [ℹ] otherwise, revert back to DATA AVAILABLE;
    else {
      noLeagueInfoBool = false;
    }

    loaded = true;

    LEAGUE_INFO_SEO_DATA.data.beting_cta_link = response.beting_cta_link
    LEAGUE_INFO_SEO_DATA.data.betting_site_logo = response.betting_site_logo

    // [ℹ] distorted "sportmonks" image color-thief application
    const imageURL: string = LEAGUE_INFO_SEO_DATA.data.betting_site_logo
    getImageBgColor(imageURL, imageVar)

    // [ℹ] select 1st league/season
    dropdownSeasonSelect = LEAGUE_INFO_SEO_DATA.data.seasons[0]

    // [ℹ] intercept date-league-calculation
    const startDate = LEAGUE_INFO_SEO_DATA.data.seasons[0].start_date;
    const endDate = LEAGUE_INFO_SEO_DATA.data.seasons[0].end_date;
    validateSeasonProgressDate(startDate, endDate);

    // [ℹ] 2021/2022 => 21/22 (date) conversion
    for (const season of LEAGUE_INFO_SEO_DATA.data.seasons) {
      
      // [ℹ] check if already processed
      if (season.name.length != 5) {

        if (!season.name.includes('2020')) {
          season.name = season.name.replace(/20/g, "");
        } else {
          season.name = season.name.replace('2020', '-');
          season.name = season.name.replace(/20/g, "");
          season.name = season.name.replace('-', '20');
        }

      }
    }
    

    LEAGUE_INFO_SEO_DATA = LEAGUE_INFO_SEO_DATA

    // [ℹ] return the FINAL Promise Value;
    return LEAGUE_INFO_SEO_DATA;
  }

  function validateSeasonProgressDate (start_end, end_date) {
    // [ℹ] check if progress bar should have (%)
    const currentDate = parseInt(new Date().toString());
    const startDate = parseInt(new Date(start_end).toString());
    const endDate = parseInt(new Date(end_date).toString());

    // [ℹ] assign date display
    dateDateStartDisplay = new Date(start_end).getUTCDate().toString() + " " + monthNames[new Date(start_end).getMonth().toString()]
    dateDateEndDisplay = new Date(end_date).getUTCDate().toString() + " " + monthNames[new Date(end_date).getMonth().toString()]

    if (currentDate > startDate &&
        currentDate < endDate) {

      const seasonDiffTime = Math.abs(endDate - startDate);
      const seasonDiffDays = Math.ceil(seasonDiffTime / (1000 * 60 * 60 * 24)); 

      const currentDiffTime = Math.abs(endDate - currentDate);
      const currentDiffDays = Math.ceil(currentDiffTime / (1000 * 60 * 60 * 24)); 

      datePercentageDiff = 100 - (currentDiffDays / seasonDiffDays) * 100

    } 
    else if (currentDate >= endDate) {

      datePercentageDiff = 100;
    }
    else {

      datePercentageDiff = 0;
    }
  }

  function selectSeason (season) {
    dropdownSeasonSelect = season;
    validateSeasonProgressDate (dropdownSeasonSelect.start_date, dropdownSeasonSelect.end_date)
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= 960) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit < 575) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// [ℹ] TABLET - VIEW
      if (w >= 960) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// [ℹ] MOBILE - VIEW
			if (w < 575) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
  });

  // $: if (dev) console.log("mobileExclusive", mobileExclusive, "tabletExclusive", tabletExclusive)

  // ~~~~~~~~~~~~~~~~~~~~~
	// COMPONENT TIMER CLOCK
	// ~~~~~~~~~~~~~~~~~~~~~

  const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	$: refresh_data = $page.url.pathname;
	$: if (browser && refresh_data) {
    // [ℹ] reset necessary variables;
    // refresh = true
    toggleDropdown = false
    loaded = false
    // widgetInit()
    // setTimeout(async() => {
      // refresh = false
    // }, 50)
	}

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-league-table-site-box">
      <h2>{LEAGUE_INFO_SEO_DATA.data.country}</h2>
      <h2>{LEAGUE_INFO_SEO_DATA.data.name}</h2>
    </div>
  {/if}

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if noLeagueInfoBool && !loaded}
    <!-- [ℹ] title of the widget 
    -->
    <h2 
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {LEAGUE_INFO_SEO_DATA.data.name}
    </h2>

    <!-- [ℹ] no-matches-avaiable-placeholder container 
    -->
    <div 
      id='no-best-players-box'
      class='row-space-start'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- [ℹ] no-visual-asset
      -->
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
      
      <!-- [ℹ] container w/ text 
      -->
      <div>
        <p class='s-16 m-b-8 w-500'> No League Info Available </p>
        <p class='s-16 color-grey w-400'> Sorry, at this time there is no league info available! </p>
      </div>
    </div>
  {/if}

  <!-- [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if !noLeagueInfoBool && !refresh}

    <!-- [ℹ] promise is pending 
    -->
    {#await widgetInit()}
      <LeagueInfoWidgetContentLoader />
    <!-- [ℹ] promise was fulfilled
    -->
    {:then data}

      <!-- [ℹ] widget-component [DESKTOP]
      -->
      {#if !mobileExclusive && !tabletExclusive}

        <div 
          id="leagues-table-container"
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- [ℹ] top-row data container
          -->
          <div
            class="row-space-out m-b-40">

            <!-- [ℹ] main league info-1st container
            -->
            <div
              class="row-space-start">

              <!-- [ℹ] tournament / league logo
              -->
              <img 
                id="league-logo"
                class="m-r-20"
                src={LEAGUE_INFO_SEO_DATA.data.image_path}
                alt={LEAGUE_INFO_SEO_DATA.data.name}
                width="80px" height="80px"
              />

              <div
                class="column-start-grid-start"
                style="width: fit-content;">

                <!-- [ℹ] wiget-title
                -->
                <h2
                  id='widget-title'
                  class="s-32 m-b-10 color-black-2"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}
                  style="margin: 0; font-weight: 700">
                  {LEAGUE_INFO_SEO_DATA.data.name}
                </h2>

                <!-- [ℹ] under-league-info-title
                -->
                <div
                  class="row-space-start">

                  <!-- [ℹ] league-country
                  -->
                  <div
                    class='row-space-start m-r-16'>
                    <img 
                      id="country-img"
                      src={LEAGUE_INFO_SEO_DATA.data.country_logo}
                      alt=""
                      width="24px" height="24px"
                      class="m-r-10"
                    />
                    <p
                      class="s-16 color-grey w-500">
                      {LEAGUE_INFO_SEO_DATA.data.country}
                    </p>
                  </div>


                  <!-- [ℹ] num. of teams
                  -->
                  <div
                    id="team-container"
                    class="row-space-start m-r-16">

                    {#if $userBetarenaSettings.theme == 'Dark'}
                      <img 
                        src={team_w}
                        alt=""
                        width="24px" height="24px"
                        class="m-r-8"
                      />
                    {:else}
                      <img 
                        src={team}
                        alt=""
                        width="24px" height="24px"
                        class="m-r-8"
                      />
                    {/if}

                    {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                      {#if dropdownSeasonSelect.name === item.name}
                        <p
                          class='s-14 w-500 color-grey no-wrap'>
                          {item.number_of_clubs}
                          Teams 
                        </p>
                      {/if}
                    {/each}
                  </div>

                  <!-- [ℹ] dropdown season select
                  -->
                  <div
                    id='dropdown-seasons'
                    class="m-r-16">
                    
                    <div
                      class="row-space-start"
                      on:click={() => toggleDropdown = !toggleDropdown}>
                      <!-- [ℹ] display selected season (round)
                      -->
                      {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                        {#if dropdownSeasonSelect.name === item.name}
                          <p
                            class='s-14 m-r-5 color-primary'>
                            {item.name}
                          </p>
                        {/if}
                      {/each}
                      <!-- [ℹ] arrow down [hidden-menu] 
                      -->
                      {#if !toggleDropdown}
                        <img 
                          src={arrow_down} 
                          alt="arrow_down" 
                          width="16px" height="16px" 
                        />
                      {:else}
                        <img 
                          src={arrow_up} 
                          alt="arrow_up" 
                          width="16px" height="16px" 
                        />
                      {/if}
                    </div>
                    
                    <!-- [ℹ] show-dropdown
                    -->
                    {#if toggleDropdown}
                      <div
                        id="dropdown-list-main-container">
                        <div
                          id="dropdown-list-inner-container">
                          {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                            <p
                              class='s-14 w-500 row-season'
                              on:click={() => selectSeason(item)}>
                              {item.name}
                            </p>
                          {/each}
                        </div>
                      </div>
                    {/if}

                  </div>
                
                </div>
              </div>

            </div>

            <!-- [ℹ] main league info-2st container row
            -->
            <div>

              <!-- [ℹ] sportsbook-logo & follow btn & container
              -->
              <div
                class="row-space-out m-b-15">

                <div
                  id="betting-site-container"
                  class="row-space-start m-r-16">
                  <img 
                    id='sportbook-logo-img'
                    src={LEAGUE_INFO_SEO_DATA.data.betting_site_logo}
                    alt=''
                  />
                  <a 
                    rel="external"
                    href={LEAGUE_INFO_SEO_DATA.data.beting_cta_link}>
                    <button 
                      class="place-bet-btn btn-primary">
                      <p 
                        class="medium">
                        Bet now
                      </p>
                    </button>
                  </a>
                </div>

                <button
                  id='following-btn'>
                  <p 
                    class="s-14 color-grey w-500 no-wrap">
                    Following
                  </p>
                </button>

              </div>

              <!-- [ℹ] season start-end & progress-bar dates select
              -->
              <div
                class="row-space-start">

                <p
                  class="s-14 color-grey w-500 m-r-10 no-wrap">
                  {dateDateStartDisplay}
                </p>

                <div 
                  id="season-progressbar"
                  class="m-r-10">
                  <div style="width: ${datePercentageDiff}%;"/>
                </div>

                <p
                  class="s-14 color-grey w-500 no-wrap">
                  {dateDateEndDisplay}
                </p>

              </div>

            </div>

          </div>

          <!-- [ℹ] bottom-row data container
          -->
          <div
            id="view-tournaments-opt-container"
            class="row-space-start">

            <!-- [ℹ] options view buttons 
            -->
            <div
              class="opt-container cursor-pointer m-r-32"
              on:click={() => selectedOpt = 0}
              class:activeOpt={selectedOpt == 0}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Overview
              </p>
            </div>

            <div
              class="opt-container cursor-pointer m-r-32"
              on:click={() => selectedOpt = 1}
              class:activeOpt={selectedOpt == 1}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Content
              </p>
            </div>

            <div
              class="opt-container cursor-pointer m-r-32"
              on:click={() => selectedOpt = 2}
              class:activeOpt={selectedOpt == 2}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Stats
              </p>
            </div>

          </div>

        </div>

      <!-- [ℹ] widget-component [TABLET]
      -->
      {:else if !mobileExclusive && tabletExclusive}

        <div 
          id="leagues-table-container"
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- [ℹ] top-row data container
          -->
          <div
            class="row-space-out-top m-b-20">

            <!-- [ℹ] main league info-1st container
            -->
            <div
              class="row-space-start">

              <!-- [ℹ] tournament / league logo
              -->
              <img 
                id="league-logo"
                class="m-r-20"
                src={LEAGUE_INFO_SEO_DATA.data.image_path}
                alt={LEAGUE_INFO_SEO_DATA.data.name}
                width="80px" height="80px"
              />

              <div
                class="column-start-grid-start"
                style="width: fit-content;">

                <!-- [ℹ] wiget-title
                -->
                <h2
                  id='widget-title'
                  class="s-32 m-b-10 color-black-2"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}
                  style="margin: 0; font-weight: 700">
                  {LEAGUE_INFO_SEO_DATA.data.name}
                </h2>

                <!-- [ℹ] under-league-info-title
                -->
                <div
                  class="row-space-start">

                  <!-- [ℹ] league-country
                  -->
                  <div
                    class='row-space-start m-r-16'>
                    <img 
                      id="country-img"
                      src={LEAGUE_INFO_SEO_DATA.data.country_logo}
                      alt=""
                      class="m-r-10"
                    />
                    <p
                      class="s-16 color-grey w-500">
                      {LEAGUE_INFO_SEO_DATA.data.country}
                    </p>
                  </div>

                  <!-- [ℹ] num. of teams
                  -->
                  <div
                    id="team-container"
                    class="row-space-start m-r-16">

                    {#if $userBetarenaSettings.theme == 'Dark'}
                      <img 
                        src={team_w}
                        alt=""
                        width="24px" height="24px"
                      />
                    {:else}
                      <img 
                        src={team}
                        alt=""
                        width="24px" height="24px"
                      />
                    {/if}

                    {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                      {#if dropdownSeasonSelect.name === item.name}
                        <p
                          class='s-14 w-500 color-grey no-wrap'>
                          {item.number_of_clubs}
                          Teams 
                        </p>
                      {/if}
                    {/each}
                  </div>

                  <!-- [ℹ] dropdown season select
                  -->
                  <div
                    id='dropdown-seasons'
                    class="m-r-16">
                    
                    <div
                      class="row-space-start"
                      on:click={() => toggleDropdown = !toggleDropdown}>
                      <!-- [ℹ] display selected season (round)
                      -->
                      {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                        {#if dropdownSeasonSelect.name === item.name}
                          <p
                            class='s-14 m-r-5 color-primary'>
                            {item.name}
                          </p>
                        {/if}
                      {/each}
                      <!-- [ℹ] arrow down [hidden-menu] 
                      -->
                      {#if !toggleDropdown}
                        <img 
                          src={arrow_down} 
                          alt="arrow_down" 
                          width="16px" height="16px" 
                        />
                      {:else}
                        <img 
                          src={arrow_up} 
                          alt="arrow_up" 
                          width="16px" height="16px" 
                        />
                      {/if}
                    </div>
                    
                    <!-- [ℹ] show-dropdown
                    -->
                    {#if toggleDropdown}
                      <div
                        id="dropdown-list-main-container">
                        <div
                          id="dropdown-list-inner-container">
                          {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                            <p
                              class='s-14 w-500 row-season'
                              on:click={() => selectSeason(item)}>
                              {item.name}
                            </p>
                          {/each}
                        </div>
                      </div>
                    {/if}

                  </div>
                
                </div>
              </div>

            </div>

            <!-- [ℹ] sportsbook-logo & follow btn & container
            -->
            <button
              id='following-btn'>
              <p 
                class="s-14 color-grey w-500 no-wrap">
                Following
              </p>
            </button>

          </div>

          <!-- [ℹ] extra tablet / mobile row
          -->
          <div
            class="row-space-out m-b-30">

            <!-- [ℹ] season start-end & progress-bar dates select
            -->
            <div
              class="row-space-start m-r-24">
              <p
                class="s-14 color-grey w-500 m-r-10 no-wrap">
                {dateDateStartDisplay}
              </p>

              <div 
                id="season-progressbar"
                class="m-r-10">
                <div style="width: ${datePercentageDiff}%;"/>
              </div>

              <p
                class="s-14 color-grey w-500 no-wrap">
                {dateDateEndDisplay}
              </p>
            </div>

            <!-- [ℹ] sportsbook-logo
            -->
            <div
              id="betting-site-container"
              class="row-space-end">
              <img 
                id='sportbook-logo-img'
                src={LEAGUE_INFO_SEO_DATA.data.betting_site_logo}
                alt=''
              />
              <a 
                rel="external"
                href={LEAGUE_INFO_SEO_DATA.data.beting_cta_link}>
                <button 
                  class="place-bet-btn btn-primary">
                  <p 
                    class="medium">
                    Bet now
                  </p>
                </button>
              </a>
            </div>

          </div>

          <!-- [ℹ] bottom-row data container
          -->
          <div
            id="view-tournaments-opt-container"
            class="row-space-start">

            <!-- [ℹ] options view buttons 
            -->
            <div
              class="opt-container cursor-pointer m-r-32"
              on:click={() => selectedOpt = 0}
              class:activeOpt={selectedOpt == 0}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Overview
              </p>
            </div>

            <div
              class="opt-container cursor-pointer m-r-32"
              on:click={() => selectedOpt = 1}
              class:activeOpt={selectedOpt == 1}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Content
              </p>
            </div>

            <div
              class="opt-container cursor-pointer m-r-32"
              on:click={() => selectedOpt = 2}
              class:activeOpt={selectedOpt == 2}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Stats
              </p>
            </div>

          </div>

        </div>

      <!-- [ℹ] widget-component [MOBILE]
      -->
      {:else}

        <div 
          id="leagues-table-container"
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- [ℹ] top-row data container
          -->
          <div
            class="row-space-out-top m-b-20">

            <!-- [ℹ] main league info-1st container
            -->
            <div
              class="row-space-start">

              <!-- [ℹ] tournament / league logo
              -->
              <img 
                id="league-logo"
                class="m-r-10"
                src={LEAGUE_INFO_SEO_DATA.data.image_path}
                alt={LEAGUE_INFO_SEO_DATA.data.name}
              />

              <div
                class="column-start-grid-start"
                style="width: fit-content;">

                <!-- [ℹ] wiget-title
                -->
                <h2
                  id='widget-title'
                  class="s-16 m-b-10 color-black-2"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}
                  style="margin: 0; font-weight: 700">
                  {LEAGUE_INFO_SEO_DATA.data.name}
                </h2>

                <!-- [ℹ] league-country
                -->
                <div
                  class='row-space-start m-r-16'>
                  <img 
                    id="country-img"
                    src={LEAGUE_INFO_SEO_DATA.data.country_logo}
                    alt=""
                    class="m-r-10"
                  />
                  <p
                    class="s-12 color-grey w-500">
                    {LEAGUE_INFO_SEO_DATA.data.country}
                  </p>
                </div>

              </div>

            </div>

            <!-- [ℹ] dropdown season select
            -->
            <div
              id='dropdown-seasons'>
              
              <div
                class="row-space-start"
                on:click={() => toggleDropdown = !toggleDropdown}>
                <!-- [ℹ] display selected season (round)
                -->
                {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                  {#if dropdownSeasonSelect.name === item.name}
                    <p
                      class='s-14 m-r-5 color-primary'>
                      {item.name}
                    </p>
                  {/if}
                {/each}
                <!-- [ℹ] arrow down [hidden-menu] 
                -->
                {#if !toggleDropdown}
                  <img 
                    src={arrow_down} 
                    alt="arrow_down" 
                    width="16px" height="16px" 
                  />
                {:else}
                  <img 
                    src={arrow_up} 
                    alt="arrow_up" 
                    width="16px" height="16px" 
                  />
                {/if}
              </div>
              
              <!-- [ℹ] show-dropdown
              -->
              {#if toggleDropdown}
                <div
                  id="dropdown-list-main-container">
                  <div
                    id="dropdown-list-inner-container">
                    {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                      <p
                        class='s-14 w-500 row-season'
                        on:click={() => selectSeason(item)}>
                        {item.name}
                      </p>
                    {/each}
                  </div>
                </div>
              {/if}

            </div>

          </div>

          <!-- [ℹ] extra tablet / mobile row
          -->
          <div
            class="row-space-out m-b-20"
            style="align-items: flex-end;">

            <!-- [ℹ] num. of teams
            -->
            <div
              id="team-container"
              class="column-space-center m-r-20"
              style="width: auto;">

              {#if $userBetarenaSettings.theme == 'Dark'}
                <img 
                  src={team_w}
                  alt=""
                  width="24px" height="24px"
                />
              {:else}
                <img 
                  src={team}
                  alt=""
                  width="24px" height="24px"
                />
              {/if}

              {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                {#if dropdownSeasonSelect.name === item.name}
                  <p
                    class='s-12 w-500 color-grey no-wrap text-center'>
                    {item.number_of_clubs}
                    Teams 
                  </p>
                {/if}
              {/each}
            </div>

            <!-- [ℹ] season start-end & progress-bar dates select
            -->
            <div
              class="column-space-start">

              <div 
                id="season-progressbar"
                class="m-b-8">
                <div style="width: ${datePercentageDiff}%;"/>
              </div>

              <div
                class="row-space-out">
                <p
                  class="s-12 color-grey w-500 no-wrap">
                  {dateDateStartDisplay}
                </p>
                <p
                  class="s-12 color-grey w-500 no-wrap">
                  {dateDateEndDisplay}
                </p>
              </div>

            </div>

          </div>

          <!-- [ℹ] sportbook-logo + follow-btn
          -->
          <div
            class="m-b-20">
            
            <!-- [ℹ] sportsbook-logo
            -->
            <div
              id="betting-site-container"
              class="row-space-start m-b-8">
              <img 
                id='sportbook-logo-img'
                src={LEAGUE_INFO_SEO_DATA.data.betting_site_logo}
                alt=''
              />
              <a 
                rel="external"
                href={LEAGUE_INFO_SEO_DATA.data.beting_cta_link}>
                <button 
                  class="place-bet-btn btn-primary">
                  <p 
                    class="medium w-500">
                    Bet now
                  </p>
                </button>
              </a>
            </div>

            <button
              id='following-btn'>
              <p 
                class="s-14 color-grey w-500 no-wrap">
                Following
              </p>
            </button>

          </div>

          <!-- [ℹ] bottom-row data container
          -->
          <div
            id="view-tournaments-opt-container"
            class="row-space-even">

            <!-- [ℹ] options view buttons 
            -->
            <div
              class="opt-container cursor-pointer"
              on:click={() => selectedOpt = 0}
              class:activeOpt={selectedOpt == 0}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Overview
              </p>
            </div>

            <div
              class="opt-container cursor-pointer"
              on:click={() => selectedOpt = 1}
              class:activeOpt={selectedOpt == 1}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Content
              </p>
            </div>

            <div
              class="opt-container cursor-pointer"
              on:click={() => selectedOpt = 2}
              class:activeOpt={selectedOpt == 2}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                Stats
              </p>
            </div>

          </div>

        </div>

      {/if}

    <!-- [ℹ] promise was rejected
    -->
    {:catch error}
      {error}
    {/await}

  {/if}

</div>

<!-- ===============
    COMPONENT STYLE = [MOBILE FIRST]
=================-->

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
    /* display: grid; */
    padding: 20px;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    /* overflow: hidden; */
    padding-bottom: 0; /* was 12px w/ the bottom row as "absolute" */
    position: relative;
  }

  img#league-logo {
    width: 40px;
    height: 40px;
  }

  img#country-img {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #E6E6E6;
    object-fit: cover;
  }

  div#dropdown-seasons {
    padding: 4.5px 8px 4.5px 12px;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  } div#dropdown-seasons:hover {
    border: 1px solid #8C8C8C;
  } div#dropdown-seasons div#dropdown-list-main-container {
    position: absolute;
    top: 115%;
    width: 100%;
    /* background-color: #F2F2F2; */
    background-color: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    z-index: 10000;
    height: 308px;
    overflow-y: scroll;
    padding-right: 6px;
    right: 0;
  } div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar  {
    /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
  } div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar  {
    /* Hide scrollbar for IE, Edge and Firefox */ 
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container {
    height: 308px;
    overflow-y: scroll;
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season {
    padding: 11px 20px;
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season:hover {
    cursor: pointer;
    color: #f5620f !important;
  }

  /* width */
  div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar {
    width: 4px;
  }
  /* track */
  div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track {
    background: #F2F2F2;
    border-radius: 12px;
    margin: 8px;
  }
  /* handle */
  div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb {
    background: #CCCCCC;
    border-radius: 12px;
  }

  div#season-progressbar {
    background: #E6E6E6;
    border-radius: 10px;
    max-width: 367px;
    width: 100%;
  } div#season-progressbar > div {
    background-color: #F5620F;
    /* width: 40%; */ /* Adjust with JavaScript */
    height: 8px;
    border-radius: 10px;
  }

  div#betting-site-container {
    width: 100%;
  } div#betting-site-container img#sportbook-logo-img {
    width: 100%;
    height: 40px;
    object-fit: none;
    border-radius: 8px;
    background-color: var(--league-info-bookmaker-bg-);
  } div#betting-site-container button.place-bet-btn {
    height: 40px;
		width: 120px;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
    margin-left: -12.5px;
  }
  
  button#following-btn {
    height: 40px;
		background-color: transparent;
    border: 1px solid #8C8C8C !important;
    border-radius: 8px;
    padding: 10px 30px;
    width: 100%;
  } button#following-btn:hover {
    border: 1px solid #F5620F !important;
  } button#following-btn:hover p {
    color: #F5620F;
  }

  div#view-tournaments-opt-container {
    /* position: absolute; */
    /* bottom: 0; */
    /* left: 0; */
    /* margin-left: 20px; */
  } div#view-tournaments-opt-container div.opt-container {
    border-bottom: solid 2.5px transparent;
    width: 100%;
    text-align: center;
  } div#view-tournaments-opt-container div.opt-container p {
    padding-bottom: 12px;
  } div#view-tournaments-opt-container div.opt-container.activeOpt {
    border-color: #F5620F;
  } div#view-tournaments-opt-container  div.opt-container.activeOpt p {
    color: #F5620F;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 575px) and (max-width: 960px)  {

    #leagues-table-container {
      min-width: 100%;
      /* max-width: 700px; */
    }

    button#following-btn { 
      width: auto;
      position: absolute;
      top: 0;
      right: 0;
      margin: 20px 20px 0 0;
    }

    /* div#betting-site-container { */
      /* min-width: 289px; */
      /* max-width: 289px; */
      /* width: 100%; */
    /* } */
    
  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 575px)  {
    img#league-logo {
      width: 80px;
      height: 80px;
    }

    img#country-img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #E6E6E6;
    }

    div#view-tournaments-opt-container div.opt-container {
      border-bottom: solid 2.5px transparent;
      width: auto;
    }
    
    div#betting-site-container img#sportbook-logo-img {
      width: 100%;
      max-width: 169px;
    }

    button#following-btn { 
      width: auto;
    }

  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 960px) {

    #leagues-table-container {
      min-width: 100%;
      /* max-width: 560px; */
    }

    div#betting-site-container {
      /* min-width: 289px; */
      min-width: 289px;
    }


  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  .dark-background-1 div#season-progressbar {
    background: #616161 !important; 
  }

  .dark-background-1 div#dropdown-seasons div#dropdown-list-main-container {
    /* dark theme/dark-gray */
    background: #616161;
    /* shadow/black */
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
    border-radius: 4px;
  }

  .dark-background-1  div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season  {
    color: #ffffff;
  }

  /* handle */
  .dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb {
    background: #999999 !important;
  }
  /* track */
  .dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track {
    background: #4B4B4B !important;
  }

  .dark-background-1 div#dropdown-seasons {
    border: 1px solid #737373;
  }

</style>
