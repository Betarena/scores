<!-- Based on template :: Svelte-Boilerplate.v6.Widget.svelte -->

<!--
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓ COMPONENT JS (w/ TS)                                                                 ▓▓
▓▓ NOTE:                                                                                ▓▓
▓▓ access custom Betarena Scores JS VScode Snippets by typing 'script...'               ▓▓
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'imports' that are required ▓▓
  // ▓▓ by 'this' .svelte file is ran.                                  ▓▓
  // ▓▓ IMPORTANT                                                       ▓▓
  // ▓▓ Please, structure the imports as follows:                       ▓▓
  // ▓▓ 1. svelte/sveltekit imports                                     ▓▓
  // ▓▓ 2. project-internal files and logic                             ▓▓
  // ▓▓ 3. component import(s)                                          ▓▓
  // ▓▓ 4. assets import(s)                                             ▓▓
  // ▓▓ 5. type(s) imports(s)                                           ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug.js';
	import { toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';
	import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';

  import icon_win from './assets/icon-green-thumbs-up.svg';
  import icon_draw from './assets/icon-grey-draw.svg';
  import icon_loose from './assets/icon-red-thumbs-down.svg';

	import type { BetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
	import type { LS2_C_Fixture } from '@betarena/scores-lib/types/livescores-v2.js';
	import type { B_SAP_D1, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_FIX_COMP_D, B_FIX_COMP_TS } from '@betarena/scores-lib/types/types.fixture.competition.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'variables' that are to be  ▓▓
  // ▓▓ and are expected to be used by 'this' .svelte file / component. ▓▓
  // ▓▓ IMPORTANT                                                       ▓▓
  // ▓▓ Please, structure the imports as follows:                       ▓▓
  // ▓▓ 1. export const / let [..]                                      ▓▓
  // ▓▓ 2. const [..]                                                   ▓▓
  // ▓▓ 3. let [..]                                                     ▓▓
  // ▓▓ 4. $: [..]                                                      ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  export let
    /** @augments B_FIX_COMP_D */
    WIDGET_DATA: B_FIX_COMP_D
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
    /** @augments B_FIX_COMP_TS */
    WIDGET_T_DATA: B_FIX_COMP_TS,
    /** @augments B_SAP_D1 */
    B_SAP_D1: B_SAP_D1,
    /** @augments B_SAP_D3 */
    B_SAP_D3_TEAM_M: B_SAP_D3,
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
    participantsMap: Map < string, BetarenaUser > = new Map(),
    /** @description TODO: DOC: */
    competitionWasLive: boolean = false
  ;

  $: WIDGET_T_DATA = $page.data?.B_COMP_MAIN_T;
  $: B_SAP_D1 = $page.data?.B_SAP_D1;
	$: B_SAP_D3_TEAM_M = $page.data?.B_SAP_D3_TEAM_M;

  // ▓▓ IMPORTANT
  // ▓▓ Reactivity deep-value listen(s).
  $: competitionMapDataChng = JSON.stringify([...($sessionStore?.competitions_map?.entries() ?? [])]);
  $: livescoreNowScoreboardChng = JSON.stringify([...($sessionStore?.livescore_now_scoreboard?.entries() ?? [])]);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'methods' that are to be    ▓▓
  // ▓▓ and are expected to be used by 'this' .svelte file / component. ▓▓
  // ▓▓ IMPORTANT                                                       ▓▓
  // ▓▓ Please, structure the imports as follows:                       ▓▓
  // ▓▓ 1. function (..)                                                ▓▓
  // ▓▓ 2. async function (..)                                          ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Triggers viewport changes.
   * @returns { void }
   */
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
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Local component wrapper
   *  (⚡️) `window` (resize-change) listener.
   * @returns { void }
   */
  function addEventListeners
  (
  ): void
  {
    // ▓▓ NOTE:
    // ▓▓ listen to 'resize'.
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
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Fetch / update participants data for `this` competition (fixture) data.
   * @returns { void }
   */
  async function getParticipantData
  (
  ): Promise < void >
  {
    // ▓▓ IMPORTANT
    if (!browser) return;

    const participantUid: string[] = new Competition().extractParticipantUids
    (
      WIDGET_DATA?.competition
    );

    const newUids: string[] = [];

    for (const uid of participantUid)
    {
      // ▓▓ CHECK
      // ▓▓ for missing 'uid' from participant `map`.
      const if_M_0: boolean =
        participantsMap?.has(uid)
      ;
      if (if_M_0) continue;
      newUids.push(uid);
    }

    // ▓▓ CHECK
    // ▓▓ for wether necessary to make new request for participant data.
    const if_M_0: boolean =
      newUids?.length == 0
    ;
    if (if_M_0) return;

    const participantPublicData = await new Betarena_User_Class().obtainPublicInformationTargetUsers
    (
      newUids
    ) as (BetarenaUser | undefined)[];

    const newParticipantsMap: Map < string, BetarenaUser > = new Betarena_User_Class().convertToMap
    (
      participantPublicData
    );

    // ▓▓ IMPORTANT
    participantsMap = new Map([...participantsMap, ...newParticipantsMap]);

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Injects / Hydrates target competition (fixture) data with 'LIVE' (fresh) livescores data.
   *  (⚡️) handles cases for 'no longer LIVE' orphan data.
   * @returns { void }
   */
  async function injectLivescoresData
  (
  ): Promise < void >
  {

    if (!browser) return;

    const liveFixturesMap: Map < number, FIRE_LNNS > = $sessionStore?.livescore_now_scoreboard;

    const competitionFixtureId: number = WIDGET_DATA?.competition?.fixture_id;

    // ▓▓ CHECK
    // ▓▓ for 'orphan' (no longer live) fixture data, but present in local live-map instance.
    // ▓▓ NOTE:
    // ▓▓ cause for (exit).
    const if_M_0: boolean =
      competitionWasLive
      && !liveFixturesMap.has(competitionFixtureId)
    ;
    if (if_M_0)
    {

      const data_0 = await get
      (
        `/api/data/home/livescores-v2?fixtureIds=${competitionFixtureId?.toString()}`,
        null,
        true,
        true
      ) as unknown;

      const _fixtureMap = new Map
      (
        Object.entries(data_0)
      ) as unknown as Map <string, LS2_C_Fixture>;

      const newOrphanData: LS2_C_Fixture = _fixtureMap.get(competitionFixtureId?.toString())

      WIDGET_DATA.fixture_detailed.teams =
      {
        away:
        {
          score: newOrphanData?.teams?.away?.score,
        },
        home:
        {
          score: newOrphanData?.teams?.home?.score,
        }
      }

      // ▓▓ IMPORTANT
      WIDGET_DATA = WIDGET_DATA;

      competitionWasLive = false;

      return;
    }

    // ▓▓ CHECK
    // ▓▓ for valid competitions map data.
    const if_M_1: boolean =
      !liveFixturesMap?.has(competitionFixtureId)
    ;
    if (if_M_1) return;

    competitionWasLive = true;

    // ▓▓ IMPORTANT
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

    // ▓▓ IMPORTANT
    WIDGET_DATA = WIDGET_DATA;

    return;

  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Injects / Hydrates `this` competition (fixture) data with `LIVE` (fresh) competitions data.
   * @returns { void }
   */
  function injectLiveData
  (
  ): void
  {
    const competitionMap: Map < number, B_H_COMP_DATA > = $sessionStore?.competitions_map;

    // ▓▓ CHECK
    // ▓▓ for valid competitions map data.
    const if_M_0: boolean =
      competitionMap?.size == 0
      && !competitionMap?.has(WIDGET_DATA?.competition?.id)
    ;
    if (if_M_0) return;

    WIDGET_DATA.competition = competitionMap?.get(WIDGET_DATA?.competition?.id);

    getParticipantData();

    // ▓▓ IMPORTANT
    WIDGET_DATA = WIDGET_DATA;

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Correctly determine prediction for `this` competition (fixture).
   * @returns { void }
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

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'logic' that should run     ▓▓
  // ▓▓ immediately and/or reactively for 'this' .svelte file is ran.   ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

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
    // ▓▓ [🐞]
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
    // ▓▓ [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ competitionMapDataChng`,
      true
    );

    injectLivescoresData();
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'logic' that should run     ▓▓
  // ▓▓ immediately and as part of the 'lifecycle' of svelteJs,         ▓▓
  // ▓▓ as soon as 'this' .svelte file is ran.                          ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  onMount
  (
    async() =>
    {
      // ▓▓ IMPORTANT
      resizeAction();
      addEventListeners();

      determinePrediction()
      getParticipantData();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓ COMPONENT HTML                                                                    ▓▓
▓▓ NOTE:                                                                             ▓▓
▓▓ use 'CTRL+SPACE' to autocomplete global class=styles                              ▓▓
▓▓ NOTE:                                                                             ▓▓
▓▓ access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.        ▓▓
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
-->

<!--
COMPETITION MAIN
-->
<div
  id="{CNAME}⮕box"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  🎆 FIXTURE COMPETITION ➤ MAIN
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
            capitalize
            "
            class:s-16={isViewTablet}
            class:s-32={!isViewTablet}
          >
            {B_SAP_D3_TEAM_M?.[$sessionStore?.serverLang]}
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
            google-aspect-ratio
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
        width-auto
        text-right
        "
        class:row-space-end={!isViewMobile}
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
            w-500
            dark-white-v3
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

  </div>

  <!--
  🎆 FIXTURE COMPETITION ➤ POOL PRIZES / SECTIONS
  -->
  <div>

  </div>

</div>

<!--
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓ COMPONENT STYLE                                                                   ▓▓
▓▓ NOTE:                                                                             ▓▓
▓▓ auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE     ▓▓
▓▓ NOTE:                                                                             ▓▓
▓▓ access custom Betarena Scores CSS VScode Snippets by typing 'style...'            ▓▓
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
-->

<style>

  div#competition⮕w⮕main⮕box
  {
    /* 🎨 style */
    border-radius: 12px;
    overflow: hidden;
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
    padding: 16px 24px;
  }
  div#competition⮕w⮕main⮕status-social
  {
    /* 🎨 style */
    background: var(--white);
    padding: 16px 32px;
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
      margin-top: unset;
      padding: 22px 32px;
      /* 🛝 layout */
      /* ◼️◼️◼️ NOTE: disabled, but can be enabled with proper 'auto-fill' */
      /* grid-template-rows: 1fr 1fr 1fr; */
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

</style>
