<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
		
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import IncidentRow from './Incidents-Row.svelte';
	
  import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_INCIDENTS: B_INC_D;
	export let FXITURE_INCIDENTS_TRANSLATION: B_INC_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

	let loaded: boolean = false;
	let refresh: boolean = false;
	let no_widget_data: any = false;
	let show_placeholder: boolean = false;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ handles data generation (first-time)
   * ➨ updating against "live" firebase data;
   * @returns
   * void
  */
	async function injectLiveData
  (
	) 
  {
		const fixture_id = FIXTURE_INCIDENTS?.id;

    const if_M_0 =
      $sessionStore?.livescore_now_fixture_target?.id != fixture_id
    ;
    if (if_M_0) return;

    const liveFixtureData = $sessionStore?.livescore_now_fixture_target;

    // update fixture data w/live;
    FIXTURE_INCIDENTS.status = liveFixtureData?.time?.status;
    FIXTURE_INCIDENTS.score_post = 
    {
      ht_score: liveFixtureData?.scores?.ht_score,
      ft_score: liveFixtureData?.scores?.ft_score,
      et_score: liveFixtureData?.scores?.et_score,
      ps_score: liveFixtureData?.scores?.ps_score
    };
    // FIXME: make compatible TYPES for hasura/events && firebase/events
    FIXTURE_INCIDENTS.events =  liveFixtureData?.events?.data;

    const if_M_1 = 
      FIXTURE_INCIDENTS.events != undefined
      && FIXTURE_INCIDENTS.events.length > 0
    ;
    if (if_M_1) 
    {
      FIXTURE_INCIDENTS.events
      ?.sort
      (
        (
          a,
          b
        ) =>
          parseFloat(b.minute.toString())
          - parseFloat(a.minute.toString())
      );
    }

    // IMPORTANT
    FIXTURE_INCIDENTS = FIXTURE_INCIDENTS;
  }

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  )
  {
    [
      tabletExclusive, 
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  )
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function () 
      {
				resizeAction();
			}
		);
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] 
   * [REACTIVE]
   * @description 
   * listens to target "fixture" in "livescores_now" data;
  */
  $: if ($sessionStore?.livescore_now_fixture_target)
  {
    injectLiveData()
  }

  /**
   * @summary
   * [REACTIVE]
   * @description
   * listens to valid fixture (lineups)
   * when, fixture not started + events are NULL;
   * version 1;
  */
  $: if_R_1 =
    FIXTURE_INCIDENTS 
		&& browser
		&& (FIXTURE_INCIDENTS?.status == 'NS' 
      || FIXTURE_INCIDENTS?.status == 'POST') 
    && (FIXTURE_INCIDENTS?.events == undefined 
      || FIXTURE_INCIDENTS?.events.length == 0)
  ;
  $: if (if_R_1) 
  {
		no_widget_data = true;
		loaded = true;
	} 
  else 
  {
		no_widget_data = false;
	}

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() => 
    {
      resizeAction();
      addEventListeners();
    }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
	id="widget-outer"
	class:display-none={no_widget_data && !show_placeholder}
