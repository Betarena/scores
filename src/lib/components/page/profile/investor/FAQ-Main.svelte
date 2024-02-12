<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
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

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

  import FaqChildRow from './FAQ-Child-Row.svelte';

  import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
  ;

  let
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;

  // #endregion ➤ 📌 VARIABLES

</script>

<svelte:window
  on:resize=
  {
    () =>
    {
      [
        VIEWPORT_TABLET_INIT[1],
        VIEWPORT_MOBILE_INIT[1]
      ]
      = viewport_change
        (
          VIEWPORT_TABLET_INIT[0],
          VIEWPORT_MOBILE_INIT[0]
        );
      return;
    }
  }
/>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  ▓ NOTE:
  ▓ > main title
  -->
  <div
    id='{CNAME}⮕faq-title'
  >

    <!--
    ▓ NOTE:
    ▓ > title
    -->
    <p
      class=
      "
      {VIEWPORT_MOBILE_INIT[1] ? 's-24' : 's-32'}
      w-500
      color-black-2
      m-b-16
      "
    >
      <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
      {
        profileTrs?.investor?.faq.title
        ?? 'Frequently Asked Questions'
      }
    </p>

    <!--
    ▓  NOTE:
    ▓ > sub-title
    -->
    <p
      class=
      "
      s-16
      color-grey
      "
    >
      <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
      {
        profileTrs?.investor?.faq.sub_title
        ?? 'Have questions? Find answers to the most commonly asked questions about the Betarena presale and referral program.'
      }
    </p>

  </div>

  <!--
  ▓ NOTE:
  ▓ > widget box
  -->
  <div
    id='{CNAME}⮕faq-box'
    class=
    "
    m-t-30
    "
  >

    {#each profileTrs?.investor?.faq.options ?? [] as item,i}

      <FaqChildRow
        position={i}
        data={item}
      />

    {/each}

  </div>

  <!--
  ▓ NOTE:
  ▓ > more information box
  -->
  <div
    class=
    "
    {VIEWPORT_MOBILE_INIT[1] ? 'column-space-start' : 'row-space-out'}
    m-t-30
    "
    style=
    "
    {VIEWPORT_MOBILE_INIT[1] ? 'align-items: flex-start;' : 'align-items: flex-end;'}
    "
  >

    <!--
    ▓ NOTE:
    ▓ > text box
    -->
    <div
      class=
      "
      {VIEWPORT_MOBILE_INIT[1] ? 'm-b-24' : ''}
      "
    >

      <!--
      ▓ NOTE:
      ▓ > title
      -->
      <p
        class=
        "
        s-20
        w-500
        color-black-2
        m-b-16
        "
      >
        <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
        {
          profileTrs?.investor?.presale.title_information
          ?? 'Need More Information?'
        }
      </p>

      <!--
      ▓ NOTE:
      ▓ > sub-title
      -->
      <p
        class=
        "
        s-16
        color-grey
        "
        style=
        "
        {VIEWPORT_MOBILE_INIT[1] ? '' : 'max-width: 65%;'}
        "
      >
        <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
        {
          profileTrs?.investor?.presale.description_information
          ?? 'For a comprehensive understanding of the Betarena presale, please visit our Presale Page.'
        }
      </p>

    </div>

    <!--
    ▓ NOTE:
    ▓ > CTA button
    -->
    <a
      href="https://about.betarena.com/presale"
      target="_blank"
    >
      <button
        class=
        "
        btn-primary-v2
          btn-shadow-1
        "
      >
        <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
        {
          profileTrs?.investor?.presale.cta_presale
          ?? 'Link to Presale'
        }
      </button>
    </a>

  </div>

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  div#profile⮕w⮕investfaq⮕main
  {
    &⮕faq-box
    {
      /* 🎨 style */
      background-color: var(--white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 581px)
  {
    div#profile⮕w⮕investfaq⮕main
    {
      :global
      {
        div.profile⮕w⮕investfaq⮕child⮕row
        {
          p.faq-title
          {
            /* 🎨 style */
            margin-left: 120px;
          }

          div.faq-description
          {
            /* 🎨 style */
            margin-left: 138px;
          }
        }
      }
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#profile⮕w⮕investfaq⮕main
    {
      &⮕faq-title
      {
        /* 🎨 style */
        padding: 0 20px;
      }

      :global
      {
        div.profile⮕w⮕investfaq⮕child⮕row
        {
          div.faq-description
          {
            /* 🎨 style */
            max-width: 65%;
          }
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investfaq⮕main
  {
    /* 🎨 style */
    background-color: transparent !important;

    &.dark-background-1 &⮕faq-box
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 :global
    {
      div.profile⮕w⮕investfaq⮕child⮕row
      {
        /* 🎨 style */
        border-bottom: solid 1px var(--dark-theme-1);
      }
    }
  }

</style>
