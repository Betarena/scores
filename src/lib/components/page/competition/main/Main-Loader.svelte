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

	import { viewport_change } from '$lib/utils/platform-functions.js';

	import CmainLoaderMain from './loaders/CMAIN-Loader-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 912,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'competition⮕w⮕main-loader'
  ;

  let
    /** @description TODO: DOC: */
    isViewMobile: boolean = true,
    /** @description TODO: DOC: */
    isViewTablet: boolean = true
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### SVELTE INJECTION TAGS                                                              ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<svelte:window
  on:resize={() => [ isViewTablet, isViewMobile ] =	viewport_change ( VIEWPORT_TABLET_INIT, VIEWPORT_MOBILE_INIT ) }
/>

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
  id="{CNAME}⮕main"
>

  <!--
  LOADER ⮕ TOP ROW
  -->
  <div
    id="{CNAME}⮕top-row"
  >

    <div
      id="{CNAME}⮕profile"
      class=
      "
      row-space-out
      "
    >
      <CmainLoaderMain
        competitionTitleLeft={true}
        isTabletView={isViewTablet}
      />
      <CmainLoaderMain
        competitionTitleRight={true}
        isTabletView={isViewTablet}
      />
    </div>

    <!--
    💻 TABLET
    -->
    {#if !isViewTablet}
      <div
        id="{CNAME}⮕status-social"
        class=
        "
        row-space-out
        "
      >
        <CmainLoaderMain
          competitionCountdown={true}
        />
        <CmainLoaderMain
          competitionSocialRight={true}
        />
      </div>
    {/if}

  </div>

  <!--
  LOADER ⮕ LEAGUE / COMPETITION INFO
  -->
  <div
    id="{CNAME}⮕grid-section"
    class=
    "
    row-space-out
    "
  >

    <div
      id="league-box"
    >
      <CmainLoaderMain
        competitionLeagueBox={true}
      />
      <CmainLoaderMain
        competitionLeagueTextBox={true}
      />
    </div>

    <CmainLoaderMain
      competitionTeamBox={true}
    />

    <!--
    💻 TABLET
    -->
    {#if isViewTablet}
      <CmainLoaderMain
        competitionCountdown={true}
      />
      <CmainLoaderMain
        competitionSocialRight={true}
      />
    {/if}

    <div
      id="competition-extra-box"
      class=
      "
      row-space-out
      "
    >
      <CmainLoaderMain
        competitionDetail={true}
      />
      <CmainLoaderMain
        competitionDetail={true}
      />
      <CmainLoaderMain
        competitionDetail={true}
      />
      <CmainLoaderMain
        competitionDetail={true}
      />
    </div>

  </div>

  <!--
  LOADER ⮕ PARTICIPANT LIST
  -->
  <div
    id="{CNAME}⮕participants"
  >

    {#each { length: 2 } ?? [] as _,i}

      <!--
      PARTICIPANT LIST
      -->
      <div
        class=
        "
        list-box
        "
      >

        <div
          class=
          "
          list-top-row
          "
          class:row-space-out={!isViewTablet}
        >

          {#if !isViewTablet}

            <CmainLoaderMain
              participantTopLeftBox={true}
            />
            <CmainLoaderMain
              participantListGeneralBox={true}
            />
            <CmainLoaderMain
              participantListGeneralBox={true}
            />
            <CmainLoaderMain
              participantTopRightBox={true}
            />

          {:else}

            <div
              class=
              "
              row-space-out
              m-b-20
              "
            >
              <CmainLoaderMain
                participantListGeneralBoxTablet={true}
              />
              <CmainLoaderMain
                participantTopRightBox={true}
              />
            </div>

            <div
              class=
              "
              row-space-out
              "
            >
              <CmainLoaderMain
                participantListGeneralBoxTablet2={true}
              />
              <CmainLoaderMain
                participantListGeneralBoxTablet={true}
              />
            </div>

          {/if}

        </div>

        <div
          class=
          "
          row-space-out
          list-head
          "
        >

          <CmainLoaderMain
            participantListColumnn={true}
          />
          <CmainLoaderMain
            participantListColumnn={true}
          />

        </div>

        {#each { length: 14 } ?? [] as _,i}

          <div
            class=
            "
            row-space-out
            participant-row
            "
          >

            <!--
            🖥️ LAPTOP
            -->
            {#if !isViewTablet}

              {#if i % 2 === 0}
                <CmainLoaderMain
                  participantLeft={true}
                />
                <CmainLoaderMain
                  participantRight={true}
                />
              {:else}
                <CmainLoaderMain
                  participantLeft={true}
                  isOdd={true}
                />
                <CmainLoaderMain
                  participantRight={true}
                  isOdd={true}
                />
              {/if}

            <!--
            💻 TABLET
            -->
            {:else}

              {#if i % 2 === 0}
                <CmainLoaderMain
                  participantLeftTablet={true}
                />
                <CmainLoaderMain
                  participantRightTablet={true}
                />
              {:else}
                <CmainLoaderMain
                participantLeftTablet={true}
                  isOdd={true}
                />
                <CmainLoaderMain
                  participantRightTablet={true}
                  isOdd={true}
                />
              {/if}

            {/if}

          </div>

        {/each}

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

  div#competition⮕w⮕main-loader⮕main
  {
    /* 🛝 layout */
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
  }

  /* div#competition⮕w⮕main-loader⮕top-row
  {
  } */
  div#competition⮕w⮕main-loader⮕profile
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    min-height: 112px;
    max-height: 112px;
    background: var(--white);
		box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
		border-radius: 12px 12px 0 0;
    padding: 24px 32px;
  }
  div#competition⮕w⮕main-loader⮕status-social
  {
    /* 🎨 style */
    min-height: 72px;
    max-height: 72px;
    background: var(--white);
    padding: 16px 32px;
  }

  /* div#competition⮕w⮕main-loader⮕details
  {
    /* 🎨 style * /
    background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    padding: 24px 32px;
    min-height: 130px;
    max-height: 130px;
  } */

  div#competition⮕w⮕main-loader⮕grid-section
  {
    /* 🎨 style */
    background-color: var(--white);
    margin-top: -8px;
    padding: 24px;
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
    /* ◼️◼️◼️ NOTE: disabled, but can be enabled with proper 'auto-fill' */
    /* grid-template-rows: 1fr 1fr 1fr; */
    gap: 24px;
  }
  div#competition⮕w⮕main-loader⮕grid-section div#league-box
  {
    /* 🛝 layout */
    grid-column: 1;
    grid-row: 1;
  }
  div#competition⮕w⮕main-loader⮕grid-section div#competition-extra-box
  {
    /* 🎨 style */
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 40px;
    /* 🛝 layout */
    grid-column: 1;
    grid-row: 4;
  }

  div#competition⮕w⮕main-loader⮕participants
  {
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  div#competition⮕w⮕main-loader⮕participants div.list-box
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    width: 100%;
    background: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  }
  div#competition⮕w⮕main-loader⮕participants div.list-top-row
  {
    /* 🎨 style */
    background: var(--white);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    min-height: 113px;
    max-height: 113px;
    padding: 14px 24px;
  }
  div#competition⮕w⮕main-loader⮕participants div.list-head
  {
    /* 🎨 style */
    padding: 16px 70px 16px 32px;
  }
  div#competition⮕w⮕main-loader⮕participants div.participant-row
  {
    /* 🎨 style */
    padding: 8px 47px 8px 35px;
  }
  div#competition⮕w⮕main-loader⮕participants div.participant-row:nth-child(even)
  {
    /* 🎨 style */
    background-color: var(--whitev2);
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: independent media query widget */
  and (min-width: 658px)
  {

    div#competition⮕w⮕main-loader⮕grid-section
    {
      /* 🎨 style */
      background-color: white;
      margin-top: -8px;
      padding: 24px;
      /* 🛝 layout */
      display: grid;
      grid-template-columns: 1fr 1fr;
      /* grid-template-rows: 1fr 1fr 1fr; */
      gap: 24px;
    }
    div#competition⮕w⮕main-loader⮕grid-section div#league-box
    {
      /* 🎨 style */
      grid-column: 1;
      grid-row: 1;
    }
    div#competition⮕w⮕main-loader⮕grid-section div#competition-extra-box
    {
      /* 🎨 style */
      grid-column: 1 / 3;
      grid-row: 3;
    }

	}

  @media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: independent media query widget */
  and (min-width: 726px)
  {

    div#competition⮕w⮕main-loader⮕participants
    {
      /* 🛝 layout */
      grid-template-columns: 1fr 1fr;
    }

  }

  @media only screen
  /* ◼️◼️◼️ NOTE: 💻 TABLET */
  /* ◼️◼️◼️ NOTE: dictated by parent */
  and (min-width: 780px)
  {

    div#competition⮕w⮕main-loader⮕participants div.list-top-row
    {
      /* 🎨 style */
      min-height: 88px;
      max-height: 88px;
      padding: 24px 32px;
    }

  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

</style>