<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authors Article Main                                                      │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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
  import { onMount } from 'svelte';

  import iconArrowLeftDark from './assets/icon-arrow-left-dark.svg';
  import iconArrowLeftLight from './assets/icon-arrow-left-light.svg';
  import iconArrowRightDark from './assets/icon-arrow-right-dark.svg';
  import iconArrowRightLight from './assets/icon-arrow-right-light.svg';
  import icon_location_dark from './assets/icon-location-dark.svg';
  import icon_location from './assets/icon-location.svg';

  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { monthNames } from '$lib/utils/dates.js';
  import { viewportChangeV2 } from '$lib/utils/device';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

  import type { B_SAP_D2 } from '@betarena/scores-lib/types/seo-pages.js';
  import type { IArticleData, IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
  import TagsHeader from './Tags-Header.svelte';
  import ArticleCard from './Articels-Card.svelte';
    import Button from '$lib/components/ui/Button.svelte';

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

  export let
    /**
     * @augments IArticleData
     */
    widgetData: any
  ;
  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'author⮕w⮕tag-content⮕main',
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;
  $: ({ theme } = { ...$userBetarenaSettings });
  $: ({ windowWidth } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );
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


  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id="{CNAME}"
  class="tags-main"
  class:tablet={VIEWPORT_TABLET_INIT[1]}
>
  <TagsHeader tag={widgetData.tags[0]} mobile={VIEWPORT_MOBILE_INIT[1]}/>
  {#if !VIEWPORT_MOBILE_INIT[1]}
    <div class="splitter" />
  {/if}
  <div class="articles">
    {#each widgetData.dataArticle as article}
      <ArticleCard {article} tablet={VIEWPORT_TABLET_INIT[1]} mobile={VIEWPORT_MOBILE_INIT[1]}/>
    {/each}
  </div>
  <div class="section-footer" class:mobile={VIEWPORT_MOBILE_INIT[1]}>
    <div class="page-info">
      5 of 98 articles
    </div>
    <Button type="outline">View more</Button>
  </div>
 </div>


 <!--
 ╭──────────────────────────────────────────────────────────────────────────────────╮
 │ 🌊 Svelte Component CSS/SCSS                                                     │
 ┣──────────────────────────────────────────────────────────────────────────────────┫
 │ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
 │         │ values by typing/CTRL+SPACE                                            │
 │ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
 ╰──────────────────────────────────────────────────────────────────────────────────╯
 -->

 <style lang="scss">

  .tags-main {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
    height: 100%;

    &.tablet {
      padding: 0 34px;
    }

    .splitter {
      height: 1px;
      width: 100%;
      background: var(--dark-theme-1);

    }

    .articles {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;

    }

    .section-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.mobile {
        padding: 0 24px;
      }

      .page-info {
        color: var(--colors-gray4, #CCC);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }


 </style>
