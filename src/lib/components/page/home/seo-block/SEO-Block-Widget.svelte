<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { translationObject } from '$lib/utils/translation.js';
  import { IN_W_F_STY, IN_W_F_TAG, IN_W_F_TOG, dlog } from '$lib/utils/debug.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import SeoBlockLoader from './SEO-Block-Loader.svelte';

	import type { B_SEB_DT } from '@betarena/scores-lib/types/seo-block.js';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
	// import SeoBlockMain from './SEO-Block-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_SEB_DT = $page.data?.SEO_BLOCK_DATA,
    /** Main widget data */
    WIDGET_DATA: B_SEB_DT,
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** Dynamic import variable for svelte component */
    SeoBlockMainDynamic: any
  ;

  $: WIDGET_T_DATA = $page.data?.SEO_BLOCK_DATA;
  $: WIDGET_TITLE = WIDGET_T_DATA?.title ?? translationObject?.seo_block_title;

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
  ): Promise < B_SEB_DT >
  {
		// await sleep(3000);

    WIDGET_DATA = WIDGET_T_DATA

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

    return WIDGET_DATA;
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
        SeoBlockMainDynamic = (await import('./SEO-Block-Main.svelte')).default;
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

  <h2>{WIDGET_T_DATA?.title}</h2>

  {@html WIDGET_T_DATA?.html}

</SeoBox>

<!-- [🐞] -->
<!-- <SeoBlockLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <SeoBlockLoader />
{:then data}

  {#if !NO_WIDGET_DATA}

    <!--
    ### NOTE:
    ### Dynamic Svelte Component Import
    ### WARNING:
    ### Disable, if Standard Import is Enabled.
    -->
    <svelte:component
      this={SeoBlockMainDynamic}
      B_SEB_DT={WIDGET_DATA}
    />

    <!--
    ### NOTE:
    ### Standard Svelte Component Import
    ### WARNING:
    ### Disable, if Dynamic Import is Enabled.
    -->
    <!--
      <SeoBlockMain
        B_SEB_DT={WIDGET_DATA}
      />
    -->

  {/if}

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}