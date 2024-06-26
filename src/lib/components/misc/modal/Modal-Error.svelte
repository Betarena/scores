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

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';

  import icon_tx_error from './assets/icon-error.svg';

  import ModalBackdrop from '$lib/components/misc/modal/Modal-Backdrop.svelte';
  import TranslationText from '../Translation-Text.svelte';

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
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'general⮕w⮕modal-error'
  ;

  let
    /**
     * @description
     *  📣 Icon states.
     */
    iconState: string = icon_tx_error
  ;

  // #endregion ➤ 📌 VARIABLES

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
  ╭─────
  │ NOTE:
  │ > modal image
  ╰─────
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
  ╭─────
  │ NOTE:
  │ > modal text
  ╰─────
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
    <TranslationText
      key={`${CNAME}/modal-error`}
      text={null}
      fallback={'Uh-oh! An error occurred.'}
    />
  </p>

  <!--
  ╭─────
  │ NOTE:
  │ > modal button
  ╰─────
  -->
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
        return;
      }
    }
  >
    <TranslationText
      key={`${CNAME}/modal-error`}
      text={null}
      fallback={'Ok'}
    />
  </button>

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

	div#general⮕w⮕modal-error
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
    div#general⮕w⮕modal-error
    {
      width: 328px;
    }
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#general⮕w⮕modal-error
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme) !important;
    }
	}

</style>
