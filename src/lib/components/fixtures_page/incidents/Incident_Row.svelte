<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { fade } from "svelte/transition";

	import { userBetarenaSettings } from '$lib/store/user-settings';
  
	import type {
		REDIS_CACHE_SINGLE_lineups_translation
	} from "$lib/models/fixtures/lineups/types";

	import type { EventsDatum } from "$lib/models/hasura";

  import football_red from './assets/football-red.svg';
  import football from './assets/football.svg';
  import inj_substitution from './assets/inj-substitution.svg';
  import penalty_miss from './assets/miss-penalty.svg';
  import penalty from './assets/penalty.svg';
  import red_card from './assets/red-card.svg';
  import substitution from './assets/substitution.svg';
  import var_red from './assets/var-red.svg';
  import w_inj_substitution from './assets/w-inj-substitution.svg';
  import w_substitution from './assets/w-substitution.svg';
  import yellow_card from './assets/yellow-card.svg';
  import yellowred_card from './assets/yellowred.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let INCIDENT_INFO:                 EventsDatum;
  export let FXITURE_INCIDENTS_TRANSLATION: REDIS_CACHE_SINGLE_lineups_translation;
  export let STATUS:                        string
  export let TYPE:                          'R' | 'L'

  let icon;

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (INCIDENT_INFO != undefined) {
    if (INCIDENT_INFO?.type == "goal") {
      icon = football
    }
    if (INCIDENT_INFO?.type == "own-goal") {
      icon = football_red
    }
    if (INCIDENT_INFO?.type == "substitution") {
      if (INCIDENT_INFO?.injuried) {
        if ($userBetarenaSettings.theme == 'Dark') {
          icon = w_inj_substitution
        }
        else {
          icon = inj_substitution
        }
      }
      else {
        if ($userBetarenaSettings.theme == 'Dark') {
          icon = w_substitution
        }
        else {
          icon = substitution
        }
      }
    }
    if (INCIDENT_INFO?.type == "yellowcard") {
      icon = yellow_card
    }
    if (INCIDENT_INFO?.type == "redcard") {
      icon = red_card
    }
    if (INCIDENT_INFO?.type == "yellowred") {
      icon = yellowred_card
    }
    if (INCIDENT_INFO?.type == "var") {
      icon = var_red
    }
    if (["penalty", "pen_shootout_goal"].includes(INCIDENT_INFO?.type)) {
      icon = penalty
    }
    if (["missed_penalty", "pen_shootout_miss"].includes(INCIDENT_INFO?.type)) {
      icon = penalty_miss
    }
  }

</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

