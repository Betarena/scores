<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { sessionStore } from '$lib/store/session.js';

  import { removeDiacritics } from '$lib/utils/languages.js';
  import { createEventDispatcher } from 'svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const dispatch = createEventDispatcher();

  export let
    sportNameDefault: string,
    sportTranslation: string,
    sportValue: string,
    selectedSport: string
  ;

  let
    sportIcon: string,
    sportLink: string =
      $sessionStore?.serverLang == 'en'
        ? `/${removeDiacritics(sportTranslation?.toLowerCase())}`
        : `/${$sessionStore?.serverLang}/${removeDiacritics(sportTranslation?.toLowerCase())}`
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * TODO: DOC:
   */
	function clickAction
  (
  ): void
  {
    dispatch
    (
      'closeDropdown',
      {
        selectedSport: sportNameDefault
      }
    );
	}

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  $: if_R_0 =
    selectedSport == sportNameDefault
  ;
  $: if (!if_R_0)
    sportIcon = `/assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}.svg`;
  ;
  $: if (if_R_0)
    sportIcon = `/assets/svg/sport-icon/${sportNameDefault.toLocaleLowerCase()}-select.svg`
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<a
  href={sportLink}
>
  <div
    class=
    "
    sports-box
    row-space-out
    "
    on:click={() => clickAction()}
    class:selected-sports={selectedSport == sportNameDefault}
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
        alt="{sportNameDefault}-img"
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
        {sportTranslation}
      </p>
    </div>

    <!--
    SPORT VALUE (NUM/SOON)
    -->
    <p
      class=
      "
      color-white
      s-14
      sport-counter-dark
      "
    >
      {sportValue}
    </p>

  </div>
</a>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div.sports-box
  {
    /* s */
		height: 44px;
	}
  div.sports-box:hover p.capitalize
  {
    /* s */
    color: var(--primary) !important;
  }
  div.sports-box .sport-counter-dark
  {
    /* s */
		background-color: var(--dark-theme-1);
		padding: 3px 8px;
		border-radius: 20px;
    height: 24px;
	}

  /*
  =============
  RESPONSIVNESS
  =============
  */

  /*
  =============
  DARK-THEME
  =============
  */

</style>