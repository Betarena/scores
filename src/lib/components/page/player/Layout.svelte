<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

  //#region ➤ Svelte/SvelteKit Imports
  // <-imports-go-here->
  // -
	import { goto, preloadData } from '$app/navigation';
  // -
	import { browser } from '$app/environment';
  // -
	import { page } from '$app/stores';
  // -
	import { onMount } from 'svelte';
  // -
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // <-imports-go-here->
  // -
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  // -
	import { userBetarenaSettings } from '$lib/store/user-settings';
  // -
	import { sessionStore } from '$lib/store/session';
  // -
	import { dlog } from '$lib/utils/debug';
  // -
  //#endregion ➤ Project Custom Imports

  //#region ➤ [PLUGIN] Firebase Imports
  // <-imports-go-here->
  //#endregion ➤ [PLUGIN] Firebase Imports

  //#region ➤ Types Imports
  // <-imports-go-here->
	import type { B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/seo-pages';
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

  // IMPORTANT
  // (this) widget has access to the following PAGE data:
  // [...]
  // $page.data.PAGE_DATA: B_SAP_PP_D
  // $page.data.B_SAP_D1: B_SAP_D1
  // FIXME: remove cosnt data = [...] and fix the types issue with $page.data[...]

  let data: B_SAP_PP_D = $page.data.PAGE_DATA
  let data_0: B_SAP_PP_T = $page.data.PAGE_SEO

  $: data = $page.data.PAGE_DATA
  $: data_0 = $page.data.PAGE_SEO

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  let current_lang: string = server_side_language;
	$: refresh_lang = $userBetarenaSettings.lang;
	$: lang_intent = $sessionStore.lang_intent;

  $: console.log($page.data)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @description [HELPER] method
   * identifies the target translated URL;
   * @param {string} lang
   * @returns string
   */
  function translated_url (
    lang: string
  ): string {
    let new_url: string = data.alternate_data[lang];
    // new_url = new_url.replace('https://scores.betarena.com','');
    dlog(data.alternate_data, true)
    if (new_url == undefined) return '/'
    dlog(`new_url: /${new_url}`, true)
    return `/${new_url}`;
  }

  /**
   * @description [HELPER] method
   * preload target URL;
   * @param {string} new_url
   * @returns void
   */
  async function preload_target_url (
    new_url: string
  ): Promise < void > {
    await preloadData(new_url)
  }

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

  // [ℹ] (event-listen)
  // [ℹ] lang (intent) change;
  $: if (browser && lang_intent) {
    let newURL = translated_url(lang_intent)
    dlog(`newURL (lang_intent): ${newURL}`, true)
    preload_target_url(newURL)
  }

  // [ℹ] (event-listen)
  // [ℹ] lang change;
	$: if (
    browser
    && current_lang != refresh_lang 
	) {
		current_lang = refresh_lang;
		let new_url = translated_url(current_lang)
		goto(new_url, { replaceState: true });
	}

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<!-- 
[ℹ] Meta (SEO)
-->
{#if data_0}
	<SvelteSeo
		title={data_0?.main_data?.title}
		description={data_0?.main_data?.description}
		keywords={data_0?.main_data?.keywords}
		noindex={JSON.parse(data_0?.main_data?.noindex.toString())}
		nofollow={JSON.parse(data_0?.main_data?.nofollow.toString())}
		canonical={data_0?.main_data?.canonical}
		twitter={data_0?.twitter_card}
		openGraph={data_0?.opengraph}
	/>
{/if}

<!-- 
[ℹ] Meta <link hreflang={...}>
[ℹ] example:
[ℹ] <link rel="alternate" hrefLang="en" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
[ℹ] <link rel="alternate" hrefLang="es" href="https://scores.betarena.com/es/futbol/aston-villa-southampton-50977>
[ℹ] <link rel="alternate" hrefLang="x-default" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
[ℹ] <link rel="canonical" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
-->
<svelte:head>
  {#if data_0}
    {#each data_0?.hreflang as item}
      {#each Object.entries(data?.alternate_data) as [lang, link]}
        {#if item.link == lang}
          <link
            rel="alternate"
            hreflang={item.hreflang}
            href={`${$page.url.origin}/${link}`}
          />
        {/if}
        {#if item.link == null && lang == 'en'}
          <!-- 
          [ℹ] EN (unique)
          -->
          <link
            rel="alternate"
            hreflang={item.hreflang}
            href={`${$page.url.origin}/${link}`}
          />
          <link
            rel="alternate"
            hreflang="en"
            href={`${$page.url.origin}/${link}`}
          />
        {/if}
      {/each}
    {/each}
  {/if}
</svelte:head>

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

  section#section-player-page {
    max-width: 1430px;
		grid-template-columns: 1fr;
		padding-top: 12px !important;
		align-items: start;
  }

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