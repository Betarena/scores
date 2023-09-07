<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';

	import type { B_COMP_HIGH_D, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description competition (shared) - target competition data */
    B_COMP_HIGH_D: B_COMP_HIGH_D,
    /** @description competition (shared) - target competition translations */
    WIDGET_T_DATA: B_COMP_HIGH_T
  ;

  const
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'shared⮕w⮕countdown-status'
  ;

  let
    /** @description competition highlights - target widget date difference with `competition start` */
    dateDiff: number = 0,
    /** @description TODO: DOC: */
    showCountdown: boolean = true
  ;

  $: countDownSec = Math.floor((dateDiff / 1000) % 60);
	$: countDownMin = Math.floor((dateDiff / 1000 / 60) % 60);
	$: countDownHour = Math.floor((dateDiff / (1000 * 60 * 60)) % 24);
	$: countDownTestHour = Math.floor(dateDiff / (1000 * 60 * 60));

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * TODO: DOC:
   */
  function setCountdown
  (
  ): void
  {
    dateDiff = toCorrectDate(B_COMP_HIGH_D?.fixture?.time).getTime() - new Date().getTime();
    setInterval
    (
      () =>
      {
        dateDiff = toCorrectDate(B_COMP_HIGH_D?.fixture?.time).getTime() - new Date().getTime();
      },
      1000
    );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    () =>
    {
      setCountdown();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
COMPETITION COUNTDOWN / STATUS
-->
<div
  id="{CNAME}⮕main"
  class=
  "
  width-auto
  "
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  class:row-space-out={showCountdown}
>

  <!--
  UPCOMING COMPETITION START
  -->
  {#if !showCountdown && B_COMP_HIGH_D?.competition?.data?.status == 'pending'}
    <p
      class=
      "
      s-14
      color-black-2
      w-500
      text-center
      "
    >
      {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getDate()}/
      {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getMonth()}/
      {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getFullYear()}
      -
      {toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getHours()}
      {toZeroPrefixDateStr(toCorrectDate(B_COMP_HIGH_D?.fixture?.time)?.getMinutes())}
    </p>
  {/if}

  <!--
  COUNTDOWN
  -->
  {#if showCountdown}

    <!--
    COUNTDOWN START TEXT
    -->
    <p
      class=
      "
      s-14
      color-black-2
      w-500
      no-wrap
      m-r-24
      "
    >
      {WIDGET_T_DATA?.timer ?? 'Starts in:'}
    </p>

    <!--
    COUNTDOWN TIMER
    -->
    <div
      id="{CNAME}⮕countdown-main-box"
      class=
      "
      width-auto
      row-space-out
      "
    >

      <!--
      HOURS
      -->
      <div
        class=
        "
        time-box
        text-center
        "
      >
        <p
          class=
          "
          s-12
          w-500
          color-black-2
          "
        >
          {countDownHour < 0 ? '00' : toZeroPrefixDateStr(countDownHour?.toString())}h
        </p>
      </div>

      <!--
      MINUTES
      -->
      <div
        class=
        "
        time-box
        text-center
        "
      >
        <p
          class=
          "
          s-12
          w-500
          color-black-2
          "
        >
          {countDownMin < 0 ? '00' : toZeroPrefixDateStr(countDownMin?.toString())}min
        </p>
      </div>

      <!--
      SECONDS
      -->
      <div
        class=
        "
        time-box
        text-center
        "
      >
        <p
          class=
          "
          s-12
          w-500
          color-black-2
          "
        >
          {countDownSec < 0 ? '00' : toZeroPrefixDateStr(countDownSec?.toString())}s
        </p>
      </div>

    </div>

  {/if}

  <!--
  ACTIVE STATE
  -->
  {#if !showCountdown && B_COMP_HIGH_D?.competition?.data?.status == 'active'}
    {'Playing'}
  {/if}

</div>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  div#shared⮕w⮕countdown-status⮕main
  {
    /* 🎨 style */
    min-height: 40px;
    max-height: 40px;
    border-radius: 8px;
    background: var(--whitev2);
    padding: 4px 4px 4px 12px;
  }
  div.time-box
  {
    /* 🎨 style */
    width: 60px;
    height: 32px;
    padding: 6px 0px;
    border-radius: 4px 0px 0px 4px;
    background-color: var(--white);
    margin-right: 2px;
  }
  div#shared⮕w⮕countdown-status⮕countdown-main-box div.time-box:last-child
  {
    /* 🎨 style */
    margin: 0;
    border-radius: 0px 4px 4px 0px;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#shared⮕w⮕countdown-status⮕main.dark-background-1
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  .dark-background-1 div.time-box
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade);
  }

</style>
