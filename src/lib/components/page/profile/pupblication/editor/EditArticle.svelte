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
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { deleteArticle, publish, upsert } from "./helpers.js";
  import { create_article_store } from "./create_article.store.js";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import Editor from "./Editor.svelte";
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import Unpublish from "../Unpublish.svelte";
  import DeleteModal from "../DeleteModal.svelte";
  import PublishModal from "./PublishModal.svelte";
  import type {
    AuthorsAuthorsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/article/edit/[...permalink]/[lang=lang]/$types.js";
  import { getOptimizedImageUrl } from "$lib/utils/image.js";

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
  export let data: PageData;

  let options: (AuthorsAuthorsMain & { label: string })[] = [];
  let selectedSportstack;
  let contentEditor;

  $: ({ article, mapTag } = data);
  $: ({ id, status } = article);
  $: ({
    title: initTitle,
    content,
    featured_image,
  } = article.data || { title: "", content: "", featured_image: "", id: "" });
  $: translations = (data as any).RESPONSE_PROFILE_DATA
    .sportstack2 as TranslationSportstacksSectionDataJSONSchema;

  $: title = initTitle || "";
  $: if (featured_image && !content.includes(featured_image)) {
    content = `<img src="${getOptimizedImageUrl({
      strImageUrl: featured_image,
    })}" alt="${title}" />${content}`;
  }
  $: uploadUrl = selectedSportstack
    ? `Betarena_Media/authors/authors_list/${selectedSportstack.id}/media`
    : "";
  $: ({ viewportType } = $session);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $: if (data.sportstack instanceof Promise) {
    console.log("data.sportstack is a promise");
  } else {
    options = data.sportstacks.map((s) => {
      const sportstack = { ...s, label: s.data?.username || "" };
      if (sportstack.id === article.author_id) {
        selectedSportstack = sportstack;
      }
      return sportstack;
    });
    if (!selectedSportstack && browser) {
      selectedSportstack = options[0];
      const { url } = $page;
      url.searchParams.set("sportstack", selectedSportstack.permalink);
      goto(url, { replaceState: true, noScroll: true, keepFocus: true });
    }
  }

  $: if (article && mapTag) {
    create_article_store.set({
      tags: mapTag.map(([_id, tag]) => tag.name as string),
      seo: {
        title: article.seo_details?.main_data.title || "",
        description: article.seo_details?.main_data.description || "",
      },
      view: "preview",
    });
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

  function back() {
    history.back();
  }

  function selectSportstack(e) {
    const url = $page.url;
    const { permalink } = e.detail as AuthorsAuthorsMain;
    selectedSportstack = e.detail as AuthorsAuthorsMain;
    url.searchParams.set("sportstack", permalink);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  function showModal(action: "unpublish" | "delete") {
    const modalState: any = {
      modal: true,
      show: true,
      props: {
        id,
        cb: action === "delete" ? deleteArticleWrapper : unpublish,
        translations,
      },
      component: action === "delete" ? DeleteModal : Unpublish,
    };
    modalStore.set(modalState);
  }

  function save() {
    upsert({
      translations,
      editor: contentEditor,
      title,
      id,
      author: selectedSportstack,
    });
  }

  async function unpublish() {
    const res = await publish({
      id,
      translations,
      status: "unpublish",
      sportstack: selectedSportstack,
      redirect: false,
    });
    if (res.success) {
      status = "unpublished";
      article.status = status;
    }
  }
  async function deleteArticleWrapper() {
    const res = await deleteArticle(article, translations);
    if (res.success) {
      setTimeout(() => {
        goto(
          `/u/author/publication/${article.author.permalink}/${session.extract(
            "lang"
          )}?view=articles`,
          { invalidateAll: true }
        );
      }, 500);
    }
  }

  async function publishClick() {
    const res = await upsert({
      translations,
      editor: contentEditor,
      title,
      id,
      author: selectedSportstack,
      showLoaders: false,
    });
    if (res.success) {
      const res2 = await publish({
        translations,
        id,
        status: "publish",
        sportstack: selectedSportstack,
      });
      $modalStore.show = false;
      if (res2.success) {
        status = "published";
        article.status = status;
      }
    }
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
<div class="edit-article-wrapper">
  <Container hFull={false} clazz={viewportType === "desktop" ? "sticky" : ""}>
    <div class="header {viewportType}">
      <div on:click={back}>
        {#if viewportType === "mobile"}
          <XClose />
        {:else}
          <BackButton custom_handler={true} />
        {/if}
      </div>
      {#if viewportType === "desktop"}
        <DropDownInput
          {options}
          value={selectedSportstack}
          on:change={selectSportstack}
        />
      {/if}

      <div class="actions">
        <Button
          type="tertiary"
          destructive={true}
          on:click={() => showModal("delete")}
          >{translations?.delete || "Delete Article"}</Button
        >
        {#if status === "published"}
          <Button type="terlary-gray" on:click={() => showModal("unpublish")}
            >{translations?.unpublish || "Unpublish"}</Button
          >
        {:else}
          <Button type="terlary-gray" on:click={save}
            >{translations?.save || "Save"}</Button
          >
        {/if}
        {#if viewportType === "desktop"}
          <Button
            type="primary"
            disabled={!title ||
              contentEditor?.getText().trim().split(/\s+/).length < 50}
            on:click={() => {
              $modalStore.component = PublishModal;
              $modalStore.modal = true;
              $modalStore.show = true;
              $modalStore.props = { cb: publishClick, translations };
            }}
          >
            {#if status === "published"}
              {translations?.update_publish || "Update & Publish"}
            {:else}
              {translations?.publish || "Publish"}
            {/if}
          </Button>
        {/if}
      </div>
    </div>
  </Container>
  <Editor
    {translations}
    {data}
    bind:contentEditor
    {uploadUrl}
    bind:title
    {content}
    {publishClick}
  />
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
  .edit-article-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    height: calc(var(--vh, 1vh) * 100);
    max-height: calc(var(--vh, 1vh) * 100);
    background-color: var(--colors-background-bg-main);
    overflow: hidden;
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: inherit;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--colors-background-bg-quaternary);
      border-radius: 4px;
    }
    :global(.sticky) {
      position: sticky !important;
      top: 0;
      z-index: 10001;
      background-color: var(--colors-background-bg-main);
    }
    .header {
      display: flex;
      height: 64px;
      align-items: center;
      gap: 20px;
      width: 100%;
      flex-shrink: 0;
      z-index: 1;
      align-self: stretch;
      justify-content: space-between;

      :global(.field) {
        flex-grow: 1;
        align-items: center;
        justify-content: center;
      }
      .actions {
        display: flex;

        justify-content: space-between;
        gap: var(--spacing-lg, 12px);
      }
      &.tablet {
        :global(.field .input-wrapper) {
          width: 100%;
          max-width: 343px;
          margin: 0 auto;
        }
      }

      &.desktop {
        gap: var(--spacing-3xl, 24px);
        margin-top: var(--spacing-2xl, 20px);
        padding-block: var(--spacing-2xl, 20px);
        height: 84px;
        :global(.field) {
          max-width: 343px;
        }

        .actions {
          flex-grow: 1;
          justify-content: flex-end;
          gap: var(--spacing-lg, 12px);
        }
      }
    }
    .editor-wrapper {
      flex-grow: 1; // Эта часть будет прокручиваться
    }
  }
</style>
