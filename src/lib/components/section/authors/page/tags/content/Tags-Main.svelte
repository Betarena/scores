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


  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { viewportChangeV2 } from '$lib/utils/device';


  import TagsHeader from './Tags-Header.svelte';
  import ArticleCard from './Articels-Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import type { IPageAuthorArticleData, IPageAuthorAuthorData, IPageAuthorDataFinal, IPageAuthorTagData } from '@betarena/scores-lib/types/v8/preload.authors.js';

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
    widgetData: IPageAuthorDataFinal & {currentTag: IPageAuthorTagData}
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


  /**
   * @description
   *  📣 array of articles that will be rendered
   *    */
   let visibleArticles: IArticle[] = []

  $: ({ windowWidth } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );

    interface IArticle extends IPageAuthorArticleData {
      author?: IPageAuthorAuthorData,
      tags_data: (IPageAuthorTagData | undefined)[]
    }

  // #endregion ➤ 📌 VARIABLES

/**
 * @summary
 * 🔥 REACTIVITY
 *
 * WARNING:
 * can go out of control
 *
 * @description
 * convert widgetData to Map
 *
 * WARNING:
 * triggered by changes in:
 * - `` - **widgetData**
 */
  $: articles =  widgetData.mapArticle;
  $: tags = new Map(widgetData.mapTag);
  $: authors = new Map(widgetData.mapAuthor);

  /**
 * @summary
 * 🔥 REACTIVITY
 *
 * WARNING:
 * can go out of control
 *
 * @description
 * it reruns loadArticles every time articles has changed
 *
 * WARNING:
 * triggered by changes in:
 * - `` - **articles**
 */

 $: {
  visibleArticles = [];
  loadArticles(articles)
}

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

  function prepareArticle(article:[number, IPageAuthorArticleData]): IArticle {
    const [_id, data] = article;
    const preparedArticle: IArticle = {tags_data: [], ...data} as IArticle;
    if (data.author_id) {
      preparedArticle.author = authors.get(data.author_id);
    }
    if (data.tags?.length) {
      preparedArticle.tags_data = data.tags.map(id => tags.get(id));
    }

    return preparedArticle
  }

  function loadArticles(data: [number, IPageAuthorArticleData][] | undefined) {
    if (!data) return;
    const loaded = visibleArticles.length;
    const splited = data.slice(loaded, loaded + 5);
    visibleArticles = [...visibleArticles, ...splited.map(a => prepareArticle(a))]
  }


  // #endregion ➤ 🛠️ METHODS

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
  <TagsHeader tag={widgetData.currentTag} mobile={VIEWPORT_MOBILE_INIT[1]}/>
  {#if !VIEWPORT_MOBILE_INIT[1]}
    <div class="splitter" />
  {/if}
  <div class="articles">
    {#each visibleArticles as article}
      <ArticleCard article= {article} tablet={VIEWPORT_TABLET_INIT[1]} mobile={VIEWPORT_MOBILE_INIT[1]}/>
    {/each}
  </div>
  <div class="section-footer" class:mobile={VIEWPORT_MOBILE_INIT[1]}>
    <div class="page-info">
      {visibleArticles.length} of {articles?.length || 0} articles
    </div>
    <Button type="outline" on:click={() => loadArticles(articles)}>View more</Button>
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
