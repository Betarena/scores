<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { viewport_change } from '$lib/utils/platform-functions.js';
  import { onMount } from 'svelte';

  import img_no_competitions_light from './assets/no-competitions-lobby-light.png';
  import img_no_competitions from './assets/no-competitions-lobby.png';

	import type { B_SAP_CP_T } from '@betarena/scores-lib/types/seo-pages.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** */
    MOBILE_VIEW = 475,
    /** */
    TABLET_VIEW = 1160,
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competitions⮕w⮕no-comp'
  ;

	let
    /** Page data availabe for `this` layout */
    B_SAP_CP_T: B_SAP_CP_T,
    /** */
    mobileExclusive: boolean = true,
    /** */
    tabletExclusive: boolean = true
  ;

	$: B_SAP_CP_T = $page.data?.B_SAP_CP_T;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @description
   * TODO: DOC:
   */
   function resizeAction
  (
  ): void
  {

    [
      tabletExclusive,
      mobileExclusive
    ] = viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );

  }

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @description
   * TODO: DOC:
   */
  function initEventListeners
  (
  ): void
  {
    // ### NOTE:
    // ### listen to changes in 'window.resize'.
    window.addEventListener
    (
      'resize',
      function
      (
      ): void
      {
        resizeAction();
      }
    );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {
      resizeAction();
      initEventListeners();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
  id="{CNAME}⮕main"
  class:column-space-center={mobileExclusive}
  class:row-space-out={!mobileExclusive}
>

  <!--
  NO COMPETITIONS ASSET
  -->
  <img
    id=''
    src={$userBetarenaSettings?.theme == 'Dark' ? img_no_competitions : img_no_competitions_light}
    alt='no-competitions-img'
    title='No Competitions Visual'
    loading='lazy'
    width=186
    height=186
    class=
    "
    google-aspect-ratio
    "
    class:m-b-35={mobileExclusive}
    class:m-r-64={!mobileExclusive}
  />

  <!--
  NO COMPETITION TEXT
  -->
  <div
    class:text-center={mobileExclusive}
  >

    <p
      class=
      "
      s-14
      w-600
      color-primary
      m-b-16
      inter-font
      "
    >
      {B_SAP_CP_T?.general?.data?.no_competition ?? 'Come back later'}
    </p>

    <div
      id="no-competitions-title"
    >
      {@html B_SAP_CP_T?.general?.data?.no_competition_title ?? 'No competitions available at the moment'}
    </div>

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

  div#competitions⮕w⮕no-comp⮕main
  {
    /* 📌 position */
    position: absolute;
		right: 0;
		left: 0;
		margin: auto;
		bottom: 0;
		top: 0;
    /* 🎨 style */
		width: fit-content;
		height: fit-content;
  }

  :global(#competitions⮕w⮕no-comp⮕main div#no-competitions-title)
  {
    /* 🎨 style */
    font-size: 24px;
    color: var(--dark-theme);
    font-weight: 600;
    font-family: Inter !important;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
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

</style>
