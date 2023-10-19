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
	import { userUpdateBalance } from '$lib/firebase/common.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { checkNull, toDecimalFix } from '$lib/utils/platform-functions.js';
	import { translationObject } from '$lib/utils/translation.js';

	import CompModalMultiple from '../../../shared/COMP-Modal-Multiple.svelte';

  import icon_thumbs_down_grey from './assets/icon-thumbs-down-grey.svg';
  import icon_thumbs_down_white from './assets/icon-thumbs-down-white.svg';
  import icon_thumbs_up_grey from './assets/icon-thumbs-up-grey.svg';
  import icon_thumbs_up_white from './assets/icon-thumbs-up-white.svg';
  import icon_trophy from './assets/icon-trophy.svg';

	import type { BetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_C_COMP_DATA_Prediction_Group, B_C_COMP_DATA_Status } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_FIX_COMP_T } from '@betarena/scores-lib/types/types.fixture.competition.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'variables' that are to be  ▓▓
  // ▓▓ and are expected to be used by 'this' .svelte file / component. ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  export let
    /** @description 📱 MOBILE */
    isViewMobile: boolean,
    /** @description 💻 TABLET */
    isViewTablet: boolean,
    /** @description competition target id */
    competitionId: number,
    /** @description competition (main) | participants target view type */
    viewType: 'yes' | 'no',
    /** @description competition (main) | participants target view list */
    participantList: string[],
    /** @description competition (main) | participants detailed data `Map` */
    participantsMap: Map < string, BetarenaUser >,
    /** @description competition (main) | total prize amount */
    totalPrize: number,
    /** @description competition (main) | entry fee amount */
    entryFee: number,
    /** @description competition (main) | winner group */
    winnerGroup: B_C_COMP_DATA_Prediction_Group,
    /** @description competition (main) | imposed geo-location restriction */
    geoLocationRestrictions: string[],
    /** @description competition (main) | `native` status */
    competitionStatus: B_C_COMP_DATA_Status,
    /** @description competition showModal */
    showModal: boolean = false
  ;

  const
    /** @description `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'fixture⮕competition⮕w⮕pool-selection'
  ;

  let
    /** @augments B_FIX_COMP_T */
    WIDGET_T_DATA: B_FIX_COMP_T,
    /** @description competition (main) | disabled buttons */
    disabledJoinBtn: boolean = true
  ;

  $: WIDGET_T_DATA = $page.data?.B_FIX_COMP_T;

  $: isJoinedThis =
    !checkNull($userBetarenaSettings?.user)
    && participantsMap?.has($userBetarenaSettings?.user?.firebase_user_data?.uid)
    && participantList?.includes($userBetarenaSettings?.user?.firebase_user_data?.uid)
  ;
  $: isJoinedNotThis =
    !checkNull($userBetarenaSettings?.user)
    && participantsMap?.has($userBetarenaSettings?.user?.firebase_user_data?.uid)
    && !participantList?.includes($userBetarenaSettings?.user?.firebase_user_data?.uid)
  ;

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
   *  🔹 HELPER
   * @description
   *  📌 Logic for participant joining a competition.
   * @returns { Promise < void > }
   */
  async function joinCompetition
  (
  ): Promise < void >
  {
    if (!browser) return;

    $sessionStore.isShowFixtureCompetitionJoinModal = false;
    showModal = false;

    // ▓▓ [🐞]
    // alert('Joining Competition');

    // ▓▓ CHECK
    // ▓▓ for valid data points
    if (competitionId == null)
      return;
    //

    await get
    (
      `/api/data/competition/main?competition_id=${competitionId}&participantUid=${$userBetarenaSettings?.user?.firebase_user_data?.uid}&predictionChoice=${viewType}`,
      null,
      true,
      false
    );

    let newBalance: number = ($userBetarenaSettings?.user?.scores_user_data?.main_balance - entryFee) ?? 0;
    if (newBalance < 0) newBalance = 0;

    await userUpdateBalance
    (
      $userBetarenaSettings?.user?.firebase_user_data?.uid,
      newBalance
    );

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'logic' that should run     ▓▓
  // ▓▓ immediately and as part of the 'lifecycle' of svelteJs,         ▓▓
  // ▓▓ as soon as 'this' .svelte file is ran.                          ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  onMount
  (
    () =>
    {

      // ▓▓ NOTE:
      // ▓▓ hacky solution (not ideal) for disabling action
      // ▓▓ 'join' for X milliseconds.
      setTimeout
      (
        () =>
        {
          disabledJoinBtn = false;
        }
        ,
        1000
      );
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
▓▓ Cast vote modal
-->
{#if $sessionStore.isShowFixtureCompetitionJoinModal && showModal}
  <CompModalMultiple
    {isViewMobile}
    {isViewTablet}
    balanceDeductAmount={entryFee}
    targetVote={viewType}
    {geoLocationRestrictions}
    on:closeModal={() => { $sessionStore.isShowFixtureCompetitionJoinModal = false; showModal = false; }}
    on:confirmEntry={() => joinCompetition()}
  />
{/if}

<!--
▓▓ Pool Main Component
-->
<div
  id="{CNAME}⮕main"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  ▓▓ Further pool info and vote cast.
  -->
  <div
    id="{CNAME}⮕top-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓▓ Participant join and pool prize data.
    -->
    <div
      class=
      "
      width-auto
      "
    >

      <!--
      ▓▓ Status Button for competition join.
      -->
      {#if
        (!isJoinedThis || isJoinedNotThis)
        && !['canceled', 'finished'].includes(competitionStatus)
      }

        <button
          class=
          "
          s-14
          w-500
          btn-primary-v2
          "
          on:click={() => { $sessionStore.isShowFixtureCompetitionJoinModal = true; showModal = true; }}
          class:disabled={isJoinedNotThis || competitionStatus != 'pending' || disabledJoinBtn}
          class:color-grey={isJoinedNotThis || competitionStatus != 'pending' || disabledJoinBtn}
          disabled={isJoinedNotThis || competitionStatus != 'pending' || disabledJoinBtn}
        >
          <img
            id=''
            src='{viewType == 'yes' ? (!isJoinedNotThis ? icon_thumbs_up_white : icon_thumbs_up_grey) : (!isJoinedNotThis ? icon_thumbs_down_white : icon_thumbs_down_grey)}'
            alt=''
            title=''
            loading='lazy'
            class=
            "
            m-r-8
            "
          />
            {viewType == 'yes' ? (WIDGET_T_DATA?.title_join_yes ?? 'Yes') : (WIDGET_T_DATA?.title_join_no ?? 'No')}
        </button>

      <!--
      ▓▓ Status (many) pill state.
      -->
      {:else}

        <div
          class=
          "
          row-space-center
          status-pill
          "
          class:green=
          {
            (isJoinedThis && !['canceled', 'finished'].includes(competitionStatus))
            || (competitionStatus == 'finished' && winnerGroup == viewType)
          }
          class:disabled=
          {
            competitionStatus == 'canceled'
            || (competitionStatus == 'finished' && winnerGroup != viewType)
          }
        >

          <!--
          ▓▓ Winner group trophy.
          -->
          {#if competitionStatus == 'finished' && winnerGroup == viewType}
            <img
              id=''
              class=
              '
              m-r-8
              '
              src={icon_trophy}
              alt='icon-trophy'
              title='Trophy'
              loading='lazy'
              width=20
              height=20
            />
          {/if}

          <!--
          ▓▓ Target joined vote thumbs.
          -->
          {#if isJoinedThis && !['canceled', 'finished'].includes(competitionStatus)}
            <img
              id=''
              src='{viewType == 'yes' ? icon_thumbs_up_white : icon_thumbs_down_white}'
              alt=''
              title=''
              loading='lazy'
              class=
              "
              m-r-8
              "
            />
          {/if}

          <!--
          ▓▓ Target joined status.
          -->
          <p
            class=
            "
            s-14
            w-500
            color-white
            "
            class:color-grey=
            {
              competitionStatus == 'canceled'
              || competitionStatus == 'finished' && winnerGroup != viewType
            }
            class:uppercase={competitionStatus == 'finished'}
          >
            {#if
              isJoinedThis
              && !['canceled', 'finished'].includes(competitionStatus)
            }
              {WIDGET_T_DATA?.title_joined ?? 'Joined'}
            {:else if competitionStatus == 'canceled'}
              {WIDGET_T_DATA?.title_canceled ?? 'Canceled'}
            {:else if competitionStatus == 'finished'}
              {winnerGroup == viewType ? (WIDGET_T_DATA?.title_won ?? 'WON') : (WIDGET_T_DATA?.title_lost ?? 'LOST')}
            {/if}
          </p>

        </div>

      {/if}

    </div>

    <!--
    ▓▓ Total pool prize.
    -->
    <div
      class=
      "
      width-auto
      total-prize-box
      "
      class:column-space-start={isViewTablet}
      class:row-space-out={!isViewTablet}
      style=
      "
      {isViewTablet ? 'align-items: flex-start;' : ''}
      "
    >

      <p
        class=
        "
        s-12
        no-wrap
        color-grey grey-v1
        "
        class:m-r-12={!isViewTablet}
      >
        {WIDGET_T_DATA?.title_pool_prize ?? translationObject?.pool_prize}
      </p>

      <p
        class=
        "
        s-16
        color-black-2
        w-500
        "
      >
        {toDecimalFix(totalPrize, 2, true)} BTA
        <span
          class=
          "
          color-grey-v2
          grey-v1
          s-14
          "
        >
        (${toDecimalFix(totalPrize, 2, true)})
        </span>
      </p>

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

  div#fixture⮕competition⮕w⮕pool-selection⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    width: 100%;
    background: var(--whitev2);
		border-radius: 8px;
    overflow: hidden;
  }

  div#fixture⮕competition⮕w⮕pool-selection⮕top-row
  {
    /* 🎨 style */
    min-height: 74px;
    max-height: 74px;
    padding: 16px 20px;
  }
  .disabled
  {
    /* 🎨 style */
    background-color: var(--grey-shade);
  }
  div.status-pill
  {
    /* 🎨 style */
    border-radius: 8px;
    height: 44px;
    padding: 10px 20px;
  }
  div.green
  {
    /* 🎨 style */
    background: #4DA025;
  }
  div.total-prize-box
  {
    /* 🎨 style */
    /* min-width: 120px; */
  }

  /*
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓▓ ⚡️ RESPONSIVNESS     ▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  */

  @media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: independent media query widget */
  and (min-width: 658px)
  {

    div#fixture⮕competition⮕w⮕pool-selection⮕list
    {
      /* 🎨 style */
      min-height: 582px;
      max-height: 582px;
    }

  }

  @media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: dictated by parent */
  and (min-width: 780px)
  {
    /* NaN */
  }

  /*
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓▓ 🌒 DARK-THEME       ▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  */

  div#fixture⮕competition⮕w⮕pool-selection⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade) !important;
  }

  .dark-background-1 div#fixture⮕competition⮕w⮕pool-selection⮕top-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1) !important;
  }

  .dark-background-1 .disabled
  {
    /* 🎨 style */
    background-color: rgba(49, 49, 49, 0.5) !important;
  }

</style>
