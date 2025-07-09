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
  import { page } from "$app/stores";
  import session from "$lib/store/session.js";
  import { infiniteScroll } from "$lib/utils/infinityScroll.js";
  import { createEventDispatcher } from "svelte";
  import ArticleCard from "../authors/common_ui/articles/Article-Card.svelte";
  import ArticleLoader from "../authors/common_ui/articles/Article-Loader.svelte";
  import search_store from "$lib/store/search_store.js";
  import NoResults from "./NoResults.svelte";

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

  const dispatch = createEventDispatcher();

  $: ({ viewportType } = $session);
  $: articles = $search_store.articles.data || new Map();
  $: ({ loading } = $search_store.articles);
  $: mobile = viewportType === "mobile";
  $: tablet = viewportType === "tablet";
  $: ({ translations } = $page.data);
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

  function loadMore() {
    if (loading) return;
    dispatch("loadMore", {
      type: "articles",
      page: $search_store.articles.page + 1,
    });
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
<div class="wrapper {viewportType}" use:infiniteScroll={{ loadMore, hasMore: !!$search_store.articles.next_page_count, loading }}>
  {#if articles.size || $search_store.articles.loading}
    {#if articles.size > 0}
        {#each [...articles.entries()] as [id, article] (id)}
          <ArticleCard {mobile} {article} {tablet} />
        {/each}
    {/if}

    {#if loading}
      {#each Array($search_store.articles.next_page_count) as _}
        <ArticleLoader {mobile} {tablet} />
      {/each}
    {/if}
  {:else}
    <NoResults />
  {/if}
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
  .wrapper {
    flex-grow: 1;
    max-height: 100%;
    min-height: 100%;
    overflow: auto;
    padding-bottom: 100px;
    background: var(--colors-background-bg-secondary);

    &:not(.mobile){
      display: flex;
      flex-direction: column;
      gap: 21px;
    }
  }
</style>
