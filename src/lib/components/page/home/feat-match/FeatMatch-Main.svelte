<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
	
	import { get } from '$lib/api/utils';
	import { targetLivescoreNowFixtureOddsListen } from '$lib/firebase/common.js';
	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { getImageBgColor } from '$lib/utils/color_thief.js';
	import { getOrdinalNum, MONTH_NAMES_ABBRV, toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { dlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import FeatMatchTableRow from './FeatMatch-Table-Row.svelte';

	import type { Voted_Fixture } from '$lib/types/types.scores.js';
	import type { B_FEATM_D, B_FEATM_T } from '@betarena/scores-lib/types/feat-match.js';
	import type { B_H_VOT_M } from '@betarena/scores-lib/types/votes.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let B_FEATB_T: B_FEATM_T;

	let B_FEATM_D: B_FEATM_D;

  const MOBILE_VIEW = 700;
	const TABLET_VIEW = 700;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

	let totalVoteCount: number = undefined;
	let imageURL: string = undefined;
	let fixtureVoteObj: Voted_Fixture;
	let noWidgetData: boolean = false;
	let imageVar: string = '--featured-match-bookmaker-bg-';
	let user_Stake_amount: number = 50.0;
	let currentDate: Date = new Date();
	let dateDiff: number = Date.parse(currentDate.toString()) - Date.parse(new Date().toString());
	let showBetSite: boolean = false;
	let isVoteCasted: boolean = false;
  let showCountdown: boolean = true;

  $: countDownSec = toZeroPrefixDateStr(Math.floor((dateDiff / 1000) % 60).toString());
	$: countDownMin = toZeroPrefixDateStr(Math.floor((dateDiff / 1000 / 60) % 60).toString());
	$: countDownHour = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60)) % 24).toString());
	$: countDownTestHour = Math.floor(dateDiff / (1000 * 60 * 60));

  // [ℹ] intercept data, and decalre further;
	$: totalVoteCount =
    B_FEATM_D?.match_votes?.vote_draw_x 
    +	B_FEATM_D?.match_votes?.vote_win_local 
    +	B_FEATM_D?.match_votes?.vote_win_visitor
  ;
  
  // $: imageURL = B_FEATM_D?.live_odds?.fixture_odds_info.image;

  B_FEATM_D.time = new Date(B_FEATM_D.time.toString());

  // $: fixtureVoteObj = B_FEATM_D?.selected_data;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ instantiate livescore fixture odds (data) listener
   * @returns
   * void
   */
  async function kickstartLiveOdds
  (
  ): Promise < void > 
  {
    const if_M_0 = 
      FIXTURE_FULL_TIME_OPT.includes(FIXTURE_INFO?.data?.status)
    ;
    if (if_M_0) return;
    let connectionRef = targetLivescoreNowFixtureOddsListen
    (
      livesOddsPath
    );
	}

  // B_FEATM_D.live_odds = FIREBASE_getTargetFixtureOdds

	function checkVote
  (
  ): void
  {
		// locate "exist" voted fixture;
		const result = $userBetarenaSettings?.voted_fixtures
    ?.find
    (
      (
        fixture
      ) => {
        return (
          fixture.fixture_id === FIXTURE_INFO?.data?.id
        );
      }
    );

		if (result != undefined) 
    {
			fixtureVoteObj = result;
			showBetSite = true;
			isVoteCasted = true;
			return;
		}

    fixtureVoteObj = 
    {
      fixture_id: undefined,
      fixture_vote: undefined,
      fixture_vote_val: undefined
    };
    showBetSite = false;
    isVoteCasted = false;
	}

	async function castVote  
  (
    voteType: string,
    voteVal: string | number
  ): Promise < void > 
  {
    // [🐞]
    dlog
    (
      `${VO_W_F_TAG} voteVal: ${voteVal}`, 
      VO_W_F_TOG, 
      VO_W_F_STY
    );

    if (isVoteCasted) return;

		if (voteVal == undefined) voteVal = '1.5';

    showBetSite = true;

    fixtureVoteObj = 
    {
      fixture_id: FIXTURE_INFO?.data?.id,
      fixture_vote: voteType,
      fixture_vote_val: voteVal as string
    };

    const response = await get
    (
      `/api/data/fixture/votes/?fixture_id=${FIXTURE_INFO?.data?.id}&vote=${voteType}'`
    ) as B_H_VOT_M;

    dlog
    (
      `${VO_W_F_TAG} update_fixture_data: ${response}`, 
      VO_W_F_TOG, 
      VO_W_F_STY
    );

    B_FEATM_D.match_votes = response?.update_widget_featured_match_votes_by_pk;
    totalVoteCount =
      B_FEATM_D?.match_votes?.vote_draw_x 
      +	B_FEATM_D?.match_votes?.vote_win_local 
      + B_FEATM_D?.match_votes?.vote_win_visitor
    ;

    userBetarenaSettings.addToVotes
    (
      fixtureVoteObj
    );

    isVoteCasted = true;
    return;
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

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] 
   * [REACTIVE]
   * @description
   * ➨ sets timer (countdown) in motion;
  */
  $: if (browser) 
  {
		dateDiff = toCorrectDate(B_FEATM_D?.time).getTime() - new Date().getTime();		
    setInterval
    (
      () => 
      {
        dateDiff = toCorrectDate(B_FEATM_D?.time).getTime() - new Date().getTime();
      }, 
      1000
    );
	}

  /**
   * @summary
   * [MAIN] 
   * [REACTIVE]
   * @description 
   * ➨ checks for "hide" / "show" countdown bool state;
  */
  $: if_R_0 =
    countDownTestHour > 23 
    || dateDiff < 0
  ;
	$: if (if_R_0) showCountdown = false;

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description 
   * ➨ listens to available "fixtureVotes" data;
  */
  $: if ($userBetarenaSettings?.voted_fixtures) 
  {
		checkVote();
	}

  // TODO:
  $: if (browser && imageURL) 
  {
		getImageBgColor
    (
      imageURL, 
      imageVar
    );
	}

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] 
   * [LIFECYCLE]
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

