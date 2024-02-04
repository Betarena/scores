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

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { ddMMyyFormat } from '$lib/utils/dates.js';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';
  import icon_arrow_down_dark from '../assets/investor/arrow-down-dark.svg';
  import icon_arrow_up_dark from '../assets/investor/arrow-up-dark.svg';

	import type { PUBLIC__INVESTOR_IReferralHistory } from '@betarena/scores-lib/types/_HASURA_.js';

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
     * @augments PUBLIC__INVESTOR_IReferralHistory
     */
    data: PUBLIC__INVESTOR_IReferralHistory
    /**
     * @description
     *  📣
    */
    , VIEWPORT_MOBILE_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣
    */
    , VIEWPORT_TABLET_INIT_PARENT: [ number, boolean ]
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /**
     * @description
     *  📣 Wether extra information is toggled (mobile only).
    */
    isTxExtraInfo: boolean = false
    /**
     * @description
     *  📣 Properties to be shown in mobile view.
    */
    , mobileProps: string[] = [ 'Date' ]
  ;

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

<tr
  class:extra-info={isTxExtraInfo && VIEWPORT_MOBILE_INIT_PARENT[1]}
  on:click={() => {return isTxExtraInfo = !isTxExtraInfo}}
>

  <!--
  ▓ NOTE:
  ▓ > vesting period 'id'
  -->
  <td>
    <p>
      {data.id ?? '-'}
    </p>
  </td>

  <!--
  ▓ NOTE:
  ▓ > referral history 'bonus (%)'.
  -->
  <td>
    <p>
      {data.bonus_percentage ?? '-'}%
    </p>
  </td>

  <!--
  ▓ NOTE:
  ▓ > referral history 'bonus (BTA)'.
  -->
  <td>
    <p>
      {data.bonus_bta ?? '-'}
    </p>
  </td>

  <!--
  ▓ NOTE: ▓ 💻 TABLET
  ▓ > target columns.
  -->
  {#if !VIEWPORT_MOBILE_INIT_PARENT[1]}

    <!--
    ▓ NOTE:
    ▓ > referral history 'bonus (BTA)'.
    -->
    <td>
      <p>
        {
          data.date
            ? ddMMyyFormat
            (
              data.date
            )
            : '-'
        }
      </p>
    </td>

  {/if}

  <!--
  ▓ NOTE:
  ▓ > 📱 MOBILE
  -->
  {#if VIEWPORT_MOBILE_INIT_PARENT[1]}
    <td>
      <img
        src=
        {
          isTxExtraInfo
            ? ($userBetarenaSettings.theme == 'Dark') ? icon_arrow_down_dark : icon_arrow_down
            : ($userBetarenaSettings.theme == 'Dark') ? icon_arrow_up_dark : icon_arrow_up
        }
        alt={isTxExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
        class=
        "
        cursor-pointer
        m-l-8
        "
        style=
        "
        float: right;
        "
      />
    </td>
  {/if}

  <!--
  ▓ NOTE:
  ▓ > extra hidden data 📱 MOBILE layout
  -->
  {#if isTxExtraInfo && VIEWPORT_MOBILE_INIT_PARENT[1]}

    <div
      class=
      "
      extra-information
      "
    >
      {#each mobileProps as item}

        <!--
        ▓ NOTE:
        ▓ > target transaction further data row.
        -->
        <div
          class=
          "
          m-b-8
          row-space-out
          "
        >

          <!--
          ▓ NOTE:
          ▓ > target transaction property title.
          -->
          <p
            class=
            "
            s-12
            color-grey
            "
          >
            {#if item == 'Date'}
              Date
            {/if}
          </p>

          <!--
          ▓ NOTE:
          ▓ > target transaction property value.
          -->
          <p
            class=
            "
            s-14
            color-black-2
            "
          >
            {#if item == 'Date'}
              {
                data.date
                  ? ddMMyyFormat
                  (
                    data.date
                  )
                  : '-'
              }
            {/if}
          </p>

        </div>

      {/each}
    </div>

  {/if}

</tr>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  // ▓ IMPORTANT
  // ▓ > Controlled By Parent

</style>
