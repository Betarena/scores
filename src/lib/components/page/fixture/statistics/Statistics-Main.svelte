<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser, dev } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import {
		dlog, dlogv2, log_info_group,
		STS_W_F_STY, STS_W_F_TAG, STS_W_F_TOG
	} from '$lib/utils/debug';
	import { onDestroy, onMount } from 'svelte';

	import { db_real } from '$lib/firebase/init';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import {
		onValue,
		ref,
		type Unsubscribe
	} from 'firebase/database';

	import type { FIREBASE_livescores_now } from '$lib/models/firebase';

	import type {
		REDIS_CACHE_SINGLE_statistics_data,
		REDIS_CACHE_SINGLE_statistics_translation
	} from '$lib/models/fixtures/statistics/types';

	import StatisticsLoader from './Statistics-Loader.svelte';
	import StatisticsRow from './Statistics-Row.svelte';

	import { getTargetRealDbData } from '$lib/firebase/firebase.actions.js';
	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_STATISTICS: REDIS_CACHE_SINGLE_statistics_data;
	export let FIXTURE_STATISTICS_TRANSLATION: REDIS_CACHE_SINGLE_statistics_translation;

	let loaded: boolean = false;
	let refresh: boolean = false;
	let no_widget_data: any = false;
	let show_placeholder: boolean = false;
  let null_groups: string[] = [];

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

  //#endregion ➤ [VARIABLES]

	let tabletView = 1000;
	let mobileView = 725;
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
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
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
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
			}
		);
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// [ADD-ON] FIREBASE
	// ~~~~~~~~~~~~~~~~~~~~~

	async function check_live_fixtures(
		data: [string, FIREBASE_livescores_now][]
	) {
		// [🐞]
		const logs_name =
			STS_W_F_TAG + ' check_live_fixtures';
		const logs: string[] = [];
		logs.push(`checking livescores_now`);

		// [ℹ] generate FIREBASE fixtures-map
		for (const live_fixture of data) {
			const fixture_id = parseInt(
				live_fixture[0].toString()
			);
			const fixture_data = live_fixture[1];
			live_fixtures_map.set(
				fixture_id,
				fixture_data
			);
		}

		// [ℹ] validate against [this] fixture_id
		const fixture_id = FIXTURE_STATISTICS?.id;

		if (live_fixtures_map.has(fixture_id)) {
			// [🐞]
			logs.push(
				`fixture ${fixture_id} livescore_now exists!`
			);
			// [ℹ] update fixture data;
			FIXTURE_STATISTICS.status =
				live_fixtures_map.get(
					fixture_id
				)?.time?.status;
			// FIXME: make compatible TYPES for hasura/stats && firebase/stats
			FIXTURE_STATISTICS.stats =
				live_fixtures_map.get(
					fixture_id
				)?.stats?.data;

			// [ℹ] reactiveity on-set main
			FIXTURE_STATISTICS = FIXTURE_STATISTICS;
		}

		// TODO: lazy_load_data_check = true

		// [🐞]
		if (dev) log_info_group(logs_name, logs);
	}

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

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

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
	id="widget-outer"
	class:display-none={no_widget_data &&
		!show_placeholder}
