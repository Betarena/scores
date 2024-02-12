/* eslint-disable max-len */

// #region ➤ 📦 Package Imports

import { toCorrectDate } from '$lib/utils/dates.js';
import { writable } from 'svelte/store';

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
          investmentCount: number | null;
          presaleName: string | null;
          activePresaleStartDate: string | null;
          activePresaleEndDate: string | null;
          publicEndDate: string | null;
          tgeAvailableDate: string | null;
          tgeStatus: string | null;
        }
      ): void =>
      {
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 MAIN EXCLUSIVE                                                                │
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

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 TGE EXCLUSIVE                                                                 │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        if (opts.tgeStatus == null)
          if (!opts.publicEndDate || !opts.tgeAvailableDate || opts.presaleName == 'private')
            storeObject.tgeStateWidget = 'Tge_NoDefinedDate';
          else
            storeObject.tgeStateWidget = 'Tge_DateDefined';
        else if (opts.tgeStatus == 'Pending')
          storeObject.tgeStateWidget = 'Tge_ClaimAvailable';
        else if (opts.tgeStatus == 'Distribuited')
          storeObject.tgeStateWidget = 'Tge_Claimed';
        //

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 ROUNDS EXCLUSIVE                                                              │
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
        /**
         * @author
         *  @migbash
         * @summary
         *  🟦 HELPER
         * @description
         *  📣 Breaks down dates into respective countdown fields.
         * @return { [string, string, string, string] }
         *  📤 Tuple data consisting of [days, hours, minutes, seconds]
         */
        function breakdownDates
        (
          dateDiff: number
        ): [number, number, number, number, number]
        {
          return [
            /**
             * @description
             *  📣 Number of `seconds` from target date.
             */
            Math.floor((dateDiff / 1000) % 60)
            /**
             * @description
             *  📣 Number of `minutes` from target date.
             */
            , Math.floor((dateDiff / 1000 / 60) % 60)
            /**
             * @description
             *  📣 Number of `hours` from target date.
             */
            , Math.floor((dateDiff / (1000 * 60 * 60)) % 24)
            /**
             * @description
             *  📣 Number of `days` from target date.
             */
            , Math.floor((dateDiff / (1000 * 60 * 60 * 24)))
            /**
             *  📣 Number of `hours` from target date.
             */
            , Math.floor(dateDiff / (1000 * 60 * 60))
          ];
        }

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
        if ((storeObject.globalTgeReleaseClock?.[0] ?? 1) <= 0 && (storeObject.globalTgeReleaseClock?.[3] ?? 1) <= 0)
          storeObject.tgeStateWidget = 'Tge_ClaimAvailable';
        // ──────────────────────────────────────────────────────────────────────────────────

        if ((storeObject.globalActivePresaleStartClock?.[0] ?? 1) >= 0 && (storeObject.globalActivePresaleStartClock?.[4] ?? 1) >= 0)
          storeObject.roundStateWidget = 'Round_CountdownWithDefinedDate';
        else if ((storeObject.globalActivePresaleEndClock?.[0] ?? 1) >= 0 && (storeObject.globalActivePresaleEndClock?.[4] ?? 1) >= 0)
          storeObject.roundStateWidget = 'Round_CountdownToFinish';
        else if ((storeObject.globalActivePresaleEndClock?.[0] ?? 1) > 0 && (storeObject.globalActivePresaleEndClock?.[4] ?? 1) < 23)
          storeObject.roundStateWidget = 'Round_Ended';
        else
          storeObject.roundStateWidget = 'Round_ToBeAnnounced';
        // ──────────────────────────────────────────────────────────────────────────────────

        set(storeObject);
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
