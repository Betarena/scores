<!-- 
====================
This is an example .svelte
component file, to give guidance on
the structure that is employed across the project
and how it should be layed-out.
====================
<COPY-THIS-FILE-INTO-YOUR-NEXT-COMPONENT>
====================
<❗️ REMOVE (THIS) COMMENT IN PRODUCTION>
-->

<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { userBetarenaSettings } from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { onMount } from 'svelte';
	import WidgetTitle from './Widget-Title.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_TITLE: string
  export let NO_DATA_TITLE: string
  export let NO_DATA_DESC: string

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
	const MOBILE_VIEW = 475;
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
[ℹ] title of the widget 
-->
<WidgetTitle
  {WIDGET_TITLE}
  OVERRIDE_COLOR={true}
/>

<!-- 
[ℹ] no-matches-avaiable-placeholder container 
-->
<div
  class="
    no-widget-box
    row-space-start
  "
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>
  <!-- 
  [ℹ] no-matches-visual 
  -->
  <img
    src={
      $userBetarenaSettings.theme == 'Dark'
        ? '/assets/svg/noWidgetDataDark.svg'
        : '/assets/svg/noWidgetData.svg'
    }
    alt="No widget visual icon"
    width="80"
    height="80"
    class="m-r-20"
  />
  <!-- 
  [ℹ] container w/ text 
  -->
  <div>
    <p
      class="
        s-16 
        m-b-8 
        w-500
      "
    >
      {NO_DATA_TITLE}
    </p>
    <p
      class="
        s-16 
        color-grey 
        w-400
      "
    >
      {NO_DATA_DESC}
    </p>
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* #region ❌ [NOT WORKING] w/ regions */
  /* div#example {
    color: var(--dark-theme);
    background-color: var();
  } div#example > div#target {
  } */
  /* #endregion ❌ [NOT WORKING] w/ regions */

  .no-widget-box {
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}

  /*
  =============
  RESPONSIVNESS 
  =============
  */

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