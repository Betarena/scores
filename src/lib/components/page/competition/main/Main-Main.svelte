<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug.js';
	import { iso2CountryLogo, toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';
	import { translationObject } from '$lib/utils/translation.js';
	import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';

	import CompCountdown from '$lib/components/shared/COMP-Countdown.svelte';
	import CompDetails from '$lib/components/shared/COMP-Details.svelte';
	import CompTeams from '$lib/components/shared/COMP-Teams.svelte';
	import MainParticipantsList from './Main-Participants-List.svelte';

  import icon_facebook_hover from './assets/icon-facebook-hover.svg';
  import icon_facebook_white from './assets/icon-facebook-white.svg';
  import icon_facebook from './assets/icon-facebook.svg';
  import icon_win from './assets/icon-green-thumbs-up.svg';
  import icon_draw from './assets/icon-grey-draw.svg';
  import icon_loose from './assets/icon-red-thumbs-down.svg';
  import icon_twitter_hover from './assets/icon-twitter-hover.svg';
  import icon_twitter_white from './assets/icon-twitter-white.svg';
  import icon_twitter from './assets/icon-twitter.svg';
  import vector_green_dot from './assets/live-green-dot.svg';

	import type { Betarena_User } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
	import type { B_SAP_D1 } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_COMP_MAIN_D, B_COMP_MAIN_T } from '@betarena/scores-lib/types/types.competition.main.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    WIDGET_DATA: B_COMP_MAIN_D
  ;

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 1200,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'competition⮕w⮕main'
  ;

  let
    /** @description TODO: DOC: */
    WIDGET_T_DATA: B_COMP_MAIN_T,
    /** @description TODO: DOC: */
    B_SAP_D1: B_SAP_D1,
    /** @description TODO: DOC: */
    isViewMobile: boolean = true,
    /** @description TODO: DOC: */
    isViewTablet: boolean = true,
    /** @description competition highlights - target widget prediction type icon */
    icon_prediction: string,
    /** @description competition highlights - target widget prediction type */
    prediction_type: 'win' | 'loose' | 'draw',
    /** @description TODO: DOC: */
    prediction_side: 'home' | 'away',
    /** @description TODO: DOC: */
    participantsMap: Map < string, Betarena_User > = new Map()
  ;

  $: WIDGET_T_DATA = $page.data?.B_COMP_MAIN_T;
  $: B_SAP_D1 = $page.data?.B_SAP_D1;

  // ### IMPORTANT
  // ### Reactivity deep-value listen(s).
  $: competitionMapDataChng = JSON.stringify([...($sessionStore?.competitions_map?.entries() ?? [])]);
  $: livescoreNowScoreboardChng = JSON.stringify([...($sessionStore?.livescore_now_scoreboard?.entries() ?? [])]);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  ): void
  {
    [
      isViewTablet,
      isViewMobile
    ] =	viewport_change
    (
      VIEWPORT_TABLET_INIT,
      VIEWPORT_MOBILE_INIT
    );
  }

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * ⚡️ document (visibility-change) event listener.
   *
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
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * TODO: DOC:
   */
  async function getParticipantData
  (
  ): Promise < void >
  {
    // ### IMPORTANT
    if (!browser) return;

    const participantUid: string[] = new Competition().extractParticipantUids
    (
      WIDGET_DATA?.competition
    );

    const newUids: string[] = [];

    for (const uid of participantUid)
    {
      // ### CHECK
      // ### for missing 'uid' from participant `map`.
      const if_M_0: boolean =
        participantsMap?.has(uid)
      ;
      if (if_M_0) continue;
      newUids.push(uid);
    }

    // ### CHECK
    // ### for wether necessary to make new request for participant data.
    const if_M_0: boolean =
      newUids?.length == 0
    ;
    if (if_M_0) return;

    const participantPublicData = await new Betarena_User_Class().obtainPublicInformationTargetUsers
    (
      newUids
    ) as (Betarena_User | undefined)[];

    const newParticipantsMap: Map < string, Betarena_User > = new Betarena_User_Class().convertToMap
    (
      participantPublicData
    );

    // ### IMPORTANT
    participantsMap = new Map([...participantsMap, ...newParticipantsMap]);
  }

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * TODO: DOC:
   */
  async function injectLiveData
  (
  ): Promise < void >
  {
    if (!browser) return;

    const competitionMap: Map < number, B_H_COMP_DATA > = $sessionStore?.competitions_map;

    // ### CHECK
    // ### for valid competitions map data.
    const if_M_0: boolean =
      competitionMap.size == 0
    ;
    if (if_M_0) return;

    // ### NOTE:
    // ### update 'this' competition data with new data.

    // ### CHECK
    // ### for valid competitions map data.
    const if_M_1: boolean =
      !competitionMap?.has(WIDGET_DATA?.competition?.id)
    ;
    if (if_M_1) return;

    WIDGET_DATA.competition = competitionMap?.get(WIDGET_DATA?.competition?.id);

    getParticipantData();

    // ### IMPORTANT
    WIDGET_DATA = WIDGET_DATA;

    return;
  }

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * TODO: DOC:
   */
  function injectLivescoresData
  (
  ): Promise < void >
  {
    const liveFixturesMap: Map < number, FIRE_LNNS > = $sessionStore?.livescore_now_scoreboard;

    // ### CHECK
    // ### for valid competitions map data.
    const if_M_0: boolean =
      liveFixturesMap.size == 0
    ;
    if (if_M_0) return;

    // ### NOTE:
    // ### update 'this' competition data with new 'fixture/scores' data.

    const competitionFixtureId: number = WIDGET_DATA?.competition?.fixture_id;

    // ### CHECK
    // ### for valid competitions map data.
    const if_M_1: boolean =
      !liveFixturesMap?.has(competitionFixtureId)
    ;
    if (if_M_1) return;

    // ### IMPORTANT
    (WIDGET_DATA.fixture_detailed ??= { })

    WIDGET_DATA.fixture_detailed.teams =
    {
      away:
      {
        score: liveFixturesMap?.get(competitionFixtureId)?.teams?.find(x => x?.type == "away")?.score,
      },
      home:
      {
        score: liveFixturesMap?.get(competitionFixtureId)?.teams?.find(x => x?.type == "home")?.score,
      }
    }

    WIDGET_DATA = WIDGET_DATA;
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
      (WIDGET_DATA?.competition?.data?.prediction == '1'
      && WIDGET_DATA?.competition?.data?.target_team_id == WIDGET_DATA?.fixture?.localteam_id_j)
      ||
      (WIDGET_DATA?.competition?.data?.prediction == '2'
      && WIDGET_DATA?.competition?.data?.target_team_id == WIDGET_DATA?.fixture?.visitorteam_id_j)
    ;
    if (if_M_OF_1)
    {
      icon_prediction = icon_win;
      prediction_type = 'win';
      prediction_side =
        WIDGET_DATA?.competition?.data?.target_team_id == WIDGET_DATA?.fixture?.localteam_id_j
          ? 'home'
          : 'away'
      ;
    }
    else if (WIDGET_DATA?.competition?.data?.prediction == 'x')
    {
      icon_prediction = icon_draw;
      prediction_type = 'draw';
    }
    else
    {
      icon_prediction = icon_loose;
      prediction_type = 'loose';
      prediction_side =
        WIDGET_DATA?.competition?.data?.target_team_id == WIDGET_DATA?.fixture?.localteam_id_j
          ? 'home'
          : 'away'
      ;
    };
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Listens to changes in competition data.
   *
   * WARNING:
   * triggered by changes in:
   * - `competitionMapDataChng` - **kicker**
   */
  $: if (competitionMapDataChng)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ competitionMapDataChng`,
      true
    );

    injectLiveData();
  }

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Listens to changes in competition data.
   *
   * WARNING:
   * triggered by changes in:
   * - `competitionMapDataChng` - **kicker**
   */
  $: if (livescoreNowScoreboardChng)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ competitionMapDataChng`,
      true
    );

    injectLivescoresData();
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

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
      // ### IMPORTANT
      resizeAction();
      addEventListeners();

      determinePrediction()
      getParticipantData();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
