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
│ Scores Admin Dev Info                                                            │
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

	import { scoresAdminStore } from '$lib/store/admin.js';
	import sessionStore from '$lib/store/session.js';
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

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME = 'developer-admin-infobox'
  ;

  $: ({ currentPageRouteId, serverLang, globalState } = { ...$sessionStore });
  $: ({ country_bookmaker, theme, lang } = { ...$userBetarenaSettings } );
  $: ({ lang: userLang } = { ...$userBetarenaSettings.user?.scores_user_data } );

  // #endregion ➤ 📌 VARIABLES

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

<div
  id={CNAME}
>

  <!--
  ╭─────
  │ > [I] Active Firebase Listener(s)
  ╰─────
  -->
  <div
    class=
    "
    grid-box
    "
  >
    <p
      class=
      "
      title
      "
    >
      Active Listeners:
    </p>

    <p>
      Firebase Event Listeners:
      {$sessionStore.firebaseListeners.length}
    </p>

    <p>
      GraphQl WebSocket Listeners:
      {$sessionStore.grapqhQlWebSockets.length}
    </p>
  </div>

  <!--
  ╭─────
  │ > [I] Language
  ╰─────
  -->
  <div
    class=
    "
    grid-box
    "
  >
    <p
      class=
      "
      title
      "
    >
      Language
    </p>

    <p>
      Server (lang) :|: {serverLang}
      <br>
      Visitor (lang) :|: {lang}
      <br>
      User (lang) :|: {userLang}
    </p>

    <div>
      <p
        class=
        "
        color-white
        "
      >
        Text(s) with no translation:
        {$scoresAdminStore.termsWithoutTranslation.size}
      </p>

      {#each [...$scoresAdminStore.termsWithoutTranslation] as item}
        <p
          class=
          "
          color-white
          "
        >
          - {item}
        </p>
      {/each}
    </div>
  </div>

  <!--
  ╭─────
  │ > [I] Navigation
  ╰─────
  -->
  <div
    class=
    "
    grid-box
    "
  >
    <p
      class=
      "
      title
      "
    >
      Navigation
    </p>

    <p>
      currentPageRouteId: {currentPageRouteId}
    </p>
  </div>

  <!--
  ╭─────
  │ > [I] Information on variable store
  ╰─────
  -->
  <div
    class=
    "
    grid-box
    "
  >
    <p
      class=
      "
      title
      "
    >
      Miscellenous
    </p>

    <p>
      country_bookmaker: {country_bookmaker}
      <br>
      theme: {theme}
    </p>
  </div>

  <!--
  ╭─────
  │ > [I] Session (global) state
  ╰─────
  -->
  <div
    class=
    "
    grid-box
    "
  >
    <p
      class=
      "
      title
      "
    >
      Global State(s): {globalState.size}
    </p>

    {#each [...globalState] as item}
      <p>
        - {item}
      </p>
    {/each}
  </div>

</div>

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

  div#developer-admin-infobox
  {
    /* 🎨 style */
		width: 100%;
		background: blue;
		padding: 20px;
		overflow: hidden;
    /* 🛝 layout */
    display: grid;
    align-content: space-between;
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    div.grid-box
    {
      /* 🎨 style */
      padding: 15px;

      p
      {
        /* 🎨 style */
        color: white;

        &.title
        {
          /* 🎨 style */
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
  }

</style>
