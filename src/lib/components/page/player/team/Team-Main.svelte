<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

  import { page } from '$app/stores';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  import { onMount } from 'svelte';

	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import TeamPitchVector from './Team-Pitch-Vector.svelte';

	import type { B_PTEAM_D, B_PTEAM_T } from '@betarena/scores-lib/types/player-team.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PTEAM_D

  let WIDGET_T_DATA: B_PTEAM_T = $page.data?.B_PTEAM_T

  $: WIDGET_T_DATA = $page.data?.B_PTEAM_T
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.widget_title || 'Current Team' : 'Current Team'

  let teamPitchFormation = new Map<string, string[]>();
  teamPitchFormation.set('G', ['GK'])
  teamPitchFormation.set('D', ['LB', 'CB', 'RB'])
  teamPitchFormation.set('M', ['LM', 'DM', 'CM', 'AM', 'RM'])
  teamPitchFormation.set('A', ['LW', 'CF', 'RW'])

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1024;
	const MOBILE_VIEW = 475;
	const OTHER_VIEW = 1900;
  let tabletExclusive: boolean = false;
	let mobileExclusive: boolean = false;
  let largeDesktop: boolean = false;

	onMount
  (
    async () =>
    {
      [
        tabletExclusive,
        mobileExclusive,
        largeDesktop
      ] = viewport_change
      (
        TABLET_VIEW,
        MOBILE_VIEW,
        OTHER_VIEW
      );
      window.addEventListener
      (
        'resize',
        function () {
          [
            tabletExclusive,
            mobileExclusive,
            largeDesktop
          ] =
          viewport_change
          (
            TABLET_VIEW,
            MOBILE_VIEW,
            OTHER_VIEW
          );
        }
      );
	  }
  );

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] example comment
-->
<div>

  <WidgetTitle
    {WIDGET_TITLE}
    OVERRIDE_COLOR={!tabletExclusive && largeDesktop ? false : true}
  />

  <div
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    PITCH VIEW POSITION
    -->
    <div
      id="lineup-vector-box"
    >
      <!--
      [ℹ] PITCH VECTOR
      -->
      <div
        id="lineup-vector"
      >
        <TeamPitchVector />
      </div>
      <!--
      [ℹ] lineup positions - absolute box
      -->
      <div
        id="overlay-player-pos-box"
      >
        {#each [...teamPitchFormation.entries()] as [pos, pos_d]}
          {#each pos_d as pos_d_val,i}
            <div
              class="
                s-16
                bold
                team-pos-box
                {pos_d_val}
                color-primary
              "
              title={WIDGET_T_DATA?.positions?.[WIDGET_DATA?.data?.player_position?.toString()]}
              class:invisible={pos_d_val != WIDGET_DATA?.data?.player_position_code}
            >
              {WIDGET_T_DATA?.position_abbreviation?.[WIDGET_DATA?.data?.player_position?.toString()]}
            </div>
          {/each}
        {/each}
      </div>

    </div>

    <!--
    💻 TABLET + 📱 MOBILE BOTTOM DATA ROW
    -->
    <div
      id="pteam-bottom-data"
      class="
        row-space-start
      "
      class:column-start-grid-start={mobileExclusive}
    >

      <!--
      CURRENT TEAM BOX
      -->
      <div
        class="
          row-space-start
          width-auto
          m-r-40
        "
        class:m-b-20={mobileExclusive}
      >
        <img
          loading="lazy"
          src={WIDGET_DATA?.data?.team_icon}
          alt={WIDGET_DATA?.data?.team_name}
          width="40"
          height="40"
          class="
            m-r-16
          "
        />
        <div>
          <p
            class="
              s-14
              color-grey
              no-wrap
            ">
            {WIDGET_T_DATA?.current_team || 'Current Team'}:
          </p>
          <p
            class="
              color-black-2
              s-14
              bold
              no-wrap
            ">
            {WIDGET_DATA?.data?.team_name}
          </p>
        </div>
      </div>

      <!--
      📱 MOBILE BOTTOM BOX
      -->
      <div
        class="
          row-space-start
        "
      >

        <!--
        JERSEY NUMBER
        -->
        <div
          class="
            m-r-12
            pteam-box-stat
          "
          class:m-r-40={mobileExclusive}
        >
          <p
            class="
              color-grey
              s-14
            ">
            {WIDGET_T_DATA?.jersey_number || 'Jersey Number'}:
          </p>
          <p
            class="
              color-black-2
              s-14
              bold
            ">
            {WIDGET_DATA?.data?.player_jersey_num}
          </p>
        </div>

        <!--
        POSITION
        -->
        <div
          class="
            pteam-box-stat
          ">
          <p
            class="
              color-grey
              s-14
            ">
            {WIDGET_T_DATA?.position || 'Position'}:
          </p>
          <p
            class="
              color-black-2
              s-14
              bold
            ">
            {WIDGET_T_DATA?.positions?.[WIDGET_DATA?.data?.player_position?.toString()]}
          </p>
        </div>

      </div>

    </div>

  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* o */
  div.widget-component
  {
    overflow: unset;
    padding-bottom: unset;
  }

  /* lineup-vector box */
	div#lineup-vector-box
  {
		position: relative;
		padding: 0 20px;
	}
	div#lineup-vector-box div#lineup-vector
  {

	}
	div#lineup-vector-box div#overlay-player-pos-box
  {
    /* p */
    position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: 8px 20px;
    /* s */
		padding: 15px;
	}
	div#lineup-vector-box div#overlay-player-pos-box .team-pos-box
  {
    /* p */
    position: absolute;
    /* s */
    width: 40px;
    height: 40px;
    background: #FFFFFF;
    border: 1px solid #F5620F;
    border-radius: 90px;
    text-align: center;
    padding: 7.5px;
  }
  .GK
  {
    left: 15px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .LB
  {
    top: 15px;
    left: 10%;
  }
  .CB
  {
    top: 0;
    bottom: 0;
    left: 10%;
    margin: auto;
  }
  .RB
  {
    bottom: 15px;
    left: 10%;
  }
  .DM
  {
    top: 0;
    bottom: 0;
    left: 35%;
    margin: auto;
  }
  .RM
  {
    bottom: 40px;
    left: 65%;
  }
  .LM
  {
    top: 40px;
    left: 65%;
  }
  .CM
  {
    top: 0;
    bottom: 0;
    left: 55%;
    margin: auto;
  }
  .AM
  {
    top: 0;
    bottom: 0;
    left: 75%;
    margin: auto;
  }
  .CF
  {
    top: 0;
    bottom: 0;
    right: 15px;
    margin: auto;
  }
  .RW
  {
    bottom: 15px;
    left: 75%;
  }
  .LW
  {
    top: 15px;
    left: 75%;
  }

  .team-pos-box.invisible
  {
    visibility: hidden;
  }


  div#pteam-bottom-data
  {
    padding: 20px;
  }

  div.pteam-box-stat
  {
    border-left: 1px solid var(--grey-color);
    padding-left: 16px;
  }

  /*
  =============
  RESPONSIVNESS
  =============
  */

  @media only screen
    and (min-width: 475px)
  {
  }

  @media only screen
    and (min-width: 768px)
  {
  }

  @media only screen
    and (min-width: 726px)
    and (max-width: 1000px)
  {
  }

  /*
  =============
  DARK-THEME
  =============
  */

  .dark-background-1 div#lineup-vector-box div#overlay-player-pos-box .team-pos-box
  {
    background-color: var(--dark-theme-1);
  }

  .dark-background-1 div.pteam-box-stat
  {
    border-color: var(--dark-theme-1-shade);
  }

</style>