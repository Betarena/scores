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
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { IN_W_F_STY, IN_W_F_TAG, IN_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { translationObject } from '$lib/utils/translation.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import FeatMatchLoader from './FeatMatch-Loader.svelte';

	import type { B_FEATM_D, B_FEATM_S, B_FEATM_T } from '@betarena/scores-lib/types/feat-match.js';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
	// import FeatMatchMain from './FeatMatch-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_FEATM_T = $page.data?.B_FEATM_T,
    /** Main widget SEO data */
    WIDGET_S_DATA: B_FEATM_S = $page.data?.B_FEATM_S,
    /** Main widget data */
    WIDGET_DATA: B_FEATM_D,
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** Dynamic import variable for svelte component */
    FeatMatchMainDynamic: any
  ;

  $: WIDGET_S_DATA = $page.data?.B_FEATM_S;
  $: WIDGET_T_DATA = $page.data?.B_FEATM_T;
  $: WIDGET_TITLE =  WIDGET_T_DATA?.matches ?? translationObject?.featured_match_title;

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
  ): Promise < B_FEATM_D >
  {
    if (!browser) return;

		// await sleep(3000);

    const response: B_FEATM_D = await get
    (
			`/api/data/home/feat-match?geoPos=${$userBetarenaSettings.country_bookmaker}`
		);

    WIDGET_DATA = response;

    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {

      // ### [🐞]
      dlog
      (
        `${IN_W_F_TAG} ❌ no data available!`,
        IN_W_F_TOG,
        IN_W_F_STY
      );

			NO_WIDGET_DATA = true;

			return;
		}

    NO_WIDGET_DATA = false;

    return WIDGET_DATA
  }

  // #endregion ➤ 🛠️ METHODS

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
        FeatMatchMainDynamic = (await import('./FeatMatch-Main.svelte')).default;
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
  <!--
  WIDGET TITLE
  -->
  <h2>{WIDGET_TITLE}</h2>
  <!--
  TEAM NAMES
  -->
  <p>{WIDGET_S_DATA?.home_team_name}</p>
  <p>{WIDGET_S_DATA?.away_team_name}</p>
  <!--
  LINKS
  -->
  <a
    href={WIDGET_S_DATA?.league_url}>
    <p>{WIDGET_S_DATA?.league_name}</p>
  </a>
  <a
    href={WIDGET_S_DATA?.fixture_url}>
    <p>
      {WIDGET_S_DATA?.home_team_name}
      vs.
      {WIDGET_S_DATA?.away_team_name}
    </p>
  </a>
  {#each WIDGET_S_DATA?.player_urls ?? [] as player}
    <a
      href={player?.url}>
      <p>
        {player?.common_name}
      </p>
    </a>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <FeatMatchLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <FeatMatchLoader />
{:then data}
  <!--
  ### NOTE:
  ### promise was fulfilled
  -->

  {#if !NO_WIDGET_DATA}

    <!--
    ### NOTE:
    ### Dynamic Svelte Component Import
    ### WARNING:
    ### Disable, if Standard Import is Enabled.
    -->
    <svelte:component
      this={FeatMatchMainDynamic}
      B_FEATM_D={WIDGET_DATA}
      B_FEATB_T={WIDGET_T_DATA}
    />

    <!--
    ### NOTE:
    ### Standard Svelte Component Import
    ### WARNING:
    ### Disable, if Dynamic Import is Enabled.
    -->
    <!--
      <FeatMatchMain
        B_FEATM_D={WIDGET_DATA}
        B_FEATB_T={WIDGET_T_DATA}
      />
    -->

  {/if}

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}