<!-- Based on template :: Svelte-Boilerplate.v6.Widget.svelte -->

<!--
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓ COMPONENT JS (w/ TS)                                                                 ▓▓
▓▓ NOTE:                                                                                ▓▓
▓▓ access custom Betarena Scores JS VScode Snippets by typing 'script...'               ▓▓
▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'imports' that are required ▓▓
  // ▓▓ by 'this' .svelte file is ran.                                  ▓▓
  // ▓▓ IMPORTANT                                                       ▓▓
  // ▓▓ Please, structure the imports as follows:                       ▓▓
  // ▓▓ 1. svelte/sveltekit imports                                     ▓▓
  // ▓▓ 2. project-internal files and logic                             ▓▓
  // ▓▓ 3. component import(s)                                          ▓▓
  // ▓▓ 4. assets import(s)                                             ▓▓
  // ▓▓ 5. type(s) imports(s)                                           ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import { subscribeCompetitionsTargetListen } from '$lib/graphql/graphql.common.js';
	import sessionStore from '$lib/store/session.js';
	import { langPrefix } from '$lib/utils/platform-functions.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';

	import type { B_SAP_D3, B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_FIX_COMP_D, B_FIX_COMP_S, B_FIX_COMP_T } from '@betarena/scores-lib/types/types.fixture.competition.js';

  // ▓▓ NOTE: ▓▓ WARNING:
  // ▓▓ Disable, if Dynamic Import is Enabled.
  // import FeatBetSiteMain from './FeatBetSite-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'variables' that are to be  ▓▓
  // ▓▓ and are expected to be used by 'this' .svelte file / component. ▓▓
  // ▓▓ IMPORTANT                                                       ▓▓
  // ▓▓ Please, structure the imports as follows:                       ▓▓
  // ▓▓ 1. export const / let [..]                                      ▓▓
  // ▓▓ 2. const [..]                                                   ▓▓
  // ▓▓ 3. let [..]                                                     ▓▓
  // ▓▓ 4. $: [..]                                                      ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const
    /** @description (widget) dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** @description (widget) translations (+SEO) data */
    widgetDataTranslation: B_FIX_COMP_T,
    /** @description (widget) SEO data */
    widgetDataSeo: B_FIX_COMP_S,
    /** @description (widget) main data */
    widgetDataMain: B_FIX_COMP_D,
    /** @description (widget) wether widget has or no data */
    widgetNoData: boolean = true,
    /** @description (widget) dynamic import variable for svelte component [1] */
    MainMainAsDynamic: any,
    /** @description (misc) available global page data */
    miscFixturePageData0: B_SAP_FP_D = $page.data?.FIXTURE_INFO,
    /** @description (misc) page data for `competition` term(s) translations */
    miscFixturePageData1: B_SAP_D3 = $page.data?.B_SAP_D3_CP_M
  ;

  $: widgetDataSeo = $page.data?.B_FIX_COMP_S;
  $: widgetDataTranslation = $page.data?.B_FIX_COMP_T;
  // $: WIDGET_TITLE = widgetDataTranslation?.translations?.widget_title ?? translationObject?.featured_bet_site;

  $: deepReactListenPageChange = JSON.stringify($page?.url?.pathname);
  $: deepReactListenLangChng = JSON.stringify($sessionStore?.serverLang);
  $: miscFixturePageData0 = $page.data?.FIXTURE_INFO;
  $: miscFixturePageData1 = $page.data?.B_SAP_D3_CP_M;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'methods' that are to be    ▓▓
  // ▓▓ and are expected to be used by 'this' .svelte file / component. ▓▓
  // ▓▓ IMPORTANT                                                       ▓▓
  // ▓▓ Please, structure the imports as follows:                       ▓▓
  // ▓▓ 1. function (..)                                                ▓▓
  // ▓▓ 2. async function (..)                                          ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  /**
   * @author
   *  @migbash
   * @summary
   *  🟩 MAIN
   * @description
   *  📌 main widget data loader
   *  - ⚡️ (and) try..catch (error) handler
   *  - ⚡️ (and) placeholder handler
   * @returns { Promise < void > }
   */
  async function widgetInit
  (
  ): Promise < void >
  {
    // ▓▓ IMPORTANT
		if (!browser) return;

    // ▓▓ NOTE:
    // ▓▓ sometimes, the data/component is loaded too fast,
    // ▓▓ so a buffer is added to slow down the pace and show the
    // ▓▓ preloader to the user.
		// await sleep(3000);

    const response = await get
    (
      `/api/data/fixture/competition?fixtureId=${miscFixturePageData0?.data?.id}&decompress`,
      null,
      true,
      true,
    ) as B_FIX_COMP_D;

    console.log('response', response);

    widgetDataMain = response;

    // ▓▓ CHECK
    // ▓▓ for conditions when 'this' widget should not be shown.
    const if_M_0: boolean =
      widgetDataMain == null
    ;
		if (if_M_0)
    {
      // dlog(`${LV2_W_H_TAG[0]} ❌ no data available!`);
			widgetNoData = true;
      $sessionStore.showFixtureCompetition = false;
			return;
		}

    widgetNoData = false;
    $sessionStore.showFixtureCompetition = true;

    subscribeCompetitionsTargetListen
    (
      widgetDataMain?.competition?.id
    );

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  $: if_R_0 =
    browser
  ;
  $: if (if_R_0 && (deepReactListenLangChng || deepReactListenPageChange))
  {
    widgetInit()
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ NOTE:                                                           ▓▓
  // ▓▓ Please add inside 'this' region the 'logic' that should run     ▓▓
  // ▓▓ immediately and as part of the 'lifecycle' of svelteJs,         ▓▓
  // ▓▓ as soon as 'this' .svelte file is ran.                          ▓▓
  // ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  onMount
  (
    async (
    ): Promise < void > =>
    {

      // ▓▓ CHECK
      // ▓▓ for loading widget dynamically.
      if (useDynamicImport)
      {
        MainMainAsDynamic = (await import('./Competition-Main.svelte')).default;
      }

	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓ COMPONENT HTML                                                                    ▓▓
▓▓ NOTE:                                                                             ▓▓
▓▓ use 'CTRL+SPACE' to autocomplete global class="" styles                           ▓▓
▓▓ NOTE:                                                                             ▓▓
▓▓ access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.        ▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
-->

<SeoBox>

  <!--
  ▓▓ Competition Lobby Url
  -->
  <a
    href={`${langPrefix()}${miscFixturePageData1?.[$sessionStore?.serverLang]}`}
  >
    {`${langPrefix()}${miscFixturePageData1?.[$sessionStore?.serverLang]}`}
  </a>

  <!--
  ▓▓ Competition URL
  -->
  <a
    href={widgetDataSeo?.data?.competition_url}
  >
    {widgetDataSeo?.data?.competition_url}
  </a>
</SeoBox>

<!--
[🐞]
-->
<!-- <MainLoader /> -->

{#await widgetInit()}
  <!--
  ▓▓ NOTE:
  ▓▓ promise is pending
  -->
  <!-- <MainLoader /> -->

{:then data}
  <!--
  ▓▓ NOTE:
  ▓▓ promise was fulfilled
  -->

  {#if !widgetNoData}
    <!--
    ▓▓ NOTE:
    ▓▓ Dynamic Svelte Component Import [optional]
    ▓▓ WARNING:
    ▓▓ Disable (this), if Standard (below) Import is Enabled.
    -->
    <svelte:component
      this={MainMainAsDynamic}
      WIDGET_DATA={widgetDataMain}
    />
    <!--
      <FeatBetSiteMain
        B_FEATB_T={widgetDataTranslation}
      />
    -->
  {/if}

{:catch error}
  <!--
  ▓▓ NOTE:
  ▓▓ promise was rejected
  -->

{/await}