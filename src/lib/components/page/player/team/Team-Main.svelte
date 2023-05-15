<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->
	
  import { page } from '$app/stores';
  import { userBetarenaSettings } from '$lib/store/user-settings';
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
    <div>
      <div id="lineup-vector">
        <TeamPitchVector />
      </div>
    </div>

    <!-- 
    BOTTOM DATA ROW
    -->
    <div
      class="
        row-space-out
      ">

      <!-- 
      CURRENT TEAM BOX
      -->
      <div
        class="
          row-space-start
        ">
        <img 
          loading="lazy"
          src={WIDGET_DATA?.data?.team_icon}
          alt={WIDGET_DATA?.data?.team_name}
          width="40"
          height="40"
        />
        <div>
          <p
            class="
              color-grey
              s-14
            ">
            {WIDGET_T_DATA?.current_team || 'Current Team'}:
          </p>
          <p
            class="
              color-black-2
              s-14
              bold
            ">
            {WIDGET_DATA?.data?.team_name}
          </p>
        </div>
      </div>

      <!-- 
      JERSEY NUMBER
      -->
      <div>
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
      <div>
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
          {WIDGET_DATA?.data?.player_position}
        </p>
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
  div.widget-component {
    overflow: unset;
    padding-bottom: 10px;
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 425px) {
  }

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
  }

  /*
  =============
  DARK-THEME
  =============
  */

</style>