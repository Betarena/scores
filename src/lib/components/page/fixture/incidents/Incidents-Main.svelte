<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';
	import { FIXTURE_NOT_START_OPT } from '@betarena/scores-lib/dist/api/sportmonks.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import IncidentRow from './Incidents-Row.svelte';

  import type { B_H_SFPV2 } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_INCIDENTS: B_INC_D;
	export let FXITURE_INCIDENTS_TRANSLATION: B_INC_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;

	let mobileExclusive = false;
  let tabletExclusive = false;

	let noWidgetData: any = false;
  let playerMap: Map < number, B_H_SFPV2 > =
    FIXTURE_INCIDENTS?.players == undefined
      ? new Map < number, B_H_SFPV2 >()
      : new Map(FIXTURE_INCIDENTS?.players)
  ;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ handles player data generation (first-time)
   * ➨ updating against "live" firebase data;
   * @returns
   * void
  */
	async function injectLiveData
  (
  ): Promise < void >
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
    FIXTURE_INCIDENTS.events =  liveFixtureData?.events?.data;

    const FIREBASE_PLAYERS_DATA = liveFixtureData?.custom_mod?.players_v3;

    const if_M_1 =
      FIREBASE_PLAYERS_DATA != undefined
    ;
    if (if_M_1)
    {
      let dataKeyValList: [number, B_H_SFPV2][] = [];
      for (const [key, value] of Object.entries(FIREBASE_PLAYERS_DATA))
      {
        dataKeyValList.push
        (
          [parseInt(key), value]
        )
      }

      playerMap = new Map
      (
        dataKeyValList
      ) as Map <number, B_H_SFPV2>;
    }

    const if_M_2 =
      FIXTURE_INCIDENTS.events != undefined
      && FIXTURE_INCIDENTS.events.length > 0
    ;
    if (if_M_2)
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
  ): void
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
  ): void
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
    FIXTURE_NOT_START_OPT.includes(FIXTURE_INCIDENTS?.status)
    || FIXTURE_INCIDENTS?.events?.length == 0
  ;
  $: if_R_1 == true ? noWidgetData = true : noWidgetData = false;

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
	class:display-none={noWidgetData}
>

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={FXITURE_INCIDENTS_TRANSLATION?.title}
      NO_DATA_TITLE={FXITURE_INCIDENTS_TRANSLATION?.no_info}
      NO_DATA_DESC={FXITURE_INCIDENTS_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={FXITURE_INCIDENTS_TRANSLATION?.title}
    />

    <!--
    📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
    -->
    <div
      id="incidents-widget-container"
      class="widget-component"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!--
      TEAM INFO
      -->
      <div
        id="team-info-box"
        class="row-space-out"
      >
        <!--
        HOME TEAM
        -->
        <div class="row-space-start">
          <img
            src={FIXTURE_INCIDENTS?.home?.team_logo}
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
        AWAY TEAM
        -->
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
            src={FIXTURE_INCIDENTS?.away?.team_logo}
            alt="Team image"
            width="24"
            height="24"
          />
        </div>
      </div>


      <!--
      EVENTS DATA
      -->
      <div
        id="incidents-events-box"
      >

        <!--
        PEN SCORE [SECTION]
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
        {#each FIXTURE_INCIDENTS?.events || [] as event}
          {#if ['pen_shootout_miss', 'pen_shootout_goal'].includes(event?.type)}
            <!--
            HOME TEAM
            -->
            {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="L"
                {playerMap}
              />
            <!--
            AWAY TEAM
            -->
            {:else}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="R"
                {playerMap}
              />
            {/if}
          {/if}
        {/each}

        <!--
        ET SCORE [SECTION]
        -->
        {#if FIXTURE_INCIDENTS?.score_post?.et_score != undefined}
          <p
            class="
              w-500
              color-black-2
              event-milestone-text
            "
          >
            ET {FIXTURE_INCIDENTS?.score_post?.et_score}
          </p>
        {/if}
        {#each FIXTURE_INCIDENTS?.events || [] as event}
          {#if event?.minute > 90}
            <!--
            HOME TEAM
            -->
            {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="L"
                {playerMap}
              />
            <!--
            AWAY TEAM
            -->
            {:else}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="R"
                {playerMap}
              />
            {/if}
          {/if}
        {/each}

        <!--
        FT SCORE [SECTION]
        -->
        {#if FIXTURE_INCIDENTS?.score_post?.ft_score != undefined}
          <p
            class="
              w-500
              color-black-2
              event-milestone-text
            "
          >
            FT {FIXTURE_INCIDENTS?.score_post?.ft_score}
          </p>
        {/if}
        {#each FIXTURE_INCIDENTS?.events || [] as event}
          {#if event?.minute > 45 && event?.minute <= 90}
            <!--
            HOME TEAM
            -->
            {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="L"
                {playerMap}
              />
            <!--
            AWAY TEAM
            -->
            {:else}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="R"
                {playerMap}
              />
            {/if}
          {/if}
        {/each}

        <!--
        HT SCORE [SECTION]
        -->
        {#if FIXTURE_INCIDENTS?.score_post?.ht_score != undefined}
          <p
            class="
              w-500
              color-black-2
              event-milestone-text
            "
          >
            HT {FIXTURE_INCIDENTS?.score_post?.ht_score}
          </p>
        {/if}
        {#each FIXTURE_INCIDENTS?.events || [] as event}
          {#if event?.minute <= 45 && !['pen_shootout_miss', 'pen_shootout_goal'].includes(event?.type)}
            <!--
            HOME TEAM
            -->
            {#if parseInt(event.team_id) == FIXTURE_INCIDENTS?.home?.team_id}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="L"
                {playerMap}
              />
            <!--
            AWAY TEAM
            -->
            {:else}
              <IncidentRow
                INCIDENT_INFO={event}
                TYPE="R"
                {playerMap}
              />
            {/if}
          {/if}
        {/each}
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
