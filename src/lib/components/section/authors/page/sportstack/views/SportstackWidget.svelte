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

  import { page } from "$app/stores";
  import type { IPageAuthorSportstackData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import SportstackMain from "./SportstackMain.svelte";

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
  interface IPageData {
    articles: IPageAuthorSportstackData;
    translations: IPageAuthorTranslationDataFinal;
  }
  $: ({ articles, translations } = $page.data as IPageData);

  // #endregion ➤ 📌 VARIABLES

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


{#await articles}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <!-- <div
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
  </div> -->
{:then}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is fulfilled                                          │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->
  <SportstackMain widgetData={articles} {translations} />
{:catch error}
  <!--
    ╭────────────────────────────────────────────────────────────────────────╮
    │ NOTE :|: promise is rejected                                           │
    ╰────────────────────────────────────────────────────────────────────────╯
    -->
{/await}
