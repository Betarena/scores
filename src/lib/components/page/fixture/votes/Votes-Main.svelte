<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

  import { get } from '$lib/api/utils.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { getImageBgColor } from '$lib/utils/color_thief.js';
  import { VO_W_F_STY, VO_W_F_TAG, VO_W_F_TOG, dlog } from '$lib/utils/debug';
  import { googleActionsStr, googleEventLog } from '$lib/utils/google.js';
  import { viewport_change } from '$lib/utils/platform-functions.js';
  import { FIXTURE_NO_VOTES_OPT } from "@betarena/scores-lib/dist/api/sportmonks.js";

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';

	import type { Voted_Fixture } from '$lib/types/types.scores.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
	import type { B_H_VOT_M, B_VOT_D, B_VOT_T } from '@betarena/scores-lib/types/votes.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_INFO: B_SAP_FP_D;
  export let FIXTURE_VOTES_DATA: B_VOT_D;
	export let B_VOT_T: B_VOT_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1160;

	let mobileExclusive = false;
  let tabletExclusive = false;

  let SPORTBOOK_INFO: B_SPT_D;

	let noWidgetData: any = false;
	let user_stake_amount: number = 50.0;
	let totalVoteCount: number =
    FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x
    +	FIXTURE_VOTES_DATA?.match_votes?.vote_win_local
    + FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor
  ;
	let showBetSite: boolean = false;
	let isVoteCasted: boolean = false;
	let imageVar: string = '--fixture-votes-bookmaker-bg-';

	let fixtureVoteObj: Voted_Fixture =
  {
		fixture_id: undefined,
		fixture_vote: undefined,
		fixture_vote_val: undefined,
	};

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

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
      `/api/data/fixture/votes/?fixture_id=${FIXTURE_INFO?.data?.id}&vote=${voteType}`
    ) as B_H_VOT_M;

    dlog
    (
      `${VO_W_F_TAG} update_fixture_data: ${response}`,
      VO_W_F_TOG,
      VO_W_F_STY
    );

    FIXTURE_VOTES_DATA.match_votes = response?.update_widget_featured_match_votes_by_pk;
    totalVoteCount =
      FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x
      +	FIXTURE_VOTES_DATA?.match_votes?.vote_win_local
      + FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor
    ;

    userBetarenaSettings.addToVotes
    (
      fixtureVoteObj
    );

    isVoteCasted = true;
    return;
  }

  // TODO:
  async function injectLiveOddsData
  (
  ): Promise < void >
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
          && firebaseSportbook?.markets?.['1X2FT'] !=	null
          && firebaseSportbook?.markets != null
          && firebaseSportbook?.markets?.['1X2FT']?.data?.[0]?.value != null
          && firebaseSportbook?.markets?.['1X2FT']?.data?.[1]?.value != null
          && firebaseSportbook?.markets?.['1X2FT']?.data?.[2]?.value != null
          && count != 1
        ;
        if (if_M_0)
        {
					FIXTURE_VOTES_DATA._1x2 =
          {
						home: firebaseSportbook?.markets?.['1X2FT']?.data[0]?.value?.toFixed(2),
						away: firebaseSportbook?.markets?.['1X2FT']?.data[2]?.value?.toFixed(2),
						draw: firebaseSportbook?.markets?.['1X2FT']?.data[1]?.value?.toFixed(2)
					};
					SPORTBOOK_INFO = m_sportBook;
					count = 1;
				}
			}
		}

		FIXTURE_VOTES_DATA = FIXTURE_VOTES_DATA;
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
   * [MAIN] [REACTIVE]
   * @description
   * ➨ listens to target "fixture" in "odds" data;
  */
  $: if ($sessionStore?.live_odds_fixture_target)
  {
    injectLiveOddsData()
  }

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

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description
   * ➨ listens to "noWidgetData" state
  */
  $: if_R_0 =
    FIXTURE_VOTES_DATA?.match_votes == undefined
    && FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)
    || (FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)
    && [0, undefined].includes(FIXTURE_VOTES_DATA?.match_votes?.vote_win_local)
    && [0, undefined].includes(FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x)
    && [0, undefined].includes(FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor))
  ;
  $: if (if_R_0) noWidgetData = true;

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description
   * ➨ listens to change state in sportbook image value;
  */
  $: if_R_1 =
    SPORTBOOK_INFO?.image != undefined
  ;
  $: if (if_R_1)
  {
    getImageBgColor
    (
      SPORTBOOK_INFO?.image,
      imageVar
    );
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
  class:display-none={noWidgetData}>

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={B_VOT_T?.widget_title}
      NO_DATA_TITLE={B_VOT_T?.no_info}
      NO_DATA_DESC={B_VOT_T?.no_info_desc}
    />
	{/if}

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={B_VOT_T?.widget_title}
    />

    <!--
    📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
    -->

    <div
      id="votes-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!--
      VOTE TEXT HINT
      -->
      {#if !isVoteCasted && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
        <p
          class="
            w-500
            large
            color-primary
            m-b-12
            text-center
          "
        >
          {B_VOT_T?.vote}
        </p>
      {/if}

      <!--
      VOTE RESULT BTN
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
            class:active={fixtureVoteObj?.fixture_vote == '1'}
            disabled={isVoteCasted || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            on:click={() => castVote('1', FIXTURE_VOTES_DATA?._1x2?.home)}
          >
            <p
              class="
                  w-500
                  medium
                  row-space-out
                "
            >
              {#if mobileExclusive}
                <span
                  class="color-grey">
                  1
                </span>
              {:else}
                <img
                  loading="lazy"
                  src={FIXTURE_VOTES_DATA?.home_team_logo}
                  alt="default alt text"
                  width="28"
                  height="28"
                />
              {/if}
              <span
                class:active_p={fixtureVoteObj?.fixture_vote == '1'}
              >
                {FIXTURE_VOTES_DATA?._1x2?.home || '-'}
              </span>
            </p>
          </button>

          <!--
          PROBABILITY (WIN)
          -->
          {#if !showBetSite && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                w-400
                probablitiy-text
                medium
              "
            >
              {B_VOT_T?.probability}
              {#if mobileExclusive}
                <br />
              {/if}
              {#if FIXTURE_VOTES_DATA?.probabilities?.home != undefined}
                {Math.round(parseFloat(FIXTURE_VOTES_DATA?.probabilities?.home.toString())).toFixed(2)}%
              {:else}
                -
              {/if}
            </p>
          {:else if FIXTURE_VOTES_DATA?.match_votes != undefined || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                large
              "
            >
              <span
                class="
                  color-black-2
                  w-500
                "
              >
                {[0, undefined].includes(FIXTURE_VOTES_DATA?.match_votes?.vote_win_local) ? 0 : ((FIXTURE_VOTES_DATA?.match_votes?.vote_win_local / totalVoteCount) * 100).toFixed(0)}%
              </span>
              <span
                class="
                  color-grey
                  w-400
                "
              >
                ({FIXTURE_VOTES_DATA?.match_votes?.vote_win_local || '-'})
              </span>
            </p>
          {/if}
        </div>

        <!--
        ODDS X (DRAW)
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
            class:active={fixtureVoteObj?.fixture_vote == 'X'}
            disabled={isVoteCasted || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            on:click={() => castVote('X', FIXTURE_VOTES_DATA._1x2.draw)}
          >
            <p
              class="
                  w-500
                  medium
                  row-space-out
                "
            >
              {#if mobileExclusive}
                <span
                  class="color-grey"
                >
                  X
                </span>
              {:else}
                <img
                  src="/assets/svg/icon/icon-close.svg"
                  alt="default alt text"
                  width="28"
                  height="28"
                />
              {/if}
              <span class:active_p={fixtureVoteObj?.fixture_vote == 'X'}>
                {#if FIXTURE_VOTES_DATA?._1x2?.draw}
                  {FIXTURE_VOTES_DATA?._1x2?.draw?.toString()}
                {:else}
                  -
                {/if}
              </span>
            </p>
          </button>
          <!--
          [ℹ] fixture-probability
          -->
          {#if !showBetSite && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                w-400
                probablitiy-text
                medium
              "
            >
              {B_VOT_T?.probability}
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
                  color-black-2
                "
              >
                {[0, undefined].includes(FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x) ? 0 : ((FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x / totalVoteCount) * 100).toFixed(0)}%
              </span>
              <span
                class="
                  w-400
                  color-grey
                "
              >
                ({FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x})
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
            class:active={fixtureVoteObj.fixture_vote == '2'}
            disabled={isVoteCasted || FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            on:click={() => castVote('2', FIXTURE_VOTES_DATA?._1x2?.away)}
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
              <span class:active_p={fixtureVoteObj?.fixture_vote == '2'}>
                {#if FIXTURE_VOTES_DATA?._1x2?.away}
                  {FIXTURE_VOTES_DATA?._1x2?.away.toString()}
                {:else}
                  -
                {/if}
              </span>
            </p>
          </button>

          <!--
          [ℹ] fixture-probability
          -->
          {#if !showBetSite && !FIXTURE_NO_VOTES_OPT.includes(FIXTURE_VOTES_DATA?.status)}
            <p
              class="
                w-400
                probablitiy-text
                medium
              "
            >
              {B_VOT_T?.probability}
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
                  color-black-2
                  w-500
                "
              >
                {[0, undefined].includes(FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor) ? 0 : ((FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor / totalVoteCount) * 100).toFixed(0)}%
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
      STAKE POP-UP DATA
      -->
      {#if showBetSite && SPORTBOOK_INFO}

        <div
          id="site-bet-box"
          in:fade
        >

          <img
            loading="lazy"
            src="/assets/svg/icon/white-close.svg"
            alt="default alt text"
            width="16"
            height="16"
            style="position: absolute; top: 12px; right: 20px;"
            on:click={() => (showBetSite = false)}
          />
          <a
            rel="nofollow"
            aria-label="{googleActionsStr.FP_VOTE}"
            on:click={() => googleEventLog(googleActionsStr.FP_VOTE)}
            target="_blank"
            href={SPORTBOOK_INFO?.register_link}
          >
            <img
              loading="lazy"
              id="stakesSiteImg"
              src={SPORTBOOK_INFO?.image}
              alt="default alt text"
              style="background-color: var({imageVar});"
              width="100%"
              height="40"
            />
          </a>

          <!--
          BOTTOM DATA
          -->
          <div
            id="inner-site-container"
          >

            <!--
            STAKES
            -->
            <div
              id="box-row"
              class="
                m-b-20
                row-space-out
              "
            >

              <!--
              WIN TYPE
              -->
              <div
                class="
                  text-center
                  stakes-info-box
                "
              >

                <!--
                TYPE OF VOTE
                -->
                <p
                  class="
                    w-400
                    medium
                    m-b-8
                    color-grey
                  "
                >
                  {#if fixtureVoteObj?.fixture_vote == '1'}
                    Home win
                  {:else if fixtureVoteObj?.fixture_vote == 'X'}
                    Draw
                  {:else}
                    Away win
                  {/if}
                </p>

                <!--
                BOX STAKES SHOW
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
                    {#if fixtureVoteObj?.fixture_vote == '1'}
                      <img src={FIXTURE_VOTES_DATA?.home_team_logo} alt="default alt text" width="28px" height="28px" />
                    {:else if fixtureVoteObj?.fixture_vote == 'X'}
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
                    bind:value={fixtureVoteObj.fixture_vote_val}
                    disabled
                  />

                </div>
              </div>

              <!--
              MULTIPLY SIGN
              -->
              <img
                src="/assets/svg/icon/icon-close.svg"
                alt="multiply-icon"
                width="16"
                height="16"
                style="margin-top: 25px;"
              />

              <!--
              STAKE VALUE
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
                  {B_VOT_T?.stake}
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
              EQUAL SIGN
              -->
              <img
                loading="lazy"
                src="/assets/svg/icon/icon-equally.svg"
                alt="icon-equlaity"
                width="16"
                height="16"
                style="margin-top: 25px;"
              />

              <!--
              WINNINGS
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
                  {B_VOT_T?.winnings}
                </p>
                <input
                  class="
                    w-500
                    input-value
                    medium
                    text-center
                  "
                  type="number"
                  value={(parseFloat(fixtureVoteObj?.fixture_vote_val) * user_stake_amount).toFixed(2)}
                  disabled
                />
              </div>

              <!--
              PLACE BET BUTTON 🖥️ LAPTOP
              -->
              {#if !mobileExclusive && !tabletExclusive}
                <a
                  rel="nofollow"
                  aria-label="{googleActionsStr.FP_VOTE}"
                  on:click={() => googleEventLog(googleActionsStr.FP_VOTE)}
                  target="_blank"
                  href={SPORTBOOK_INFO?.register_link}
                  class="anchor-bet-box"
                >
                  <button
                    class="
                      place-bet-btn
                      btn-primary
                    "
                  >
                    <p
                      class="small">
                      {B_VOT_T?.bet}
                    </p>
                  </button>
                </a>
              {/if}

            </div>

            <!--
            PLACE BET BUTTON 💻 TABLET + 🖥️ LAPTOP
            -->
            {#if mobileExclusive || tabletExclusive}
              <a
                rel="nofollow"
                aria-label="{googleActionsStr.FP_VOTE}"
                on:click={() => googleEventLog(googleActionsStr.FP_VOTE)}
                target="_blank"
                href={SPORTBOOK_INFO?.register_link}
                class="anchor-bet-box"
              >
                <button
                  class="
                    place-bet-btn
                    btn-primary
                    m-b-12
                  "
                >
                  <p
                    class="small">
                    {B_VOT_T?.bet}
                  </p>
                </button>
              </a>
            {/if}

            <!--
            BETTING SITE INFO
            -->
            <p
              class="
                small
                text-center
                color-grey
              "
            >
              {SPORTBOOK_INFO?.information}
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
