<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { getImageBgColor } from '$lib/utils/color_thief';
	import { MONTH_NAMES_ABBRV } from '$lib/utils/dates';
	import { googleEventLog, viewport_change } from '$lib/utils/platform-functions';

  import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import Head2HeadStatsBox from './Head2Head-Stats-Box.svelte';

	import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
	import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_INFO: B_SAP_FP_D;
	export let FIXTURE_H2H: B_H2H_D;
	export let FIXTURE_H2H_TRANSLATION: B_H2H_T;
	export let FIXTURES_ODDS_T: B_FO_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1160;

  let SPORTBOOK_INFO: B_SPT_D;

	let mobileExclusive = false;
  let tabletExclusive = false;

	let loaded: boolean = false;
	let refresh: boolean = false;
	let no_widget_data: any = false;
	let toggleCTA: boolean = false;
	let team1Percent: number = 0;
	let team2Percent: number = 0;
	let show_placeholder: boolean = false;
	let imageVar: string = '--h2h-widget-bookmaker-bg-';

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  async function injectLiveOddsData
  (
  )
  {
		let count = 0;

		for (const m_sportBook of $sessionStore?.sportbook_list || []) 
    {
			const m_sportBookTitle =	m_sportBook?.title;
			for (const firebaseSportbook of $sessionStore?.live_odds_fixture_target || []) 
      {
				const firebase_sportbook_title = firebaseSportbook?.sportbook;
        const if_M_0 =
          m_sportBookTitle.toLowerCase() ==	firebase_sportbook_title.toLowerCase() 
          && firebaseSportbook.markets != null 
          && firebaseSportbook.markets['1X2FT'] !=	null 
          && firebaseSportbook.markets['1X2FT'].data[0].value != null 
          && firebaseSportbook.markets['1X2FT'].data[1].value != null 
          && firebaseSportbook.markets['1X2FT'].data[2].value != null 
          && count != 1
        ;
        if (if_M_0)
        {
					SPORTBOOK_INFO = m_sportBook;

					const imageURL: string = SPORTBOOK_INFO?.image;
					getImageBgColor
          (
            imageURL, 
            imageVar
          );

					count = 1;
				}
			}
		}
  }

	function closeAllDropdowns
  (
  ) 
  {
		toggleCTA = false;
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
   * listens to target "fixture" in "odds" data;
  */
  $: if ($sessionStore?.live_odds_fixture_target)
  {
    injectLiveOddsData()
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

<!-- 
[ℹ] area-outside-for-close 
-->
{#if toggleCTA}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<div
	id="widget-outer"
	class:display-none={no_widget_data && !show_placeholder}
>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if no_widget_data && loaded && show_placeholder}
    <WidgetNoData 
      WIDGET_TITLE={FIXTURE_H2H_TRANSLATION?.widget_title}
      NO_DATA_TITLE={FIXTURE_H2H_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_H2H_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_H2H_TRANSLATION?.widget_title}
    />

    <!-- 
    [ℹ] [MOBILE] [TABLET] [DESKTOP]
    [ℹ] (minimal) cross-platform design change
    -->

    <div
      id="h2h-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!-- 
      [ℹ] last 5 data 'text'
      -->
      <p
        class="
          color-grey
          text-center
          first
        "
      >
        {FIXTURE_H2H_TRANSLATION?.last_5}
      </p>

      <!-- 
      [ℹ] main widget info start row
      -->
      <div
        id="main-widget-info-row"
        class="
          row-space-out
        "
      >
        <!-- 
        [ℹ] TEAM 1 INFO [LOCAL-TEAM]
        -->
        <div
          class="
            row-space-start
            team-box
          "
        >
          <img
            src={FIXTURE_H2H?.teams_data.find(
              ({ team_name }) =>
                team_name ==
                FIXTURE_INFO?.data
                  ?.home_team_name
            ).team_logo}
            alt="{FIXTURE_H2H?.teams_data.find(
              ({ team_name }) =>
                team_name ==
                FIXTURE_INFO?.data
                  ?.home_team_name
            ).team_name} Logo"
            class="team-logo"
          />
          {#if !mobileExclusive}
            <p
              class="
                s-16
                w-500
                color-black-2
              "
            >
              {FIXTURE_H2H?.teams_data.find(
                ({ team_name }) =>
                  team_name ==
                  FIXTURE_INFO?.data
                    ?.home_team_name
              ).team_name}
            </p>
          {/if}
        </div>

        <!-- 
        [ℹ] WIN - DRAW - WIN INFO
        -->
        <div
          class="
            row-space-center
            stat-box-out
          "
        >
          <!-- 
          [ℹ] TEAM 1 WIN
          -->
          <div class="stat-win-box">
            <p
              class="
                w-500
                color-black-2
                main-txt
              "
            >
              {#if FIXTURE_H2H?.teams_data.find(({ team_name }) => team_name == FIXTURE_INFO?.data?.home_team_name).team_id > FIXTURE_H2H?.teams_data.find(({ team_name }) => team_name == FIXTURE_INFO?.data?.away_team_name).team_id}
                {FIXTURE_H2H?.data?.wins_draws
                  ?.team_2}
              {:else}
                {FIXTURE_H2H?.data?.wins_draws
                  ?.team_1}
              {/if}
            </p>
            <p class="color-grey">
              {FIXTURE_H2H_TRANSLATION?.wins}
            </p>
          </div>
          <!-- 
          [ℹ] DRAW(s)
          -->
          <div class="stat-win-box">
            <p
              class="
                w-500
                color-black-2
                main-txt
              "
            >
              {FIXTURE_H2H?.data?.wins_draws
                ?.draws}
            </p>
            <p class="color-grey">
              {FIXTURE_H2H_TRANSLATION?.draws}
            </p>
          </div>
          <!-- 
          [ℹ] TEAM 2 WIN
          -->
          <div class="stat-win-box">
            <p
              class="
                w-500
                color-black-2
                main-txt
              "
            >
              {#if FIXTURE_H2H?.teams_data.find(({ team_name }) => team_name == FIXTURE_INFO?.data?.away_team_name).team_id > FIXTURE_H2H?.teams_data.find(({ team_name }) => team_name == FIXTURE_INFO?.data?.home_team_name).team_id}
                {FIXTURE_H2H?.data?.wins_draws
                  ?.team_2}
              {:else}
                {FIXTURE_H2H?.data?.wins_draws
                  ?.team_1}
              {/if}
            </p>
            <p class="color-grey">
              {FIXTURE_H2H_TRANSLATION?.wins}
            </p>
          </div>
        </div>

        <!-- 
        [ℹ] TEAM 2 INFO [VISITOR-TEAM]
        -->
        <div
          class="
            row-space-end
            team-box
          "
        >
          {#if !mobileExclusive}
            <p
              class="
                s-16
                w-500
                color-black-2
              "
            >
              {FIXTURE_H2H?.teams_data.find(
                ({ team_name }) =>
                  team_name ==
                  FIXTURE_INFO?.data
                    ?.away_team_name
              ).team_name}
            </p>
          {/if}
          <img
            src={FIXTURE_H2H?.teams_data.find(
              ({ team_name }) =>
                team_name ==
                FIXTURE_INFO?.data
                  ?.away_team_name
            ).team_logo}
            alt="{FIXTURE_H2H?.teams_data.find(
              ({ team_name }) =>
                team_name ==
                FIXTURE_INFO?.data
                  ?.away_team_name
            ).team_name} Logo"
            class="team-logo"
          />
        </div>
      </div>

      <!-- 
      [ℹ] widget progress-bar for win-draws-wins info
      -->
      <div
        id="competition-progress-box"
        class="
          row-space-out
        "
      >

        <!-- 
        [ℹ] TEAM 1 PROGRESS BAR
        [ℹ] (+mobile) team-name
        -->
        <div class="progress-box-out">
          {#if mobileExclusive}
            <p
              class="
                s-16
                w-500
                color-black-2
              "
            >
              {FIXTURE_H2H?.teams_data.find(({ team_name }) => team_name ==	FIXTURE_INFO?.data?.home_team_name).team_name}
            </p>
          {/if}
          <div class="team-progress-bar">
            <div
              class:greater_win_ration={team1Percent > team2Percent}
              style="
                width: {team1Percent}%;
              "
            />
          </div>
        </div>
        
        <!-- 
        [ℹ] TEAM 2 PROGRESS BAR
        [ℹ] (+mobile) team-name
        -->
        <div class="progress-box-out">
          {#if mobileExclusive}
            <p
              class="
                s-16
                w-500
                color-black-2
              "
            >
              {FIXTURE_H2H?.teams_data.find(({ team_name }) => team_name ==	FIXTURE_INFO?.data?.away_team_name).team_name}
            </p>
          {/if}
          <div class="team-progress-bar">
            <div
              class:greater_win_ration={team2Percent > team1Percent}
              style="
                width: {team2Percent}%;
              "
            />
          </div>
        </div>

      </div>

      <!-- 
      [ℹ] main widget info stats - bets row
      -->
      <div id="grid-bet-stats">
        <!-- 
        [ℹ] overs-data
        -->
        {#each Object.entries(FIXTURE_H2H?.data?.overs) as [key, value]}
          <Head2HeadStatsBox
            {FIXTURE_H2H_TRANSLATION}
            {key}
            {value}
            {SPORTBOOK_INFO}
            on:google_click={() => googleEventLog('fixtures_football_fixtures_h2h')}
            type={'overs'}
            {imageVar}
          />
        {/each}

        <!-- 
        [ℹ] yellow-cards-data
        -->
        <Head2HeadStatsBox
          {FIXTURE_H2H_TRANSLATION}
          key={FIXTURE_H2H_TRANSLATION?.yellow_cards}
          value={FIXTURE_H2H?.data?.yellow_cards_avg}
          {SPORTBOOK_INFO}
          on:google_click={() => googleEventLog('fixtures_football_fixtures_h2h')}
          type={'ycavg'}
          {imageVar}
        />

        <!-- 
        [ℹ] corners-data
        -->
        <Head2HeadStatsBox
          {FIXTURE_H2H_TRANSLATION}
          key={FIXTURE_H2H_TRANSLATION?.corners}
          value={FIXTURE_H2H?.corner_avg}
          {SPORTBOOK_INFO}
          on:google_click={() => googleEventLog('fixtures_football_fixtures_h2h')}
          type={'corners'}
          {imageVar}
        />

        <!-- 
        [ℹ] btts-data
        -->
        <Head2HeadStatsBox
          {FIXTURE_H2H_TRANSLATION}
          key={FIXTURE_H2H_TRANSLATION?.btts}
          value={FIXTURE_H2H?.data?.btts.btts_count}
          {SPORTBOOK_INFO}
          on:google_click={() => googleEventLog('fixtures_football_fixtures_h2h')}
          type={'btts'}
          {imageVar}
        />
      </div>

      <!-- 
      [ℹ] main widget last 5 fixtures data
      -->
      <div id="list-past-fixtures-box">
        {#each FIXTURE_H2H?.data?.last_5_data as item}
          <a
            href={FIXTURE_H2H?.last_5_data_urls?.find(({ id }) => id == item?.id)?.urls[$sessionStore?.serverLang]}
          >
            <div
              class="
                row-space-out
                past-fixture-row
              "
              class:row-space-out={!mobileExclusive}
              class:column-space-center={mobileExclusive}
            >
              <!-- 
              [ℹ] info on fixture league-round
              -->
              <p
                class="
                  color-grey
                  no-wrap
                  league-text
                "
              >
                <!--
                [ℹ] league text info
                -->
                {#if item?.league != undefined && item?.league?.data?.name != undefined}
                  {item?.league?.data?.name}
                {/if}
                <!--
                [ℹ] round text info
                -->
                {#if item?.round != undefined && item?.round?.data?.name != undefined}
                  - {FIXTURE_H2H_TRANSLATION?.round}
                  {item?.round?.data?.name}
                {/if}
              </p>

              <!-- 
              [ℹ] info on fixture main teams/score
              -->
              <div
                class="
                  row-space-center
                  score-info-box
                "
              >

                <!-- 
                [ℹ] fixture-team_1 text
                -->
                <p
                  class="
                    color-black-2
                    team-text
                    no-wrap
                  "
                class:color-grey={item?.winner_team_id != undefined && item?.winner_team_id != item?.localteam_id}>
                  {#if mobileExclusive}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) =>	team_id == item?.localteam_id)?.team_short}
                  {:else}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) =>	team_id == item?.localteam_id)?.team_name}
                  {/if}
                </p>
                <img
                  src={FIXTURE_H2H?.teams_data?.find(({ team_id }) =>	team_id == item?.localteam_id)?.team_logo}
                  alt="{FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id ==	item?.localteam_id)?.team_logo} Logo"
                  width="24"
                />

                <!-- 
                [ℹ] fixture-score text
                -->
                <p
                  class="
                    w-500
                    color-black-2
                    score-txt
                  "
                >
                  {item?.scores?.localteam_score}
                  -
                  {item?.scores?.visitorteam_score}
                </p>
                <!-- 
                [ℹ] fixture-team_2 text
                -->
                <img
                  src={FIXTURE_H2H?.teams_data?.find(({ team_id }) =>	team_id == item?.visitorteam_id)?.team_logo}
                  alt="{FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id ==	item?.visitorteam_id)?.team_logo} Logo"
                  width="24"
                />
                <p
                  class="
                    color-black-2
                    team-text
                    no-wrap
                  "
                class:color-grey={item?.winner_team_id != undefined && item?.winner_team_id != item?.visitorteam_id}>
                  {#if mobileExclusive}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) =>	team_id == item?.visitorteam_id)?.team_short}
                  {:else}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) =>	team_id == item?.visitorteam_id)?.team_name}
                  {/if}
                </p>
              </div>

              <!-- 
              [ℹ] starting date for fixture
              -->
              <p
                class="
                  color-grey
                  no-wrap
                "
              >
                {FIXTURES_ODDS_T?.months_abbreviation[MONTH_NAMES_ABBRV[new Date(item?.time?.starting_at?.timestamp * 1000).getMonth().toString()]]}
                {new Date(item?.time?.starting_at?.timestamp * 1000).getDate()},
                {new Date(item?.time?.starting_at?.timestamp * 1000).getFullYear()}
              </p>
            </div>
          </a>
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

	#background-area-close 
  {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 998;
	}

	/* widget-main */
	div#h2h-widget-container 
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		/* overflow: hidden; */
		width: 100%;
		/* position: relative; */
		padding: 20px;
	}

	/* 
  first row info
   */
	div#main-widget-info-row 
  {
		margin-top: 16px;
	}
	div#main-widget-info-row img.team-logo 
  {
		width: 44px;
		height: 44px;
	}
	div#main-widget-info-row div.team-box:first-child img.team-logo 
  {
		margin-right: 16px;
	}
	div#main-widget-info-row div.team-box:last-child img.team-logo 
  {
		margin-left: 16px;
	}
	div#main-widget-info-row div.stat-box-out 
  {
		/* empty */
	}
	div#main-widget-info-row div.stat-box-out	div.stat-win-box 
  {
		text-align: center;
	}
	div#main-widget-info-row div.stat-box-out	div.stat-win-box:nth-of-type(2) 
  {
		margin: 0 6px;
	}
	div#main-widget-info-row div.stat-box-out div.stat-win-box p.main-txt 
  {
		font-size: 24px;
	}

	/* 
  competition box 
  */
	div#competition-progress-box 
  {
		margin: 16px -20px 0 -20px;
		width: -webkit-fill-available;
		padding: 0 20px 20px 20px;
		border-bottom: 1px solid #e6e6e6;
	}
	div#competition-progress-box div.progress-box-out 
  {
		width: 100%;
	}
	div#competition-progress-box div.progress-box-out:first-child 
  {
		margin-right: 15px;
	}
	div#competition-progress-box div.progress-box-out	p 
  {
		margin-bottom: 8px;
	}
	div#competition-progress-box div.progress-box-out:last-child p 
  {
		text-align: end;
	}
	div#competition-progress-box div.progress-box-out:first-child div.team-progress-bar 
  {
		margin-right: 12px;
		text-align: -webkit-right;
		text-align: -moz-right;
	}
	div#competition-progress-box div.progress-box-out	div.team-progress-bar
   {
		background: #e6e6e6;
		border-radius: 10px;
		width: 100%;
	}
	div#competition-progress-box div.progress-box-out div.team-progress-bar > div 
  {
		background-color: #ffb904;
		height: 12px;
		border-radius: 10px;
	}

	div#competition-progress-box div.progress-box-out	div.team-progress-bar > div.greater_win_ration {
		background-color: #f5620f !important;
	}

	/* 
  fixture bet info 
  */
	div#grid-bet-stats 
  {
		display: grid;
	}

	/* 
  past-fixture-data
  */
	div#list-past-fixtures-box div.past-fixture-row 
  {
		border-bottom: 1px solid #e6e6e6;
		position: relative;
		width: -webkit-fill-available;
		margin: 0 -20px;
		padding: 16px 20px 16px 20px;
	}
	div#list-past-fixtures-box a:last-child	div.past-fixture-row 
  {
		border: none !important;
		padding-bottom: 0;
	}
	div#list-past-fixtures-box div.past-fixture-row	div.score-info-box 
  {
		margin: 8px 0;
	}
	div#list-past-fixtures-box div.past-fixture-row	div.score-info-box p.score-txt 
  {
		margin: 0 24px;
		font-size: 16px;
	}
	div#list-past-fixtures-box div.past-fixture-row	p.team-text 
  {
		font-size: 16px;
	}
	div#list-past-fixtures-box div.past-fixture-row	p.team-text:first-child 
  {
		margin-right: 12px;
	}
	div#list-past-fixtures-box div.past-fixture-row	p.team-text:last-child 
  {
		margin-left: 12px;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (min-width: 726px) 
  and (max-width: 1160px) 
  {
		
    #h2h-widget-container 
    {
			min-width: 100%;
			/* max-width: 700px; */
		}

	}

	@media only screen 
  and (min-width: 726px) 
  {

		/* 
    first row info 
    */
		div#main-widget-info-row img.team-logo 
    {
			width: 64px;
			height: 64px;
		}
		div#main-widget-info-row div.stat-box-out	div.stat-win-box:nth-of-type(2) 
    {
			margin: 0 44px;
		}
		div#main-widget-info-row div.stat-box-out div.stat-win-box p.main-txt 
    {
			font-size: 32px;
		}

		/* 
    fixture bet info 
    */
		div#grid-bet-stats 
    {
			grid-auto-flow: row;
			grid-gap: 15px;
			margin-top: 20px;
			grid-template-columns: 1fr 1fr;
		}
		div#grid-bet-stats :global(div.bet-info-box) 
    {
			border: 1px solid #e6e6e6;
			border-radius: 8px;
			padding: 12px 20px;
			margin: unset;
		}

		/* 
    past-fixture-data 
    */
		div#list-past-fixtures-box div.past-fixture-row
    {
			padding: 24px 0;
			margin: 0;
		}
		div#list-past-fixtures-box div.past-fixture-row div.score-info-box 
    {
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0);
			width: fit-content;
			margin: unset;
		}
		div#list-past-fixtures-box div.past-fixture-row	p.team-text 
    {
			position: absolute;
			font-size: 16px;
		}
		div#list-past-fixtures-box div.past-fixture-row p.team-text:first-child 
    {
			right: 100%;
			margin-right: 12px;
		}
		div#list-past-fixtures-box div.past-fixture-row	p.team-text:last-child 
    {
			left: 100%;
			margin-left: 12px;
		}

		div#h2h-widget-container.dark-background-1 div#grid-bet-stats	:global(div.bet-info-box) 
    {
			border: 1px solid #616161 !important;
		}
	}

	@media only screen 
  and (min-width: 726px) 
  and (max-width: 865px) 
  {

		/* 
    past-fixture-data 
    */
		div#list-past-fixtures-box div.past-fixture-row 
    {
			padding: 15px 0;
		}
		div#list-past-fixtures-box div.past-fixture-row p.league-text 
    {
			max-width: 100px;
			white-space: pre-wrap !important;
		}

	}

	@media only screen 
  and (min-width: 1160px)
  {

		#h2h-widget-container 
    {
			min-width: 100%;
		}

		/* 
    past-fixture-data 
    */
		div#list-past-fixtures-box div.past-fixture-row div.score-info-box:hover p 
    {
			color: #f5620f !important;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	div#h2h-widget-container.dark-background-1 div#grid-bet-stats	:global(div.bet-info-box) 
  {
		border-bottom: 1px solid #616161 !important;
	}
	div#h2h-widget-container.dark-background-1 div#list-past-fixtures-box	div.past-fixture-row 
  {
		border-bottom: 1px solid #616161;
	}
	div#h2h-widget-container.dark-background-1 div#competition-progress-box 
  {
		border-bottom: 1px solid #616161;
	}
	div#h2h-widget-container.dark-background-1 div#competition-progress-box div.progress-box-out div.team-progress-bar 
  {
		background-color: #616161;
	}
  
</style>
