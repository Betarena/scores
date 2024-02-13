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

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';

	import TranslationText from '$lib/components/misc/Translation-Text.svelte';
	import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
	import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
	import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';
	import { scoresProfileInvestorStore } from './_store.js';

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
    WIDGET_DATA: IProfileData | null
  ;

  /**
   * @author
   *  @migbash
   * @summary
   *  🎪 TYPES | INTERFACE
   * @description
   *  📣 Type for `round data`.
   */
  interface IRoundData
  {
    title: string;
    data:
    {
      row_title: string;
      value: string;
    }[]
  }

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME: string = 'profile⮕w⮕investround⮕main'
  ;

  let
    /**
     * @description
     * 📣 threshold start + state for 📱 MOBILE
     */
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     * 📣 threshold start + state for 💻 TABLET
     */
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
    /**
     * @description
     *  📣 investor main information data
     */
    , roundData: IRoundData[] = []
    /**
     * @description
     *  📣 investor round date percentage progress
     */
    , progressPercentage: number = 0
    /**
     * @description
     *  📣 Target countdown layout format.
     */
    , countdownLayout: number[] = [3, 2, 1]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ globalActivePresaleStartClock, globalActivePresaleEndClock, roundStateWidget, adminOverrides } = $scoresProfileInvestorStore);

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
  if (roundStateWidget == 'Round_CountdownWithDefinedDate' && (globalActivePresaleStartClock?.[4] || 0) < 23)
    countdownLayout = [2, 1, 0]
  else if (roundStateWidget == 'Round_CountdownToFinish' && (globalActivePresaleEndClock?.[4] || 0) < 23)
    countdownLayout = [2, 1, 0]
  else
    countdownLayout = [3, 2, 1]
  // ──────────────────────────────────────────────────────────────────────────────────

  $:
  if (browser || $sessionStore.serverLang)
    roundData = [
      {
        title:
        (
          profileTrs?.investor?.round.details.token_info_title
          ?? 'Token Information'
        )
        , data:
        [
          {
            row_title:
            (
              profileTrs?.investor?.round.details.name_title
              ?? 'Name'
            )
            , value: WIDGET_DATA?.presaleData.data?.name ?? '-'
          }
          , {
            row_title:
            (
              profileTrs?.investor?.round.details.symbol_title
              ?? 'Symbol'
            )
            , value: WIDGET_DATA?.presaleData.data?.symbol ?? '-'
          }
          , {
            row_title:
            (
              profileTrs?.investor?.round.details.available_title
              ?? 'Available'
            )
            , value: WIDGET_DATA?.presaleData.data?.available ?? '-'
          }
        ]
      }
      , {
        title:
        (
          profileTrs?.investor?.round.details.presale_title
          ?? 'Pre-sale'
        )
        , data:
        [
          {
            row_title:
            (
              profileTrs?.investor?.round.details.start_date_title
              ?? 'Start Date'
            )
            , value: WIDGET_DATA?.presaleData.data?.start_date ?? '-'
          }
          , {
            row_title:
            (
              profileTrs?.investor?.round.details.end_date_title
              ?? 'End Date'
            )
            , value: WIDGET_DATA?.presaleData.data?.end_date ?? '-'
          }
        ]
      }
      , {
        title:
        (
          profileTrs?.investor?.round.details.investment_title
          ?? 'Investment Details'
        )
        , data:
        [
          {
            row_title:
            (
              profileTrs?.investor?.round.details.min_buy_title
              ?? 'Minimum Buy Amount'
            )
            , value: WIDGET_DATA?.presaleData.data?.min_buy ?? '-'
          }
          , {
            row_title:
            (
              profileTrs?.investor?.round.details.chain_title
              ?? 'Raising Platform'
            )
            , value: WIDGET_DATA?.presaleData.data?.chain ?? '-'
          }
          , {
            row_title:
            (
              profileTrs?.investor?.round.details.type_title
              ?? 'Type'
            )
            , value: WIDGET_DATA?.presaleData.data?.type ?? '-'
          }
          , {
            row_title:
            (
              profileTrs?.investor?.round.details.currencies_title
              ?? 'Accepted Currencies'
            )
            , value: WIDGET_DATA?.presaleData.data?.currencies ?? '-'
          }
        ]
      }
    ]
  // ──────────────────────────────────────────────────────────────────────────────────

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async (
    ): Promise < void > =>
    {
      progressPercentage = (parseInt(WIDGET_DATA?.presaleData.data?.current_value ?? '') / parseInt(WIDGET_DATA?.presaleData.data?.available ?? '')) * 100;
      if (progressPercentage > 100) progressPercentage = 100;

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  <AdminDevControlPanelToggleButton
    title='Rounds'
    mutated={adminOverrides.has('Rounds')}
    on:reset=
    {
      () =>
      {
        scoresProfileInvestorStore.updateAdminMutatedWidgets
        (
          'Rounds'
          , 'remove'
        );
        return;
      }
    }
  />

  <!--
  ▓ NOTE:
  ▓ > top box (parent)
  -->
  <div
    id="{CNAME}⮕top-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓ NOTE:
    ▓ > round data
    -->
    <div>

      <!--
      ▓ NOTE:
      ▓ > round number
      -->
      <p
        class=
        "
        {VIEWPORT_MOBILE_INIT[1] ? 's-20' : 's-24'}
        color-black-2
        w-500
        "
      >
        <TranslationText
          key={'profile/investor/round-title'}
          text={profileTrs?.investor?.round.round_title}
          fallback={'Round 1'}
        />
      </p>

      <!--
      ▓ NOTE:
      ▓ > presale text
      -->
      {#if ['Round_ToBeAnnounced', 'Round_CountdownWithDefinedDate', 'Round_CountdownToFinish'].includes(roundStateWidget)}
        <span
          class=
          "
          s-14
          color-grey
          w-400
          m-t-5
          "
        >
          {#if ['Round_ToBeAnnounced', 'Round_CountdownWithDefinedDate'].includes(roundStateWidget)}
            <TranslationText
              key={'profile/investor/round-title'}
              text={profileTrs?.investor?.round.round_description}
              fallback={'Presale starts in'}
            />
          {:else if roundStateWidget == 'Round_CountdownToFinish'}
            <TranslationText
              key={'profile/investor/round-title'}
              text={profileTrs?.investor?.round.progress_title}
              fallback={'Presale ends in'}
            />
          {/if}
        </span>
      {/if}

    </div>

    <!--
    ▓ NOTE:
    ▓ > countdown (parent)
    -->
    {#if ['Round_CountdownWithDefinedDate', 'Round_CountdownToFinish'].includes(roundStateWidget)}

      <!--
      ▓ NOTE:
      ▓ > countdown (parent)
      -->
      <div
        id="countdown-box-parent"
      >

        <!--
        ▓ NOTE:
        ▓ > countdown [d,h,m,s]
        -->
        {#each countdownLayout as item}

          <div
            class=
            "
            countdown-box-child
            "
          >
            <p
              class=
              "
              s-16
              w-500
              color-black-2
              "
            >
              {
                roundStateWidget == 'Round_CountdownWithDefinedDate'
                  ? globalActivePresaleStartClock?.[item]
                  : globalActivePresaleEndClock?.[item]
              }
              {#if item == 3}
                d
              {:else if item == 2}
                h
              {:else if item == 1}
                m
              {:else if item == 0}
                s
              {/if}
            </p>
          </div>

        {/each}

      </div>

    {:else}

      <!--
      ▓ NOTE:
      ▓ > round state (parent)
      -->
      <div
        id="round-info-box-parent"
      >
        <p
          class=
          "
          s-16
          w-400
          color-grey
            dark-v1
          "
        >
          {#if roundStateWidget == 'Round_ToBeAnnounced'}
            <TranslationText
              key={'profile/investor/round-title'}
              text={profileTrs?.investor?.round.round_description}
              fallback={'Date To Be Announced'}
            />
          {:else if roundStateWidget == 'Round_InviteOnly'}
            <TranslationText
              key={'profile/investor/round-title'}
              text={profileTrs?.investor?.round.date_message}
              fallback={'Invite Only'}
            />
          {:else if roundStateWidget == 'Round_Ended'}
            <TranslationText
              key={'profile/investor/round-title'}
              text={profileTrs?.investor?.round.details.end_message}
              fallback={'Raised'}
            />
          {/if}
        </p>
      </div>

    {/if}

  </div>

  <!--
  ▓ NOTE:
  ▓ > middle box (parent)
  -->
  <div
    id="{CNAME}⮕middle-box"
  >

    <!--
    ▓ NOTE:
    ▓ > progress box (parent)
    -->
    <div>

      <!--
      ▓ NOTE:
      ▓ > progress title + progress percentage
      -->
      <div
        class=
        "
        row-space-out
        m-b-16
        "
      >
        <!--
        ▓ NOTE:
        ▓ > progress title
        -->
        <p
          class=
          "
          s-20
          w-500
          color-black-2
          "
        >
          <TranslationText
            key={'profile/investor/round-title'}
            text={profileTrs?.investor?.round.progress_title}
            fallback={'Progress'}
          />
        </p>

        <!--
        ▓ NOTE:
        ▓ > progress percetage
        -->
        <p
          class=
          "
          s-20
          w-500
          color-green-1
          "
        >
          {toDecimalFix(progressPercentage)}%
        </p>
      </div>

      <!--
      ▓ NOTE:
      ▓ > progress bar
      -->
      <div
        id="progress-bar"
        class=
        "
        m-b-16
        "
      >
        <div
          style="width: {progressPercentage}%;"
        />
      </div>

      <!--
      ▓ NOTE:
      ▓ > progress funds + progress limit
      -->
      <div
        class=
        "
        row-space-out
        "
      >
        <!--
        ▓ NOTE:
        ▓ > progress funds
        -->
        <p
          class=
          "
          s-16
          color-grey
            grey-v1
          "
        >
          <TranslationText
            key={'profile/investor/round-title'}
            text={profileTrs?.investor?.round.current_value_title}
            fallback={'Raised'}
          />
          <span
            class=
            "
            color-black-2
            w-600
            "
          >
            <!-- ${WIDGET_DATA?.txProgressRaised} -->
            ${WIDGET_DATA?.presaleData.data?.current_value ?? '-'}
          </span>
        </p>

        <!--
        ▓ NOTE:
        ▓ > progress limit
        -->
        <p
          class=
          "
          s-12
          color-grey
            grey-v1
          "
        >
          <TranslationText
            key={'profile/investor/round-title'}
            text={profileTrs?.investor?.round.max_title}
            fallback={'Unlimited'}
          />
        </p>
      </div>

    </div>

    <!--
    ▓ NOTE:
    ▓ > token information section (parent)
    -->
    <div>

      {#each roundData ?? [] as item}

        <!--
        ▓ NOTE:
        ▓ > token information segment title
        -->
        <p
          class=
          "
          s-16
          color-black-2
          w-500
          m-t-25
          m-b-8
          "
        >
          {item.title}
        </p>

        <!--
        ▓ NOTE:
        ▓ > token information row(s)
        -->
        <div
          class=
          "
          token-info-box
          "
        >

          {#each item.data ?? [] as subItem}

            <div
              class=
              "
              row-space-out
              <!---->
              token-info-row
              "
            >
              <!--
              ▓ NOTE:
              ▓ > token row title
              -->
              <p
                class=
                "
                {VIEWPORT_MOBILE_INIT[1] ? 's-12' : 's-14'}
                color-grey
                  grey-v1
                "
              >
                {subItem.row_title ?? ''}
              </p>

              <!--
              ▓ NOTE:
              ▓ > token row title
              -->
              <p
                class=
                "
                s-16
                color-black-2
                w-400
                "
              >
                {subItem.value ?? ''}
              </p>

            </div>

          {/each}

        </div>

      {/each}

    </div>

  </div>

</div>

<!--
▓ NOTE:
▓ > (widget) admin development state UI change control panel.
-->
<AdminDevControlPanel
  title='Rounds'
>

  <!--
  ▓ NOTE:
  ▓ > (select) widget state.
  -->
  <div
    class=
    "
    row-space-out
    "
  >
    <!--
    ▓ NOTE:
    ▓ > (text) target action.
    -->
    <p
      class=
      "
      s-14
      color-black
      "
    >
      <b>[1]</b> Choose <b>Widget State</b>
    </p>

    <!--
    ▓ NOTE:
    ▓ > (action) target select.
    -->
    <select
      id="cars"
      name="cars"
      bind:value={$scoresProfileInvestorStore.roundStateWidget}
      on:change=
      {
        () =>
        {
          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'Rounds'
            , 'set'
          );
          return;
        }
      }
    >
      <option value="Round_InviteOnly">Invite Only</option>
      <option value="Round_ToBeAnnounced">To Be Announced</option>
      <option value="Round_CountdownWithDefinedDate">Countdown With Defined Date</option>
      <option value="Round_CountdownToFinish">Countdown To Finish</option>
      <option value="Round_Ended">Round Ended</option>
    </select>
  </div>

</AdminDevControlPanel>

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

  div#profile⮕w⮕investround⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    border-radius: 12px;
    overflow: hidden;
    height: fit-content;

    &⮕top-row
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      padding: 15px 20px;
      height: 92px;
      max-height: 92px;
      min-height: 92px;
      background: var(--white);
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      /* z-index: 10; */

      div#countdown-box-parent
      {
        /* 📌 position */
        position: relative;
        /* 🎨 style */
        border-radius: 4px;
        overflow: hidden;
        /* 🛝 layout */
        display: grid;
        gap: 2px;
        grid-auto-flow: column;
      }

      div.countdown-box-child
      {
        /* 📌 position */
        position: relative;
        /* 🎨 style */
        padding: 17px 0;
        background: var(--whitev2);
        width: 60px;
        height: 60px;
        text-align: center;
      }

      div#round-info-box-parent
      {
        /* 📌 position */
        position: relative;
        /* 🎨 style */
        padding: 20px;
        border-radius: 4px;
        background: var(--whitev2);
        width: fit-content;
        height: 60px;
      }
    }

    &⮕middle-box
    {
      /* 🎨 style */
      padding: 20px;
      background: var(--white);
      display: grid;
      gap: 12px;

      div#progress-bar
      {
        /* 🎨 style */
        height: 6px;
        border-radius: 12px;
        width: 100%;
        background-color: var(--grey-color);

        > div
        {
          /* 🎨 style */
          background: var(--green-1);
          box-shadow: 0px 0px 12px 0px rgba(77, 160, 37, 0.32);
          /* width: 40%; */ /* Adjusted with JavaScript */
          height: 6px;
          border-radius: 12px;
        }
      }

      div.token-info-box div.token-info-row
      {
        /* 🎨 style */
        border-radius: 4px;
        padding: 10px 20px;
        height: 40px;

        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: var(--whitev2);
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investround⮕main
  {

    &.dark-background-1 &⮕top-row
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);

      div.countdown-box-child
      {
        /* 🎨 style */
        background: var(--dark-theme-1-4-shade);
      }

      div#round-info-box-parent
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1-4-shade);
      }
    }

    &.dark-background-1 &⮕middle-box
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade);

      div#progress-bar
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1);
      }

      div.token-info-box div.token-info-row:nth-child(odd)
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1);
      }
    }

  }

</style>
