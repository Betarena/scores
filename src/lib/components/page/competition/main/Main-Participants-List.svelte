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
	import { onDestroy, onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import { userUpdateBalance } from '$lib/firebase/common.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug.js';
  import { checkNull } from '$lib/utils/miscellenous.js';
	import { translationObject } from '$lib/utils/translation.js';
  import { toDecimalFix } from '$lib/utils/string.js';

	import MainModalMultiple from './Main-Modal-Multiple.svelte';

  import icon_win from './assets/icon-green-thumbs-up.svg';
  import icon_loose from './assets/icon-grey-thumbs-down.svg';
  import icon_loose_active from './assets/icon-orange-thumbs-down.svg';
  import icon_win_active from './assets/icon-orange-thumbs-up.svg';
  import icon_profile_avatar from './assets/icon-profile-avatar.svg';
  import icon_trophy from './assets/icon-trophy.svg';

	import type { BetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_C_COMP_DATA_Prediction_Group, B_C_COMP_DATA_Status } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_COMP_MAIN_T } from '@betarena/scores-lib/types/types.competition.main.js';
  import { modalStore } from '$lib/store/modal.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    isViewMobile: boolean,
    /** @description TODO: DOC: */
    isViewTablet: boolean,
    /** @description competition (main) - participants target view type */
    viewType: 'yes' | 'no',
    /** @description competition (main) - participants target view list */
    participantList: string[],
    /** @description competition (main) - participants detailed data `Map` */
    participantsMap: Map < string, BetarenaUser >,
    /** @description competition (main) - competition total prize amount */
    totalPrize: number,
    /** @description competition (main) - competition entry fee amount */
    entryFee: number,
    /** @description competition (main) - competition winner group */
    winnerGroup: B_C_COMP_DATA_Prediction_Group,
    /** @description competition (main) - competition geo-location restriction */
    geoLocationRestrictions: string[],
    /** @description competition (main) - competition `native` status */
    competitionStatus: B_C_COMP_DATA_Status
  ;

  const
    /** @description `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'competition⮕w⮕participant-list'
  ;

  let
    /** @description TODO: DOC: */
    WIDGET_T_DATA: B_COMP_MAIN_T,
    /** @description competition (main) - show / hide main modal information */
    showModal: boolean = false,
    /** @description competition (main) - view type */
    modalViewType: 'confirm' | 'insufficient' | 'geo-restriction' | 'not-authenticated' = 'confirm',
    /** @description competition (main) - disabled buttons */
    disabledJoinBtn: boolean = true
  ;

  $: WIDGET_T_DATA = $page.data?.B_COMP_MAIN_T;

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

  /**
   * @description
   * TODO: DOC:
   */
  async function joinCompetition
  (
  ): Promise < void >
  {
    if (!browser) return;

    showModal = false

    // ### [🐞]
    // alert('Joining Competition');


    await get
    (
      `/api/data/competition/main?competition_id=${$page.data?.COMPETITION_ID}&participantUid=${$userBetarenaSettings?.user?.firebase_user_data?.uid}&predictionChoice=${viewType}`
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

  /**
   * @description
   * TODO: DOC:
   */
  function adjustParticipantListUser
  (
  ): void
  {
    participantList = participantList
    ?.filter
    (
      item =>
      {
        return item != $userBetarenaSettings?.user?.firebase_user_data?.uid
      }
    );

    participantList =
    [
      $userBetarenaSettings?.user?.firebase_user_data?.uid,
      ...participantList
    ];
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  // ### NOTE:
  // ### update / mutate `modalViewType` as necessary.
  $: if (($userBetarenaSettings?.user?.scores_user_data?.main_balance ?? 0) < entryFee)
    modalViewType = 'insufficient';
  ;
  $: if (geoLocationRestrictions?.includes($userBetarenaSettings?.country_bookmaker))
    modalViewType = 'geo-restriction';
  ;
  $: if ($userBetarenaSettings?.user == undefined)
    modalViewType = 'not-authenticated';
  ;

  // ### TODO: DOC:
  $: if_R_0 =
    ($userBetarenaSettings?.user?.scores_user_data?.main_balance ?? 0) >= entryFee
    && !geoLocationRestrictions?.includes($userBetarenaSettings?.country_bookmaker)
    && $userBetarenaSettings?.user != undefined
  ;
  $: if (if_R_0)
    modalViewType = 'confirm';
  ;

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Listens to change in participants and user joined. Acts accordingly.
   *
   * WARNING:
   * triggered by changes in:
   * - `participantList` - **kicker**
   * - `isJoinedThis` - **kicker**
   */
  $: if (participantList && isJoinedThis)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ (participantList && isJoinedThis)`,
      true
    );

    adjustParticipantListUser();
  }

  function showModalHandler() {
    $modalStore.component = MainModalMultiple;
    $modalStore.props = {
      isViewMobile,
      isViewTablet,
      viewType: modalViewType,
      balanceDeductAmount: entryFee,
      on: {
        closeModal: () => $modalStore.show = false,
        confirmEntry: () => joinCompetition(),
      }
    };
    $modalStore.show = true;
    $modalStore.modal = false;
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    () =>
    {

      // ### NOTE:
      // ### hacky solution (not ideal) for disabling action 'join' for X milliseconds.
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

  onDestroy
  (
    () =>
    {
      // do something
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
PARTICIPANTS VOTE LIST
-->
<div
  id="{CNAME}⮕main"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  MORE INFO & VOTE ACTION
  -->
  <div
    id="{CNAME}⮕top-row"
  >

    <!--
    PARTICIPANTS QUICK DATA
    -->
    <div
      class=
      "
      width-auto
      row-space-start
      participants-preview
      "
    >

      {#if participantList?.length > 0}

        <div
          class=
          "
          m-r-12
          width-auto
          row-space-start
          participant-list
          "
        >

          {#each participantList?.slice(0, (isViewTablet ? 3 : 5)) ?? [] as uid}

            <img
              id=''
              class=
              "
              participant-main-img
              "
              src={participantsMap?.get(uid)?.profile_photo ?? icon_profile_avatar}
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
        {participantList?.length ?? 0}
        <br/>
        {WIDGET_T_DATA?.title_participants ?? translationObject?.participants}
      </p>

    </div>

    <!--
    TOTAL PRIZE FOR 'THIS' VOTE
    -->
    <div
      class=
      "
      m-r-40
      total-prize
      "
      class:column-space-start={!isViewTablet}
      class:row-space-out={isViewTablet}
    >

      <p
        class=
        "
        s-12
        color-black-2
        grey-v1
        "
      >
        {WIDGET_T_DATA?.title_pool_prize ?? translationObject?.pool_prize}
      </p>

      <p
        class=
        "
        s-16
        color-black-2
        w-500
        m-t-5
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

    <!--
    PARTICIPANT ACTION BUTTON
    -->
    <div
      class=
      "
      width-auto
      participant-action
      "
    >

      <!--
      JOIN COMPETITION
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
          on:click={showModalHandler}
          class:disabled={isJoinedNotThis || competitionStatus != 'pending' || disabledJoinBtn}
          class:color-grey={isJoinedNotThis || competitionStatus != 'pending' || disabledJoinBtn}
          disabled={isJoinedNotThis || competitionStatus != 'pending' || disabledJoinBtn}
        >
          {viewType == 'yes' ? (WIDGET_T_DATA?.title_join_yes ?? 'Yes') : (WIDGET_T_DATA?.title_join_no ?? 'No')}
        </button>

      <!--
      STATUS (MANY) PILL
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
            isJoinedThis && !['canceled', 'finished'].includes(competitionStatus)
            || competitionStatus == 'finished' && winnerGroup == viewType
          }
          class:disabled=
          {
            competitionStatus == 'canceled'
            || competitionStatus == 'finished' && winnerGroup != viewType
          }
        >

          <!--
          WON TROPHY ICON
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
          STATUS TEXT
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

  </div>

  <!--
  LIST PARTICIPANTS
  -->
  <div
    id="{CNAME}⮕list"
  >

    <div
      id="{CNAME}⮕list-head"
      class=
      "
      row-space-out
      "
    >

      <!--
      COLUMN 1 - NAME
      -->
      <p
        class=
        "
        s-12
        w-600
        color-black-2
        opacity-0-4
        uppercase
        "
      >
        {WIDGET_T_DATA?.title_name ?? 'NAME'}
      </p>

      <!--
      COLUMN 2 - VOTE
      -->
      <p
        class=
        "
        s-12
        w-600
        color-black-2
        opacity-0-4
        uppercase
        "
      >
        {WIDGET_T_DATA?.title_vote ?? 'VOTE'}
      </p>

    </div>

    {#each participantList ?? [] as uid}

      <div
        class=
        "
        row-space-start
        participant-row
        "
        class:target-user={uid == $userBetarenaSettings?.user?.firebase_user_data?.uid}
      >

        <!--
        1st COLUMN
        -->
        <div
          class=
          "
          row-space-start
          "
        >

          <!--
          USER PROFILE IMAGE
          -->
          <img
            id=''
            class=
            "
            m-r-12
            participant-img
            "
            src={participantsMap?.get(uid)?.profile_photo ?? icon_profile_avatar}
            alt='participant-image'
            title='Participant Icon'
            loading='lazy'
            width=24
            height=24
          />

          <!--
          USER PROFILE NAME
          -->
          <p
            class=
            "
            s-16
            color-black-2
            "
            class:color-primary={uid == $userBetarenaSettings?.user?.firebase_user_data?.uid}
          >
            {participantsMap?.get(uid)?.username ?? ''}
          </p>

        </div>

        <!--
        2nd COLUMN
        -->
        <div
          class=
          "
          row-space-end
          "
        >

          <img
            id=''
            src=
            {
              viewType == 'yes'
                ? uid == $userBetarenaSettings?.user?.firebase_user_data?.uid
                  ? icon_win_active
                  : icon_win
                : uid == $userBetarenaSettings?.user?.firebase_user_data?.uid
                  ? icon_loose_active
                  : icon_loose
            }
            alt=''
            title=''
            loading='lazy'
            width=20
            height=20
            class=
            "
            m-r-12
            "
          />

          <p
            class=
            "
            s-16
            "
            class:color-grey={viewType == 'no'}
            class:color-black-2={viewType == 'yes'}
          >
            {viewType == 'yes' ? (WIDGET_T_DATA?.title_votes?.yes ?? 'Yes') : (WIDGET_T_DATA?.title_votes?.no ?? 'No')}
          </p>

        </div>

      </div>

    {:else}

      <!--
      NO PARTICIPANTS
      -->
      <div
        id="{CNAME}⮕no-participant"
      >

        <p
          class=
          "
          s-24
          w-500
          color-black-2
          text-center
          inter-font
          m-b-16
          "
          class:s-20={isViewMobile}
          class:s-24={!isViewMobile}
        >
          {WIDGET_T_DATA?.title_placeholder_1 ?? 'No participants at the moment'}
        </p>

        <!--
        EXTRA INFO
        -->
        <p
          class=
          "
          s-14
          color-black-2
          inter-font
          text-center
          "
        >
          {#if competitionStatus == 'pending'}
            This match has yet not started
          {:else if competitionStatus == 'active'}
            This match is now active
          {:else if competitionStatus == 'canceled'}
            This match was canceled
          {:else if competitionStatus == 'finished'}
            This match has now finished
          {/if}
        </p>

      </div>

    {/each}

  </div>

  <!--
  BOTTOM LIST FADE
  -->
  <div id="{CNAME}⮕bottom-fade" />

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

  div#competition⮕w⮕participant-list⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    width: 100%;
    background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		/* border-radius: 12px; */
    overflow: hidden;
  }

  div#competition⮕w⮕participant-list⮕top-row
  {
    /* 🎨 style */
    background: var(--white);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    min-height: 113px;
    max-height: 113px;
    padding: 14px 24px;
    /* 🛝 layout */
    display: grid;
    gap: 20px 0;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  div#competition⮕w⮕participant-list⮕top-row div.participants-preview
  {
    /* 🎨 style */
    grid-row: 1;
    grid-column: 1;
  }
  div#competition⮕w⮕participant-list⮕top-row div.participants-preview div.participant-list img.participant-main-img
  {
    /* 🎨 style */
    margin-right: -15px;
    border-radius: 32px;
    border: 2px solid var(--whitev2);
  }
  div#competition⮕w⮕participant-list⮕top-row div.participants-preview div.participant-list img.participant-main-img:last-child
  {
    /* 🎨 style */
    margin-right: 0;
  }
  .disabled
  {
    /* 🎨 style */
    background-color: var(--whitev2);
    opacity: 0.5;
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
  div.total-prize
  {
    /* 🎨 style */
    grid-row: 2;
    grid-column: 1 / 3;
  }
  div.participant-action
  {
    /* 🎨 style */
    grid-row: 1;
    grid-column: 2;
    /* 🛝 layout */
    justify-self: right;
  }

  div#competition⮕w⮕participant-list⮕list
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    min-height: 326px;
    max-height: 326px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
	div#competition⮕w⮕participant-list⮕list::-webkit-scrollbar
  {
    /* 🎨 style */
		/* width: 3px; */
	}
	div#competition⮕w⮕participant-list⮕list::-webkit-scrollbar-track
  {
    /* 🎨 style */
		/* background: transparent;
		margin-top: 60px; */
	}
	div#competition⮕w⮕participant-list⮕list::-webkit-scrollbar-thumb
  {
    /* 🎨 style */
		/* background: #292929;
    max-height: 90px; */
	}

  div#competition⮕w⮕participant-list⮕no-participant
  {
    /* 📌 position */
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    /* 🎨 style */
    width: fit-content;
    max-width: 280px;
    height: fit-content;
  }

  div#competition⮕w⮕participant-list⮕list-head
  {
    /* 🎨 style */
    padding: 16px 47px 16px 24px;
  }

  div#competition⮕w⮕participant-list⮕list div.participant-row
  {
    /* 🎨 style */
    padding: 8px 34px 8px 24px;
  }
  div#competition⮕w⮕participant-list⮕list div.participant-row img.participant-img
  {
    /* 🎨 style */
    border-radius: 50%;
  }
  div#competition⮕w⮕participant-list⮕list div.participant-row:nth-child(even)
  {
    /* 🎨 style */
    background-color: var(--whitev2);
  }
  div#competition⮕w⮕participant-list⮕list div.participant-row.target-user
  {
    /* 🎨 style */
    background-color: rgba(245, 98, 15, 0.2);
  }

  div#competition⮕w⮕participant-list⮕bottom-fade
  {
    /* 📌 position */
    position: absolute;
    bottom: 0;
    /* 🎨 style */
    width: 100%;
    height: 64px;
    background: linear-gradient(0, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);
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

    div#competition⮕w⮕participant-list⮕list
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

    div#competition⮕w⮕participant-list⮕top-row
    {
      /* 🎨 style */
      min-height: 88px;
      max-height: 88px;
      padding: 24px 32px;
      /* 🛝 layout */
      gap: unset;
      /* grid-template-columns: 1fr 1fr 1fr 1fr; */
      grid-template-rows: 1fr;
    }
    div#competition⮕w⮕participant-list⮕top-row div.participants-preview
    {
      /* 🎨 style */
      grid-row: 1;
      grid-column: 1;
    }
    div#competition⮕w⮕participant-list⮕top-row div.total-prize
    {
      /* 🎨 style */
      grid-row: 1;
      grid-column: 3;
      /* 🛝 layout */
      align-items: flex-start;
    }
    div#competition⮕w⮕participant-list⮕top-row div.participant-action
    {
      /* 🎨 style */
      grid-row: 1;
      grid-column: 4;
    }

    div#competition⮕w⮕participant-list⮕list-head
    {
      /* 🎨 style */
      padding: 16px 70px 16px 32px;
    }

    div#competition⮕w⮕participant-list⮕list div.participant-row
    {
      /* 🎨 style */
      padding: 8px 42px 8px 32px;
    }

  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#competition⮕w⮕participant-list⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade) !important;
  }

  .dark-background-1 div#competition⮕w⮕participant-list⮕top-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade) !important;
  }
  .dark-background-1 div#competition⮕w⮕participant-list⮕top-row div.participants-preview div.participant-list img.participant-main-img
  {
    /* 🎨 style */
    border: 2px solid var(--dark-theme-1-4-shade);
  }
  .dark-background-1 .disabled
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  .dark-background-1 div#competition⮕w⮕participant-list⮕list div.participant-row:nth-child(even)
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-5-shade-o-0-2) !important;
  }
  .dark-background-1 div#competition⮕w⮕participant-list⮕list div.participant-row.target-user
  {
    /* 🎨 style */
    background-color: rgba(245, 98, 15, 0.2) !important;
  }

  .dark-background-1 div#competition⮕w⮕participant-list⮕bottom-fade
  {
    /* 🎨 style */
    background: linear-gradient(0, #383838 -38.28%, rgba(56, 56, 56, 0.80) -38.26%, rgba(56, 56, 56, 0.00) 175%);
  }

</style>
