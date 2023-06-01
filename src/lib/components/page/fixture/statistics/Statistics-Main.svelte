<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { viewport_change } from '$lib/utils/platform-functions.js';
	
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import StatisticsRow from './Statistics-Row.svelte';

  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_STATISTICS: B_ST_D;
	export let FIXTURE_STATISTICS_TRANSLATION: B_ST_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

  const stats_menu: 
  {
		key:
			| 'shots_title'
			| 'passes_title'
			| 'attacks_title'
			| 'other';
		loc_arr: string[];
		loc_trans: string[];
	}[] = 
  [
		{
			key: 'shots_title',
			loc_arr: [
				'total',
				'ongoal',
				'blocked',
				'offgoal',
				'insidebox',
				'outsidebox'
			],
			loc_trans: [
				'Total',
				'Ongoal',
				'Blocked',
				'Offgoal',
				'Insidebox',
				'Outsidebox'
			]
		},
		{
			key: 'passes_title',
			loc_arr: [
				'total',
				'accurate',
				'percentage'
			],
			loc_trans: [
				'Total',
				'Accurate',
				'Percentage'
			]
		},
		{
			key: 'attacks_title',
			loc_arr: ['attacks', 'dangerous_attacks'],
			loc_trans: ['Attacks', 'Dangerous Attacks']
		},
		{
			key: 'other',
			loc_arr: [
				'possessiontime',
				'fouls',
				'corners',
				'offsides',
				'yellowcards',
				'redcards',
				'yellowredcards',
				'saves',
				'substitutions',
				'goal_kick',
				'goal_attempts',
				'free_kick',
				'throw_in',
				'ball_safe',
				'goals',
				'penalties',
				'injuries'
			],
			loc_trans: [
				'Possession Time',
				'Fouls',
				'Corners',
				'Offsides',
				'Yellow Cards',
				'Red Cards',
				'Yellow Red Cards',
				'Saves',
				'Substitutions',
				'Goal Kicks',
				'Goal Attempts',
				'Free Kicks',
				'Throw-ins',
				'Ball Safe',
				'Goals',
				'Penalties',
				'Injuries'
			]
		}
	];

	let loaded: boolean = false;
	let refresh: boolean = false;
	let no_widget_data: any = false;
	let show_placeholder: boolean = false;
  let null_groups: string[] = [];

  //#endregion ➤ [VARIABLES]

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
		const fixture_id = FIXTURE_STATISTICS?.id;

    const if_M_0 =
      $sessionStore?.livescore_now_fixture_target?.id != fixture_id
    ;
    if (if_M_0) return;

    const liveFixtureData = $sessionStore?.livescore_now_fixture_target;

    // update fixture data w/live;
    FIXTURE_STATISTICS.status = liveFixtureData?.time?.status;
    FIXTURE_STATISTICS.stats = liveFixtureData?.stats?.data;

    // IMPORTANT
    FIXTURE_STATISTICS = FIXTURE_STATISTICS;
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

  // TODO:
  $: if (
		FIXTURE_STATISTICS &&
		browser &&
		['NS', 'TBA', 'POSTP'].includes(
			FIXTURE_STATISTICS?.status
		) &&
		(FIXTURE_STATISTICS?.stats == undefined ||
			FIXTURE_STATISTICS?.stats.length == 0)
	) {
		no_widget_data = true;
		loaded = true;
	} else {
		no_widget_data = false;
	}

  // TODO:
  $: if (FIXTURE_STATISTICS && browser) 
  {
		null_groups = [];

		// [ℹ] check for "stats.shots" EMPTY
		if (
			FIXTURE_STATISTICS?.stats[0]?.shots ==
				null &&
			FIXTURE_STATISTICS?.stats[1]?.shots == null
		) {
			null_groups.push('shots_title');
		}

		// [ℹ] check for "stats.passes" EMPTY
		if (
			FIXTURE_STATISTICS?.stats[0]?.passes ==
				null &&
			FIXTURE_STATISTICS?.stats[1]?.passes == null
		) {
			null_groups.push('passes_title');
		}

		// [ℹ] check for "stats.passes" EMPTY
		if (
			FIXTURE_STATISTICS?.stats[0]?.attacks ==
				null &&
			FIXTURE_STATISTICS?.stats[1]?.attacks ==
				null
		) {
			null_groups.push('attacks_title');
		}
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
      WIDGET_TITLE={FIXTURE_STATISTICS_TRANSLATION?.title}
      NO_DATA_TITLE={FIXTURE_STATISTICS_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_STATISTICS_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_STATISTICS_TRANSLATION?.title}
    />

    <div
      id="statistics-widget-container"
      class="widget-component"
      class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
    >

      <!-- 
      [ℹ] team info 
      -->
      <div
        id="team-info-box"
        class="row-space-out"
      >
        <!-- 
        [ℹ] home team 
        -->
        <img
          src={FIXTURE_STATISTICS?.home?.team_logo}
          alt="default alt text"
          width="24"
          height="24"
        />

        <!-- 
        [ℹ] away team 
        -->
        <img
          src={FIXTURE_STATISTICS?.away?.team_logo}
          alt="default alt text"
          width="24"
          height="24"
        />
      </div>

      <!-- 
      [ℹ] statistics table 
      -->
      <div 
        id="statistics-box"
      >
        {#if FIXTURE_STATISTICS?.stats && FIXTURE_STATISTICS?.stats.length == 2}
          <!-- 
          [ℹ] shots-section 
          [ℹ] passes-section
          [ℹ] attacks-section 
          [ℹ] other-stats-section 
          -->
          {#each stats_menu as item}
            <!-- 
            [ℹ] group-statistics-name 
            -->
            {#if !null_groups.includes(item.key)}
              <p
                class="
                  w-500
                  color-black-2
                  text-group-stats
                "
              >
                {FIXTURE_STATISTICS_TRANSLATION?.[item?.key]}
              </p>
            {/if}

            <!-- 
            [ℹ] group-statistics-data 
            -->
            {#each item.loc_arr as sub_nav, i}
              {#if item.key == 'shots_title' && FIXTURE_STATISTICS?.stats[0]?.shots && FIXTURE_STATISTICS?.stats[1]?.shots}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.shots?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.shots?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}

              {#if item.key == 'passes_title' && FIXTURE_STATISTICS?.stats[0]?.passes && FIXTURE_STATISTICS?.stats[1]?.passes}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.passes?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.passes?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}

              {#if item.key == 'attacks_title' && FIXTURE_STATISTICS?.stats[0]?.attacks && FIXTURE_STATISTICS?.stats[1]?.attacks}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.attacks?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.attacks?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}

              {#if item.key == 'other' && FIXTURE_STATISTICS?.stats[0][sub_nav] && FIXTURE_STATISTICS?.stats[1][sub_nav]}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}
            {/each}

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
	div#statistics-widget-container	div#team-info-box 
  {
		padding: 20px 20px 0 20px;
		position: absolute;
	}

	/* 
  statistics table box 
  */
	div#statistics-widget-container	div#statistics-box p.text-group-stats 
  {
		text-align: center;
		font-size: 16px;
		padding: 20px 0 0 0;
	}
	:global(div#statistics-widget-container	div#statistics-box div.stats-row:last-child) 
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
		#statistics-widget-container 
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
		#statistics-widget-container 
    {
			min-width: 100%;
		}
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

	/* 
  events table box 
  */
	:global(div#statistics-widget-container.dark-background-1 div#statistics-box div.stats-row) 
  {
		border-bottom: 1px solid #616161;
	}
  
</style>
