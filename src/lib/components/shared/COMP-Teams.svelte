<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import type { B_COMP_HIGH_D } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description competition (shared) - target competition data */
    B_COMP_HIGH_D: B_COMP_HIGH_D,
    /** @description competition highlights - target widget prediction type */
    prediction_type: 'win' | 'loose' | 'draw',
    /** @description TODO: DOC: */
    prediction_side: 'home' | 'away',
    /** @description TODO: DOC: */
    fixtureUrl: string
  ;

  const
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'shared⮕w⮕competition-teams'
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
FIXTURE TEAMS
-->
<a
  href={fixtureUrl}
>
  <div
    id="{CNAME}⮕main"
    class=
    "
    row-space-out
    "
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    class:bump-height={['active', 'finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}
  >

    <!--
    TEAM 1 (HOME)
    -->
    <div
      class=
      "
      team-box
      column-space-center
      "
      class:predict-win-border={prediction_side == 'home' && prediction_type == 'win'}
      class:predict-loose-border={prediction_side == 'home' && prediction_type == 'loose'}
      class:left-predict-win={prediction_side == 'home' && prediction_type == 'win'}
      class:left-predict-loose={prediction_side == 'home' && prediction_type == 'loose'}
    >

      <img
        id=''
        src={B_COMP_HIGH_D?.fixture?.home_team_logo}
        alt='team-home'
        title={B_COMP_HIGH_D?.fixture?.home_team_name ?? ''}
        loading='lazy'
        width=32
        height=32
        class=
        "
        m-b-8
        team-logo
        "
      />

      <p
        class=
        "
        s-12
        color-black-2
        w-600
        no-wrap
        team-name
        "
      >
        {B_COMP_HIGH_D?.fixture?.home_team_name ?? ''}
      </p>

      <!--
      FINAL FIXTURE SCORE
      -->
      {#if ['active','finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}
        <p
          class=
          "
          s-16
          color-black-2
          w-600
          m-t-10
          "
        >
          {B_COMP_HIGH_D?.fixture_detailed?.teams?.home?.score ?? 0}
        </p>
      {/if}

    </div>

    <!--
    DIVIDER
    -->
    <div
      id="{CNAME}⮕team-divider"
      class=
      "
      column-space-stretch
      "
    >

      <div id="vertical-top-divider" />

      <p
        class=
        "
        s-16
        w-500
        color-black-2
        "
      >
        vs
      </p>

      <div id="vertical-bottom-divider" />

    </div>

    <!--
    TEAM 2 (AWAY)
    -->
    <div
      class=
      "
      team-box
      column-space-center
      "
      class:predict-win-border={prediction_side == 'away' && prediction_type == 'win'}
      class:predict-loose-border={prediction_side == 'away' && prediction_type == 'loose'}
      class:right-predict-win={prediction_side == 'away' && prediction_type == 'win'}
      class:right-predict-loose={prediction_side == 'away' && prediction_type == 'loose'}
    >

      <img
        id=''
        src={B_COMP_HIGH_D?.fixture?.away_team_logo}
        alt='team-away'
        title={B_COMP_HIGH_D?.fixture?.away_team_name ?? ''}
        loading='lazy'
        width=32
        height=32
        class=
        "
        m-b-8
        team-logo
        "
      />

      <p
        class=
        "
        s-12
        color-black-2
        w-600
        no-wrap
        team-name
        "
      >
        {B_COMP_HIGH_D?.fixture?.away_team_name ?? ''}
      </p>

      <!--
      FINAL FIXTURE SCORE
      -->
      {#if ['active','finished','canceled'].includes(B_COMP_HIGH_D?.competition?.data?.status)}
        <p
          class=
          "
          s-16
          color-black-2
          w-600
          m-t-10
          "
        >
          {B_COMP_HIGH_D?.fixture_detailed?.teams?.away?.score ?? 0}
        </p>
      {/if}

    </div>

  </div>
</a>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  div#shared⮕w⮕competition-teams⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    overflow: hidden;
    border-radius: 8px;
    background-color: var(--whitev2);
    min-height: 86px;
    min-width: 280px;
  }
  div#shared⮕w⮕competition-teams⮕main.bump-height
  {
    /* 🎨 style */
    min-height: 113px;
  }
  div.team-box
  {
    /* 🔥 overload */
    min-height: inherit;
  }
  p.team-name
  {
    /* 🎨 style */
    max-width: 100px;
		overflow: hidden;
    text-overflow: ellipsis;
  }
  img.team-logo
  {
    /* 🎨 style */
    object-fit: contain;
  }
  div.team-box.left-predict-win
  {
    /* 🎨 style */
    background: linear-gradient(310deg, #F2F2F2 0%, #B5E5B7 100%);
  }
  div.team-box.left-predict-loose
  {
    /* 🎨 style */
    background: linear-gradient(311deg, #F2F2F2 0%, #EFC3C3 100%);
  }
  div.team-box.right-predict-win
  {
    /* 🎨 style */
    background: linear-gradient(43deg, #F2F2F2 0%, #B5E5B7 100%);
  }
  div.team-box.right-predict-loose
  {
    /* 🎨 style */
    background: linear-gradient(43deg, #F2F2F2 0%, #EFC3C3 100%);
  }
  div.team-box.predict-win-border
  {
    /* 🎨 style */
    border-bottom: 3px solid #4DA025;
  }
  div.team-box.predict-loose-border
  {
    /* 🎨 style */
    border-bottom: 3px solid #FF5959;
  }

  div#shared⮕w⮕competition-teams⮕team-divider
  {
    /* 📌 position */
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    /* 🎨 style */
    height: 100%;
    width: fit-content;
    text-align: -webkit-center;
    /* 🔥 overload */
    align-items: center;
    justify-content: space-between;
  }
  div#vertical-top-divider
  {
    /* 🎨 style */
    background: var(--white);
    width: 1px;
    height: 25px;
  }
  div#vertical-bottom-divider
  {
    /* 🎨 style */
    background: var(--white);
    width: 1px;
    height: 25px;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS       ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#shared⮕w⮕competition-teams⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1)
  }

  .dark-background-1 div#vertical-top-divider,
  .dark-background-1 div#vertical-bottom-divider
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade)
  }

  .dark-background-1 div.team-box.left-predict-win
  {
    /* 🎨 style */
    background: linear-gradient(275deg, transparent 50%, #3F7B41 107.93%);
  }
  .dark-background-1 div.team-box.left-predict-loose
  {
    /* 🎨 style */
    background: linear-gradient(276deg, transparent 50%, #9F4949 107.77%);
  }
  .dark-background-1 div.team-box.right-predict-win
  {
    /* 🎨 style */
    background: linear-gradient(83deg, transparent 50%, #3F7B41 107.93%);
  }
  .dark-background-1 div.team-box.right-predict-loose
  {
    /* 🎨 style */
    background: linear-gradient(83deg, transparent 50%, #9F4949 107.77%);
  }

</style>
