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

	import { createEventDispatcher, type EventDispatcher } from 'svelte';

	import { scoresAdminStore } from '$lib/store/admin.js';
	import sessionStore from '$lib/store/session.js';

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
     *  📣 Target `admin` control title.
    */
    title: string
    /**
     * @description
     *  📣 Wether target **parent** `widget` has underwent **admin mutation**.
    */
    , mutated: boolean = false
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /**
     * @augments EventDispatcher
    */
    , dispatch: EventDispatcher<any> = createEventDispatcher()
  ;

  let
    /**
     * @description
     *  📣 State for `selected`.
    */
    isSelected: boolean = false
  ;

  $: ({ admin } = $scoresAdminStore);
  $: ({ currentAdminToggle } = $sessionStore);

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

  $: if (currentAdminToggle != title) isSelected = false;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
▓ > admin development toggle component.
-->
{#if admin}
  <div
    class=
    "
    row-space-end
    <!---->
    developer-action-box
    "
  >

    {#if mutated}
      <!--
      ▓ NOTE:
      ▓ > toggle mutated widget factory reset.
      -->
      <div
        class=
        "
        cursor-pointer
        <!---->
        developer-factory-reset-widget
        "
        on:click=
        {
          () =>
          {
            dispatch('reset');
            return;
          }
        }
      >
        <p
          class=
          "
          s-14
          color-black
          bold
          "
        >
          X
        </p>
      </div>

      <!--
      ▓ NOTE:
      ▓ > mutated widget badge.
      -->
      <div
        class=
        "
        developer-widget-mutation-badge
        "
      >
        <p
          class=
          "
          s-14
          color-white
          bold
          "
        >
          M
        </p>
      </div>
    {/if}

    <!--
    ▓ NOTE:
    ▓ > toggle development control-panel.
    -->
    <div
      class=
      "
      cursor-pointer
      <!---->
      developer-button
      "
      on:click=
      {
        () =>
        {
          isSelected = !isSelected;
          if (isSelected)
            $sessionStore.currentAdminToggle = title;
          else
            $sessionStore.currentAdminToggle = null;
          return;
        }
      }
      class:isSelected={isSelected && currentAdminToggle == title}
    >
      <img
        id=''
        src='/assets/svg/icon-dev-toggle.svg'
        alt='dev-toggle-icon'
        title='Widget Dev States Toggle'
        loading='lazy'
      />
    </div>
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

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div.developer-action-box
  {
    /* 📌 position */
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 10000000;

    div.developer-factory-reset-widget
    {
      /* 🎨 style */
      background-color: #FFFFFF;
      padding: 2.5px 0;
      text-align: center;
      width: 26px;
      height: 26px;
    }

    div.developer-widget-mutation-badge
    {
      /* 🎨 style */
      background-color: #FF0000;
      padding: 2.5px 0;
      text-align: center;
      width: 26px;
      height: 26px;
    }

    div.developer-button
    {
      /* 🎨 style */
      background-color: #EBFF00;
      padding: 5px;
      width: 26px;
      height: 26px;

      &.isSelected
      {
        /* 🎨 style */
        background-color: #1C88EC;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.43) inset;
      }
    }

    & div:first-child
    {
      /* 🎨 style */
      border-radius: 2.5px 0 0 2.5px;
    }

    & div:last-child
    {
      /* 🎨 style */
      border-radius: 0 2.5px 2.5px 0;
    }
  }

</style>
