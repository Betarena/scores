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
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import StatisticsRow from './Statistics-Row.svelte';

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

	let noWidgetData: any = false;
  let null_groups: string[] = [];

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

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description 
   * listens to target "noWidgetData" change;
  */
  $: if_R_0 =
    browser 
    && FIXTURE_STATISTICS
    && ['NS', 'TBA', 'POSTP'].includes(FIXTURE_STATISTICS?.status)
    && (FIXTURE_STATISTICS?.stats == undefined ||	FIXTURE_STATISTICS?.stats?.length == 0)
  ;
  $: if (if_R_0)
  {
		noWidgetData = true;
  }

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description 
   * listens to target "title" data change;
  */
  $: if_R_1 =
    browser 
    && FIXTURE_STATISTICS
  ;
  $: if (if_R_1)
  {
		null_groups = [];

		// check for "stats.shots" EMPTY
    const if_M_0 = 
      FIXTURE_STATISTICS?.stats?.[0]?.shots == null 
			&& FIXTURE_STATISTICS?.stats?.[1]?.shots == null
    ;
		if (if_M_0) null_groups.push('shots_title');

		// check for "stats.passes" EMPTY
    const if_M_1 = 
      FIXTURE_STATISTICS?.stats?.[0]?.passes == null 
			&& FIXTURE_STATISTICS?.stats?.[1]?.passes == null
    ;
		if (if_M_1) null_groups.push('passes_title');

		// check for "stats.attacks" EMPTY
    const if_M_2 = 
      FIXTURE_STATISTICS?.stats?.[0]?.attacks == null 
			&& FIXTURE_STATISTICS?.stats?.[1]?.attacks == null
    ;
		if (if_M_2) null_groups.push('attacks_title');
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
	class:display-none={noWidgetData}
>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData 
      WIDGET_TITLE={FIXTURE_STATISTICS_TRANSLATION?.title}
      NO_DATA_TITLE={FIXTURE_STATISTICS_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_STATISTICS_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_STATISTICS_TRANSLATION?.title}
    />

    <div
      id="fp-stat-main"
      class="widget-component"
      class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
    >

      <!-- 
      TEAMS INFO
      -->
      <div
        id="fp-stat-team-box"
        class="row-space-out"
      >
        <!-- 
        HOME TEAM
        -->
        <img
          src={FIXTURE_STATISTICS?.home?.team_logo}
          alt="default alt text"
          width="24"
          height="24"
        />

        <!-- 
        AWAY TEAM
        -->
        <img
          src={FIXTURE_STATISTICS?.away?.team_logo}
          alt="default alt text"
          width="24"
          height="24"
        />
      </div>

      <!-- 
      STATISTICS TABLE
      -->
      <div
        id="fp-stat-box-info"
      >
        {#if FIXTURE_STATISTICS?.stats && FIXTURE_STATISTICS?.stats?.length == 2}

          <!-- 
          [ℹ] shots-section 
          [ℹ] passes-section
          [ℹ] attacks-section 
          [ℹ] other-stats-section 
          -->
          {#each stats_menu as item}

            <!-- 
            GROUP STATISTIC NAME
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
            GROUP STATISTIC DATA
            -->
            {#each item.loc_arr as sub_nav, i}
              {#if item.key == 'shots_title' && FIXTURE_STATISTICS?.stats?.[0]?.shots && FIXTURE_STATISTICS?.stats?.[1]?.shots}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.shots?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.shots?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}

              {#if item.key == 'passes_title' && FIXTURE_STATISTICS?.stats?.[0]?.passes && FIXTURE_STATISTICS?.stats?.[1]?.passes}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.passes?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.passes?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}

              {#if item.key == 'attacks_title' && FIXTURE_STATISTICS?.stats?.[0]?.attacks && FIXTURE_STATISTICS?.stats?.[1]?.attacks}
                <StatisticsRow
                  TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats?.[0]?.attacks?.[sub_nav]}
                  TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats?.[1]?.attacks?.[sub_nav]}
                  STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION?.[sub_nav]}
                  OPT={sub_nav}
                />
              {/if}

              {#if item.key == 'other' && FIXTURE_STATISTICS?.stats?.[0]?.[sub_nav] && FIXTURE_STATISTICS?.stats?.[1]?.[sub_nav]}
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

	div#fp-stat-main
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		padding: 0 0 20px 0;
	}

	/* 
  team info box 
  */
	div#fp-stat-main div#fp-stat-team-box 
  {
		padding: 20px 20px 0 20px;
		position: absolute;
	}

	/* 
  statistics table box 
  */
	div#fp-stat-main div#fp-stat-box-info p.text-group-stats 
  {
		text-align: center;
		font-size: 16px;
		padding: 20px 0 0 0;
	}
	:global(div#fp-stat-main div#fp-stat-box-info div.stats-row:last-child) 
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
		#fp-stat-main
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
		#fp-stat-main
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
	:global(div#fp-stat-main.dark-background-1 div#fp-stat-box-info div.stats-row) 
  {
		border-bottom: 1px solid #616161;
	}
  
</style>
