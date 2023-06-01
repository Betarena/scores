<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

  import { initGrapQLClient } from '$lib/graphql/init';
  import { sessionStore } from '$lib/store/session.js';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { fixtureVote, type fixture } from '$lib/store/vote_fixture';
  import { VO_W_F_STY, VO_W_F_TAG, VO_W_F_TOG, dlog, logErrorGroup } from '$lib/utils/debug';
  import { viewport_change } from '$lib/utils/platform-functions.js';
  import { FIXTURE_NO_VOTES_OPT } from "@betarena/scores-lib/dist/api/sportmonks.js";
  import { HASURA_FIXTURE_VOTES_INIT_UPDATE } from '@betarena/scores-lib/dist/graphql/query.votes.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
  
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_VOT_T, VOT_Fixture } from '@betarena/scores-lib/types/votes.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_INFO: B_SAP_FP_D;
	export let FIXTURE_VOTES_TRANSLATION: B_VOT_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1160;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

  let FIXTURE_VOTES_DATA: VOT_Fixture;

	let loaded: boolean = false;
	let refresh: boolean = false;
	let no_widget_data: any = false;
	let show_placeholder: boolean = false;
	let user_stake_amount: number = 50.0;
	let total_votes: number = undefined;
	let show_bet_site: boolean = false;
	let vote_casted: boolean = false;
	let imageVar: string = '--fixture-votes-bookmaker-bg-';

	let fixture_data_vote_obj: fixture = 
  {
		fixture_id: undefined,
		fixture_vote: undefined,
		fixture_vote_val: undefined,
		_X_vote: undefined,
		_1_vote: undefined,
		_2_vote: undefined
	};

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

	function init_vote
  (
  ) 
  {
		// [ℹ] get target fixture by ID from USER localStorage()
		const result =
			$fixtureVote.fixtureVotes_Array.find(
				(fixture) => {
					return (
						fixture.fixture_id ===
						FIXTURE_INFO?.data?.id
					);
				}
			);
		// [ℹ] if target ID exists, assign to "fixture_data_vote_obj"
		// [ℹ] with show appropiate match-betting site info;
		if (result != undefined) {
			fixture_data_vote_obj = result;
			show_bet_site = true;
			vote_casted = true;
			return;
		}
		// [ℹ] else,
		// [ℹ] declare vote as not been casted
		else {
			fixture_data_vote_obj = {
				fixture_id: undefined,
				fixture_vote: undefined,
				fixture_vote_val: undefined,
				_X_vote: undefined,
				_1_vote: undefined,
				_2_vote: undefined
			};
			show_bet_site = false;
			vote_casted = false;
		}
	}

	function cast_vote
  (
		vote_type: string,
		vote_val: string | number
	): void 
  {
    dlog(`${VO_W_F_TAG} vote_val: ${vote_val}`, VO_W_F_TOG, VO_W_F_STY);

		if (vote_val == undefined) {
			vote_val = '1.5';
		}

		// [ℹ] check vote already casted
		if (!vote_casted) {
			// [ℹ] update the show_bet_site Frame;
			show_bet_site = true;
			// [ℹ] update the VoteMatch on DB;
			fixture_data_vote_obj = {
				fixture_id: FIXTURE_INFO?.data?.id,
				fixture_vote: vote_type,
				fixture_vote_val: vote_val as string,
				_X_vote: 0,
				_1_vote: 0,
				_2_vote: 0
			};
			fixture_data_vote_obj[
				'_' +
					fixture_data_vote_obj.fixture_vote +
					'_vote'
			] = 1;
			execute_vote_submit(fixture_data_vote_obj);
			// [ℹ] update USER localStorage()
			fixtureVote.addToVotes(
				fixture_data_vote_obj
			);
			// [ℹ] set "casted" BOOLEAN
			vote_casted = true;
		}
	}

	async function execute_vote_submit
  (
		fixtureData: fixture
	): Promise < void > 
  {
		const VARIABLES = {
			match_id: fixtureData.fixture_id,
			_1_vote: fixtureData._1_vote,
			_2_vote: fixtureData._2_vote,
			_X_vote: fixtureData._X_vote
		};

    dlog(`${VO_W_F_TAG} variables: ${VARIABLES}`, VO_W_F_TOG, VO_W_F_STY);

		// FIXME: need a try..catch ?
		try {
			// [ℹ] execute GRAPH-QL request;
			const update_fixture_data: BETARENA_HASURA_votes_mutation =
				await initGrapQLClient().request(
					HASURA_FIXTURE_VOTES_INIT_UPDATE,
					VARIABLES
				);

      dlog(`${VO_W_F_TAG} update_fixture_data: ${update_fixture_data}`, VO_W_F_TOG, VO_W_F_STY);

			// [ℹ] update existing data with CASTED-VOTES;
			FIXTURE_VOTES_DATA.match_votes =
				update_fixture_data.update_widget_featured_match_votes_by_pk;
			total_votes =
				FIXTURE_VOTES_DATA?.match_votes
					.vote_draw_x +
				FIXTURE_VOTES_DATA?.match_votes
					.vote_win_local +
				FIXTURE_VOTES_DATA?.match_votes
					.vote_win_visitor;
		} catch (error) {
			if (dev)
				logErrorGroup(
					'featured match',
					`error: ${error}`
				);
		}
	}

  async function injectLiveOddsData
  (
  )
  {
		if (SPORTBOOK_DETAILS_LIST == undefined) 
    {
			return;
		}

		let count = 0;

		for (const main_sportbook of SPORTBOOK_DETAILS_LIST) 
    {
			const main_sportbook_title =	main_sportbook?.title;
			for (const firebase_sportbook of sportbook_list) 
      {
				const firebase_sportbook_title = firebase_sportbook?.sportbook;
        const if_M_0 =
          main_sportbook_title.toLowerCase() ==	firebase_sportbook_title.toLowerCase() 
          && firebase_sportbook.markets['1X2FT'] !=	null 
          && firebase_sportbook.markets != null 
          && firebase_sportbook.markets['1X2FT'].data[0].value != null 
          && firebase_sportbook.markets['1X2FT'].data[1].value != null 
          && firebase_sportbook.markets['1X2FT'].data[2].value != null 
          && count != 1
        ;
        if (if_M_0)
        {
					FIXTURE_VOTES_DATA._1x2 = undefined;
					FIXTURE_VOTES_DATA._1x2 = {
						home: undefined,
						away: undefined,
						draw: undefined
					};
					FIXTURE_VOTES_DATA._1x2.home = firebase_sportbook?.markets?.['1X2FT']?.data[0]?.value?.toFixed(2);
					FIXTURE_VOTES_DATA._1x2.draw = firebase_sportbook?.markets?.['1X2FT']?.data[1]?.value?.toFixed(2);
					FIXTURE_VOTES_DATA._1x2.away = firebase_sportbook?.markets?.['1X2FT']?.data[2]?.value?.toFixed(2);
					SPORTBOOK_INFO = main_sportbook;
					count = 1;
				}
			}
		}

		FIXTURE_VOTES_DATA = FIXTURE_VOTES_DATA;
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

  $: if 
  (
    (FIXTURE_VOTES_DATA?.match_votes != undefined && FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status))
    && (FIXTURE_VOTES_DATA?.match_votes.vote_win_local == 0 && FIXTURE_VOTES_DATA?.match_votes.vote_draw_x == 0 && FIXTURE_VOTES_DATA?.match_votes.vote_win_visitor == 0)
  ) 
  {
    no_widget_data = true;
  }

  $: condition = $fixtureVote.fixtureVotes_Array !=	undefined && loaded;
	$: if (condition) 
  {
		init_vote();
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
  class:display-none={no_widget_data && !show_placeholder}>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if no_widget_data && loaded && show_placeholder}
    <WidgetNoData 
      WIDGET_TITLE={FIXTURE_VOTES_TRANSLATION?.title}
      NO_DATA_TITLE={FIXTURE_VOTES_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_VOTES_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_VOTES_TRANSLATION?.title}
    />

    <!-- 
    [ℹ] [MOBILE] [TABLET] [DESKTOP]
    [ℹ] (minimal) cross-platform design change
    -->

    <div
      id="votes-widget-container" 
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
    
      <!-- 
      [ℹ] voting hint text 
      -->
      {#if !vote_casted && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
        <p
          class="
            w-500 
            large 
            color-primary 
            m-b-12 
            text-center
          "
        >
          {FIXTURE_VOTES_TRANSLATION?.vote}
        </p>
      {/if}

      <!-- 
      [ℹ] voting results btn 
      -->
      <div
        id="btn-vote-container" 
        class="row-space-out"
      >
      
        <!-- 
        [ℹ] ODDS #1 
        -->
        <div
          class="
            odds-vote-box 
            text-center 
            column
          "
        >
          <button
            class="
              row-space-out 
              cast-vote-btn 
              m-b-12
            "
            class:active={fixture_data_vote_obj.fixture_vote == '1'}
            disabled={vote_casted || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            on:click={() => cast_vote('1', FIXTURE_VOTES_DATA._1x2.home)}
          >
            <p
              class="
                  w-500 
                  medium 
                  row-space-out
                "
            >
              {#if mobileExclusive}
                <span class="color-grey"> 1 </span>
              {:else}
                <img src={FIXTURE_VOTES_DATA?.home_team_logo} alt="default alt text" width="28px" height="28px" />
              {/if}
              <span class:active_p={fixture_data_vote_obj.fixture_vote == '1'}>
                {#if FIXTURE_VOTES_DATA._1x2.home}
                  {FIXTURE_VOTES_DATA._1x2.home.toString()}
                {:else}
                  -
                {/if}
              </span>
            </p>
          </button>
          <!-- 
          [ℹ] fixture-probability 
          -->
          {#if !show_bet_site && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                w-400 
                probablitiy-text 
                medium
              "
            >
              {FIXTURE_VOTES_TRANSLATION?.probability}
              {#if mobileExclusive}
                <br />
              {/if}
              {#if FIXTURE_VOTES_DATA?.probabilities?.home != undefined}
                {Math.round(parseFloat(FIXTURE_VOTES_DATA?.probabilities?.home.toString())).toFixed(2)}%
              {:else}
                -
              {/if}
            </p>
          {:else if FIXTURE_VOTES_DATA?.match_votes != undefined || (FIXTURE_VOTES_DATA?.match_votes != undefined && FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status))}
            <p
              class="
                large
              "
            >
              <span
                class="
                  color-dark
                  w-500
                "
              >
                {FIXTURE_VOTES_DATA?.match_votes.vote_win_local == 0 ? 0 : ((FIXTURE_VOTES_DATA?.match_votes.vote_win_local / total_votes) * 100).toFixed(0)}%
              </span>
              <span
                class="
                  color-grey
                  w-400
                "
              >
                ({FIXTURE_VOTES_DATA.match_votes.vote_win_local})
              </span>
            </p>
          {/if}
        </div>

        <!--
        [ℹ] ODDS #X
        -->
        <div
          class="
            odds-vote-box 
            text-center 
            column
          "
        >
          <button
            class="
              row-space-out 
              cast-vote-btn 
              m-b-12
            "
            class:active={fixture_data_vote_obj.fixture_vote == 'X'}
            disabled={vote_casted || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            on:click={() => cast_vote('X', FIXTURE_VOTES_DATA._1x2.draw)}
          >
            <p
              class="
                  w-500 
                  medium 
                  row-space-out
                "
            >
              {#if mobileExclusive}
                <span class="color-grey"> X </span>
              {:else}
                <!-- 
                  src="./static/icon/icon-close.svg"
                  -->
                <img src="/assets/svg/icon/icon-close.svg" alt="default alt text" width="28px" height="28px" />
              {/if}
              <span class:active_p={fixture_data_vote_obj.fixture_vote == 'X'}>
                {#if FIXTURE_VOTES_DATA._1x2.draw}
                  {FIXTURE_VOTES_DATA._1x2.draw.toString()}
                {:else}
                  -
                {/if}
              </span>
            </p>
          </button>
          <!-- 
          [ℹ] fixture-probability 
          -->
          {#if !show_bet_site && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                w-400 
                probablitiy-text 
                medium
              "
            >
              {FIXTURE_VOTES_TRANSLATION?.probability}
              {#if mobileExclusive}
                <br />
              {/if}
              {#if FIXTURE_VOTES_DATA?.probabilities?.draw != undefined}
                {Math.round(parseFloat(FIXTURE_VOTES_DATA?.probabilities?.draw.toString())).toFixed(2)}%
              {:else}
                -
              {/if}
            </p>
          {:else if FIXTURE_VOTES_DATA?.match_votes != undefined || (FIXTURE_VOTES_DATA?.match_votes != undefined && FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status))}
            <p
              class="
                large
              "
            >
              <span
                class="
                  w-500 
                  color-dark
                "
              >
                {FIXTURE_VOTES_DATA.match_votes.vote_draw_x == 0 ? 0 : ((FIXTURE_VOTES_DATA.match_votes.vote_draw_x / total_votes) * 100).toFixed(0)}%
              </span>
              <span
                class="
                  w-400 
                  color-grey
                "
              >
                ({FIXTURE_VOTES_DATA.match_votes.vote_draw_x})
              </span>
            </p>
          {/if}
        </div>

        <!-- 
        [ℹ] ODDS #2 
        -->
        <div
          class="
            odds-vote-box 
            column 
            text-center
          "
        >
          <button
            class="
              row-space-out 
              cast-vote-btn 
              m-b-12
            "
            class:active={fixture_data_vote_obj.fixture_vote == '2'}
            disabled={vote_casted || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            on:click={() => cast_vote('2', FIXTURE_VOTES_DATA._1x2.away)}
          >
            <p
              class="
                w-500 
                medium 
                row-space-out
              "
            >
              {#if mobileExclusive}
                <span class="color-grey"> 2 </span>
              {:else}
                <img src={FIXTURE_VOTES_DATA?.away_team_logo} alt="default alt text" width="28px" height="28px" />
              {/if}
              <span class:active_p={fixture_data_vote_obj.fixture_vote == '2'}>
                {#if FIXTURE_VOTES_DATA._1x2.away}
                  {FIXTURE_VOTES_DATA._1x2.away.toString()}
                {:else}
                  -
                {/if}
              </span>
            </p>
          </button>

          <!-- 
          [ℹ] fixture-probability 
          -->
          {#if !show_bet_site && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                w-400 
                probablitiy-text 
                medium
              "
            >
              {FIXTURE_VOTES_TRANSLATION?.probability}
              {#if mobileExclusive}
                <br />
              {/if}
              {#if FIXTURE_VOTES_DATA?.probabilities?.away != undefined}
                {Math.round(parseFloat(FIXTURE_VOTES_DATA?.probabilities?.away.toString())).toFixed(2)}%
              {:else}
                -
              {/if}
            </p>
          {:else if FIXTURE_VOTES_DATA?.match_votes != undefined || (FIXTURE_VOTES_DATA?.match_votes != undefined && FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status))}
            <p
              class="
                large
              "
            >
              <span
                class="
                  color-dark
                  w-500
                "
              >
                {FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor == 0 ? 0 : ((FIXTURE_VOTES_DATA.match_votes.vote_win_visitor / total_votes) * 100).toFixed(0)}%
              </span>
              <span
                class="
                  color-grey
                  w-400
                "
              >
                ({FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor})
              </span>
            </p>
          {/if}

        </div>

      </div>

      <!-- 
      [ℹ] stakes-site-info-pop-up 
      -->
      {#if show_bet_site}
        <div 
          id="site-bet-box" 
          in:fade
        >

          <img
            src="/assets/svg/icon/white-close.svg"
            alt="default alt text"
            width="16"
            height="16"
            style="position: absolute; top: 12px; right: 20px;"
            on:click={() => (show_bet_site = false)}
          />
          <a
            rel="nofollow"
            aria-label="football_fixtures_voting"
            on:click={() => googleEventLog('football_fixtures_voting')}
            target="_blank"
            href={SPORTBOOK_INFO.register_link}
          >
            <img
              id="stakesSiteImg"
              src={SPORTBOOK_INFO.image}
              alt="default alt text"
              style="background-color: var({imageVar});"
              width="100%"
              height="40px"
            />
          </a>

          <!-- 
          [ℹ] bottom container info
          -->
          <div id="inner-site-container">
            <!-- 
            [ℹ] STAKES DATA 
            -->
            <div
              id="box-row"
              class="
                m-b-20 
                row-space-out
              "
            >
              <!-- 
              [ℹ] Win Type 
              -->
              <div
                class="
                  text-center
                  stakes-info-box
                "
              >
                <!-- 
                [ℹ] type of vote select - text
                -->
                <p
                  class="
                    w-400 
                    medium 
                    m-b-8 
                    color-grey
                  "
                >
                  {#if fixture_data_vote_obj.fixture_vote == '1'}
                    Home win
                  {:else if fixture_data_vote_obj.fixture_vote == 'X'}
                    Draw
                  {:else}
                    Away win
                  {/if}
                </p>

                <!-- 
                [ℹ] box stakes show
                -->
                <div
                  class="
                    input-value 
                    row-space-out 
                    medium 
                    text-center
                  "
                >
                  {#if !mobileExclusive}
                    {#if fixture_data_vote_obj.fixture_vote == '1'}
                      <img src={FIXTURE_VOTES_DATA?.home_team_logo} alt="default alt text" width="28px" height="28px" />
                    {:else if fixture_data_vote_obj.fixture_vote == 'X'}
                      <p
                        class="
                          w-500 
                          medium
                          row-space-out
                        "
                      >
                        <span class="color-grey"> X </span>
                      </p>
                    {:else}
                      <img src={FIXTURE_VOTES_DATA?.away_team_logo} alt="default alt text" width="28px" height="28px" />
                    {/if}
                  {/if}

                  <input
                    id="win-type"
                    class="
                      w-500 
                      medium 
                      text-center 
                      desktop-view-winnings
                    "
                    type="number"
                    bind:value={fixture_data_vote_obj.fixture_vote_val}
                    disabled
                  />
                </div>
              </div>

              <!-- 
              [ℹ] MULTIPLY SIGN 
              -->
              <img
                src="/assets/svg/icon/icon-close.svg"
                alt="multiply-icon"
                width="16px"
                height="16px"
                style="margin-top: 25px;"
              />

              <!-- 
              [ℹ] Stake 
              -->
              <div
                class="
                  text-center
                  stakes-info-box
                "
              >
                <p
                  class="
                    w-400 
                    medium 
                    m-b-8 
                    color-grey
                  "
                >
                  {FIXTURE_VOTES_TRANSLATION?.stake}
                </p>
                <input
                  class="
                    w-500 
                    input-value 
                    medium 
                    text-center
                  "
                  type="text"
                  bind:value={user_stake_amount}
                />
              </div>

              <!-- 
              [ℹ] EQUALS SIGN 
              -->
              <img
                src="/assets/svg/icon/icon-equally.svg"
                alt="icon-equlaity"
                width="16px"
                height="16px"
                style="margin-top: 25px;"
              />

              <!-- 
              [ℹ] Winnings 
              -->
              <div
                class="
                  text-center
                  stakes-info-box
                "
              >
                <p
                  class="
                    w-400 
                    medium 
                    m-b-8 
                    color-grey
                  "
                >
                  {FIXTURE_VOTES_TRANSLATION?.winnings}
                </p>
                <input
                  class="
                    w-500 
                    input-value 
                    medium 
                    text-center
                  "
                  type="number"
                  value={(parseFloat(fixture_data_vote_obj.fixture_vote_val) * user_stake_amount).toFixed(2)}
                  disabled
                />
              </div>

              <!-- 
              [ℹ] PLACE BET BUTTON 
              [ℹ] [DESKTOP]
              -->
              {#if !mobileExclusive && !tabletExclusive}
                <a
                  rel="nofollow"
                  aria-label="football_fixtures_voting"
                  on:click={() => googleEventLog('football_fixtures_voting')}
                  target="_blank"
                  href={SPORTBOOK_INFO.register_link}
                  class="anchor-bet-box"
                >
                  <button
                    class="
                      place-bet-btn 
                      btn-primary
                    "
                  >
                    <p class="small">
                      {FIXTURE_VOTES_TRANSLATION?.bet}
                    </p>
                  </button>
                </a>
              {/if}
            </div>

            <!-- 
            [ℹ] PLACE BET BUTTON 
            [ℹ] [MOBILE] OR [TABLET]
            -->
            {#if mobileExclusive || tabletExclusive}
              <a
                rel="nofollow"
                aria-label="football_fixtures_voting"
                on:click={() => googleEventLog('football_fixtures_voting')}
                target="_blank"
                href={SPORTBOOK_INFO.register_link}
                class="anchor-bet-box"
              >
                <button
                  class="
                    place-bet-btn 
                    btn-primary 
                    m-b-12
                  "
                >
                  <p class="small">
                    {FIXTURE_VOTES_TRANSLATION?.bet}
                  </p>
                </button>
              </a>
            {/if}

            <!-- 
            [ℹ] BETTING SITE INFO 
            -->
            <p
              class="
                small 
                text-center 
                color-grey
              "
            >
              {SPORTBOOK_INFO.information}
            </p>
          </div>
        </div>
      {/if}

    </div>

	{/if}
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* 
  widget-main 
  */
	div#votes-widget-container 
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		padding: 20px;
	}

	/* 
  widget vote container 
  */
	div#votes-widget-container div#btn-vote-container div.odds-vote-box 
  {
		width: 100%;
		margin-right: 20px;
	}
	div#votes-widget-container div#btn-vote-container div.odds-vote-box:last-child 
  {
		margin-right: 0;
	}
	div#votes-widget-container div#btn-vote-container button.cast-vote-btn 
  {
		background: #f2f2f2;
		border: 1px solid #cccccc !important;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 14px 16px;
		transition: all ease 0.15s;
		box-shadow: none !important;
		/* width: 96px; */
		height: 48px;
	}
	div#votes-widget-container div#btn-vote-container button.cast-vote-btn.active 
  {
		background: #ffffff !important;
		border: 1px solid #f5620f !important;
		box-sizing: border-box;
		border-radius: 8px;
		opacity: 1 !important;
	}
	div#votes-widget-container div#btn-vote-container button.cast-vote-btn:disabled 
  {
		opacity: 0.5;
	}
	div#votes-widget-container div#btn-vote-container p.probablitiy-text 
  {
		text-align: center;
		color: #8c8c8c;
		width: min-content;
		white-space: nowrap;
	}
	div#votes-widget-container div#btn-vote-container button.cast-vote-btn .active_p 
  {
		color: #f5620f !important;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button 
  {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] 
  {
		-moz-appearance: textfield;
		border: none;
	}

	/* 
  widget bet site container 
  */
	div#site-bet-box 
  {
		margin-top: 20px;
		background: #f2f2f2;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}
	div#site-bet-box img#stakesSiteImg 
  {
		background-color: var(--featured-match-bookmaker-bg-);
		object-fit: none;
		height: 40px;
	}
	div#site-bet-box div#inner-site-container 
  {
		padding: 20px 12px;
		background: #f2f2f2;
		border-radius: 8px;
	}
	div#site-bet-box div#inner-site-container div#box-row > * 
  {
		margin-right: 4px;
	}
	div#site-bet-box div#inner-site-container div#box-row > *:last-child 
  {
		margin-right: 0;
	}
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box 
  {
		width: 100%;
	}
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input#win-type 
  {
		border-radius: 5px;
		border: 0;
		outline: none;
	}
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value 
  {
		-moz-appearance: textfield;
		background: #ffffff;
		border-radius: 8px;
		height: 48px;
		/* width: 76px; */
		border: none;
	}
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input 
  {
		background: rgb(255, 255, 255);
		color: black !important;
		opacity: 1 !important;
	}
	div#site-bet-box div#inner-site-container a.anchor-bet-box button.place-bet-btn 
  {
		height: 46px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		margin-top: 0;
	}

	/* 
  widget bet site container width decalrations 
  */
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box button,
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input,
	div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value,
	div#site-bet-box div#inner-site-container a.anchor-bet-box 
  {
		width: inherit;
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
		#votes-widget-container 
    {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	@media only screen 
  and (min-width: 726px)
  {
		/* 
    widget vote container 
    */
		div#votes-widget-container div#btn-vote-container button.cast-vote-btn
    {
			min-width: 206px;
			width: 100%;
			height: 48px;
		}
		div#votes-widget-container div#btn-vote-container button.cast-vote-btn:hover
    {
			border: 1px solid #f5620f !important;
		}
		div#votes-widget-container div#btn-vote-container button.cast-vote-btn:hover span
    {
			color: #f5620f !important;
		}

		/* 
    widget bet site container 
    */
		div#site-bet-box #inner-site-container button
    {
			height: 44px;
		}
		div#site-bet-box div#inner-site-container div#box-row > *
    {
			margin-right: 16px;
		}
		div#site-bet-box div#inner-site-container div#box-row > *:last-child
    {
			margin-right: 0;
		}
		div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value
    {
			width: 100%;
			/* max-width: 160px; */
			padding: 14px;
		}
		div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input#win-type.desktop-view-winnings
    {
			padding: 0;
			text-align: end;
		}
	}

	@media only screen 
  and (min-width: 1160px) 
  {

		#votes-widget-container {
			min-width: 100%;
		}

		/* 
    widget vote container 
    */
		div#votes-widget-container div#btn-vote-container button.cast-vote-btn {
			min-width: 140px;
			width: 100%;
			height: 48px;
		}

		/* 
    widget bet site container 
    */
		div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value,
		div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box a.anchor-bet-box 
    {
			width: 100%;
			/* max-width: 160px; */
		}
		div#site-bet-box div#inner-site-container a.anchor-bet-box button.place-bet-btn 
    {
			margin-top: 27px;
		}
		div#site-bet-box div#inner-site-container a.anchor-bet-box button.place-bet-btn:hover 
    {
			background-color: #f77c42;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	div#votes-widget-container.dark-background-1 div#btn-vote-container button.cast-vote-btn 
  {
		background-color: #616161 !important;
		border: 1px solid #999999 !important;
	}
	div#votes-widget-container.dark-background-1 div#btn-vote-container button.cast-vote-btn:hover 
  {
		border: 1px solid #f5620f !important;
	}
	div#votes-widget-container.dark-background-1 div#btn-vote-container button.cast-vote-btn:hover span 
  {
		color: #f5620f !important;
	}
	div#votes-widget-container.dark-background-1 div#btn-vote-container button.dark-background-1 .cast-vote-btn.active 
  {
		border: 1px solid #f5620f !important;
	}

	div#votes-widget-container.dark-background-1 p 
  {
		color: #ffffff !important;
	}

	div#votes-widget-container.dark-background-1 .probablitiy-text 
  {
		color: #a8a8a8 !important;
	}

	div#votes-widget-container.dark-background-1 #site-bet-box,
	div#votes-widget-container.dark-background-1 div#site-bet-box div#inner-site-container 
  {
		background-color: #616161 !important;
	}
	div#votes-widget-container.dark-background-1 div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value 
  {
		background-color: #4b4b4b !important;
		color: #ffffff !important;
	}
	div#votes-widget-container.dark-background-1 div#site-bet-box	div#inner-site-container div#box-row div.stakes-info-box input 
  {
		color: #ffffff !important;
	}
	div#votes-widget-container.dark-background-1 div#site-bet-box div#box-row div.stakes-info-box input#win-type 
  {
		background-color: #4b4b4b !important;
	}
</style>
