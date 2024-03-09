/* eslint-disable max-len */

// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';

import { breakdownDates, toCorrectDate } from '$lib/utils/dates.js';
import { checkNull } from '$lib/utils/miscellenous.js';

import type { PublicTransactionHistoryMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  storeObject: IProfileInvestorSection
  = {
    global: new Set()
    , globalActivePresaleStartClock: null
    , globalActivePresaleEndClock: null
    , globalFinalPresaleEndClock: null
    , globalTgeReleaseClock: null
    , globalInternalClock: new Date()
    , referralInviteStateWidget: 'FirstInvestmentNotMade'
    , tgeStateWidget: 'Tge_NoDefinedDate'
    , roundStateWidget: 'Round_ToBeAnnounced'
    , investHistoryStateWidget: 'Standard'
    , vestingHistoryStateWidget: 'Standard'
    , walletsStateWidget: 'Standard'
    , bonusSummaryStateWidget: 'Standard'
    , referralHistoryStateWidget: 'Standard'
    , userTotalFiatInvested: 0
    , adminOverrides: new Set()
  }
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

function createLocalStore
(
)
{
  const
    {
      subscribe
      , set
      , update
    } = writable
    (
      storeObject
    )
    /**
     * @description
     *  📣 Complementary 'store' added methods.
     */
    , methods
    = {

      /**
       * @author
       *  @migbash
       * @summary
       *  🟥 MAIN
       * @description
       *  📣 Generate initial **Main State** for Profile > Investor Section.
       * @return { void }
       */
      assignMainSectionState:
      (
        opts:
        {
          investmentCount: number | null | undefined;
          presaleName: string | null | undefined;
          activePresaleStartDate: string | null | undefined;
          activePresaleEndDate: string | null | undefined;
          publicEndDate: string | null | undefined;
          tgeAvailableDate: string | null | undefined;
          tgeStatus: string | null | undefined;
          transactionHistory: PublicTransactionHistoryMain[] | null | undefined;
        }
      ): void =>
      {
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 [GENERAL] MAIN EXCLUSIVE                                                      │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        if (opts.investmentCount != null && opts.investmentCount > 0)
        {
          storeObject.global.add('FirstInvestmentMade');
          storeObject.referralInviteStateWidget = 'FirstInvestmentMade';
        }
        else
        {
          storeObject.global.add('FirstInvestmentNotMade');
          storeObject.referralInviteStateWidget = 'FirstInvestmentNotMade';
        }

        storeObject.userTotalFiatInvested = opts.transactionHistory
          ?.filter
          (
            x =>
            {
              return x.status == 'completed' && x.type == 'investment'
            }
          )
          ?.reduce
          (
            (
              acc
              , item
            ) =>
            {
              return (acc + (item.quantity ?? 0));
            },
            0
          ) ?? 0
        ;

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 [WIDGET] TGE EXCLUSIVE                                                        │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        if (checkNull(opts.tgeStatus))
          if (!opts.publicEndDate || !opts.tgeAvailableDate || opts.presaleName == 'private')
            storeObject.tgeStateWidget = 'Tge_NoDefinedDate';
          else
            storeObject.tgeStateWidget = 'Tge_DateDefined';
        // else if ((storeObject.globalTgeReleaseClock?.[0] ?? 1) <= 0 && (storeObject.globalTgeReleaseClock?.[3] ?? 1) <= 0)
        //   storeObject.tgeStateWidget = 'Tge_ClaimAvailable';
        else
          storeObject.tgeStateWidget = 'Tge_Claimed';
        //

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 [WIDGET] ROUNDS EXCLUSIVE                                                     │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        storeObject.roundStateWidget = 'Round_ToBeAnnounced';

        methods.initiateCountdowns
        (
          {
            activePresaleEndDate: opts.activePresaleEndDate ?? ''
            , activePresaleStartDate: opts.activePresaleStartDate ?? ''
            , publicEndDate: opts.publicEndDate ?? ''
            , tgeAvailableDate: opts.tgeAvailableDate ?? ''
          }
        );

        set(storeObject);

        return;
      }

      /**
       * @author
       *  @migbash
       * @summary
       *  🟥 MAIN
       * @description
       *  📣 Generate initial **Countdown State** for Profile > Investor Section.
       * @return { void }
       */
      , initiateCountdowns:
      (
        opts:
        {
          activePresaleStartDate: string
          , activePresaleEndDate: string
          , tgeAvailableDate: string
          , publicEndDate: string
        }
      ): void =>
      {
        setInterval
        (
          () =>
          {
            storeObject.globalActivePresaleStartClock = breakdownDates(toCorrectDate(opts.activePresaleStartDate, false).getTime() - new Date().getTime());
            storeObject.globalActivePresaleEndClock = breakdownDates(toCorrectDate(opts.activePresaleEndDate, false).getTime() - new Date().getTime());
            storeObject.globalTgeReleaseClock = breakdownDates(toCorrectDate(opts.tgeAvailableDate, false).getTime() - new Date().getTime());
            storeObject.globalFinalPresaleEndClock = breakdownDates(toCorrectDate(opts.publicEndDate, false).getTime() - new Date().getTime());
            storeObject.globalInternalClock = new Date();
            set(storeObject);
            methods.updateCountdownDependantStates();
          },
          1000
        );
      }

      /**
       * @author
       *  @migbash
       * @summary
       *  🟥 MAIN
       * @description
       *  📣 Updated states dependent on countdown.
       * @return { void }
       */
      , updateCountdownDependantStates:
      (
      ): void =>
      {
        if (!storeObject.adminOverrides.has('Tge'))
          if ((storeObject.globalTgeReleaseClock?.[0] ?? 1) <= 0 && (storeObject.globalTgeReleaseClock?.[3] ?? 1) <= 0 && storeObject.tgeStateWidget != 'Tge_Claimed')
            storeObject.tgeStateWidget = 'Tge_ClaimAvailable';
        // ──────────────────────────────────────────────────────────────────────────────────

        if (!storeObject.adminOverrides.has('Rounds'))
          if ((storeObject.globalActivePresaleStartClock?.[0] ?? 1) >= 0 && (storeObject.globalActivePresaleStartClock?.[4] ?? 1) >= 0)
            storeObject.roundStateWidget = 'Round_CountdownWithDefinedDate';
          else if ((storeObject.globalActivePresaleEndClock?.[0] ?? 1) >= 0 && (storeObject.globalActivePresaleEndClock?.[4] ?? 1) >= 0)
            storeObject.roundStateWidget = 'Round_CountdownToFinish';
          else if ((storeObject.globalActivePresaleEndClock?.[0] ?? 1) <= 0 && (storeObject.globalActivePresaleEndClock?.[4] ?? 1) <= 23)
            storeObject.roundStateWidget = 'Round_Ended';
        // else
        //   storeObject.roundStateWidget = 'Round_ToBeAnnounced';
        // ──────────────────────────────────────────────────────────────────────────────────

        set(storeObject);
      }

      /**
       * @author
       *  @migbash
       * @summary
       *  🟦 HELPER
       * @description
       *  📣 Updates existing `admin` list of actively mutated widgets.
       * @return { void }
       */
      , updateAdminMutatedWidgets:
      (
        widgetName: IProfileAdminWidgets
        , action: 'set' | 'remove'
      ): void =>
      {
        if (action == 'set')
          storeObject.adminOverrides.add(widgetName);
        else
          storeObject.adminOverrides.delete(widgetName);
        //
        set(storeObject);
        return;
      }

    }
  ;

  return {
    subscribe
    ,set
    ,update
    ,...methods
  };
}

// #endregion ➤ 🛠️ METHODS

export const scoresProfileInvestorStore = createLocalStore();