COMPETITION MAIN
-->
<div
  id="{CNAME}⮕box"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  📌 MAIN COMPETITION PREDICTION INFO
  -->
  <div>

    <div
      id="{CNAME}⮕profile"
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

          <h1
            class=
            "
            w-500
            color-grey-v2
            grey-v1
            m-r-12
            m-0
            "
            class:s-16={isViewTablet}
            class:s-32={!isViewTablet}
          >
            {translationObject?.team}
          </h1>

          <img
            id=''
            src={WIDGET_DATA?.team_logo}
            alt='competition-team-logo'
            title={WIDGET_DATA?.team_name}
            loading='lazy'
            width={isViewTablet ? 15 : 32}
            height={isViewTablet ? 15 : 32}
            class=
            "
            m-r-12
            team-logo
            "
          />

          <h1
            class=
            "
            color-black-2
            w-500
            m-0
            "
            class:s-16={isViewTablet}
            class:s-32={!isViewTablet}
          >
            {WIDGET_DATA?.team_name ?? ''}
          </h1>

        </div>

        <h1
          class=
          "
          color-grey-v2
          grey-v1
          w-500
          m-0
          "
          class:s-12={isViewTablet}
          class:s-22={!isViewTablet}
        >
          {WIDGET_T_DATA?.term_is_going_to_a ?? 'is going to'}
        </h1>

      </div>

      <!--
      2nd COLUMN - COMPETITION PREDICTION INFO
      -->
      <div
        class=
        "
        row-space-end
        width-auto
        "
      >

        <div
          class=
          "
          row-space-end
          m-r-16
          "
        >

          <img
            id=''
            src={icon_prediction}
            alt='prediction-icon'
            title='CompetitionWin'
            loading='lazy'
            width={isViewTablet ? 18 : 32}
            height={isViewTablet ? 18 : 32}
            class=
            "
            m-r-5
            "
          />

          <p
            class=
            "
            s-16
            w-600
            color-grey
            "
            class:s-22={!isViewTablet}
            class:color-green={prediction_type == 'win'}
            class:color-red-bright-v2={prediction_type == 'loose'}
            class:color-grey={prediction_type == 'draw'}
          >
            {#if prediction_type == 'win'}
              {WIDGET_T_DATA?.prediction?.[1] ?? 'Win'}
            {:else if prediction_type == 'loose'}
              {WIDGET_T_DATA?.prediction?.[2] ?? 'Lose'}
            {:else}
              {WIDGET_T_DATA?.prediction?.x ?? 'Draw'}
            {/if}
          </p>

        </div>

        <p
          class=
          "
          s-10
          color-black-2
          no-wrap
          "
          class:s-16={!isViewTablet}
        >
          {#if WIDGET_DATA?.competition?.data?.prediction == '1'}
            {toDecimalFix(WIDGET_DATA?.fixture?.probabilities?.home, 0)}%
          {:else if WIDGET_DATA?.competition?.data?.prediction == '2'}
            {toDecimalFix(WIDGET_DATA?.fixture?.probabilities?.away, 0)}%
          {:else}
            {toDecimalFix(WIDGET_DATA?.fixture?.probabilities?.draw, 0)}%
          {/if}
          {WIDGET_T_DATA?.title_prob ?? 'probability'}
        </p>

      </div>

    </div>

    <!--
    💻 TABLET
    -->
    {#if !isViewTablet}

      <div
        id="{CNAME}⮕status-social"
        class=
        "
        row-space-out
        "
      >

        <!--
        COMPETTION COUNTDOWN / NATIVE STATUS
        -->
        <div
        >

          <!--
          COUNTDOWN
          -->
          {#if WIDGET_DATA?.competition?.data?.status == 'pending'}

            <CompCountdown
              B_COMP_HIGH_D={WIDGET_DATA}
              WIDGET_T_DATA={WIDGET_T_DATA}
            />

          <!--
          ACTIVE EVENT
          -->
          {:else if WIDGET_DATA?.competition?.data?.status == 'active'}

            <div
              id="{CNAME}⮕status-is-active"
              class=
              "
              row-space-start
              "
            >

              <img
                id=''
                class=
                '
                m-r-12
                '
                src={vector_green_dot}
                alt=''
                title=''
                loading='lazy'
                width=16
                height=16
              />

              <p
                class=
                "
                s-14
                w-500
                color-success
                "
              >
                Event is active
              </p>

            </div>

          <!--
          EVENT FINISHED
          -->
          {:else if WIDGET_DATA?.competition?.data?.status == 'finished'}

            <div
              id="{CNAME}⮕status-is-finished"
              class=
              "
              row-space-start
              "
            >

              <p
                class=
                "
                s-14
                w-500
                color-red-bright-v2
                "
              >
                Event is finished
              </p>

            </div>

          <!--
          EVENT FINISHED
          -->
          {:else if WIDGET_DATA?.competition?.data?.status == 'canceled'}

            <div
              id="{CNAME}⮕status-is-canceled"
              class=
              "
              row-space-start
              "
            >

              <p
                class=
                "
                s-14
                w-500
                color-black-2
                "
              >
                Canceled
              </p>

            </div>

          {/if}

        </div>

        <!--
        SOCIAL SHARE
        -->
        <div
          id="{CNAME}⮕social-box"
          class=
          "
          row-space-out
          width-auto
          "
        >

          <!--
          SOCIAL TEXT
          -->
          <p
            class=
            "
            s-14
            color-black-2
            w-500
            m-r-20
            "
          >
            {WIDGET_T_DATA?.social_share ?? 'Share'}
          </p>

          <!--
          SOCIAL ICONS
          -->
          <div
            class=
            "
            row-space-end
            width-auto
            "
          >

            <!--
            FACEBOOK
            -->
            <a
              href="https://www.facebook.com/sharer/sharer.php?u={$page?.url?.href}"
              target="_blank"
            >
              <div
                class=
                "
                cursor-pointer
                social
                "
                on:mouseover={(e) =>  e.currentTarget.children[0].src = icon_facebook_hover}
                on:mouseleave={(e) =>  e.currentTarget.children[0].src = ($userBetarenaSettings?.theme == 'Dark' ? icon_facebook_white : icon_facebook)}
              >
                <img
                  id=''
                  src={$userBetarenaSettings?.theme == 'Dark' ? icon_facebook_white : icon_facebook}
                  alt='icon_facebook'
                  title='Facebook'
                  loading='lazy'
                  height=16
                  width=16
                />
              </div>
            </a>

            <!--
            TWITTER
            -->
            <a
              href="https://twitter.com/intent/tweet?url={$page?.url?.href}&text="
              target="_blank"
            >
              <div
                class=
                "
                cursor-pointer
                social
                "
                on:mouseover={(e) => e.currentTarget.children[0].src = icon_twitter_hover}
                on:mouseleave={(e) => e.currentTarget.children[0].src = ($userBetarenaSettings?.theme == 'Dark' ? icon_twitter_white : icon_twitter)}
              >
                <img
                  id=''
                  src={$userBetarenaSettings?.theme == 'Dark' ? icon_twitter_white : icon_twitter}
                  alt='icon_twitter'
                  title='Twitter'
                  loading='lazy'
                  width=16
                  height=16
                />
              </div>
            </a>

          </div>

        </div>

      </div>

    {/if}

  </div>

  <!--
  🧮 MAIN COMPETITION INFO SECTION
  -->
  <div
    id="{CNAME}⮕grid-section"
  >

    <!--
    LEAGUE / TOURNAMENT INFO
    -->
    <a
      id="league-box"
      href={WIDGET_DATA?.league_urls?.[$sessionStore?.serverLang]}
    >
      <div
        class=
        "
        row-space-start
        "
      >

        <img
          id=''
          src={WIDGET_DATA?.league?.image_path_j}
          alt='competition-league-logo'
          title={WIDGET_DATA?.league?.name}
          loading='lazy'
          width=45
          height=45
          class=
          "
          m-r-16
          "
        />

        <!--
        TOURNAMENT + COUNTRY INFO
        -->

        <div>

          <h2
            class=
            "
            s-16
            w-500
            m-b-5
            color-black-2
            no-wrap
            league-name
            "
            class:s-19={!isViewTablet}
          >
            {WIDGET_DATA?.league?.name ?? ''}
          </h2>

          <div
            class=
            "
            row-space-start
            "
          >

            <img
              id=''
              src={iso2CountryLogo(WIDGET_DATA?.league?.country_iso2_j)}
              alt='country-icon'
              title={B_SAP_D1?.translations?.[$sessionStore?.serverLang]}
              loading='lazy'
              width={isViewTablet ? 16 : 19}
              height={isViewTablet ? 16 : 19}
              class=
              "
              m-r-6
              country-img
              "
            />

            <p
              class=
              "
              s-12
              color-black-2
              "
            >
              {B_SAP_D1?.translations?.[$sessionStore?.serverLang]}
            </p>

          </div>

        </div>

      </div>
    </a>

    <!--
    FIXTURE TEAMS
    -->
    <div>
      <CompTeams
        B_COMP_HIGH_D={WIDGET_DATA}
        {prediction_side}
        {prediction_type}
        fixtureUrl={WIDGET_DATA?.fixture?.urls?.[$sessionStore?.serverLang]}
      />
    </div>

    <!--
    🖥️ LAPTOP
    -->
    {#if isViewTablet}

      <!--
      COMPETTION COUNTDOWN / NATIVE STATUS
      -->
      <div
        id="{CNAME}⮕status"
      >

        <!--
        COUNTDOWN
        -->
        {#if WIDGET_DATA?.competition?.data?.status == 'pending'}

          <CompCountdown
            B_COMP_HIGH_D={WIDGET_DATA}
            WIDGET_T_DATA={WIDGET_T_DATA}
          />

        <!--
        ACTIVE EVENT
        -->
        {:else if WIDGET_DATA?.competition?.data?.status == 'active'}

          <div
            id="{CNAME}⮕status-is-active"
            class=
            "
            row-space-center
            "
          >

            <img
              id=''
              class=
              '
              m-r-12
              '
              src={vector_green_dot}
              alt=''
              title=''
              loading='lazy'
              width=16
              height=16
            />

            <p
              class=
              "
              s-14
              w-500
              color-success
              "
            >
              Event is active
            </p>

          </div>

        <!--
        EVENT FINISHED
        -->
        {:else if WIDGET_DATA?.competition?.data?.status == 'finished'}

          <div
            id="{CNAME}⮕status-is-finished"
            class=
            "
            row-space-center
            "
          >

            <p
              class=
              "
              s-14
              w-500
              color-red
              "
            >
              Event is finished
            </p>

          </div>

        <!--
        EVENT FINISHED
        -->
        {:else if WIDGET_DATA?.competition?.data?.status == 'canceled'}

          <div
            id="{CNAME}⮕status-is-canceled"
            class=
            "
            row-space-center
            "
          >

            <p
              class=
              "
              s-14
              w-500
              color-black-2
              "
            >
              Canceled
            </p>

          </div>

        {/if}

      </div>

      <!--
      SOCIAL SHARE
      -->
      <div
        id="{CNAME}⮕social-box"
        class=
        "
        row-space-out
        width-auto
        "
      >

        <!--
        SOCIAL TEXT
        -->
        <p
          class=
          "
          s-14
          w-500
          m-r-20
          color-black-2
          "
        >
          {WIDGET_T_DATA?.social_share ?? 'Share'}
        </p>

        <!--
        SOCIAL ICONS
        -->
        <div
          class=
          "
          row-space-end
          width-auto
          "
        >

          <!--
          FACEBOOK
          -->
          <a
            href="https://www.facebook.com/sharer/sharer.php?u={$page?.url?.href}"
            target="_blank"
          >
            <div
              class=
              "
              cursor-pointer
              social
              "
            >
              <img
                id=''
                src={$userBetarenaSettings?.theme == 'Dark' ? icon_facebook_white : icon_facebook}
                alt='icon_facebook'
                title='Facebook'
                loading='lazy'
                height=16
                width=16
              />
            </div>
          </a>

          <!--
          TWITTER
          -->
          <a
            href="https://twitter.com/intent/tweet?url={$page?.url?.href}&text="
            target="_blank"
          >
            <div
              class=
              "
              cursor-pointer
              social
              "
            >
              <img
                id=''
                src={$userBetarenaSettings?.theme == 'Dark' ? icon_twitter_white : icon_twitter}
                alt='icon_twitter'
                title='Twitter'
                loading='lazy'
                width=16
                height=16
              />
            </div>
          </a>

        </div>

      </div>

    {/if}

    <!--
    COMPETITION INFO
    -->
    <div
      id="competition-extra-box"
      class=
      "
      width-auto
      "
    >
      <CompDetails
        B_COMP_HIGH_D={WIDGET_DATA}
        WIDGET_T_DATA={WIDGET_T_DATA}
        {isViewMobile}
        {isViewTablet}
      />
    </div>

  </div>

  <!--
  📌 PARTICIPANTS
  -->
  <div
    id="{CNAME}⮕participants"
  >

    <!--
    YES VOTE
    -->
    <MainParticipantsList
      {isViewMobile}
      {isViewTablet}
      competitionStatus={WIDGET_DATA?.competition?.data?.status}
      geoLocationRestrictions={WIDGET_DATA?.competition?.data?.blacklist}
      entryFee={WIDGET_DATA?.competition?.data?.entry_fee}
      totalPrize=
      {
        (
          WIDGET_DATA?.competition?.data?.participants?.no?.length > 0
          ? ((WIDGET_DATA?.competition?.data?.participants?.no?.length * WIDGET_DATA?.competition?.data?.entry_fee) - (WIDGET_DATA?.competition?.data?.betarena_commission))
          : 0
        ) ?? 0
      }
      winnerGroup={WIDGET_DATA?.competition?.data?.winner_group}
      viewType={'yes'}
      participantList={WIDGET_DATA?.competition?.data?.participants?.yes}
      {participantsMap}
    />

    <!--
    NO VOTE
    -->
    <MainParticipantsList
      {isViewMobile}
      {isViewTablet}
      competitionStatus={WIDGET_DATA?.competition?.data?.status}
      geoLocationRestrictions={WIDGET_DATA?.competition?.data?.blacklist}
      entryFee={WIDGET_DATA?.competition?.data?.entry_fee}
      totalPrize=
      {
        (
          WIDGET_DATA?.competition?.data?.participants?.yes?.length > 0
          ? ((WIDGET_DATA?.competition?.data?.participants?.yes?.length * WIDGET_DATA?.competition?.data?.entry_fee) - (WIDGET_DATA?.competition?.data?.betarena_commission))
          : 0
        ) ?? 0
      }
      winnerGroup={WIDGET_DATA?.competition?.data?.winner_group}
      viewType={'no'}
      participantList={WIDGET_DATA?.competition?.data?.participants?.no}
      {participantsMap}
    />

  </div>

</div>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  div#competition⮕w⮕main⮕box
  {
    /* 🛝 layout */
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
  }

  /* div#competition⮕w⮕main⮕top-row
  {
  } */
  div#competition⮕w⮕main⮕profile
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    min-height: 64px;
    max-height: 64px;
    background: var(--white);
		box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
		border-radius: 12px 12px 0 0;
    padding: 16px 24px;
  }
  div#competition⮕w⮕main⮕status-social
  {
    /* 🎨 style */
    background: var(--white);
    padding: 16px 32px;
  }
  div#competition⮕w⮕main⮕status-is-active
  {
    /* 🎨 style */
    height: 40px;
    padding: 12px;
    border-radius: 8px;
    background-color: rgba(77, 160, 37, 0.2);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  }
  div#competition⮕w⮕main⮕status-is-finished
  {
    /* 🎨 style */
    height: 40px;
    padding: 12px;
    border-radius: 8px;
    background-color: #FFEBEB;
  }
  div#competition⮕w⮕main⮕status-is-canceled
  {
    /* 🎨 style */
    height: 40px;
    padding: 12px;
    border-radius: 8px;
    background-color: #F2F2F2;
  }
  div#competition⮕w⮕main⮕social-box
  {
    /* 🎨 style */
    min-height: 40px;
    max-height: 40px;
    border-radius: 8px;
    background: var(--whitev2);
    padding: 4px 4px 4px 12px;
  }
  div.social
  {
    /* 🎨 style */
    padding: 8px;
    border-radius: 8px;
    max-height: 32px;
  }
  div.social:hover
  {
    /* 🎨 style */
    background-color: var(--grey-color);
  }
  img.team-logo
  {
    /* 🎨 style */
    object-fit: contain;
  }

  h2.league-name
  {
    /* 🎨 style */
    max-width: 185px;
		overflow: hidden;
    text-overflow: ellipsis;
  }
  img.country-img
  {
    /* 🎨 style */
    border-radius: 16px;
    object-fit: cover;
  }

  div#competition⮕w⮕main⮕grid-section
  {
    /* 🎨 style */
    background-color: var(--white);
    margin-top: -8px;
    padding: 24px;
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
    /* ◼️◼️◼️ NOTE: disabled, but can be enabled with proper 'auto-fill' */
    /* grid-template-rows: 1fr 1fr 1fr; */
    gap: 24px;
  }
  div#competition⮕w⮕main⮕grid-section a#league-box
  {
    /* 🛝 layout */
    grid-column: 1;
    grid-row: 1;
  }
  div#competition⮕w⮕main⮕grid-section div#competition-extra-box
  {
    /* 🛝 layout */
    grid-column: 1;
    grid-row: 4;
  }

  div#competition⮕w⮕main⮕details
  {
    /* 🎨 style */
    background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    padding: 24px 32px;
    min-height: 130px;
    max-height: 130px;
  }

  div#competition⮕w⮕main⮕participants
  {
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: independent media query widget */
  and (min-width: 658px)
  {

    div#competition⮕w⮕main⮕grid-section
    {
      /* 🎨 style */
      background-color: white;
      margin-top: unset;
      padding: 24px;
      /* 🛝 layout */
      display: grid;
      grid-template-columns: 1fr 1fr;
      /* grid-template-rows: 1fr 1fr 1fr; */
      gap: 24px;
    }
    div#competition⮕w⮕main⮕grid-section a#league-box
    {
      /* 🎨 style */
      grid-column: 1;
      grid-row: 1;
    }
    div#competition⮕w⮕main⮕grid-section div#competition-extra-box
    {
      /* 🎨 style */
      grid-column: 1 / 3;
      grid-row: 3;
    }

	}

	@media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: independent media query widget */
  and (min-width: 768px)
  {

    div#competition⮕w⮕main⮕participants
    {
      /* 🛝 layout */
      grid-template-columns: 1fr 1fr;
    }

	}

	@media only screen
  /* ◼️◼️◼️ NOTE: 🖥️ LAPTOP */
  /* ◼️◼️◼️ NOTE: independent media query widget */
  and (min-width: 1200px)
  {

    div#competition⮕w⮕main⮕profile
    {
      /* 🎨 style */
      min-height: 112px;
      max-height: 112px;
      padding: 24px 32px;
    }

    div#competition⮕w⮕main⮕grid-section
    {
      /* 🛝 layout */
      align-items: center;
      gap: unset;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr 1fr;
    }
    div#competition⮕w⮕main⮕grid-section a#league-box
    {
      /* 🛝 layout */
      grid-column: 1;
      grid-row: 1;
    }
    div#competition⮕w⮕main⮕grid-section div#competition-extra-box
    {
      /* 🛝 layout */
      grid-column: 2;
      grid-row: 1;
    }

	}

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#competition⮕w⮕main⮕box.dark-background-1
  {
    /* 🎨 style */
    background-color: unset !important;
  }

  .dark-background-1 div#competition⮕w⮕main⮕profile,
  .dark-background-1 div#competition⮕w⮕main⮕social-box
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  .dark-background-1 div#competition⮕w⮕main⮕status-social,
  .dark-background-1 div#competition⮕w⮕main⮕grid-section
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade) !important;
  }

  .dark-background-1 div#competition⮕w⮕main⮕status-is-finished
  {
    /* 🎨 style */
    background-color: #5D3333;
  }
  .dark-background-1 div#competition⮕w⮕main⮕status-is-canceled
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

</style>
