<!--
╭──────────────────────────────────────────────────────────────────────────────╮
│ COMPONENT JS (w/ TS)                                                         │
│ NOTE:                                                                        │
│ access custom Betarena Scores JS VScode Snippets by typing 'script...'       │
╰──────────────────────────────────────────────────────────────────────────────╯
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

  import FaqChildRow from './FAQ-Child-Row.svelte';

  import type { IProfileTrs } from '@betarena/scores-lib/types/profile.js';

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
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /** @augments IProfileTrs */
    B_PROF_T: IProfileTrs
  ;

  $: B_PROF_T = $page.data.RESPONSE_PROFILE_DATA;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────╮
│ COMPONENT HTML                                                               │
│ NOTE:                                                                        │
│ use 'CTRL+SPACE' to autocomplete global class="" styles                      │
│ NOTE:                                                                        │
│ access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.   │
╰──────────────────────────────────────────────────────────────────────────────╯
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
      s-32
      w-500
      color-black-2
      "
    >
      Frequently Asked Questions
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
      Have questions? Find answers to the most commonly asked
      questions about the Betarena presale and referral program.
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

    {#each B_PROF_T.investor?.faq?.options ?? [] as item,i}

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
    row-space-out
    m-t-30
    "
  >

    <!--
    ▓ NOTE:
    ▓ > text box
    -->
    <div>

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
        Need More Information?
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
      >
        For a comprehensive understanding of the Betarena presale, please visit our Presale Page.
      </p>

    </div>

    <!--
    ▓ NOTE:
    ▓ > CTA button
    -->
    <button
      class=
      "
      btn-primary-v2
      "
    >
      Link to Presale
    </button>

  </div>

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────╮
│ COMPONENT STYLE                                                              │
│ NOTE:                                                                        │
│ auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE│
│ NOTE:                                                                        │
│ access custom Betarena Scores CSS VScode Snippets by typing 'style...'       │
╰──────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  div#profile⮕w⮕investfaq⮕main
  {
    &⮕faq-title
    {
      /* 🎨 style */
      padding: 0 20px;
    }

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
    :global
    {
      div#profile⮕w⮕investfaq⮕main
      {
        div.faq-row
        {
          p.faq-title
          {
            /* 🎨 style */
            margin-left: 120px;
          }

          p.faq-description
          {
            /* 🎨 style */
            margin-left: 138px;
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