<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // [ℹ] svelte-imports;
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  
  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";
  import { get } from "$lib/api/utils";
  import { getImageBgColor } from "$lib/utils/color_thief";

  import type { 
    Cache_Single_SportbookDetails_Data_Response, 
    Cache_Single_Tournaments_League_Info_Data_Response 
  } from "$lib/models/tournaments/league-info/types";

  import LeagueInfoWidgetContentLoader from "./_LeagueInfo_Widget_ContentLoader.svelte";

  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import team from './assets/team.svg';
  import team_w from './assets/team-white.svg';
	import no_featured_match_visual from './assets/no_featured_match_visual.svg'
	import no_featured_match_visual_dark from './assets/no_featured_match_visual_dark.svg'
import { logDevGroup } from "$lib/utils/debug";

  let loaded: boolean = false;                  // [ℹ] holds boolean for data loaded;
  let refresh: boolean = false;                 // [ℹ] refresh value speed of the WIDGET;
	let refresh_data: any = undefined;            // [ℹ] refresh-data value speed;
  let noLeagueInfoBool: any = false;            // [ℹ] identifies the noLeagueInfoBool boolean;
  let dropdownSeasonSelect: any = undefined     // [ℹ] selected TOP LEAGUE;
  let toggleDropdown: boolean = false;          // [ℹ] toggle Dropdown BOX accordingly;
  let toggleCTA: boolean = false;

  let datePercentageDiff: number = 0;           // [ℹ] the (%) difference progress of season
  let dateDateStartDisplay: string;
  let dateDateEndDisplay: string;

  let selectedOpt = 0;

  let imageVar: string = '--league-info-bookmaker-bg-';

	export let LEAGUE_INFO_SEO_DATA: Cache_Single_Tournaments_League_Info_Data_Response;

  if (dev) logDevGroup ("league info [DEV]", `LEAGUE_INFO_SEO_DATA: ${LEAGUE_INFO_SEO_DATA}`)
  if (dev) logDevGroup ("league info [DEV]", `dropdownSeasonSelect: ${dropdownSeasonSelect}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(): Promise < Cache_Single_Tournaments_League_Info_Data_Response > {

    if (!$userBetarenaSettings.country_bookmaker) {
      return
    }

    // [ℹ] get the TARGET-LEAGUE-INFO;
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] get response [lang] [obtained from preload()]
    // [ℹ] get response [geo]
		const response: Cache_Single_SportbookDetails_Data_Response = await get("/api/cache/tournaments/sportbook?geoPos="+userGeo)

    // await new Promise(resolve => setTimeout(resolve, 5000000000));
    // const response: Cache_Single_Geo_Leagues_Table_Translation_Response = LEAGUES_TABLE_SCORES_DATA;

    // [ℹ] display NO DATA PLACEHOLDER
		if (response == null || response == undefined) {
      // [🐛] debug 
      if (dev) logDevGroup ("league info [DEV]", `❌ no data available!`)
      noLeagueInfoBool = true;
			return;
		}
    // [ℹ] otherwise, revert back to DATA AVAILABLE;
    else {
      noLeagueInfoBool = false;
    }

    loaded = true;

    LEAGUE_INFO_SEO_DATA.data.sportbook_detail = response

    // [ℹ] distorted "sportmonks" image color-thief application
    const imageURL: string = LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image
    getImageBgColor(imageURL, imageVar)

    // [ℹ] order dates by descending order;
    LEAGUE_INFO_SEO_DATA.data.seasons.sort((a, b) => parseFloat(b.name.toString().slice(-2)) - parseFloat(a.name.toString().slice(-2)));

    // [ℹ] 2021/2022 => 21/22 (date) conversion
    for (const season of LEAGUE_INFO_SEO_DATA.data.seasons) {
      
      // [ℹ] check if already processed
      if (season.name.length > 5) {

        if (!season.name.includes('2020')) {
          season.name = season.name.replace(/20/g, "");
        } else {
          season.name = season.name.replace('2020', '-');
          season.name = season.name.replace(/20/g, "");
          season.name = season.name.replace('-', '20');
        }

      }
    }

    // [ℹ] select 1st league/season
    dropdownSeasonSelect = LEAGUE_INFO_SEO_DATA.data.seasons[0]
    $sessionStore.selectedSeasonID = dropdownSeasonSelect.id;

    // [ℹ] number of clubs check;
    for (const season of LEAGUE_INFO_SEO_DATA.data.seasons) {

        if (season.number_of_clubs === null || season.number_of_clubs === undefined) {
          season.number_of_clubs = "-"
        }
    }

    // [ℹ] intercept date-league-calculation
    const startDate = LEAGUE_INFO_SEO_DATA.data.seasons[0].start_date;
    const endDate = LEAGUE_INFO_SEO_DATA.data.seasons[0].end_date;
    validateSeasonProgressDate(startDate, endDate);

    LEAGUE_INFO_SEO_DATA = LEAGUE_INFO_SEO_DATA

    // [ℹ] return the FINAL Promise Value;
    return LEAGUE_INFO_SEO_DATA;
  }

  function validateSeasonProgressDate (start_end, end_date) {

    if ((start_end == null || end_date == null) || (start_end == undefined || end_date == undefined)) {
      datePercentageDiff = null;
      if (dev) logDevGroup ("league info [DEV]", `identified as NULL!`)
      return
    }

    // [ℹ] check if progress bar should have (%)
    const currentDate = new Date();
    const startDate = new Date(start_end);
    const endDate = new Date(end_date);

    // [ℹ] assign date display
    dateDateStartDisplay = new Date(start_end).getUTCDate().toString() + " " + monthNames[new Date(start_end).getMonth().toString()]
    dateDateEndDisplay = new Date(end_date).getUTCDate().toString() + " " + monthNames[new Date(end_date).getMonth().toString()]

    if (currentDate > startDate &&
        currentDate < endDate) {

      const seasonDiffDays = Math.floor((endDate - startDate) / 86400000);
      const currentDiffDays =  Math.floor((endDate - currentDate) / 86400000);
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
    $sessionStore.selectedSeasonID = season.id;
    validateSeasonProgressDate (dropdownSeasonSelect.start_date, dropdownSeasonSelect.end_date)
  }

  function closeAllDropdowns() {
    toggleDropdown = false;
    toggleCTA = false;
  }

  function triggerGoggleEvents(action: string) {
    if (action === "betting_site_logo_widget_league_info") {
      gtag('event', "betting_site_logo_widget_league_info", { 
        'event_category': "widget_league_info", 
        'event_label': "click_betting_site_logo", 
        'value': "click"
        }
      );
      return
    }

    if (action === "beting_cta_link_widget_league_info") {
      gtag('event', "beting_cta_link_widget_league_info", { 
        'event_category': "widget_league_info", 
        'event_label': "beting_cta_link_logo", 
        'value': "click"
        }
      );
      return
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= 1000) {
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
      if (w >= 1000) {
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

	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	// $: refresh_data = $page.url.pathname;

	// $: if (browser && old_country != undefined && old_page != undefined) {
    // if (!matchingPage || !matchingCountry) {
  $: if (browser && refresh_data) {
      // [ℹ] reset necessary variables;
      refresh = true
      toggleDropdown = false
      loaded = false
      noLeagueInfoBool = false
      // widgetInit()
      setTimeout(async() => {
        refresh = false
      }, 100)
    }
	// }

  afterNavigate(async () => {
    widgetInit()
  })

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<!-- [ℹ] area-outside-for-close 
-->
{#if toggleDropdown || 
    toggleCTA}
  <div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}

<div>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-league-table-site-box">
      <h1>{LEAGUE_INFO_SEO_DATA.data.name}</h1>
      <p>{LEAGUE_INFO_SEO_DATA.data.country}</p>
    </div>
  {/if}

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if noLeagueInfoBool && !loaded}
    <!-- [ℹ] title of the widget 
    -->
    <h1 
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {LEAGUE_INFO_SEO_DATA.data.name}
    </h1>

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
        <p class='s-16 m-b-8 w-500'> 
          {LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info}
        </p>
        <p class='s-16 color-grey w-400'>
          {LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info_desc}
        </p>
      </div>
    </div>
  {/if}

  <!-- [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if !noLeagueInfoBool && !refresh && browser && $userBetarenaSettings.country_bookmaker}

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
            class="row-space-out-top m-b-40">

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
                <h1
                  id='widget-title'
                  class="s-32 m-b-10 color-black-2 m-0"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}
                  style="margin: 0; font-weight: 700">
                  {LEAGUE_INFO_SEO_DATA.data.name}
                </h1>

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
                      alt={LEAGUE_INFO_SEO_DATA.data.country}
                      width="24px" height="24px"
                      class="m-r-10"
                    />
                    <p
                      class="s-16 color-grey w-500 m-0">
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
                        alt={LEAGUE_INFO_SEO_DATA.data.translation.teams} 
                        width="24px" height="24px"
                        class="m-r-8"
                      />
                    {:else}
                      <img 
                        src={team}
                        alt={LEAGUE_INFO_SEO_DATA.data.translation.teams}
                        width="24px" height="24px"
                        class="m-r-8"
                      />
                    {/if}

                    {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                      {#if dropdownSeasonSelect.name === item.name}
                        <p
                          style="width: 70px;"
                          class='s-14 w-500 color-grey no-wrap'>
                          {item.number_of_clubs}
                          {LEAGUE_INFO_SEO_DATA.data.translation.teams} 
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
                              class:color-primary={item.name === dropdownSeasonSelect.name}
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
                class="row-space-end m-b-15">

                {#if LEAGUE_INFO_SEO_DATA.data.sportbook_detail}

                  <div
                    id='button-extra-info-container'>

                    <div
                      id="betting-site-container"
                      class="row-space-start m-r-16">

                      <a 
                        rel="nofollow"
                        aria-label="betting_site_logo_widget_league_info"
                        on:click={() => triggerGoggleEvents("betting_site_logo_widget_league_info")}
                        href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                        target="_blank"
                        style="width: inherit;">
                        <img 
                          id='sportbook-logo-img'
                          src={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image}
                          alt={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.title}
                        />
                      </a>

                      <button 
                        class="place-bet-btn btn-primary"
                        on:click={() => toggleCTA = !toggleCTA}>
                        <p 
                          class="medium">
                          Bet now
                        </p>
                      </button>
                    </div>

                    <!-- [ℹ] extra-info pop-up container
                    -->
                    {#if toggleCTA}
                      <div 
                        class="extra-info" 
                        in:fade>

                        <!--  [ℹ] site-image 
                        -->
                        <a 
                          rel="nofollow" 
                          aria-label="betting_site_logo_widget_league_info"
                          on:click={() => triggerGoggleEvents("betting_site_logo_widget_league_info")}
                          href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                          style="width: inherit;">
                          <img
                            style="background-color: var({imageVar});"
                            class="extra-info-img"
                            src={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image}
                            alt={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.title}
                          />
                        </a>

                        <!--  [ℹ] extra-site info 
                        -->
                        <div 
                          class="extra-info-container">
                          <!--  [ℹ] text 
                          -->
                          <p 
                            class="large">
                            {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.bonus_description}
                          </p>
                          <!--  [ℹ] button_cta 
                          -->
                          <a 
                            rel="nofollow" 
                            aria-label="betting_site_logo_widget_league_info"
                            on:click={() => triggerGoggleEvents("beting_cta_link_widget_league_info")}
                            href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                            target="_blank">
                            <button
                              class="btn-primary btn-cta"
                              style="width: 100% !important;">
                              <p 
                                class="w-500 s-14 w-normal">
                                Register
                              </p>
                            </button>
                          </a>
                          <!--  [ℹ] extra-site info text 
                          -->
                          <p 
                            class="small" 
                            style="color: #CCCCCC;">
                            {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.information}
                          </p>
                        </div>
                      </div>
                    {/if}

                  </div>

                {/if}

                <button
                  id='following-btn'
                  class="cursor-not-allowed">
                  <p 
                    class="s-14 color-grey w-500 no-wrap">
                    {LEAGUE_INFO_SEO_DATA.data.translation.following} 
                  </p>
                </button>
                
              </div>

              <!-- [ℹ] season start-end & progress-bar dates select
              -->
              <div
                class="row-space-start">

                {#if datePercentageDiff != null}
                  <p
                    class="s-14 color-grey w-500 m-r-10 no-wrap">
                      {dateDateStartDisplay}
                  </p>

                  <div 
                    id="season-progressbar"
                    class="m-r-10">
                    <div style="width: {datePercentageDiff}%;"/>
                  </div>

                  <p
                    class="s-14 color-grey w-500 no-wrap">
                    {dateDateEndDisplay}
                  </p>
                {/if}

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
                {LEAGUE_INFO_SEO_DATA.data.translation.overview}
              </p>
            </div>

            <div
              class="opt-container cursor-not-allowed m-r-32"
              on:click={() => selectedOpt = 1}
              class:activeOpt={selectedOpt == 1}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.content} 
              </p>
            </div>

            <div
              class="opt-container cursor-not-allowed m-r-32"
              on:click={() => selectedOpt = 2}
              class:activeOpt={selectedOpt == 2}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.stats} 
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
                <h1
                  id='widget-title'
                  class="s-32 m-b-10 color-black-2 m-0"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}
                  style="margin: 0; font-weight: 700">
                  {LEAGUE_INFO_SEO_DATA.data.name}
                </h1>

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
                      alt={LEAGUE_INFO_SEO_DATA.data.country}
                      class="m-r-10"
                    />
                    <p
                      class="s-16 color-grey w-500 m-0">
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
                        alt={LEAGUE_INFO_SEO_DATA.data.translation.teams} 
                        width="24px" height="24px"
                      />
                    {:else}
                      <img 
                        src={team}
                        alt={LEAGUE_INFO_SEO_DATA.data.translation.teams} 
                        width="24px" height="24px"
                      />
                    {/if}

                    {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                      {#if dropdownSeasonSelect.name === item.name}
                        <p
                          class='s-14 w-500 color-grey no-wrap'>
                          {item.number_of_clubs}
                          {LEAGUE_INFO_SEO_DATA.data.translation.teams} 
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
                              class:color-primary={item.name === dropdownSeasonSelect.name}
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
              id='following-btn'
              class="cursor-not-allowed">
              <p 
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.following} 
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

              {#if datePercentageDiff != null}

                <p
                  class="s-14 color-grey w-500 m-r-10 no-wrap">
                  {dateDateStartDisplay}
                </p>

                <div 
                  id="season-progressbar"
                  class="m-r-10">
                  <div style="width: {datePercentageDiff}%;"/>
                </div>

                <p
                  class="s-14 color-grey w-500 no-wrap">
                  {dateDateEndDisplay}
                </p>

              {/if}

            </div>

            <!-- [ℹ] sportsbook-logo
            -->
            {#if LEAGUE_INFO_SEO_DATA.data.sportbook_detail}

              <div
                id='button-extra-info-container'>

                  <div
                    id="betting-site-container"
                    class="row-space-end">
                    <a 
                      rel="nofollow"
                      aria-label="betting_site_logo_widget_league_info"
                      on:click={() => triggerGoggleEvents("betting_site_logo_widget_league_info")}
                      href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                      target="_blank"
                      style="width: inherit;">
                      <img 
                        id='sportbook-logo-img'
                        src={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image}
                        alt={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.title}
                      />
                    </a>
                    <button 
                      class="place-bet-btn btn-primary"
                      on:click={() => toggleCTA = !toggleCTA}>
                      <p 
                        class="medium">
                        Bet now
                      </p>
                    </button>
                  </div>

                <!-- [ℹ] extra-info pop-up container
                -->
                {#if toggleCTA}
                  <div 
                    class="extra-info" 
                    in:fade>

                    <!--  [ℹ] site-image 
                    -->
                    <a 
                      rel="nofollow" 
                      aria-label="betting_site_logo_widget_league_info"
                      on:click={() => triggerGoggleEvents("betting_site_logo_widget_league_info")}
                      href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                      style="width: inherit;">
                      <img
                        style="background-color: var({imageVar});"
                        class="extra-info-img"
                        src={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image}
                        alt={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.title}
                        />
                    </a>

                    <!--  [ℹ] extra-site info 
                    -->
                    <div 
                      class="extra-info-container">
                      <!--  [ℹ] text 
                      -->
                      <p 
                        class="large">
                        {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.bonus_description}
                      </p>
                      <!--  [ℹ] button_cta 
                      -->
                      <a 
                        rel="nofollow" 
                        aria-label="betting_site_logo_widget_league_info"
                        on:click={() => triggerGoggleEvents("beting_cta_link_widget_league_info")}
                        href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                        target="_blank">
                        <button
                          class="btn-primary btn-cta"
                          style="width: 100% !important;">
                          <p 
                            class="w-500 s-14 w-normal">
                            Register
                          </p>
                        </button>
                      </a>
                      <!--  [ℹ] extra-site info text 
                      -->
                      <p 
                        class="small" 
                        style="color: #CCCCCC;">
                        {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.information}
                      </p>
                    </div>
                  </div>
                {/if}

              </div>

            {/if}

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
                {LEAGUE_INFO_SEO_DATA.data.translation.overview}
              </p>
            </div>

            <div
              class="opt-container cursor-not-allowed m-r-32"
              on:click={() => selectedOpt = 1}
              class:activeOpt={selectedOpt == 1}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.content} 
              </p>
            </div>

            <div
              class="opt-container cursor-not-allowed m-r-32"
              on:click={() => selectedOpt = 2}
              class:activeOpt={selectedOpt == 2}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.stats} 
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
                <h1
                  id='widget-title'
                  class="s-16 m-b-10 color-black-2 m-0"
                  class:color-white={$userBetarenaSettings.theme == 'Dark'}
                  style="margin: 0; font-weight: 700">
                  {LEAGUE_INFO_SEO_DATA.data.name}
                </h1>

                <!-- [ℹ] league-country
                -->
                <div
                  class='row-space-start m-r-16'>
                  <img 
                    id="country-img"
                    src={LEAGUE_INFO_SEO_DATA.data.country_logo}
                    alt={LEAGUE_INFO_SEO_DATA.data.country}
                    class="m-r-10"
                  />
                  <p
                    class="s-12 color-grey w-500 m-0">
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
                        class:color-primary={item.name === dropdownSeasonSelect.name}
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
                  alt={LEAGUE_INFO_SEO_DATA.data.translation.teams} 
                  width="24px" height="24px"
                />
              {:else}
                <img 
                  src={team}
                  alt={LEAGUE_INFO_SEO_DATA.data.translation.teams} 
                  width="24px" height="24px"
                />
              {/if}

              {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                {#if dropdownSeasonSelect.name === item.name}
                  <p
                    class='s-12 w-500 color-grey no-wrap text-center'>
                    {item.number_of_clubs}
                    {LEAGUE_INFO_SEO_DATA.data.translation.teams} 
                  </p>
                {/if}
              {/each}
            </div>

            <!-- [ℹ] season start-end & progress-bar dates select
            -->
            <div
              class="column-space-start">

              {#if datePercentageDiff != null}

                <div 
                  id="season-progressbar"
                  class="m-b-8">
                  <div style="width: {datePercentageDiff}%;"/>
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

              {/if}

            </div>

          </div>

          <!-- [ℹ] sportbook-logo + follow-btn
          -->
          <div
            class="m-b-20">
            
            <!-- [ℹ] sportsbook-logo
            -->
            {#if LEAGUE_INFO_SEO_DATA.data.sportbook_detail}

              <div
                id='button-extra-info-container'>

                <div
                  id="betting-site-container"
                  class="row-space-start m-b-8">
                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_widget_league_info"
                    on:click={() => triggerGoggleEvents("betting_site_logo_widget_league_info")}
                    href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                    target="_blank"
                    style="width: inherit;">
                    <img 
                      id='sportbook-logo-img'
                      src={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image}
                      alt={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.title}
                    />
                  </a>
                  <button
                    class="place-bet-btn btn-primary"
                    on:click={() => toggleCTA = !toggleCTA}>
                    <p 
                      class="medium w-500">
                      Bet now
                    </p>
                  </button>
                </div>

                <!-- [ℹ] extra-info pop-up container
                -->
                {#if toggleCTA}
                  <div 
                    class="extra-info" 
                    in:fade>

                    <!--  [ℹ] site-image 
                    -->
                    <a 
                      rel="nofollow" 
                      aria-label="betting_site_logo_widget_league_info"
                      on:click={() => triggerGoggleEvents("betting_site_logo_widget_league_info")}
                      href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                      style="width: inherit;">
                      <img
                        style="background-color: var({imageVar});"
                        class="extra-info-img"
                        src={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.image}
                        alt={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.title}
                        />
                    </a>

                    <!--  [ℹ] extra-site info 
                    -->
                    <div 
                      class="extra-info-container">
                      <!--  [ℹ] text 
                      -->
                      <p 
                        class="large">
                        {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.bonus_description}
                      </p>
                      <!--  [ℹ] button_cta 
                      -->
                      <a 
                        rel="nofollow" 
                        aria-label="betting_site_logo_widget_league_info"
                        on:click={() => triggerGoggleEvents("beting_cta_link_widget_league_info")}
                        href={LEAGUE_INFO_SEO_DATA.data.sportbook_detail.register_link}
                        target="_blank">
                        <button
                          class="btn-primary btn-cta"
                          style="width: 100% !important;">
                          <p 
                            class="w-500 s-14 w-normal">
                            Register
                          </p>
                        </button>
                      </a>
                      <!--  [ℹ] extra-site info text 
                      -->
                      <p 
                        class="small" 
                        style="color: #CCCCCC;">
                        {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.information}
                      </p>
                    </div>
                  </div>
                {/if}

              </div>

            {/if}

            <button
              id='following-btn'
              class="cursor-not-allowed">
              <p 
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.following} 
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
                {LEAGUE_INFO_SEO_DATA.data.translation.overview}
              </p>
            </div>

            <div
              class="opt-container cursor-not-allowed"
              on:click={() => selectedOpt = 1}
              class:activeOpt={selectedOpt == 1}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.content} 
              </p>
            </div>

            <div
              class="opt-container cursor-not-allowed"
              on:click={() => selectedOpt = 2}
              class:activeOpt={selectedOpt == 2}>
              <p
                class="s-14 color-grey w-500 no-wrap">
                {LEAGUE_INFO_SEO_DATA.data.translation.stats} 
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

  #background-area-close {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

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
    object-fit: contain;
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
    /* height: 308px; */
    max-height: 308px;
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
    /* height: 308px; */
    max-height: 308px;
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
		/* width: 120px; */ 
    min-width: 120px;
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
    color: #F5620F !important;
  }

  #button-extra-info-container {
    position: relative;
  } .extra-info-container {
    padding: 20px;
    display: grid;
    justify-items: stretch;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
  } .extra-info-container p {
    color: white;
  } .extra-info {
    background: #4b4b4b;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    position: absolute;
    top: 105%;
    right: 0;
    /* width: 289px; */
    max-width: 289px;
    width: 100%;
    display: grid;
    z-index: 100000000000;
    justify-items: center;
    overflow: hidden;
  } .extra-info-img {
    width: 100%;
    object-fit: contain;
    height: 40px;
  } .btn-cta {
    border-radius: 8px !important;
    margin-top: 32px;
    margin-bottom: 16px;
    padding: 11.5px !important;
    width: -webkit-fill-available;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 575px) and (max-width: 1000px)  {

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
      /* width: 100%; */
      /* max-width: 169px; */
    }

    div#betting-site-container {
      width: 289px;
    }

    button#following-btn { 
      width: auto;
    }

  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #leagues-table-container {
      min-width: 100%;
      /* max-width: 560px; */
    }

    div#view-tournaments-opt-container div.opt-container:hover p {
      color: #292929 !important;
    }

    .dark-background-1 div#view-tournaments-opt-container div.opt-container:hover p {
      color: #FFFFFF !important;
    }

    div#season-progressbar {
      width: 367px !important;
    }

    .extra-info {
      left: 0;
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
