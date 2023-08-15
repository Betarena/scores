<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import sessionStore from '$lib/store/session.js';

  import { removeDiacritics } from '$lib/utils/languages.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    /** @description TODO: DOC: */
    competitionNameDefault: string,
    /** @description TODO: DOC: */
    competitionTranslation: string,
    /** @description TODO: DOC: */
    selectedCompetition: string = 'predictor'
  ;

  let
    sportIcon: string,
    competitionLink: string =
      $sessionStore?.serverLang == 'en'
        ? `/${removeDiacritics(competitionTranslation?.toLowerCase())}`
        : `/${$sessionStore?.serverLang}/${removeDiacritics(competitionTranslation?.toLowerCase())}`
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  $: if_R_0 =
    selectedCompetition == competitionNameDefault
  ;
  $: if (!if_R_0)
    sportIcon = `/assets/svg/sport-icon/${competitionNameDefault.toLocaleLowerCase()}.svg`;
  ;
  $: if (if_R_0)
    sportIcon = `/assets/svg/sport-icon/${competitionNameDefault.toLocaleLowerCase()}-select.svg`
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<a
  href={competitionLink}
  class=
  "
  disable-anchor
  "
>
  <div
    class=
    "
    sports-box
    row-space-out
    "
    class:selected-sports={selectedCompetition == competitionNameDefault}
  >

    <!--
    SPORT IMG + NAME
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

  </div>
</a>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

  div.sports-box
  {
    /* 🎨 style */
		height: 44px;
	}
  div.sports-box:hover p.capitalize
  {
    /* 🎨 style */
    color: var(--primary) !important;
  }

</style>