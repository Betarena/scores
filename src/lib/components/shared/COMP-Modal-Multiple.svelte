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

  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';

	import type { B_C_COMP_DATA_Prediction_Group } from '@betarena/scores-lib/types/_HASURA_.js';

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
    /** @description competition (main) | amount entry fee */
    balanceDeductAmount: number,
    /** @description competition (main) | imposed geo-location restriction */
    geoLocationRestrictions: string[],
    /** @description target casted vote on competition by user */
    targetVote: B_C_COMP_DATA_Prediction_Group
  ;

	const
    dispatch: EventDispatcher < any > = createEventDispatcher()
  ;

  let
    /** @description competition (main) | view type */
    modalViewType: 'confirm' | 'insufficient' | 'geo-restriction' | 'not-authenticated' = 'confirm'
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
   *  📌 Logic for modal closure and event dispatcher.
   * @returns { void }
   */
  function closeModal
  (
  ): void
  {
    dispatch('closeModal');
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Logic for modal closure and event dispatcher, for entry confirmation.
   * @returns { void }
   */
  function confirmEntry
  (
  ): void
  {
    dispatch('confirmEntry');
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Logic for modal transition logic for mobile devices only.
   * @param { any } node
   *  Target node to apply transition to.
   * @param { any } options
   *  Target transition options.
   * @returns { any }
   */
  function customFlyIn
  (
    node: any,
    options: any
  ): any
  {
		if (isViewMobile)
			return options.fn(node, options);
    ;
	}

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'logic' that should run     ▓▓
  // ▓▓ immediately and/or reactively for 'this' .svelte file is ran.   ▓▓
  // ▓▓ WARNING:                                                        ▓▓
  // ▓▓ ❗️ Can go out of control.                                       ▓▓
  // ▓▓ (a.k.a cause infinite loops and/or cause bottlenecks).          ▓▓
  // ▓▓ Please keep very close attention to these methods and           ▓▓
  // ▓▓ use them carefully.                                             ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  // ▓▓ NOTE:
  // ▓▓ update / mutate `modalViewType` as necessary.
  $: if (($userBetarenaSettings?.user?.scores_user_data?.main_balance ?? 0) < balanceDeductAmount)
    modalViewType = 'insufficient';
  ;
  $: if (geoLocationRestrictions?.includes($userBetarenaSettings?.country_bookmaker))
    modalViewType = 'geo-restriction';
  ;
  $: if ($userBetarenaSettings?.user == undefined)
    modalViewType = 'not-authenticated';
  ;

  // ▓▓ TODO: DOC:
  $: if_R_0 =
    ($userBetarenaSettings?.user?.scores_user_data?.main_balance ?? 0) >= balanceDeductAmount
    && !geoLocationRestrictions?.includes($userBetarenaSettings?.country_bookmaker)
    && $userBetarenaSettings?.user != undefined
  ;
  $: if (if_R_0)
    modalViewType = 'confirm';
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
MODAL | BACKGROUND BLUR
-->
<div
	in:fade
	id="background-modal-blur"
	on:click={() => closeModal()}
/>

<!--
MODAL - DYNAMIC
-->
<div
  class=
  "
  competition-modal
  "
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  in:customFlyIn={{ fn: fly, duration: 500, y: 200 }}
  out:customFlyIn={{ fn: fly, duration: 500, y: 200 }}
>

  <!--
  MODAL | COMPETITION CONFIRM
  -->
  {#if modalViewType == 'confirm'}

    <!--
    MODAL ENTRY TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      color-black-2
      "
    >
      Confirm that you wish to Join <span class="capitalize">{targetVote}</span> and be charged for
      <span class="color-primary">{balanceDeductAmount} BTA</span> from your current balance.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class=
      "
      row-space-end
      "
      class:m-t-40={isViewMobile}
    >

      <button
        on:click={() => closeModal()}
        class=
        "
        btn-hollow v2
        m-r-8
        color-grey dark-white-v1
        "
      >
        Cancel
      </button>

      <button
        on:click={() => confirmEntry()}
        class=
        "
        btn-primary-v2
        "
      >
        Confirm
      </button>

    </div>

  {/if}

  <!--
  MODAL | COMPETITION NOT ENOUGH FUNDS
  -->
  {#if modalViewType == 'insufficient'}

    <!--
    MODAL TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      color-black-2
      "
    >
      You do not have enough balance to participate on this competition.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class:row-space-out={!isViewMobile}
    >

      <!--
      EXTRA TEXT
      -->
      <p
        class=
        "
        s-12
        color-grey-v2 grey-v1
        "
        class:m-t-15={isViewMobile}
      >
        Please deposit to continue and be able to participate.
      </p>

      <!--
      MODAL ACTION BUTTONS
      -->
      <div
        class=
        "
        row-space-end
        width-auto
        "
        class:m-t-40={isViewMobile}
      >

        <button
          on:click={() => closeModal()}
          class=
          "
          btn-hollow v2
          m-r-8
          color-grey dark-white-v1
          "
        >
          Cancel
        </button>

        <a
          href="/u/deposit/{$userBetarenaSettings.lang}"
          title='Go to Deposit Page'
        >
          <button
            on:click={() => closeModal()}
            class=
            "
            btn-primary-v2
            "
          >
            Deposit
          </button>
        </a>

      </div>

    </div>

  {/if}

  <!--
  MODAL | COMPETITION NOT GEO AVAILABLE
  -->
  {#if modalViewType == 'geo-restriction'}

    <!--
    MODAL TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      color-black-2
      "
    >
      The competitions are not yet available at your Geo location.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class:row-space-out={!isViewMobile}
    >

      <!--
      EXTRA TEXT
      -->
      <p
        class=
        "
        s-12
        color-grey-v2 grey-v1
        "
        class:m-t-15={isViewMobile}
      >
        We will be launching new competitions
        that will be available at your country. Be patient, thanks.
      </p>

      <!--
      MODAL ACTION BUTTONS
      -->
      <div
        class=
        "
        row-space-end
        width-auto
        "
        class:m-t-40={isViewMobile}
      >

        <button
          on:click={() => closeModal()}
          class=
          "
          btn-hollow v2
          m-r-8
          color-grey dark-white-v1
          "
        >
          Close
        </button>

      </div>

    </div>

  {/if}

  <!--
  MODAL | NOT AUTHENTICATED / SIGNED IN
  -->
  {#if modalViewType == 'not-authenticated'}

    <!--
    MODAL TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      color-black-2
      "
    >
      Uh-oh! It looks like you are not a signed in.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class:row-space-out={!isViewMobile}
    >

      <!--
      EXTRA TEXT
      -->
      <p
        class=
        "
        s-12
        color-grey-v2 grey-v1
        "
        class:m-t-15={isViewMobile}
      >
        Please sign in to your Betarena Account and/or register to participate in competitions.
      </p>

      <!--
      MODAL ACTION BUTTONS
      -->
      <div
        class=
        "
        row-space-end
        width-auto
        "
        class:m-t-40={isViewMobile}
      >

        <button
          on:click={() => closeModal()}
          class=
          "
          btn-hollow v2
          m-r-8
          color-grey dark-white-v1
          "
        >
          Close
        </button>

        <button
          on:click={() => $sessionStore.auth_show = true}
          on:click={() => closeModal()}
          class=
          "
          btn-primary-v2
          "
        >
          Register
        </button>

      </div>

    </div>

  {/if}

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

  div#background-modal-blur
  {
    /* 📌 position */
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 4000;
    /* 🎨 style */
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  div.competition-modal
  {
    /* 📌 position */
		position: fixed;
		z-index: 10000;
		right: 0;
		left: 0;
		bottom: 0;
    /* 🎨 style */
		width: 100%;
    /* NOTE:
    strangely, having 'fit-content' enabled, hides the rest of
    modal content, except of first line. */
		/* height: fit-content; */
		background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px 12px 0 0;
		padding: 20px;
		overflow: hidden;
    /* 🛝 layout */
    display: grid;
    align-content: space-between;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS       ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 726px)
  {

    div.competition-modal
    {
      /* 📌 position */
      top: 0;
      margin: auto;
      /* 🎨 style */
      width: 480px;
      max-width: 480px;
      height: 188px;
      max-height: 188px;
		  border-radius: 12px;
    }

  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div.competition-modal.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme) !important;
  }

</style>