>

	<!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
	{#if no_widget_data && loaded && show_placeholder}
		<h2
			class="s-20 m-b-10 w-500 color-black-2"
			style="margin-top: 0px;"
			class:color-white={$userBetarenaSettings.theme ==
				'Dark'}
		>
			{FIXTURE_STATISTICS_TRANSLATION?.title}
		</h2>

		<!-- [ℹ] no-widget-data-avaiable-placeholder container 
    -->
		<div
			id="no-widget-box"
			class="column-space-center"
			class:dark-background-1={$userBetarenaSettings.theme ==
				'Dark'}
		>
			<!-- 
      [ℹ] no-visual-asset
      -->
			{#if $userBetarenaSettings.theme == 'Dark'}
				<img
					src={no_visual_dark}
					alt="no_visual_dark"
					width="32px"
					height="32px"
					class="m-b-16"
				/>
			{:else}
				<img
					src={no_visual}
					alt="no_visual"
					width="32px"
					height="32px"
					class="m-b-16"
				/>
			{/if}

			<!-- 
      [ℹ] container w/ text 
      -->
			<div>
				<p
					class="s-14 m-b-8 w-500"
					class:color-white={$userBetarenaSettings.theme ==
						'Dark'}
				>
					{FIXTURE_STATISTICS_TRANSLATION?.no_info}
				</p>
				<p class="s-14 color-grey w-400">
					{FIXTURE_STATISTICS_TRANSLATION?.no_info_desc}
				</p>
			</div>
		</div>
	{/if}

	<!-- 
  [ℹ] MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}
		<!-- <StatisticsLoader /> -->

		<!-- 
    [ℹ] promise is pending 
    -->
		{#await widget_init()}
			<StatisticsLoader />
			<!-- 
    [ℹ] promise was fulfilled
    -->
		{:then data}
			<h2
				class="s-20 m-b-10 w-500 color-black-2"
				style="margin-top: 0px;"
				class:color-white={$userBetarenaSettings.theme ==
					'Dark'}
			>
				{FIXTURE_STATISTICS_TRANSLATION?.title}
			</h2>

			<div
				id="statistics-widget-container"
				class:dark-background-1={$userBetarenaSettings.theme ==
					'Dark'}
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
					<img
						src={FIXTURE_STATISTICS?.home
							?.team_logo}
						alt="default alt text"
						width="24px"
						height="24px"
					/>

					<!-- 
          [ℹ] away team -->
					<img
						src={FIXTURE_STATISTICS?.away
							?.team_logo}
						alt="default alt text"
						width="24px"
						height="24px"
					/>
				</div>

				<!-- 
        [ℹ] statistics table -->
				<div id="statistics-box">
					{#if FIXTURE_STATISTICS?.stats && FIXTURE_STATISTICS?.stats.length == 2}
						<!-- 
            [ℹ] shots-section 
            [ℹ] passes-section
            [ℹ] attacks-section 
            [ℹ] other-stats-section -->
						{#each stats_menu as item}
							<!-- 
              [ℹ] group-statistics-name -->
							{#if !null_groups.includes(item.key)}
								<p
									class="
                    w-500
                    color-black-2
                    text-group-stats
                  "
								>
									{FIXTURE_STATISTICS_TRANSLATION[
										item.key
									]}
								</p>
							{/if}
							<!-- 
              [ℹ] group-statistics-data -->
							{#each item.loc_arr as sub_nav, i}
								{#if item.key == 'shots_title' && FIXTURE_STATISTICS?.stats[0]?.shots && FIXTURE_STATISTICS?.stats[1]?.shots}
									<StatisticsRow
										TEAM_HOME_STAT={FIXTURE_STATISTICS
											?.stats[0]?.shots[sub_nav]}
										TEAM_AWAY_STAT={FIXTURE_STATISTICS
											?.stats[1]?.shots[sub_nav]}
										STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[
											sub_nav
										]}
										OPT={sub_nav}
									/>
								{/if}

								{#if item.key == 'passes_title' && FIXTURE_STATISTICS?.stats[0]?.passes && FIXTURE_STATISTICS?.stats[1]?.passes}
									<StatisticsRow
										TEAM_HOME_STAT={FIXTURE_STATISTICS
											?.stats[0]?.passes[sub_nav]}
										TEAM_AWAY_STAT={FIXTURE_STATISTICS
											?.stats[1]?.passes[sub_nav]}
										STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[
											sub_nav
										]}
										OPT={sub_nav}
									/>
								{/if}

								{#if item.key == 'attacks_title' && FIXTURE_STATISTICS?.stats[0]?.attacks && FIXTURE_STATISTICS?.stats[1]?.attacks}
									<StatisticsRow
										TEAM_HOME_STAT={FIXTURE_STATISTICS
											?.stats[0]?.attacks[
											sub_nav
										]}
										TEAM_AWAY_STAT={FIXTURE_STATISTICS
											?.stats[1]?.attacks[
											sub_nav
										]}
										STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[
											sub_nav
										]}
										OPT={sub_nav}
									/>
								{/if}

								{#if item.key == 'other' && FIXTURE_STATISTICS?.stats[0][sub_nav] && FIXTURE_STATISTICS?.stats[1][sub_nav]}
									<StatisticsRow
										TEAM_HOME_STAT={FIXTURE_STATISTICS
											?.stats[0][sub_nav]}
										TEAM_AWAY_STAT={FIXTURE_STATISTICS
											?.stats[1][sub_nav]}
										STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[
											sub_nav
										]}
										OPT={sub_nav}
									/>
								{/if}
							{/each}
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
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* [ℹ] NO DATA WIDGET STYLE / CSS */

	#no-widget-box {
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		text-align: center;
	}

	/*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] NOTE: [MOBILE-FIRST]
  */

	/* 
  lineups-main 
  */
	div#statistics-widget-container {
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

	/* 
  team info box 
  */
	div#statistics-widget-container
		div#team-info-box {
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
