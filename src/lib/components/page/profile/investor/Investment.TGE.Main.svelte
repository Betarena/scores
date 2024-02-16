<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ High Order Component Overview                                                    │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Version Svelte Format :|: V.8.0 [locked]                                       │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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

  import { postv2 } from '$lib/api/utils.js';
  import { userUpdateInvestorBalance } from '$lib/firebase/common.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { formatNumberWithCommas } from '$lib/utils/platform-functions.js';
  import { scoresProfileInvestorStore } from './_store.js';

  import icon_bta_token from '../assets/price-tier/icon-bta-token.svg';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import MainClaimModal from './Main-Claim-Modal.svelte';

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
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investtge⮕main'
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ adminOverrides } = $scoresProfileInvestorStore);
  // @ts-expect-error
  $: ({ uid } = $userBetarenaSettings.user.firebase_user_data);

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
   *  📣 Create new **TGE request** for target user of said amount.
   * @return { Promise < void > }
   */
  async function createTgeClaimRequest
  (
  ): Promise < void >
  {
    const
      /**
       * @description
       *  📣 Response from `endpoint`.
       */
      result = await postv2
      (
        // `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}/transaction/update/investment/claim/create`
        'http://127.0.0.1:5001/betarena-ios/us-central1/api/transaction/update/investment/claim/create'
        , {
          uid
          , vestingId: null
          , isTge: true
        }
      )
    ;

    // @ts-expect-error
    if (result.error)
    {
      $sessionStore.currentActiveModal = 'GeneralPlatform_Error';
      return;
    }

    const
      /**
       * @description
       *  📣 Target amount to change balance by **(a.k.a delta)**.
      */
      deltaBalance: number = (-(profileData?.investorData?.data?.tge.tokens ?? 0))
    ;

    // TODO:
    // can be offloaded to server (backend).

    await userUpdateInvestorBalance
    (
      {
        uid
        , deltaBalance
        , type: 'tge'
      }
    );

    $scoresProfileInvestorStore.tgeStateWidget = 'Tge_Claimed';

    return;
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
▓ NOTE:
▓ > (child-component) claim modal
-->
{#if $sessionStore.currentActiveModal == 'ProfileInvestor_ClaimTGE_Modal'}
  <MainClaimModal
    {VIEWPORT_MOBILE_INIT}
    {VIEWPORT_TABLET_INIT}
    amount={profileData?.investorData?.data?.tge.tokens ?? 0}
    on:confirmEntry=
    {
      () =>
      {
        // alert('Executing TGE Claim!');
        createTgeClaimRequest();
        return;
      }
    }
  />
{/if}

<!--
▓ NOTE:
▓ > (widget) main
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  class:column-space-stretch={!VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1]}
  class:row-space-out={VIEWPORT_TABLET_INIT[1] && !VIEWPORT_MOBILE_INIT[1]}
  style=
  "
  {!VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1] ? 'justify-content: space-between;' : ''}
  "
  class:mutated={adminOverrides.has('Tge')}
