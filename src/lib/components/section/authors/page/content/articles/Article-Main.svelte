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

  import { browser } from '$app/environment';
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

  $: ({ windowWidth, globalState } = $sessionStore);
  $: ({ user: { scores_user_data: { following: { tags } = {} } = {} } = {} } = $userBetarenaSettings);
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
     * 📝 `Map` data for `article(s)`, ready for frontend consumption.
     */
    mapArticlesMod =  new Map < number, IArticle >(),
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
    isStateLoadingArticles = true,
    /**
     * @description
     * 📝 State UI for `selected` tag.
     */
    strStateSelectedFeed: 'home' | 'forecast' = 'home'
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
  )
  ;
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
  )
  ;
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
  )
  ;

  $: if (objPageDataWidget.objAuthorContentForecast?.tagId && mapTags.size > 0 && listFeedViews.length === 1)
    listFeedViews.push(mapTags.get(objPageDataWidget.objAuthorContentForecast.tagId));
  ;

  $: if (browser)
    // @ts-expect-error :: <?>
    updateData(objPageDataWidget.objAuthorContentHome, true);
  ;

  $: if (globalState.has('Authenticated') || globalState.has('NotAuthenticated'))

    listFeedViews = listFeedViews.map
    (
      (
        item
      ) =>
      {
        if (item.id === 0 && globalState.has('Authenticated'))
          return {
            ...item,
            name: 'My Feed'
          }
        else if (item.id === 0 && globalState.has('NotAuthenticated'))
          return {
            ...item,
            name: 'Home'
          }
          ;

        return item;
      }
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

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Selects `tag`.
   * @return { void }
   */
  function selectFeed
  (
  ): void
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ selectFeed(..) // START',
        msgs:
        [
          `🔹 [var] ➤ strStateSelectedFeed :: ${strStateSelectedFeed}`
        ]
      }
    );

    mapArticlesMod = new Map();

    if (!mapTagSelectData.has(strStateSelectedFeed))
      loadTagArticles();
    else
      mapArticlesMod = mapTagSelectData.get(strStateSelectedFeed)?.mapArticlesMod ?? new Map();
    ;

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ selectFeed(..) // END'
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
   *  📝 Update data for 'content' page.
   * @param { ITagsWidgetData } dataNew
   *  💠 **REQUIRED** New data instance.
   * @returns { void }
   */
  function updateData
  (
    dataNew: ITagsWidgetData,
    reset: boolean = false
  ): void
  {
    // [🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ updateData(..) // START',
      [
        `🔹 [var] ➤ reset :: ${reset}`,
        `🔹 [var] ➤ dataNew :: ${JSON.stringify(dataNew)}`,
      ]
    );

    if (reset)
    {
      mapArticles = new Map();
      mapAuthors = new Map();
      mapTags = new Map();
      mapTagSelectData = new Map();
      mapArticlesMod = new Map();
    }

    const
      /**
       * @description
       * 📝 `Map` article generated from NEW data.
       */
      mapNewArticlesMod
        = prepareArticlesMap
        (
          new Map(dataNew.mapArticle),
          new Map(dataNew.mapTag),
          new Map(dataNew.mapAuthor),
        )
    ;

    mapArticles = new Map([...mapArticles, ...dataNew.mapArticle]);
    mapAuthors = new Map([...mapAuthors, ...dataNew.mapAuthor]);
    mapTags = new Map([...mapTags, ...dataNew.mapTag]);
    mapArticlesMod = new Map([...mapArticlesMod, ...mapNewArticlesMod]);

    if (!mapTagSelectData.has(strStateSelectedFeed))
      mapTagSelectData.set
      (
        strStateSelectedFeed,
        {
          ...dataNew,
          mapArticlesMod,
          currentPage: 0,
          totalArticlesCount: dataNew.totalArticlesCount,
        }
      );
    ;

    isStateLoadingArticles = false;

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ updateData(..) // END'
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
  async function loadMore
  (
  ): Promise < void >
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ loadMore(..) // START',
      }
    );

    const
      /**
       * @description
       * 📝 Selected 'tag' tab data.
       */
      objSelectedFeed = mapTagSelectData.get(strStateSelectedFeed)
    ;

    if
    (
      !objSelectedFeed
      || ((objSelectedFeed.mapArticlesMod.size || 0) === objSelectedFeed.totalArticlesCount)
    ) return;

    await loadTagArticles
    (
      (objSelectedFeed.currentPage + 1)
    );

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ loadMore(..) // END',
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
   *  💠 **REQUIRED** Number page to request.
   * @return { Promise < void > }
   */
  async function loadTagArticles
  (
    page: number = 0
  ): Promise < void >
  {
    // [🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ loadTagArticles(..) // START',
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
      url = `/api/data/author.home?&lang=${$sessionStore.serverLang}&page=${page}&type=${strStateSelectedFeed}`
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

    updateData(dataRes0);

    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ loadTagArticles(..) // END',
      }
    );

    if (!dataRes0) return;

    mapTagSelectData.set
    (
      strStateSelectedFeed,
      {
        ...dataRes0,
        mapArticlesMod,
        currentPage: page,
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
      if (!globalState.has('IsPWA') && (VIEWPORT_MOBILE_INIT[1] || VIEWPORT_TABLET_INIT[1])) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5)
        loadMore();
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
        type="tertiary"
        style=
        "
        {
          strStateSelectedFeed != (item.id === 0 ? 'home' : 'forecast')
            ? 'background-color: #313131; color: #F5620F;'
            : 'color: #8C8C8C;'
        }
        "
        on:click=
        {
          () =>
          {
            strStateSelectedFeed
              = item.id === 0
                ? 'home'
                : 'forecast'
            ;
            selectFeed();
            return;
          }
        }
      >
        {item.name}
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
    {#each [...mapArticlesMod.entries()] as [id,article] (id)}
      <ArticleCard
        mobile={VIEWPORT_MOBILE_INIT[1]}
        tablet={VIEWPORT_TABLET_INIT[1]}
        {article}
      />
    {/each}

    {#if isStateLoadingArticles}
      {#each Array(10) as _item}
        <ArticleLoader
          mobile={VIEWPORT_MOBILE_INIT[1]}
          tablet={VIEWPORT_TABLET_INIT[1]}
        />
      {/each}
    {/if}
  </div>

  {#if (VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1]) && !globalState.has('IsPWA') && mapArticlesMod.size}
    <div class="load-more">
      <Button type="outline" on:click={loadMore}>Load More</Button>
    </div>
  {/if}
</div>
