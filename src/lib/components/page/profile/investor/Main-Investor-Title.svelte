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

  import { page } from '$app/stores';
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
    CNAME: string = 'profile⮕w⮕investor-title⮕main'
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | undefined | null;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
▓ NOTE:
▓ > Launchpad main info.
-->
<div
  id={CNAME}
>

  <!--
  ▓ NOTE:
  ▓ > Launchpad views.
  -->
  <div
    id="launchpad-view-box"
    class=
    "
    width-fit-content
    "
  >

    <!--
    ▓ NOTE:
    ▓ > Private Presale box.
    -->
    <div
      class=
      "
      view-opt-box
      "
      class:activeOpt={true}
    >

      <p
        class=
        "
        s-16
        color-white
        "
        class:color-white={true}
        class:w-500={true}
        class:text-center={VIEWPORT_MOBILE_INIT[1]}
      >
        <TranslationText
          key={`${CNAME}/title`}
          text={profileTrs?.investor?.tab.tab_1}
          fallback={'Private Presale'}
        />
      </p>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Public Presale box.
    -->
    <div
      class=
      "
      view-opt-box
      "
      class:activeOpt={false}
    >

      <p
        class=
        "
        s-16
        color-grey-shade
        opacity-0-4
        class:text-center={VIEWPORT_MOBILE_INIT[1]}
        "
      >
        <TranslationText
          key={`${CNAME}/title`}
          text={profileTrs?.investor?.tab.tab_2}
          fallback={'Public Presale (Soon)'}
        />
      </p>

    </div>

  </div>

  <!--
  ▓ NOTE:
  ▓ > Bottom line.
  -->
  <div
    id="launchpad-bottom-box"
    class=
    "
    m-b-30
    "
  />

  <!--
  ▓ NOTE:
  ▓ > Launchpad box.
  -->
  <div>

    <!--
    ▓ NOTE:
    ▓ > Launchpad title.
    -->
    <p
      class=
      "
      {VIEWPORT_MOBILE_INIT[1] ? 's-24' : 's-32'}
      color-white
      w-500
      m-b-16
      "
    >
      <TranslationText
        key={`${CNAME}/title`}
        text={profileTrs?.investor?.tab.title_launchpad}
        fallback={'Launchpad'}
      />
    </p>

    <!--
    ▓ NOTE:
    ▓ > Launchpad description.
    -->
    <p
      id="launchpad-description"
      class=
      "
      s-16
      color-grey-shade
      "
    >
      <TranslationText
        key={`${CNAME}/title`}
        text={profileTrs?.investor?.tab.description_launchpad}
        isHtmlBlock={true}
        fallback={''}
      />
    </p>

  </div>

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

  // ▓ IMPORTANT
  // ▓ > contains :global.
  div#profile⮕w⮕investor-title⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    margin-top: 12px;

    div#launchpad-view-box
    {
      /* 📌 position */
      position: relative;
      /* 🛝 layout */
      display: grid;
      gap: 25px;
      grid-auto-flow: column;
      grid-template-columns: 1fr 1fr;
    }

    div#launchpad-bottom-box
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);
      height: 1px;
      width: 100%;
    }

    div.view-opt-box
    {
      /* 🎨 style */
      border-bottom: solid 2.5px transparent;
      width: 100%;

      &.activeOpt
      {
        /* 🎨 style */
        border-color: #f5620f;
      }

      p
      {
        /* 🎨 style */
        padding-bottom: 12px;
      }
    }

    :global
    {
      span#id_1
      {
        /* 🎨 style */
        font-weight: 500;
        color: var(--white);
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	@media only screen
  and (min-width: 769px)
  {
		div#profile⮕w⮕investor-title⮕main
    {
      /* 🎨 style */
      margin-top: 0;

      div#launchpad-view-box
      {
        /* 🛝 layout */
        grid-template-columns: auto auto;
      }

      p#launchpad-description
      {
        /* 🎨 style */
        max-width: 393px;
      }
		}
	}

</style>
