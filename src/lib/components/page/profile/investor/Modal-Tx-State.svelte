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

  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import icon_tx_complete from '../assets/tx-loader/tx-complete.svg';
  import icon_tx_error from '../assets/tx-loader/tx-error.svg';
  import icon_tx_processing from '../assets/tx-loader/tx-load-anim.svg';

	import userBetarenaSettings from '$lib/store/user-settings.js';

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
    /** @augments IStateWidget */
    stateWidget: IStateWidget
  ;

  type IStateWidget = 'In Progress' | 'Completed' | 'Error' | null;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
    , dispatch: EventDispatcher<any> = createEventDispatcher()
  ;

  let
    /** @description */
    iconState: string
  ;

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
   * @description
   */
  function closeModal
  (
  ): void
  {
    dispatch
    (
      'closeDropdown'
    );
    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $:
  if (stateWidget == 'In Progress')
    iconState = icon_tx_processing
  else if (stateWidget == 'Completed')
    iconState = icon_tx_complete
  else if (stateWidget == 'Error')
    iconState = icon_tx_error;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
	id="background-modal-blur"
	in:fade
/>

<div
  id="modal-delete-box"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  ▓ NOTE:
  ▓ > modal image
  -->
  <img
    id=''
    title=''
    alt=''
    src={iconState}
    loading='lazy'
    width=48
    height=48
  />

  <!--
  ▓ NOTE:
  ▓ > modal text
  -->
  <p
    class=
    "
    s-16
    color-white
    w-500
    m-t-20
    "
  >
    {#if stateWidget == 'In Progress'}
      Transfer is processign wait
      for confirmation...
    {:else if stateWidget == 'Completed'}
      Transfer is complete
    {:else if stateWidget == 'Error'}
      Transfer incomplete.
    {/if}
  </p>

  <!--
  ▓ NOTE:
  ▓ > modal button
  -->
  {#if ['Completed', 'Error'].includes(stateWidget ?? '')}

    <button
      class=
      "
      btn-primary-v2
      m-t-25
      "
      on:click={() => {return closeModal()}}
    >
      Ok
    </button>

  {/if}

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

	div#modal-delete-box
  {
		/* 📌 position */
		position: fixed;
		z-index: 10000;
		margin: auto;
		width: fit-content;
		width: 92%;
		height: fit-content;
		right: 0;
		left: 0;
		bottom: 0;
		top: 0;
		/* 🎨 style */
    background-color: var(--dark-theme) !important;
		border-radius: 12px;
		padding: 20px;
    padding-top: 45px;
		text-align: -webkit-center;
		text-align: -moz-center;
		overflow: hidden;
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	@media only screen
  and (min-width: 575px)
  {
		div#modal-delete-box
    {
			width: 328px;
    }
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#modal-delete-box
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme) !important;
		}
	}

</style>
