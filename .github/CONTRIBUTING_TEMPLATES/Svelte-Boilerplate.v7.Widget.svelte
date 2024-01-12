<!--
▓▓ NOTE:
▓▓ This is a boilerplate example for a .svelte component, used by Betarena | Scores.
▓▓ It acts as a guidance on internal development standards and code style used
▓▓ throughout this project.
▓▓ NOTE: | IMPORTANT
▓▓ Use _this_ Boilerplate / Template when creating your next Svelte Component of Type Widget.
▓▓ NOTE: | IMPORTANT
▓▓ ❗️ Please Remove _this_ comment after adding this to a target file.
-->

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
▓▓ COMPONENT JS (w/ TS)                                                               ◼️
▓▓ NOTE:                                                                              ◼️
▓▓ access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // IMPORTANT
  // @ts-nocheck

  // #region ➤ 📦 Package Imports

  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ▓▓ NOTE:                                                            ◼️
  // ▓▓ Please add inside 'this' region the 'imports' that are required  ◼️
  // ▓▓ by 'this' .svelte file is ran.                                   ◼️
  // ▓▓ IMPORTANT                                                        ◼️
  // ▓▓ Please, structure the imports as follows:                        ◼️
  // ▓▓ 1. svelte/sveltekit imports                                      ◼️
  // ▓▓ 2. project-internal files and logic                              ◼️
  // ▓▓ 3. component import(s)                                           ◼️
  // ▓▓ 4. assets import(s)                                              ◼️
  // ▓▓ 5. type(s) imports(s)                                            ◼️
  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

  // import { <custom/node-modules> } from [..]

  // import <component> [..]

	// import type [..];

  // ▓▓ NOTE: || WARNING:
  // ▓▓ Disable, if Dynamic Import is Enabled.
  // import FeatBetSiteMain from './FeatBetSite-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ▓▓ NOTE:                                                            ◼️
  // ▓▓ Please add inside 'this' region the 'variables' that are to be   ◼️
  // ▓▓ and are expected to be used by 'this' .svelte file / component.  ◼️
  // ▓▓ IMPORTANT                                                        ◼️
  // ▓▓ Please, structure the imports as follows:                        ◼️
  // ▓▓ 1. export const / let [..]                                       ◼️
  // ▓▓ 2. const [..]                                                    ◼️
  // ▓▓ 3. let [..]                                                      ◼️
  // ▓▓ 4. $: [..]                                                       ◼️
  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /** @description (widget) dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** @description (widget) translations data */
    widgetDataTranslation: B_COMP_MAIN_T,
    /** @description (widget) translations (SEO) data */
    widgetDataSeo: B_COMP_MAIN_S,
    /** @description (widget) main data */
    widgetDataMain: B_COMP_HIGH_D,
    /** @description (widget) wether widget has or no data */
    widgetNoData: boolean = true,
    /** @description (widget) dynamic import variable for svelte component [1] */
    MainMainAsDynamic: any
  ;

  // $: widgetDataTranslation = $page.data?.B_COMP_MAIN_T;
  // $: widgetDataSeo = $page.data?.B_COMP_MAIN_S;
  // $: WIDGET_TITLE = widgetDataTranslation?.translations?.widget_title ?? translationObject?.featured_bet_site;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ▓▓ NOTE:                                                            ◼️
  // ▓▓ Please add inside 'this' region the 'methods' that are to be     ◼️
  // ▓▓ and are expected to be used by 'this' .svelte file / component.  ◼️
  // ▓▓ IMPORTANT                                                        ◼️
  // ▓▓ Please, structure the imports as follows:                        ◼️
  // ▓▓ 1. function (..)                                                 ◼️
  // ▓▓ 2. async function (..)                                           ◼️
  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

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
      `<-target-data-endpoint-goes-here->`
    ) as '<-add-custom-type-here->';

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
			return;
		}

    widgetNoData = false;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ▓▓ NOTE:                                                            ◼️
  // ▓▓ Please add inside 'this' region the 'logic' that should run      ◼️
  // ▓▓ immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ▓▓ as soon as 'this' .svelte file is ran.                           ◼️
  // ▓▓ ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    async (
    ): Promise < void > =>
    {

      // ▓▓ CHECK
      // ▓▓ for loading widget dynamically.
      if (useDynamicImport)
      {
        // MainMainAsDynamic = (await import('./Main-Main.svelte')).default;
      }

	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
▓▓ COMPONENT HTML                                                                     ◼️
▓▓ NOTE:                                                                              ◼️
▓▓ use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
▓▓ NOTE:                                                                              ◼️
▓▓ access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<SeoBox>
  <!--
  SEO CONTENT GOES HERE
  -->
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
  <MainLoader />

{:then data}
  <!--
  ▓▓ NOTE:
  ▓▓ promise was fulfilled
  -->

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

{:catch error}
  <!--
  ▓▓ NOTE:
  ▓▓ promise was rejected
  -->

{/await}