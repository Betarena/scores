<script lang="ts">
	import { page } from "$app/stores";
	import { toCorrectDate, toCorrectISO, toZeroPrefixDateStr } from "$lib/utils/dates.js";
	import { platfrom_lang_ssr } from "$lib/utils/platform-functions";
	import { FIXTURE_FULL_TIME_OPT, FIXTURE_LIVE_TIME_OPT } from "@betarena/scores-lib/dist/api/sportmonks";
	import type { PFIX_C_Fixture } from "@betarena/scores-lib/types/player-fixtures";
	import { onMount } from "svelte";
	import FixturesRowEvent from "./Fixtures-Row-Event.svelte";

  export let fixture: PFIX_C_Fixture;
  
	let ratingColorCode: string;
	let tickSecShow: boolean = false;
  const today = new Date()
  const mobileExclusive: boolean = false;

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  onMount(() => {
    setInterval(async () => {
      tickSecShow = !tickSecShow;
    }, 500);
  })

  $: if (
		fixture != undefined &&
		fixture?.player?.rating != undefined
	) {
    ratingColorCode = 'T';
    if (parseFloat(fixture?.player?.rating) >= 9) ratingColorCode = 'G';
    if (parseFloat(fixture?.player?.rating) >= 7) ratingColorCode = 'Y';
	} else {
    ratingColorCode = 'F';
	}

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  class="
    row-space-out
    fixture-row 
  "
