<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // [ℹ] svelte-imports;
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page, session } from "$app/stores";
  import { browser, dev } from "$app/env";
  import { afterNavigate } from "$app/navigation";

  import { userBetarenaSettings } from "$lib/store/user-settings";
  import { get } from "$lib/api/utils";
  import { getImageBgColor } from "$lib/utils/color_thief";

  import type { 
    Cache_Single_SportbookDetails_Data_Response, 
    Cache_Single_Tournaments_League_Standings_Info_Data_Response, 
    Cache_Single_Tournaments_League_Standings_Translation_Data_Response 
  } from "$lib/models/tournaments/types";

  import StandingsWidgetContentLoader from "./_Standings_Widget_ContentLoader.svelte";
  import StandingsTeamRow from "./_Standings_Team_Row.svelte";

	import no_featured_match_visual from './assets/no_featured_match_visual.svg'
	import no_featured_match_visual_dark from './assets/no_featured_match_visual_dark.svg'
	import slider_left from './assets/slider-left.svg'
	import slider_right from './assets/slider-right.svg'
  import slider_left_dark from './assets/slider-left-dark.svg'
	import slider_right_dark from './assets/slider-right-dark.svg'

  let loaded:                 boolean = false;  // [ℹ] holds boolean for data loaded;
  let refresh:                boolean = false;  // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:           any = undefined;  // [ℹ] refresh-data value speed;
  let noStandingsBool:        any = false;      // [ℹ] identifies the noStandingsBool boolean;
  let dropdownSeasonSelect:   any = undefined   // [ℹ] selected TOP LEAGUE;
  let toggleCTA:              boolean = false;

  let diasbleDev:             boolean = false;

  let selectedOpt:            string = 'total';
  let refreshRow:             boolean = false;
  let selectedOptTableMobile: number = 1;

  let currentSeason:          number = undefined;

  let imageVar:               string = '--standings-info-bookmaker-bg-';

	export let STANDINGS_T:     Cache_Single_Tournaments_League_Standings_Translation_Data_Response;
	export let STANDINGS_DATA:  Cache_Single_Tournaments_League_Standings_Info_Data_Response;

  $: if (dev && diasbleDev) console.log("STANDINGS_T: ", STANDINGS_T)
  $: if (dev && diasbleDev) console.log(dropdownSeasonSelect)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(): Promise < Cache_Single_SportbookDetails_Data_Response > {

    if (!$userBetarenaSettings.country_bookmaker) {
      return
    }

    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] get response [lang] [data] [obtained from preload()]
    // [ℹ] get response [geo]
		const response: Cache_Single_SportbookDetails_Data_Response = await get("/api/tournaments/cache-data.json?geoPos="+userGeo)

    // [ℹ] display NO DATA PLACEHOLDER
		if (response == null || response == undefined) {
      if (dev) console.debug('❌ no leagues_table available!')
      noStandingsBool = true;
			return;
		}
    // [ℹ] otherwise, revert back to DATA AVAILABLE;
    else {
      noStandingsBool = false;
    }

    loaded = true;

    // STANDINGS_T.data.sportbook_detail = response

    // [ℹ] distorted "sportmonks" image color-thief application
    const imageURL: string = response.image
    getImageBgColor(imageURL, imageVar)

    // [ℹ] order dates by descending order;
    // STANDINGS_T.data.seasons.sort((a, b) => parseFloat(b.name.toString().slice(-2)) - parseFloat(a.name.toString().slice(-2)));

    // [ℹ] select same-seaon-as-league-info-widget;
    // dropdownSeasonSelect = STANDINGS_T.data.seasons[0]

    STANDINGS_T = STANDINGS_T

    return response;
  }

  function selectTableView(opt: string) {
    selectedOpt = opt;
    refreshRow = true;
    setTimeout(async() => {
      refreshRow = false
    }, 50)
  }

  function closeAllDropdowns() {
    toggleCTA = false;
  }

  function triggerGoggleEvents(action: string) {
    if (action === "betting_site_logo_standings") {
      gtag('event', "betting_site_logo_standings", { 
        'event_category': "widget_standings_info", 
        'event_label': "click_betting_site_logo", 
        'value': "click"
        }
      );
      return
    }

    if (action === "cta_button_standings") {
      gtag('event', "cta_button_standings", { 
        'event_category': "widget_standings_info", 
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
    if (dev) console.log("League_HERE")
    refresh = true
    loaded = false
    noStandingsBool = false
    // widgetInit()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widgetInit()
  })

  let loadedCurrentSeason: boolean = false;
  $: if ($session.selectedSeasonID != undefined && !loadedCurrentSeason) {
    currentSeason = $session.selectedSeasonID;
    console.log("currentSeason: ", currentSeason)
    loadedCurrentSeason = true;
  }

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<!-- [ℹ] area-outside-for-close 
-->
{#if toggleCTA}
  <div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}

<div>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-widget-box">
      <h2>{STANDINGS_T.translations.standings}</h2>
      {#if STANDINGS_DATA?.seasons.length != 0}
        {#each STANDINGS_DATA.seasons[0].total as team}
          <p>{team.team_name}</p>
        {/each}
      {/if}
      
    </div>
  {/if}

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if noStandingsBool && !loaded}
    <!-- [ℹ] title of the widget 
    -->
    <h2 
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {STANDINGS_T.translations.standings}
    </h2>

    <!-- [ℹ] no-matches-avaiable-placeholder container 
    -->
    <div 
      id='no-widget-box'
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
  {#if !noStandingsBool && !refresh && browser && $userBetarenaSettings.country_bookmaker && !diasbleDev}

    <!-- [ℹ] promise is pending 
    -->
    {#await widgetInit()}
      <StandingsWidgetContentLoader />
    <!-- [ℹ] promise was fulfilled
    -->
    {:then data}

      <!-- [ℹ] widget-component [DESKTOP] [TABLET]
      -->
      {#if !mobileExclusive}

        <!-- [ℹ] promise was fulfilled 
        -->
        <h2 
          class="s-20 m-b-10 w-500 color-black-2"
          style="margin-top: 0px;"
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {STANDINGS_T.translations.standings}
        </h2>

        <div
          id="standings-table-container"
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- [ℹ] widget-top-selection-standings-view [DESKTOP]
          -->
          <div
            id="standings-view-box"
            class="row-space-start m-b-15">

            <div
              class="stand-view-opt-box cursor-pointer"
              on:click={() => selectTableView('total')}
              class:activeOpt={selectedOpt == 'total'}>
              <p
                class="s-14 w-500 color-grey">
                {STANDINGS_T.translations.total}
              </p>
            </div>

            <div
              class="stand-view-opt-box cursor-pointer"
              on:click={() => selectTableView('home')}
              class:activeOpt={selectedOpt == 'home'}>
              <p
                class="s-14 w-500 color-grey">
                {STANDINGS_T.translations.home}
              </p>
            </div>

            <div
              class="stand-view-opt-box cursor-pointer"
              on:click={() => selectTableView('away')}
              class:activeOpt={selectedOpt == 'away'}>
              <p
                class="s-14 w-500 color-grey">
                {STANDINGS_T.translations.away}
              </p>
            </div>

          </div>

          <!-- [STASHED] [ALTERNATIVE TABLE]

            <!-- [ℹ] widget-top-row-table-standings [DESKTOP]
            - ->
            <div
              id="top-row-standings-head"
              class="row-space-out">

              <!-- [ℹ] widget table heade [first-left] 
              - ->
              <div
                class="row-space-start">
                <p
                  class="s-12 m-r-20">
                  #
                </p>

                <p
                  class="s-12">
                  {STANDINGS_T.translations.team}
                </p>
              </div>

              <!-- [ℹ] widget table heade [second-right] 
              - ->
              <div
                class="row-space-end">

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.pts}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.pld}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.w}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.d}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.l}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.gf}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.ga}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.gavg}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.yavg}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations.cavg}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations["1.5+"]}
                </p>

                <p
                  class="s-12 m-r-5">
                  {STANDINGS_T.translations["2.5+"]}
                </p>

                <p
                  class="s-12 m-r-20">
                  {STANDINGS_T.translations.prob}
                </p>

                <p
                  class="s-12">
                  {STANDINGS_T.translations.recent_form}
                </p>
              </div>

            </div>

            <!-- [ℹ] widget-team-standing-row-table-standings [DESKTOP]
            - ->
            {#each STANDINGS_DATA.seasons as season}
              {#if season.season_id === $session.selectedSeasonID}
                {#each season.teams as team}
                  <StandingsTeamRow TEAM_DATA={team} VIEW={selectedOpt} />
                {/each}
              {/if}
            {/each}
          
          -->

          <table 
            class="standings_table">

            <!-- [ℹ] widget-top-row-table-standings [DESKTOP]
            -->
            <tr
              class="row-head">

              <th
                style="width: 100%;">
                <p
                  class="s-12 m-r-20 color-grey">
                  #
                  <span class='m-r-20'/>
                  {STANDINGS_T.translations.team}
                </p>
              </th>

              <th>
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations.pts}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.pts.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.pts.description}
                  </p>
                </div>
              </th>

              <th>
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations.pld}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.pld.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.pld.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey"
                  style="width: 20px;">
                  {STANDINGS_T.translations.w}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.w.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.w.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey"
                  style="width: 20px;">
                  {STANDINGS_T.translations.d}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.d.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.d.description}
                  </p>
                </div>
              </th>

              <th>
                <p
                  class="s-12 color-grey"
                  style="width: 20px;">
                  {STANDINGS_T.translations.l}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.l.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.l.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey"
                  style="width: 20px;">
                  {STANDINGS_T.translations.gf}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.gf.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.gf.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey"
                  style="width: 20px;">
                  {STANDINGS_T.translations.ga}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.ga.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.ga.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations.gavg}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.gavg.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.gavg.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations.yavg}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.yavg.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.yavg.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations.cavg}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.cavg.title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips.cavg.description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations["1.5+"]}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips["1.5+"].title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips["1.5+"].description}
                  </p>
                </div>
              </th>

              <th
                class="">
                <p
                  class="s-12 color-grey">
                  {STANDINGS_T.translations["2.5+"]}
                </p>

                <div
                  class="tooltip-extra-info">
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips["2.5+"].title}
                  </p>
                  <p
                    class="s-12 color-white no-wrap">
                    {STANDINGS_T.translations.tooltips["2.5+"].description}
                  </p>
                </div>
              </th>

              {#if $session.selectedSeasonID && currentSeason != undefined}
                {#if $session.selectedSeasonID === currentSeason}
                  <th>
                    <p
                      class="s-12 color-grey">
                      {STANDINGS_T.translations.prob}
                    </p>

                    <div
                      class="tooltip-extra-info">
                      <p
                        class="s-12 color-white no-wrap">
                        {STANDINGS_T.translations.tooltips.prob.title}
                      </p>
                      <p
                        class="s-12 color-white no-wrap">
                        {STANDINGS_T.translations.tooltips.prob.description}
                      </p>
                    </div>
                  </th>
                {/if}
              {/if}


              <th>
                <p
                  class="s-12 color-grey"
                  style="width: 70px;">
                  {STANDINGS_T.translations.recent_form}
                </p>
              </th>

            </tr>

            <!-- [ℹ] widget-team-standing-row-table-standings [DESKTOP]
            -->
            {#each STANDINGS_DATA.seasons as season}
              {#if season.season_id === $session.selectedSeasonID}
                {#each season[selectedOpt] as team}
                  <StandingsTeamRow TEAM_DATA={team} {currentSeason} />
                {/each}
              {/if}
            {/each}

          </table>

          <!-- [ℹ] widget-sportbook-details-table-standings [DESKTOP]
          -->
          <div
            id="standings-sportbook-details"
            class="m-t-20">

            {#if data}

              <div
                id='button-extra-info-container'>

                <div
                  id="betting-site-container"
                  class="row-space-start m-r-16 cursor-pointer">

                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_standings"
                    on:click={() => triggerGoggleEvents("betting_site_logo_standings")}
                    href={data.register_link}
                    target="_blank"
                    style="width: inherit;">
                    <img 
                      id='sportbook-logo-img'
                      src={data.image}
                      alt={data.title}
                    />
                  </a>

                  <button 
                    class="place-bet-btn btn-primary"
                    aria-label="toggleCTA"
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
                      aria-label="betting_site_logo_standings"
                      on:click={() => triggerGoggleEvents("betting_site_logo_standings")}
                      href={data.register_link}
                      style="width: inherit;">
                      <img
                        style="background-color: var({imageVar});"
                        class="extra-info-img"
                        src={data.image}
                        alt={data.title}
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
                        {data.bonus_description}
                      </p>
                      <!--  [ℹ] button_cta 
                      -->
                      <a 
                        rel="nofollow" 
                        aria-label="cta_button_standings"
                        on:click={() => triggerGoggleEvents("cta_button_standings")}
                        href={data.register_link}
                        target="_blank">
                        <button
                          class="btn-primary btn-cta"
                          aria-label="registerCTA"
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
                        {data.information}
                      </p>
                    </div>
                    
                  </div>
                {/if}

              </div>

            {/if}

          </div>

        </div>

      <!-- [ℹ] widget-component [MOBILE]
      -->
      {:else}

        <!-- [ℹ] promise was fulfilled 
        -->
        <h1 
          class="s-20 m-b-10 w-500 color-black-2"
          style="margin-top: 0px;"
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {STANDINGS_T.translations.standings}
        </h1>

        <div 
          id="standings-table-container"
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- [ℹ] widget-top-selection-standings-view [DESKTOP]
          -->
          <div
            id="standings-view-box"
            class="row-space-start m-b-20">

            <div
              class="stand-view-opt-box cursor-pointer"
              on:click={() => selectTableView('total')}
              class:activeOpt={selectedOpt == 'total'}>
              <p
                class="s-14 w-500 color-grey">
                {STANDINGS_T.translations.total}
              </p>
            </div>

            <div
              class="stand-view-opt-box cursor-pointer"
              on:click={() => selectTableView('home')}
              class:activeOpt={selectedOpt == 'home'}>
              <p
                class="s-14 w-500 color-grey">
                {STANDINGS_T.translations.home}
              </p>
            </div>

            <div
              class="stand-view-opt-box cursor-pointer"
              on:click={() => selectTableView('away')}
              class:activeOpt={selectedOpt == 'away'}>
              <p
                class="s-14 w-500 color-grey">
                {STANDINGS_T.translations.away}
              </p>
            </div>

          </div>

          <!-- [ℹ] widget table view mobile select
          -->
          <div
            id="mobile-table-box"
            class="row-space-out m-b-12">

            <button
              class="table-nav-btn"
              aria-label="selectedOptionTableMobile"
              disabled={selectedOptTableMobile == 1}
              on:click={() => selectedOptTableMobile = selectedOptTableMobile - 1}
              >
              {#if $userBetarenaSettings.theme == 'Dark'}
                <img 
                  src={slider_left_dark} 
                  alt=""
                />
              {:else}
                <img 
                  src={slider_left} 
                  alt=""
                />
              {/if}
            </button>

            <p
              class="s-14 w-500 color-black">
              {STANDINGS_T.translations.table} {selectedOptTableMobile}
            </p>

            <button
              class="table-nav-btn"
              aria-label="selectedOptionTableMobile"
              disabled={selectedOptTableMobile == 3}
              on:click={() => selectedOptTableMobile = selectedOptTableMobile + 1}
              >
              {#if $userBetarenaSettings.theme == 'Dark'}
                <img 
                  src={slider_right_dark} 
                  alt=""
                />
              {:else}
                <img 
                  src={slider_right} 
                  alt=""
                />
              {/if}
            </button>


          </div>

          <table 
            class="standings_table">

            <!-- [ℹ] widget-top-row-table-standings [DESKTOP]
            -->
            <tr
              class="row-head">

              <th
                style="width: 100%;">
                <p
                  class="s-12 m-r-20 color-grey">
                  #
                  <span class='m-r-20'/>
                  {STANDINGS_T.translations.team}
                </p>
              </th>

              <!-- [ℹ] table view 1 
              -->
              {#if selectedOptTableMobile == 1}

                <th>
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.pts}
                  </p>
                </th>

                <th>
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.pld}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.w}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.d}
                  </p>
                </th>

                <th>
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.l}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.gf}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.ga}
                  </p>
                </th>

              {/if}

              <!-- [ℹ] table view 2
              -->
              {#if selectedOptTableMobile == 2}

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.gavg}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.yavg}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations.cavg}
                  </p>
                </th>

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations["1.5+"]}
                  </p>
                </th>

              {/if}

              <!-- [ℹ] table view 3
              -->
              {#if selectedOptTableMobile == 3}

                <th
                  class="">
                  <p
                    class="s-12 color-grey">
                    {STANDINGS_T.translations["2.5+"]}
                  </p>
                </th>

                {#if $session.selectedSeasonID && currentSeason != undefined}
                  {#if $session.selectedSeasonID === currentSeason}
                    <th>
                      <p
                        class="s-12 color-grey">
                        {STANDINGS_T.translations.prob}
                      </p>
                    </th>
                  {/if}
                {/if}

                <th>
                  <p
                    class="s-12 color-grey no-wrap">
                    {STANDINGS_T.translations.recent_form}
                  </p>
                </th>
              
              {/if}

            </tr>

            <!-- [ℹ] extra row-space
            -->
            {#if $userBetarenaSettings.theme == 'Dark' && selectedOptTableMobile == 1}
              <tr
                style="padding: 16px;">
                <td><p style="color: transparent">-</p></td>
              </tr>
            {/if}

            <!-- [ℹ] widget-team-standing-row-table-standings [DESKTOP]
            -->
            {#each STANDINGS_DATA.seasons as season}
              {#if season.season_id === $session.selectedSeasonID}
                {#each season[selectedOpt] as team}
                  <StandingsTeamRow TEAM_DATA={team} TABLEMOBILEVIEW={selectedOptTableMobile} />
                {/each}
              {/if}
            {/each}

          </table>

          <!-- [ℹ] widget-sportbook-details-table-standings [DESKTOP]
          -->
          <div
            id="standings-sportbook-details"
            class="m-t-20">

            {#if data}

              <div
                id='button-extra-info-container'>

                <div
                  id="betting-site-container"
                  class="row-space-start m-r-16">

                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_standings"
                    on:click={() => triggerGoggleEvents("betting_site_logo_standings")}
                    href={data.register_link}
                    target="_blank"
                    style="width: inherit;">
                    <img 
                      id='sportbook-logo-img'
                      src={data.image}
                      alt={data.title}
                    />
                  </a>

                  <button 
                    class="place-bet-btn btn-primary"
                    aria-label="toggleCTA"
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
                      aria-label="betting_site_logo_standings"
                      on:click={() => triggerGoggleEvents("betting_site_logo_standings")}
                      href={data.register_link}
                      style="width: inherit;">
                      <img
                        style="background-color: var({imageVar});"
                        class="extra-info-img"
                        src={data.image}
                        alt={data.title}
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
                        {data.bonus_description}
                      </p>
                      <!--  [ℹ] button_cta 
                      -->
                      <a 
                        rel="nofollow" 
                        aria-label="cta_button_standings"
                        on:click={() => triggerGoggleEvents("cta_button_standings")}
                        href={data.register_link}
                        target="_blank">
                        <button
                          class="btn-primary btn-cta"
                          aria-label="registerCTA"
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
                        {data.information}
                      </p>
                    </div>
                    
                  </div>
                {/if}

              </div>

            {/if}

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
  COMPONENT STYLE
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

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
  }
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  #standings-table-container {
    /* display: grid; */
    padding: 0;
    padding-bottom: 20px;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    /* overflow: hidden; */
    position: relative;
  }

  div#standings-view-box {
    padding: 20px;
    padding-bottom: 0;
    width: -webkit-fill-available;
  } div.stand-view-opt-box {
    border: 1px solid #CCCCCC;
    padding: 10px 30px;
    width: inherit;
    text-align: center;
  } div.stand-view-opt-box.activeOpt {
    border: 1px solid #F5620F;
  } div.stand-view-opt-box.activeOpt p{
    color: #F5620F !important;
  }  div.stand-view-opt-box:hover p {
    color: #292929 !important;
  } div.stand-view-opt-box:first-child {
    border-radius: 8px 0px 0px 8px;
  } div.stand-view-opt-box:last-child {
    border-radius: 0px 8px 8px 0px;
  }

  /* old - table approach */
  div#top-row-standings-head {
    background-color: #f2f2f2;
    border-radius: 2px;
    padding: 7px 9px 7px 9px;
    margin: 20px 20px 20px 20px;
    width: auto;
  }

  /* new - table approach */
	table.standings_table {
		text-align: left;
		border-collapse: collapse;
		width: 100%;
    /* extra */
    margin-bottom: 20px;
    width: -webkit-fill-available;
	}	table.standings_table .row-head {
		background: #f2f2f2;
		border-radius: 2px;
	} table.standings_table .row-head th {
		/* padding: 7px 12px; */
		padding: 7px 5px;
		vertical-align: middle;
		border: none !important;
    text-align: center;
    position: relative;
	} table.standings_table .row-head th p {
    /* width: 10px; */
    /* width: fit-content; */
  } table.standings_table .row-head th:first-child {
    padding-left: 20px;
    text-align: left;
  } table.standings_table .row-head th:last-child {
    padding-right: 20px;
    text-align: right;
  } table.standings_table .row-head .tooltip-extra-info {
    visibility: hidden;
    position: absolute;
    background: #4B4B4B;
    border-radius: 4px;
    padding: 9px 12px;
    bottom: 80%;
    /* margin-left: -80px; */
    left: 50%;
   -webkit-transform: translateX(-50%); /* Safari iOS */
   transform: translateX(-50%);
  } table.standings_table .row-head th:hover .tooltip-extra-info  {
    visibility: visible !important;
  }
  
  div#betting-site-container {
    width: 100%;
  } div#betting-site-container img#sportbook-logo-img {
    width: 100%;
    height: 40px;
    object-fit: none;
    border-radius: 8px;
    background-color: var(--league-info-bookmaker-bg-);
    object-position: left;
  } div#betting-site-container button.place-bet-btn {
    height: 40px;
		/* width: 120px; */ 
    min-width: 120px;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
    margin-left: -12.5px;
  }

  #button-extra-info-container {
    position: relative;
    margin: 0 20px 0 20px;
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

  div#mobile-table-box {
    padding: 12px;
    background: #F2F2F2;
    border-radius: 48px;
    margin: 0 20px 12px 20px;
    width: auto;
  } div#mobile-table-box button.table-nav-btn {
    border-radius: 50%;
    background: #4B4B4B;
    width: 32px;
    height: 32px;
    padding: 6px;
  } div#mobile-table-box button.table-nav-btn:disabled {
    opacity: 0.2;
  }
   

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #standings-table-container {
      min-width: 100%;
      /* max-width: 700px; */
    }

  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {

    table.standings_table {
      margin: 20px;
    } table.standings_table .row-head th:first-child {
      padding-left: 10px;
    } table.standings_table .row-head th:last-child {
      padding-right: 10px;
    }

    div#standings-view-box {
      width: auto;
    } div.stand-view-opt-box {
      width: auto;
      text-align: center;
    }

  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #standings-table-container {
      min-width: 100%;
      /* max-width: 560px; */
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  .dark-background-1 table.standings_table .row-head {
		background-color: #616161 !important;
	} .dark-background-1 table.standings_table .row-head.table_1 {
    /* border-bottom: 16px solid transparent; */
  }

  .dark-background-1 div.stand-view-opt-box:hover p {
    color: white !important;
  }

  .dark-background-1 div#mobile-table-box {
    background: #616161;
  } .dark-background-1 div#mobile-table-box button.table-nav-btn {
    background: #A8A8A8;
  } .dark-background-1 div#mobile-table-box p {
    color: white;
  }

  .dark-background-1 table.standings_table .row-head .tooltip-extra-info {
    background: #616161;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  }

</style>
