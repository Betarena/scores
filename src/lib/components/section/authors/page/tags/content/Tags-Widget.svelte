<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @izobov                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authors Tags                                                              │
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
  import { afterNavigate, beforeNavigate } from '$app/navigation';

  import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import TagsLoader from './Tags-Loader.svelte';
  import TagsMain from './Tags-Main.svelte';

  import type { IPageAuthorArticleData, IPageAuthorTagData } from '@betarena/scores-lib/types/v8/preload.authors.js';

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
  export let data;
  let loading = false;
  $: widgetDataMain = data as any;
  $: tags = new Map(widgetDataMain?.mapTag ?? []) as Map<
    Number,
    IPageAuthorTagData
  >;
  $: mapAuthors = new Map(widgetDataMain?.mapAuthor ?? []) as Map<
    Number,
    IPageAuthorArticleData
  >;
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

  beforeNavigate(({ to }) => {
    if (to?.route.id === $page.route.id) {
      loading = true;
    }
  });
  afterNavigate((b) => {
    loading = false;
  });

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
  <h1>{tags.get(widgetDataMain.tagId)?.name}</h1>

  {#each [...tags.entries()] as [_id, tag]}
    <a href={`/a/tag/${tag.permalink}`}>{tag.name}</a>
  {/each}

  {#each widgetDataMain.mapArticle ?? [] as [_id, article]}
    <h2>{article?.data?.title}</h2>
    <a href={`${$page.url.origin}/a/${article?.permalink}`}
      >{article?.data?.title}</a
    >
  {/each}

  {#each [...mapAuthors.entries()] as [_id, author]}
    <a
      href="/a/user/{mutateStringToPermalink(author?.data?.username)}"
    >
      {author?.data?.username}
    </a>
  {/each}
</SeoBox>

<!-- [🐞] -->

{#await data}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <TagsLoader />
{:then}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is fulfilled                                          │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  {#if loading}
    <TagsLoader />
  {:else}
    <!-- else content here -->
    <TagsMain widgetData={widgetDataMain} />
  {/if}
{:catch error}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is rejected                                           │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
{/await}
