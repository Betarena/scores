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

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toZeroPrefixDateStr } from '$lib/utils/dates.js';

  import icon_faq_minus_dark from '../assets/investor/icon-faq-minus-dark.svg';
  import icon_faq_minus from '../assets/investor/icon-faq-minus.svg';
  import icon_faq_plus_dark from '../assets/investor/icon-faq-plus-dark.svg';
  import icon_faq_plus from '../assets/investor/icon-faq-plus.svg';

  import type { B_H_INVEST_TRS_Option } from '@betarena/scores-lib/types/_HASURA_.js';

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
    // eslint-disable-next-line no-unused-vars
    CNAME = 'profile⮕w⮕investfaq⮕child⮕row'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  export let
    /** @augments B_H_INVEST_TRS_Option */
    data: B_H_INVEST_TRS_Option
    /** @description 📣 target position of `this` row component */
    , position: number
  ;

  let
    /** @description 📣 wether `this` component is in an **show more** state */
    stateIsExpanded: boolean = false
    /** @description 📣 type `.svg` icon element */
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
  {
    if (stateIsExpanded)
      iconExpand = icon_faq_minus_dark
    else
      iconExpand = icon_faq_plus_dark
  }
  else
  {
    if (stateIsExpanded)
      iconExpand = icon_faq_minus
    else
      iconExpand = icon_faq_plus
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
  on:click={() => {return stateIsExpanded = !stateIsExpanded}}
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
    <p
      class=
      "
      s-16
      global
        color-grey
          grey-v1
      m-t-15
      <!---->
      faq-description
      "
    >
      {@html data.description}
    </p>
  {/if}

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

  div.profile⮕w⮕investfaq⮕child⮕row
  {
    /* 🎨 style */
    margin: 0 20px;
    padding: 20px 0;
    border-bottom: solid 1px var(--grey-color);

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

</style>
