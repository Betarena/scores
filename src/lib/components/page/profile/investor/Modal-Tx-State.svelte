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

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';

  import icon_tx_complete from '../assets/tx-loader/tx-complete.svg';
  import icon_tx_error from '../assets/tx-loader/tx-error.svg';
  import icon_tx_processing from '../assets/tx-loader/tx-load-anim.svg';

  import ModalBackdrop from '$lib/components/misc/modal/Modal-Backdrop.svelte';
  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

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
     * @augments IStateWidget
     */
    stateWidget: IStateWidget
    /**
     * @description
     *  📣 Target deposit amount.
     */
    , depositAmount: number
  ;

  type IStateWidget =
    'In Progress'
    | 'Completed'
    | 'Error'
    | 'ErrorBalance'
    | null
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕modal-tx-state'
  ;

  let
    /**
     * @description
     *  📣 Target `icon` element.
     */
    iconState: string
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;

  // #endregion ➤ 📌 VARIABLES

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
  else if (stateWidget == 'Error' || stateWidget == 'ErrorBalance')
    iconState = icon_tx_error;
  //

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

<ModalBackdrop />

<div
  id={CNAME}
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
      <TranslationText
        key={'profile/investor/invest-box/tx-modal/in-progress'}
        text={profileTrs?.investor?.popup_transfer.message_1}
        fallback={'Transfer is processign wait for confirmation...'}
      />
    {:else if stateWidget == 'Completed'}
      <TranslationText
        key={'profile/investor/invest-box/tx-modal/completed'}
        text={profileTrs?.investor?.popup_transfer.message_2}
        fallback={'Transfer is complete'}
      />
    {:else if stateWidget == 'Error'}
      <TranslationText
        key={'profile/investor/invest-box/tx-modal/error'}
        text={profileTrs?.investor?.popup_transfer.message_3}
        fallback={'Transfer incomplete.'}
      />
    {:else if stateWidget == 'ErrorBalance'}
      <TranslationText
        key={'profile/investor/invest-box/tx-modal/error-balance'}
        text=
        {
          profileTrs?.investor?.invest_box.minimum_amount_request
            .replace('XXX', depositAmount.toString())
        }
        fallback=
        {
          'To participate in the private presale of BTA, you need to make a minimum investment of XXX USD.'
            .replace('XXX', depositAmount.toString())
        }
      />
    {/if}
  </p>

  <!--
  ▓ NOTE:
  ▓ > modal button
  -->
  {#if ['Completed', 'Error', 'ErrorBalance'].includes(stateWidget ?? '')}

    <button
      class=
      "
      btn-primary-v2
      m-t-25
      "
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          if (stateWidget == 'Completed')
            window.location.reload();
          return;
        }
      }
    >
      <TranslationText
        key={'profile/investor/invest-box/tx-modal/ok'}
        text={null}
        fallback={'Ok'}
      />
    </button>

  {/if}

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

	div#profile⮕w⮕modal-tx-state
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
		div#profile⮕w⮕modal-tx-state
    {
			width: 328px;
    }
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕modal-tx-state
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme) !important;
		}
	}

</style>
