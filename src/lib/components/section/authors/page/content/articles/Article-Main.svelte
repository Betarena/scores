<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format |:| V.8.0                                          │
│ ➤ Status |:| 🔒 LOCKED                                                           │
│ ➤ Author(s) |:| @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Betarena (Component) || Authors Content Main                                     │
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

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import { get } from '$lib/api/utils.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { dlogv2, log_v3 } from '$lib/utils/debug.js';
  import { viewportChangeV2 } from '$lib/utils/device.js';

  import Button from '$lib/components/ui/Button.svelte';
  import ArticleCard from '../../../common_ui/articles/Article-Card.svelte';
  import ArticleLoader from './Article-Loader.svelte';

  import { prepareArticlesMap, type IArticle, type ITagsWidgetData } from '../../helpers.js';

  import type { IPageTranslationHomeDataFinal } from '@betarena/scores-lib/types/v8/core.translation.js';
  import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ ⛩️ TYPES

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 INTERFACE
   * @description
   *  📝 Interface for `_this_` page required at preload.
   */
  interface IPreloadResponse
  {
    /**
     * @description
     */
    objAuthorContentHome?: IPageAuthorTagDataFinal;
    /**
     * @description
     */
    objAuthorContentForecast?: IPageAuthorTagDataFinal;
    /**
     * @description
     */
    objGeneralHomeTranslation?: IPageTranslationHomeDataFinal;
  }

  // #endregion ➤ ⛩️ TYPES

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
    /**
     * @description
     *  📝 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'content',
    /**
     * @description
     *  📝 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📝 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true]
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ STORES ACCESS                                                               │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  $: ({ windowWidth, globalState, serverLang } = $sessionStore);
  // $: ({ user } = $userBetarenaSettings);
  $: ({ user: { scores_user_data: { following: { tags } = {} } = {} } = {}, objHistory: { strContentSelectFeed } } = $userBetarenaSettings);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0]
    )
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ WIDGET ACCESS                                                               │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  $: objPageDataWidget = $page.data as IPreloadResponse;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ WIDGET VARIABLES                                                            │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  let
    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 💠 │ STANDARD VARIABLES                                                          │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯
    /**
     * @description
     * 📝 `Map` where, `key=tagId` and `value=tagData`.
     */
    mapTagSelectData
      = new Map
        <
          'home' | 'forecast',
          ITagsWidgetData &
          {
            mapArticlesMod: Map < number, IArticle >;
            currentPage: number;
          }
        >(),
    /**
     * @description
     * 📝 `List` data for `tag(s)`, ready for frontend consumption.
     */
    listFeedViews: IPageAuthorTagDataFinal['mapTag'][0][1][]
      = [
        { id: 0, name: 'Home' }
      ],

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 💠 │ STATUS STATE                                                                │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯
    /**
     * @description
     * 📝 State UI for `Loading Articles`.
     */
    isStateLoadingArticles = true
  ;

  /**
   * @description
   * 📝 Interecpted data for `map` instance of `author(s)`.
   */
  $: mapAuthors = new Map
  (
    [
      ...(objPageDataWidget.objAuthorContentHome?.mapAuthor ?? []),
      ...(objPageDataWidget.objAuthorContentForecast?.mapAuthor ?? [])
    ]
  );
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `article(s)`.
   */
  $: mapArticles = new Map
  (
    [
      ...(objPageDataWidget.objAuthorContentHome?.mapArticle ?? []),
      ...(objPageDataWidget.objAuthorContentForecast?.mapArticle ?? [])
    ]
  );
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `tag(s)`.
   */
  $: mapTags = new Map
  (
    [
      ...(objPageDataWidget.objAuthorContentHome?.mapTag ?? []),
      ...(objPageDataWidget.objAuthorContentForecast?.mapTag ?? [])
    ]
  );

  $: if (objPageDataWidget.objAuthorContentForecast?.tagId && mapTags.size > 0 && listFeedViews.length === 1)
    listFeedViews.push(mapTags.get(objPageDataWidget.objAuthorContentForecast.tagId));
  ;

  $: if (browser)
  {
    helperReInitializeData
    (
      // @ts-expect-error :: <?>
      objPageDataWidget.objAuthorContentHome,
      'home'
    );
    helperReInitializeData
    (
      // @ts-expect-error :: <?>
      objPageDataWidget.objAuthorContentForecast,
      'forecast'
    );
  }

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

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Update data for 'content' page.
   * @param { ITagsWidgetData } objDataNew
   *  ❗️ **REQUIRED** New data instance.
   * @param { null | 'home' | 'forecast' } [_strStateSelectedFeed=null]
   *  ❔ **OPTIONAL** State selected feed.
   * @param { number } [intCurrentPage=0]
   *  ❗️ **OPTIONAL** Current page.
   * @returns { void }
   */
  function helperReInitializeData
  (
    objDataNew: ITagsWidgetData,
    _strStateSelectedFeed: null | 'home' | 'forecast' = null,
    intCurrentPage: number = 0
  ): void
  {
    _strStateSelectedFeed ??= strContentSelectFeed;

    // [🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ Article-Main.helperReInitializeData(..) // START',
      [
        // `🔹 [var] ➤ objDataNew :: ${JSON.stringify(objDataNew)}`,
        `🔹 [var] ➤ strContentSelectFeed :: ${strContentSelectFeed}`,
        `🔹 [var] ➤ _strStateSelectedFeed :: ${_strStateSelectedFeed}`,
      ]
    );

    // ╭─────
    // │ NOTE:
    // │ |: Inject 'new' data into `mapArticles`, `mapAuthors` and `mapTags`.
    // ╰─────
    mapArticles = new Map([...mapArticles, ...objDataNew.mapArticle]);
    mapAuthors = new Map([...mapAuthors, ...objDataNew.mapAuthor]);
    mapTags = new Map([...mapTags, ...objDataNew.mapTag]);

    const
      /**
       * @description
       * 📝 `Map` article generated from OLD data.
       */
      mapOldArticlesMod: Map < number, IArticle > = mapTagSelectData.get(_strStateSelectedFeed)?.mapArticlesMod ?? new Map(),
      /**
       * @description
       * 📝 `Map` article generated from NEW data.
       */
      mapNewArticlesMod
        = prepareArticlesMap
        (
          new Map(objDataNew.mapArticle),
          new Map(objDataNew.mapTag),
          new Map(objDataNew.mapAuthor),
        )
    ;

    mapTagSelectData.set
    (
      _strStateSelectedFeed,
      {
        ...objDataNew,
        // ╭─────
        // │ NOTE: IMPORTANT
        // │ |: Override properties
        // ╰─────
        mapArticlesMod: new Map([...mapOldArticlesMod, ...mapNewArticlesMod]),
        currentPage: intCurrentPage,
        totalArticlesCount: objDataNew.totalArticlesCount,
      }
    );

    // ╭─────
    // │ NOTE: IMPORTANT
    // │ |: Reinitialize `mapTagSelectData` with new data.
    // ╰─────
    mapTagSelectData = mapTagSelectData;

    isStateLoadingArticles = false;

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ Article-Main.helperReInitializeData(..) // END',
        msgs:
        [
          `🔹 [var] ➤ mapTagSelectData.keys :: ${JSON.stringify([...mapTagSelectData.keys()])}`,
          `🔹 [var] ➤ mapTagSelectData.size :: ${mapTagSelectData.size}`,
          `🔹 [var] ➤ mapOldArticlesMod.size :: ${mapOldArticlesMod.size}`,
          `🔹 [var] ➤ mapNewArticlesMod.size :: ${mapNewArticlesMod.size}`,
        ]
      }
    );

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Selects target feed `tag`.
   * @return { void }
   */
  function helperSelectFeed
  (
  ): void
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ helperSelectFeed(..) // START',
        msgs:
        [
          `🔹 [var] ➤ strContentSelectFeed :: ${strContentSelectFeed}`
        ]
      }
    );

    if (!mapTagSelectData.has(strContentSelectFeed))
      helperLoadTagArticles();
    ;

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ helperSelectFeed(..) // END'
      }
    );

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Check for instance of loading more articles.
   * @return { Promise < void > }
   */
  async function helperTryLoadMore
  (
  ): Promise < void >
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ helperTryLoadMore(..) // START',
      }
    );

    const
      /**
       * @description
       * 📝 Selected 'tag' tab data.
       */
      objSelectedFeed = mapTagSelectData.get(strContentSelectFeed)
    ;

    if
    (
      !objSelectedFeed
      || ((objSelectedFeed.mapArticlesMod.size || 0) === objSelectedFeed.totalArticlesCount)
    ) return;

    await helperLoadTagArticles
    (
      (objSelectedFeed.currentPage + 1)
    );

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ helperTryLoadMore(..) // END',
      }
    );

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Load tag articles.
   * @param { number } [page=0]
   *  ❔ **OPTIONAL** Number page to request.
   * @return { Promise < void > }
   */
  async function helperLoadTagArticles
  (
    page: number = 0
  ): Promise < void >
  {
    // [🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ helperLoadTagArticles(..) // START',
      [
        `🔹 [var] ➤ page :: ${page}`,
      ]
    );

    isStateLoadingArticles = true;

    let
      /**
       * @description
       * 📝 URL to be requested.
       */
      url = `/api/data/author.home?&lang=${serverLang}&page=${page}&type=${strContentSelectFeed}`
    ;

    if (tags?.length)
      url += `&followingTags=${tags.join(',')}`;
    ;

    const
      /**
       * @description
       * 📝 Data Response (0).
       */
      dataRes0
        = await get
        (
          url
        )!
    ;

    helperReInitializeData
    (
      // @ts-expect-error :: <?>
      dataRes0,
      null,
      page
    );

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ Article-Main.helperLoadTagArticles(..) // END',
      }
    );

    return;
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

