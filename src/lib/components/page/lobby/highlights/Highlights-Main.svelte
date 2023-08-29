<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { dlog } from '$lib/utils/debug.js';
	import { iso2CountryLogo, viewport_change } from '$lib/utils/platform-functions.js';

  import icon_win from './assets/icon-green-thumbs-up.svg';
  import icon_draw from './assets/icon-grey-draw.svg';
  import icon_loose from './assets/icon-red-thumbs-down.svg';

	import type { B_COMP_HIGH_D, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  /** @description TODO: DOC: */
	export let B_COMP_HIGH_D: B_COMP_HIGH_D;

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 912,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competition⮕w⮕highlights'
  ;

  let
    /** @description TODO: DOC: */
    mobileExclusive: boolean = true,
    /** @description TODO: DOC: */
    tabletExclusive: boolean = true,
    /** @description main widget translations data */
    WIDGET_T_DATA: B_COMP_HIGH_T = $page.data?.B_COMP_HIGH_T,
    /** @description competition highlights - target widget prediction type icon */
    icon_prediction: string,
    /** @description competition highlights - target widget prediction type */
    prediction_type: 'win' | 'loose' | 'draw',
    /** @description TODO: DOC: */
    prediction_side: 'home' | 'away',
    /** @description competition highlights - target widget date difference with `competition start` */
    dateDiff: number = 0,
    /** @description TODO: DOC: */
    showCountdown: boolean = true,
    /** @description TODO: DOC: */
    counterTotalPrize: number = 0,
    /** @description TODO: DOC: */
    counterTotalAnimated: boolean = true
  ;

  $: countDownSec = toZeroPrefixDateStr(Math.floor((dateDiff / 1000) % 60).toString());
	$: countDownMin = toZeroPrefixDateStr(Math.floor((dateDiff / 1000 / 60) % 60).toString());
	$: countDownHour = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60)) % 24).toString());
	$: countDownTestHour = Math.floor(dateDiff / (1000 * 60 * 60));

  $: WIDGET_T_DATA = $page.data?.B_COMP_HIGH_T;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

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
      VIEWPORT_TABLET_INIT,
      VIEWPORT_MOBILE_INIT
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

  /**
   * @description
   * TODO: DOC:
   */
  function setCountdown
  (
  ): void
  {
    dateDiff = toCorrectDate(B_COMP_HIGH_D?.fixture?.time).getTime() - new Date().getTime();
    setInterval
    (
      () =>
      {
        dateDiff = toCorrectDate(B_COMP_HIGH_D?.fixture?.time).getTime() - new Date().getTime();
      },
      1000
    );
  }

  /**
   * @description
   * TODO: DOC:
   */
  function determinePrediction
  (
  ): void
  {
    const if_M_OF_1: boolean =
      (B_COMP_HIGH_D?.competition?.data?.prediction == '1'
      && B_COMP_HIGH_D?.competition?.data?.target_team_id == B_COMP_HIGH_D?.fixture?.localteam_id_j)
      ||
      (B_COMP_HIGH_D?.competition?.data?.prediction == '2'
      && B_COMP_HIGH_D?.competition?.data?.target_team_id == B_COMP_HIGH_D?.fixture?.visitorteam_id_j)
    ;
    if (if_M_OF_1)
    {
      icon_prediction = icon_win;
      prediction_type = 'win';
      prediction_side =
        B_COMP_HIGH_D?.competition?.data?.target_team_id == B_COMP_HIGH_D?.fixture?.localteam_id_j
          ? 'home'
          : 'away'
      ;
    }
    else if (B_COMP_HIGH_D?.competition?.data?.prediction == 'x')
    {
      icon_prediction = icon_draw;
      prediction_type = 'draw';
    }
    else
    {
      icon_prediction = icon_loose;
      prediction_type = 'loose';
      prediction_side =
        B_COMP_HIGH_D?.competition?.data?.target_team_id == B_COMP_HIGH_D?.fixture?.localteam_id_j
          ? 'home'
          : 'away'
      ;
    };
  }

  /**
   * @description
   * TODO: DOC:
   */
  function countAnimation
  (
  ): void
  {
    let counts: NodeJS.Timer = setInterval(updated);
    let totalCount: number = B_COMP_HIGH_D?.competition?.data?.total_prize;

    function updated(): void
    {
      ++counterTotalPrize;
      if (counterTotalPrize >= totalCount)
      {
        clearInterval(counts);
        counterTotalAnimated = false;
      }
    }
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Check for wether to show / hide competition countdown.
   *
   * WARNING:
   * triggered by changes in:
   * - `countDownTestHour` - **kicker**
   * - `dateDiff` - **kicker**
   */
  $: if_R_0 =
    countDownTestHour > 23
    || dateDiff < 0
  ;
  $: if (if_R_0) showCountdown = false;

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * Listens to changes in target data competition prediction.
   *
   * WARNING:
   * triggered by changes in:
   * - `?.prediction` - **kicker**
   */
  $: if_R_1 =
    browser
  ;
  $: if (if_R_1 && B_COMP_HIGH_D?.competition?.data?.prediction)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ debugTagOrVarName ${if_R_1}`,
      true
    );

    determinePrediction();
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {
      resizeAction();
      addEventListeners();

      setCountdown();
      countAnimation();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<div
  id="{CNAME}⮕main"
  class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
>

  <!--
  TOP COMPETITION ROW
  -->
  <div
    id="{CNAME}⮕top-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    1st COLUMN - COMPETITION PREDICTION INFO
    -->
    <div>

      <div
        class=
        "
        row-space-start
        "
      >

        <p
          class=
          "
          s-16
          w-500
          color-grey
          m-r-6
          "
        >
          {'Team'}
        </p>

        <img
          id=''
          src={B_COMP_HIGH_D?.team_logo}
          alt='competition-team-logo'
          title={B_COMP_HIGH_D?.team_name}
          loading='lazy'
          width=16
          height=16
          class=
          "
          m-r-6
          "
        />

        <p
          class=
          "
          s-16
          w-500
          color-black-2
          "
        >
          {B_COMP_HIGH_D?.team_name ?? ''}
        </p>

      </div>

      <p
        class=
        "
        s-12
        color-grey
        w-600
        "
      >
        {WIDGET_T_DATA?.term_is_going_to_a ?? 'is going to'}
      </p>

    </div>

    <!--
    2nd COLUMN - COMPETITION PREDICTION INFO
    -->
    <div>

      <div
        class=
        "
        row-space-end
        "
      >

        <img
          id=''
          src={icon_prediction}
          alt='prediction-icon'
          title='CompetitionWin'
          loading='lazy'
          width=18
          height=18
          class=
          "
          m-r-5
          "
        />

        <p
          class=
          "
          s-16
          w-700
          color-grey
          "
          class:color-success={prediction_type == 'win'}
          class:color-red-bright={prediction_type == 'loose'}
          class:color-grey={prediction_type == 'draw'}
        >
          {#if prediction_type == 'win'}
            {WIDGET_T_DATA?.prediction?.[B_COMP_HIGH_D?.competition?.data?.prediction] ?? 'Win'}
          {:else if prediction_type == 'loose'}
            {WIDGET_T_DATA?.prediction?.[B_COMP_HIGH_D?.competition?.data?.prediction] ?? 'Lose'}
          {:else}
            {WIDGET_T_DATA?.prediction?.[B_COMP_HIGH_D?.competition?.data?.prediction] ?? 'Draw'}
          {/if}
        </p>

      </div>

      <p
        class=
        "
        s-10
        no-wrap
        "
      >
        58%
        {WIDGET_T_DATA?.title_prob ?? 'probability'}
      </p>

    </div>

  </div>

  <!--
  COMPETITION INFORMATION MAIN
  -->
  <div
    id="{CNAME}⮕middle-section"
  >

    <!--
    TOURNAMENT INFO
    -->
    <div
      class=
      "
      row-space-start
      m-b-24
      "
    >

      <img
        id=''
        src={B_COMP_HIGH_D?.league?.image_path_j}
        alt='competition-league-logo'
        title={B_COMP_HIGH_D?.league?.name}
        loading='lazy'
        width=38
        height=38
        class=
        "
        m-r-16
        "
      />

      <!--
      FIXTURE TOURNAMENT / COUNTRY INFO
      -->
      <div>

        <p
          class=
          "
          s-16
          w-500
          m-b-5
          "
        >
          {B_COMP_HIGH_D?.league?.name ?? ''}
        </p>

        <div
          class=
          "
          row-space-start
          "
        >

          <img
            id=''
            src={iso2CountryLogo(B_COMP_HIGH_D?.league?.country_iso2_j)}
            alt='countryIcon'
            title='CountryNameGoesHere'
            loading='lazy'
            width=16
            height=16
            class=
            "
            m-r-6
            country-img
            "
          />

          <p
            class=
            "
            s-10
            "
          >
            {B_COMP_HIGH_D?.league?.country_iso2_j}
          </p>

        </div>

      </div>

    </div>

    <!--
    FIXTURE TEAMS
    -->
    <div
      id="{CNAME}⮕competition-teams"
      class=
      "
      m-b-16
      row-space-out
      "
      class:bump-height={['finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}
    >

      <!--
      TEAM 1 (HOME)
      -->
      <div
        class=
        "
        team-box
        column-space-center
        "
        class:predict-win-border={prediction_side == 'home' && prediction_type == 'win'}
        class:predict-loose-border={prediction_side == 'home' && prediction_type == 'loose'}
        class:left-predict-win={prediction_side == 'home' && prediction_type == 'win'}
        class:left-predict-loose={prediction_side == 'home' && prediction_type == 'loose'}
      >

        <img
          id=''
          src={B_COMP_HIGH_D?.fixture?.home_team_logo}
          alt='team-1'
          title='team-name-1'
          loading='lazy'
          width=32
          height=32
          class=
          "
          m-b-8
          "
        />

        <p
          class=
          "
          s-12
          color-black-2
          w-600
          "
        >
          {B_COMP_HIGH_D?.fixture?.home_team_name ?? ''}
        </p>

        <!--
        FINAL FIXTURE SCORE
        -->
        {#if ['finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}
          <p
            class=
            "
            s-16
            color-black-2
            w-600
            m-t-10
            "
          >
            {B_COMP_HIGH_D?.fixture_detailed?.teams?.home?.score ?? ''}
          </p>
        {/if}

      </div>

      <!--
      DIVIDER
      -->
      <div
        id="{CNAME}⮕team-divider"
        class=
        "
        column-space-stretch
        "
      >

        <div id="vertical-top-divider" />

        <p
          class=
          "
          s-16
          w-500
          "
        >
          vs
        </p>

        <div id="vertical-bottom-divider" />

      </div>

      <!--
      TEAM 2 (AWAY)
      -->
      <div
        class=
        "
        team-box
        column-space-center
        "
        class:predict-win-border={prediction_side == 'away' && prediction_type == 'win'}
        class:predict-loose-border={prediction_side == 'away' && prediction_type == 'loose'}
        class:right-predict-win={prediction_side == 'away' && prediction_type == 'win'}
        class:right-predict-loose={prediction_side == 'away' && prediction_type == 'loose'}
      >

        <img
          id=''
          src={B_COMP_HIGH_D?.fixture?.away_team_logo}
          alt='team-away'
          title={B_COMP_HIGH_D?.fixture?.away_team_name}
          loading='lazy'
          width=32
          height=32
          class=
          "
          m-b-8
          "
        />

        <p
          class=
          "
          s-12
          color-black-2
          w-600
          "
        >
          {B_COMP_HIGH_D?.fixture?.away_team_name ?? ''}
        </p>

        <!--
        FINAL FIXTURE SCORE
        -->
        {#if ['finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}
          <p
            class=
            "
            s-16
            color-black-2
            w-600
            m-t-10
            "
          >
            {B_COMP_HIGH_D?.fixture_detailed?.teams?.away?.score ?? ''}
          </p>
        {/if}

      </div>

    </div>

    <!--
    COMPETITION COUNTDOWN / STATUS
    -->
    {#if !['finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}

      <div
        id="{CNAME}⮕countdown"
        class=
        "
        m-b-24
        "
        class:row-space-out={showCountdown}

      >

        <!--
        UPCOMING COMPETITION START
        -->
        {#if !showCountdown && B_COMP_HIGH_D?.competition?.data?.status == 'pending'}
          <p
            class=
            "
            s-14
            color-black-2
            w-500
            text-center
            "
          >
            {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getDate()}/
            {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getMonth()}/
            {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getFullYear()}
            -
            {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getHours()}
            {toZeroPrefixDateStr(toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getMinutes())}
          </p>
        {/if}

        <!--
        COUNTDOWN
        -->
        {#if showCountdown}

          <!--
          COUNTDOWN START TEXT
          -->
          <p
            class=
            "
            s-14
            color-black-2
            w-500
            no-wrap
            "
          >
            {WIDGET_T_DATA?.timer ?? 'Starts in:'}
          </p>

          <!--
          COUNTDOWN TIMER
          -->
          <div
            id="{CNAME}⮕countdown-main-box"
            class=
            "
            width-auto
            row-space-out
            "
          >

            <!--
            HOURS
            -->
            <div
              class=
              "
              time-box
              text-center
              "
            >
              <p
                class=
                "
                s-12
                w-500
                "
              >
                {countDownHour}h
              </p>
            </div>

            <!--
            MINUTES
            -->
            <div
              class=
              "
              time-box
              text-center
              "
            >
              <p
                class=
                "
                s-12
                w-500
                "
              >
                {countDownMin}min
              </p>
            </div>

            <!--
            SECONDS
            -->
            <div
              class=
              "
              time-box
              text-center
              "
            >
              <p
                class=
                "
                s-12
                w-500
                "
              >
                {countDownSec}s
              </p>
            </div>

          </div>

        {/if}

        <!--
        ACTIVE STATE
        -->
        {#if !showCountdown && B_COMP_HIGH_D?.competition?.data?.status == 'active'}
          {'Playing'}
        {/if}

      </div>

    {/if}

    <!--
    COMPETITION DETAILS
    -->
    <div
      id="{CNAME}⮕grid-details"
    >

      <!--
      COMPETITION TYPE
      -->
      <div>

        <p
          class=
          "
          s-12
          color-black-2
          "
        >
          {WIDGET_T_DATA?.title_type ?? 'Type'}
        </p>

        <p
          class=
          "
          s-16
          w-500
          "
        >
          {'Single predictor'}
          <!-- {B_COMP_HIGH_D?.competition?.category_id} -->
        </p>

      </div>

      <!--
      COMPETITION SPORT
      -->
      <div>

        <p
          class=
          "
          s-12
          color-black-2
          "
        >
          {WIDGET_T_DATA?.title_sport ?? 'Sport'}
        </p>

        <p
          class=
          "
          s-16
          w-500
          "
        >
          {'Football'}
          <!-- {B_COMP_HIGH_D?.competition?.data?.sport_id} -->
        </p>

      </div>

      <!--
      COMPETITION ENTRY FEE
      -->
      <div>

        <p
          class=
          "
          s-12
          color-black-2
          no-wrap
          "
        >
          {WIDGET_T_DATA?.title_entry_fee ?? 'Entry Fee'}
        </p>

        <p
          class=
          "
          s-16
          w-500
          "
        >
          {B_COMP_HIGH_D?.competition?.data?.entry_fee ?? ''} BTA
          <span
            class=
            "
            color-grey
            "
          >
          (${B_COMP_HIGH_D?.competition?.data?.entry_fee ?? ''})
          </span>
        </p>

      </div>

      <!--
      COMPETITION TOTAL PRIZE
      -->
      <div>

        <p
          class=
          "
          s-12
          color-black-2
          "
        >
          {WIDGET_T_DATA?.title_total_prize ?? 'Total prize'}
        </p>

        <p
          class=
          "
          s-16
          w-500
          "
        >

          {#if !counterTotalAnimated}
            {B_COMP_HIGH_D?.competition?.data?.total_prize ?? ''} BTA
          {:else}
            {counterTotalPrize} BTA
          {/if}

          <span
            class=
            "
            color-grey
            "
          >
            {#if !counterTotalAnimated}
              (${B_COMP_HIGH_D?.competition?.data?.total_prize ?? ''})
            {:else}
              (${counterTotalPrize})
            {/if}
          </span>

        </p>

      </div>

    </div>

  </div>

  <!--
  COMPETITION BOTTOM ROW
  -->
  <div
    id="{CNAME}⮕bottom-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    PARTICIPANTS
    -->
    <div
      class=
      "
      width-auto
      row-space-start
      "
    >

      <div
        class=
        "
        m-r-12
        row-space-start
        "
      >

        {#each B_COMP_HIGH_D?.first_3_participants ?? [] as item}

          <img
            id=''
            class=
            "
            participant-img
            "
            src={item}
            alt='participant_1'
            title='Partitipant_1'
            loading='lazy'
            width=32
            height=32
          />

        {/each}

      </div>

      <p
        class=
        "
        s-12
        color-black-2
        no-wrap
        "
      >
        {
          B_COMP_HIGH_D?.competition?.data?.participants?.yes?.length
          + B_COMP_HIGH_D?.competition?.data?.participants?.no?.length
        }
        {WIDGET_T_DATA?.title_participants ?? 'participants'}
      </p>

    </div>

    <!--
    JOIN COMPETITION
    -->
    <a
      href={B_COMP_HIGH_D?.competition?.urls?.['en']}>
      <button
        class=
        "
        s-14
        w-500
        btn-primary-v2
        "
      >
        {'Join now'}
      </button>
    </a>

  </div>

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

  div#competition⮕w⮕highlights⮕main
  {
    /* 🎨 style */
		/* padding: 0 24px; */
    /* NOTE: inital, as per design for 'isNotMobile' UI */
    /* min-width: 328px; */
    /* max-width: 328px; */
    /* NOTE: upgrade, identified as best mobile fit UI */
    /* min-width: calc(100vw - 32px); */
    /* max-width: calc(100vw - 32px); */
    /* NOTE: highlights card width managed by parent 'grid' */
		background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}

  div#competition⮕w⮕highlights⮕top-row
  {
    /* 🎨 style */
    min-height: 64px;
		padding: 16px 24px;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  }

  div#competition⮕w⮕highlights⮕middle-section
  {
    /* 🎨 style */
    padding: 20px 24px;
  }

  img.country-img
  {
    /* 🎨 style */
    border-radius: 16px;
  }

  div#competition⮕w⮕highlights⮕competition-teams
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    overflow: hidden;
    border-radius: 8px;
    background-color: var(--whitev2);
    min-height: 86px;
  }
  div#competition⮕w⮕highlights⮕competition-teams.bump-height
  {
    /* 🎨 style */
    min-height: 113px;
  }
  div.team-box
  {
    /* 🔥 overload */
    min-height: inherit;
  }
  .left-predict-win
  {
    /* 🎨 style */
    background: linear-gradient(310deg, #F2F2F2 0%, #B5E5B7 100%);
  }
  .left-predict-loose
  {
    /* 🎨 style */
    background: linear-gradient(311deg, #F2F2F2 0%, #EFC3C3 100%);
  }
  .right-predict-win
  {
    /* 🎨 style */
    background: linear-gradient(43deg, #F2F2F2 0%, #B5E5B7 100%);
  }
  .right-predict-loose
  {
    /* 🎨 style */
    background: linear-gradient(43deg, #F2F2F2 0%, #EFC3C3 100%);
  }
  .predict-win-border
  {
    /* 🎨 style */
    border-bottom: 3px solid #4DA025;
  }
  .predict-loose-border
  {
    /* 🎨 style */
    border-bottom: 3px solid #FF5959;
  }

  div#competition⮕w⮕highlights⮕team-divider
  {
    /* 📌 position */
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    /* 🎨 style */
    height: 100%;
    width: fit-content;
    text-align: -webkit-center;
    /* 🔥 overload */
    align-items: center;
    justify-content: space-between;
  }
  div#vertical-top-divider
  {
    /* 🎨 style */
    background: var(--white);
    width: 1px;
    height: 25px;
  }
  div#vertical-bottom-divider
  {
    /* 🎨 style */
    background: var(--white);
    width: 1px;
    height: 25px;
  }

  div#competition⮕w⮕highlights⮕countdown
  {
    /* 🎨 style */
    min-height: 40px;
    border-radius: 8px;
    background: var(--whitev2);
    padding: 4px 4px 4px 12px;
  }
  div.time-box
  {
    /* 🎨 style */
    width: 60px;
    height: 32px;
    padding: 6px 0px;
    border-radius: 4px 0px 0px 4px;
    background-color: var(--white);
    margin-right: 2px;
  }
  div#competition⮕w⮕highlights⮕countdown-main-box div.time-box:last-child
  {
    /* 🎨 style */
    margin: 0;
    border-radius: 0px 4px 4px 0px;
  }

  div#competition⮕w⮕highlights⮕grid-details
  {
    /* 🎨 style */
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 40px;
  }

  div#competition⮕w⮕highlights⮕bottom-row
  {
    /* 🎨 style */
    min-height: 72px;
		padding: 16px 24px;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  }

  img.participant-img
  {
    /* 🎨 style */
    margin: -5px;
    border-radius: 32px;
    border: 2px solid var(--whitev2);
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 767px)
  {
	}

	/*
  =============
  🌒 DARK-THEME
  =============
  */

</style>
