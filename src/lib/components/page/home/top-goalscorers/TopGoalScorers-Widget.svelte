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

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import TopGoalScorersLoader from './TopGoalScorers-Loader.svelte';

	import type { B_TGOL_D, B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
  // import TopGoalScorersMain from './TopGoalScorers-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_TGOL_T = $page.data?.B_TGOL_T,
    /** Main widget SEO data */
    WIDGET_S_DATA: B_TGOL_S = $page.data?.B_TGOL_S,
    /** Main widget data */
    WIDGET_DATA: B_TGOL_D,
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** Dynamic import variable for svelte component */
    TopGoalScorersMainDynamic: any
  ;

  $: WIDGET_S_DATA = $page.data?.B_TGOL_S;
  $: WIDGET_T_DATA = $page.data?.B_TGOL_T;
  $: WIDGET_TITLE = WIDGET_T_DATA?.widget_translations?.best_goal_scorers ?? 'Best Goalscorers';

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

    const response: B_TGOL_D = await get
    (
			`/api/data/home/top-goalscorers?geoPos=${$userBetarenaSettings.country_bookmaker}`,
      null,
      true,
      true
		);

    WIDGET_DATA = response;

    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
			NO_WIDGET_DATA = true;

			return;
		}

    NO_WIDGET_DATA = false;

    return;

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
        TopGoalScorersMainDynamic = (await import('./TopGoalScorers-Main.svelte')).default;
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
  <h2>{WIDGET_TITLE}</h2>
  <p>{WIDGET_T_DATA?.widget_translations?.goals}</p>
  <p>{WIDGET_T_DATA?.widget_translations?.odds}</p>
  <p>{WIDGET_T_DATA?.widget_translations?.player}</p>
  <p>{WIDGET_T_DATA?.widget_translations?.show_more_players}</p>
  <!--
  LIST PLAYERS
  -->
  {#each WIDGET_S_DATA?.players ?? [] as player}
    <a href={player?.url}>
      <p>{player?.common_name}</p>
    </a>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <TopGoalScorersLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <TopGoalScorersLoader />
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
    this={TopGoalScorersMainDynamic}
    B_TGOL_D={WIDGET_DATA}
    B_TGOL_T={WIDGET_T_DATA}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <TopGoalScorersMain
      B_TGOL_D={WIDGET_DATA}
      B_TGOL_T={WIDGET_T_DATA}
    />
  -->

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}