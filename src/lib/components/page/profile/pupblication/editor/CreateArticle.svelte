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
  import session from "$lib/store/session.js";
  import { create_article_store } from "./create_article.store.js";
  import { publish, upsert } from "./helpers.js";
  import { Editor as IEditor } from "@tiptap/core";
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import Editor from "./Editor.svelte";
  import PublishModal from "./PublishModal.svelte";
  import type {
    AuthorsAuthorsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/article/create/[lang=lang]/$types.js";
  import userSettings from "$lib/store/user-settings.js";

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

  const debounceSave = debounce(save, 500);

  let options: (AuthorsAuthorsMain & { label: string })[] = [];
  let selectedSportstack;
  let contentEditor: IEditor;
  let debounceTimer;
  let disablePublishButton = true;
  let title = "";
  let isSaving = false;
  let isSaved = false;

  $: ({ article } = data);
  $: id = article.id;
  $: translations = (data as any).RESPONSE_PROFILE_DATA
    .sportstack2 as TranslationSportstacksSectionDataJSONSchema;

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

  $: init(article);

  $: if (
    $create_article_store.tags.length ||
    $create_article_store.seo.title ||
    $create_article_store.seo.description
  ) {
    save();
  }

  $: if (data.sportstack instanceof Promise) {
    console.log("data.sportstack is a promise");
  } else {
    setOptions(data);
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

  function init(article: PageData["article"]) {
    create_article_store.set({
      tags: article.tags as string[],
      seo: {
        title: article.seo_details?.main_data.title || "",
        description: article.seo_details?.main_data.description || "",
      },
      view: "preview",
      detectedLang: {
        lang: article.lang || "en",
        iso: article.seo_details?.opengraph.locale || "en_US"
      }
    });
    title = article.data?.title || "";
    disablePublishButton =
      !title || (article.data?.content || "").trim().split(/\s+/).length < 50;
  }

  function back() {
    history.back();
  }

  function setOptions(data: PageData) {
    if (!data.sportstack?.length) {
      goto(`/u/author/create/${userSettings.extractAll().lang}`, {replaceState: true})
      return
    }
    options = data.sportstacks?.map((s) => {
      const sportstack = { ...s, label: s.data?.username || "" };
      if (sportstack.permalink === $page.url.searchParams.get("sportstack")) {
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

  function selectSportstack(e) {
    const url = $page.url;
    const { permalink } = e.detail as AuthorsAuthorsMain;
    selectedSportstack = e.detail as AuthorsAuthorsMain;
    url.searchParams.set("sportstack", permalink);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  function saveOnChange(e) {
    title = e.detail.title;
    if (title && contentEditor?.getText().trim().split(/\s+/).length > 50) {
      disablePublishButton = false;
    }
    debounceSave(e);
  }

  function debounce(func, wait) {
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function showPublishModal() {
    $modalStore.component = PublishModal;
    $modalStore.modal = true;
    $modalStore.show = true;
    if (!$create_article_store.seo.title) {
      $create_article_store.seo.title = title;
    }
    if (!$create_article_store.seo.description) {
      $create_article_store.seo.description = getFirstParagraph();
    }
    $modalStore.props = { cb: publishClick, translations };
  }

  function getFirstParagraph() {
    const json = contentEditor.getJSON();
    if (!json) return "";
    for (const node of json.content || []) {
      if (node.type === "paragraph" && node.content) {
        return (node.content || []).map((n) => n.text).join(" ");
      }
    }
    return "";
  }

  async function updateArticle() {
    return upsert({
      editor: contentEditor,
      title,
      id,
      author: selectedSportstack,
      reload: false,
      showLoaders: false,
      translations,
    });
  }

  async function publishClick() {
    const res = await updateArticle();
    if (res.success && res.id) {
      publish({
        id: res.id,
        status: "publish",
        sportstack: selectedSportstack,
        translations,
      });
      $modalStore.show = false;
    }
  }

  async function save() {
    if (!contentEditor || !selectedSportstack) return;
    isSaving = true;
    isSaved = false;
    const res = await updateArticle();
    isSaving = false;
    if (res.success) {
      isSaved = true;
    }
    if (res.id && !$page.url.searchParams.get("draft")) {
      id = res.id;
      const url = $page.url;
      url.searchParams.set("draft", res.id);
      goto(url, { replaceState: true, noScroll: true, keepFocus: true });
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
<div class="create-article-wrapper {viewportType}">
  <Container hFull={false} clazz={viewportType === "desktop" ? "sticky" : ""}>
    <div class="header {viewportType}">
      <div on:click={back}>
        {#if viewportType === "mobile"}
          <XClose />
        {:else}
          <BackButton custom_handler={true} />
        {/if}
      </div>

      <DropDownInput
        {options}
        class= {isSaving || isSaved ? "fixed-width" : ""}
        value={selectedSportstack}
        on:change={selectSportstack}
      />
      <div class="actions">
        {#if isSaving || isSaved}
          <div class="saving-state">
            <div class="circle" class:success={isSaved} />
            <span
              >{isSaving
                ? translations?.saving || "Saving"
                : translations?.draft_save || "Draft Saved"}</span
            >
            {#if isSaving}
              <span class="dot">.</span><span class="dot">.</span><span
                class="dot">.</span
              >
            {/if}
          </div>
        {/if}
        {#if viewportType === "desktop"}
          <Button
            type="primary"
            disabled={disablePublishButton}
            on:click={showPublishModal}
            >{translations?.publish || "Publish"}</Button
          >
        {/if}
      </div>
    </div>
  </Container>
  <Editor
    {uploadUrl}
    {translations}
    content={article.data?.content}
    {title}
    on:update={saveOnChange}
    {publishClick}
    {data}
    bind:contentEditor
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
  .create-article-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    height: 100vh;
    overflow: auto;
    height: calc(var(--vh, 1vh) * 100);
    transition: height 0.25s ease-out;
    max-height: calc(var(--vh, 1vh) * 100);
    min-height: calc(var(--vh, 1vh) * 100);
    overflow: hidden;
    background-color: var(--colors-background-bg-primary);
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
      background-color: var(--colors-background-bg-primary);
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

      :global(.field) {
        flex-grow: 1;
        align-items: center;
        justify-content: center;
      }
      :global(.field.fixed-width) {
        max-width: 50%;
        width: 100%;
      }

      .saving-state {
        display: flex;
        gap: 6px;
        align-items: center;

        .circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #8c8c8c;
          transition: 0.3s;
          &.success {
            background-color: #47cd89;
          }
        }

        span {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-align: right;

          /* Text md/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }

        .dot {
          animation: blink 1.4s infinite both;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
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
          display: flex;
          justify-content: flex-end;
          align-items: center;
          :global(.button) {
            margin-left: var(--spacing-6xl, 48px);
          }
        }
      }
    }
    .editor-wrapper {
      flex-grow: 1;
    }
    &.desktop {
      max-height: unset;
      height: 100vh;
      overflow: auto;
    }
  }
</style>