<svelte:window
  on:scroll=
  {
    () =>
    {
      if (!globalState.has('IsPWA') && (VIEWPORT_MOBILE_INIT[1] || VIEWPORT_TABLET_INIT[1]))
        return;
      ;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5)
        helperTryLoadMore();
      ;

      return;
    }
  }
/>

<!--
╭─────
│ > INSERT-DESCRIPTION
╰─────
-->
<div
  class="tabbar-wrapper"
  style=
  "
  {
    VIEWPORT_MOBILE_INIT[1]
      ? 'width: 100% !important;'
      : ''
  }
  "
>
  {#if listFeedViews.length}
    <!--
    ╭─────
    │ NOTE:
    │ |:
    ╰─────
    -->
    {#each listFeedViews as item}
      <Button
        full={true}
        type="tertiary-v2"
        classname=
        "
        {
          strContentSelectFeed === (item.id === 0 ? 'home' : 'forecast')
            ? 'selected'
            : ''
        }
        "
        style=
        "
        height: 36px;
        "
        on:click=
        {
          () =>
          {
            strContentSelectFeed
              = item.id === 0
                ? 'home'
                : 'forecast'
            ;
            userBetarenaSettings.updateData
            (
              [
                ['history-preference-articles-content-feed', strContentSelectFeed]
              ]
            );
            helperSelectFeed();
            return;
          }
        }
      >
        {#if item.id === 0 && globalState.has('Authenticated')}
        <!-- {#if item.id === 0 && user} -->
          {objPageDataWidget.objGeneralHomeTranslation?.translation?.for_you ?? 'For you'}
        {:else if item.id === 0 && globalState.has('NotAuthenticated')}
        <!-- {#if item.id === 0} -->
          {objPageDataWidget.objGeneralHomeTranslation?.translation?.home ?? 'Home'}
        {:else}
          {item.name}
        {/if}
      </Button>
    {/each}
  {/if}
</div>

<!--
╭─────
│ > INSERT-DESCRIPTION
╰─────
-->
<div
  class="content"
>
  <div
    class="listArticlesMod"
  >
    {#each [...(mapTagSelectData.get(strContentSelectFeed)?.mapArticlesMod.entries() ?? [])] as [id,article] (id)}
      <ArticleCard
        mobile={VIEWPORT_MOBILE_INIT[1]}
        tablet={VIEWPORT_TABLET_INIT[1]}
        {article}
      />
    {/each}

    {#if isStateLoadingArticles}
      {#each { length: 10 } as _}
        <ArticleLoader
          mobile={VIEWPORT_MOBILE_INIT[1]}
          tablet={VIEWPORT_TABLET_INIT[1]}
        />
      {/each}
    {/if}
  </div>

  {#if
    (VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1])
    && !globalState.has('IsPWA')
    && (mapTagSelectData.get(strContentSelectFeed)?.mapArticlesMod ?? new Map).size
  }
    <div class="load-more">
      <Button type="outline" on:click={helperTryLoadMore}>Load More</Button>
    </div>
  {/if}
</div>
