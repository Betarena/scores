<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Platform Header Sports Button Component (Child)                           │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
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

	import sessionStore from '$lib/store/session.js';
  import { createEventDispatcher } from 'svelte';

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
     *  📣 (default) sport name.
    */
    sportNameDefault: string,
    /**
     * @description
     *  📣 (default) sport translation.
    */
    sportTranslation: string,
    /**
     * @description
     *  📣 (default) sport value.
    */
    sportValue: string | number,
    /**
     * @description
     *  📣 (default) sport selected.
    */
    selectedSport: string
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = '<section-scope>⮕<type|w|c>⮕<unique-tag-name>⮕main',
    /**
     * @augments EventDispatcher
    */
    dispatch = createEventDispatcher()
  ;

  let
    /**
     * @description
     *  📣 (default) sport icon.
    */
    sportIcon: string
    /**
     * @description
     *  📣 (default) sport link.
    */
    // sportLink: string // this code will be usful when we have more sports options
    //   = $sessionStore.serverLang == 'en'
    //     ? `/${removeDiacritics(sportTranslation.toLowerCase())}`
    //     : `/${$sessionStore.serverLang}/${removeDiacritics(sportTranslation.toLowerCase())}`
  ;
  $: sportLink
      = $sessionStore.serverLang == 'en'
        ? `/scores`
        : `/${$sessionStore.serverLang}/scores`

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
  IF_R_0
    = selectedSport == sportNameDefault
  ;
  $:
  if (!IF_R_0)
    sportIcon = `../assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}.svg`;
  else
    sportIcon = `../assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}-select.svg`;
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<a
  href={sportLink}
>
  <div
    class=
    "
    sports-box
    row-space-out
    "
    on:click=
    {
      () =>
      {
        dispatch
        (
          'closeDropdown',
          {
            selectedSport: sportNameDefault
          }
        );
        return;
      }
    }
    class:selected-sports={selectedSport == sportNameDefault}
  >

    <!--
    ╭─────
    │ > sport image + name
    ╰─────
    -->
    <div
      class=
      "
      row-space-out
      "
      style="width: fit-content;"
    >
      <img
        loading="lazy"
        class=
        "
        m-r-10
        "
        src={sportIcon}
        alt="{sportNameDefault}-img"
        width=20
        height=20
      />
      <p
        class=
        "
        color-white
        s-14
        m-r-10
        capitalize
        "
      >
        {sportTranslation}
      </p>
    </div>

    <!--
    ╭─────
    │ > sport number (or, 'soon')
    ╰─────
    -->
    <span
      class=
      "
      tag
      color-white
      s-12
      sport-counter-dark
      "
    >
      {sportValue}
    </span>

  </div>
</a>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  div.sports-box
  {
    /* 🎨 style */

    &:hover p.capitalize
    {
      /* 🎨 style */
      color: var(--primary) !important;
    }

    & .sport-counter-dark
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);
      padding: 3px 8px;
      border-radius: 20px;
      display: flex;
      align-items: center;
    }
    .tag {
      font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%
    }
  }

</style>
