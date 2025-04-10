<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Code Format // V.8.0                                                  │
│ ➤ Status               // 🔒 LOCKED                                              │
│ ➤ Author(s)            // @migbash                                               │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Betarena (Component) || Authors Content Widget (entry)                           │
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

  import sessionStore from '$lib/store/session.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import Tabbar from '$lib/components/ui/Tabbar.svelte';
  import ArticleLoader from './Article-Loader.svelte';
  import ArticleMain from './Article-Main.svelte';

  import { viewportChangeV2 } from '$lib/utils/device.js';
  import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

  import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
  import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';

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

  $: ({ windowWidth } = $sessionStore);
  $: [mobile, tablet]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0]
    )
  ;

  $: widgetData = $page.data as IPageAuthorTagDataFinal & {
    translations: IPageAuthorTranslationDataFinal;
  } | undefined;
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `tag(s)`.
   */
  $: mapTags = new Map(widgetData?.mapTag ?? []);
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `author(s)`.
   */
  $: mapAuthors = new Map(widgetData?.mapAuthor ?? []);
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `article(s)`.
   */
  $: mapArticles = new Map(widgetData?.mapArticle ?? []);
  /**
   * @description
   * 📝 Currently selected tag data.
   */
  $: selectedTag = mapTags.get(widgetData?.tagId ?? 0);
  /**
   * @description
   * 📝 Categories avaialble.
   */
  $: categories = selectedTag != undefined ? [selectedTag] : [];

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
   *  @migbash
   * @summary
   *  🟩 MAIN
   * @description
   *  📣 main widget data loader
   *  - ⚡️ (and) try..catch (error) handler
   *  - ⚡️ (and) placeholder handler
   * @returns { Promise < void > }
   */
  async function widgetInit
  (
  ): Promise < void >
  {
    // IMPORTANT
    if (!browser) return;

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

<SeoBox>
  <h1>{selectedTag?.name}</h1>

  <!--
  ╭─────
  │ > Loop through articles
  ╰─────
  -->
  {#each [...mapArticles.entries()] as [, article]}
    <h2>
      {article.data?.title}
    </h2>
    <a>{article.a}</a>
    <a
      href={`/a/${article.permalink}`}
    >
      {article.data?.title}
    </a>
  {/each}

  <!--
  ╭─────
  │ > Loop through tags
  ╰─────
  -->
  {#each [...mapTags.entries()] as [_id, tag]}
    <a href={`/a/tag/${tag.permalink}`}>{tag.name}</a>
  {/each}

  {#each [...mapAuthors.entries()] as [_id, author]}
  <a href="/a/user/{mutateStringToPermalink(author?.data?.username)}" >{author?.data?.username}</a>
  {/each}
</SeoBox>

{#await widgetInit()}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <div
    class="tabbar-wrapper"
  >
    {#if categories.length}
      <Tabbar
        data={categories}
        selected={selectedTag}
        height={mobile ? 14 : 8}
      />
    {/if}
  </div>

  <div
    class="listArticlesMod"
  >
    {#each Array(10) as _item}
      <ArticleLoader
        {mobile}
        {tablet}
      />
    {/each}
  </div>

{:then data}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is fulfilled                                          │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->

  <ArticleMain />

{:catch error}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is rejected                                           │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->

{/await}
