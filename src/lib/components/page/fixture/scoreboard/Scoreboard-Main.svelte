<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { getOrdinalNum, MONTH_NAMES_ABBRV, toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { dlog, SC_W_F_STY, SC_W_F_TAG, SC_W_F_TOG } from '$lib/utils/debug';
	import { googleActionsStr } from '$lib/utils/google.js';
	import { googleEventLog, viewport_change } from '$lib/utils/platform-functions.js';
	import { FIXTURE_FULL_TIME_OPT, FIXTURE_LIVE_TIME_OPT, FIXTURE_NOT_START_OPT } from "@betarena/scores-lib/dist/api/sportmonks.js";

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import close_icon from './assets/close.svg';

	import type { B_CONT_D } from '@betarena/scores-lib/types/content.js';
	import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
	import type { B_FS_D, B_FS_T } from '@betarena/scores-lib/types/scoreboard.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_SCOREBOARD: B_FS_D;
	export let FIXTURE_SCOREBOARD_TRANSLATION: B_FS_T;
  // (+) additional;
	export let FIXTURE_INFO: B_SAP_FP_D;
	export let FIXTURE_CONTENT: B_CONT_D[];
	export let FIXTURES_ODDS_T: B_FO_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;

  let SPORTBOOK_INFO: B_SPT_D;

	let mobileExclusive = false;
  let tabletExclusive = false;
	let noWidgetData: any = false;
	let secTickShow: boolean = false;
	let miniState: boolean = false;
	let dateDiff: number = 0;
	let showCountdown: boolean = true;
	let initialDivDistance: number = undefined;
	let count = 0;

  $: countDownSec = toZeroPrefixDateStr(Math.floor((dateDiff / 1000) % 60).toString());
	$: countDownMin = toZeroPrefixDateStr(Math.floor((dateDiff / 1000 / 60) % 60).toString());
	$: countDownHour = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60)) % 24).toString());
	$: countDownTestHour = Math.floor(dateDiff / (1000 * 60 * 60));

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ updating against "live" firebase data;
   * @returns
   * void
  */
	async function injectLiveData
  (
  ): Promise < void >
  {
		const fixture_id = FIXTURE_SCOREBOARD?.id;

    const if_M_0 =
      $sessionStore?.livescore_now_fixture_target?.id != fixture_id
    ;
    if (if_M_0) return;

    const liveFixtureData = $sessionStore?.livescore_now_fixture_target;

    // update fixture data w/live;
    FIXTURE_SCOREBOARD.minute =	liveFixtureData?.time?.minute;
    FIXTURE_SCOREBOARD.status =	liveFixtureData?.time?.status;
    FIXTURE_SCOREBOARD.teams.home.score =	liveFixtureData?.scores?.localteam_score;
    FIXTURE_SCOREBOARD.teams.away.score =	liveFixtureData?.scores?.visitorteam_score;
    FIXTURE_SCOREBOARD.score_post.ht_score = liveFixtureData?.scores?.ht_score;
    FIXTURE_SCOREBOARD.score_post.et_score = liveFixtureData?.scores?.et_score;
    FIXTURE_SCOREBOARD.score_post.ps_score = liveFixtureData?.scores?.ps_score;

    // IMPORTANT
    FIXTURE_SCOREBOARD = FIXTURE_SCOREBOARD;
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
          && firebaseSportbook.markets != null
          && firebaseSportbook.markets['1X2FT'] !=	null
          && firebaseSportbook.markets['1X2FT'].data[0].value != null
          && firebaseSportbook.markets['1X2FT'].data[1].value != null
          && firebaseSportbook.markets['1X2FT'].data[2].value != null
          && count != 1
        ;
        if (if_M_0)
        {
					FIXTURE_SCOREBOARD._1x2 =
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

		FIXTURE_SCOREBOARD = FIXTURE_SCOREBOARD;
  }

	function customScrollListen
  (
  ): void
  {
		let target_div = document.getElementById
    (
			'scoreboard-widget-container'
		);
		if (target_div == undefined)
    {
      dlog(`${SC_W_F_TAG} ❗️ target_div is null!`, SC_W_F_TOG, SC_W_F_STY);
			return;
		}

		if (count == 0)
    {
			initialDivDistance = target_div.getBoundingClientRect().bottom + window.scrollY;
			count = 1;
		}

		let distance_top_from_div = target_div.getBoundingClientRect().bottom;
		let distance_top_scroll = window.scrollY;

		// when in standard view;
    const if_M_0 =
      distance_top_from_div <= 0
      && !miniState
    ;
		if (if_M_0) miniState = true;

		// [ℹ] when [MINIATURE VIEW]
    const if_M_1 =
      initialDivDistance != undefined
      && count == 1
      && distance_top_scroll <= initialDivDistance
      && miniState
    ;
		if (if_M_1) miniState = false;

    return;
	}

	function toggleContentView
  (
		view: 'overview' | 'news'
	): void
  {
		$sessionStore.fixture_select_view = view;
		window.scrollTo
    (
      {
        top: 0,
        behavior: 'smooth'
		  }
    );
		setTimeout
    (
      async () =>
      {
        window.scrollTo
        (
          {
            top: 0,
            behavior: 'smooth'
          }
        );
		  },
      150
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
    // NOTE: (on-scroll)
    window.addEventListener
    (
			'scroll',
			customScrollListen
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
   * ➨ listens to target "fixture" in "livescores_now" data;
  */
  $: if ($sessionStore?.livescore_now_fixture_target)
  {
    injectLiveData()
  }

  /**
   * @summary
   * [MAIN]
   * [REACTIVE]
   * @description
   * ➨ listens to target "fixture" in "odds" data;
  */
  $: if ($sessionStore?.live_odds_fixture_target)
  {
    injectLiveOddsData()
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
   * [MAIN]
   * [REACTIVE]
   * @description
   * ➨ checks for "hide" / "show" odds+bet-site bool state;
  */
  $: if_R_1 =
    !FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)
    && FIXTURE_SCOREBOARD?._1x2?.home
    && FIXTURE_SCOREBOARD?._1x2?.draw
    && FIXTURE_SCOREBOARD?._1x2?.away
  ;

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

      // (+) other
      dateDiff = toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false).getTime() - new Date().getTime();
      setInterval
      (
        () =>
        {
          dateDiff = toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false).getTime() - new Date().getTime();
        },
        1000
      );
      setInterval
      (
        () =>
        {
          secTickShow = !secTickShow;
        },
        500
      );
    }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
TODO:
  ➨ clean up 💻 TABLET + 🖥️ LAPTOP (SCOREBOARD) TOP ROW
  ➨ clean up MINI-STATE section;
=================-->

<div
  id="widget-outer">

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={"Scoreboard"}
      NO_DATA_TITLE={"NO DATA"}
      NO_DATA_DESC={"NO DESCRIPTION"}
    />
	{/if}

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData && browser}

    <!--
    STANDARD STATE
    -->
    {#if !miniState}
      <div
        id="scoreboard-widget-container"
        class:dark-background-1={$userBetarenaSettings?.theme == 'Dark'}
      >

        <!--
        (SCOREBOARD) TOP ROW
        -->
        <div
          id="scoreboard-top-box"
          class="column-space-center"
          class:full-time={FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
        >

          <!--
          📱 MOBILE
          -->
          {#if mobileExclusive}

            <!--
            BACKGROUND GRADIENT
            -->
            <div
              id="background-gradient-box"
            />

            <!--
            LEAGUE INFO
            -->
            <div
              id="league-info-box"
              class="
                row-space-center
                m-b-15
                cursor-pointer
              "
            >
              <a
                href={FIXTURE_SCOREBOARD?.league_urls?.[$sessionStore?.serverLang]}
              >
                <div
                  id="league-info-img-box"
                  class="m-r-10"
                >
                  <img
                    src={FIXTURE_SCOREBOARD?.league_logo}
                    alt="default alt text"
                    width="14"
                    height="14"
                  />
                </div>
                <p
                  class="
                    color-white
                  "
                >
                  {FIXTURE_INFO?.data?.league_name}
                  - Round
                  {FIXTURE_SCOREBOARD?.round}
                </p>
              </a>
            </div>

            <!--
            TEAMS & STATUS
            -->
            <div
              id="fixture-info-box"
              class="
                row-space-out
                m-b-10
              "
            >

              <!--
              TEAM 1
              -->
              <div
                class="
                  column-space-center
                  team-box
                "
              >
                <img
                  src={FIXTURE_SCOREBOARD?.home_team_logo}
                  alt="default alt text"
                  class="m-b-12"
                  width="72"
                  height="72"
                />
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  "
                >
                  {FIXTURE_SCOREBOARD?.home_team_name}
                </p>
              </div>

              <!--
              FIXTURE (STATUS) UI
              -->
              {#if FIXTURE_NOT_START_OPT.includes(FIXTURE_SCOREBOARD?.status)}

                <div
                  style="align-self: center;"
                >
                  <!--
                  POSTPONED condition
                  -->
                  {#if ['POSTP', 'TBA'].includes(FIXTURE_SCOREBOARD?.status)}
                    <p
                      class="
                        s-14
                        w-500
                        color-grey
                        ft-text
                        text-center
                      "
                    >
                      {FIXTURES_ODDS_T?.status_abv?.[FIXTURE_SCOREBOARD?.status]}
                    </p>
                  {/if}

                  <!--
                  FIXTURE COUNTDOWN
                  -->
                  <p
                    class="
                      w-500
                      x-large
                      color-white
                      text-center
                    "
                    class:visibility-none={!showCountdown}
                  >
                    {countDownHour}:{countDownMin}:{countDownSec}
                  </p>

                  <!--
                  FIXTURE DATETIME
                  -->
                  <p
                    class="
                      w-400
                      small
                      color-grey
                      desktop-medium
                      text-center
                      no-wrap
                    "
                  >
                    {getOrdinalNum(toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false)?.getDate())}
                    {MONTH_NAMES_ABBRV[toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false)?.getMonth()?.toString()]}
                    {toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false).getFullYear().toString().substr(-2)},
                    {toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false).getHours().toString()}
                    :
                    {getOrdinalNum(toCorrectDate(FIXTURE_SCOREBOARD?.fixture_time, false).getMinutes())}
                    h
                  </p>
                </div>

              {:else}

                <div
                  class="
                    column-space-center
                  "
                >

                  <!--
                  FINAL FIXTURE STATUS
                  (+) FIXTURE CHECKPOINTS
                  -->
                  {#if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                    <p
                      class="
                        s-14
                        w-500
                        color-grey
                        ft-text
                      "
                    >
                      {FIXTURE_SCOREBOARD?.status}
                    </p>
                  {/if}

                  <!--
                  SCORE
                  -->
                  <p
                    class="
                      color-white
                      s-42
                      w-500
                    "
                  >
                    {FIXTURE_SCOREBOARD?.teams?.home?.score}
                    :
                    {FIXTURE_SCOREBOARD?.teams?.away?.score}
                  </p>

                  <!--
                  LIVE STATUS
                  (+) FIXTURE CHECKPOINTS
                  -->
                  {#if FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                    <p
                      class="
                        color-grey
                        s-16
                        w-400
                      "
                    >
                      {#if FIXTURE_SCOREBOARD.status == 'HT'}
                        HT
                      {:else}
                        {FIXTURE_SCOREBOARD?.minute}
                        <span
                          class:visibility-none={secTickShow}
                        >
                        '
                        </span>
                      {/if}

                      <span
                        class="
                          color-white
                        "
                      >
                        {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                          (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                        {/if}
                        {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                          (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                        {/if}
                        {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                          (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                        {/if}
                      </span>
                    </p>
                  {/if}

                  <!--
                  FINAL FIXTURE CHECKPOINTS
                  -->
                  {#if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                    <p
                      class="
                        s-14
                        w-500
                        color-grey
                      "
                    >
                      {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                        (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                        (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                        (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                      {/if}
                    </p>
                  {/if}

                </div>

              {/if}

              <!--
              TEAM 2
              -->
              <div
                class="
                  column-space-center
                  team-box
                "
              >
                <img
                  src={FIXTURE_SCOREBOARD.away_team_logo}
                  alt="default alt text"
                  class="m-b-12"
                  width="72"
                  height="72"
                />
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  "
                >
                  {FIXTURE_SCOREBOARD?.away_team_name}
                </p>
              </div>

            </div>

            <!--
            BET-SITE + ODDS
            -->
            {#if if_R_1}

              <!--
              BET-SITE
              -->
              <div
                class="
                  row-space-center
                  bet-site-box
                  m-b-8
                "
              >
                <p
                  class="
                    s-12
                    color-grey
                    m-r-10
                  "
                >
                  Featured by
                </p>
                <a
                  rel="nofollow"
                  href={SPORTBOOK_INFO?.register_link}
                  aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                  target="_blank"
                  on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                  style="width: fit-content;"
                >
                  <img
                    id="sportbook-logo-img"
                    src={SPORTBOOK_INFO?.image}
                    alt={SPORTBOOK_INFO?.title}
                    loading='lazy'
                  />
                </a>
              </div>

              <!--
              ODDS BOX
              -->
              <div
                id="btn-vote-container"
                class="row-space-center"
              >

                <!--
                [ℹ] ODDS #1
                -->
                <a
                  rel="nofollow"
                  aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                  on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                  href={SPORTBOOK_INFO?.register_link}
                  target="_blank"
                  style="width: fit-content;"
                >
                  <div
                    class="
                      odds-box
                      row-space-out
                    "
                  >
                    <!--
                    [ℹ] team-img / odds-type
                    -->
                    <p
                      class="
                        color-grey
                        s-14
                        w-500
                      "
                    >
                      1
                    </p>
                    <p
                      class="
                        color-white
                        s-14
                        w-500
                      "
                    >
                      {FIXTURE_SCOREBOARD
                        ?._1x2?.home}
                    </p>
                  </div>
                </a>

                <!--
                [ℹ] ODDS #X
                -->
                <a
                  rel="nofollow"
                  aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                  on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                  href={SPORTBOOK_INFO?.register_link}
                  target="_blank"
                  style="width: fit-content;"
                >
                  <div
                    class="
                      odds-box
                      row-space-out
                    "
                  >
                    <p
                      class="
                        color-grey
                        s-14
                        w-500
                      "
                    >
                      X
                    </p>
                    <p
                      class="
                        color-white
                        s-14
                        w-500
                      "
                    >
                      {FIXTURE_SCOREBOARD?._1x2?.draw}
                    </p>
                  </div>
                </a>

                <!--
                [ℹ] ODDS #2
                -->
                <a
                  rel="nofollow"
                  aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                  on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                  href={SPORTBOOK_INFO?.register_link}
                  target="_blank"
                  style="width: fit-content;"
                >
                  <div
                    class="
                      odds-box
                      row-space-out
                    "
                  >
                    <!--
                    [ℹ] team-img / odds-type
                    -->
                    <p
                      class="
                        color-grey
                        s-14
                        w-500
                      "
                    >
                      2
                    </p>
                    <p
                      class="
                        color-white
                        s-14
                        w-500
                      "
                    >
                      {FIXTURE_SCOREBOARD?._1x2?.away}
                    </p>
                  </div>
                </a>

              </div>

            {/if}

          <!--
          💻 TABLET
          -->
          {:else if !mobileExclusive && tabletExclusive}
            <!--
            [ℹ] background-gradient
            [ℹ] non-"FT"
            -->
            {#if !FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                id="background-gradient-box"
              />
            {/if}

            <!--
            [ℹ] league info
            -->
            <div
              id="league-info-box"
              class="
                row-space-center
                cursor-pointer
              "
            >
              <a
                href={FIXTURE_SCOREBOARD
                  ?.league_urls[
                  FIXTURE_SCOREBOARD_TRANSLATION
                    ?.lang
                ]}
              >
                <div
                  id="league-info-img-box"
                  class="m-r-10"
                >
                  <img
                    src={FIXTURE_SCOREBOARD?.league_logo}
                    alt="default alt text"
                    width="14"
                    height="14"
                  />
                </div>
                <p class="color-white">
                  {FIXTURE_INFO?.data
                    ?.league_name}
                  - Round
                  {FIXTURE_SCOREBOARD?.round}
                </p>
              </a>
            </div>

            <!--
            [ℹ] teams / fixture info box
            -->
            <div
              id="fixture-info-box"
              class="
                row-space-out
                m-b-20
              "
            >
              <!--
              [ℹ] team #1
              -->
              <div
                class="
                  column-space-center
                  team-box
                "
              >
                <img
                  src={FIXTURE_SCOREBOARD.home_team_logo}
                  alt="default alt text"
                  class="m-b-12"
                  width="72"
                  height="72"
                />
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  "
                >
                  {FIXTURE_SCOREBOARD.home_team_name}
                </p>
              </div>
              <!--
              [ℹ] fixture info
              [ℹ] =?> not-started UI
              [ℹ] =?> in-play UI
              [ℹ] =?> done UI
              -->
              {#if FIXTURE_NOT_START_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                <div
                  class="m-b-30"
                  style="align-self: center;"
                >
                  <!--
                  [ℹ] POSTPONED condition
                  -->
                  {#if FIXTURE_SCOREBOARD?.status === 'POSTP' || FIXTURE_SCOREBOARD?.status === 'TBA'}
                    <p
                      class="
                        s-14
                        w-500
                        color-grey
                        ft-text
                        text-center
                      "
                    >
                      {FIXTURES_ODDS_T
                        ?.status_abv[
                        FIXTURE_SCOREBOARD
                          ?.status
                      ]}
                    </p>
                  {/if}
                  <p
                    class="
                      w-500
                      s-20
                      color-white
                      text-center
                    "
                    class:visibility-none={!showCountdown}
                  >
                    {countDownHour}:{countDownMin}:{countDownSec}
                  </p>
                  <p
                    class="
                      w-400
                      s-16
                      color-grey
                      text-center
                    "
                    style="white-space: nowrap;"
                  >
                    {getOrdinalNum(
                      new Date(
                        FIXTURE_SCOREBOARD?.fixture_time +
                          'Z'
                      ).getDate()
                    )}
                    {MONTH_NAMES_ABBRV[
                      new Date(
                        FIXTURE_SCOREBOARD?.fixture_time
                      )
                        .getMonth()
                        .toString()
                    ]}
                    {new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    )
                      .getFullYear()
                      .toString()
                      .substr(-2)},
                    {new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    )
                      .getHours()
                      .toString()}:{(
                      '0' +
                      new Date(
                        FIXTURE_SCOREBOARD?.fixture_time +
                          'Z'
                      )
                        .getMinutes()
                        .toString()
                    ).slice(-2)}h
                  </p>
                </div>
              {:else if FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                <div
                  class="
                    column-space-center
                  "
                >
                  <p
                    class="
                      color-white
                      s-42
                      w-500
                    "
                  >
                    {FIXTURE_SCOREBOARD?.teams
                      ?.home?.score}
                    :
                    {FIXTURE_SCOREBOARD?.teams
                      ?.away?.score}
                  </p>
                  <p
                    class="
                      color-grey
                      s-16
                      w-400
                    "
                  >
                    {#if FIXTURE_SCOREBOARD.status == 'HT'}
                      HT
                    {:else}
                      {FIXTURE_SCOREBOARD?.minute}
                      <span
                        class:visibility-none={secTickShow}
                        >'
                      </span>
                    {/if}
                    <span class="color-white">
                      {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                        (HT {FIXTURE_SCOREBOARD
                          ?.score_post
                          ?.ht_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                        (ET {FIXTURE_SCOREBOARD
                          ?.score_post
                          ?.et_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                        (PS {FIXTURE_SCOREBOARD
                          ?.score_post
                          ?.ps_score})
                      {/if}
                    </span>
                  </p>
                </div>
              {:else if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                <div
                  class="
                    column-space-
                    m-t-15
                  "
                >
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                      ft-text
                    "
                  >
                    {FIXTURE_SCOREBOARD?.status}
                  </p>
                  <p
                    class="
                      color-white
                      s-42
                      w-500
                    "
                  >
                    {FIXTURE_SCOREBOARD?.teams
                      ?.home?.score}
                    :
                    {FIXTURE_SCOREBOARD?.teams
                      ?.away?.score}
                  </p>
                  <p
                    class="
                      s-16
                      w-500
                      color-grey
                    "
                  >
                    {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                      (HT {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.ht_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                      (ET {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.et_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                      (PS {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.ps_score})
                    {/if}
                  </p>
                </div>
              {/if}
              <!--
              [ℹ] team #2
              -->
              <div
                class="
                  column-space-center
                  team-box
                "
              >
                <img
                  src={FIXTURE_SCOREBOARD.away_team_logo}
                  alt="default alt text"
                  class="m-b-12"
                  width="72"
                  height="72"
                />
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  "
                >
                  {FIXTURE_SCOREBOARD.away_team_name}
                </p>
              </div>
            </div>

            <!--
            [ℹ] odds
            [ℹ] w/ betting site
            [ℹ] non-"FT"
            -->
            {#if !FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status) && FIXTURE_SCOREBOARD?._1x2?.home && FIXTURE_SCOREBOARD?._1x2?.draw && FIXTURE_SCOREBOARD?._1x2?.away}
              <div id="tablet-bet-odds-box">
                <!--
                [ℹ] betting site
                [ℹ] non-"FT"
                -->
                <div
                  class="
                    row-space-center
                    bet-site-box
                    m-b-8
                  "
                >
                  <p
                    class="
                      s-12
                      color-grey
                      m-r-10
                    "
                  >
                    Featured by
                  </p>
                  <a
                    rel="nofollow"
                    aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                    on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;"
                  >
                    <img
                      id="sportbook-logo-img"
                      src={SPORTBOOK_INFO?.image}
                      alt={SPORTBOOK_INFO?.title}
                      width="67"
                      height="28"
                    />
                  </a>
                </div>

                <!--
                [ℹ] odds
                [ℹ] non-"FT"
                -->
                <div
                  id="btn-vote-container"
                  class="row-space-center"
                >
                  <!--
                  [ℹ] ODDS #1 -->
                  <a
                    rel="nofollow"
                    aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                    on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;"
                  >
                    <div
                      class="
                        odds-box
                        row-space-out
                      "
                    >
                      <!--
                      [ℹ] team-img / odds-type
                      -->
                      <img
                        src={FIXTURE_SCOREBOARD.home_team_logo}
                        alt="home team bet icon"
                        width="28"
                        height="28"
                      />
                      <p
                        class="
                          color-white
                          s-14
                          w-500
                        "
                      >
                        {FIXTURE_SCOREBOARD
                          ?._1x2?.home}
                      </p>
                    </div>
                  </a>

                  <!--
                  [ℹ] ODDS #X -->
                  <a
                    rel="nofollow"
                    aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                    on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;"
                  >
                    <div
                      class="
                        odds-box
                        row-space-out
                      "
                    >
                      <!--
                      [ℹ] team-img / odds-type
                      -->
                      <img
                        src={close_icon}
                        alt="bet draw icon"
                        width="28"
                        height="28"
                      />
                      <p
                        class="
                          color-white
                          s-14
                          w-500
                        "
                      >
                        {FIXTURE_SCOREBOARD
                          ?._1x2?.draw}
                      </p>
                    </div>
                  </a>

                  <!--
                  [ℹ] ODDS #2 -->
                  <a
                    rel="nofollow"
                    aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                    on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;"
                  >
                    <div
                      class="
                        odds-box
                        row-space-out
                      "
                    >
                      <!--
                      [ℹ] team-img / odds-type
                      -->
                      <img
                        src={FIXTURE_SCOREBOARD.away_team_logo}
                        alt="away team bet icon"
                        width="28"
                        height="28"
                      />
                      <p
                        class="
                          color-white
                          s-14
                          w-500
                        "
                      >
                        {FIXTURE_SCOREBOARD
                          ?._1x2?.away}
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            {/if}

          <!--
          🖥️ LAPTOP
          -->
          {:else}
            <div
              class="
                row-space-out
              "
            >
              <!--
              [ℹ] team #1
              -->
              <div
                class="
                  column-space-center
                  team-box
                "
              >
                <div class="inner-team-box-1">
                  <img
                    src={FIXTURE_SCOREBOARD.home_team_logo}
                    alt="default alt text"
                    class="m-b-12"
                    width="88"
                    height="88"
                  />
                  <p
                    class="
                      s-14
                      w-500
                      color-white
                    "
                  >
                    {FIXTURE_SCOREBOARD.home_team_name}
                  </p>
                </div>
              </div>

              <!--
              [ℹ] league info
              [ℹ] fixture info box
              [ℹ] bet-site + odds
              -->
              <div
                class="column-space-center"
              >
                <div
                  id="league-info-box"
                  class="
                    row-space-center
                    cursor-pointer
                    m-b-20
                  "
                >
                  <a
                    href={FIXTURE_SCOREBOARD
                      ?.league_urls[
                      FIXTURE_SCOREBOARD_TRANSLATION
                        ?.lang
                    ]}
                  >
                    <div
                      id="league-info-img-box"
                      class="m-r-10"
                    >
                      <img
                        src={FIXTURE_SCOREBOARD?.league_logo}
                        alt="default alt text"
                        width="14"
                        height="14"
                      />
                    </div>
                    <p class="color-white">
                      {FIXTURE_INFO?.data
                        ?.league_name}
                      - Round
                      {FIXTURE_SCOREBOARD?.round}
                    </p>
                  </a>
                </div>

                <!--
                [ℹ] fixture info
                [ℹ] =?> not-started UI
                [ℹ] =?> in-play UI
                [ℹ] =?> done UI
                -->
                {#if FIXTURE_NOT_START_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                  <div
                    class="m-b-20"
                    style="align-self: center;"
                  >
                    <!--
                    [ℹ] POSTPONED condition
                    -->
                    {#if FIXTURE_SCOREBOARD?.status === 'POSTP' || FIXTURE_SCOREBOARD?.status === 'TBA'}
                      <p
                        class="
                          s-14
                          w-500
                          color-grey
                          ft-text
                          text-center
                        "
                      >
                        {FIXTURES_ODDS_T
                          ?.status_abv[
                          FIXTURE_SCOREBOARD
                            ?.status
                        ]}
                      </p>
                    {/if}
                    <p
                      class="
                        w-500
                        s-20
                        color-white
                        text-center
                      "
                      class:visibility-none={!showCountdown}
                    >
                      {countDownHour}:{countDownMin}:{countDownSec}
                    </p>
                    <p
                      class="
                        w-400
                        s-16
                        color-grey
                        text-center
                      "
                      style="white-space: nowrap;"
                    >
                      {getOrdinalNum(
                        new Date(
                          FIXTURE_SCOREBOARD?.fixture_time +
                            'Z'
                        ).getDate()
                      )}
                      {MONTH_NAMES_ABBRV[
                        new Date(
                          FIXTURE_SCOREBOARD?.fixture_time +
                            'Z'
                        )
                          .getMonth()
                          .toString()
                      ]}
                      {new Date(
                        FIXTURE_SCOREBOARD?.fixture_time +
                          'Z'
                      )
                        .getFullYear()
                        .toString()
                        .substr(-2)},
                      {new Date(
                        FIXTURE_SCOREBOARD?.fixture_time +
                          'Z'
                      )
                        .getHours()
                        .toString()}:{(
                        '0' +
                        new Date(
                          FIXTURE_SCOREBOARD?.fixture_time +
                            'Z'
                        )
                          .getMinutes()
                          .toString()
                      ).slice(-2)}h
                    </p>
                  </div>
                {:else if FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                  <div
                    class="
                      column-space-center
                      m-b-10
                    "
                  >
                    <p
                      class="
                        color-white
                        s-42
                        w-500
                      "
                    >
                      {FIXTURE_SCOREBOARD
                        ?.teams?.home?.score}
                      :
                      {FIXTURE_SCOREBOARD
                        ?.teams?.away?.score}
                    </p>
                    <p
                      class="
                        color-grey
                        s-16
                        w-400
                      "
                    >
                      {#if FIXTURE_SCOREBOARD.status == 'HT'}
                        HT
                      {:else}
                        {FIXTURE_SCOREBOARD?.minute}
                        <span
                          class:visibility-none={secTickShow}
                          >'
                        </span>
                      {/if}
                      <span
                        class="color-white"
                      >
                        {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                          (HT {FIXTURE_SCOREBOARD
                            ?.score_post
                            ?.ht_score})
                        {/if}
                        {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                          (ET {FIXTURE_SCOREBOARD
                            ?.score_post
                            ?.et_score})
                        {/if}
                        {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                          (PS {FIXTURE_SCOREBOARD
                            ?.score_post
                            ?.ps_score})
                        {/if}
                      </span>
                    </p>
                  </div>
                {:else if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
                  <div
                    class="
                      column-space-center
                    "
                  >
                    <p
                      class="
                        s-14
                        w-500
                        color-grey
                        ft-text
                      "
                    >
                      {FIXTURE_SCOREBOARD?.status}
                    </p>
                    <p
                      class="
                        color-white
                        s-42
                        w-500
                      "
                    >
                      {FIXTURE_SCOREBOARD
                        ?.teams?.home?.score}
                      :
                      {FIXTURE_SCOREBOARD
                        ?.teams?.away?.score}
                    </p>
                    <p
                      class="
                        s-16
                        w-500
                        color-grey
                      "
                    >
                      {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                        (HT {FIXTURE_SCOREBOARD
                          ?.score_post
                          ?.ht_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                        (ET {FIXTURE_SCOREBOARD
                          ?.score_post
                          ?.et_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                        (PS {FIXTURE_SCOREBOARD
                          ?.score_post
                          ?.ps_score})
                      {/if}
                    </p>
                  </div>
                {/if}

                <!--
                [ℹ] odds
                [ℹ] w/ betting site
                [ℹ] non-"FT"
                -->
                {#if !FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status) && FIXTURE_SCOREBOARD?._1x2?.home && FIXTURE_SCOREBOARD?._1x2?.draw && FIXTURE_SCOREBOARD?._1x2?.away}
                  <div
                    id="tablet-bet-odds-box"
                  >
                    <!--
                    [ℹ] betting site
                    [ℹ] non-"FT"
                    -->
                    <div
                      class="
                        row-space-center
                        bet-site-box
                        m-b-8
                      "
                    >
                      <p
                        class="
                          s-12
                          color-grey
                          m-r-10
                        "
                      >
                        Featured by
                      </p>
                      <a
                        rel="nofollow"
                        aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                        on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                        href={SPORTBOOK_INFO?.register_link}
                        target="_blank"
                        style="width: fit-content;"
                      >
                        <img
                          id="sportbook-logo-img"
                          src={SPORTBOOK_INFO?.image}
                          alt={SPORTBOOK_INFO?.title}
                          width="67"
                          height="28"
                        />
                      </a>
                    </div>

                    <!--
                    [ℹ] odds
                    [ℹ] non-"FT"
                    -->
                    <div
                      id="btn-vote-container"
                      class="row-space-center"
                    >
                      <!--
                      [ℹ] ODDS #1
                      -->
                      <a
                        rel="nofollow"
                        aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                        on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                        href={SPORTBOOK_INFO?.register_link}
                        target="_blank"
                        style="width: fit-content;"
                      >
                        <div
                          class="
                            odds-box
                            row-space-out
                          "
                        >
                          <!--
                          [ℹ] team-img / odds-type
                          -->
                          <img
                            src={FIXTURE_SCOREBOARD.home_team_logo}
                            alt="home team bet icon"
                            width="28"
                            height="28"
                          />
                          <p
                            class="
                              color-white
                              s-14
                              w-500
                            "
                          >
                            {FIXTURE_SCOREBOARD
                              ?._1x2?.home}
                          </p>
                        </div>
                      </a>

                      <!--
                      [ℹ] ODDS #X
                      -->
                      <a
                        rel="nofollow"
                        aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                        on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                        href={SPORTBOOK_INFO?.register_link}
                        target="_blank"
                        style="width: fit-content;"
                      >
                        <div
                          class="
                            odds-box
                            row-space-out
                          "
                        >
                          <!--
                          [ℹ] team-img / odds-type
                          -->
                          <img
                            src={close_icon}
                            alt="bet draw icon"
                            width="28"
                            height="28"
                          />
                          <p
                            class="
                              color-white
                              s-14
                              w-500
                            "
                          >
                            {FIXTURE_SCOREBOARD
                              ?._1x2?.draw}
                          </p>
                        </div>
                      </a>

                      <!--
                      [ℹ] ODDS #2
                      -->
                      <a
                        rel="nofollow"
                        aria-label="{googleActionsStr.FP_SCRB_BET_SITE}"
                        on:click={() => googleEventLog(googleActionsStr.FP_SCRB_BET_SITE)}
                        href={SPORTBOOK_INFO?.register_link}
                        target="_blank"
                        style="width: fit-content;"
                      >
                        <div
                          class="
                            odds-box
                            row-space-out
                          "
                        >
                          <!--
                          [ℹ] team-img / odds-type
                          -->
                          <img
                            src={FIXTURE_SCOREBOARD.away_team_logo}
                            alt="away team bet icon"
                            width="28"
                            height="28"
                          />
                          <p
                            class="
                              color-white
                              s-14
                              w-500
                            "
                          >
                            {FIXTURE_SCOREBOARD
                              ?._1x2?.away}
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                {/if}
              </div>

              <!--
              [ℹ] team #2
              -->
              <div
                class="
                  column-space-center
                  team-box
                "
              >
                <div class="inner-team-box-2">
                  <img
                    src={FIXTURE_SCOREBOARD.away_team_logo}
                    alt="default alt text"
                    class="m-b-12"
                    width="88"
                    height="88"
                  />
                  <p
                    class="
                      s-14
                      w-500
                      color-white
                    "
                  >
                    {FIXTURE_SCOREBOARD.away_team_name}
                  </p>
                </div>
              </div>
            </div>
          {/if}

        </div>

        <!--
        (SCOREBOARD) BOTTOM ROW
        -->
        <div
          id="scoreboard-bottom-nav-box"
          class="row-space-even"
        >

          <!--
          OVERVIEW TAB
          -->
          <div
            class="
              opt-container
              cursor-pointer
            "
            on:click={() => toggleContentView('overview')}
            class:activeOpt={$sessionStore?.fixture_select_view == 'overview'}
          >
            <p
              class="
                s-14
                color-grey
                w-500
                no-wrap
              "
            >
              {FIXTURE_SCOREBOARD_TRANSLATION?.overview}
            </p>
          </div>

          <!--
          CONTENT-NEWS TAB
          -->
          {#if FIXTURE_CONTENT?.length > 0}
            <div
              class="
                opt-container
                cursor-pointer
              "
              on:click={() => toggleContentView('news')}
              class:activeOpt={$sessionStore?.fixture_select_view == 'news'}
            >
              <p
                class="
                  s-14
                  color-grey
                  w-500
                  no-wrap
                "
              >
                {FIXTURE_SCOREBOARD_TRANSLATION?.news_views}
              </p>
            </div>
          {/if}

        </div>

      </div>

    <!--
    MINI-STATE
    -->
    {:else}

      <div
        id="empty-widget-placeholder"
        class:full-time={FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
      />

      <div
        id="scoreboard-widget-container"
        class="miniature"
        class:tablet-miniature={!mobileExclusive}
        class:dark-background-1={$userBetarenaSettings?.theme == 'Dark'}
      >

        <!--
        📱 MOBILE
        -->
        {#if mobileExclusive}

          <!--
          [ℹ] teams / fixture info box
          -->
          <div
            id="fixture-info-box"
            class="
              row-space-center
            "
          >

            <!--
            [ℹ] team #1
            -->
            <div
              class="
                row-space-out
                team-box
                one
              "
            >
              <p
                class="
                  s-14
                  w-500
                  color-white
                "
              >
                {FIXTURE_SCOREBOARD?.home_team_short_code}
              </p>
              <img
                src={FIXTURE_SCOREBOARD?.home_team_logo}
                alt="default alt text"
                width="40"
                height="40"
              />
            </div>

            <!--
            [ℹ] fixture info
            [ℹ] =?> not-started UI
            [ℹ] =?> in-play UI
            [ℹ] =?> done UI
            -->
            {#if FIXTURE_NOT_START_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                class="middle-info"
                style="align-self: center;"
              >

                <!--
                [ℹ] POSTPONED condition
                -->
                {#if FIXTURE_SCOREBOARD?.status === 'POSTP' || FIXTURE_SCOREBOARD?.status === 'TBA'}
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                      ft-text
                      text-center
                    "
                  >
                    {FIXTURES_ODDS_T?.status_abv?.[FIXTURE_SCOREBOARD?.status]}
                  </p>
                {/if}

                <p
                  class="
                    w-500
                    x-large
                    desktop-x-large
                    color-white
                    text-center
                  "
                  class:visibility-none={!showCountdown}
                >
                  {countDownHour}:{countDownMin}:{countDownSec}
                </p>

                <p
                  class="
                    w-400
                    small
                    color-grey
                    desktop-medium
                    text-center
                  "
                  style="white-space: nowrap;"
                >
                  {getOrdinalNum
                    (
                    new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    ).getDate()
                  )}
                  {MONTH_NAMES_ABBRV[
                    new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    )
                      .getMonth()
                      .toString()
                  ]}
                  {new Date(
                    FIXTURE_SCOREBOARD?.fixture_time +
                      'Z'
                  )
                    .getFullYear()
                    .toString()
                    .substr(-2)},
                  {new Date(
                    FIXTURE_SCOREBOARD?.fixture_time
                  )
                    .getHours()
                    .toString()}:{(
                    '0' +
                    new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    )
                      .getMinutes()
                      .toString()
                  ).slice(-2)}h
                </p>
              </div>
            {:else if FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                class="
                  column-space-center
                  middle-info
                "
              >
                <!--
                [ℹ] LIVE score
                -->
                <p
                  class="
                    color-white
                    s-32
                    w-500
                  "
                >
                  {FIXTURE_SCOREBOARD?.teams
                    ?.home?.score}
                  :
                  {FIXTURE_SCOREBOARD?.teams
                    ?.away?.score}
                </p>
                <!--
                [ℹ] LIVE minutes
                -->
                <p
                  class="
                    color-grey
                    s-14
                    w-400
                    minute-text
                  "
                >
                  {#if FIXTURE_SCOREBOARD.status == 'HT'}
                    HT
                  {:else}
                    {FIXTURE_SCOREBOARD?.minute}
                    <span
                      class:visibility-none={secTickShow}
                      >'
                    </span>
                  {/if}
                  <span class="color-white">
                    {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                      (HT {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.ht_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                      (ET {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.et_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                      (PS {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.ps_score})
                    {/if}
                  </span>
                </p>
              </div>
            {:else if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                class="
                  column-space-center
                  middle-info
                "
              >
                <!--
                [ℹ] FT score
                -->
                <p
                  class="
                    color-white
                    s-32
                    w-500
                  "
                >
                  {FIXTURE_SCOREBOARD?.teams
                    ?.home?.score}
                  :
                  {FIXTURE_SCOREBOARD?.teams
                    ?.away?.score}
                </p>
                <!--
                [ℹ] FT scores
                -->
                <p
                  class="
                    s-14
                    w-500
                    color-grey
                  "
                >
                  {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                    (HT {FIXTURE_SCOREBOARD
                      ?.score_post?.ht_score})
                  {/if}
                  {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                    (ET {FIXTURE_SCOREBOARD
                      ?.score_post?.et_score})
                  {/if}
                  {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                    (PS {FIXTURE_SCOREBOARD
                      ?.score_post?.ps_score})
                  {/if}
                </p>
              </div>
            {/if}

            <!--
            [ℹ] team #2
            -->
            <div
              class="
                row-space-out
                team-box
                two
              "
            >
              <img
                src={FIXTURE_SCOREBOARD?.away_team_logo}
                alt="default alt text"
                width="40"
                height="40"
              />
              <p
                class="
                  s-14
                  w-500
                  color-white
                "
              >
                {FIXTURE_SCOREBOARD?.away_team_short_code}
              </p>
            </div>

          </div>

          <!--
          [ℹ] bottom-navigation
          -->
          <div
            id="scoreboard-bottom-nav-box"
            class="row-space-even"
          >

            <div
              class="
                opt-container
                cursor-pointer
              "
              on:click={() => toggleContentView('overview')}
              class:activeOpt={$sessionStore.fixture_select_view == 'overview'}
            >
              <p
                class="
                  s-14
                  color-grey
                  w-500
                  no-wrap
                "
              >
                {FIXTURE_SCOREBOARD_TRANSLATION?.overview}
              </p>
            </div>

            {#if FIXTURE_CONTENT != undefined && FIXTURE_CONTENT.length != 0}
              <div
                class="
                  opt-container
                  cursor-pointer
                "
                on:click={() => toggleContentView('news')}
                class:activeOpt={$sessionStore.fixture_select_view == 'news'}
              >
                <p
                  class="
                    s-14
                    color-grey
                    w-500
                    no-wrap
                  "
                >
                  {FIXTURE_SCOREBOARD_TRANSLATION?.news_views}
                </p>
              </div>
            {/if}

          </div>

        <!--
        💻 TABLET && 🖥️ LAPTOP
        -->
        {:else}

          <!--
          [ℹ] teams / fixture info box
          -->
          <div
            id="fixture-info-box"
            class="
              row-space-center
            "
          >
            <!--
            [ℹ] team #1
            -->
            <div
              class="
                column-space-center
                team-box
                one
              "
            >
              <div
                class="
                  row-space-out
                  inner-team-box-1
                "
                class:full-time={FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              >
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  "
                >
                  {FIXTURE_SCOREBOARD?.home_team_name}
                </p>
                <img
                  src={FIXTURE_SCOREBOARD?.home_team_logo}
                  alt="default alt text"
                  width="56"
                  height="56"
                />
              </div>
            </div>

            <!--
            [ℹ] fixture info
            [ℹ] =?> not-started UI
            [ℹ] =?> in-play UI
            [ℹ] =?> done UI
            -->
            {#if FIXTURE_NOT_START_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                class="middle-info"
                style="align-self: center;"
              >
                <!--
                [ℹ] POSTPONED condition
                -->
                {#if FIXTURE_SCOREBOARD?.status === 'POSTP' || FIXTURE_SCOREBOARD?.status === 'TBA'}
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                      ft-text
                      text-center
                    "
                  >
                    {FIXTURES_ODDS_T
                      ?.status_abv[
                      FIXTURE_SCOREBOARD
                        ?.status
                    ]}
                  </p>
                {/if}
                <p
                  class="
                    w-500
                    s-20
                    color-white
                    text-center
                  "
                  class:visibility-none={!showCountdown}
                >
                  {countDownHour}:{countDownMin}:{countDownSec}
                </p>
                <p
                  class="
                    w-400
                    s-16
                    color-grey
                    desktop-medium
                    text-center
                  "
                  style="white-space: nowrap;"
                >
                  {getOrdinalNum(
                    new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    ).getDate()
                  )}
                  {MONTH_NAMES_ABBRV[
                    new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    )
                      .getMonth()
                      .toString()
                  ]}
                  {new Date(
                    FIXTURE_SCOREBOARD?.fixture_time +
                      'Z'
                  )
                    .getFullYear()
                    .toString()
                    .substr(-2)},
                  {new Date(
                    FIXTURE_SCOREBOARD?.fixture_time +
                      'Z'
                  )
                    .getHours()
                    .toString()}:{(
                    '0' +
                    new Date(
                      FIXTURE_SCOREBOARD?.fixture_time +
                        'Z'
                    )
                      .getMinutes()
                      .toString()
                  ).slice(-2)}h
                </p>
              </div>
            {:else if FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                class="
                  column-space-center
                  middle-info
                "
              >
                <!--
                [ℹ] LIVE score
                -->
                <p
                  class="
                    color-white
                    s-32
                    w-500
                  "
                >
                  {FIXTURE_SCOREBOARD?.teams
                    ?.home?.score}
                  :
                  {FIXTURE_SCOREBOARD?.teams
                    ?.away?.score}
                </p>
                <!--
                [ℹ] LIVE minutes
                -->
                <p
                  class="
                    color-grey
                    s-16
                    w-400
                  "
                >
                  {#if FIXTURE_SCOREBOARD.status == 'HT'}
                    HT
                  {:else}
                    {FIXTURE_SCOREBOARD?.minute}
                    <span
                      class:visibility-none={secTickShow}
                      >'
                    </span>
                  {/if}
                  <span class="color-white">
                    {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                      (HT {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.ht_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                      (ET {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.et_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                      (PS {FIXTURE_SCOREBOARD
                        ?.score_post
                        ?.ps_score})
                    {/if}
                  </span>
                </p>
              </div>
            {:else if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_SCOREBOARD?.status)}
              <div
                class="
                  column-space-center
                  middle-info
                "
              >
                <!--
                [ℹ] FT score
                -->
                <p
                  class="
                    color-white
                    s-32
                    w-500
                    no-wrap
                  "
                >
                  {FIXTURE_SCOREBOARD?.teams
                    ?.home?.score}
                  :
                  {FIXTURE_SCOREBOARD?.teams
                    ?.away?.score}
                </p>
                <!--
                [ℹ] FT scores
                -->
                <p
                  class="
                    s-16
                    w-500
                    color-grey
                  "
                >
                  {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                    (HT {FIXTURE_SCOREBOARD
                      ?.score_post?.ht_score})
                  {/if}
                  {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                    (ET {FIXTURE_SCOREBOARD
                      ?.score_post?.et_score})
                  {/if}
                  {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                    (PS {FIXTURE_SCOREBOARD
                      ?.score_post?.ps_score})
                  {/if}
                </p>
              </div>
            {/if}

            <!--
            [ℹ] team #2
            -->
            <div
              class="
                column-space-center
                team-box
                two
              "
            >
              <div
                class="
                  row-space-out
                  inner-team-box-2
                "
                class:full-time={FIXTURE_FULL_TIME_OPT.includes(
                  FIXTURE_SCOREBOARD?.status
                )}
              >
                <img
                  src={FIXTURE_SCOREBOARD.away_team_logo}
                  alt="default alt text"
                  width="56px"
                  height="56px"
                />
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  "
                >
                  {FIXTURE_SCOREBOARD.away_team_name}
                </p>
              </div>
            </div>

          </div>

          <!--
          [ℹ] bottom-navigation
          -->
          <div
            id="scoreboard-bottom-nav-box"
            class="row-space-even"
          >
            <div
              class="
                opt-container
                cursor-pointer
              "
              on:click={() => toggleContentView('overview')}
              class:activeOpt={$sessionStore.fixture_select_view == 'overview'}
            >
              <p
                class="
                  s-14
                  color-grey
                  w-500
                  no-wrap
                "
              >
                {FIXTURE_SCOREBOARD_TRANSLATION?.overview}
              </p>
            </div>

            {#if FIXTURE_CONTENT != undefined && FIXTURE_CONTENT.length != 0}
              <div
                class="
                  opt-container
                  cursor-pointer
                "
                on:click={() => toggleContentView('news')}
                class:activeOpt={$sessionStore.fixture_select_view == 'news'}
              >
                <p
                  class="
                    s-14
                    color-grey
                    w-500
                    no-wrap
                  "
                >
                  {FIXTURE_SCOREBOARD_TRANSLATION?.news_views}
                </p>
              </div>
            {/if}
          </div>

        {/if}

      </div>

    {/if}

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* scorebaord-main */
	#scoreboard-widget-container
  {
		background-color: #4b4b4b;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		padding: none;
	}

	/*
  scorebaord-top
  */
	div#scoreboard-widget-container div#scoreboard-top-box
  {
		position: relative;
		padding: 20px 12px;
		min-height: 282px;
		max-height: 282px;
		background-image: url(./assets/banner-mobile.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box.full-time
  {
		min-height: 215px;
		max-height: 215px;
	}

	/*
  league-info
  */
	div#scoreboard-widget-container	div#scoreboard-top-box div#league-info-box div#league-info-img-box
  {
		background-color: #ffffff;
		border-radius: 50%;
		padding: 3px;
		width: 20px;
		height: 20px;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box div#league-info-box div#league-info-img-box img
  {
		width: 14px;
		height: 14px;
	}

	/*
  team-info style
  */
	div#scoreboard-widget-container	div#scoreboard-top-box div#fixture-info-box
  {
		display: grid;
		grid-auto-flow: column;
		justify-items: center;
		align-items: start;
		justify-content: center;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: center;
		z-index: 1;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box div#fixture-info-box	div.team-box img
  {
		width: 72px;
		height: 72px;
	}
	div#scoreboard-widget-container	span.visibility-none
  {
		visibility: hidden;
	}

	/*
  bet-site
  */
	div#scoreboard-widget-container	div#scoreboard-top-box div.bet-site-box	img
  {
		width: 67px;
		height: 28px;
		border-radius: 5.49px;
		object-fit: cover;
		z-index: 1;
	}

	/*
  odds style
  */
	div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container a
  {
		width: 100% !important;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container a	div.odds-box
  {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid #4b4b4b;
		backdrop-filter: blur(4px);
		border-radius: 8px;
		padding: 10px 16px;
		height: 48px;
		z-index: 1;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container	a div.odds-box
  {
		margin-right: 8px;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container a:last-child div.odds-box
  {
		margin-right: 0px;
	}
	div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container	a	div.odds-box img
  {
		width: 28px;
		height: 28px;
	}

	/* fixture-time [completion] */
	div#scoreboard-widget-container
		div#scoreboard-top-box
		div.fixture-time-btm {
		z-index: 1;
	}

	/* bottom nav */
	div#scoreboard-widget-container	div#scoreboard-bottom-nav-box
  {
		background-color: #ffffff;
		padding: 20px 10px 0 10px;
	}
	div#scoreboard-widget-container	div#scoreboard-bottom-nav-box	div.opt-container
  {
		border-bottom: solid 2.5px transparent;
		width: 100%;
		text-align: center;
	}
	div#scoreboard-widget-container	div#scoreboard-bottom-nav-box	div.opt-container p
  {
		padding-bottom: 12px;
	}
	div#scoreboard-widget-container div#scoreboard-bottom-nav-box	div.opt-container.activeOpt
  {
		border-color: #f5620f;
	}
	div#scoreboard-widget-container	div#scoreboard-bottom-nav-box div.opt-container.activeOpt	p {
		color: #f5620f !important;
	}

	/* background-gradient */
	div#background-gradient-box
  {
		position: absolute;
		bottom: 0;
		background: linear-gradient(
			180deg,
			rgba(41, 41, 41, 0) 4.48%,
			#292929 46.39%
		);
		height: 60px;
		width: 100%;
		z-index: 0;
	}

	/* miniature [ONLY] [MOBILE] */
	div#empty-widget-placeholder
  {
		min-height: 334px;
		max-height: 334px;
	}
	div#empty-widget-placeholder.full-time
  {
		min-height: 267px;
		max-height: 267px;
	}
	div#scoreboard-widget-container.miniature
  {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		border-radius: 0 !important;
		background: #292929 !important;
		z-index: 1000;
	}
	div#scoreboard-widget-container.miniature	div#fixture-info-box
  {
		padding: 20px 10px;
		min-height: 80px;
		max-height: 80px;
	}
	div#scoreboard-widget-container.miniature	div#fixture-info-box div.team-box
  {
		width: auto;
	}
	div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.one
  {
		margin-right: 20px;
	}
	div#scoreboard-widget-container.miniature	div#fixture-info-box div.team-box.one	p
  {
		margin-right: 15px;
	}
	div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.two
  {
		margin-left: 20px;
	}
	div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.two p
  {
		margin-left: 15px;
	}
	div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box	img
  {
		width: 40px;
		height: 40px;
	}
	div#scoreboard-widget-container.miniature	div#fixture-info-box div.team-box p
  {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 35px;
	}
	div#scoreboard-widget-container.miniature	div#fixture-info-box div.middle-info p.minute-text
  {
		margin-top: -5px;
	}
	div#scoreboard-widget-container.miniature	div#fixture-info-box div.middle-info
  {
		width: auto;
	}
	div#scoreboard-widget-container.miniature	div#scoreboard-bottom-nav-box
  {
		background-color: #ffffff;
		padding: 10px 15px 0 15px;
	}
	div#scoreboard-widget-container.miniature	div#scoreboard-bottom-nav-box	div.opt-container	p
  {
		padding-bottom: 8px;
	}

	/* miniature [ONLY] [TABLET] && [DESKTOP] */
	div#scoreboard-widget-container.miniature.tablet-miniature
  {
		position: fixed;
		top: 10px;
		right: auto;
		left: auto;
		border-radius: 12px !important;
		background-image: url(./assets/banner.png) !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
		background-size: cover !important;
		max-width: 1362px;
		width: calc(100vw - 68px);
		z-index: 1000;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box
  {
		padding: 20px 10px;
		min-height: 98px;
		max-height: 98px;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box p
  {
		overflow: visible;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 200px;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box
  {
		position: relative;
		width: -webkit-fill-available;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box img
  {
		width: 56px;
		height: 56px;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box div.inner-team-box-1
  {
		position: absolute;
		right: 5px;
		width: auto;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.team-box div.inner-team-box-2
  {
		position: absolute;
		left: 5px;
		width: auto;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box div.inner-team-box-1	p,
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.team-box div.inner-team-box-2	p
  {
		font-size: 16px;
	}
	div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.middle-info
  {
		min-width: 134px;
		max-width: 134px;
		white-space: nowrap;
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

		#scoreboard-widget-container
    {
			min-width: 100%;
		}

		/*
    scorebaord-top
    */
		div#scoreboard-widget-container	div#scoreboard-top-box
    {
			min-height: 254px;
			max-height: 254px;
			background-image: url(./assets/banner-tablet.png);
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
		div#scoreboard-widget-container	div#scoreboard-top-box.full-time
    {
			min-height: 200px;
			max-height: 200px;
		}

		/*
    placeholder during miniature
    */
		div#empty-widget-placeholder
    {
			min-height: 306px;
			max-height: 306px;
		}
		div#empty-widget-placeholder.full-time
    {
			min-height: 252px;
			max-height: 252px;
		}

		/*
    odds-bet style
    */
		div#tablet-bet-odds-box
    {
			position: relative;
			width: -webkit-fill-available;
		}
		div#tablet-bet-odds-box div.bet-site-box
    {
			position: absolute;
			bottom: 100%;
		}

		/*
    background-gradient
    */
		div#background-gradient-box
    {
			height: 60px;
			width: 100%;
		}
	}

	@media only screen
  and (min-width: 726px)
  {

		/*
    bottom nav
    */
		div#scoreboard-widget-container	div#scoreboard-bottom-nav-box
    {
			justify-content: center !important;
		}
		div#scoreboard-widget-container	div#scoreboard-bottom-nav-box	div.opt-container
    {
			width: fit-content;
			margin-right: 32px;
		}
		div#scoreboard-widget-container	div#scoreboard-bottom-nav-box	div.opt-container:last-child
    {
			margin-right: 0;
		}

		/*
    team-info style
    */
		div#scoreboard-widget-container	div#scoreboard-top-box div#fixture-info-box	div.team-box img
    {
			width: 88px;
			height: 88px;
		}

		/*
    odds style
    */
		div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container	a	div.odds-box
    {
			margin-right: 20px;
			width: 100%;
		}
		div#scoreboard-widget-container	div#scoreboard-top-box div#btn-vote-container	a:last-child div.odds-box
    {
			margin-right: 0px;
		}

		div#scoreboard-widget-container.miniature.tablet-miniature
    {
			min-width: auto;
		}

		p.ft-text
    {
			font-size: 16px !important;
			margin-bottom: -10px;
		}
	}

	@media only screen
  and (min-width: 1000px)
  {

		#scoreboard-widget-container
    {
			min-width: 100%;
		}

		/*
    scorebaord-top
    */
		div#scoreboard-widget-container	div#scoreboard-top-box,
    div#scoreboard-widget-container	div#scoreboard-top-box.full-time
    {
			min-height: 207px;
			max-height: 207px;
			background-image: url(./assets/banner.png);
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}

		/*
    placeholder during miniature
    */
		div#empty-widget-placeholder
    {
			min-height: 259px;
			max-height: 259px;
		}

		/*
    league-info
    */
		div#scoreboard-widget-container	div#scoreboard-top-box div#league-info-box p:hover
    {
			color: #f5620f !important;
		}

		/*
    team-info style
    */
		div#scoreboard-widget-container	div#scoreboard-top-box div.team-box
    {
			position: relative;
		}
		div#scoreboard-widget-container	div#scoreboard-top-box div.team-box p
    {
			font-size: 16px;
		}
		div#scoreboard-widget-container	div#scoreboard-top-box div.team-box	div.inner-team-box-1
    {
			position: absolute;
			left: 25%;
			text-align: center;
		}
		div#scoreboard-widget-container	div#scoreboard-top-box div.team-box	div.inner-team-box-2
    {
			position: absolute;
			right: 25%;
			text-align: center;
		}
		p.ft-text
    {
			font-size: 16px !important;
			margin-bottom: -10px;
		}

		/*
    odds style
    */
		div#scoreboard-widget-container div#scoreboard-top-box div.odds-box
    {
			height: 48px;
			max-width: 200px;
			min-width: 150px;
		}

		/*
    odds-bet style
    */
		div#tablet-bet-odds-box
    {
			position: relative;
			width: -webkit-fill-available;
		}
		div#tablet-bet-odds-box div.bet-site-box
    {
			position: absolute;
			bottom: 100%;
			right: 0;
			width: auto;
		}

		div#scoreboard-widget-container.miniature.tablet-miniature
    {
			min-width: auto;
		}
		div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box div.inner-team-box-1
    {
			position: absolute;
			right: 0;
			width: auto;
		}
		div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.team-box div.inner-team-box-2
    {
			position: absolute;
			left: 0;
			width: auto;
		}
		div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box	div.middle-info
    {
			min-width: 217px;
			max-width: 217px;
			white-space: nowrap;
		}

		/*
    bottom nav
    */
		div#scoreboard-widget-container	div#scoreboard-bottom-nav-box	div.opt-container	p:hover
    {
			color: #292929 !important;
		}
	}

	@media only screen
  and (min-width: 1160px)
  {
		/*
    odds style
    */
		div#scoreboard-widget-container
			div#scoreboard-top-box
			div.odds-box {
			height: 48px;
			max-width: 200px;
			min-width: 200px;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	div#scoreboard-widget-container.dark-background-1	div#scoreboard-bottom-nav-box
  {
		background-color: #4b4b4b;
	}

	/*
  bottom nav
  */
	div#scoreboard-widget-container.dark-background-1	div#scoreboard-bottom-nav-box	div.opt-container	p:hover
  {
		color: #ffffff !important;
	}

</style>
