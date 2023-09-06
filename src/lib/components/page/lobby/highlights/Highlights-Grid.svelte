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
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import { dlog } from '$lib/utils/debug.js';
	import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';

  import type { Betarena_User } from '$lib/types/types.scores.js';
  import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
  import type { B_COMP_HIGH_D } from '@betarena/scores-lib/types/types.competition.highlights.js';
  import HighlightsNoCompetitions from './Highlights-No-Competitions.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    WIDGET_DATA: Map < number, B_COMP_HIGH_D >
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
    /** @description competitions (lobby) highlights (widget) - no competitions available */
    isNoCompetitions: boolean = false
  ;

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
   * TODO: DOC:
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

    openCompetitions = openCompetitions;
    activeCompetitions = activeCompetitions;
    finishedCompetitions = finishedCompetitions;
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

    for (const [key, value] of WIDGET_DATA)
    {
      // ### CHECK
      // ### for valid competitions map data.
      const if_M_0: boolean =
        !competitionMap?.has(key)
      ;
      if (if_M_0) continue;

      value.competition = competitionMap?.get(key);

      const participantUid: string[] = new Competition().extractParticipantUids
      (
        value.competition
      );

      // ### NOTE:
      // ### obtain top 3 participants.
      const slicedArray: string[] = participantUid.slice(0, 3);

      // ### [🐞]
      // slicedArray.push('1aoarz3Gs3V63hc0rte007ZNRki1', '0x1510ea733e1e81f9bcfcc4eabb5a2226d1a9f9ea18da9aea119ba28b8ed6be81')

      const participantPublicData = await new Betarena_User_Class().obtainPublicInformationTargetUsers
      (
        slicedArray
      ) as (Betarena_User | undefined)[];

      value.first_3_participants = participantPublicData
      ?.map
      (
        x =>
        x?.profile_photo
      );

      // ### IMPORTANT
      // ### inform of update in data.
      // B_COMP_HIGH_D = B_COMP_HIGH_D;

    }

    splitCompetitionsByStatus();

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

    for (const [, value] of WIDGET_DATA)
    {
      const competitionFixtureId: number = value?.competition?.fixture_id;

      // ### CHECK
      // ### for valid competitions map data.
      const if_M_0: boolean =
        !liveFixturesMap?.has(competitionFixtureId)
      ;
      if (if_M_0) continue;

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
  <h2>Open</h2>

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridRowAsDynamic}
    competitionList={openCompetitions}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

  <!--
  ACTIVE COMPETITIONS
  -->
  <h2>Active</h2>

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridRowAsDynamic}
    competitionList={activeCompetitions}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

  <!--
  FINISHED COMPETITIONS
  -->
  <h2>Finished</h2>

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridRowAsDynamic}
    competitionList={finishedCompetitions}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

{/if}

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

</style>
