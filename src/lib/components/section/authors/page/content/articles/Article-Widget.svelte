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
  import ArticleLoader from './Article-Loader.svelte';
  import ArticleMain from './Article-Main.svelte';

  import { viewportChangeV2 } from '$lib/utils/device.js';
  import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

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

  $: ({ windowWidth } = $sessionStore);
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

  $: ( { objAuthorContentHome, objAuthorContentForecast } = ($page.data as IPreloadResponse) );

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

  <!--
  ╭──────────────────────────────────────────────────────────────────────────────────╮
  │ 💠 │ AUTHOR - HOME FEED SEO                                                      │
  ╰──────────────────────────────────────────────────────────────────────────────────╯
  -->

  <h1>Home</h1>

  {#each (objAuthorContentHome?.mapArticle ?? []) as [, article]}
    <h2>{article.data?.title}</h2>
    <a href={`/a/${article.permalink}`}>{article.data?.title}</a>
  {/each}

  {#each (objAuthorContentHome?.mapTag ?? []) as [, tag]}
    <a href={`/a/tag/${tag.permalink}`}>{tag.name}</a>
  {/each}

  {#each (objAuthorContentHome?.mapAuthor ?? []) as [, author]}
    {#if author.data?.username}
      <a href="/a/user/{mutateStringToPermalink(author.data.username)}">
        {author.data.username}
      </a>
    {/if}
  {/each}

  <!--
  ╭──────────────────────────────────────────────────────────────────────────────────╮
  │ 💠 │ AUTHOR - FORECAST FEED SEO                                                  │
  ╰──────────────────────────────────────────────────────────────────────────────────╯
  -->

  <h1>{(new Map(objAuthorContentForecast?.mapTag ?? [])).get(objAuthorContentForecast?.tagId ?? 0)?.name}</h1>

  {#each (objAuthorContentForecast?.mapArticle ?? []) as [, article]}
    <h2>{article.data?.title}</h2>
    <a href={`/a/${article.permalink}`}>{article.data?.title}</a>
  {/each}

  {#each (objAuthorContentForecast?.mapTag ?? []) as [, tag]}
    <a href={`/a/tag/${tag.permalink}`}>{tag.name}</a>
  {/each}

  {#each (objAuthorContentForecast?.mapAuthor ?? []) as [, author]}
    {#if author.data?.username}
      <a href="/a/user/{mutateStringToPermalink(author.data.username)}">
        {author.data.username}
      </a>
    {/if}
  {/each}
</SeoBox>

{#await widgetInit()}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <div
    class="listArticlesMod"
  >
    {#each Array(10) as _item}
      <ArticleLoader
        mobile={VIEWPORT_MOBILE_INIT[1]}
        tablet={VIEWPORT_TABLET_INIT[1]}
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
