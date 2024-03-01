<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ High Order Component Overview                                                    │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
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

	import sessionStore from '$lib/store/session.js';

  import { removeDiacritics } from '$lib/utils/languages.js';
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
    sportNameDefault: string,
    sportTranslation: string,
    sportValue: string,
    selectedSport: string
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = '<section-scope>⮕<type|w|c>⮕<unique-tag-name>⮕main'
  ;

  let
    sportIcon: string,
    sportLink: string
      = $sessionStore.serverLang == 'en'
        ? `/${removeDiacritics(sportTranslation.toLowerCase())}`
        : `/${$sessionStore.serverLang}/${removeDiacritics(sportTranslation.toLowerCase())}`
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  $:
  IF_R_0
    = selectedSport == sportNameDefault
  ;
  $:
  if (!IF_R_0)
    sportIcon = `/assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}.svg`;
  else
    sportIcon = `/assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}-select.svg`;
  ;

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
        createEventDispatcher()
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
    <p
      class=
      "
      color-white
      s-14
      sport-counter-dark
      "
    >
      {sportValue}
    </p>

  </div>
</a>

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

  div.sports-box
  {
    /* 🎨 style */
		height: 44px;

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
      height: 24px;
    }
  }

</style>
