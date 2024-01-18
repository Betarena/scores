<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import { page } from '$app/stores';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import type { PUBLIC__INVESTOR_IBonus } from '@betarena/scores-lib/types/_HASURA_.js';

  import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let
    /**
     * @augments IProfileData
    */
    profileData: IProfileData | null
  ;

  type IDataLayout = keyof PUBLIC__INVESTOR_IBonus | '' ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕referral-bonus⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /**
     * @description
     *  📣 Target `table` row order.
    */
    dataLayout: IDataLayout[]
    = [
      'referral_bonus'
      , 'referrals_number'
      , 'referred_bonus'
      , 'total_bonus'
    ]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  ▓ NOTE:
  ▓ > bonus summary widget title.
  -->
  <p
    class=
    "
    s-20
    w-500
    color-black-2
    m-b-20
    "
  >
    {
      profileTrs.investor?.referral.bonus.title
      ?? 'Bonus Summary'
    }
  </p>

  <!--
  ▓ NOTE:
  ▓ > bonus summary data.
  -->
  <div
    id="referral-bonus-box"
  >
    {#each dataLayout as item}
      <div
        class=
        "
        row-space-out
        <!---->
        bonus-row
        "
      >

        <p
          class=
          "
          s-14
          color-grey
            grey-v1
          "
        >
          {#if item == 'referral_bonus'}
            {
              profileTrs.investor?.referral.bonus.referral_bonus
              ?? 'Referral Bonus'
            }
          {:else if item == 'referrals_number'}
            {
              profileTrs.investor?.referral.bonus.ref_number
              ?? 'Referrals Number'
            }
          {:else if item == 'referred_bonus'}
            {
              profileTrs.investor?.referral.bonus.referred_bonus
              ?? 'Referred Bonus'
            }
          {:else if item == 'total_bonus'}
            {
              profileTrs.investor?.referral.bonus.total
              ?? 'Total Bonus'
            }
          {/if}
        </p>

        <p
          class=
          "
          s-14
          color-black-2
          "
        >
          {profileData?.investorData?.data?.bonus_summary[item] ?? 0} BTA
        </p>

      </div>
    {/each}
  </div>

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-bonus⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
    height: 242px;
    min-height: 242px;
    max-height: 242px;

    div#referral-bonus-box
    {
      div.bonus-row
      {
        /* 🎨 style */
        padding: 10px 20px;
        border-radius: 4px;
        min-height: 40px;
        max-height: 40px;

        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: var(--whitev2);
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-bonus⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 div#referral-bonus-box
    {
      div.bonus-row
      {
        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: rgba(75, 75, 75, 0.50) !important;
        }
      }
    }
  }

</style>
