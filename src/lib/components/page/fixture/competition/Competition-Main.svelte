<!-- Based on template :: Svelte-Boilerplate.v7.Widget.svelte -->

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
	import { langPrefix, toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';
	import { translationObject } from '$lib/utils/translation.js';
	import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';

	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import CompCountdownStatus from '$lib/components/shared/COMP-Countdown-+-Status.svelte';
	import CompetitionPoolSelection from './Competition-Pool-Selection.svelte';

  import icon_draw from './assets/icon-grey-draw.svg';
  import icon_probability_green from './assets/icon-probability-green.svg';
  import icon_probability_red from './assets/icon-probability-red.svg';
  import icon_profile_avatar from './assets/icon-profile-avatar.svg';
  import icon_loose from './assets/icon-thumbs-down-red.svg';
  import icon_win from './assets/icon-thumbs-up-green.svg';

	import type { BetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
	import type { LS2_C_Fixture } from '@betarena/scores-lib/types/livescores-v2.js';
	import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_FIX_COMP_D, B_FIX_COMP_T } from '@betarena/scores-lib/types/types.fixture.competition.js';

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
    /** @description 📱 MOBILE */
    VIEWPORT_MOBILE_INIT = 581,
    /** @description 💻 TABLET */
    VIEWPORT_TABLET_INIT = 820,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'fixture⮕competition⮕w⮕main'
  ;

  let
    /** @augments B_FIX_COMP_T */
    WIDGET_T_DATA: B_FIX_COMP_T,
    /** @augments B_SAP_D3 - teams */
    B_SAP_D3_TEAM_M: B_SAP_D3,
    /** @augments B_SAP_D3 - competitions */
    B_SAP_D3_CP_M: B_SAP_D3,
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
    competitionWasLive: boolean = false,
    /** @description TODO: DOC: */
    counterTotalPrize: number = 0,
    /** @description TODO: DOC: */
    counterTotalAnimated: boolean = true,
    /** @description mirror value for simplicity of probability */
    mirrorProbability: number
  ;

  $: WIDGET_T_DATA = $page.data?.B_FIX_COMP_T;
	$: B_SAP_D3_TEAM_M = $page.data?.B_SAP_D3_TEAM_M;
	$: B_SAP_D3_CP_M = $page.data?.B_SAP_D3_CP_M;
  $: participantNumber = WIDGET_DATA?.competition?.data?.participants?.yes?.length + WIDGET_DATA?.competition?.data?.participants?.no?.length

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

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 A countdown animation for `total prize` value.
   * @returns { void }
   */
  function countAnimation
  (
  ): void
  {
    let counts: NodeJS.Timeout = setInterval(updated);
    let totalCount: number = WIDGET_DATA?.competition?.data?.total_prize - WIDGET_DATA?.competition?.data?.betarena_commission;

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

  /**
   * @description
   */
  function mirrorValues
  (
  ): void
  {
    if (WIDGET_DATA?.competition?.data?.prediction == '1')
      mirrorProbability = WIDGET_DATA?.fixture?.probabilities?.home;
    else if (WIDGET_DATA?.competition?.data?.prediction == '2')
      mirrorProbability = WIDGET_DATA?.fixture?.probabilities?.away;
    else
      mirrorProbability = WIDGET_DATA?.fixture?.probabilities?.draw;
      toDecimalFix(WIDGET_DATA?.fixture?.probabilities?.draw, 0);
    ;
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
   * WARNING:
   * can go out of control
   * @description
   *  📌 Listens to changes in competition data.
   * WARNING:
   * triggered by changes in:
   * - `competitionMapDataChng` - **kicker** (via deepListen)
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
   *  🔥 REACTIVITY
   * WARNING:
   * can go out of control
   * @description
   *  📌 Listens to changes in competition data.
   * WARNING:
   * triggered by changes in:
   * - `competitionMapDataChng` - **kicker**  (via deepListen)
   */
  $: if (livescoreNowScoreboardChng)
  {
    // ▓▓ [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ livescoreNowScoreboardChng`,
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

      determinePrediction();
      getParticipantData();
      countAnimation();
      mirrorValues();
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

<div>

  <WidgetTitle
    WIDGET_TITLE={'Competition'}
  />

  <!--
  ▓▓ Main widget
  -->
  <div
    id="{CNAME}⮕box"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    ▓▓ Main (top) competition data.
    -->
    <a
      href={`/${WIDGET_DATA?.competition?.urls?.[$sessionStore?.serverLang]}`}
    >
      <div
        id="{CNAME}⮕profile"
        class:predict-to-win={WIDGET_DATA?.competition?.data?.target_team_prediction_term == 'win'}
        class:predict-to-lose={WIDGET_DATA?.competition?.data?.target_team_prediction_term == 'lose'}
        class:column-space-start={isViewMobile}
        class:row-space-out={!isViewTablet || (isViewTablet && !isViewMobile)}
        class:stauts-component-adjust={WIDGET_DATA?.competition?.data?.status != 'pending'}
      >

        <!--
        ▓▓ Target competition target main info (1st box)
        -->
        <div
          id="competition-info"
          class=
          "
          row-space-out
          "
        >

          <!--
          ▓▓ Main prelimnary competition data
          -->
          <div
            class=
            "
            row-space-start
            flex-start
            "
          >

            <!--
            ▓▓ First column of competition Data
            -->
            <div
            >

              <!--
              ▓▓ Team (term) and team image
              -->
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
                  m-r-5
                  m-0
                  capitalize
                  "
                  class:s-16={isViewTablet}
                  class:s-20={!isViewTablet}
                >
                  {B_SAP_D3_TEAM_M?.[$sessionStore?.serverLang]}
                </h1>

                <img
                  id=''
                  src={WIDGET_DATA?.team_logo}
                  alt='competition-team-logo'
                  title={WIDGET_DATA?.team_name}
                  loading='lazy'
                  width={isViewTablet ? 16 : 24}
                  height={isViewTablet ? 16 : 24}
                  class=
                  "
                  m-r-5
                  google-aspect-ratio
                  "
                />

              </div>

              <!--
              ▓▓ Is-Going-To (term)
              -->
              <h1
                class=
                "
                color-grey-v2
                grey-v1
                w-500
                m-0
                no-wrap
                m-r-8
                "
                class:s-12={isViewTablet}
                class:s-16={!isViewTablet}
              >
                {WIDGET_T_DATA?.term_is_going_to_a ?? 'is going to'}
              </h1>

            </div>

            <!--
            ▓▓ Second column of competition Data
            -->
            <div
            >

              <!--
              ▓▓ Team name
              -->
              <h1
                class=
                "
                color-black-2
                w-500
                m-0
                "
                class:s-16={isViewTablet}
                class:s-20={!isViewTablet}
              >
                {WIDGET_DATA?.team_name ?? ''}
              </h1>

              <!--
              ▓▓ Target competition type.
              -->
              <div
                class=
                "
                row-space-start
                "
              >

                <img
                  id=''
                  src={icon_prediction}
                  alt='prediction-icon'
                  title='CompetitionWin'
                  loading='lazy'
                  width={isViewTablet ? 16 : 20}
                  height={isViewTablet ? 16 : 20}
                  class=
                  "
                  m-r-5
                  "
                />

                <p
                  class=
                  "
                  w-500
                  dark-white-v3
                  "
                  class:s-12={isViewTablet}
                  class:s-16={!isViewTablet}
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

            </div>

          </div>

          <!--
          ▓▓ 📱 MOBILE
          -->
          {#if isViewMobile}

            <!--
            ▓▓ Target competition probability
            -->
            <div
              class=
              "
              text-left
              "
            >

              <p
                class=
                "
                s-12
                no-wrap
                color-grey grey-v1
                "
              >
                {WIDGET_T_DATA?.title_prob ?? 'Probability'}
              </p>

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
                  color-black-2
                  w-500
                  capitalize
                  m-r-6
                  "
                >
                  {toDecimalFix(mirrorProbability, 0)}%
                </p>

                <img
                  id=''
                  src={mirrorProbability > 50 ? icon_probability_green : icon_probability_red}
                  alt='probability_icon'
                  title='Probability'
                  loading='lazy'
                />
              </div>

            </div>

          {/if}

        </div>

        <!--
        ▓▓ Target competition target main info (2nd box)
        -->
        <div
          id="stats"
          class=
          "
          text-right
          {isViewMobile ? 'row-space-start' : 'width-auto'}
          "
          class:row-space-end={!isViewMobile}
        >

          <!--
          ▓▓ 💻 TABLET + 🖥️ LAPTOP
          -->
          {#if !isViewMobile}

            <!--
            ▓▓ COMPETITION ➤ PROBABILITY
            -->
            <div
              class=
              "
              text-left
              "
            >

              <p
                class=
                "
                s-12
                no-wrap
                color-grey grey-v1
                capitalize
                "
              >
                {WIDGET_T_DATA?.title_prob ?? 'Probability'}
              </p>

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
                  color-black-2
                  w-500
                  capitalize
                  m-r-6
                  "
                >
                  {toDecimalFix(mirrorProbability, 0)}%
                </p>

                <img
                  id=''
                  src={mirrorProbability > 50 ? icon_probability_green : icon_probability_red}
                  alt='probability_icon'
                  title='Probability'
                  loading='lazy'
                />
              </div>

            </div>

          {/if}

          <!--
          ▓▓ Target competition entry-fee.
          -->
          <div
            class=
            "
            text-left
            "
          >

            <p
              class=
              "
              s-12
              no-wrap
              color-grey grey-v1
              "
            >
              {WIDGET_T_DATA?.title_entry_fee ?? 'Entry Fee'}
            </p>

            <p
              class=
              "
              s-16
              color-black-2
              w-500
              capitalize
              no-wrap
              "
            >
              {WIDGET_DATA?.competition?.data?.entry_fee ?? ''} BTA
              <span
                class=
                "
                color-grey-v2
                grey-v1
                s-14
                "
              >
                (${WIDGET_DATA?.competition?.data?.entry_fee ?? ''})
              </span>
            </p>

          </div>

          <!--
          ▓▓ Target competition total-prize.
          -->
          <div
            class=
            "
            text-left
            "
          >

            <p
              class=
              "
              s-12
              no-wrap
              color-grey grey-v1
              "
            >
              {WIDGET_T_DATA?.title_total_prize ?? 'Total prize'}
            </p>

            <p
              class=
              "
              s-16
              w-500
              color-black-2
              capitalize
              no-wrap
              "
            >

              {#if !counterTotalAnimated}
                {toDecimalFix((WIDGET_DATA?.competition?.data?.total_prize - WIDGET_DATA?.competition?.data?.betarena_commission), 2, true) ?? ''} BTA
              {:else}
                {toDecimalFix(counterTotalPrize, 2, true)} BTA
              {/if}

              <span
                class=
                "
                color-grey-v2
                grey-v1
                s-14
                "
              >
                {#if !counterTotalAnimated}
                  (${toDecimalFix((WIDGET_DATA?.competition?.data?.total_prize - WIDGET_DATA?.competition?.data?.betarena_commission), 2, true) ?? ''})
                {:else}
                  (${toDecimalFix(counterTotalPrize, 2, true)})
                {/if}
              </span>

            </p>

          </div>

        </div>

        <!--
        ▓▓ Target competition countdown / status (component).
        -->
        {#if WIDGET_DATA?.competition?.data?.status != 'pending'}
          <div
            id="countdown-box"
            class=
            "
            width-fit-content
            "
          >
            <CompCountdownStatus
              {isViewMobile}
              {isViewTablet}
              forceView={false}
              B_COMP_HIGH_D={WIDGET_DATA}
              WIDGET_T_DATA={WIDGET_T_DATA}
              designView={'2'}
            />
          </div>
        {/if}

      </div>
    </a>

    <!--
    ▓▓ Inner box of further competition data.
    -->
    <div
      id="{CNAME}⮕inner-box"
    >

      <!--
      ▓▓ Pool prizes / sections.
      -->
      <div
        id="{CNAME}⮕join-box"
        class=
        "
        m-b-24
        "
      >

        <!--
        ▓▓ YES VOTE
        -->
        <CompetitionPoolSelection
          {isViewMobile}
          {isViewTablet}
          competitionId={WIDGET_DATA?.competition?.id}
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
        ▓▓ NO VOTE
        -->
        <CompetitionPoolSelection
          {isViewMobile}
          {isViewTablet}
          competitionId={WIDGET_DATA?.competition?.id}
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

      <!--
      ▓▓ Competition footer.
      -->
      <div
        class=
        "
        row-space-out
        "
      >

        <!--
        ▓▓ Competition type (format)
        -->
        <a
          href={`${langPrefix()}${B_SAP_D3_CP_M?.[$sessionStore?.serverLang]}`}
        >

          <div
            class=
            "
            width-auto
            "
            class:row-space-start={!isViewMobile}
          >

            <p
              class=
              "
              s-12
              color-grey
              "
              class:m-b-5={isViewMobile}
              class:m-r-12={!isViewMobile}
            >
              {WIDGET_T_DATA?.title_type ?? 'Type'}
            </p>

            <p
              class=
              "
              s-14
              color-black-2
              w-500
              "
            >
              <!-- {WIDGET_DATA?.competition?.data?.type_id} -->
              Single Predictor
            </p>

          </div>

        </a>

        <!--
        ▓▓ Last 5 participants (preview) avatars.
        -->
        <div
          id="{CNAME}⮕participants"
          class=
          "
          width-auto
          {isViewMobile ? 'column-space-start flex-start' : ''}
          "
          class:row-space-start={!isViewMobile}
        >

          <!--
          ▓▓ 💻 TABLET ▓▓ 🖥️ LAPTOP
          ▓▓ Participant(s) title
          -->
          {#if !isViewMobile}
            <p
              class=
              "
              s-14
              color-black-2
              w-500
              no-wrap
              "
            >
              {participantNumber ?? 0}
              {WIDGET_T_DATA?.title_participants ?? translationObject?.participants}
            </p>
          {/if}

          {#if participantNumber > 0}

            <!-- {@const participantMerger = [ ...WIDGET_DATA?.competition?.data?.participants?.yes, ...WIDGET_DATA?.competition?.data?.participants?.no]} -->

            <div
              class=
              "
              width-auto
              row-space-start
              participant-list
              "
              class:m-b-5={isViewMobile}
              class:m-l-10={!isViewMobile}
            >

              {#each [ ...WIDGET_DATA?.competition?.data?.participants?.yes, ...WIDGET_DATA?.competition?.data?.participants?.no]?.slice(0, (isViewTablet ? 3 : 5)) ?? [] as uid}

                <img
                  class=
                  "
                  participant-main-img
                  "
                  src={participantsMap?.get(uid)?.profile_photo ?? icon_profile_avatar}
                  alt='participant_1'
                  title='Partitipant_1'
                  loading='lazy'
                  width={isViewMobile ? 18 : 24}
                  height={isViewMobile ? 18 : 24}
                />

              {/each}

            </div>

          {/if}

          <!--
          ▓▓ 📱 MOBILE
          ▓▓ Participant(s) title
          -->
          {#if isViewMobile}
            <p
              class=
              "
              s-14
              color-black-2
              w-500
              no-wrap
              "
            >
              {[ ...WIDGET_DATA?.competition?.data?.participants?.yes, ...WIDGET_DATA?.competition?.data?.participants?.no]?.length ?? 0}
              {WIDGET_T_DATA?.title_participants ?? translationObject?.participants}
            </p>
          {/if}

        </div>

      </div>

    </div>

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

  div#fixture⮕competition⮕w⮕main⮕box
  {
    /* 🎨 style */
    border-radius: 12px;
    overflow: hidden;
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
  }

  div#fixture⮕competition⮕w⮕main⮕profile
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    min-height: 138px;
    border-radius: 8px 8px 0px 0px;
    background-color: var(--white);
		box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
    display: grid;
		grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  div#fixture⮕competition⮕w⮕main⮕profile.stauts-component-adjust
  {
    /* 🛝 layout */
    grid-template-rows: auto auto auto;
  }
  div#fixture⮕competition⮕w⮕main⮕profile.predict-to-win
  {
    /* 🎨 style */
    background: linear-gradient(297deg, var(--white) 32.98%, #B5E5B7 212.06%, #B5E5B7 212.06%);
  }
  div#fixture⮕competition⮕w⮕main⮕profile.predict-to-lose
  {
    /* 🎨 style */
    background: linear-gradient(311deg, var(--white) 61.18%, #EFC3C3 161.11%);
  }
  div#fixture⮕competition⮕w⮕main⮕profile div#competition-info
  {
    /* 📌 position */
    grid-row: 1;
		grid-column: 1/3;
  }
  div#fixture⮕competition⮕w⮕main⮕profile div#stats
  {
    /* 📌 position */
    grid-row: 2;
		grid-column: 1/3;
    /* 🛝 layout */
    display: grid;
    gap: 32px;
    grid-auto-flow: column;
  }
  div#fixture⮕competition⮕w⮕main⮕profile div#countdown-box
  {
    /* 📌 position */
    grid-row: 3;
		grid-column: 1/3;
  }

  div#fixture⮕competition⮕w⮕main⮕inner-box
  {
    /* 🎨 style */
    padding: 20px 16px;
    background: var(--white);
  }

  div#fixture⮕competition⮕w⮕main⮕join-box
  {
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  div#fixture⮕competition⮕w⮕main⮕participants img.participant-main-img
  {
    /* 🎨 style */
    margin-right: -9px;
    border-radius: 32px;
    border: 1px solid var(--whitev2);
  }
  div#fixture⮕competition⮕w⮕main⮕participants img.participant-main-img:last-child
  {
    /* 🎨 style */
    margin-right: 0;
  }

  /*
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓▓ ⚡️ RESPONSIVNESS     ▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  */

  @media only screen
  /* ▓▓ NOTE: 💻 TABLET */
  /* ▓▓ NOTE: independent media query widget */
  and (min-width: 658px)
  {
    div#fixture⮕competition⮕w⮕main⮕profile
    {
      /* 🎨 style */
      min-height: 88px;
    }
    div#fixture⮕competition⮕w⮕main⮕profile.stauts-component-adjust
    {
      /* 🛝 layout */
      grid-template-rows: auto auto;
    }
    div#fixture⮕competition⮕w⮕main⮕profile div#competition-info
    {
      /* 📌 position */
      grid-row: 1;
      grid-column: 1/2;
    }
    div#fixture⮕competition⮕w⮕main⮕profile div#stats
    {
      /* 📌 position */
      grid-row: 1;
      grid-column: 2/4;
      /* 🛝 layout */
      display: grid;
      gap: 32px;
      grid-auto-flow: column;
    }
    div#fixture⮕competition⮕w⮕main⮕profile div#countdown-box
    {
      /* 📌 position */
      grid-row: 2;
      grid-column: 1/3;
    }

    div#fixture⮕competition⮕w⮕main⮕join-box
    {
      /* 🛝 layout */
      gap: 12px;
      grid-template-columns: 1fr 1fr;
    }
	}

	@media only screen
  /* ▓▓ NOTE: 💻 TABLET */
  /* ▓▓ NOTE: independent media query widget */
  and (min-width: 768px)
  {
    /* NaN */
	}

	@media only screen
  /* ▓▓ NOTE: 🖥️ LAPTOP */
  /* ▓▓ NOTE: independent media query widget */
  and (min-width: 1200px)
  {
    /* NaN */
	}

	/*
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓▓ 🌒 DARK-THEME       ▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  */

  div#fixture⮕competition⮕w⮕main⮕box.dark-background-1
  {
    /* 🎨 style */
    background-color: unset !important;
  }

  .dark-background-1 div#fixture⮕competition⮕w⮕main⮕profile
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }
  .dark-background-1 div#fixture⮕competition⮕w⮕main⮕profile.predict-to-win
  {
    /* 🎨 style */
    background: linear-gradient(291deg, var(--dark-theme-1) 36.28%, #3F7B41 172.84%);
  }
  .dark-background-1 div#fixture⮕competition⮕w⮕main⮕profile.predict-to-lose
  {
    /* 🎨 style */
    background: linear-gradient(297deg, var(--dark-theme-1) 33.23%, #9F4949 171.99%);
  }
  .dark-background-1 div#fixture⮕competition⮕w⮕main⮕inner-box
  {
    /* 🎨 style */
    background: var(--dark-theme-1-4-shade);
  }

  .dark-background-1 div#fixture⮕competition⮕w⮕main⮕participants img.participant-main-img
  {
    /* 🎨 style */
    border: 1px solid var(--dark-theme-1-4-shade);
  }

</style>
