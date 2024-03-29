<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { MONTH_NAMES_ABBRV } from '$lib/utils/dates.js';
	import { viewport_change } from '$lib/utils/platform-functions';

	import ProfileStat from './Profile-Stat.svelte';

	import sessionStore from '$lib/store/session.js';
	import type { FPPT_Data } from '@betarena/scores-lib/types/hasura';
	import type { B_PPRO_D } from '@betarena/scores-lib/types/player-profile';
	import type { B_SAP_D1, B_SAP_D2 } from "@betarena/scores-lib/types/seo-pages";

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PPRO_D

  let WIDGET_T_DATA: FPPT_Data = $page.data?.B_PPRO_T;
  let B_SAP_D1: B_SAP_D1 = $page.data.B_SAP_D1;
  let B_SAP_D2: B_SAP_D2 = $page.data?.B_SAP_D2;

  $: WIDGET_T_DATA = $page.data?.B_PPRO_T;
  $: B_SAP_D1 = $page.data.B_SAP_D1;
  $: B_SAP_D2 = $page.data?.B_SAP_D2;

  let birthdayStr = ""

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function do_something() {}

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 767;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]


  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  $: if (WIDGET_DATA?.data?.birthdate != undefined) {
    const date = new Date(WIDGET_DATA?.data?.birthdate)
    birthdayStr = `${date.getDate()} ${B_SAP_D2.months_abbreviation[MONTH_NAMES_ABBRV[date.getMonth()]]} ${date.getFullYear()}`
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
IMPORTANT Mobile First
=================-->

<div>
  <div
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    player avatar / name
    -->
    <div
      class="
        row-space-out
      "
      class:m-b-16={tabletExclusive}
    >
      <!--
      player profile (col) [#1]
      -->
      <div
        class="
          row-space-start
          width-auto
        "
        class:m-r-20={!mobileExclusive}
      >
        <!--
        player img
        -->
        <img
          id="player-avatar"
          class="m-r-12"
          src={WIDGET_DATA?.data?.avatar || 'https://cdn.sportmonks.com/images/soccer/placeholder.png'}
          alt=""
          width="40"
          height="40"
          on:error={
            (e) =>
              (e.target.src = 'https://cdn.sportmonks.com/images/soccer/placeholder.png')
          }
        />
        <!--
        player data
        -->
        <div
          class="
            column-start-grid-start
          ">
          <p
            id="player-name"
            class="
              color-black-2
              s-16
              w-700
            ">
            {WIDGET_DATA?.data?.player_name}
          </p>
          <!--
          📱 MOBILE
          -->
          {#if !mobileExclusive}
            <div
              class="
                row-space-start
                m-t-10
              ">
              <!--
              nationality
              -->
              <div
                id="nationality-box"
                class="
                  row-space-start
                  width-auto
                ">
                <p
                  class="
                    s-16
                    color-grey
                    m-r-12
                    no-wrap
                  ">
                  {`${WIDGET_T_DATA?.nationality}:` || 'Nationality:'}
                </p>
                <div
                  id="country-icon-box"
                  class="m-r-8"
                >
                  <img
                    src={WIDGET_DATA?.data?.country_img}
                    alt="country-logo"
                    width="18"
                    height="18"
                    id="country-icon"
                  />
                </div>
                <p
                  class="
                    s-16
                    color-black-2
                    no-wrap
                    w-500
                  ">
                  {WIDGET_DATA?.data?.country_iso3}
                </p>
              </div>
              <!--
              national team
              -->
              <div
                class="
                  row-space-start
                  width-auto
                ">
                <p
                  class="
                    s-16
                    color-grey
                    m-r-8
                    no-wrap
                  ">
                  {`${WIDGET_T_DATA?.national_team}:` || 'National Team:'}
                </p>
                <p
                  class="
                    s-16
                    color-black-2
                    no-wrap
                    w-500
                  ">
                  {B_SAP_D1?.translations?.[$sessionStore?.serverLang]}
                </p>
              </div>
            </div>
          {/if}
        </div>
      </div>
      <!--
      player profile (col) [#2]
      -->
      <div
        class="
          row-space-end
          width-auto
        ">
        <!--
        [💻 TABLET]
        -->
        {#if !tabletExclusive}
          <div
            class="
              row-space-start
              m-r-64
            "
          >

            <ProfileStat
              profileStatTitle={birthdayStr}
              statVal={`${WIDGET_DATA?.data?.age} yrs`}
              widthFirst={true}
            />

            <ProfileStat
              profileStatTitle={`${WIDGET_T_DATA?.height}:` || 'Height:'}
              statVal={`${WIDGET_DATA?.data?.height} cm`}
            />

            <ProfileStat
              profileStatTitle={`${WIDGET_T_DATA?.weight}:` || 'Weight:'}
              statVal={`${WIDGET_DATA?.data?.weight} kg`}
            />

          </div>
        {/if}
        <!--
        📱 MOBILE
        -->
        <!-- {#if !mobileExclusive} -->
        {#if false}
          <button
            id="follow-btn"
            class="
              btn-hollow
              cta
            "
          >
            Follow
          </button>
        {/if}
      </div>
    </div>

    <!--
    [📱 MOBILE] info stats row [#1]
    -->
    {#if mobileExclusive}
      <div
        class="
          row-space-start
          m-b-16
        "
      >

        <ProfileStat
          profileStatTitle={`${WIDGET_T_DATA?.nationality}:` || 'Nationality:'}
          statVal={WIDGET_DATA?.data?.country_id}
          countryImg={WIDGET_DATA?.data?.country_img}
          countryIso3={WIDGET_DATA?.data?.country_iso3}
          widthFirst={true}
        />

        <ProfileStat
          profileStatTitle={`${WIDGET_T_DATA?.national_team}:` || 'National Team:'}
          statVal={B_SAP_D1?.translations?.[$sessionStore?.serverLang]}
        />

      </div>
    {/if}

    <!--
    [💻 TABLET] info stats row [#2]
    -->
    {#if tabletExclusive}
      <div
        class="
          row-space-start
        "
      >

        <ProfileStat
          profileStatTitle={birthdayStr}
          statVal={`${WIDGET_DATA?.data?.age} yrs`}
          widthFirst={true}
        />

        <ProfileStat
          profileStatTitle={`${WIDGET_T_DATA?.height}:` || 'Height:'}
          statVal={`${WIDGET_DATA?.data?.height} cm`}
        />

        <ProfileStat
          profileStatTitle={`${WIDGET_T_DATA?.weight}:` || 'Weight:'}
          statVal={`${WIDGET_DATA?.data?.weight} kg`}
        />

      </div>
    {/if}

    <!--
    [📱 MOBILE] Follow Btn
    -->
    <!-- {#if mobileExclusive} -->
    {#if false}
      <button
        id="follow-btn"
        class="
          btn-hollow
          cta
          m-t-20
        "
      >
        Follow
      </button>
    {/if}

  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  .widget-component {
    padding: 20px;
  }

  img#player-avatar {
    border: 1px solid var(--grey-shade);
    border-radius: 80px;
  }

  div#country-icon-box {
    overflow: hidden;
    border: 1px solid var(--grey-shade);
    border-radius: 40px;
    width: 18px;
    height: 18px;
  } img#country-icon {
    width: auto;
    max-height: 100%;
    object-fit: contain;
    scale: 1.4;
  }

  p#player-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: inherit;
  }

  button#follow-btn {
    color: var(--primary);
    font-size: 14px;
    font-weight: 500;
    min-width: 100px;
  }

  /*
  =============
  RESPONSIVNESS
  =============
  */

  @media only screen
    and (min-width: 767px) {

    div#country-icon-box {
      height: 20px;
      width: 20px;
    }
    img#country-icon {
      width: 20px;
      height: 20px;
    }

    img#player-avatar {
      margin-right: 20px;
      width: 80px;
      height: 80px;
    }

    p#player-name {
      font-size: 32px;
    }

    div#nationality-box {
      padding-right: 12px;
      margin-right: 12px;
      border-right: 1px solid var(--grey-shade);
    }
  }

  /*
  =============
  DARK-THEME
  =============
  */

  :global(div.dark-background-1 div.status-box) {
    border-left: 1px solid var(--grey)
  }

</style>