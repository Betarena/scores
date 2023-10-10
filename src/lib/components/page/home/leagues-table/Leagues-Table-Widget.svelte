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
	import LeaguesTableLoader from './Leagues-Table-Loader.svelte';

	import type { B_LEGT_D, B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_LEGT_T = $page.data?.B_LEGT_T,
    /** Main widget data */
    WIDGET_DATA: B_LEGT_D,
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** Dynamic import variable for svelte component */
    LeaguesTableMainDynamic: any
  ;

  $: WIDGET_T_DATA = $page.data?.B_LEGT_T;
  $: WIDGET_TITLE = WIDGET_T_DATA?.translations?.title ?? translationObject?.leagues_table_title;

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
  ): Promise < B_LEGT_D >
  {
    if (!browser) return;

		// await sleep(3000);

    const response: B_LEGT_D = await get
    (
			`api/data/home/league-table?geoPos=${$userBetarenaSettings.country_bookmaker}`,
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
      // [🐞]
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
        LeaguesTableMainDynamic = (await import('./Leagues-Table-Main.svelte')).default;
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
  <h2>{WIDGET_T_DATA?.translations?.title}</h2>

  {#each WIDGET_T_DATA?.top_leagues_table_data ?? [] as item}
    <p>{item?.season_league_name}</p>

    {#each item?.season_league_teams ?? [] as itemL}
      <p>{itemL?.team_name}</p>
    {/each}

  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <LeaguesTableLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <LeaguesTableLoader />
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
      this={LeaguesTableMainDynamic}
      B_LEGT_T={WIDGET_T_DATA}
      B_LEGT_D={WIDGET_DATA}
    />

    <!--
    ### NOTE:
    ### Standard Svelte Component Import
    ### WARNING:
    ### Disable, if Dynamic Import is Enabled.
    -->
    <!--
      <LeaguesTableMain
        B_LEGT_T={WIDGET_T_DATA}
        B_LEGT_D={WIDGET_DATA}
      />
    -->

  {/if}

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}