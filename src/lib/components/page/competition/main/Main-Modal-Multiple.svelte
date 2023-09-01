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

  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description competition (main) - view type */
    viewType: 'confirm' | 'insufficient' | 'geo-restriction' | 'not-authenticated',
    /** @description competition (main) - amount entry fee */
    balanceDeductAmount: number
  ;

	const
    dispatch: EventDispatcher < any > = createEventDispatcher()
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🔹 HELPER
   *
   * @description
   * 📌 Logic for modal closure and event dispatcher.
   *
   * @returns
   * `void`.
   */
  function closeModal
  (
  ): void
  {
    dispatch('closeModal');
  }

  /**
   * @summary
   * 🔹 HELPER
   *
   * @description
   * 📌 Logic for modal closure and event dispatcher, for entry confirmation.
   */
  function confirmEntry
  (
  ): void
  {
    dispatch('confirmEntry');
  }

  // #endregion ➤ 🛠️ METHODS

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
MODAL | BACKGROUND BLUR
-->
<div
	in:fade
	id="background-modal-blur"
	on:click={() => closeModal()}
/>

<!--
MODAL | COMPETITION CONFIRM
-->
{#if viewType == 'confirm'}

  <div
    id="auth-alert-box"
  >

    <!--
    MODAL ENTRY TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      "
    >
      Confirm that you wish to Join Yes and be charged for
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
    >

      <button
        on:click={() => closeModal()}
        class=
        "
        btn-hollow
        m-r-8
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

  </div>

{/if}

<!--
MODAL | COMPETITION NOT ENOUGH FUNDS
-->
{#if viewType == 'insufficient'}

  <div
    id="auth-alert-box"
  >

    <!--
    MODAL TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      "
    >
      You do not have enough balance to participate on this competition.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class=
      "
      row-space-out
      "
    >

      <!--
      EXTRA TEXT
      -->
      <p
        class=
        "
        s-12
        color-grey
        "
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
      >

        <button
          on:click={() => closeModal()}
          class=
          "
          btn-hollow
          m-r-8
          "
        >
          Cancel
        </button>

        <button
          on:click={() => closeModal()}
          class=
          "
          btn-primary-v2
          "
        >
          Deposit
        </button>

      </div>

    </div>

  </div>

{/if}

<!--
MODAL | COMPETITION NOT GEO AVAILABLE
-->
{#if viewType == 'geo-restriction'}

  <div
    id="auth-alert-box"
  >
    <!--
    MODAL TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      "
    >
      The competitions are not yet available at your Geo location.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class=
      "
      row-space-out
      "
    >

      <!--
      EXTRA TEXT
      -->
      <p
        class=
        "
        s-12
        color-grey
        "
      >
        We will be launching new competitions
        that will be available at your country. Be patient, thanks.
      </p>

      <!--
      MODAL ACTION BUTTONS
      -->
      <button
        on:click={() => closeModal()}
        class=
        "
        btn-hollow
        m-r-8
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
{#if viewType == 'not-authenticated'}

  <div
    id="auth-alert-box"
  >

    <!--
    MODAL TEXT
    -->
    <p
      class=
      "
      s-16
      w-500
      text-left
      "
    >
      Uh-oh! It looks like you are not a signed in.
    </p>

    <!--
    MODAL ACTION BUTTONS
    -->
    <div
      class=
      "
      row-space-out
      "
    >

      <!--
      EXTRA TEXT
      -->
      <p
        class=
        "
        s-12
        color-grey
        "
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
      >

        <button
          on:click={() => closeModal()}
          class=
          "
          btn-hollow
          m-r-8
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

  </div>

{/if}

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

  div#auth-alert-box
  {
    /* 📌 position */
		position: fixed;
		z-index: 10000;
		margin: auto;
		right: 0;
		left: 0;
		bottom: 0;
		top: 0;
    /* 🎨 style */
		width: 92%;
		width: fit-content;
		height: fit-content;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
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

    div#auth-alert-box
    {
      /* 🎨 style */
      width: 480px;
      max-width: 480px;
      height: 188px;
      max-height: 188px;
    }

  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

</style>
