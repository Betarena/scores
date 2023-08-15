<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  import img_no_competitions from './assets/no-competitions-lobby.png';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'competitions⮕w⮕no-comp'
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
  row-space-out
  "
>

  <!--
  NO COMPETITIONS ASSET
  -->
  <img
    id=''
    src={img_no_competitions}
    alt='no-competitions-img'
    title='No Competitions'
    loading='lazy'
    width=186
    height=186
    class=
    "
    m-r-64
    "
  />

  <!--
  NO COMPETITION TEXT
  -->
  <div>

    <p
      class=
      "
      s-14
      w-700
      color-primary
      m-b-16
      "
    >
      Come back later
    </p>

    <p
      class=
      "
      s-22
      w-700
      color-black-2
      "
    >
      No competitions available
      <br />
      at the moment
    </p>

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

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
  }

  /*
  =============
  🌒 DARK-THEME
  =============
  */

</style>