>

  <!-- 
  [ℹ] fixture left-side container 
  -->
  <div
    class="row-space-start">
    <!-- 
    [ℹ] fixture LIVE minute box
    -->
    <div
      class="
        m-r-8
        fixture-time-box 
        text-center
      "
    >
      <!-- 
      [ℹ] fixture == LIVE | minute show
      -->
      {#if fixture?.status === 'LIVE'}
        {#if toCorrectISO(today) != toCorrectISO(fixture?.fixture_day)}
          <p
            class="
              no-wrap
              s-12 
              color-grey
              dark-theme-custom-1
            "
          >
            {toCorrectDate(fixture?.fixture_day).getDate()/toCorrectDate(fixture?.fixture_day).getMonth()}
          </p>
        {/if}
        <p
          class="
            s-12 
            no-wrap
            color-red-bright
          "
        >
          {fixture?.minute || '0'}
          <span
            class:visibility-none={tickSecShow}
            >'
          </span>
        </p>
      <!--
      [ℹ] fixture == HT | abbrv show
      -->
      {:else if fixture?.status === 'HT'}
        <p
          class="
            no-wrap 
            s-12 
            color-red-bright
          "
        >
          {fixture?.status}
          <!-- {WIDGET_T_DATA?.status_abbrev?.HT} -->
        </p>
      <!-- 
      [ℹ] fixture == FT | show TIME + abbrv show
      -->
      {:else}
        <p
          class="
            no-wrap 
            s-12 
            color-black-2
            dark-theme-custom-1
          "
          class:color-grey={['FT','FT_PEN','AET'].includes(fixture?.status)}
        >
          <!-- DD/MM -->
          {
            toZeroPrefixDateStr(toCorrectDate(fixture?.time).getDate())
            + '/'
            + toZeroPrefixDateStr(toCorrectDate(fixture?.time).getMonth() + 1)
          }
          <br/>
          <!-- yyyy -->
          {
            toCorrectDate(fixture?.time).getFullYear()
          }
        </p>
      {/if}
    </div>

    <!-- 
    [ℹ] fixture-teams with FIXTURE-LINK
    FIXME: syntax error
    -->
    <a
      href={fixture?.urls == undefined ? '' : fixture?.urls[server_side_language].replace('https://scores.betarena.com','')}
      class="width-auto"
      class:disable-anchor={fixture?.urls == undefined || fixture?.urls[server_side_language] == undefined}
      >
      <div
        class="
          column-start-grid-start 
          fixture-teams-box
          cursor-pointer
        "
      >
        <!-- 
        [ℹ] fixture home team box
        -->
        <div
          class="row-space-start"
        >
          <!-- 
          [ℹ] fixture home team name
          -->
          <p
            class="
              s-14 
              color-black-2
              w-500 
              m-r-8 
              teams-text
            "
            class:team-name-txt-mobile={mobileExclusive}
            class:team-lost-style={fixture?.teams?.home?.score < fixture?.teams?.away?.score}
          >
            {fixture?.teams?.home?.name}
          </p>
        </div>
        <!-- 
        [ℹ] fixture away team box
        -->
        <div
          class="row-space-start"
        >
          <!-- 
          [ℹ] fixture away team name
          -->
          <p
            class="
              s-14 
              color-black-2 
              w-500 
              m-r-8 
              teams-text
            "
            class:team-lost-style={fixture?.teams?.away?.score < fixture?.teams?.home?.score}
            class:team-name-txt-mobile={mobileExclusive}
          >
            {fixture?.teams?.away?.name}
          </p>
        </div>
      </div>
    </a>
  </div>
  <!-- 
  [ℹ] fixture right-side container 
  -->
  <div
    class="row-space-end"
    style="width: auto;"
  >
    <!-- 📱 MOBILE & 💻 TABLET  -->
    <div
      class="
        events-grid
      ">
      <!-- 
      fixture (player) redcards
      -->
      {#if fixture?.player?.events?.red_card}
        <FixturesRowEvent 
          event={"redcard"}
          eventNum={fixture?.player?.events?.red_card}
        />
      {/if}
      <!-- 
      fixture (player) yellowcards
      -->
      {#if fixture?.player?.events?.yeallow_card}
        <FixturesRowEvent 
          event={"yellowcard"}
          eventNum={fixture?.player?.events?.yeallow_card}
        />
      {/if}
      <!-- 
      fixture (player) penalty
      -->
      {#if fixture?.player?.events?.penalty}
        <FixturesRowEvent 
          event={"penalty"}
          eventNum={fixture?.player?.events?.penalty}
        />
      {/if}
      <!-- 
      fixture (player) goals
      -->
      {#if fixture?.player?.events?.goals}
        <FixturesRowEvent 
          event={"goal"}
          eventNum={fixture?.player?.events?.goals}
        />
      {/if}
      <!-- 
      fixture (player) captain
      -->
      {#if fixture?.player?.captain}
        <FixturesRowEvent 
          event={"captain"}
          eventNum={0}
        />
      {/if}
    </div>

    <!-- 
    [ℹ] fixture scores BOX SHOW/HIDE
    -->
    {#if (fixture?.teams?.away?.score && fixture?.teams?.home?.score) 
      || [...FIXTURE_FULL_TIME_OPT, ...FIXTURE_LIVE_TIME_OPT].includes(fixture?.status)}
      <div
        class="
          column-space-center 
          fixtures-scores-box
        "
      >
        <!-- 
        [ℹ] home score
        -->
        <p
          class="
            s-14 
            color-black-2
          "
          class:team-lost-style={fixture?.teams?.home?.score < fixture?.teams?.away?.score && fixture?.status !='LIVE'}
          class:color-red-bright={fixture?.status === 'LIVE'}
        >
          {fixture?.teams?.home?.score}
        </p>
        <!-- 
        [ℹ] away score
        -->
        <p
          class="
            s-14 
            color-black-2
          "
          class:team-lost-style={fixture?.teams?.away?.score < fixture?.teams?.home?.score && fixture?.status != 'LIVE'}
          class:color-red-bright={fixture?.status === 'LIVE'}
        >
          {fixture?.teams?.away?.score}
        </p>
      </div>
    {/if}
    <!-- 
    fixture (player) rating
    -->
      <p
        id="box-goals"
        class="
          s-14 
          w-500
          m-l-10
        "
        class:rating_golden={ratingColorCode === 'G'}
        class:rating_silver={ratingColorCode === 'Y'}
        class:rating_bronze={ratingColorCode === 'T'}
        class:rating_nan={ratingColorCode === 'F'}
      >
      {#if fixture?.player?.rating == undefined || parseInt(fixture?.player?.rating) == 0}
        N/A
      {:else}
        {fixture?.player?.rating}
      {/if}
    </p>
  </div>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div.fixture-row {
    padding: 5px 16px 5px 8px;
  }

  div.fixture-teams-box {
		border-left: 1px var(--grey-color) solid;
		padding-left: 8px;
	} div.fixture-teams-box p.teams-text{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 85px;
	} div.fixture-teams-box:hover p.teams-text{
    color: var(--primary) !important;
  }

  div.events-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    direction: rtl;
    gap: 8px 0;
  }

  div.fixtures-scores-box {
    min-width: 29px;
    max-width: 29px;
    padding: 0 11px;
    border-left: 1px solid var(--grey-shade);
    border-right: 1px solid var(--grey-shade);
  }

  .team-lost-style {
    color: var(--grey) !important;
  }

  span.visibility-none {
		visibility: hidden;
	}

  div.fixture-row p#box-goals {
		box-sizing: border-box;
		text-align: center;
		border-radius: 12px;
		padding: 1.5px 8px;
		max-height: 24px;
    min-width: 44px;
		width: auto;
		color: var(--white);
	}
	div.fixture-row p#box-goals.rating_golden {
		background-color: #ffb904 !important;
	}
	div.fixture-row p#box-goals.rating_silver {
		background-color: #8c8c8c !important;
	}
	div.fixture-row p#box-goals.rating_bronze {
		background-color: #dbb884 !important;
	}
  div.fixture-row p#box-goals.rating_nan {
		background-color: var(--whitev2);
    color: var(--grey);
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen
    and (min-width: 375px) {
    div.fixture-teams-box p.teams-text{
      max-width: unset;
    }
  }

  @media only screen
    and (min-width: 475px) {

    div.fixture-row {
      padding: 5px 16px;
    }
    div.fixture-time-box { 
      margin-right: 16px;
      min-width: 47px;
      max-width: 47px;
    } div.fixture-time-box p {
      font-size: 14px;
    } 
    div.fixture-teams-box {
      padding-left: 16px;
    }
    div.fixtures-scores-box {
      min-width: 37px;
      max-width: 37px;
    } div.fixtures-scores-box p {
      font-size: 14px;
      font-weight: 500;
    }

    div.events-grid {
      grid-auto-flow: column;
    }

  }

  /*
  =============
  DARK-THEME
  =============
  */

  :global(.dark-background div.fixtures-scores-box) {
    width: 14px;
    padding: 0 20px;
    border-left: 1px solid var(--dark-theme-1-shade) !important;
    border-right: 1px solid var(--dark-theme-1-shade) !important;
  }

  :global(.dark-background div.fixture-teams-box) {
		border-left: 1px var(--dark-theme-1-shade) solid !important;
	}

  :global(.dark-background div.fixture-row p#box-goals) {
    color: var(--dark-theme-1) !important;
  }

  :global(.dark-background div.fixture-row p#box-goals.rating_nan) {
		background-color: var(--dark-theme-1-shade) !important;
    color: var(--dark-theme-1-3-shade) !important;
  }

</style>