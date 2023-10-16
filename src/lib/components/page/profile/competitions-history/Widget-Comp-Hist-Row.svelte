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

  import { page } from "$app/stores";

	import sessionStore from "$lib/store/session.js";
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toISOMod } from '$lib/utils/dates.js';
	import { toDecimalFix, tryCatch } from '$lib/utils/platform-functions.js';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';

	import type { B_H_COMP_DATA, B_H_COMP_TRS_P_C_Data, B_H_PROF_TRS_COMP_Data } from "@betarena/scores-lib/types/_HASURA_.js";
	import type { B_SAP_D3 } from "@betarena/scores-lib/types/seo-pages.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description */
    competitionObject: B_H_COMP_DATA,
    /** @description */
    translationObject: B_H_PROF_TRS_COMP_Data,
    /** @description */
    translationObject2: B_H_COMP_TRS_P_C_Data,
    /** @description */
    competitionTitle: string,
    /** @description */
    isViewMobile: boolean = false,
    /** @description */
    isViewTablet: boolean = false
  ;

  let
    /** @description */
    compStatus: 'C' | 'P' | 'F',
    /** @description */
    txStatusTranslation: string,
    /** @description */
    competitionUserForecast: 'yes' | 'no' =
      competitionObject?.data?.participants?.yes?.includes($userBetarenaSettings?.user?.firebase_user_data?.uid)
        ? 'yes'
        : 'no',
    /** @description */
    isCompExtraInfo: boolean,
    /** @description */
    competitionPotentialUserWin: number,
    /** @description */
    txExtraInfoStruct:
    [
      'title',
      'style',
      'entry_fee',
      'total_prize',
      'potential_win',
      'forecast',
      'result',
      'prize_won'
    ] = [
      'title',
      'style',
      'entry_fee',
      'total_prize',
      'potential_win',
      'forecast',
      'result',
      'prize_won'
    ],
    /** @description general page - `football` term(s) data translations */
    B_SAP_D3_SP_M: B_SAP_D3
  ;

	$: B_SAP_D3_SP_M = $page.data?.B_SAP_D3_SP_M;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   * TODO: DOC:
   */
  $: if (competitionObject?.data?.status)
  {
    // ### NOTE:
    // ### identify competition status
		if (competitionObject?.data?.status?.toLowerCase() == 'finished') compStatus = 'C';
		if (['active', 'pending'].includes(competitionObject?.data?.status?.toLowerCase())) compStatus = 'P';
		if (competitionObject?.data?.status?.toLowerCase() == 'canceled')	compStatus = 'F';

    // ### NOTE:
    // ### identify Tx-Translation.
		if (competitionObject?.data?.status?.toLowerCase() == 'finished')
      txStatusTranslation = translationObject?.status?.complete ?? 'Complete';
    ;
    if (['active', 'pending'].includes(competitionObject?.data?.status?.toLowerCase()))
      txStatusTranslation = translationObject?.status?.pending ?? 'Pending';
    ;
		if (competitionObject?.data?.status?.toLowerCase() == 'canceled')
      txStatusTranslation = translationObject?.status?.canceled ?? 'Canceled';
    ;
	}

  /**
   * @description
   * TODO: DOC:
  */
  $: if (competitionObject?.data)
  {
    // ### CHECK
    // ### for new (v2) competitions data presence.
    if (competitionObject?.data?.prize_group_win_individual != undefined)
    {
      competitionPotentialUserWin =
        competitionUserForecast == 'yes'
          ? (competitionObject?.data?.prize_group_win_individual?.yes - (competitionObject?.data?.prize_group_win_individual?.yes ?? 0) * (competitionObject?.data?.betarena_fee / 100 ?? 0))
          : (competitionObject?.data?.prize_group_win_individual?.no - (competitionObject?.data?.prize_group_win_individual?.no ?? 0) * (competitionObject?.data?.betarena_fee / 100 ?? 0))
      ;
    }
    // ### otherwise,
    // ### adjust 'potential-win' / 'prize-won' for leagcy competitions.
    else
    {
      if (competitionUserForecast == 'yes')
        competitionPotentialUserWin = ((competitionObject?.data?.total_prize ?? 0) - (competitionObject?.data?.betarena_commission ?? 0)) / (competitionObject?.data?.participants?.yes?.length ?? 0);
      //
      if (competitionUserForecast == 'no')
        competitionPotentialUserWin = ((competitionObject?.data?.total_prize ?? 0) - (competitionObject?.data?.betarena_commission ?? 0)) / (competitionObject?.data?.participants?.no?.length ?? 0);
      //
    }
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

<tr
  class:extra-info={isCompExtraInfo && (isViewMobile || isViewTablet)}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  COMPETITION ➤ ID
  -->
  <td>
    <p
      class=
      "
      w-500
      "
    >
      {competitionObject?.id ?? '-'}
    </p>
  </td>

  <!--
  COMPETITION ➤ SPORT / DATE
  -->
  <td>
    <p
      class=
      "
      s-14
      capitalize
      "
    >
      {B_SAP_D3_SP_M?.[$sessionStore?.serverLang] ?? '-'}
    </p>
    <p
      class=
      "
      s-12
      color-grey
      "
    >
      <!-- {competitionObject?.created_at} -->
      {tryCatch(() => toISOMod(competitionObject?.created_at)) ?? '-'}
    </p>
  </td>

  <!--
  💻 TABLET + 🖥️ LAPTOP
  -->
  {#if !isViewMobile}

    <!--
    COMPETITION ➤ CONTEST TITLE / STYLE
    -->
    <td>
      <a
        href="/{competitionObject?.urls?.[$sessionStore?.serverLang]}"
        class=
        "
        display-unset
        "
      >
        <p
          class=
          "
          color-black-2
          comp-title
          "
        >
          {competitionTitle ?? ''}
        </p>
      </a>
      <p
        class=
        "
        s-12
        color-grey
        "
      >
        <!-- {competitionObject?.created_at} -->
        {translationObject2?.categories?.["1"] ?? '-'}
      </p>
    </td>

    <!--
    COMPETITION ➤ ENTRY FEE
    -->
    <td>
      <p>
        {competitionObject?.data?.entry_fee ?? '-'} BTA
      </p>
    </td>

  {/if}

  <!--
  🖥️ LAPTOP
  -->
  {#if !isViewMobile && !isViewTablet}

    <!--
    COMPETITION ➤ TOTAL PRIZES
    -->
    <td>
      <p>
        {toDecimalFix((competitionObject?.data?.total_prize - competitionObject?.data?.betarena_commission), 2, true) ?? ''} BTA
      </p>
    </td>

    <!--
    COMPETITION ➤ POTENTIAL WIN (for target user vote selection)
    -->
    <td>
      <p>
        {toDecimalFix(competitionPotentialUserWin, 2, true) ?? '-'} BTA
      </p>
    </td>

    <!--
    COMPETITION ➤ FORECAST (for target user vote selection)
    -->
    <td>
      <p
        class=
        "
        capitalize
        "
      >
        {competitionUserForecast ?? '-'}
      </p>
    </td>

    <!--
    COMPETITION ➤ RESULT (for target user vote selection)
    -->
    <td>
      <div
      >
        <p
          class=
          "
          comp-status-pill
          "
          class:completed={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
          class:failed={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
          class:menu-opt-not-available={competitionObject?.data?.status == 'canceled'}
          class:color-grey={competitionObject?.data?.status == 'canceled'}
        >
          {#if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
            {translationObject?.result?.won ?? 'Won'}
          {:else if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
            {translationObject?.result?.lost ?? 'Lost'}
          {:else if competitionObject?.data?.status == 'canceled'}
            {translationObject?.result?.refund ?? 'Refunded'}
          {/if}
        </p>
      </div>
    </td>

    <!--
    COMPETITION ➤ PRIZE WON
    -->
    <td>
      <p
        class:color-green={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
        class:color-red-bright-v2={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
      >
        {#if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
          +{toDecimalFix(competitionPotentialUserWin, 2, true)} BTA
        {:else if competitionObject?.data?.status == 'finished'}
          -{toDecimalFix(competitionObject?.data?.entry_fee, 2, true)} BTA
        {:else}
          -
        {/if}
      </p>
    </td>

  {/if}

  <!--
  💻 TABLET
  -->
  {#if !isViewMobile && isViewTablet}

    <!--
    COMPETITION ➤ (COLUMN) ➤ POTENTIAL WIN / PRIZE WON
    -->
    <td>
      <p>
        {toDecimalFix(competitionPotentialUserWin, 2, true) ?? '-'} BTA
      </p>
      <p
        class=
        "
        s-12
        "
        class:color-green={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
        class:color-red-bright-v2={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
      >
        {#if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
          +{toDecimalFix(competitionPotentialUserWin, 2, true)} BTA
        {:else if competitionObject?.data?.status == 'finished'}
          -{toDecimalFix(competitionObject?.data?.entry_fee, 2, true)} BTA
        {:else}
          -
        {/if}
      </p>
    </td>

  {/if}

  <!--
  💻 TABLET + 🖥️ LAPTOP
  COMPETITION ➤ STATUS (END)
  -->
  {#if !isViewMobile}

    <!--
    COMPETITION ➤ STATUS
    -->
    <td>
      <div
        class=
        "
        row-space-end
        "
      >
        <p
          class=
          "
          comp-status-pill
          "
          class:completed={compStatus == 'C'}
          class:pending={compStatus == 'P'}
          class:failed={compStatus == 'F'}
        >
          {txStatusTranslation ?? '-'}
        </p>

        <!--
        💻 TABLET
        -->
        {#if isViewTablet}
          <img
            src={isCompExtraInfo ? icon_arrow_up : icon_arrow_down}
            alt={isCompExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
            class=
            "
            m-l-8
            "
            on:click={() => isCompExtraInfo = !isCompExtraInfo}
          />
        {/if}

      </div>
    </td>

  {/if}

  <!--
  📱 MOBILE
  COMPETITION ➤ PRIZE WON (END)
  -->
  {#if isViewMobile}

    <td>
      <div
        class=
        "
        row-space-end
        "
      >
        <p
          class:color-green={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
          class:color-red-bright-v2={competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
        >
          {#if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
            +{toDecimalFix(competitionPotentialUserWin, 2, true)} BTA
          {:else if competitionObject?.data?.status == 'finished'}
            -{toDecimalFix(competitionObject?.data?.entry_fee, 2, true)} BTA
          {:else}
            -
          {/if}
        </p>

        <img
          src={isCompExtraInfo ? icon_arrow_up : icon_arrow_down}
          alt={isCompExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
          class=
          "
          m-l-8
          "
          on:click={() => isCompExtraInfo = !isCompExtraInfo}
        />
      </div>
    </td>

  {/if}

  <!--
  📱 MOBILE + 💻 TABLET
  COMPETITION ➤ EXTRA INFO
  -->
  {#if isCompExtraInfo && (isViewMobile || isViewTablet)}

    <div
      class=
      "
      column-start-grid-start
      tx-extra-info
      "
    >
      {#each txExtraInfoStruct as item}
        <div
          class=
          "
          row-space-out
          "
        >
          <p
            class=
            "
            s-14
            color-grey
            no-wrap
            "
          >
            {#if item == 'title'}
              {translationObject?.header?.contest_title?.split('/')?.[0]}
            {:else if item == 'style'}
              {translationObject?.header?.contest_title?.split('/')?.[1]}
            {:else if item == 'entry_fee'}
              {translationObject?.header?.entry_fee}
            {:else if item == 'total_prize'}
              {translationObject?.header?.total_prize}
            {:else if item == 'potential_win'}
              {translationObject?.header?.potential_win}
            {:else if item == 'forecast'}
              {translationObject?.header?.forecast}
            {:else if item == 'result'}
              {translationObject?.header?.result}
            {:else if item == 'prize_won'}
              {isViewMobile ? translationObject?.header?.status : translationObject?.header?.prize}
            {/if}
          </p>

          <a
            href="/{competitionObject?.urls?.[$sessionStore?.serverLang]}"
            class=
            "
            display-unset
            "
            class:disable-anchor={item != 'title'}
          >
            <p
              class=
              "
              s-14
              color-black-2
              no-wrap
              "
              class:comp-title-extra={item == 'title'}

              class:capitalize={item == 'forecast'}

              class:comp-status-pill={item == 'result' || item == 'prize_won'}
              class:completed={item == 'result' && competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast || (item == 'prize_won' && isViewMobile && compStatus == 'C')}
              class:failed={item == 'result' && competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast || (item == 'prize_won' && isViewMobile && compStatus == 'F')}
              class:menu-opt-not-available={item == 'result' && competitionObject?.data?.status == 'canceled'}
              class:color-grey={item == 'result' && competitionObject?.data?.status == 'canceled'}

              class:pending={(item == 'prize_won' && isViewMobile && compStatus == 'P')}

              class:color-green={item == 'prize_won' && competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
              class:color-red-bright-v2={item == 'prize_won' && competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
            >
              {#if item == 'title'}
                {competitionTitle}

              {:else if item == 'style'}
                {translationObject2?.categories?.["1"] ?? '-'}

              {:else if item == 'entry_fee'}
                {competitionObject?.data?.entry_fee ?? '-'} BTA

              {:else if item == 'total_prize'}
                {toDecimalFix((competitionObject?.data?.total_prize - competitionObject?.data?.betarena_commission), 2, true) ?? ''} BTA

              {:else if item == 'potential_win'}
                {toDecimalFix(competitionPotentialUserWin, 2, true) ?? '-'} BTA

              {:else if item == 'forecast'}
                {competitionUserForecast ?? '-'}

              {:else if item == 'result'}
                {#if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
                  {translationObject?.result?.won ?? 'Won'}
                {:else if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group != competitionUserForecast}
                  {translationObject?.result?.lost ?? 'Lost'}
                {:else if competitionObject?.data?.status == 'canceled'}
                  {translationObject?.result?.refund ?? 'Refunded'}
                {/if}

              {:else if item == 'prize_won'}
                {#if isViewMobile}
                  {txStatusTranslation ?? '-'}
                {:else}
                  {#if competitionObject?.data?.status == 'finished' && competitionObject?.data?.winner_group == competitionUserForecast}
                    +{toDecimalFix(competitionPotentialUserWin, 2, true)} BTA
                  {:else if competitionObject?.data?.status == 'finished'}
                    -{toDecimalFix(competitionObject?.data?.entry_fee, 2, true)} BTA
                  {:else}
                    -
                  {/if}

                {/if}
              {/if}
            </p>
          </a>

        </div>
      {/each}
    </div>

  {/if}

</tr>

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

  tr
  {
    position: relative;
    position: -webkit-sticky;
    max-height: 56px;
    height: 56px;
    min-height: 56px;
  }
  tr td
  {
    /* 🎨 style */
    padding: 8px 0 8px 0;
    padding-right: 12px;
  }
  tr td:first-child
  {
    /* 🎨 style */
    padding-left: 20px !important;
    border-radius: 4px 0 0 4px;
  }
  tr td:last-of-type
  {
    /* 🎨 style */
    padding-right: 20px !important;
    border-radius: 0 4px 4px 0;
  }

  tr.extra-info
  {
    /* 🎨 style */
    height: unset;
  }
  tr.extra-info td
  {
    /* 🎨 style */
    padding-top: 8px;
    padding-bottom: 284px;
  }

  tr td p
  {
    /* 🛝 layout */
    width: fit-content;
    white-space: nowrap;
    /* 🎨 style */
    color: var(--dark-theme);
  }
  tr td p.comp-status-pill,
  tr p.comp-status-pill
  {
    /* 🛝 layout */
    width: fit-content;
    /* 🎨 style */
    padding: 4px 12px;
    border-radius: 32px;
  }
  tr td p.comp-status-pill.completed,
  tr p.comp-status-pill.completed
  {
    /* 🎨 style */
    color: var(--status-green, #59C65D) !important;
    background: rgba(89, 198, 93, 0.10);
  }
  tr td p.comp-status-pill.pending,
  tr p.comp-status-pill.pending
  {
    /* 🎨 style */
    color: var(--status-yellow, #FFB904) !important;
    background: rgba(255, 185, 4, 0.10);
  }
  tr td p.comp-status-pill.failed,
  tr p.comp-status-pill.failed
  {
    /* 🎨 style */
    color: var(--status-red-night, #FF5959) !important;
    background: rgba(255, 89, 89, 0.10);
  }
  tr td p.comp-title,
  div.tx-extra-info p.comp-title-extra
  {
    /* 🎨 style */
    max-width: 100px;
    margin-right: 10px;
		overflow: hidden;
    text-overflow: ellipsis;
  }

  tr div.tx-extra-info
  {
    /* 🎨 style */
    padding: 0 20px;
    position: absolute;
    top: 56px;
    right: 0;
    left: 0;
    /*  */
    gap: 12px;
  }

  p.menu-opt-not-available
  {
    /* 🎨 style */
    padding: 3px 8px;
    background-color: var(--whitev2);
    border-radius: 20px;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 425px)
  {

    div.tx-extra-info p.comp-title-extra
    {
      /* 🎨 style */
      max-width: unset;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: unset;
    }

  }

  @media only screen
  and (min-width: 581px)
  {

    tr td p.comp-title
    {
      /* 🎨 style */
      max-width: 100px;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

  }

  @media only screen
  and (min-width: 912px)
  {

    tr td p.comp-title:hover
    {
      /* 📌 position */
      position: absolute;
      top: 10px;
      margin: auto;
      /* 🎨 style */
      height: fit-content;
      max-width: unset;
      text-overflow: unset;
      padding: 4px 9px;
      border-radius: 4px;
      background: var(--white);
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    }

  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  tr.dark-background-1 p.menu-opt-not-available
  {
    /* 🎨 style */
		background-color: var(--dark-theme-1-shade) !important;
	}

  tr.dark-background-1 td p.comp-title:hover
  {
    /* 🎨 style */
    background: var(--dark-theme-1);
  }

</style>