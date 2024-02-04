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
  import { fly } from 'svelte/transition';

  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { copyToClipboard } from '$lib/utils/platform-functions.js';

  import icon_close from '../assets/investor/icon-close-btn.svg';
  import icon_close_dark from '../assets/investor/icon-close-dark-btn.svg';

  import ModalBackdrop from '$lib/components/misc/Modal-Backdrop.svelte';

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
     *  📣 List of wallets to be displayed.
    */
    walletAddressList: string[]
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕wallets-modal⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
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
▓ > (box) main modal
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  in:fly={{ y: 500, duration: 500 }}
  out:fly={{ y: 500, duration: 500 }}
>

  <!--
  ▓ NOTE:
  ▓ > (box) modal top row
  -->
  <div
    id="top-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓ NOTE:
    ▓ > (text) modal
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
        profileTrs.investor?.wallets.title
        ?? 'Investor Wallet Address'
      }
    </p>

    <!--
    ▓ NOTE:
    ▓ > (asset) close icon.
    -->
    <img
      id='close-vector'
      class=
      '
      cursor-pointer
      '
      style=
      '
      {VIEWPORT_TABLET_INIT[1] ? 'top: 16px; right: 16px;' : ''}
      '
      src={$userBetarenaSettings.theme == 'Dark' ? icon_close : icon_close_dark}
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
      alt='close-svg'
      width=18
      height=18
    />

  </div>

  <!--
  ▓ NOTE:
  ▓ > (box) modal middle section
  -->
  <div
    id="middle-box"
  >

    {#each walletAddressList as item}

      <!--
      ▓ NOTE:
      ▓ > (box) wallet address row
      -->
      <div
        class=
        "
        wallet-row
        "
      >
        <!--
        ▓ NOTE:
        ▓ > (text) wallet address (translation)
        -->
        <p
          class=
          "
          s-14
          w-500
          color-black-2
          m-b-3
          text-left
          "
        >
          {
            profileTrs.investor?.wallets.id
            ?? 'Wallet ID'
          }
        </p>

        <!--
        ▓ NOTE:
        ▓ > (box) wallet + copy
        -->
        <div
          class=
          "
          row-space-out
          "
        >
          <!--
          ▓ NOTE:
          ▓ > (text) wallet address
          -->
          <p
            class=
            "
            s-12
            color-grey
            "
          >
            {item}
          </p>

          <!--
          ▓ NOTE:
          ▓ > (text) copy
          -->
          <p
            class=
            "
            s-12
            w-500
            underline
            color-black-2
            cursor-pointer
            "
            on:click={() => { copyToClipboard(item); return; }}
          >
            {
              profileTrs.investor?.wallets.copy
              ?? 'Copy'
            }
          </p>
        </div>

      </div>
    {:else}
      <p
        class=
        "
        s-20
        color-black-2
        "
      >
        Uh-oh! No investment wallets have been found.
      </p>
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

  div#profile⮕w⮕wallets-modal⮕main
  {
    /* 📌 position */
		position: fixed;
    z-index: 10000;
    height: fit-content;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
		/* 🎨 style */
    background-color: var(--white) !important;
		border-radius: 12px 12px 0 0;
		text-align: -webkit-center;
		text-align: -moz-center;
		overflow: hidden;

    div#top-row
    {
      /* 🎨 style */
      padding: 12px 20px;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      height: 70px;
    }

    div#middle-box
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      height: 402px;
      overflow-y: scroll;
      overflow-x: hidden;
      padding-top: 12px;

      &::-webkit-scrollbar
      {
        /* Hide scrollbar for Chrome, Safari and Opera */
        display: none;
      }
      &::-webkit-scrollbar
      {
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      div.wallet-row
      {
        /* 🎨 style */
        padding: 12px 20px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 575px)
  {
    div#profile⮕w⮕wallets-modal⮕main
    {
      /* 📌 position */
      position: fixed;
      z-index: 10000;
      margin: auto;
      width: fit-content;
      width: 92%;
      height: 340px;
      min-height: 340px;
      max-height: 340px;
      right: 0;
      left: 0;
      bottom: 0;
      top: 0;
      /* 🎨 style */
      width: 502px;
      border-radius: 12px;
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕wallets-modal⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1) !important;
    }

    &.dark-background-1 div#middle-box
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }
  }

</style>
