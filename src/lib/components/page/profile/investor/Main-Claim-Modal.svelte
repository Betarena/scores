<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: | Access snippets for '<script> [..] </script>' those found in           │
|         | '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';

	import ModalBackdrop from '$lib/components/misc/modal/Modal-Backdrop.svelte';

	import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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
     * @description
     *  📣 makes use of parent 📱 MOBILE viewport state.
    */
    VIEWPORT_MOBILE_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣 makes use of parent 💻 TABLET viewport state.
    */
    , VIEWPORT_TABLET_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣 target amount to be claimed to be displayed on `modal`.
    */
    , amount: number = 0
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investor-modal-claim⮕main'
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = VIEWPORT_MOBILE_INIT_PARENT
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = VIEWPORT_TABLET_INIT_PARENT
    /**
     * @description
     *  📣
    */
    , dispatch: EventDispatcher < any > = createEventDispatcher()
  ;

  /**
   * @description
   *  📣 Available `translations`.
  */
  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🔹 HELPER
   * @description
   * 📌 Logic for modal transition logic for mobile devices only.
   * @param
   * { any } node - Target node to apply transition to.
   * @param
   * { any } options - Target transition options.
   */
  function customFlyIn
  (
    node: any,
    options: any
  ): any
  {
    if (VIEWPORT_MOBILE_INIT[1])
      return options.fn(node, options);
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: | Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    |
│         │ imported from './static/app.css'                                       |
│ ➤ HINT: | access custom Betarena Scores VScode Snippets by typing emmet-like     |
|         | abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<ModalBackdrop
  on:closeModal=
  {
    () =>
    {
      $sessionStore.currentActiveModal = null;
      return;
    }
  }
/>

<!--
▓ NOTE:
▓ > modal contents
-->
<div
  class=
  "
  {CNAME}
  "
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  in:customFlyIn={{ fn: fly, duration: 500, y: 200 }}
  out:customFlyIn={{ fn: fly, duration: 500, y: 200 }}
>

  <!--
  ▓ NOTE:
  ▓ > (text) modal description
  -->
  <p
    class=
    "
    s-16
    w-500
    text-left
    color-black-2
    <!---->
    amount-text
    "
  >
    {
      @html
      profileTrs.investor?.presale.claim_confirmation.message
        .replace('$$$', `<span> ${amount.toString()} BTA </span>`)
      ?? `Confirm that you wish to claim your ${amount.toString()} BTA and transfer them to your main wallet.`
    }
  </p>

  <!--
  ▓ NOTE:
  ▓ > (action) modal actions
  -->
  <div
    class=
    "
    row-space-end
    "
    class:m-t-40={VIEWPORT_MOBILE_INIT[1]}
  >

    <!--
    ▓ NOTE:
    ▓ > (action) cancel
    -->
    <button
      class=
      "
      btn-hollow
        v2
      m-r-8
      color-grey
        dark-white-v1
      "
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
    >
      {
        profileTrs.investor?.presale.claim_confirmation.option_2
        ?? 'Cancel'
      }
    </button>

    <!--
    ▓ NOTE:
    ▓ > (action) process claim
    -->
    <button
      class=
      "
      btn-primary-v2
      "
      on:click=
      {
        () =>
        {
          dispatch('confirmEntry');
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
    >
      {
        profileTrs.investor?.presale.claim_confirmation.option_1
        ?? 'Confirm'
      }
    </button>

  </div>

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: | auto-fill/auto-complete iniside <style> for var()                      │
|         | values by typing/CTRL+SPACE                                            │
│ ➤ HINT: | access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div.profile⮕w⮕investor-modal-claim⮕main
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

    p.amount-text
    {
      /* 🎨 style */
      :global
      {
        span
        {
          /* 🎨 style */
          color: var(--primary);
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 726px)
  {

    div.profile⮕w⮕investor-modal-claim⮕main
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
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div.profile⮕w⮕investor-modal-claim⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme) !important;
  }

</style>