{#if 
  INCIDENT_INFO != undefined 
  && FXITURE_INCIDENTS_TRANSLATION != undefined}

  <div 
    class="
      incident-row
    "
    class:type-L={TYPE == "L"}
    class:row-space-start={TYPE == "L"}
    class:type-R={TYPE == "R"}
    class:row-space-end={TYPE == "R"}
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
    in:fade>

    {#if TYPE == "L"}

      <!-- 
      [ℹ] default
      [ℹ] img-icon
      [ℹ] event minute -->
      <img
        src={icon}
        alt=""
        class="event-icon"
        width=18px
        height=18px
      />
      <p
        class="
          w-400
          color-grey
          minute-text
        "
        class:single-min={[...INCIDENT_INFO?.minute.toString()].length == 1}
        >
        {INCIDENT_INFO?.minute}'
      </p>

      {#if INCIDENT_INFO?.type == 'goal'}
        <!--
        [ℹ] result -->
        <p
          class="
            w-500
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.result == undefined}>
          {INCIDENT_INFO?.result}
        </p>
        <!--
        [ℹ] goal-scorer -->
        <p
          class="
            w-400
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
        <!--
        [ℹ] player-assist -->
        {#if INCIDENT_INFO?.related_player_name}
          <p
            class="
              w-400
              color-grey
            ">
            Assits: {INCIDENT_INFO?.related_player_name}
          </p>
        {/if}
      {/if}

      {#if INCIDENT_INFO?.type == 'own-goal'}
        <!--
        [ℹ] result -->
        <p
          class="
            w-500
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.result == undefined}>
          {INCIDENT_INFO?.result}
        </p>
        <!--
        [ℹ] goal-scorer -->
        <p
          class="
            w-400
            color-black-2
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
      {/if}

      {#if ['var','penalty', 'pen_shootout_goal'].includes(INCIDENT_INFO?.type)}
        <!--
        [ℹ] result -->
        <p
          class="
            w-500
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.result == undefined}>
          {INCIDENT_INFO?.result}
        </p>
        <!--
        [ℹ] goal-scorer -->
        <p
          class="
            w-400
            color-black-2
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
      {/if}

      {#if ['yellowcard','redcard','yellowred','missed_penalty', 'pen_shootout_miss'].includes(INCIDENT_INFO?.type)}
        <!--
        [ℹ] yewllow / red card-player 
        -->
        <p
          class="
            w-400
            color-black-2
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
      {/if}

      {#if INCIDENT_INFO?.type == 'substitution'}
        <!--
        [ℹ] in player -->
        <p
          class="
            w-400
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
        <!--
        [ℹ] out player -->
        <p
          class="
            w-400
            color-grey
          ">
          Out: {INCIDENT_INFO?.related_player_name}
        </p>
      {/if}

    {:else}
        
      {#if INCIDENT_INFO?.type == 'goal'}
        <!--
        [ℹ] player-assist -->
        {#if INCIDENT_INFO?.related_player_name}
          <p
            class="
              w-400
              color-grey
            ">
            Assits: {INCIDENT_INFO?.related_player_name}
          </p>
        {/if}
        <!--
        [ℹ] goal-scorer -->
        <p
          class="
            w-400
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
        <!--
        [ℹ] result -->
        <p
          class="
            w-500
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.result == undefined}>
          {INCIDENT_INFO?.result}
        </p>
      {/if}

      {#if INCIDENT_INFO?.type == 'own-goal'}
        <!--
        [ℹ] goal-scorer -->
        <p
          class="
            w-400
            color-black-2
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
        <!--
        [ℹ] result -->
        <p
          class="
            w-500
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.result == undefined}>
          {INCIDENT_INFO?.result}
        </p>
      {/if}

      {#if ['var','penalty', 'pen_shootout_goal'].includes(INCIDENT_INFO?.type)}
        <!--
        [ℹ] goal-scorer -->
        <p
          class="
            w-400
            color-black-2
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
        <!--
        [ℹ] result -->
        <p
          class="
            w-500
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.result == undefined}>
          {INCIDENT_INFO?.result}
        </p>
      {/if}

      {#if ['yellowcard','redcard','yellowred','missed_penalty', 'pen_shootout_miss'].includes(INCIDENT_INFO?.type)}
        <!--
        [ℹ] yewllow / red card-player -->
        <p
          class="
            w-400
            color-black-2
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
      {/if}

      {#if INCIDENT_INFO?.type == 'substitution'}
        <!--
        [ℹ] out player -->
        <p
          class="
            w-400
            color-grey
          ">
          Out: {INCIDENT_INFO?.related_player_name}
        </p>
        <!--
        [ℹ] in player -->
        <p
          class="
            w-400
            color-black-2
            result-text
          "
          class:display-none={INCIDENT_INFO?.player_name == undefined}>
          {INCIDENT_INFO?.player_name}
        </p>
      {/if}

      <!-- 
      [ℹ] default
      [ℹ] img-icon
      [ℹ] event minute 
      -->
      <p
        class="
          w-400
          color-grey
          minute-text
        "
        class:single-min={[...INCIDENT_INFO?.minute.toString()].length == 1}
        >
        {INCIDENT_INFO?.minute}'
      </p>

      <!--
      [ℹ] goal-icon 
      -->
      <img
        src={icon}
        alt=""
        class="event-icon"
        width=18px
        height=18px
      />

    {/if}
      
  </div>
{/if}

<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

  .display-none {
    display: none;
  }

  /* events row */
  div.incident-row {
    padding: 14px 0 4px 0;
    margin: 0 20px;
    width: -webkit-fill-available;
    width: -moz-available;
    border-bottom: 1px solid #E6E6E6;
  } div.incident-row p {
    font-size: 14px;
  } div.incident-row img.event-icon {
    margin-right: 8px;
  } div.incident-row p.minute-text {
    margin-right: 12px;
  } div.incident-row p.result-text {
    margin-right: 8px;
  } div.incident-row.type-R img.event-icon {
    margin-left: 8px;
    margin-right: 0;
  } div.incident-row.type-R p.minute-text {
    margin-left: 12px;
    margin-right: 0;
  } div.incident-row.type-R p.result-text {
    margin-left: 8px;
    margin-right: 0;
  }

  div.incident-row .single-min {
    margin-left: 4px;
    margin-right: 16px !important;
  } div.incident-row.type-R .single-min {
    margin-left: 16px !important;
    margin-right: 4px;
  }

  /* 
  MOBILE RESPONSIVNESS (&+) */
  @media only screen and (max-width: 425px) {
    /* EMPTY */
  }

  @media only screen and (max-width: 475px) {
    /* EMPTY */
  }

  /* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) and (max-width: 1240px) {
    /* EMPTY */
	}

  @media only screen and (min-width: 1240px) {
    /* EMPTY */
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

</style>