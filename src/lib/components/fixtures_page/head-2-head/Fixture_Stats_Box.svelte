<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import type { REDIS_CACHE_SINGLE_h2h_translation } from '$lib/models/fixtures/head-2-head/types';
	import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
  
  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  const dispatch = createEventDispatcher();

  export let FIXTURE_H2H_TRANSLATION: REDIS_CACHE_SINGLE_h2h_translation
  export let key: string
  export let value: number
  export let SPORTBOOK_INFO: Cache_Single_SportbookDetails_Data_Response
  export let type: 'overs' | 'ycavg' | 'btts' | 'corners'
  export let imageVar: string;
  
  let toggleCTA:         boolean = false;

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

  function toggle_cta () {
    toggleCTA = !toggleCTA
  }

  function closeAllDropdowns() {
    toggleCTA = false;
  }

</script>

<!-- ===============
  COMPONENT HTML 
=================-->

<!-- 
[ℹ] area-outside-for-close 
-->
{#if toggleCTA}
  <div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}

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
          {(value / 5).toPrecision(2)}
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
    <!-- 
    [ℹ] bet site info
    -->
    <a 
      rel="nofollow"
      aria-label="fixtures_football_fixtures_h2h"
      on:click={() => trigger_google()}
      href={SPORTBOOK_INFO?.register_link}
      target="_blank"
      style="width: fit-content;">
      <img 
        src={SPORTBOOK_INFO?.image}
        alt="{SPORTBOOK_INFO?.title} Logo"
        width="40"
        class="bet-site-logo"
      />
    </a>
    <!-- 
    [ℹ] bet site extra pop-up
    -->
    <div
      id='button-extra-info-container'>

      <button
        class="
          place-bet-btn 
          btn-primary
        "
        on:click={() => toggle_cta()}>
        <p
          class="
            w-500
          ">
          Follow Bet
        </p>
      </button>

      <!-- 
      [ℹ] extra-info pop-up container
      -->
      {#if toggleCTA}
        <div
          class="extra-info" 
          in:fade>

          <!--  
          [ℹ] site-image 
          -->
          <a 
            rel="nofollow"
            aria-label="fixtures_football_fixtures_h2h"
            on:click={() => trigger_google()}
            href={SPORTBOOK_INFO?.register_link}
            target="_blank"
            style="width: inherit;">
            <img
              style="background-color: var({imageVar});"
              class="extra-info-img"
              src={SPORTBOOK_INFO?.image}
              alt={SPORTBOOK_INFO?.title}
            />
          </a>

          <!--  
          [ℹ] extra-site info 
          -->
          <div
            class="extra-info-container">
            <!--  
            [ℹ] text 
            -->
            <p 
              class="large">
              {SPORTBOOK_INFO?.bonus_description}
            </p>
            <!--  
            [ℹ] button_cta 
            -->
            <a 
              rel="nofollow"
              aria-label="fixtures_football_fixtures_h2h"
              on:click={() => trigger_google()}
              href={SPORTBOOK_INFO?.register_link}
              target="_blank">
              <button
                class="btn-primary btn-cta"
                style="width: 100% !important;">
                <p 
                  class="w-500 s-14 w-normal">
                  Register
                </p>
              </button>
            </a>
            <!--  
            [ℹ] extra-site info text 
            -->
            <p 
              class="small" 
              style="color: #CCCCCC;">
              {SPORTBOOK_INFO?.information}
            </p>
          </div>
        </div>
      {/if}

    </div>
  </div>
</div>

<!-- ===============
  COMPONENT STYLE
=================-->

<style>
  
  /* [ℹ] OTHER STYLE / CSS */
  #background-area-close {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 998;
  }

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
    padding: 10px 24px;
  } div.bet-info-box button.place-bet-btn p {
    font-size: 14px;
  } div.bet-info-box button.place-bet-btn:hover {
    background: #F77C42 !important;
  }

  /* extra bet info button */
  #button-extra-info-container {
    position: relative;
    width: 100%;
  } .extra-info-container {
    padding: 20px;
    display: grid;
    justify-items: stretch;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
  } .extra-info-container p {
    color: white;
  } .extra-info {
    background: #4b4b4b;
    box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
    border-radius: 8px;
    top: 105%;
    max-width: 289px;
    width: 289px;
    display: grid;
    z-index: 999;
    justify-items: center;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  } .extra-info-img {
    width: 100%;
    object-fit: contain;
    height: 40px;
  } .btn-cta {
    border-radius: 8px !important;
    margin-top: 32px;
    margin-bottom: 16px;
    padding: 11.5px !important;
    width: -webkit-fill-available;
  }

</style>