<div>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
		<WidgetNoData 
      WIDGET_TITLE={B_FEATB_T?.widget_title}
      NO_DATA_TITLE={B_FEATB_T?.place_holder?.info}
      NO_DATA_DESC={B_FEATB_T?.place_holder?.no_matches}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={B_FEATB_T.widget_title}
      OVERRIDE_COLOR={tabletExclusive ? true : false}
    />

    <div
      id="live-score-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!-- 
      LEAGUE TITLE
      -->
      <a
        href={B_FEATM_D?.urls == undefined ? '' : B_FEATM_D?.urls?.[B_FEATB_T?.lang]}
      >
        <div
          id="fixture-league-title"
          class="row-space-start"
        >

          <!--
          LEAGUE ICON
          -->
          <img
            loading="lazy"
            class="img-flag"
            src={B_FEATM_D?.country_flag}
            alt="default alt text"
          />

          <!--
          LEAGUE NAME
          -->
          <p
            class="
              w-500 
              large 
              color-dark 
              m-r-8
            "
          >
            {B_FEATM_D?.league_name}
            {#if B_FEATM_D?.round_name != undefined}
              <span 
                class="
                  w-400 
                  color-grey
                ">
                (Round {B_FEATM_D?.round_name})
              </span>
            {/if}
          </p>
        </div>
      </a>

      <!--
      FIXTURE VOTES
      -->
      {#if B_FEATM_D?.live_odds != undefined}
        
        <div 
          id="fixture-visual-box"
        >
          <!--
          FIXTURE VOTE INFO
          -->
          <div
            id="fixture-data"
            class="
              row-space-out 
              m-b-20
            "
          >
            
            <!-- 
            TEAM 1
            -->
            <div
              class="fixture-team">
              <img
                loading="lazy"
                class="m-b-12"
                src={B_FEATM_D?.home_team_logo}
                alt="default alt text"
                width="72"
                height="72"
              />
              <p
                class="
                  w-500 
                  medium 
                  desktop-medium
                "
              >
                {B_FEATM_D?.home_team_name}
              </p>
            </div>

            <!-- 
            FIXTURE COUNTDOWN
            -->
            <div
              style="align-self: center;"
            >

              {#if showCountdown}
                <p
                  class="
                    w-500 
                    x-large 
                    desktop-x-large
                  "
                >
                  {countDownHour}:{countDownMin}:{countDownSec}
                </p>

                <p
                  class="
                    w-400 
                    small 
                    color-grey 
                    desktop-medium
                  "
                  style="white-space: nowrap;"
                >
                  {getOrdinalNum(B_FEATM_D.time.getDate())}
                  {MONTH_NAMES_ABBRV?.[B_FEATM_D?.time?.getMonth()?.toString()]}
                  {B_FEATM_D.time.getFullYear().toString().substr(-2)},
                  {B_FEATM_D.time.getHours().toString()}
                  :
                  {('0' + B_FEATM_D.time.getMinutes().toString()).slice(-2)}
                  h
                </p>
              {:else}
                <a
                  href="{
                    B_FEATM_D?.fix_urls != null ? B_FEATM_D?.fix_urls?.[$sessionStore?.serverLang] : ''}
                  ">
                  <button
                    id="watch-match-btn"
                    class="btn-primary-v2">
                    Watch the Match
                  </button>
                </a>
              {/if}
              
            </div>

            <!--
            TEAM 2
            -->
            <div
              class="fixture-team">
              <img
                loading="lazy"
                class="m-b-12"
                src={B_FEATM_D?.away_team_logo}
                alt="default alt text"
                width="72"
                height="72"
              />
              <p
                class="
                  w-500 
                  medium 
                  desktop-medium
                  "
              >
                {B_FEATM_D?.away_team_name}
              </p>
            </div>

          </div>

          {#if !isVoteCasted}
            <p
              class="
                w-500 
                large 
                color-primary 
                m-b-12 
                text-center
              "
            >
              {B_FEATB_T?.vote}
            </p>
          {/if}

          <!--
          VOTE RESULTS
          -->
          <div
            id="btn-vote-container"
            class="row-space-out"
          >

            <!-- 
            ODDS #1 
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
                class:active={fixtureVoteObj.fixture_vote == '1'}
                disabled={isVoteCasted}
                on:click={() => castVote('1', parseFloat(B_FEATM_D.live_odds.fixture_odds.markets['1X2FT'].data[0].value.toString()).toFixed(2))}
              >
                <p
                  class="
                    w-500 
                    medium 
                    row-space-out
                  "
                >
                  {#if !tabletExclusive}
                    <span 
                      class="color-grey">
                      1
                    </span>
                  {:else}
                    <img
                      loading="lazy"
                      src={B_FEATM_D?.home_team_logo}
                      alt="default alt text"
                      width="28"
                      height="28"
                    />
                  {/if}
                  <span
                    class:active_p={fixtureVoteObj.fixture_vote == '1'}
                  >
                    {parseFloat(B_FEATM_D.live_odds.fixture_odds.markets['1X2FT'].data[0].value.toString()).toFixed(2)}
                  </span>
                </p>
              </button>

              <!-- 
              PROBABILITY (WIN)
              -->
              {#if !showBetSite}

                <p
                  class="
                    w-400 
                    probablitiy-text 
                    medium"
                >
                  {B_FEATB_T?.probability}

                  {#if !tabletExclusive}
                    <br />
                  {/if}

                  {Math.round(parseFloat(B_FEATM_D?.probabilities?.home.toString())).toFixed(2)}%
                </p>

              {:else if B_FEATM_D.match_votes != undefined}

                <p
                  class="
                    w-500 
                    large
                  "
                >
                  <span 
                    class="color-dark"
                  >
                    {B_FEATM_D?.match_votes?.vote_win_local == 0 ? 0 : ((B_FEATM_D?.match_votes.vote_win_local / totalVoteCount) * 100).toFixed(0)}%
                  </span>
                  <span class="color-grey">
                    ({B_FEATM_D?.match_votes?.vote_win_local})
                  </span>
                </p>

              {/if}
            </div>

            <!-- 
            ODDS #X 
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
                class:active={fixtureVoteObj.fixture_vote == 'X'}
                disabled={isVoteCasted}
                on:click={() => castVote('X', parseFloat(B_FEATM_D.live_odds.fixture_odds.markets['1X2FT'].data[0].value.toString()).toFixed(2))}
              >
                <p
                  class="
                    w-500 
                    medium 
                    row-space-out
                  "
                >

                  {#if !tabletExclusive}
                    <span class="color-grey">
                      X
                    </span>
                  {:else}
                    <img
                      loading="lazy"
                      src="https://www.betarena.com/widgets/featured_match/static/icon/icon-close.svg"
                      alt="default alt text"
                      width="28"
                      height="28"
                    />
                  {/if}

                  <span
                    class:active_p={fixtureVoteObj.fixture_vote == 'X'}
                  >
                    {parseFloat(B_FEATM_D.live_odds.fixture_odds.markets['1X2FT'].data[1].value.toString()).toFixed(2)}
                  </span>
                </p>
              </button>

              <!-- 
              PROBABILITY (WIN)
              -->
              {#if !showBetSite}

                <p
                  class="
                    w-400 
                    probablitiy-text 
                    medium
                  "
                >
                  {B_FEATB_T?.probability}
                  
                  {#if !tabletExclusive}
                    <br />
                  {/if}
                  
                  {Math.round(parseFloat(B_FEATM_D?.probabilities?.draw.toString())).toFixed(2)}%
                  
                </p>

              {:else if B_FEATM_D.match_votes != undefined}

                <p class="w-500 large">
                  <span class="color-dark">
                    {B_FEATM_D?.match_votes?.vote_draw_x == 0 ? 0 : ((B_FEATM_D?.match_votes.vote_draw_x / totalVoteCount) * 100).toFixed(0)}%
                  </span>
                  <span class="color-grey">
                    ({B_FEATM_D?.match_votes?.vote_draw_x})
                  </span>
                </p>
                
              {/if}

            </div>

            <!-- 
            ODDS #2
            -->
            <div
              class="odds-vote-box column text-center"
            >

              <button
                class="row-space-out cast-vote-btn m-b-12"
                class:active={fixtureVoteObj.fixture_vote ==
                  '2'}
                disabled={isVoteCasted}
                on:click={() =>
                  castVote(
                    '2',
                    parseFloat(
                      B_FEATM_D.live_odds.fixture_odds.markets[
                        '1X2FT'
                      ].data[2].value.toString()
                    ).toFixed(2)
                  )}
              >
                <p
                  class="
                    w-500 medium 
                    row-space-out
                  "
                >

                  {#if !tabletExclusive}
                    <span class="color-grey">
                      2
                    </span>
                  {:else}
                    <img
                      loading="lazy"
                      src={B_FEATM_D.away_team_logo}
                      alt="default alt text"
                      width="28"
                      height="28"
                    />
                  {/if}

                  <span
                    class:active_p={fixtureVoteObj.fixture_vote == '2'}
                  >
                    {parseFloat(B_FEATM_D.live_odds.fixture_odds.markets['1X2FT'].data[2].value.toString()).toFixed(2)}
                  </span>

                </p>
              </button>

              <!-- 
              PROBABILITY (WIN)
              -->
              {#if !showBetSite}
                <p
                  class="
                    w-400 
                    probablitiy-text 
                    medium
                  "
                >
                  {B_FEATB_T?.probability}
                  
                  {#if !tabletExclusive}
                    <br />
                  {/if}

                  {Math.round(parseFloat(B_FEATM_D?.probabilities?.away.toString())).toFixed(2)}%
                  
                </p>
              {:else if B_FEATM_D.match_votes != undefined}
                <p 
                  class="
                    w-500 
                    large
                  "
                >
                  <span class="color-dark">
                    {B_FEATM_D?.match_votes?.vote_win_visitor == 0 ? 0 : ((B_FEATM_D?.match_votes.vote_win_visitor / totalVoteCount) * 100).toFixed(0)}%
                  </span>
                  <span class="color-grey">
                    ({B_FEATM_D?.match_votes?.vote_win_visitor})
                  </span>
                </p>
              {/if}
            </div>

          </div>

          <!-- 
          EXTRA INFO STAKES POP-UP
          -->
          {#if showBetSite}

            <div 
              id="site-bet-box" 
              in:fade>

              <img
                loading="lazy"
                src="https://www.betarena.com/widgets/featured_match/static/icon/white-close.svg"
                alt="default alt text"
                width="16"
                height="16"
                style="position: absolute; top: 12px; right: 20px;"
                on:click={() => (showBetSite = false)}
              />
              <a
                href={B_FEATM_D?.live_odds?.fixture_odds_info?.register_link}
              >
                <img
                  loading="lazy"
                  id="stakesSiteImg"
                  src={B_FEATM_D?.live_odds.fixture_odds_info?.image}
                  alt="default alt text"
                  width="100%"
                  height="40px"
                />
              </a>

              <div 
                id="inner-site-container">

                <!-- 
                STAKES DATA 
                -->
                <div
                  class="
                    m-b-20 
                    row-space-out
                  "
                >
                  <!-- [ℹ] Win Type 
                  -->
                  <div class="text-center">
                    {#if fixtureVoteObj.fixture_vote == '1'}
                      <p
                        class="w-400 medium m-b-8 color-grey"
                      >
                        Home win
                      </p>
                    {:else if fixtureVoteObj.fixture_vote == 'X'}
                      <p
                        class="w-400 medium m-b-8 color-grey"
                      >
                        Draw
                      </p>
                    {:else}
                      <p
                        class="w-400 medium m-b-8 color-grey"
                      >
                        Away win
                      </p>
                    {/if}
                    <div
                      class="input-value row-space-out medium text-center"
                    >
                      {#if tabletExclusive}
                        {#if fixtureVoteObj.fixture_vote == '1'}
                          <img
                            loading="lazy"
                            src={B_FEATM_D.home_team_logo}
                            alt="default alt text"
                            width="28px"
                            height="28px"
                          />
                        {:else if fixtureVoteObj.fixture_vote == 'X'}
                          <p
                            class="w-500 medium row-space-out"
                          >
                            <span
                              class="color-grey"
                            >
                              X
                            </span>
                          </p>
                        {:else}
                          <img
                            loading="lazy"
                            src={B_FEATM_D.away_team_logo}
                            alt="default alt text"
                            width="28px"
                            height="28px"
                          />
                        {/if}
                      {/if}
                      <input
                        id="win-type"
                        class="w-500 medium text-center desktop-view-winnings"
                        type="number"
                        bind:value={fixtureVoteObj.fixture_vote_val}
                        disabled
                      />
                    </div>
                  </div>

                  <!-- [ℹ] MULTIPLY SIGN 
                  -->
                  <img
                    loading="lazy"
                    src="/assets/svg/icon/icon-close.svg"
                    alt="multiply-icon"
                    width="16px"
                    height="16px"
                    style="margin-top: 25px;"
                  />

                  <!-- [ℹ] Stake 
                  -->
                  <div class="text-center">
                    <p
                      class="w-400 medium m-b-8 color-grey"
                    >
                      {B_FEATB_T.stake}
                    </p>
                    <input
                      class="w-500 input-value medium text-center"
                      type="text"
                      bind:value={user_Stake_amount}
                    />
                  </div>

                  <!-- [ℹ]  EQUALS SIGN 
                  -->
                  <img
                    loading="lazy"
                    src="/assets/svg/icon/icon-equally.svg"
                    alt="icon-equlaity"
                    width="16px"
                    height="16px"
                    style="margin-top: 25px;"
                  />

                  <!-- [ℹ] Winnings 
                  -->
                  <div class="text-center">
                    <p
                      class="w-400 medium m-b-8 color-grey"
                    >
                      {B_FEATB_T.winnings}
                    </p>
                    <input
                      class="w-500 input-value medium text-center"
                      type="number"
                      value={(
                        parseFloat(
                          fixtureVoteObj.fixture_vote_val
                        ) * user_Stake_amount
                      ).toFixed(2)}
                      disabled
                    />
                  </div>
                </div>

                <!-- [ℹ] PLACE BET BUTTON 
                -->
                <a
                  href={B_FEATM_D
                    .live_odds.fixture_odds_info
                    .register_link}
                >
                  <button
                    class="place-bet-btn btn-primary m-b-12"
                  >
                    <p class="small">
                      {B_FEATB_T.place_bet}
                    </p>
                  </button>
                </a>

                <!-- [ℹ] BETTING SITE INFO 
                -->
                <p
                  class="small text-center color-grey"
                >
                  {B_FEATM_D
                    .live_odds.fixture_odds_info
                    .information}
                </p>
              </div>
            </div>
          {/if}

        </div>
      {/if}

      <!--
      LIVE STREAMS
      -->
      {#if B_FEATM_D?.tvstations?.length > 0}
        
        <div 
          id="live-stream-box">

          <!-- 
          TITLE
          -->
          <p
            class="
              w-500 
              large 
              m-b-8
            "
            style="padding-left: 20px;"
          >
            {B_FEATB_T.streams}
          </p>

          <!-- 
          LIVE STREAM GRID
          -->
          <div
            id="livestream-grid">
            {#each B_FEATM_D?.tvstations || [] as tv_item}
              <a
                rel="external"
                href={tv_item.link}
              >
                <div 
                  class="tooltip">
                  <button
                    class="live-stream-btn"
                  >
                    <img
                      loading="lazy"
                      src={tv_item.img}
                      alt={tv_item.alt}
                      title={tv_item.Name}
                      width="45"
                      height="26"
                    />
                  </button>
                  <p
                    class="
                      s_small 
                      tooltiptext
                    "
                  >
                    {tv_item.Name}
                  </p>
                </div>
              </a>
            {/each}
          </div>

        </div>

      {/if}

      <!-- 
      BEST PLAYERS
      -->
      {#if B_FEATM_D?.best_players != null}
        
        <div
          id="best-players-box-out">
          
          <!-- 
          HOME TEAM
          -->
          <div
            class="best-players-box">

            <div
              class="
                row-space-start 
                m-b-16
              ">
              <img
                loading="lazy"
                class="m-r-16"
                src={B_FEATM_D?.home_team_logo}
                alt="default alt text"
                width="32"
                height="32"
              />
              <p 
                class="
                  w-500 
                  large
                ">
                {B_FEATM_D?.home_team_name}
                {B_FEATB_T?.players}
              </p>
            </div>

            <table 
              class="table-best-player">
              
              <tr
                class="
                  row-head 
                  m-b-16
                ">
                <th 
                  class="rating-head">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.rating}
                  </p>
                </th>

                <th 
                  class="player-col">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.player}
                  </p>
                </th>

                {#if tabletExclusive}
                  <th class="text-center">
                    <p
                      class="w-400 small color-grey"
                    >
                      {B_FEATB_T.matches}
                    </p>
                  </th>
                  <th class="text-center">
                    <p
                      class="w-400 small color-grey"
                    >
                      {B_FEATB_T.assists}
                    </p>
                  </th>
                  <th class="text-center">
                    <p
                      class="w-400 small color-grey"
                    >
                      {B_FEATB_T.goals}
                    </p>
                  </th>
                {/if}
              </tr>

              <!-- 
              HOME TEAM - PLAYER 1
              -->
              <FeatMatchTableRow 
                rating={B_FEATM_D?.best_players?.local_team_rating_player_1}
                name={B_FEATM_D?.best_players?.local_team_player_1}
                img={B_FEATM_D?.best_players?.local_team_player_1_image_path}
                appear={B_FEATM_D?.best_players?.local_team_player_1_appearances}
                assists={B_FEATM_D?.best_players?.local_team_player_1_assists}
                goals={B_FEATM_D?.best_players?.local_team_player_1_goals}
                viewportDesktop={tabletExclusive}
              />

              <!--
              HOME TEAM - PLAYER 2
              -->
              <FeatMatchTableRow 
                rating={B_FEATM_D?.best_players?.local_team_rating_player_2}
                name={B_FEATM_D?.best_players?.local_team_player_2}
                img={B_FEATM_D?.best_players?.local_team_player_2_image_path}
                appear={B_FEATM_D?.best_players?.local_team_player_2_appearances}
                assists={B_FEATM_D?.best_players?.local_team_player_2_assists}
                goals={B_FEATM_D?.best_players?.local_team_player_2_goals}
                viewportDesktop={tabletExclusive}
              />

            </table>

          </div>

          <!-- 
          TEAM AWAY
          -->
          <div
            class="best-players-box">

            <div
              class="
                row-space-start 
                m-b-16">
              <img
                loading="lazy"
                class="m-r-16"
                src={B_FEATM_D?.away_team_logo}
                alt="default alt text"
                width="32"
                height="32"
              />
              <p 
                class="
                  w-500 
                  large
                ">
                {B_FEATM_D?.away_team_name}
                {B_FEATB_T?.players}
              </p>
            </div>

            <table 
              class="table-best-player">

              <tr class="row-head m-b-16">
                <th class="rating-head">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T?.rating}
                  </p>
                </th>

                <th class="player-col">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T?.player}
                  </p>
                </th>

                {#if tabletExclusive}
                  <th class="text-center">
                    <p
                      class="w-400 small color-grey"
                    >
                      {B_FEATB_T.matches}
                    </p>
                  </th>
                  <th class="text-center">
                    <p
                      class="w-400 small color-grey"
                    >
                      {B_FEATB_T.assists}
                    </p>
                  </th>
                  <th class="text-center">
                    <p
                      class="w-400 small color-grey"
                    >
                      {B_FEATB_T.goals}
                    </p>
                  </th>
                {/if}
              </tr>

              <!-- 
              AWAY TEAM - PLAYER 1
              -->
              <FeatMatchTableRow 
                rating={B_FEATM_D?.best_players?.visitor_team_rating_player_1}
                name={B_FEATM_D?.best_players?.visitor_team_player_1}
                img={B_FEATM_D?.best_players?.visitor_team_player_1_image_path}
                appear={B_FEATM_D?.best_players?.visitor_team_player_1_appearances}
                assists={B_FEATM_D?.best_players?.visitor_team_player_1_assists}
                goals={B_FEATM_D?.best_players?.visitor_team_player_1_goals}
                viewportDesktop={tabletExclusive}
              />

              <!-- 
              AWAY TEAM - PLAYER 2
              -->
              <FeatMatchTableRow 
                rating={B_FEATM_D?.best_players?.visitor_team_rating_player_2}
                name={B_FEATM_D?.best_players?.visitor_team_player_2}
                img={B_FEATM_D?.best_players?.visitor_team_player_2_image_path}
                appear={B_FEATM_D?.best_players?.visitor_team_player_2_appearances}
                assists={B_FEATM_D?.best_players?.visitor_team_player_2_assists}
                goals={B_FEATM_D?.best_players?.visitor_team_player_2_goals}
                viewportDesktop={tabletExclusive}
              />
             
            </table>

          </div>

        </div>

      {/if}

      <!--
      VALUE BETS
      -->
      {#if B_FEATM_D?.valuebets != null}
        
        <div 
          id="value-bets">

          <!-- 
          TITLE
          -->
          <p
            class="
              w-500 
              large 
              m-b-16
            "
          >
            {B_FEATB_T?.value_bet}
          </p>

          <!--
          VALUE BET GRID
          -->
          {#if !tabletExclusive}
            <div 
              id="value-bets-container">
              <div 
                id="value-bets-inner-info">

                <div
                  class="row-space-out">
                  <p
                    class="
                      w-400 
                      medium 
                      color-grey
                    "
                  >
                    {B_FEATB_T?.bookmaker}
                  </p>
                  <a
                    rel="external"
                    href={B_FEATM_D?.valuebets?.link}
                  >
                    <img
                      loading="lazy"
                      src={B_FEATM_D?.valuebets?.image}
                      alt={B_FEATM_D?.valuebets?.bookmaker}
                      height="30"
                      width="56"
                      style="height: 30px !important;"
                    />
                  </a>
                </div>

                <div 
                  class="row-space-out">
                  <p
                    class="
                      w-400 
                      medium 
                      color-grey
                    "
                  >
                    {B_FEATB_T?.type}
                  </p>
                  <p
                    class="
                      w-500 
                      medium 
                      color-dark
                    "
                  >
                    {B_FEATB_T?.market_name}
                  </p>
                </div>

                <div 
                  class="row-space-out">
                  <p
                    class="
                      w-400 
                      medium 
                      color-grey
                    "
                  >
                    {B_FEATB_T?.market}
                  </p>
                  <p
                    class="
                      w-500 
                      medium 
                      color-dark
                    "
                  >
                    {B_FEATM_D?.valuebets?.bet}
                  </p>
                </div>

                <div 
                  class="row-space-out">
                  <p
                    class="
                      w-400 
                      medium 
                      color-grey
                    "
                  >
                    {B_FEATB_T?.odds}
                  </p>

                  <a
                    rel="external"
                    href={B_FEATM_D?.valuebets?.link}
                  >
                    <p
                      class="w-500 medium color-dark"
                      style="background: #FFFFFF;
                        border-radius: 4px;
                        padding: 4px 6px;"
                      >
                      {parseFloat(B_FEATM_D.valuebets.odd.toString()).toFixed(2)}
                    </p>
                  </a>

                </div>

                <div 
                  class="row-space-out">
                  <p
                    class="
                      w-400 
                      medium 
                      color-grey
                    "
                  >
                    {B_FEATB_T?.fair_odds}
                  </p>

                  <a
                    rel="external"
                    href={B_FEATM_D?.valuebets?.link}
                  >
                    <p
                      class="w-500 medium color-dark"
                      style="background: #FFFFFF;
                        border-radius: 4px;
                        padding: 4px 6px;"
                      >
                      {parseFloat(B_FEATM_D.valuebets.fair_odd.toString()).toFixed(2)}
                    </p>
                  </a>
                </div>
              </div>

              <!-- 
              VALUE BET BTN
              -->
              <a
                rel="external"
                href={B_FEATM_D?.valuebets?.link}
              >
                <button
                  style="width: 100%; padding: 6px 0; border-radius: 4px;"
                  class="btn-primary"
                >
                  <p class="w-500 medium">
                    {B_FEATB_T?.bet}
                  </p>
                </button>
              </a>
            </div>
          {:else}
            <table class="value_bets">
              <tr class="row-head m-b-16">
                <th
                  class="text-center"
                  style="text-align: start;"
                >
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.bookmaker}
                  </p>
                </th>

                <th class="text-center">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.type}
                  </p>
                </th>

                <th class="text-center">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.market}
                  </p>
                </th>

                <th class="text-center">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.odds}
                  </p>
                </th>

                <th class="text-center">
                  <p
                    class="w-400 small color-grey"
                  >
                    {B_FEATB_T.fair_odds}
                  </p>
                </th>

                <th class="text-center" />
              </tr>

              <!-- [ℹ] VALUE-BET - ROW SINGLE 
              -->

              <tr>
                <td
                  class="text-center"
                  style="text-align: start;"
                >
                  <a
                    rel="external"
                    href={B_FEATM_D
                      .valuebets.link}
                    style="height: 30px;"
                  >
                    <img
                      loading="lazy"
                      src={B_FEATM_D
                        .valuebets.image}
                      alt={B_FEATM_D
                        .valuebets.bookmaker}
                      height="30px"
                      width="56px"
                      style="object-fit: cover; border-radius: 4px; height: 30px !important;"
                    />
                  </a>
                </td>

                <td>
                  <p
                    class="w-500 medium text-center"
                  >
                    {B_FEATB_T.market_name}
                  </p>
                </td>

                <td>
                  <p
                    class="w-500 medium text-center"
                  >
                    {B_FEATM_D.valuebets.bet.toString()}
                  </p>
                </td>

                <td>
                  <a
                    rel="external"
                    href={B_FEATM_D
                      .valuebets.link}
                  >
                    <p
                      class="w-500 medium max-height: 30px; boxed-rating-value-bets active_p_btn"
                    >
                      {parseFloat(
                        B_FEATM_D.valuebets.odd.toString()
                      ).toFixed(2)}
                    </p>
                  </a>
                </td>

                <td>
                  <a
                    rel="external"
                    href={B_FEATM_D
                      .valuebets.link}
                  >
                    <p
                      class="w-500 medium max-height: 30px; boxed-rating-value-bets active_p_btn"
                    >
                      {parseFloat(
                        B_FEATM_D.valuebets.fair_odd.toString()
                      ).toFixed(2)}
                    </p>
                  </a>
                </td>

                <td>
                  <a
                    rel="external"
                    href={B_FEATM_D
                      .valuebets.link}
                  >
                    <button
                      style="width: 100%; padding: 6px 0; max-height: 30px; border-radius: 4px;"
                      class="btn-primary"
                    >
                      <p class="w-500 medium">
                        {B_FEATB_T.bet}
                      </p>
                    </button>
                  </a>
                </td>
              </tr>
            </table>
          {/if}

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

  button#watch-match-btn
  {
    padding: 10px 16px;
    font-size: 14px;
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
    border-radius: 8px;
  }

	#live-score-container
  {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		min-width: 100%;
		width: 100%;
		max-width: 343px;
		padding-bottom: 4px;
		overflow: hidden;
	}

	#fixture-league-title
  {
		padding: 10px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
	}

	#fixture-visual-box
  {
		padding: 25px 20px 20px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
	}

	#fixture-data
  {
		display: grid;
		grid-auto-flow: column;
		justify-items: center;
		align-items: start;
		justify-content: center;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: center;
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

	/* ====================
    vote-button-container 
  ==================== */

	#btn-vote-container
  {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		justify-items: center;
		justify-content: space-between;
		width: -webkit-fill-available;
	}
	.odds-vote-box
  {
	}
	.cast-vote-btn
  {
		background: #f2f2f2;
		border: 1px solid #cccccc !important;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 14px 16px;
		transition: all ease 0.15s;
		box-shadow: none !important;
		width: 96px;
		height: 48px;
	}
	.cast-vote-btn.active
  {
		background: #ffffff !important;
		border: 1px solid #f5620f !important;
		box-sizing: border-box;
		border-radius: 8px;
		opacity: 1 !important;
	}
	.cast-vote-btn:disabled
  {
		opacity: 0.5;
	}
	.probablitiy-text
  {
		text-align: center;
		color: #8c8c8c;
		width: min-content;
	}

	.active_p
  {
		color: #f5620f !important;
	}

	.active_p_btn:hover
  {
		color: #f5620f !important;
	}

	#site-bet-box
  {
		margin-top: 35px;
		background: #f2f2f2;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}
	#inner-site-container
  {
		padding: 20px 12px;
		background: #f2f2f2;
		border-radius: 8px;
	}
	#inner-site-container button.place-bet-btn
  {
		height: 46px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
		border-radius: 8px;
	}
	.input-value
  {
		-moz-appearance: textfield;
		background: #ffffff;
		border-radius: 8px;
		height: 48px;
		width: 76px;
		border: none;
	}
	#inner-site-container input
  {
		background: rgb(255, 255, 255);
		color: black !important;
		opacity: 1 !important;
	}
	input#win-type
  {
		width: 100%;
		border-radius: 5px;
		border: 0;
		outline: none;
	}

	.img-flag
  {
		width: 24px;
		height: 18px;
		margin-right: 16px;
		filter: drop-shadow(
			0px 2px 3px rgba(0, 0, 0, 0.1)
		);
		border-radius: 2px !important;
		vertical-align: middle !important;
	}

	#stakesSiteImg
  {
		background-color: var(
			--featured-match-bookmaker-bg-
		);
		object-fit: none;
		height: 40px;
	}

	#live-stream-box
  {
		padding: 20px 0;
		box-shadow: inset 0px -1px 0px #ebebeb;
		overflow: hidden;
		width: inherit;
	}
	#livestream-grid
  {
		display: grid;
		grid-auto-flow: column;
		gap: 8px 13px;
		overflow-y: scroll;
		padding: 0 20px;
		grid-template-columns: repeat(
			auto-fill,
			71px
		);
	}
	/* Hide scrollbar for Chrome, Safari and Opera */
	#livestream-grid::-webkit-scrollbar
  {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	#livestream-grid
  {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.live-stream-btn
  {
		border: 1px solid #cccccc !important;
		box-sizing: border-box;
		border-radius: 4px;
		padding: 7px 12px;
		/* padding: 0 !important; */
		background-color: transparent;
		box-shadow: none !important;
		width: 68px;
		height: 40px;
	}
	.live-stream-btn img
  {
		object-fit: contain;
		width: 100%;
	}

	/* ====================
    best-players-container 
  ==================== */

	#best-players-box-out 
  {
    /* NaN */
	}
	.best-players-box 
  {
		padding: 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
	}

	table.table-best-player,
	table.value_bets 
  {
		text-align: left;
		border-collapse: collapse;
		width: 100%;
	}
	table.table-best-player .row-head,
	table.value_bets .row-head 
  {
		background: #f2f2f2;
		border-radius: 2px;
	}
	table td,
	table th 
  {
		padding: 7px 12px;
		/* padding: 7px 0; */
		vertical-align: middle;
		border: none !important;
	}
	table.table-best-player tr td:first-child 
  {
		padding-left: 0;
	}

	table tr td:last-child 
  {
		padding-right: 0;
	}

	table tr td 
  {
		padding-top: 16px !important;
		padding-bottom: 0px;
	}

	.rating-head 
  {
		width: 59px;
	}
	.rating-box 
  {
		width: fit-content;
		border-radius: 30px;
		padding: 1.5px 8px;
		color: white;
	}
	.rating-box p 
  {
		color: white;
	}
	.golden 
  {
		background: #ffb904;
	}
	.silver 
  {
		background: #a1a1a1;
	}
	.bronze 
  {
		background: #dbb884;
	}

	.tooltip 
  {
		border-bottom: none !important;
	}
	.tooltip .tooltiptext 
  {
		display: none;
	}

	.player-img 
  {
		border: 1px solid #cccccc;
		border-radius: 50%;
		margin-right: 8px;
	}

	/* ====================
    value-bets-container 
  ==================== */

	#value-bets 
  {
		padding: 20px;
	}
	#value-bets-container 
  {
		background: #f2f2f2;
		border-radius: 2px;
		width: 100%;
	}
	#value-bets-inner-info 
  {
		padding: 12px;
		display: grid;
		grid-auto-rows: 1fr;
		justify-items: center;
		align-items: center;
		gap: 4px;
	}
	#value-bets-inner-info img 
  {
		border-radius: 4px;
		width: 56px;
		object-fit: cover;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (min-width: 700px) 
  {
		#inner-site-container button 
    {
			height: 44px;
		}

		.boxed-rating-matches 
    {
			background: #ffffff;
			border: 1px solid #e6e6e6;
			box-sizing: border-box;
			border-radius: 4px;
			text-align: center;
			padding: 5px 0;
			max-height: 30px;
			width: 64px;
		}
		.boxed-rating-assits,
		.boxed-rating-value-bets 
    {
			background: #f2f2f2;
			border-radius: 4px;
			text-align: center;
			padding: 5px 0;
			max-height: 30px;
			width: 64px;
		}
		.boxed-rating-goals 
    {
			background: #e6e6e6;
			border-radius: 4px;
			text-align: center;
			padding: 5px 0;
			max-height: 30px;
			width: 64px;
		}

		table.table-best-player tr th:first-child p 
    {
			left: 10%;
			position: relative;
		}
		table.table-best-player tr th:last-child p 
    {
			left: 10%;
			position: relative;
		}

		table tr td:first-child 
    {
			padding-left: 10px;
		}
		table td,
		table th 
    {
			padding: 7px 10px;
		}

		#live-score-container 
    {
			width: 100%;
			max-width: 700px;
		}
		#livestream-grid 
    {
			grid-auto-flow: unset;
			overflow-y: visible;
			grid-template-columns: repeat(
				auto-fill,
				65px
			);
		}
		.input-value 
    {
			width: 100%;
			max-width: 164px;
			padding: 14px;
		}
		.cast-vote-btn 
    {
			min-width: 206px;
			width: 100%;
			height: 48px;
		}
		.desktop-view-winnings 
    {
			padding: 0;
			text-align: end;
		}
		.desktop-small 
    {
			font-size: 14px !important;
		}
		.desktop-medium 
    {
			font-size: 16px !important;
		}
		.desktop-x-large 
    {
			font-size: 20px !important;
		}
		.live-stream-btn 
    {
			padding: 0 5px;
		}
		.player-col 
    {
			width: 357px;
		}
		.rating-head 
    {
			width: 44px;
		}
		table.value_bets tr th:nth-child(-n + 3),
		table.value_bets tr td:nth-child(-n + 3) 
    {
			max-width: 72px !important;
			padding-right: 24px;
		}
		table.value_bets tr th:nth-child(3),
		table.value_bets tr td:nth-child(3) 
    {
			padding-right: 190px !important;
		}
		table.value_bets tr th:nth-last-child(-n + 3),
		table.value_bets tr td:nth-last-child(-n + 3),
		table.value_bets tr td button 
    {
			width: 64px !important;
		}
		.player-img 
    {
			margin-right: 16px;
		}
		table tr:nth-child(2) td 
    {
			padding-top: 20px !important;
		}
	}

	@media only screen 
  and (min-width: 1024px) 
  {
		#live-score-container 
    {
			width: 100%;
			max-width: 560px;
		}
		.input-value 
    {
			width: 100%;
			max-width: 110px;
		}

		.tooltip .tooltiptext 
    {
			display: unset !important;
		}

		.tooltip 
    {
			position: relative;
			display: inline-block;
			border-bottom: none !important;
		}
		.tooltip .tooltiptext 
    {
			visibility: hidden;
			width: 120px;
			color: #fff;
			text-align: center;
			padding: 10px;
			position: absolute;
			z-index: 1;
			top: -100%;
			left: 50%;
			margin-left: -60px;
			background: #4b4b4b;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			border-radius: 4px;
			transition: all 0.15s ease-in;
		}
		.tooltip:hover .tooltiptext 
    {
			visibility: visible !important;
		}
		.cast-vote-btn 
    {
			min-width: 140px;
			width: 100%;
			height: 48px;
		}

		table.value_bets tr th:nth-child(-n + 3),
		table.value_bets tr td:nth-child(-n + 3) 
    {
			max-width: 72px !important;
			padding-right: 24px;
		}
		table.value_bets tr th:nth-last-child(-n + 3),
		table.value_bets tr td:nth-last-child(-n + 3),
		table.value_bets tr td button 
    {
			width: 64px !important;
		}

		table.value_bets tr th:nth-child(3),
		table.value_bets tr td:nth-child(3) 
    {
			padding-right: 24px !important;
		}

		table.table-best-player th:first-child 
    {
			width: 44px !important;
		}
		table.table-best-player tr th:first-child,
		table.table-best-player tr td:first-child 
    {
			/* padding-right: 0px; */
		}
		table.table-best-player th.player-col 
    {
			/* min-width: 226px !important;
      max-width: 226px !important; */
			width: 100%;
		}
		.player-img 
    {
			margin-right: 16px;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	.dark-background-1 #fixture-league-title,
	.dark-background-1 #fixture-visual-box,
	.dark-background-1 .best-players-box,
	.dark-background-1 #live-stream-box 
  {
		box-shadow: inset 0px -1px 0px #616161 !important;
	}

	.dark-background-1 .cast-vote-btn 
  {
		background-color: #616161 !important;
		border: 1px solid #999999 !important;
	}
	.dark-background-1 .cast-vote-btn.active 
  {
		border: 1px solid #f5620f !important;
	}

	.dark-background-1 table.table-best-player .row-head,
	.dark-background-1 table.value_bets .row-head 
  {
		background-color: #616161 !important;
	}

	.dark-background-1 p 
  {
		color: #ffffff;
	}

	.dark-background-1 .live-stream-btn 
  {
		background-color: #ffffff !important;
		border: 1px solid #616161 !important;
	}

	.dark-background-1 table.table-best-player .row-head th p,
	.dark-background-1 table.value_bets .row-head	th p,
	.dark-background-1 .probablitiy-text 
  {
		color: #a8a8a8 !important;
	}

	.dark-background-1 #site-bet-box,
	.dark-background-1 #inner-site-container 
  {
		background-color: #616161 !important;
	}
	.dark-background-1
		#inner-site-container
		.input-value 
    {
		background-color: #4b4b4b !important;
		color: #ffffff !important;
	}

	.dark-background-1 #inner-site-container input 
  {
		color: #ffffff !important;
	}
	.dark-background-1 input#win-type 
  {
		background-color: #4b4b4b !important;
	}

	@media only screen 
  and (min-width: 700px) 
  {

		.dark-background-1 .boxed-rating-matches 
    {
			background-color: #4b4b4b !important;
			border: 1px solid #616161 !important;
		}
		.dark-background-1 .boxed-rating-assits,
		.dark-background-1 .boxed-rating-value-bets 
    {
			background-color: #616161 !important;
		}
		.dark-background-1 .boxed-rating-goals 
    {
			background-color: #737373 !important;
		}
	}

	@media only screen
  and (min-width: 1024px) 
  {
		.dark-background-1 .tooltip .tooltiptext 
    {
			background: #616161;
			box-shadow: inset 0px -1px 0px #3c3c3c;
		}
	}

</style>
