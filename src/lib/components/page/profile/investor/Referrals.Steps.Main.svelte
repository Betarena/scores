<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
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
  import { toZeroPrefixDateStr } from '$lib/utils/dates.js';

  import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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

  export let
    /**
     * @augments IProfileData
    */
    profileData: IProfileData | null
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕referral-step⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
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
    id='title-box'
    class=
    "
    m-b-50
    "
  >

    <!--
    ▓ NOTE:
    ▓ > title
    -->
    <div
      id="title"
      class=
      "
      {VIEWPORT_MOBILE_INIT[1] ? 's-24' : 's-32'}
      w-500
      color-black-2
      m-b-16
      "
    >
      {
        @html profileTrs.investor?.referral.details.title
        ?? 'Refer Investors. Earn Tokens Together.'
      }
    </div>

    <!--
    ▓  NOTE:
    ▓ > sub-title
    -->
    <div
      id="steps-description"
    >
      {
        @html profileTrs.investor?.referral.details.description
        ?? 'Earn up to 10% bonus on every investor in the Betarena presale.'
      }
    </div>

  </div>

  <!--
  ▓ NOTE:
  ▓ > (box) referral steps title
  -->
  <div>

    <p
      class=
      "
      s-20
      w-500
      color-black-2
      "
    >
      {
        @html profileTrs.investor?.referral.details.steps_title
        ?? 'Steps to Get Referral Bonus'
      }
    </p>

    {#each profileTrs.investor?.steps.steps ?? [] as item,i}

      <div
        class=
        "
        divider
        "
      />

      <div
        class=
        "
        row-space-out-top
        "
      >
        <p
          class=
          "
          s-12
          color-grey
            dark-v1
          w-600
          "
          style=
          "
          margin-right: 50px;
          "
        >
          {toZeroPrefixDateStr(i+1)}.
        </p>

        <div>
          <p
            class=
            "
            s-16
            color-black-2
              dark-white-v3
            m-b-12
            "
          >
            {item.title}
          </p>
          <p
            class=
            "
            s-14
            color-grey
              grey-v1
            "
          >
            {item.description}
          </p>
        </div>
      </div>
    {/each}

  </div>

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  @import '../../../../../../static/app.scss';

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-step⮕main
  {
    div.divider
    {
      /* 🎨 style */
      margin: 24px 0;
      border: none;
      height: 1px;
      /* Set the hr color */
      color: var(--grey-color);  /* old IE */
      background-color: var(--grey-color);  /* Modern Browsers */
    }

    div#steps-description
    {
      // IMPORTANT
      :global
      {
        p
        {
          @extend .s-16;
          @extend .color-grey;
          @extend .grey-v1;

          strong
          {
            @extend .w-500;
            @extend .color-black-2;
          }
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 1160px)
  {
    div#title-box
    {
      /* 🎨 style */
      padding: 0 20px;
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-step⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: transparent !important;

    div.divider
    {
      /* 🎨 style */
      color: var(--dark-theme-1);  /* old IE */
      background-color: var(--dark-theme-1);  /* Modern Browsers */
    }

  }

</style>