>
  <!-- [🐞] -->
  <!-- {VIEWPORT_TABLET_INIT[1]} -->

  <AdminDevControlPanelToggleButton
    title='Tokens available on launch date (TGE)'
    mutated={adminOverrides.has('Tge')}
    on:reset=
    {
      () =>
      {
        scoresProfileInvestorStore.updateAdminMutatedWidgets
        (
          'Tge'
          , 'remove'
        );
        return;
      }
    }
  />

  <!--
  ╭──────────────────────────────────────────────────────────────────────╮
  │ NOTE:                                                                │
  │ TGE Tokens information/action(s) box.                                │
  ╰──────────────────────────────────────────────────────────────────────╯
  -->

  <div>

    <!--
    ▓ NOTE:
    ▓ > tokens available hint text.
    -->
    <p
      id="hint"
      class=
      "
      s-14
      color-grey
        grey-v1
      "
      class:m-b-24={VIEWPORT_TABLET_INIT[1] && !VIEWPORT_MOBILE_INIT[1]}
      class:m-b-12={!VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1]}
      style=
      "
      line-height: 20px; /* 142.857% */
      {!VIEWPORT_MOBILE_INIT[1] ? 'width: 170px;' : ''}
      "
    >
      <TranslationText
        key={`${CNAME}`}
        text={profileTrs?.investor?.tge.info}
        fallback={'Tokens available on launch date (TGE)'}
      />
    </p>

    <!--
    ▓ NOTE:
    ▓ > tokens accumulated (so far by user).
    -->
    <div
      class=
      "
      row-space-start
      "
    >

      <!--
      ▓ NOTE:
      ▓ > (text) TGE amount
      -->
      <p
        class=
        "
        w-500
        color-black-2
        m-r-6
        "
        class:s-40={!VIEWPORT_MOBILE_INIT[1]}
        class:s-32={VIEWPORT_MOBILE_INIT[1]}
        style=
        "
        line-height: 100%; /* 40px */
        "
      >
        {
          formatNumberWithCommas($userBetarenaSettings.user.scores_user_data?.investor_balance?.tge_to_claim ?? 0)
        }
        <span
          class=
          "
          s-24
          "
        >
          BTA
        </span>
      </p>

      <!--
      ▓ NOTE:
      ▓ > (asset) BTA icon token.
      -->
      <img
        id=''
        src={icon_bta_token}
        alt=''
        title=''
        loading='lazy'
        width=20
        height=20
      />

    </div>

     <!--
    ▓ NOTE:
    ▓ > token ready to claim.
    -->
    {#if $scoresProfileInvestorStore.tgeStateWidget == 'Tge_ClaimAvailable'}
      <button
        class=
        "
        m-t-20
        btn-primary-v2
        "
        on:click=
        {
          () =>
          {
            // alert('Initiate Process for Claim!');
            $sessionStore.currentActiveModal = 'ProfileInvestor_ClaimTGE_Modal';
            return;
          }
        }
      >
        <TranslationText
          key={`${CNAME}`}
          text={profileTrs?.investor?.tge.cta_title}
          fallback={'Claim now!'}
        />
      </button>
    {/if}

  </div>

  <!--
  ╭──────────────────────────────────────────────────────────────────────╮
  │ NOTE:                                                                │
  │ TGE Tokens information/action(s) box.                                │
  ╰──────────────────────────────────────────────────────────────────────╯
  -->

  <!--
  ▓ NOTE:
  ▓ > token release date view.
  -->
  {#if $scoresProfileInvestorStore.tgeStateWidget != 'Tge_Claimed'}
    <div
      class=
      "
      {VIEWPORT_MOBILE_INIT[1] ? 'm-t-32' : ''}
      "
    >

      <!--
      ▓ NOTE:
      ▓ > Release date text.
      -->
      <p
        class=
        "
        s-14
        color-grey
          grey-v1
        m-b-12
        "
        style=
        "
        line-height: 20px; /* 142.857% */
        "
      >
        <TranslationText
          key={`${CNAME}`}
          text={profileTrs?.investor?.tge.date_title}
          fallback={'Release date'}
        />
      </p>

      <!--
      ▓ NOTE:
      ▓ > token release date not set.
      -->
      {#if $scoresProfileInvestorStore.tgeStateWidget == 'Tge_NoDefinedDate' || $scoresProfileInvestorStore.tgeStateWidget == 'Tge_ClaimAvailable'}

        <div
          id="round-info-box-parent"
        >
          <p
            class=
            "
            s-14
            color-grey
              dark-v1
            "
          >
            {#if $scoresProfileInvestorStore.tgeStateWidget == 'Tge_NoDefinedDate'}
              <TranslationText
                key={`${CNAME}`}
                text={profileTrs?.investor?.tge.date_title_2}
                fallback={'Date to be announced soon'}
              />
            {:else}
              <TranslationText
                key={`${CNAME}`}
                text={profileData?.presaleData.data?.end_date}
                fallback={'-'}
              />
            {/if}
          </p>
        </div>

      <!--
      ▓ NOTE:
      ▓ > token release date set (countdown).
      -->
      {:else}

        <div
          id="countdown-row"
        >
          <!-- eslint-disable-next-line no-unused-vars -->
          {#each { length: 4 } as _,i}
            <div
              class=
              "
              <!---->
              countdown-box
              "
            >
              <p>
                {$scoresProfileInvestorStore.globalTgeReleaseClock?.[i] ?? '00'}d
              </p>
            </div>
          {/each}
        </div>

      {/if}

    </div>

  <!--
  ▓ NOTE:
  ▓ > tokens have been claimed.
  -->
  {:else}
    <div
      id="claimed"
    >
      <p
        class=
        "
        s-14
        w-500
        color-white
        "
      >
        <TranslationText
          key={`${CNAME}`}
          text={profileTrs?.investor?.tge.cta_title_2}
          fallback={'Claimed'}
        />
      </p>
    </div>

  {/if}

</div>

<!--
▓ NOTE:
▓ > (widget) admin development state UI change control panel.
-->
<AdminDevControlPanel
  title='Tokens available on launch date (TGE)'
>

  <!--
  ▓ NOTE:
  ▓ > (select) widget state.
  -->
  <div
    class=
    "
    row-space-out
    "
  >
    <!--
    ▓ NOTE:
    ▓ > (text) target action.
    -->
    <p
      class=
      "
      s-14
      color-black
      "
    >
      <b>[1]</b> Choose <b>Widget State</b>
    </p>

    <!--
    ▓ NOTE:
    ▓ > (action) target select.
    -->
    <select
      id="cars"
      name="cars"
      bind:value={$scoresProfileInvestorStore.tgeStateWidget}
      on:change=
      {
        () =>
        {
          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'Tge'
            , 'set'
          );
          return;
        }
      }
    >
      <option value="Tge_NoDefinedDate">Release date not defined</option>
      <option value="Tge_DateDefined">Release date defined</option>
      <option value="Tge_ClaimAvailable">Ready to claim</option>
      <option value="Tge_Claimed">Claimed</option>
    </select>
  </div>

</AdminDevControlPanel>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investtge⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
    min-height: 229px;

    p#hint
    {
      /* 🎨 style */
      line-height: 20px; /* 142.857% */
      width: unset;
    }

    div#round-info-box-parent
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      padding: 20px;
      border-radius: 4px;
      background: var(--whitev2);
      width: fit-content;
      height: 60px;
    }

    div#countdown-row
    {
      /* 🎨 style */
      display: grid;
      gap: 2px;
      grid-auto-flow: column;
      width: fit-content;

      div.countdown-box
      {
        /* 🎨 style */
        text-align: center;
        padding: 20px 0;
        border-radius: 2px;
        width: 60px;
        height: 60px;
        background-color: var(--whitev2);

        &:first-child
        {
          /* 🎨 style */
          border-radius: 4px 0px 0px 4px;
        }

        &:last-child
        {
          /* 🎨 style */
          border-radius: 0px 4px 4px 0px;
        }

        p
        {
          /* 🎨 style */
          font-size: 16px;
          font-weight: 500;
          color: var(--dark-theme);
        }
      }
    }

    button.btn-primary-v2
    {
      /* 🎨 style */
      width: 96px;
      height: 36px;
    }

    div#claimed
    {
      /* 🎨 style */
      background-color: var(--grey-shade);
      height: 44px;
      padding: 12px 24px 11px 24px;
      border-radius: 8px;
      width: fit-content;
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 560px)
  {
    div#profile⮕w⮕investtge⮕main
    {
      /* 🎨 style */
      height: auto;
      min-height: auto;
      max-height: auto;
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#profile⮕w⮕investtge⮕main
    {
      /* 🎨 style */
      height: 333px;
      min-height: 333px;
      max-height: 333px;

      p#hint
      {
        /* 🎨 style */
        width: 170px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investtge⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 div#round-info-box-parent
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-7-shade);
    }

    &.dark-background-1 div#countdown-row
    {
      div.countdown-box
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1-7-shade);

        p
        {
          /* 🎨 style */
          color: var(--white);
        }
      }
    }

    &.dark-background-1 div#claimed
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);
    }
  }

</style>
