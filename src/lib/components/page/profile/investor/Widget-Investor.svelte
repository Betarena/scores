<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

	import { page } from '$app/stores';
	import { get } from '$lib/api/utils.js';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { sleep } from '$lib/utils/platform-functions.js';

	import WidgetTxHistLoader from './../competitions-history/Widget-Comp-Hist-Loader.svelte';
	import MainFaq from './FAQ-Main.svelte';
	import MainInvestBox from './Main-InvestBox.svelte';
	import MainInvestorTitle from './Main-Investor-Title.svelte';
	import MainRound from './Main-Round.svelte';

	import type { B_PROF_D, IProfileTrs } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕comp-hist'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 581, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 912, true ]
  ;

  let
    /** @description 📣 (widget) translations data */
    widgetDataTranslation: IProfileTrs
    /** @description 📣 (widget) translations (SEO) data */
    // , widgetDataSeo: B_COMP_MAIN_S
    /** @description 📣 (widget) main data */
    , widgetDataMain: B_PROF_D
    /** @description 📣 (widget) wether widget has or no data */
    // eslint-disable-next-line no-unused-vars
    , widgetNoData: boolean = true
    /** @description 📣 (widget) dynamic import variable for svelte component [1] */
    // , MainMainAsDynamic: any
  ;

  // eslint-disable-next-line no-unused-vars
  $: widgetDataTranslation = $page.data.RESPONSE_PROFILE_DATA ?? { };
  // $: widgetDataTranslation = $page.data?.B_COMP_MAIN_T;
  // $: widgetDataSeo = $page.data?.B_COMP_MAIN_S;
  // $: WIDGET_TITLE = widgetDataTranslation?.translations?.widget_title ?? translationObject?.featured_bet_site;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // ### NOTE:
  // ### Temporary, deciding where to 'put' widget data loader,
  // ### Either into the parent (+page.svelte), or make 'this' widget
  // ### into it's own component, with the V6 structure.
  async function widgetInit
  (
  ): Promise < B_PROF_D | null >
  {
		await sleep(3000);

    const response: B_PROF_D = await get
    (
      `/api/data/profile?uid=${$userBetarenaSettings.user.firebase_user_data?.uid}`
    ) as B_PROF_D;

    widgetDataMain = response

    const if_M_0
      = widgetDataMain == undefined
    ;
    if (if_M_0)
    {
      // dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
      widgetNoData = true;
      return null;
    }

    widgetNoData = false;
    return widgetDataMain;
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!-- <WidgetTxHistLoader /> -->

{#await widgetInit()}

  <WidgetTxHistLoader />

{:then data}

  <MainInvestorTitle />

  <!--
  ▓ NOTE:
  ▓ > main grid.
  -->
  <div
    id="investor-grid-box"
  >

    <MainRound
      WIDGET_DATA={data}
    />
    <MainInvestBox
      WIDGET_DATA={data}
    />

    <div
      id="FAQ"
    >
      <MainFaq />
    </div>

  </div>
{/await}

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  div#investor-grid-box
  {
    /* 🎨 style */
    display: grid;
    grid-template-columns: 1fr;
    gap: 64px 20px;
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 1160px)
  {
    div#investor-grid-box
    {
      /* 🎨 style */
      gap: 80px 20px;
      grid-template-columns: 1fr 1fr;
    }

    div#FAQ
    {
      /* 🎨 style */
      width: 100%;
      /* 📌 position */
      grid-column: 1 / 3 ;
    }

  }

</style>
