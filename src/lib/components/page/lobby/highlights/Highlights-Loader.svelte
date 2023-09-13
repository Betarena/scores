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

	import ChighLoaderEntry from "./loaders/CHIGH-Loader-Entry.svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competition⮕w⮕highlights-loader'
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

<div
  id="loader-grid"
>

  <div
    id="loader-grid-inner"
  >

    {#each { length: 4 } ?? [] as item}

      <div
        id="{CNAME}⮕main"
        class=
        "
        widget-component
        "
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
      >

        <!--
        TOP ROW LOADER
        -->
        <div
          id="{CNAME}⮕top-row"
          class=
          "
          row-space-out
          m-b-20
          "
        >
          <ChighLoaderEntry
            competitionTopRightBox={true}
          />
          <ChighLoaderEntry
            competitionTopLeftBox={true}
          />
        </div>

        <!--
        COMPETITION MID-SECTION
        -->
        <div
          id="{CNAME}⮕middle-section"
        >

          <!--
          TOURNAMENT INFO - LOADER
          -->
          <div
            class=
            "
            m-b-25
            "
          >
            <ChighLoaderEntry
              competitionTournamentBox={true}
            />
          </div>

          <!--
          FIXTURE TEAMS - LOADER
          -->
          <div
            class=
            "
            m-b-16
            "
          >
            <ChighLoaderEntry
              competitionTeamBox={true}
            />
          </div>

          <!--
          FIXTURE / COMPETITION COUNTDOWN LOADER
          -->
          <div
            class=
            "
            m-b-24
            "
          >
            <ChighLoaderEntry
              competitionCountdown={true}
            />
          </div>

          <!--
          COMPETITION DETAILS - LOADER
          -->
          <div
            id="{CNAME}⮕grid-details"
          >

            {#each { length: 4 } ?? [] as _}
              <ChighLoaderEntry
                competitionExtraInfo={true}
              />
            {/each}

          </div>

        </div>

        <!--
        FIXTURE / COMPETITION BOTTOM ROW - LOADER
        -->
        <div
          id="{CNAME}⮕bottom-row"
          class=
          "
          row-space-out
          "
        >
          <ChighLoaderEntry
            competitionParticipants={true}
          />
          <ChighLoaderEntry
            competitionJoinNowBox={true}
          />
        </div>

      </div>

    {/each}

  </div>

</div>

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

  div#loader-grid
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    display: grid;
    /* NOTE: only necessary if child 'grid' is position 'absolute' */
    /* height: 483px; */
    max-width: calc(100vw - 32px);
    overflow: hidden;
  }

  div#loader-grid-inner
  {
    /* 📌 position */
    /* NOTE: not wanting to use 'absolute' because then height cannot be 'dynamic' in parent */
    /* position: absolute; */
    /* 🎨 style */
    width: 100%;
    display: grid;
    gap: 20px;
    grid-auto-flow: column dense;
    grid-template-rows: 1fr;
    /* NOTE: does not work with the last highlights on the list */
    /* grid-template-columns: repeat(auto-fill, calc(100vw - 32px)); */
    grid-auto-columns: calc(100vw - 32px);
    transition: all 0.5s;
  }

  .widget-component
  {
    /* 🎨 style */
    padding: 0;
  }

  div#competition⮕w⮕highlights-loader⮕top-row
  {
    /* 🎨 style */
    min-height: 64px;
		padding: 16px 24px;
    background-color: var(--whitev2);
  }

  div#competition⮕w⮕highlights-loader⮕middle-section
  {
    /* 🎨 style */
    padding: 20px 24px;
  }

  div#competition⮕w⮕highlights-loader⮕grid-details
  {
    /* 🎨 style */
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 40px;
  }

  div#competition⮕w⮕highlights-loader⮕bottom-row
  {
    /* 🎨 style */
    min-height: 72px;
		padding: 16px 24px;
    background-color: var(--whitev2);
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 726px)
  {

    div#loader-grid
    {
      /* 🎨 style */
      max-width: calc(100vw - 64px);
    }

    div#loader-grid-inner
    {
      /* 🎨 style */
      /* IMPORTANT */
      grid-auto-columns: calc((100vw - 64px - 20px) / 2);
      /* grid-auto-columns: 328px; */
    }

  }

  @media only screen
  and (min-width: 1160px)
  {

    div#loader-grid-inner
    {
      /* 🎨 style */
      /* IMPORTANT */
      grid-auto-columns: calc((100vw - 64px - (20px * 2)) / 3);
      /* grid-auto-columns: 328px; */
    }

  }

  @media only screen
  and (min-width: 1430px)
  {

    div#loader-grid-inner
    {
      /* 🎨 style */
      /* IMPORTANT */
      grid-auto-columns: 328px;
    }

	}

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#competition⮕w⮕highlights-loader⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade) !important;
  }

  .dark-background-1 div#competition⮕w⮕highlights-loader⮕top-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1) !important;
  }

  .dark-background-1 div#competition⮕w⮕highlights-loader⮕bottom-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1) !important;
  }

</style>