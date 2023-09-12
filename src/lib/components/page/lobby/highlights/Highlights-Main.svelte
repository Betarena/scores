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

	import sessionStore from "$lib/store/session.js";
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug.js';
	import { iso2CountryLogo, toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';
	import { translationObject } from '$lib/utils/translation.js';
	import { Competition } from '@betarena/scores-lib/dist/classes/class.competition.js';

  import icon_win from './assets/icon-green-thumbs-up.svg';
  import icon_draw from './assets/icon-grey-draw.svg';
  import icon_profile_avatar from './assets/icon-profile-avatar.svg';
  import icon_loose from './assets/icon-red-thumbs-down.svg';

	import CompCountdownStatus from '$lib/components/shared/COMP-Countdown-+-Status.svelte';
	import CompDetails from '$lib/components/shared/COMP-Details.svelte';
	import CompTeams from '$lib/components/shared/COMP-Teams.svelte';

	import type { Betarena_User } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_COMP_HIGH_D, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	export let
    /** @description TODO: DOC: */
    B_COMP_HIGH_D: B_COMP_HIGH_D,
    /** @description competition (main) - participants detailed data `Map` */
    participantsMap: Map < string, Betarena_User >
  ;

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 912,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'competition⮕w⮕highlights'
  ;

  let
    /** @description TODO: DOC: */
    isViewMobile: boolean = true,
    /** @description TODO: DOC: */
    isViewTablet: boolean = true,
    /** @description competition highlight (widget) - translations */
    WIDGET_T_DATA: B_COMP_HIGH_T = $page.data?.B_COMP_HIGH_T,
    /** @description global | page (data) - team translations */
    B_SAP_D3_TEAM_M: B_SAP_D3,
    /** @description global | page (data) - countries (all) translations */
    B_SAP_D3_COUNTRIES_M_MAP: any[][],
    /** @description competition highlight (widget) - country translations map */
    countryMap: Map < string, { [key: string]: string } >,
    /** @description competition highlight (widget) - target widget prediction type icon */
    icon_prediction: string,
    /** @description competition highlight (widget) - target widget prediction type */
    prediction_type: 'win' | 'loose' | 'draw',
    /** @description TODO: DOC: */
    prediction_side: 'home' | 'away'
  ;

  $: WIDGET_T_DATA = $page.data?.B_COMP_HIGH_T;
	$: B_SAP_D3_TEAM_M = $page.data?.B_SAP_D3_TEAM_M;
	$: B_SAP_D3_COUNTRIES_M_MAP = $page.data?.B_SAP_D3_COUNTRIES_M_MAP;
  // @ts-ignore
  $: countryMap = new Map(B_SAP_D3_COUNTRIES_M_MAP);

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
  function identifyTop3Participants
  (
  ): void
  {
    const participantUid: string[] = new Competition().extractParticipantUids
    (
      B_COMP_HIGH_D?.competition
    );

    // ### NOTE:
    // ### obtain top 3 participants.
    const slicedArray: string[] = participantUid.slice(0, 3);

    B_COMP_HIGH_D.first_3_participants = slicedArray
    ?.map
    (
      x =>
      participantsMap?.get(x)?.profile_photo
    );

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

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * Listens to changes in target data competition.
   *
   * WARNING:
   * triggered by changes in:
   * - `[..]?.competition` - **kicker**
   * - `participantsMap` - **kicker**
   */
   $: if_R_2 =
    browser
  ;
  $: if (if_R_2 && B_COMP_HIGH_D?.competition && participantsMap)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ debugTagOrVarName ${if_R_2}`,
      true
    );

    identifyTop3Participants();
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
    async (
    ): Promise < void > =>
    {
      resizeAction();
      addEventListeners();
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

<!-- [🐞] -->
<!-- {B_COMP_HIGH_D?.competition?.id} -->

<div
  id="{CNAME}⮕main"
  class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
>

  <!--
  TOP COMPETITION ROW
  -->
  <a
    href="/{B_COMP_HIGH_D?.competition?.urls?.[$sessionStore?.serverLang]}">
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
            capitalize
            "
          >
            {B_SAP_D3_TEAM_M?.[$sessionStore?.serverLang] ?? translationObject?.team}
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
            google-aspect-ratio
            "
          />

          <p
            class=
            "
            s-16
            w-500
            color-black-2
            team-name
            no-wrap
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
          w-500
          "
        >
          {WIDGET_T_DATA?.term_is_going_to_a ?? 'is going to'}
        </p>

      </div>

      <!--
      2nd COLUMN - COMPETITION PREDICTION INFO
      -->
      <div
        class=
        "
        text-right
        "
      >

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
            w-500
            dark-white-v3
            "
            class:color-success={prediction_type == 'win'}
            class:color-red-bright={prediction_type == 'loose'}
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
          s-12
          color-black-2
          no-wrap
          "
        >
          {#if B_COMP_HIGH_D?.competition?.data?.prediction == '1'}
            {toDecimalFix(B_COMP_HIGH_D?.fixture?.probabilities?.home, 0) ?? 0}%
          {:else if B_COMP_HIGH_D?.competition?.data?.prediction == '2'}
            {toDecimalFix(B_COMP_HIGH_D?.fixture?.probabilities?.away, 0) ?? 0}%
          {:else}
            {toDecimalFix(B_COMP_HIGH_D?.fixture?.probabilities?.draw, 0) ?? 0}%
          {/if}
          {WIDGET_T_DATA?.title_prob ?? 'probability'}
        </p>

      </div>

    </div>
  </a>

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
        google-aspect-ratio
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
          color-black-2
          m-b-3
          league-name
          no-wrap
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
            color-black-2
            s-10
            "
          >
            {countryMap?.get(B_COMP_HIGH_D?.league?.country_id_j?.toString())?.translations?.[$sessionStore?.serverLang] ?? ''}
          </p>

        </div>

      </div>

    </div>

    <!--
    FIXTURE TEAMS
    -->
    <div
      class=
      "
      m-b-16
      "
    >

      <CompTeams
        B_COMP_HIGH_D={B_COMP_HIGH_D}
        {prediction_side}
        {prediction_type}
        fixtureUrl={B_COMP_HIGH_D?.fixture?.urls?.[$sessionStore?.serverLang]}
      />

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
      >

        <CompCountdownStatus
          {isViewMobile}
          {isViewTablet}
          forceView={true}
          B_COMP_HIGH_D={B_COMP_HIGH_D}
          WIDGET_T_DATA={WIDGET_T_DATA}
          designView={'1'}
        />

      </div>

    {/if}

    <!--
    COMPETITION DETAILS
    -->
    <div
      id="{CNAME}⮕grid-details"
    >

      <CompDetails
        B_COMP_HIGH_D={B_COMP_HIGH_D}
        WIDGET_T_DATA={WIDGET_T_DATA}
        isViewMobile={isViewMobile}
        isViewTablet={isViewTablet}
        forceView={true}
      />

    </div>

  </div>

  <!--
  COMPETITION BOTTOM ROW
  -->
  {#if !['active','finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}

    <div
      id="{CNAME}⮕bottom-row"
      class=
      "
      row-space-out
      "
    >

      <!--
      PARTICIPANTS PREVIEW
      -->
      <div
        class=
        "
        width-auto
        row-space-start
        "
      >

        {#if
          (
            B_COMP_HIGH_D?.competition?.data?.participants?.yes?.length
          + B_COMP_HIGH_D?.competition?.data?.participants?.no?.length
          ) > 0
        }

          <div
            class=
            "
            m-r-12
            row-space-start
            participant-list
            "
          >

            {#each B_COMP_HIGH_D?.first_3_participants ?? [] as item}

              <img
                id=''
                class=
                "
                participant-img
                "
                src={item ?? icon_profile_avatar}
                alt='participant_1'
                title='Partitipant_1'
                loading='lazy'
                width=32
                height=32
              />

            {/each}

          </div>

        {/if}

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
          <br/>
          {WIDGET_T_DATA?.title_participants ?? 'participants'}
        </p>

      </div>

      <!--
      JOIN COMPETITION
      -->
      <a
        href="/{B_COMP_HIGH_D?.competition?.urls?.[$sessionStore?.serverLang]}">
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

  {/if}

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
		background-color: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
    overflow: hidden;
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

  p.team-name
  {
    /* 🎨 style */
    max-width: 100px;
		overflow: hidden;
    text-overflow: ellipsis;
  }

  p.league-name
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

  /*
  NOTE:
  TEAMS CONTENT MANAGED BY OFFSPRING WIDGET
  */

  div#competition⮕w⮕highlights⮕bottom-row
  {
    /* 🎨 style */
    min-height: 72px;
		padding: 14px 24px;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  }

  div#competition⮕w⮕highlights⮕bottom-row div.participant-list img.participant-img
  {
    /* 🎨 style */
    margin-right: -15px;
    border-radius: 32px;
    border: 2px solid var(--whitev2);
  }
  div#competition⮕w⮕highlights⮕bottom-row div.participant-list img.participant-img:last-child
  {
    /* 🎨 style */
    margin-right: 0;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	@media only screen
  and (min-width: 767px)
  {
	}

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#competition⮕w⮕highlights⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade) !important;
  }

  .dark-background-1 div#competition⮕w⮕highlights⮕top-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1) !important;
  }

  .dark-background-1 div#competition⮕w⮕highlights⮕bottom-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1) !important;
  }

  .dark-background-1 div#competition⮕w⮕highlights⮕bottom-row div.participant-list img.participant-img
  {
    /* 🎨 style */
    border: 2px solid var(--dark-theme-1);
  }

</style>
