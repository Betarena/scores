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

  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { copyToClipboard, formatNumberWithCommas } from '$lib/utils/platform-functions.js';
  import { Misc } from '@betarena/scores-lib/dist/classes/class.misc.js';

  import ReferralsInviteModal from './Referrals.Invite.Modal.svelte';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';
  import icon_green_dot from '../assets/investor/icon-green-dot.svg';
  import icon_invite_investor from '../assets/investor/icon-invite-investor.svg';
  import icon_bronze from '../assets/price-tier/icon-bta-bronze.svg';
  import icon_gold from '../assets/price-tier/icon-bta-gold.svg';
  import icon_platinum from '../assets/price-tier/icon-bta-platinum.svg';
  import icon_silver from '../assets/price-tier/icon-bta-silver.svg';

  import type { B_H_KEYP, B_H_KEYP_Tier } from '@betarena/scores-lib/types/_HASURA_.js';
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
    /**
     * @description
     *  📣
    */
    , VIEWPORT_MOBILE_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣
    */
    , VIEWPORT_TABLET_INIT_PARENT: [ number, boolean ]
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕referral-info⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = VIEWPORT_MOBILE_INIT_PARENT
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = VIEWPORT_TABLET_INIT_PARENT
  ;

  let
    /**
     * @description
     *  📣 `Map` of **tier** data.
    */
    dataMap: Map < B_H_KEYP_Tier, B_H_KEYP > = new Misc().convertToMapKEYPINVSTTIER
    (
      (profileData?.investorTierPricing ?? [])
    )
    /**
     * @description
     *  📣 Wether target `extra info` should be shown for `more tiers`.
    */
    , isExtraInfo: boolean = false
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Assign target icon for target visible option.
   * @param { string } target
   *  💠 Target `tier` selected.
   * @return { string }
   *  📤 Target `tier icon`.
   */
  function selectIcon
  (
    target: B_H_KEYP_Tier
  ): string
  {
    if (target == 'bronze')
      return icon_bronze;
    else if (target == 'silver')
      return icon_silver;
    else if (target == 'gold')
      return icon_gold;
    else if (target == 'platinum')
      return icon_platinum;
    else
      return '';
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
▓ NOTE:
▓ > referral tiers information
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <div
    class=
    "
    row-space-out
    m-b-20
    "
  >
    <!--
    ▓ NOTE:
    ▓ > referral tier title.
    -->
    <p
      class=
      "
      s-20
      w-500
      color-black-2
      "
    >
      {
        profileTrs.investor?.referral.tiers.title
        ?? 'Referral Tiers & Bonus'
      }
    </p>

    <!--
    ▓ NOTE:
    ▓ > referral status pill.
    -->
    {#if profileData?.investorData?.tier}
      <div
        id="active"
        class=
        "
        row-space-start
        "
      >
        <img
          id=''
          src='{icon_green_dot}'
          alt=''
          title=''
          loading='lazy'
          class=
          "
          m-r-6
          "
        />
        <p
          class=
          "
          s-14
          color-black-2
          "
        >
          {
            profileTrs.investor?.referral.tiers.status
            ?? 'Active'
          }
        </p>
      </div>
    {/if}
  </div>

  <!--
  ▓ NOTE: ▓ 📱 MOBILE
  ▓ > referral tiers + bonus data.
  -->
  {#if VIEWPORT_MOBILE_INIT_PARENT[1]}

    <div
      class=
      "
      column-space-center
      <!---->
      tier-row
      "
    >

      <!--
      ▓ NOTE:
      ▓ > tier box
      -->
      <div
        class=
        "
        row-space-start
        "
      >
        <!--
        ▓ NOTE:
        ▓ > tier assets icon.
        -->
        <img
          id=''
          src={selectIcon('bronze')}
          alt=''
          title=''
          loading='lazy'
          width=24px
          height=24px
          class=
          "
          m-r-8
          "
        />

        <!--
        ▓ NOTE:
        ▓ > tier text.
        -->
        <p
          class=
          "
          s-14
          w-500
          color-black-2
          "
        >
          {
            profileTrs.investor?.investment_details.tier
            ?? 'Tier'
          }
          {dataMap.get('bronze')?.data?.position}

          {#if dataMap.get('bronze')?.data?.invest_max == -1}
            (${formatNumberWithCommas(dataMap.get('bronze')?.data?.invest_min)} or more)
          {:else}
            (${formatNumberWithCommas(dataMap.get('bronze')?.data?.invest_min)} - ${formatNumberWithCommas(dataMap.get('bronze')?.data?.invest_max)})
          {/if}
        </p>
      </div>

      <!--
      ▓ NOTE:
      ▓ > tier referral distribuition.
      -->
      <p
        class=
        "
        s-14
        color-black-2
        no-wrap
        m-l-24
        "
      >
        {
          'You receive:'
        }
        <span
          class=
          "
          w-500
          color-primary
          "
        >
          {dataMap.get('bronze')?.data?.referral?.owner_percentage}%
        </span>
        /
        {
          'Referred:'
        }
        <span
          class=
          "
          w-500
          color-primary
          "
        >
          {dataMap.get('bronze')?.data?.referral?.referred_percentage}%
        </span>
      </p>

    </div>

    <!--
    ▓ NOTE:
    ▓ > see more tiers
    -->
    <div
      class=
      "
      row-space-out
      m-t-20
      m-b-20
      "
      on:click={() => { isExtraInfo = !isExtraInfo; return; }}
    >
      <p
        class=
        "
        s-14
        w-500
        color-black-2
        "
      >
        {
          profileTrs.investor?.tiers.more_tiers
          ?? 'See more tiers'
        }
      </p>

      <img
        src={isExtraInfo ? icon_arrow_up : icon_arrow_down}
        alt={isExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
        class=
        "
        m-l-8
        "
      />
    </div>

  {/if}

  <!--
  ▓ NOTE: ▓ 💻 TABLET 🖥️ LAPTOP 📱 MOBILE
  ▓ > referral tiers + bonus data.
  -->
  {#if !VIEWPORT_MOBILE_INIT_PARENT[1] || isExtraInfo}

    <div
      id="tier-box"
    >
      {#each [...dataMap.entries()].reverse() as [key, data]}
        {#if !['NaN', 'bronze'].includes(key) && VIEWPORT_MOBILE_INIT_PARENT[1]
          || !['NaN'].includes(key) && !VIEWPORT_MOBILE_INIT_PARENT[1]
        }
          <div
            class=
            "
            {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'column-space-center' : 'row-space-out'}
            <!---->
            tier-row
            "
          >

            <!--
            ▓ NOTE:
            ▓ > tier box
            -->
            <div
              class=
              "
              row-space-start
              "
            >
              <!--
              ▓ NOTE:
              ▓ > tier assets icon.
              -->
              <img
                id=''
                src={selectIcon(key)}
                alt=''
                title=''
                loading='lazy'
                width=24px
                height=24px
                class=
                "
                m-r-8
                "
              />

              <!--
              ▓ NOTE:
              ▓ > tier text.
              -->
              <p
                class=
                "
                s-14
                w-500
                color-black-2
                "
              >
                {
                  profileTrs.investor?.investment_details.tier
                  ?? 'Tier'
                }
                {data.data?.position}

                {#if data.data?.invest_max == -1}
                  (${formatNumberWithCommas(data.data.invest_min)} or more)
                {:else}
                  (${formatNumberWithCommas(data.data?.invest_min)} - ${formatNumberWithCommas(data.data?.invest_max)})
                {/if}
              </p>
            </div>

            <!--
            ▓ NOTE:
            ▓ > tier referral distribuition.
            -->
            <p
              class=
              "
              s-14
              color-black-2
              no-wrap
              m-l-24
              "
            >
              You receive:
              <span
                class=
                "
                w-500
                color-primary
                "
              >
                {data.data?.referral?.owner_percentage}%
              </span>
              / Referred:
              <span
                class=
                "
                w-500
                color-primary
                "
              >
                {data.data?.referral?.referred_percentage}%
              </span>
            </p>

          </div>
        {/if}
      {/each}
    </div>

  {/if}

  <!--
  ▓ NOTE:
  ▓ > referral personal data
  -->
  <div
    class=
    "
    m-t-25
    {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'column-space-center' : 'row-space-out'}
    "
  >
    <!--
    ▓ NOTE:
    ▓ > referral code (box)
    -->
    <div
      class=
      "
      {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'm-b-12' : 'm-r-20'}
      <!---->
      referral-code-box
      "
    >
      <!--
      ▓ NOTE:
      ▓ > referral title (text)
      -->
      <p
        class=
        "
        s-14
        w-500
        color-black-2
        "
      >
        {
          profileTrs.investor?.referral.links.ref_id
          ?? 'Referral ID'
        }
      </p>

      <!--
      ▓ NOTE:
      ▓ > referral code + copy (box)
      -->
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
          m-r-10
          "
        >
          {$userBetarenaSettings.user.scores_user_data?.referralID ?? ''}
        </p>

        <p
          class=
          "
          s-14
          w-500
          underline
          color-black-2
          hover-color-primary
          cursor-pointer
          "
          on:click={() => { copyToClipboard($userBetarenaSettings.user.scores_user_data?.referralID ?? ''); return; }}
        >
          {
            profileTrs.investor?.referral.links.copy
            ?? 'Copy'
          }
        </p>
      </div>
    </div>

    <!--
    ▓ NOTE:
    ▓ > referral link data
    -->
    <div
      class=
      "
      referral-code-box
      "
    >
      <!--
      ▓ NOTE:
      ▓ > referral title (text)
      -->
      <p
        class=
        "
        s-14
        w-500
        color-black-2
        "
      >
        {
          profileTrs.investor?.referral.links.ref_link
          ?? 'Referral Link'
        }
      </p>

      <!--
      ▓ NOTE:
      ▓ > referral sub-title (text)
      -->
      <p
        class=
        "
        s-14
        color-grey
        "
      >
        {
          profileTrs.investor?.referral.links.message
          ?? 'Available after investment'
        }
      </p>
    </div>
  </div>

  <!--
  ▓ NOTE:
  ▓ > referral modal open
  -->
  <button
    class=
    "
    btn-primary-v2
      btn-shadow-1
    width-100
    {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'm-t-30' : 'm-t-25'}
    "
    on:click={() => {return $sessionStore.showReferralInviteModal = true}}
  >
    <img
      id=''
      src={icon_invite_investor}
      alt=''
      title=''
      loading='lazy'
      width=24
      height=24
      class=
      "
      m-r-12
      "
    />
    {
      profileTrs.investor?.referral.links.cta_title
      ?? 'Invite Investors'
    }
  </button>

</div>

<!--
▓ NOTE:
▓ > referral invitation information modal
-->
{#if $sessionStore.showReferralInviteModal}
  <ReferralsInviteModal />
{/if}

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

  div#profile⮕w⮕referral-info⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;

    div#active
    {
      /* 🎨 style */
      width: fit-content;
      padding: 2px 12px;
      border-radius: 32px;
      background: rgba(89, 198, 93, 0.10);
    }

    div#tier-box
    {
      div.tier-row
      {
        /* 🎨 style */
        padding: 8px;
        border-radius: 4px;
        align-items: flex-start;

        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: var(--whitev2);
        }
      }
    }

    div.referral-code-box
    {
      /* 🎨 style */
      height: 68px;
      width: 100%;
      border-radius: 8px;
      background-color: var(--whitev2);
      padding: 12px 20px;
    }

    &⮕modal
    {
      /* 📌 position */
      position: absolute;
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-info⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 div#tier-box
    {
      div.tier-row
      {
        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: rgba(75, 75, 75, 0.50) !important;
        }
      }
    }

    &.dark-background-1 div.referral-code-box
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-7-shade);
    }
  }

</style>
