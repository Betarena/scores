<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { modalStore } from "$lib/store/modal.js";
  import { onMount, setContext } from "svelte";
  import Editor from "./Editor.svelte";
  import ModalArticleSeo from "./ModalArticleSEO.svelte";
  import { create_article_store } from "./create_article.store.js";
  import TagsView from "./TagsView.svelte";
  import SeoView from "./SeoView.svelte";

  let view = "tags";
  let prevView = "tags";

  onMount(() => {
    modalStore.set({
      modal: true,
      component: ModalArticleSeo,
      show: false,
    });
  });

  function handleClick() {
    $modalStore.show = true;
  }

  function changeView(newView: string) {
    prevView = view;
    view = newView;
    if (["seo", "tags"].includes(newView)) {
      $modalStore.show = false;
      return;
    }
    if (newView === "editor" && prevView !== "editor") {
      $modalStore.show = true;
    }
  }
  $: changeView($create_article_store.view);
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

{#if view === "editor"}
  <Editor />
{:else if view === "tags"}
  <TagsView />
{:else}
  <SeoView />
{/if}
