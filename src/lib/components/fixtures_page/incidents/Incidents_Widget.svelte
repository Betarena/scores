<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, log_info_group } from "$lib/utils/debug";

  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";
	import { get } from "$lib/api/utils";
	import { get_livescores_now, get_odds } from "$lib/firebase/scoreboard";
	import { onValue, ref, type Unsubscribe } from "firebase/database";
	import { db_real } from "$lib/firebase/init";

	import type { 
    REDIS_CACHE_SINGLE_lineups_data, 
    REDIS_CACHE_SINGLE_lineups_translation 
  } from "$lib/models/fixtures/lineups/types";

	import type { 
    FIREBASE_livescores_now 
  } from "$lib/models/firebase";

	import type {
    REDIS_CACHE_SINGLE_fixtures_page_info_response 
  } from "$lib/models/_main_/pages_and_seo/types";

	import type { 
    EventsDatum 
  } from "$lib/models/hasura";

	import type { 
    REDIS_CACHE_SINGLE_incidents_data, 
    REDIS_CACHE_SINGLE_incidents_translation 
  } from "$lib/models/fixtures/incidents/types";

	import IncidentsLoader from "./Incidents_Loader.svelte";
  import IncidentRow from "./Incident_Row.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // export let FIXTURE_INFO:                 REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_INCIDENTS:                 REDIS_CACHE_SINGLE_incidents_data
  export let FXITURE_INCIDENTS_TRANSLATION:     REDIS_CACHE_SINGLE_incidents_translation

  let loaded:            boolean = false;           // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;           // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;           // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;               // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;

  let show_placeholder:  boolean = false

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | incidents [DEV]";

  // [🐞]
  if (dev) console.log(`FIXTURE_INCIDENTS`, FIXTURE_INCIDENTS)
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_INCIDENTS: ${FIXTURE_INCIDENTS}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] Not In Use
  async function widget_init (
  ): Promise < REDIS_CACHE_SINGLE_lineups_data > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

    loaded = true;

    // [ℹ] data validation check
		if (
      FIXTURE_INCIDENTS == undefined
    ) {
      // [🐞]
      if (dev) logDevGroup (`${dev_console_tag}`, `❌ no data available!`)
      no_widget_data = true;
			return;
		}
    // [ℹ] otherwise, no data
    else {
      no_widget_data = false;
    }

    FIXTURE_INCIDENTS = FIXTURE_INCIDENTS

    return FIXTURE_INCIDENTS;
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
    refresh = true
    loaded = false
    no_widget_data = false
    // widget_init()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widget_init()
  })

  // ~~~~~~~~~~~~~~~~~~~~~
  // [ADD-ON] FIREBASE
  // ~~~~~~~~~~~~~~~~~~~~~

  let real_time_unsubscribe: Unsubscribe[] = []
  const live_fixtures_map = new Map<number, FIREBASE_livescores_now>();

  async function check_live_fixtures (
    data: [string, FIREBASE_livescores_now][]
  ) {
    // [🐞]
    const logs_name = dev_console_tag + " check_live_fixtures";
    const logs: string[] = []
    logs.push(`checking livescores_now`)

    // [ℹ] generate FIREBASE fixtures-map
    for (const live_fixture of data) {
      const fixture_id = parseInt(live_fixture[0].toString())
      const fixture_data = live_fixture[1]
      live_fixtures_map.set(fixture_id, fixture_data)
    }

    // [ℹ] validate against [this] fixture_id
    const fixture_id = FIXTURE_INCIDENTS?.id;

    if (live_fixtures_map.has(fixture_id)) {
      // [🐞]
      logs.push(`fixture ${fixture_id} livescore_now exists!`)
      // [ℹ] update fixture data;
      FIXTURE_INCIDENTS.status = live_fixtures_map.get(fixture_id)?.time?.status
      FIXTURE_INCIDENTS.score_post = {
        ht_score: live_fixtures_map.get(fixture_id)?.scores?.ht_score,
        ft_score: live_fixtures_map.get(fixture_id)?.scores?.ft_score,
        et_score: live_fixtures_map.get(fixture_id)?.scores?.et_score,
        ps_score: live_fixtures_map.get(fixture_id)?.scores?.ps_score
      }
      // FIXME: make compatible TYPES for hasura/events && firebase/events
      FIXTURE_INCIDENTS.events = live_fixtures_map.get(fixture_id)?.events?.data
      if (FIXTURE_INCIDENTS.events != undefined && FIXTURE_INCIDENTS.events.length != 0) {
        FIXTURE_INCIDENTS.events.sort((a, b) => parseFloat(b.minute.toString()) - parseFloat(a.minute.toString()));
      }

      // [ℹ] reactiveity on-set main
      FIXTURE_INCIDENTS = FIXTURE_INCIDENTS
    }

    // TODO: lazy_load_data_check = true

    // [🐞]
    if (dev) log_info_group(logs_name, logs)
  }

	async function listen_real_time_livescores_now (
  ): Promise < void > {

    const fixture_status = FIXTURE_INCIDENTS?.status;
    if (["FT", "FT_PEN"].includes(fixture_status)) {
      return
    }

    // [🐞]
    if (dev) console.log("%cTriggered livescore_now listen", 'background: green; color: #fffff');

    const fixtureRef = ref (
      db_real,
      'livescores_now/'
    );

    const listen_livescore_event_ref = onValue(fixtureRef, (snapshot) => {
      // [ℹ] break-down-values
      if (snapshot.val() != null) {
        const data: [string, FIREBASE_livescores_now][] = Object.entries(snapshot.val())
        check_live_fixtures(data);
      }
    });

    real_time_unsubscribe.push(listen_livescore_event_ref);
  }

  // [ℹ] one-off real-time "read" init.
  onMount(async() => {
    const firebase_real_time = await get_livescores_now()
    if (firebase_real_time != null) {
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      check_live_fixtures(data)
    }
  })
  
  // [ℹ] real-time listen-events init.
  onMount(async() => {
    listen_real_time_livescores_now();
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        listen_real_time_livescores_now()
      }
    });
  })

  // [! CRITICAL !]
  onDestroy(async() => {
    // [🐞]
    if (dev) console.groupCollapsed("%cclosing firebase connections [DEV]", 'background: red; color: #fffff');
    // [ℹ] close LISTEN EVENT connection
    for (const iterator of real_time_unsubscribe) {
      // [🐞]
      if (dev) console.log("closing connection")
      iterator();
    }
    // [🐞]
    if (dev) console.groupEnd();
  })

  // FIXME:
  // async function kickstart_one_off_data (
  // ) {
  //   const firebase_real_time = await get_livescores_now()
  //   if (firebase_real_time != null) {
  //     const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
  //     check_live_fixtures(data)
  //   }
  // }

  // $: if (FIXTURE_INCIDENTS != undefined) {
  //   kickstart_one_off_data()
  // }

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (
    FIXTURE_INCIDENTS
    && browser 
    && (FIXTURE_INCIDENTS?.status == "NS" || FIXTURE_INCIDENTS?.status == "POST")
    && (FIXTURE_INCIDENTS?.events == undefined || FIXTURE_INCIDENTS?.events.length == 0)) {
    no_widget_data = true
    loaded = true
  } else {
    no_widget_data = false
  }

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'
  class:display_none={no_widget_data && !show_placeholder}>

  <!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
  <!-- {#if !loaded} -->
    <div 
      id="seo-widget-box">
      <!-- 
      [ℹ] widget-title -->
      <h2>{FXITURE_INCIDENTS_TRANSLATION?.title}</h2>
      <!-- 
      [ℹ] team-names -->
      <p>{FIXTURE_INCIDENTS?.home?.team_name}</p>
      <p>{FIXTURE_INCIDENTS?.away?.team_name}</p>
    </div>
  <!-- {/if} -->

  <!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if
    no_widget_data && 
    loaded
    && show_placeholder}

    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0px;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {FXITURE_INCIDENTS_TRANSLATION?.title}
    </h2>

    <!-- [ℹ] no-widget-data-avaiable-placeholder container 
    -->
    <div
      id='no-widget-box'
      class='column-space-center'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- 
      [ℹ] no-visual-asset
      -->
      {#if $userBetarenaSettings.theme == 'Dark'}
        <img 
          src={no_visual_dark} 
          alt="no_visual_dark"
          width=32px
          height=32px
          class='m-b-16'
        />
      {:else}
        <img 
          src={no_visual} 
          alt="no_visual"
          width=32px
          height=32px
          class='m-b-16'
        />
      {/if}
      
      <!-- 
      [ℹ] container w/ text 
      -->
      <div>
        <p 
          class='s-14 m-b-8 w-500'
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {FXITURE_INCIDENTS_TRANSLATION?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {FXITURE_INCIDENTS_TRANSLATION?.no_info_desc}
        </p>
      </div>
    </div>
  {/if}

  <!-- 
  [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if
    !no_widget_data &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker}

    <!-- <IncidentsLoader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <IncidentsLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FXITURE_INCIDENTS_TRANSLATION?.title}
      </h2>

      <div
        id="incidents-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] no cross-platform design change
        -->

        <!-- 
        [ℹ] team info -->
        <div
          id="team-info-box"
          class="row-space-out">
          <!-- 
          [ℹ] home team -->
          <div
            class="row-space-start">
            <img 
              src={FIXTURE_INCIDENTS?.home?.team_logo}
              alt=""
              width=24px
              height=24px
            />
            <p
              class="
                color-black-2
                w-400
              ">
              {FIXTURE_INCIDENTS?.home?.team_name}
            </p>
          </div>

          <!-- 
          [ℹ] away team -->
          <div
            class="
              row-space-end
              away-team  
            ">
            <p
              class="
                color-black-2
                w-400
              ">
              {FIXTURE_INCIDENTS?.away?.team_name}
            </p>
            <img 
              src={FIXTURE_INCIDENTS?.away?.team_logo}
              alt=""
              width=24px
              height=24px
            />
          </div>
        </div>

        <!-- 
        [ℹ] events table -->
        <div
          id="incidents-events-box">

          <!-- 
          [ℹ] PEN SCORE [SECTION]
          -->
          {#if FIXTURE_INCIDENTS?.score_post?.ps_score != undefined}
            <p
              class="
                w-500
                color-black-2
                event-milestone-text
              ">
                PEN {FIXTURE_INCIDENTS?.score_post?.ps_score}
            </p>
          {/if}
          {#if FIXTURE_INCIDENTS?.events}
            {#each FIXTURE_INCIDENTS?.events as event}
              {#if ["pen_shootout_miss", "pen_shootout_goal"].includes(event?.type)}
                <!-- 
                [ℹ] home team
                -->
                {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                  <IncidentRow 
                    INCIDENT_INFO={event} 
                    {FXITURE_INCIDENTS_TRANSLATION} 
                    STATUS={FIXTURE_INCIDENTS?.status} 
                    TYPE='L' 
                  />
                <!-- 
                [ℹ] away team
                -->
                {:else}
                  <IncidentRow 
                    INCIDENT_INFO={event} 
                    {FXITURE_INCIDENTS_TRANSLATION} 
                    STATUS={FIXTURE_INCIDENTS?.status} 
                    TYPE='R' 
                  />
                {/if}
              {/if}
            {/each}
          {/if}

          <!-- 
          [ℹ] ET SCORE [SECTION]
          -->
          {#if FIXTURE_INCIDENTS?.score_post?.et_score != undefined}
            <p
              class="
                w-500
                color-black-2
                event-milestone-text
              ">
                ET {FIXTURE_INCIDENTS?.score_post?.et_score}
            </p>
          {/if}
          {#if FIXTURE_INCIDENTS?.events}
            {#each FIXTURE_INCIDENTS?.events as event}
              {#if event?.minute > 90}
                <!-- 
                [ℹ] home team
                -->
                {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                  <IncidentRow INCIDENT_INFO={event} {FXITURE_INCIDENTS_TRANSLATION} STATUS={FIXTURE_INCIDENTS?.status} TYPE='L' />
                <!-- 
                [ℹ] away team
                -->
                {:else}
                  <IncidentRow INCIDENT_INFO={event} {FXITURE_INCIDENTS_TRANSLATION} STATUS={FIXTURE_INCIDENTS?.status} TYPE='R' />
                {/if}
              {/if}
            {/each}
          {/if}

          <!-- 
          [ℹ] FT SCORE [SECTION]
          -->
          {#if FIXTURE_INCIDENTS?.score_post?.ft_score != undefined}
            <p
              class="
                w-500
                color-black-2
                event-milestone-text
              ">
                FT {FIXTURE_INCIDENTS?.score_post?.ft_score}
            </p>
          {/if}
          {#if FIXTURE_INCIDENTS?.events}
            {#each FIXTURE_INCIDENTS?.events as event}
              {#if event?.minute > 45 && event?.minute <= 90}
                <!-- 
                [ℹ] home team
                -->
                {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                  <IncidentRow INCIDENT_INFO={event} {FXITURE_INCIDENTS_TRANSLATION} STATUS={FIXTURE_INCIDENTS?.status} TYPE='L' />
                <!-- 
                [ℹ] away team
                -->
                {:else}
                  <IncidentRow INCIDENT_INFO={event} {FXITURE_INCIDENTS_TRANSLATION} STATUS={FIXTURE_INCIDENTS?.status} TYPE='R' />
                {/if}
              {/if}
            {/each}
          {/if}
          
          <!-- 
          [ℹ] HT SCORE [SECTION]
          -->
          {#if FIXTURE_INCIDENTS?.score_post?.ht_score != undefined}
            <p
              class="
                w-500
                color-black-2
                event-milestone-text
              ">
                HT {FIXTURE_INCIDENTS?.score_post?.ht_score}
            </p>
          {/if}
          {#if FIXTURE_INCIDENTS?.events}
            {#each FIXTURE_INCIDENTS?.events as event}
              {#if event?.minute <= 45
                && !["pen_shootout_miss", "pen_shootout_goal"].includes(event?.type)}
                <!-- 
                [ℹ] home team
                -->
                {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                  <IncidentRow INCIDENT_INFO={event} {FXITURE_INCIDENTS_TRANSLATION} STATUS={FIXTURE_INCIDENTS?.status} TYPE='L' />
                <!-- 
                [ℹ] away team
                -->
                {:else}
                  <IncidentRow INCIDENT_INFO={event} {FXITURE_INCIDENTS_TRANSLATION} STATUS={FIXTURE_INCIDENTS?.status} TYPE='R' />
                {/if}
              {/if}
            {/each}
          {/if}
        </div>

      </div>

    <!-- 
    [ℹ] promise was rejected
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

  /* [ℹ] OTHER STYLE / CSS */

  .display_none {
    display: none;
  }

  /* [ℹ] SEO WIDGET DATA */
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  /* [ℹ] NO DATA WIDGET STYLE / CSS */

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
  }

  /*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] NOTE: [MOBILE-FIRST]
  */

  /* lineups-main */
  div#incidents-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: none;
    /* override */
    padding-bottom: 20px;
  }

  /* team info box */
  div#team-info-box {
    padding: 20px 20px 0 20px;
  } div#team-info-box p {
    font-size: 16px;
    margin-left: 12px;
  } div#team-info-box div.away-team p {
    margin-right: 12px;
    margin-left: 0;
  }

  /* events table box */
  div#incidents-widget-container div#incidents-events-box p.event-milestone-text {
    padding: 14px 0 6px 0;
    text-align: center;
  } :global(div#incidents-widget-container div#incidents-events-box div.incident-row:last-child) {
    border-bottom: 0 !important;
  }

  /* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #incidents-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
    
  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
    /* EMPTY */
  }

  /* 
  DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #incidents-widget-container {
      min-width: 100%;
    }

  }

  /* 
  DESKTOP [L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {
    /* EMPTY */
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  :global(div#incidents-widget-container.dark-background-1 div#incidents-events-box div.incident-row) {
    border-bottom: 1px solid #616161;
  }

</style>
