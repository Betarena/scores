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
  import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import { viewport_change } from '$lib/utils/platform-functions';

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
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
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
    CNAME: string = 'global⮕w⮕platform-alert-container⮕main'
  ;

  let
    /**
     * @description
     *  📣 Wether banner has been toggled or not.
     */
    show: boolean = true
  ;

  $: B_NAV_T = $page.data.B_NAV_T;

  // #endregion ➤ 📌 VARIABLES

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
      [
        VIEWPORT_TABLET_INIT[1],
        VIEWPORT_MOBILE_INIT[1]
      ]
      = viewport_change
        (
          VIEWPORT_TABLET_INIT[0],
          VIEWPORT_MOBILE_INIT[0]
        )
      ;
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<svelte:window
  on:resize=
  {
    () =>
    {
      [
        VIEWPORT_TABLET_INIT[1],
        VIEWPORT_MOBILE_INIT[1]
      ]
      = viewport_change
        (
          VIEWPORT_TABLET_INIT[0],
          VIEWPORT_MOBILE_INIT[0]
        )
      ;
      return;
    }
  }
/>

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

{#if B_NAV_T?.scores_top_bar_messages?.status && show}

  <div
    id={CNAME}
    class:update-z-index={$sessionStore.livescoreShowCalendar && VIEWPORT_MOBILE_INIT[1]}>

    <p
      class=
      "
      s-12
      color-white
      "
    >
      {B_NAV_T?.scores_top_bar_messages?.message}
    </p>

    <!--
    CLOSE ICON
    -->
    <img
      id="close-platform-alert-img"
      src="/assets/svg/alert/close.svg"
      alt="close-vector"
      width=14
      height=14
      on:click={() => {return (show = false)}}
      on:keypress={(e) => { if (e.key === 'Enter') (show = false) }}
    />

  </div>

{/if}

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

	div#global⮕w⮕platform-alert-container⮕main
  {
    /* 📌 position */
		position: relative;
		z-index: 20000;
    /* 🎨 style */
		width: 100%;
		padding: 8px 27px;
		background: #8c8c8c;
		text-align: center;

    &.update-z-index
    {
      /* 📌 position */
      z-index: unset !important;
    }

    img#close-platform-alert-img
    {
      /* 📌 position */
      position: absolute;
      top: 50%;
      right: 16px;
      /* 🎨 style */
      transform: translate(-50%, -50%);
    }
	}

</style>
