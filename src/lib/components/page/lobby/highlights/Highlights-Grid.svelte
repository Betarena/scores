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
	import { createEventDispatcher, onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import sessionStore from '$lib/store/session.js';
	import { dlog } from '$lib/utils/debug.js';
	import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';
  import { Parser } from '@betarena/scores-lib/dist/classes/class.parser.js';

  import HighlightsNoCompetitions from './Highlights-No-Competitions.svelte';

  import icon_question_mark from './assets/icon-question-mark.svg';

  import type { IBetarenaUser } from '@betarena/scores-lib/types/firebase/firestore.js';
	import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
	import type { LS2_C_Fixture } from '@betarena/scores-lib/types/livescores-v2.js';
	import type { B_SAP_CP_T } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_COMP_HIGH_D, B_COMP_HIGH_D_EXTRA, B_COMP_HIGH_D_RES } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    WIDGET_DATA: Map < number, B_COMP_HIGH_D >,
    LIMITS: Map < B_COMP_HIGH_D_EXTRA, number >
  ;

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 912,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competition⮕w⮕highlights-grid'
  ;

  let
    /** @description TODO: DOC: */
    isViewMobile: boolean = false,
    /** @description TODO: DOC: */
    isViewTablet: boolean = false,
    /** Page data availabe for `this` layout */
    B_SAP_CP_T: B_SAP_CP_T,
    /** @description dynamic import variable condition */
    useDynamicImport: boolean = true,
    /** @description dynamic import variable for svelte component */
    HighlightsGridRowAsDynamic: any,
    /** @description competitions (lobby) highlights (widget) - active competitions list */
    activeCompetitions: B_COMP_HIGH_D[],
    /** @description competitions (lobby) highlights (widget) - pending competitions list */
    openCompetitions: B_COMP_HIGH_D[],
    /** @description competitions (lobby) highlights (widget) - finished / canceled competitions list */
    finishedCompetitions: B_COMP_HIGH_D[],
    /** @description TODO: DOC: */
    liveCompetitions: Set < number > = new Set(),
    /** @description competitions (lobby) highlights (widget) - no competitions available */
    isNoCompetitions: boolean = false,
    /** @description competitions (lobby) highlights (widget) - all participants map */
    participantsMap: Map < string, IBetarenaUser > = new Map(),
    /** @description TODO: DOC: */
    competitionMapSnap: Map < number, B_H_COMP_DATA > = new Map()
  ;

  const dispatch = createEventDispatcher();

  $: B_SAP_CP_T = $page.data?.B_SAP_CP_T;

  // ### IMPORTANT
  // ### Reactivity deep-value listen(s).
  $: competitionMapDataChng = JSON.stringify([...($sessionStore?.competitions_map?.entries() ?? [])]);
  $: livescoreNowScoreboardChng = JSON.stringify([...($sessionStore?.livescore_now_scoreboard?.entries() ?? [])]);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * 📌 Separates competitions by their respective status.
   *
   * @returns
   * A void.
   */
  function splitCompetitionsByStatus
  (
  ): void
  {
    openCompetitions = [];
    activeCompetitions = [];
    finishedCompetitions = [];

    // ### NOTE:
    // ### loop over each competition.
    for (const [, value] of WIDGET_DATA ?? [])
    {

      // ### CHECK
      // ### for competition to be placed in 'group' of 'type: Open'.
      const if_M_0: boolean =
        value?.competition?.data?.status == 'pending'
      ;
      if (if_M_0)
        openCompetitions.push(value)
      ;

      // ### CHECK
      // ### for competition to be placed in 'group' of 'type: Active'.
      const if_M_1: boolean =
        value?.competition?.data?.status == 'active'
      ;
      if (if_M_1)
        activeCompetitions.push(value)
      ;

      // ### CHECK
      // ### for competition to be placed in 'group' of 'type: Finished || Canceled'.
      const if_M_2: boolean =
        ['finished', 'canceled'].includes(value?.competition?.data?.status)
      ;
      if (if_M_2)
        finishedCompetitions.push(value)
      ;

    }

    // ### CHECK
    // ### for 'no competitions' view.
    const if_M_0: boolean =
      openCompetitions?.length == 0
      && activeCompetitions?.length == 0
      && finishedCompetitions?.length == 0
    ;
    if (if_M_0) isNoCompetitions = true;
    else isNoCompetitions = false;

    // ### NOTE:
    // ### sort (precautionary) by id's.
    if (openCompetitions?.length > 0)
      openCompetitions
      .sort
      (
        (
          a
          ,b
        ) =>
          (b?.competition?.data?.participants?.no?.length + b?.competition?.data?.participants?.yes.length)
          - (a?.competition?.data?.participants?.no.length + a?.competition?.data?.participants?.yes.length)
      );
    ;
    if (activeCompetitions?.length > 0)
      activeCompetitions
      .sort
      (
        (
          a
          ,b
        ) =>
          b?.competition?.id - a?.competition?.id
      );
    ;
    if (finishedCompetitions?.length > 0)
      finishedCompetitions
      .sort
      (
        (
          a
          ,b
        ) =>
          b?.competition?.id - a?.competition?.id
      );
    ;

    openCompetitions = openCompetitions;
    activeCompetitions = activeCompetitions;
    finishedCompetitions = finishedCompetitions;
  }

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * 📌 Injects / Hydrates competitions (fixtures) data with `LIVE` (fresh) competitions data.
   *
   * @returns
   * An asynchronous void.
   */
  async function injectLiveData
  (
  ): Promise < void >
  {
    if (!browser) return;

    const competitionMap: Map < number, B_H_COMP_DATA > = $sessionStore?.competitions_map;
    competitionMapSnap = JSON.parse(JSON.stringify([...$sessionStore?.competitions_map?.entries()]));
    const competitionIdsMissingUpdated: number[] = [];

    // ### CHECK
    // ### for valid competitions map data.
    const if_M_0: boolean =
      competitionMap?.size == 0
    ;
    if (if_M_0) return;

    // ### NOTE:
    // ### inject 'competitions' that recieved a status 'update', but are not present in the overall data list

    for (const [compId, compObj] of competitionMapSnap ?? [])
    {
      // ### CHECK
      // ### for changes in competition 'status'
      if (competitionMap?.get(compId)?.data?.status != compObj?.data?.status && !WIDGET_DATA?.has(compId))
        competitionIdsMissingUpdated.push(compId);
    }

    // ### NOTE:
    // ### fetch update competitions, missing from the `list`.

    if (competitionIdsMissingUpdated?.length > 0)
    {
      const response = await get
      (
        `/api/data/lobby/highlights
          ?competitionIds=${competitionIdsMissingUpdated?.toString()}`,
        null,
        true,
        false,
      ) as B_COMP_HIGH_D_RES;

      const newMap = new Map(response?.data);

      WIDGET_DATA = new Map([...WIDGET_DATA, ...newMap]);
    }

    // ### NOTE:
    // ### update 'this' competition data with new data.

    for (const [key, value] of WIDGET_DATA ?? [])
    {
      // ### CHECK
      // ### for competition to exist in 'live' data.
      const if_M_0: boolean =
        !competitionMap?.has(key)
      ;
      if (if_M_0) continue;

      value.competition = competitionMap?.get(key);

      // ### NOTE:
      // ### participant data gathering is offset to its own logic.

      // ### IMPORTANT
      // ### inform of update in data.
      // B_COMP_HIGH_D = B_COMP_HIGH_D;

    }

    getParticipantData();
    splitCompetitionsByStatus();

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 MAIN | 🔹 HELPER
   * @description
   *  📌 Logic for pagination of competitions.
   * @param targetStatus
   *  Target competition status to be searched for.
   * @returns { Promise < void > }
   */
  async function getMoreTargetStatusCompetitions
  (
    targetStatus: string,
  ): Promise < void >
  {

    let offset: number = 0;
    if (targetStatus == 'pending')
      offset = openCompetitions?.length;
    ;
    if (targetStatus == 'active')
      offset = activeCompetitions?.length;
    ;
    if (targetStatus == 'finished')
      offset = finishedCompetitions?.length;
    ;

    (offset ??= 0)

    const response = await get
    (
      `/api/data/lobby/highlights
        ?targetStatus=${targetStatus}
        &offset=${offset}
        &limit=4
        &hasura=true`,
      null,
      true,
      false,
    ) as B_COMP_HIGH_D_RES;

    const newMap = new Map(response?.data);

    WIDGET_DATA = new Map([...WIDGET_DATA, ...newMap]);

    getParticipantData();
    splitCompetitionsByStatus();

    return;
  }

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * 📌 Fetch / update participants data for competitions (fixtures) data.
   *
   * @returns
   * An asynchronous void.
   */
  async function getParticipantData
  (
  ): Promise < void >
  {
    // ### IMPORTANT
    if (!browser) return;

    const newUids: string[] = [];

    // ### NOTE:
    // ### aggregate all 'unique' participants

    for (const [_, value] of WIDGET_DATA)
    {

      const participantUid: string[] = new Competition().extractParticipantUids
      (
        value?.competition
      );

      for (const uid of participantUid ?? [])
      {
        // ### CHECK
        // ### for missing 'uid' from participant `map`.
        const if_M_0: boolean =
          participantsMap?.has(uid)
        ;
        if (if_M_0) continue;
        newUids.push(uid);
      }

    }

    // ### CHECK
    // ### for wether necessary to make new request for participant data.
    const if_M_0: boolean =
      newUids?.length == 0
    ;
    if (if_M_0) return;

    const
      /**
       * @description
       * 📝 `map` for Fixtures
       */
      dataRes1: IBetarenaUser[]
        = (
          await new Betarena_User_Class().obtainPublicInformationTargetUsers
          (
            {
              query: {},
              body:
              {
                user_uids: newUids
              }
            }
          )
        ).success.data,
      /**
       * @description
       * 📝 Map of author data.
       */
      userMap
        = new Parser().toMapById
        <
          IBetarenaUser,
          string
        >
        (
          dataRes1 ?? [],
          'uid'
        )
    ;

    // ### IMPORTANT
    participantsMap = new Map([...participantsMap, ...userMap]);

    return;
  }

  /**
   * @summary
   * 🔹 HELPER | IMPORTANT
   *
   * @description
   * 📌 Injects / Hydrates available competitions (fixtures) data with 'LIVE' (fresh) livescores data.
   *
   * (⚡️) handles cases for 'no longer LIVE' orphan data.
   *
   * @returns
   * An asynchronous void.
   */
  async function injectLivescoresData
  (
  ): Promise < void >
  {
    if (!browser) return;

    const liveFixturesMap: Map < number, FIRE_LNNS > = $sessionStore?.livescore_now_scoreboard;

    let fixtureOrphanId: number[] = [];

    // ### NOTE:
    // ### loop over each available competition.
    for (const [, value] of WIDGET_DATA)
    {
      const competitionFixtureId: number = value?.competition?.fixture_id;

      // ### CHECK
      // ### for 'orphan' (no longer live) fixture data, but present in local live-map instance.
      // ### NOTE:
      // ### cause for (exit).
      const if_M_0: boolean =
        liveCompetitions?.has(competitionFixtureId)
        && !liveFixturesMap.has(competitionFixtureId)
      ;
      if (if_M_0)
      {
        fixtureOrphanId.push(competitionFixtureId);
        continue;
      }

      // ### CHECK
      // ### for valid competitions map data.
      const if_M_1: boolean =
        !liveFixturesMap?.has(competitionFixtureId)
      ;
      if (if_M_1) continue;

      liveCompetitions.add(competitionFixtureId);

      value.fixture_detailed.teams =
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
    }

    // ### CHECK
    // ### for 'orphan' (no longer live) fixture data, but present in local live-map instance.
    // ### NOTE:
    // ### cause for (exit).
    const if_M_2: boolean =
      fixtureOrphanId?.length > 0
    ;
    if (if_M_2)
    {

      const data_0 = await get
      (
        `/api/data/home/livescores-v2?fixtureIds=${fixtureOrphanId?.toString()}`,
        null,
        true,
        true
      ) as unknown;

      const _fixtureMap = new Map
      (
        Object.entries(data_0)
      ) as unknown as Map < string, LS2_C_Fixture >;

      for (const [, value] of WIDGET_DATA)
      {
        const competitionFixtureId: number = value?.competition?.fixture_id;

        const newOrphanData: LS2_C_Fixture = _fixtureMap.get(competitionFixtureId?.toString())

        value.fixture_detailed.teams =
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

        liveCompetitions.delete(competitionFixtureId);
      }

      // ### IMPORTANT
      WIDGET_DATA = WIDGET_DATA;

      return;
    }

    return;
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

  getParticipantData();
  splitCompetitionsByStatus();

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {
      if (useDynamicImport)
      {
        HighlightsGridRowAsDynamic = (await import('./Highlights-Grid-Row.svelte')).default;
      }
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

{#if isNoCompetitions}

  <HighlightsNoCompetitions />

{:else}

  <!--
  OPEN COMPETITIONS
  -->
  {#if openCompetitions?.length > 0}
    <div
      class=
      "
      row-space-out
      "
    >

      <h2
        class=
        "
        color-white
        s-24
        w-600
        inter-font
        "
      >
        {B_SAP_CP_T?.general?.data?.open ?? 'Open'}
      </h2>

      <!--
      HOW TO PLAY
      -->
      {#if $sessionStore?.showUserguide1Conf}

        <div
          class=
          "
          row-space-start
          width-auto
          "
          on:click={() => {dispatch("showModal"); $sessionStore.showUserguide1 = true}}
        >

          <p
            class=
            "
            s-14
            w-500
            underline
            m-r-6
            hover-color-primary
            color-black-2
            cursor-pointer
            "
          >
            {B_SAP_CP_T?.general?.data?.title_userguide ?? 'How to play'}
          </p>

          <img
            id=''
            src={icon_question_mark}
            alt='question-mark'
            title='How to play ?'
            loading='lazy'
          />

        </div>

      {/if}

    </div>
  {/if}

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridRowAsDynamic}
    competitionType={'pending'}
    competitionList={openCompetitions}
    {participantsMap}
    {LIMITS}
    on:load-more={(event) => getMoreTargetStatusCompetitions('pending')}
  />
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

  <!--
  ACTIVE COMPETITIONS
  -->
  {#if activeCompetitions?.length > 0}
    <h2
      class=
      "
      color-black-2
      s-24
      w-600
      inter-font
      "
    >
      {B_SAP_CP_T?.general?.data?.active ?? 'Active'}
    </h2>
  {/if}

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridRowAsDynamic}
    competitionType={'active'}
    competitionList={activeCompetitions}
    {participantsMap}
    {LIMITS}
    on:load-more={(event) => getMoreTargetStatusCompetitions('active')}
  />
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

  <!--
  FINISHED COMPETITIONS
  -->
  {#if finishedCompetitions?.length > 0}
    <h2
      class=
      "
      color-black-2
      s-24
      w-600
      inter-font
      "
    >
      {B_SAP_CP_T?.general?.data?.finished ?? 'Finished'}
    </h2>
  {/if}

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridRowAsDynamic}
    competitionType={'finished'}
    competitionList={finishedCompetitions}
    {participantsMap}
    {LIMITS}
    on:load-more={(event) => getMoreTargetStatusCompetitions('finished')}
  />
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

{/if}