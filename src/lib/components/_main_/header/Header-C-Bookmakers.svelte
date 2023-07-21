<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from "$app/stores";
	import { fly } from "svelte/transition";

	import { userBetarenaSettings } from "$lib/store/user-settings.js";
	import { translationObject } from "$lib/utils/translation.js";

  import icon_arrow_down_fade from './assets/arrow-down-fade.svg';
  import icon_arrow_up from './assets/arrow-up.svg';
  import icon_check from './assets/icon-check.svg';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    isViewMobile: boolean = false,
    isViewTablet: boolean = false
  ;

  let
    B_NAV_T: B_NAV_T = $page.data.HEADER_TRANSLATION_DATA,
	  isBookmakersDropdown: boolean = false
  ;

  $: B_NAV_T = $page.data.HEADER_TRANSLATION_DATA;

  // #endregion ➤ 📌 VARIABLES

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
-->
<div
  id="bookmaker-box"
  data-testid="header/component/bookmakers"
  class=
  "
  dropdown-opt-box
  row-space-start
  "
  on:click={() => (isBookmakersDropdown = !isBookmakersDropdown)}
  class:not-last={$userBetarenaSettings?.user != undefined}
>

  <!--
  SELECTED BOOKMAKERS BOX
  -->
  <div
    class:m-r-10={!isViewTablet}
    class:m-b-15={isViewTablet}
  >

    <!--
    TITLE
    -->
    <p
      class=
      "
      color-grey
      s-12
      no-wrap
      "
      class:m-b-5={isViewTablet}
    >
      {B_NAV_T?.scores_header_translations?.bookmakers ?? translationObject?.bookmakers}
    </p>

    <!--
    CURRENT BOOKMAKER SELECTED
    -->
    <div
      class:row-space-out={!isViewMobile}
    >

      <div
        class=
        "
        row-space-start
        "
      >

        {#if $userBetarenaSettings.country_bookmaker != undefined}
          {#each B_NAV_T?.scores_header_translations?.bookmakers_countries || [] as country}
            {#if country.includes($userBetarenaSettings?.country_bookmaker?.toUpperCase())}
              <img
                loading="lazy"
                class=
                "
                country-flag
                m-r-5
                "
                src="https://betarena.com/images/flags/{country[0]}.svg"
                alt={country[1]}
                width=20
                height=14
              />
              <p
                class=
                "
                color-white
                s-14
                "
              >
                {country[1]}
              </p>
            {/if}
          {/each}
        {/if}

      </div>

      <!--
      ARROW DOWN
      -->
      {#if isViewMobile}
        <img
          loading="lazy"
          src={!isBookmakersDropdown ? icon_arrow_down_fade : icon_arrow_up}
          alt={!isBookmakersDropdown ? 'icon_arrow_down_fade' : 'icon_arrow_up'}
          width=16
          height=16
        />
      {/if}

    </div>

  </div>

  <!--
  ARROW DOWN
  -->
  {#if !isViewMobile}
    <img
      loading="lazy"
      src={!isBookmakersDropdown ? icon_arrow_down_fade : icon_arrow_up}
      alt={!isBookmakersDropdown ? 'icon_arrow_down_fade' : 'icon_arrow_up'}
      width=16
      height=16
    />
  {/if}

  <!--
  DROPDOWN MENU (THEME)
  -->
  {#if isBookmakersDropdown}
    <div
      id="bookmakers-type-dropdown-menu"
      transition:fly
    >
      {#if $userBetarenaSettings.country_bookmaker != undefined}
        {#each B_NAV_T?.scores_header_translations?.bookmakers_countries || [] as country}
          <div
            class=
            "
            theme-opt-box
            row-space-start
            "
            class:country-selected={country[0] === $userBetarenaSettings.country_bookmaker.toUpperCase()}
            on:click={() => userBetarenaSettings.setCountryBookmaker(country?.[0].toLocaleLowerCase())}
          >
            <img
              loading="lazy"
              class=
              "
              country-flag
              m-r-10
              "
              src="https://betarena.com/images/flags/{country?.[0]}.svg"
              alt={country?.[1]}
              width=20
              height=14
            />
            <p
              class=
              "
              color-white
              s-14
              "
            >
              {country?.[1]}
            </p>
          </div>

          <!--
          CURRENTLY SELECTED BOOKMAKER
           -->
          {#if isViewMobile && country?.includes($userBetarenaSettings?.country_bookmaker)}
            <img
              loading="lazy"
              src={icon_check}
              alt={country?.[0]}
              width=16
              height=16
            />
          {/if}

        {/each}
      {/if}
    </div>
  {/if}

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  img.country-flag
  {
		background: linear-gradient
    (
			180deg,
			rgba(255, 255, 255, 0.7) 0%,
			rgba(0, 0, 0, 0.3) 100%
		);
		background-blend-mode: overlay;
		border-radius: 2px;
	}

  div#bookmaker-box
  {
    /* p */
    position: relative;
    /* s */
    padding: 0 0 0 16px;
  }
  div#bookmaker-box.not-last
  {
    padding: 0 16px 0 16px;
  }

  #bookmakers-type-dropdown-menu
  {
    position: absolute;
    top: 100%;
    right: 0%;
    margin-top: 5px;
    background: #4b4b4b;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: hidden;
    z-index: 2000;
    height: 320px;
    width: 620px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 5px 20px;
    padding: 8px 12px;
  }

  #bookmakers-type-dropdown-menu .theme-opt-box
  {
    height: 40px;
    padding: 13px 8px;
    box-shadow: inset 0px -1px 0px #3c3c3c;
    background: #4b4b4b;
    position: relative;
  }

  #bookmakers-type-dropdown-menu .theme-opt-box:hover,
  #bookmakers-type-dropdown-menu .country-selected
  {
    background: #292929;
    border-radius: 4px;
  }

</style>