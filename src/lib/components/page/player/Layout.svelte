<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

  //#region ➤ Svelte/SvelteKit Imports
  // <-imports-go-here->
	import { page } from '$app/stores';
  // ---
	import { onMount } from 'svelte';
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // <-imports-go-here->
	import { viewport_change } from '$lib/utils/platform-functions';
//#endregion ➤ Project Custom Imports

  //#region ➤ [PLUGIN] Firebase Imports
  // <-imports-go-here->
  //#endregion ➤ [PLUGIN] Firebase Imports

  //#region ➤ Types Imports
  // <-imports-go-here->
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // <-imports-go-here->
  // import profile_avatar from './assets/profile-avatar.svg';
  //#endregion ➤ Assets Imports

	import SvelteSeo from 'svelte-seo';
	import Breadcrumb from './Breadcrumb.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // export const EXAMPLE_VALUE
  
  // const EXAMPLE_VALUE

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

<!-- 
[ℹ] Meta (SEO)
-->
{#if $page.data?.PAGE_SEO}
	<SvelteSeo
		title={$page.data?.PAGE_SEO?.main_data.title}
		description={$page.data?.PAGE_SEO?.main_data.description}
		keywords={$page.data?.PAGE_SEO?.main_data.keywords}
		noindex={JSON.parse($page.data?.PAGE_SEO?.main_data.noindex.toString())}
		nofollow={JSON.parse($page.data?.PAGE_SEO?.main_data.nofollow.toString())}
		canonical={$page.data?.PAGE_SEO?.main_data.canonical}
		twitter={$page.data?.PAGE_SEO?.twitter_card}
		openGraph={$page.data?.PAGE_SEO?.opengraph}
	/>
{/if}

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<section 
  id="section-player-page">

  <Breadcrumb />

</section>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* #region ❌ [NOT WORKING] w/ regions */
  div#example {
    color: var(--dark-theme);
    /* background-color: var(); */
  } div#example > div#target {
  }
  /* #endregion ❌ [NOT WORKING] w/ regions */

  div#example {
    color: var(--dark-theme);
  } div#example > div#target {
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