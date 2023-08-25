<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### NOTE:
  // ### Please add inside 'this' region the 'imports' that are required
  // ### by 'this' .svelte file is ran.
  // ### IMPORTANT
  // ### Please, structure the imports as follows:
  // ### 1. svelte/sveltekit imports
  // ### 2. project-internal files and logic
  // ### 3. component import(s)
  // ### 4. assets import(s)
  // ### 5. type(s) imports(s)

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import { dlog } from '$lib/utils/debug.js';
	import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';

  import type { Betarena_User } from '$lib/types/types.scores.js';
  import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { B_COMP_HIGH_D } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### NOTE:
  // ### Please add inside 'this' region the 'variables' that are 'to be'
  // ### and 'expected' to be used by 'this' .svelte file is ran.

  export let
    WIDGET_DATA: Map < number, B_COMP_HIGH_D >
  ;

  const
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competition⮕w⮕highlights-grid'
  ;

  let
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true,
    /** Dynamic import variable for svelte component */
    HighlightsMainDynamic: any,
    /** @description TODO: DOC: */
    activeCompetitions: B_COMP_HIGH_D[],
    /** @description TODO: DOC: */
    openCompetitions: B_COMP_HIGH_D[],
    /** @description TODO: DOC: */
    finishedCompetitions: B_COMP_HIGH_D[],
    /** @description TODO: DOC: */
    openCurrentPos: number = 0
  ;

  // ### IMPORTANT
  // ### Reactivity deep-value listen(s).
  $: competitionMapDataChng = JSON.stringify([...$sessionStore?.competitions_map?.entries() ?? []]);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * TODO: DOC:
   */
  function toggleCarousel
  (
    view: 'open' | 'active' | 'finished',
    change: number
  ): void
  {
    if (view == 'open')
    {
      if ((openCurrentPos + change < 0) || (openCurrentPos + change + 4 > openCompetitions?.length)) return;
      openCurrentPos = openCurrentPos + change;
    }
  }

  /**
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

    for (const [key, value] of WIDGET_DATA ?? [])
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
      // ### for competition to be placed in 'group' of 'type: Finished'.
      const if_M_2: boolean =
        value?.competition?.data?.status == 'finished'
      ;
      if (if_M_2)
        finishedCompetitions.push(value)
      ;

    }

    openCompetitions = openCompetitions;
    activeCompetitions = activeCompetitions;
    finishedCompetitions = finishedCompetitions;

  }

  /**
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
    // ### update 'this' competition data with new.

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

      slicedArray.push('1aoarz3Gs3V63hc0rte007ZNRki1', '0x1510ea733e1e81f9bcfcc4eabb5a2226d1a9f9ea18da9aea119ba28b8ed6be81')

      const participantPublicData = await new Betarena_User_Class().obtainPublicInformationTargetUsers
      (
        slicedArray
      ) as (Betarena_User | undefined)[];

      // random3ParticipantAvatars = participantPublicData
      // ?.map
      // (
      //   x =>
      //   x?.profile_photo
      // );

      // ### IMPORTANT
      // ### inform of update in data.
      // B_COMP_HIGH_D = B_COMP_HIGH_D;

    }

    splitCompetitionsByStatus();

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### NOTE:
  // ### Please add inside 'this' region the 'logic' that should run
  // ### immediately and reactively, as soon as 'this' .svelte file is ran.

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

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### NOTE:
  // ### Please add inside 'this' region the 'logic' that should run
  // ### immediately and as part of the 'lifecycle' of svelteJs,
  // ### as soon as 'this' .svelte file is ran.

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
        HighlightsMainDynamic = (await import('./Highlights-Main.svelte')).default;
      }

      // scrollDemo.addEventListener("scroll", event => {
      //       output.innerHTML = `scrollTop: ${scrollDemo.scrollTop} <br>
      //                           scrollLeft: ${scrollDemo.scrollLeft} `;
      //   }, { passive: true });

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

<!--
OPEN COMPETITIONS
-->
<h2>Open</h2>

<div
  id="{CNAME}⮕open-competitions"
>

  <div
    id="previous-open"
    class=
    "
    carousel-btn
    "
    on:click={() => toggleCarousel('open', 1)}
  />

  <div
    id="{CNAME}⮕open-competitions-inner"
  >

    {#each openCompetitions?.slice(openCurrentPos, openCurrentPos + 4) ?? [] as item}

      <!--
      ### NOTE:
      ### Dynamic Svelte Component Import
      ### WARNING:
      ### Disable, if Standard Import is Enabled.
      -->
      <svelte:component
        this={HighlightsMainDynamic}
        B_COMP_HIGH_D={item}
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

    {/each}

  </div>

  <div
    id="next-open"
    on:click={() => toggleCarousel('open', -1)}
    class=
    "
    carousel-btn
    "
  />

</div>

<!--
📱 MOBILE + 💻 TABLET
CAROUSEL DOTS
-->
<div>
  <span class="dot" />
  <span class="dot" />
  <span class="dot" />
  <span class="dot" />
  <span class="dot" />
</div>

<!--
ACTIVE COMPETITIONS
-->
<h2>Active</h2>

<div
  id="{CNAME}⮕active-competitions"
>

  {#each activeCompetitions ?? [] as item}

    <!--
    ### NOTE:
    ### Dynamic Svelte Component Import
    ### WARNING:
    ### Disable, if Standard Import is Enabled.
    -->
    <svelte:component
      this={HighlightsMainDynamic}
      B_COMP_HIGH_D={item}
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

  {/each}

</div>

<!--
FINISHED COMPETITIONS
-->
<h2>Finished</h2>

<div
  id="{CNAME}⮕finished-competitions"
>

  {#each finishedCompetitions ?? [] as item}

    <!--
    ### NOTE:
    ### Dynamic Svelte Component Import
    ### WARNING:
    ### Disable, if Standard Import is Enabled.
    -->
    <svelte:component
      this={HighlightsMainDynamic}
      B_COMP_HIGH_D={item}
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

  {/each}

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

  div#competition⮕w⮕highlights-grid⮕open-competitions,
  div#competition⮕w⮕highlights-grid⮕active-competitions,
  div#competition⮕w⮕highlights-grid⮕finished-competitions
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    display: grid;
    height: 550px;
    gap: 20px;
    grid-template-columns: auto;
    overflow-y: hidden;
    overflow-x: scroll;
  }

  div#competition⮕w⮕highlights-grid⮕open-competitions-inner
  {
    /* 📌 position */
    position: absolute;
    /* 🎨 style */
    width: 100%;
    display: grid;
    gap: 20px;
    grid-auto-flow: column dense;
    grid-template-rows: 1fr;
  }

  div.carousel-btn
  {
    /* 📌 position */
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    /* 🎨 style */
    width: 32px;
    height: 32px;
    background-color: #313131;
    border-radius: 50%;
  }
  div#previous-open.carousel-btn
  {
    /* 📌 position */
    right: 0;
  }
  div#next-open.carousel-btn
  {
    /* 📌 position */
    left: 0;
  }

  .dot
  {
    /* 🎨 style */
    height: 6px;
    width: 6px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
  }

  @media only screen
  and (min-width: 1160px)
  {

    div#competition⮕w⮕highlights-grid⮕open-competitions,
    div#competition⮕w⮕highlights-grid⮕active-competitions,
		div#competition⮕w⮕highlights-grid⮕finished-competitions
    {
			gap: 20px;
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}

	}

  /*
  =============
  🌒 DARK-THEME
  =============
  */

</style>
