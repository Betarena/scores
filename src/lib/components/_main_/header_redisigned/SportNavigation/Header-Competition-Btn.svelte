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
│ Scores Platform Header Competition Button Component (Child)                      │
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
     *  📣 default competition name
     */
    competitionNameDefault: string,
    /**
     * @description
     *  📣 translation competition name
     */
    competitionTranslation: string,
    /**
     * @description
     *  📣 target competition option
     */
    selectedCompetition: string = 'predictor',
    /**
     * @description
     *  📣 translation competition lobby
     */
    navUrl: string
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME = 'header⮕c⮕competition-btn⮕main'
  ;

  let
    /** @description TODO: DOC: */
    sportIcon: string
  ;

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

  $: IF_R_0
    = selectedCompetition == competitionNameDefault
  ;
  $: if (!IF_R_0)
    sportIcon = 'https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fcompetitions%2FTarget.svg?alt=media&token=13570fcf-ec34-48dc-b612-06e97102a3c6';
  else
    sportIcon = 'https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fcompetitions%2FTarget.svg?alt=media&token=13570fcf-ec34-48dc-b612-06e97102a3c6';
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
  href={navUrl}
>
  <div
    class=
    "
    row-space-out
    cursor-pointer
    {CNAME}
    "
    class:selected-sports={selectedCompetition == competitionNameDefault}
  >

    <!--
    ╭─────
    │ > Competition Image + Name
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
        alt="{competitionNameDefault}-img"
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
        {competitionTranslation}
      </p>
    </div>

    <!--
    ╭─────
    │ > Competition Amount
    ╰─────
    -->
    <p
      class=
      "
      color-white
      s-14
      competition-count-dark
      "
    >
      {$sessionStore.competitionsOpenNum ?? 0}
    </p>

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

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div.header⮕c⮕competition-btn⮕main
  {
    /* 🎨 style */
		height: 44px;

    &:hover p.capitalize
    {
      /* 🎨 style */
      color: var(--primary) !important;
    }
    & .competition-count-dark
    {
      /* 🎨 style */
      height: 24px;
      padding: 3px 8px;
      background-color: var(--dark-theme-1);
      border-radius: 20px;
    }
  }

</style>
