<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import type { REDIS_CACHE_SINGLE_h2h_translation } from '$lib/models/fixtures/head-2-head/types';
	import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';
	import { createEventDispatcher } from 'svelte';
  
  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  const dispatch = createEventDispatcher();

  export let FIXTURE_H2H_TRANSLATION: REDIS_CACHE_SINGLE_h2h_translation
  export let key: string
  export let value: number
  export let SPORTBOOK_INFO: Cache_Single_SportbookDetails_Data_Response
  export let type: 'overs' | 'ycavg' | 'btts' | 'corners'

  let h2h_translations = {
    'over_1_5_count': 'over_1_5',
    'over_2_5_count': 'over_2_5',
    'over_3_5_count': 'over_3_5',
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function trigger_google () {
		dispatch('google_click');
	}

</script>

<!-- ===============
  COMPONENT HTML 
=================-->

<div
  class="
    row-space-out
    bet-info-box
  ">
  <!-- 
  [ℹ] first-column
  -->
  <div
    style="width: 100%;">
    <p
      class="
        color-black-2
      ">
      {#if type == 'overs'}
        {FIXTURE_H2H_TRANSLATION?.[h2h_translations[key]]}
      {:else if type == 'ycavg'}
        {FIXTURE_H2H_TRANSLATION?.yellow_cards}
      {:else if type == 'corners'}
        {FIXTURE_H2H_TRANSLATION?.corners}
        {:else if type == 'btts'}
        {FIXTURE_H2H_TRANSLATION?.btts}
      {/if}
    </p>
    <div
      class="row-space-start">
      <p
        class="
          w-500
          color-black-2
          s-18
        ">
        {#if type == 'overs'
          || type == 'btts'}
          {(parseInt(value) / 5) * 100}%
        {:else if type == 'ycavg'
          || type == 'corners'}
          {(value / 5)}
        {/if}
      </p>
      <p
        class="
          color-grey
          sub-stat-info
        ">
        {#if type == 'overs'
          || type == 'btts'}
          {value} / 5 {FIXTURE_H2H_TRANSLATION?.matches}
        {:else if type == 'ycavg'
          || type == 'corners'}
          in 5 {FIXTURE_H2H_TRANSLATION?.matches}
        {/if}
      </p>
    </div>
  </div>
  <!-- 
  [ℹ] second-column [bet-info]
  -->
  <div
    class="row-space-end">
    <img 
      src={SPORTBOOK_INFO?.image}
      alt="{SPORTBOOK_INFO?.title} Logo"
      width="40"
      class="bet-site-logo"
    />
    <button
      class="
        place-bet-btn 
        btn-primary
      "
      on:click={() => trigger_google()}>
      <p
        class="
          w-500
        ">
        Follow Bet
      </p>
    </button>
  </div>
</div>

<!-- ===============
  COMPONENT STYLE
=================-->

<style>

  /* fixture bet info */
  div.bet-info-box {
    border-bottom: 1px solid #E6E6E6;
    padding: 12px 20px;
    margin: 0 -20px;
    width: -webkit-fill-available;
  } div.bet-info-box p.sub-stat-info {
    margin-left: 6px;
  } div.bet-info-box img.bet-site-logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  } div.bet-info-box button.place-bet-btn {
    height: 40px;
    width: 100%;
    background-color: #f5620f;
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
    border-radius: 8px;
    margin-left: 5px;
  } div.bet-info-box button.place-bet-btn p {
    font-size: 14px;
  } div.bet-info-box button.place-bet-btn:hover {
    background: #F77C42 !important;
  }

</style>