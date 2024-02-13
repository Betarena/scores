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
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

  import icon_close from '../assets/investor/icon-close-btn.svg';
  import icon_close_dark from '../assets/investor/icon-close-dark-btn.svg';

	import ModalBackdrop from '$lib/components/misc/modal/Modal-Backdrop.svelte';

	import type { B_USRG_D } from '@betarena/scores-lib/types/types.misc.userguide.js';

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

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'global⮕w⮕termsandcond⮕profile⮕main'
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 581, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 821, true ]
  ;

  let
    /**
     * @augments B_USRG_D
    */
    DUserData: B_USRG_D
  ;

  $: DUserData = $page.data.B_USRG_D;

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
   *  🔹 HELPER
   * @description
   *  📌 Logic for modal transition logic for mobile devices only.
   * @param { any } node
   *  Target node to apply transition to.
   * @param { any } options
   *  Target transition options.
   * @returns { any }
   */
  function customAnimation
  (
    node: any,
    options: any
  ): any
  {
    if (VIEWPORT_TABLET_INIT[1])
      return options.fn(node, { y: 1500, duration: 500 });
    else
      return options.fn(node, { x: 850, duration: 750 });
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Triggers viewport changes.
   * @returns { void }
   */
  function resizeAction
  (
  ): void
  {
    [
      VIEWPORT_TABLET_INIT[1],
      VIEWPORT_MOBILE_INIT[1]
    ] = viewport_change
    (
      VIEWPORT_TABLET_INIT[0],
      VIEWPORT_MOBILE_INIT[0]
    );
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📌 Local component wrapper
   * (⚡️) `window` (resize-change) listener.
   * @returns { void }
   */
  function addEventListeners
  (
  ): void
  {
    // ### NOTE:
    // ### listen to 'resize'.
    window.addEventListener
    (
      'resize',
      function ()
      {
        resizeAction();
      }
    );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    () =>
    {
      // ### IMPORTANT
      resizeAction();
      addEventListeners();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
▓ > terms and conditions (main) component
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  in:customAnimation={{ fn: fly }}
  out:customAnimation={{ fn: fly }}
>

  <!--
  ▓ NOTE:
  ▓ > main scrollable box.
  -->
  <div
    id="{CNAME}⮕inner"
  >

    <!--
    ▓ NOTE:
    ▓ > close icon.
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
      alt='close-svg'
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
      width=18
      height=18
    />

    <!--
    ▓ NOTE:
    ▓ > title
    -->
    <div
      id="{CNAME}⮕title"
      class=
      "
      {!VIEWPORT_TABLET_INIT[1] ? 'm-b-35 global s-32 lh-125' : ''}
      {VIEWPORT_TABLET_INIT[1] ? 'global s-28 lh-128 text-center m-b-24' : ''}
      "
    >
      {@html DUserData.content.terms ?? ''}
    </div>

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

  @import '../../../../../../static/app.scss';

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	div#global⮕w⮕termsandcond⮕profile⮕main
  {
    /* 📌 position */
    top: 7.5%;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    position: fixed;
    z-index: 100000;
    /* 🎨 style */
    background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px 12px 0 0;
    width: 100%;
    overflow: scroll;
    overflow-x: hidden;
    padding: 48px 24px;

    &::-webkit-scrollbar
    {
      display: none !important;
    }

    img#close-vector
    {
      /* 📌 position */
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 400000002;
    }

    &⮕inner
    {
      /* 🎨 style */
      display: grid;
      overflow-x: hidden;
      max-height: 100%;
      overflow-y: scroll;
      padding-bottom: 85px;
      /* 💠 scrollbar */
      /* IE and Edge */ -ms-overflow-style: none !important;
      /* Firefox */ scrollbar-width: none !important;

      &::-webkit-scrollbar
      {
        display: none !important;
      }
    }

    :global
    {
      h1,h2,h3
      {
        /* 🎨 style */
        @extend .s-32 !optional;
        @extend .color-black-2 !optional;
        @extend .text-left !optional;
        margin-top: 0;
        margin-bottom: 0;
      }

      a
      {
        /* 🎨 style */
        color: #f5620f !important;
        width: fit-content !important;
        margin: 0;
        display: initial;
      }

      p
      {
        /* 🎨 style */
        @extend .s-16 !optional;
        @extend .m-t-30 !optional;
        @extend .m-b-24 !optional;
        @extend .color-black-2 !optional;
        @extend .text-left !optional;
      }
    }
	}

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 581px)
  {
    div#global⮕w⮕termsandcond⮕profile⮕main
    {
      /* 🎨 style */
      padding: 48px;

      &⮕bottom
      {
        /* 🎨 style */
        padding: 32px 48px;
        height: 84px;
      }
    }
  }

	@media only screen
  and (min-width: 821px)
  {
    div#global⮕w⮕termsandcond⮕profile⮕main
    {
      /* 📌 position */
      top: 0;
      bottom: 0;
      right: 0;
      left: unset;
      margin: unset;
      /* 🎨 style */
      width: 45vw;
      border-radius: 0;
    }
  }

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#global⮕w⮕termsandcond⮕profile⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme) !important;
    }

    &.dark-background-1 :global
    {
      h1,h2,h3
      {
        /* 🎨 style */
        @extend .color-white !optional;
      }

      p
      {
        /* 🎨 style */
        @extend .color-white !optional;
      }
    }
  }

</style>
