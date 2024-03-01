<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Platform Header Bookmakers Dropdown Component (Child)                     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { translationObject } from '$lib/utils/translation.js';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

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

  /**
   * @description
   *  📣 Component `Type`.
   */
  type IDynamicAssetMap =
    | 'icon_arrow_down_fade'
    | 'icon_arrow_up'
    | 'icon_check'
  ;

  export let
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME = 'header⮕c⮕bookmaker⮕main',
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport: boolean = true
  ;

  let
    /**
     * @description
     *  📣 Wether target dropdown menu is **active**.
     */
    isBookmakersDropdown: boolean = false,
    /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map< IDynamicAssetMap, any >()
  ;

  $: translationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async () =>
    {
      if (useDynamicImport)
      {
        dynamicAssetMap.set('icon_arrow_down_fade', (await import('./assets/arrow-down-fade.svg')).default);
        dynamicAssetMap.set('icon_arrow_up', (await import('./assets/arrow-up.svg')).default);
        dynamicAssetMap.set('icon_check', (await import('./assets/icon-check.svg')).default);
      }

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id={CNAME}
  data-testid={CNAME}
  class=
  {
    !VIEWPORT_MOBILE_INIT[1]
      ? `
        dropdown-opt-box
        row-space-start
        `
      : `
        side-nav-dropdown
        m-b-25
        `
  }
  on:click=
  {
    () =>
    {
      isBookmakersDropdown = !isBookmakersDropdown;
      return;
    }
  }
  class:not-last={!VIEWPORT_MOBILE_INIT[1] && $userBetarenaSettings.user != undefined}
  class:mobile={VIEWPORT_MOBILE_INIT[1]}
>

  <!--
  ╭─────
  │ > Selected Bookmaker
  ╰─────
  -->
  <div
    class:m-r-10={!VIEWPORT_MOBILE_INIT[1]}
    class:m-b-15={VIEWPORT_MOBILE_INIT[1]}
  >

    <!--
    ╭─────
    │ > Title
    ╰─────
    -->
    <p
      class=
      "
      color-grey
      s-12
      no-wrap
      "
      class:m-b-5={VIEWPORT_MOBILE_INIT[1]}
    >
      <TranslationText
        key={'unknow'}
        text={translationData?.scores_header_translations?.bookmakers}
        fallback={translationObject.bookmakers}
      />
    </p>

    <!--
    ╭─────
    │ > Current selected Bookmaker
    ╰─────
    -->
    <div
      class:row-space-out={VIEWPORT_MOBILE_INIT[1]}
    >

      <div
        class=
        "
        row-space-start
        "
      >
        {#if $userBetarenaSettings.country_bookmaker != undefined}
          {#each translationData?.scores_header_translations?.bookmakers_countries ?? [] as country}
            {#if country.includes($userBetarenaSettings.country_bookmaker.toUpperCase())}
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
      ╭─────
      │ > Arrow Down
      ╰─────
      -->
      {#if VIEWPORT_MOBILE_INIT[1]}
        <img
          loading="lazy"
          src={!isBookmakersDropdown ? dynamicAssetMap.get('icon_arrow_down_fade') : dynamicAssetMap.get('icon_arrow_up')}
          alt={!isBookmakersDropdown ? 'icon_arrow_down_fade' : 'icon_arrow_up'}
          width=16
          height=16
        />
      {/if}

    </div>

  </div>

  <!--
  ╭─────
  │ > Arrow Down :|: 💻 TABLET
  ╰─────
  -->
  {#if !VIEWPORT_MOBILE_INIT[1]}
    <img
      loading="lazy"
      src={!isBookmakersDropdown ? dynamicAssetMap.get('icon_arrow_down_fade') : dynamicAssetMap.get('icon_arrow_up')}
      alt={!isBookmakersDropdown ? 'icon_arrow_down_fade' : 'icon_arrow_up'}
      width=16
      height=16
    />
  {/if}

  <!--
  ╭─────
  │ > Dropdown Menu
  ╰─────
  -->
  {#if isBookmakersDropdown}
    <div
      class:bookmaker-dropdown={!VIEWPORT_MOBILE_INIT[1]}
      transition:fly
    >
      {#if $userBetarenaSettings.country_bookmaker != undefined}
        {#each translationData?.scores_header_translations?.bookmakers_countries || [] as country}

          <div
            class:row-space-start={VIEWPORT_MOBILE_INIT[1]}
            class:side-nav-dropdown-opt={VIEWPORT_MOBILE_INIT[1]}
          >

            <div
              class=
              "
              row-space-start
              "
              class:theme-opt-box={!VIEWPORT_MOBILE_INIT[1]}
              class:country-selected={country[0] === $userBetarenaSettings.country_bookmaker.toUpperCase()}
              on:click={() => {return userBetarenaSettings.updateData('geo-bookmaker', country[0].toLocaleLowerCase())}}
            >
              <img
                loading="lazy"
                class=
                "
                country-flag
                m-r-10
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
            </div>

            <!--
            ╭─────
            │ > Current selected Bookmaker
            ╰─────
            -->
            {#if VIEWPORT_MOBILE_INIT[1] && country.includes($userBetarenaSettings.country_bookmaker.toUpperCase())}
              <img
                loading="lazy"
                src={dynamicAssetMap.get('icon_check')}
                alt="{country[0]}_icon"
                width=16
                height=16
              />
            {/if}

          </div>

        {/each}
      {/if}
    </div>
  {/if}

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#header⮕c⮕bookmaker⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    padding: 0 0 0 16px;

    &.mobile
    {
      /* 🎨 style */
      padding: 0;
    }

    &.not-last
    {
      /* 🎨 style */
      padding: 0 16px 0 16px;
    }

    &.dropdown-opt-box
    {
      /* 🎨 style */
      border-left: 1px solid #4b4b4b;
      height: 44px;
      padding: 0 16px;
      width: fit-content;
      cursor: pointer;
    }

    &.side-nav-dropdown
    {
      /* 🎨 style */
      width: 100%;
      box-shadow: inset 0px -1px 0px #616161;
    }

    div.bookmaker-dropdown
    {
      /* 📌 position */
      position: absolute;
      top: 100%;
      right: 0%;
      z-index: 2000;
      /* 🎨 style */
      height: 320px;
      width: 620px;
      margin-top: 5px;
      background: #4b4b4b;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px 20px;
      padding: 8px 12px;

      div.theme-opt-box
      {
        /* 📌 position */
        position: relative;
        /* 🎨 style */
        height: 40px;
        padding: 13px 8px;
        box-shadow: inset 0px -1px 0px #3c3c3c;
        background: #4b4b4b;
      }
      div.theme-opt-box:hover,
      div.country-selected
      {
        /* 🎨 style */
        background: #292929;
        border-radius: 4px;
      }
    }

    div.side-nav-dropdown-opt
    {
      /* 🎨 style */
      width: 100%;
      padding: 9.5px 0;
    }

    div.side-nav-dropdown-opt p
    {
      /* 🎨 style */
      font-weight: 400;
    }

    img.country-flag
    {
      /* 🎨 style */
      background: linear-gradient
      (
        180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(0, 0, 0, 0.3) 100%
      );
      background-blend-mode: overlay;
      border-radius: 2px;
    }
  }

</style>
