<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import ChighLoaderExtraInfo from "./loaders/CHIGH-Loader-Extra-Info.svelte";
	import ChighLoaderJoinNowBtn from "./loaders/CHIGH-Loader-JoinNow-Btn.svelte";
	import ChighLoaderParticipants from "./loaders/CHIGH-Loader-Participants.svelte";
	import ChighLoaderTeamBox from "./loaders/CHIGH-Loader-Team-Box.svelte";
	import ChighLoaderTimerBox from "./loaders/CHIGH-Loader-Timer-Box.svelte";
	import ChighLoaderTimerStart from "./loaders/CHIGH-Loader-Timer-Start.svelte";
	import ChighLoaderTopLeft from "./loaders/CHIGH-Loader-Top-Left.svelte";
	import ChighLoaderTopRight from "./loaders/CHIGH-Loader-Top-Right.svelte";
	import ChighLoaderTournamentBox from "./loaders/CHIGH-Loader-Tournament-Box.svelte";
	import ChighLoaderTournamentInfo from "./loaders/CHIGH-Loader-Tournament-Info.svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competition⮕w⮕highlights-loader'
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<div
  id="{CNAME}⮕main"
  class=
  "
  widget-component
  "
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
    <ChighLoaderTopLeft />
    <ChighLoaderTopRight />
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
      row-space-start
      "
    >
      <div
        class=
        "
        m-r-15
        "
      >
        <ChighLoaderTournamentBox />
      </div>
      <ChighLoaderTournamentInfo />
    </div>

    <!--
    FIXTURE TEAMS - LOADER
    -->
    <div
      id="{CNAME}⮕competition-teams"
      class=
      "
      m-b-16
      row-space-even
      "
    >

      <ChighLoaderTeamBox />
      <ChighLoaderTeamBox />

    </div>

    <!--
    FIXTURE / COMPETITION COUNTDOWN LOADER
    -->
    <div
      id="{CNAME}⮕countdown"
      class=
      "
      m-b-24
      row-space-out
      "
    >

      <ChighLoaderTimerStart />

      <div>
        {#each { length: 3 } ?? [] as _}
          <ChighLoaderTimerBox />
        {/each}
      </div>

    </div>

    <!--
    COMPETITION DETAILS - LOADER
    -->
    <div
      id="{CNAME}⮕grid-details"
    >

      {#each { length: 4 } ?? [] as _}
        <ChighLoaderExtraInfo />
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
    <ChighLoaderParticipants />
    <ChighLoaderJoinNowBtn />
  </div>

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

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

  div#competition⮕w⮕highlights-loader⮕competition-teams
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    overflow: hidden;
    border-radius: 8px;
    background-color: var(--whitev2);
    min-height: 86px;
  }

  div#competition⮕w⮕highlights-loader⮕countdown
  {
    /* 🎨 style */
    min-height: 40px;
    border-radius: 8px;
    background: var(--whitev2);
    padding: 4px 4px 4px 12px;
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
  =============
  🌒 DARK-THEME
  =============
  */

  :global(.dark-background div#competition⮕w⮕highlights-loader⮕top-row)
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

</style>