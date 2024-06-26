<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ High Order Component Overview                                                    │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Version Svelte Format :|: V.8.0 [locked]                                       │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

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

	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toZeroPrefixDateStr } from '$lib/utils/dates.js';

  import icon_faq_minus_dark from '../assets/investor/icon-faq-minus-dark.svg';
  import icon_faq_minus from '../assets/investor/icon-faq-minus.svg';
  import icon_faq_plus_dark from '../assets/investor/icon-faq-plus-dark.svg';
  import icon_faq_plus from '../assets/investor/icon-faq-plus.svg';

  import type { InvestorsTranslationNewDataOption } from '@betarena/scores-lib/types/_AUTO-HASURA_.js';

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
     * @augments InvestorsTranslationNewDataOption
     */
    data: InvestorsTranslationNewDataOption
    /**
     * @description
     *  📣 target position of `this` row component
     */
    , position: number
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME = 'profile⮕w⮕investfaq⮕child⮕row'
  ;

  let
    /**
     * @description
     *  📣 wether `this` component is in an **show more** state
     */
    stateIsExpanded: boolean = false
    /**
     * @description
     *  📣 type `.svg` icon element
     */
    , iconExpand: string
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $:
  if ($userBetarenaSettings.theme == 'Dark')
    iconExpand = stateIsExpanded ? icon_faq_minus_dark : icon_faq_plus_dark
  else
    iconExpand = stateIsExpanded ? icon_faq_minus : icon_faq_plus;
  // ────────────────────────────────────────────────────────────────────────

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

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

<!--
▓ NOTE:
▓ > faq row
-->
<div
  class=
  "
  cursor-pointer
  <!---->
  {CNAME}
  "
  on:click=
  {
    () =>
    {
      stateIsExpanded = !stateIsExpanded;
      return;
    }
  }
>

  <!--
  ▓ NOTE:
  ▓ > faq main collapsed row
  -->
  <div
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓ NOTE:
    ▓ > faq position + title box.
    -->
    <div
      class=
      "
      row-space-start
      "
    >

      <!--
      ▓ NOTE:
      ▓ > faq number
      -->
      <p
        class=
        "
        s-16
        color-grey
        "
      >
        {toZeroPrefixDateStr(position + 1)}
      </p>

      <!--
      ▓ NOTE:
      ▓ > faq question
      -->
      <p
        class=
        "
        s-16
        color-black-2
        w-500
        <!---->
        faq-title
        "
      >
        {data.title}
      </p>

    </div>

    <!--
    ▓ NOTE:
    ▓ > faq expand/collapse state icon
    -->
    <img
      id=''
      src={iconExpand}
      alt=''
      title=''
      loading='lazy'
      width=24
      height=24
    />

  </div>

  <!--
  ▓ NOTE:
  ▓ > faq description (extra)
  -->
  {#if stateIsExpanded}
    <div
      class=
      "
      m-t-15
      <!---->
      faq-description
      "
      in:fade
    >
      {@html data.description}
    </div>
  {/if}

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

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div.profile⮕w⮕investfaq⮕child⮕row
  {
    /* 🎨 style */
    margin: 0 20px;
    padding: 20px 0;
    border-bottom: solid 1px var(--grey-color);

    p.faq-title
    {
      /* 🎨 style */
      margin-left: 24px;
    }

    div.faq-description
    {
      /* 🎨 style */
      margin-left: 41px;
      max-width: none;

      :global
      {
        p
        , li
        {
          font-size: 16px;
          color: var(--grey);
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  main.dark-background
  , main.dark-background-1
  {
    div.profile⮕w⮕investfaq⮕child⮕row
    {
      div.faq-description
      {
        :global
        {
          p
          , li
          {
            color: var(--grey-shade) !important;
          }
        }
      }
    }
  }

</style>