>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if no_widget_data && loaded && show_placeholder}
    <WidgetNoData 
      WIDGET_TITLE={FXITURE_INCIDENTS_TRANSLATION?.title}
      NO_DATA_TITLE={FXITURE_INCIDENTS_TRANSLATION?.no_info}
      NO_DATA_DESC={FXITURE_INCIDENTS_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}

    <WidgetTitle
      WIDGET_TITLE={FXITURE_INCIDENTS_TRANSLATION?.title}
    />

    <div
      class="widget-component"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!-- 
      [ℹ] [MOBILE] [TABLET] [DESKTOP]
      [ℹ] no cross-platform design change
      -->

      <!-- 
      [ℹ] team info -->
      <div
        id="team-info-box"
        class="row-space-out"
      >
        <!-- 
        [ℹ] home team -->
        <div class="row-space-start">
          <img
            src={FIXTURE_INCIDENTS?.home
              ?.team_logo}
            alt="Team image"
            width="24"
            height="24"
          />
          <p
            class="
              color-black-2
              w-400
            "
          >
            {FIXTURE_INCIDENTS?.home?.team_name}
          </p>
        </div>

        <!-- 
        [ℹ] away team -->
        <div
          class="
            row-space-end
            away-team  
          "
        >
          <p
            class="
              color-black-2
              w-400
            "
          >
            {FIXTURE_INCIDENTS?.away?.team_name}
          </p>
          <img
            src={FIXTURE_INCIDENTS?.away
              ?.team_logo}
            alt="Team image"
            width="24"
            height="24"
          />
        </div>
      </div>

      <!-- 
      [ℹ] events table 
      -->
      <div id="incidents-events-box">
        <!-- 
        [ℹ] PEN SCORE [SECTION]
        -->
        {#if FIXTURE_INCIDENTS?.score_post?.ps_score != undefined}
          <p
            class="
              w-500
              color-black-2
              event-milestone-text
            "
          >
            PEN {FIXTURE_INCIDENTS?.score_post
              ?.ps_score}
          </p>
        {/if}
        {#if FIXTURE_INCIDENTS?.events}
          {#each FIXTURE_INCIDENTS?.events as event}
            {#if ['pen_shootout_miss', 'pen_shootout_goal'].includes(event?.type)}
              <!-- 
              [ℹ] home team
              -->
              {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="L"
                />
                <!-- 
              [ℹ] away team
              -->
              {:else}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="R"
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
            "
          >
            ET {FIXTURE_INCIDENTS?.score_post
              ?.et_score}
          </p>
        {/if}
        {#if FIXTURE_INCIDENTS?.events}
          {#each FIXTURE_INCIDENTS?.events as event}
            {#if event?.minute > 90}
              <!-- 
              [ℹ] home team
              -->
              {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="L"
                />
                <!-- 
              [ℹ] away team
              -->
              {:else}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="R"
                />
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
            "
          >
            FT {FIXTURE_INCIDENTS?.score_post
              ?.ft_score}
          </p>
        {/if}
        {#if FIXTURE_INCIDENTS?.events}
          {#each FIXTURE_INCIDENTS?.events as event}
            {#if event?.minute > 45 && event?.minute <= 90}
              <!-- 
              [ℹ] home team
              -->
              {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="L"
                />
                <!-- 
              [ℹ] away team
              -->
              {:else}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="R"
                />
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
            "
          >
            HT {FIXTURE_INCIDENTS?.score_post
              ?.ht_score}
          </p>
        {/if}
        {#if FIXTURE_INCIDENTS?.events}
          {#each FIXTURE_INCIDENTS?.events as event}
            {#if event?.minute <= 45 && !['pen_shootout_miss', 'pen_shootout_goal'].includes(event?.type)}
              <!-- 
              [ℹ] home team
              -->
              {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="L"
                />
                <!-- 
              [ℹ] away team
              -->
              {:else}
                <IncidentRow
                  INCIDENT_INFO={event}
                  {FXITURE_INCIDENTS_TRANSLATION}
                  STATUS={FIXTURE_INCIDENTS?.status}
                  TYPE="R"
                />
              {/if}
            {/if}
          {/each}
        {/if}
      </div>
    </div>

	{/if}
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* 
  team info box 
  */
	div#team-info-box 
  {
		padding: 20px 20px 0 20px;
	}
	div#team-info-box p 
  {
		font-size: 16px;
		margin-left: 12px;
	}
	div#team-info-box div.away-team p 
  {
		margin-right: 12px;
		margin-left: 0;
	}

	/* 
  events table box 
  */
	div#incidents-widget-container div#incidents-events-box	p.event-milestone-text 
  {
		padding: 14px 0 6px 0;
		text-align: center;
	}
	:global(div#incidents-widget-container div#incidents-events-box	div.incident-row:last-child) 
  {
		border-bottom: 0 !important;
	}

  /*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (min-width: 726px) 
  and (max-width: 1000px) 
  {
		#incidents-widget-container 
    {
			min-width: 100%;
		}
	}

	@media only screen 
  and (min-width: 726px) 
  {
		/* EMPTY */
	}

	@media only screen 
  and (min-width: 1000px) 
  {
		/* EMPTY */
	}

	@media only screen 
  and (min-width: 1160px) 
  {
		/* EMPTY */
	}

  /*
  =============
  DARK-THEME
  =============
  */

	:global(div#incidents-widget-container.dark-background-1 div#incidents-events-box	div.incident-row) 
  {
		border-bottom: 1px solid #616161;
	}

</style>
