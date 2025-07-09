<script>
  import { page } from "$app/stores";
  import SportsTackList from "$lib/components/ui/composed/sportstack_list/SportsTackList.svelte";
  import { infiniteScroll } from "$lib/utils/infinityScroll";
  import search_store from "$lib/store/search_store";
  import { createEventDispatcher } from "svelte";
  import NoResults from "./NoResults.svelte";
  import session from "$lib/store/session";

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

  $: ({ translations } = $page.data);
  $: sportstacks = $search_store.sportstacks.data || new Map();
  $: ({ loading } = $search_store.sportstacks);
  $: ({ viewportType } = $session);

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
      type: "sportstacks",
      page: $search_store.sportstacks.page + 1,
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
<div
  class="wrapper {viewportType}"
  use:infiniteScroll={{
    loadMore,
    hasMore: !!$search_store.sportstacks.next_page_count,
    loading,
  }}
>
  {#if sportstacks.size || $search_store.sportstacks.loading}
    <SportsTackList
      includePermalink={true}
      {sportstacks}
      {translations}
      {loading}
      size="lg"
      limit={$search_store.sportstacks.next_page_count}
    />
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

    &:not(.mobile) {
      :global(.list-wrapper) {
        gap: 21px;
      }
      :global(.list-item) {
        padding-block: 0;
      }
    }
  }
</style>
