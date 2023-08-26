<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import sessionStore from '$lib/store/session.js';
	import { initialDevice } from '$lib/utils/platform-functions.js';
	import { translationObject } from '$lib/utils/translation.js';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import HighlightsLoader from './Highlights-Loader.svelte';

	import type { B_COMP_HIGH_D, B_COMP_HIGH_S, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
  // import HighlightsGrid from './Highlights-Grid.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** @description dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** @description TODO: DOC: */
    isViewMobile: boolean = false,
    /** @description TODO: DOC: */
    isViewTablet: boolean = false,
    /** @description main widget translations data */
    WIDGET_T_DATA: B_COMP_HIGH_T = $page.data?.B_COMP_HIGH_T,
    /** @description main widget SEO data */
    WIDGET_S_DATA: B_COMP_HIGH_S = $page.data?.B_COMP_HIGH_S,
    /** @description main widget data */
    WIDGET_DATA: [number, B_COMP_HIGH_D][],
    /** @description wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** @description dynamic import variable for svelte component */
    HighlightsGridDynamic: any
  ;

  $: WIDGET_T_DATA = $page.data?.B_COMP_HIGH_T;
  $: WIDGET_TITLE = WIDGET_T_DATA?.translations?.widget_title ?? translationObject?.featured_bet_site;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🟩 MAIN
   *
   * @description
   * 📌 main widget data loader
   *
   * ⚡️ (and) try..catch (error) handler
   *
   * ⚡️ (and) placeholder handler
   *
   * @returns
   * Target `widget` data for client, but at times not used.
   */
  async function widgetInit
  (
  ): Promise < void >
  {
    if (!browser) return;

		// await sleep(3000);

    const response = await get
    (
      `/api/data/lobby/highlights`
    ) as [number, B_COMP_HIGH_D][];

    WIDGET_DATA = response;

    // ### CHECK
    // ### for conditions when 'this' widget should not be shown.
    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // dlog(`${LV2_W_H_TAG[0]} ❌ no data available!`);
			NO_WIDGET_DATA = true;
			return;
		}
    NO_WIDGET_DATA = false;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  /**
   * @description
   * TODO: DOC:
  */
  [
    isViewMobile,
    isViewTablet
  ] = initialDevice
  (
    $sessionStore.deviceType
  );

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {

      if (useDynamicImport)
      {
        HighlightsGridDynamic = (await import('./Highlights-Grid.svelte')).default;
      }

	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<SeoBox>

  {#each WIDGET_S_DATA?.data ?? [] as item}

    <p>{item?.country_name}</p>

    <a href={item?.league_url}>
      {item?.league_name}
    </a>

    <p>{item?.home_team_name}</p>
    <p>{item?.away_team_name}</p>

    <a href={item?.competition_url}>
      {item?.competition_url}
    </a>

    <a href={item?.fixture_url}>
      {item?.fixture_url}
    </a>

  {/each}

</SeoBox>

<!-- [🐞] -->
<!-- <h2>Open</h2>
<HighlightsLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <h2>Open</h2>
  <HighlightsLoader />
{:then data}
  <!--
  ### NOTE:
  ### promise was fulfilled
  -->

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={HighlightsGridDynamic}
    WIDGET_DATA={new Map(WIDGET_DATA)}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <HighlightsGrid
      WIDGET_DATA={new Map(WIDGET_DATA)}
    />
  -->

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}